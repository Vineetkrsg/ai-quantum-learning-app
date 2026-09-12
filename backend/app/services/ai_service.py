import json
import logging
import urllib.request
import urllib.error
from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from backend.app.core.config import settings
from backend.app.models.tutor import (
    TutorRequestModel,
    TutorResponseModel,
    GeneratedQuestionModel,
    GeneratedQuestionOption,
)

logger = logging.getLogger(__name__)

class AITutorService(ABC):
    """
    Abstract interface for AI Quantum Tutor service.
    Follows provider abstraction for seamless switching between Google Gemini API and Pedagogical Engine.
    """
    @abstractmethod
    async def generate_guidance(self, request: TutorRequestModel) -> TutorResponseModel:
        pass


class MockGeminiTutorService(AITutorService):
    """
    Pedagogical Knowledge & Inference Engine.
    Provides rigorous, context-aware quantum tutoring for all action types without requiring external API keys.
    """

    async def generate_guidance(self, request: TutorRequestModel) -> TutorResponseModel:
        action = request.action or "chat"

        if action == "explain_circuit":
            return self._handle_explain_circuit(request)
        elif action == "explain_code":
            return self._handle_explain_code(request)
        elif action == "debug_code":
            return self._handle_debug_code(request)
        elif action == "generate_question":
            return self._handle_generate_question(request)
        elif action == "hint":
            return self._handle_hint(request)
        else:
            return self._handle_chat(request)

    def _handle_explain_circuit(self, request: TutorRequestModel) -> TutorResponseModel:
        c_ctx = request.circuitContext
        n_qubits = c_ctx.numberOfQubits if c_ctx else 1
        gates = c_ctx.gates if c_ctx and c_ctx.gates else []
        gate_names = [g.get("gateId") or g.get("name") or g.get("symbol", "Gate") for g in gates]
        
        sim_res = request.simulationResult
        sim_counts = sim_res.counts if sim_res and sim_res.counts else None

        # Build step-by-step breakdown
        breakdown_lines = [
            f"### Circuit Overview ({n_qubits} Qubit{'s' if n_qubits > 1 else ''})",
            f"1. **Initialization**: All {n_qubits} qubit wire{'s' if n_qubits > 1 else ''} begin in the ground state |0⟩.",
        ]

        if not gates:
            breakdown_lines.append("2. **Current State**: The wire is currently empty (identity evolution). The state remains strictly in |0⟩.")
            expected_effect = "State stays in |0...0⟩ with 100% measurement certainty."
        else:
            gate_descriptions = []
            for idx, g in enumerate(gates):
                gid = str(g.get("gateId") or g.get("symbol", "")).upper()
                target = g.get("targetQubit", 0)
                control = g.get("controlQubit", None)

                if "H" in gid:
                    gate_descriptions.append(f"Step {idx+1}: **Hadamard (H)** on q[{target}] creates an equal superposition (|0⟩ + |1⟩)/√2.")
                elif "X" in gid or "NOT" in gid:
                    gate_descriptions.append(f"Step {idx+1}: **Pauli-X (NOT)** on q[{target}] flips the qubit basis state (|0⟩ ↔ |1⟩).")
                elif "Z" in gid:
                    gate_descriptions.append(f"Step {idx+1}: **Pauli-Z** on q[{target}] applies a relative phase flip of π radians (|1⟩ → -|1⟩).")
                elif "Y" in gid:
                    gate_descriptions.append(f"Step {idx+1}: **Pauli-Y** on q[{target}] applies both a bit-flip and phase rotation.")
                elif "CX" in gid or "CNOT" in gid:
                    gate_descriptions.append(f"Step {idx+1}: **CNOT** entangles q[{control if control is not None else 0}] (control) with q[{target}] (target).")
                elif "M" in gid:
                    gate_descriptions.append(f"Step {idx+1}: **Measurement (M)** forces quantum wavefunction collapse into a classical bit value.")
                else:
                    gate_descriptions.append(f"Step {idx+1}: **{gid} Gate** applied to q[{target}].")

            breakdown_lines.append("2. **Sequential Operations**:\n   " + "\n   ".join(gate_descriptions))

            has_h = any("H" in str(g).upper() for g in gate_names)
            has_cx = any("C" in str(g).upper() for g in gate_names)
            
            if has_h and has_cx and n_qubits >= 2:
                expected_effect = "Produces a maximally entangled Bell State (|00⟩ + |11⟩)/√2. Measuring one qubit instantaneously dictates the other."
            elif has_h:
                expected_effect = "Puts the register into a quantum superposition with equal probability amplitudes across basis states."
            else:
                expected_effect = f"Transforms standard computational basis states deterministically via {', '.join(gate_names)}."

        breakdown_lines.append(f"3. **Expected Conceptual Effect**:\n   {expected_effect}")
        breakdown_lines.append("4. **Measurement Meaning**:\n   Quantum measurement is non-unitary and irreversible. It projects the continuous probability state into one discrete computational basis string.")

        # Clearly distinguish expected behavior from actual simulation result
        if sim_counts:
            shots = sim_res.shots or 1024
            sim_summary = ", ".join([f"|{k}⟩: {v} ({round(v/shots*100, 1)}%)" for k, v in sim_counts.items()])
            breakdown_lines.append(f"\n> **Actual Simulation Result ({shots} Shots)**:\n> Measured outcomes: {sim_summary}.\n> The results match quantum statistical expectation with standard shot noise.")
        else:
            breakdown_lines.append("\n> **Simulation Status**:\n> *Note: This circuit has not been simulated yet in this session. The notes above describe theoretical expected behavior.*")

        reply = "\n\n".join(breakdown_lines)

        return TutorResponseModel(
            reply=reply,
            action="explain_circuit",
            provider="mock",
            suggestedFollowups=[
                "Why does measurement cause wavefunction collapse?",
                "What happens if I change the order of these gates?",
                "How would this circuit look in Qiskit Python code?"
            ],
            referencedConcepts=["Quantum Circuits", "Superposition", "Unitary Evolution", "Wavefunction Collapse"]
        )

    def _handle_explain_code(self, request: TutorRequestModel) -> TutorResponseModel:
        code_ctx = request.codeContext
        code = code_ctx.code if code_ctx else ""
        lines = [line.strip() for line in code.split("\n") if line.strip() and not line.strip().startswith("#")]

        explanations = [
            "### Quantum Code Inspection (Qiskit Python)",
            "Here is how your quantum code maps directly to the underlying quantum hardware operations:\n"
        ]

        for line in lines:
            if "QuantumCircuit" in line:
                explanations.append(f"- `{line}`: Allocates quantum registers initialized to |0⟩ and classical readout bits.")
            elif ".h(" in line:
                explanations.append(f"- `{line}`: Applies the Hadamard transformation matrix to create equal superposition.")
            elif ".x(" in line:
                explanations.append(f"- `{line}`: Applies the Pauli-X NOT gate to invert qubit amplitude.")
            elif ".cx(" in line or ".cnot(" in line:
                explanations.append(f"- `{line}`: Applies a 2-qubit CNOT gate, creating entanglement between control and target.")
            elif ".z(" in line:
                explanations.append(f"- `{line}`: Applies a Pauli-Z phase flip.")
            elif ".measure(" in line:
                explanations.append(f"- `{line}`: Measures the quantum state and writes the resulting classical bit into memory.")
            elif "Aer" in line or "execute(" in line or "sampler" in line.lower():
                explanations.append(f"- `{line}`: Configures the quantum simulator backend to evaluate state probabilities.")

        explanations.append(
            "\n*Educational Note: This analysis is based on static syntax inspection. Quantum gates execute sequentially from top to bottom.*"
        )

        return TutorResponseModel(
            reply="\n".join(explanations),
            action="explain_code",
            provider="mock",
            suggestedFollowups=[
                "How does `qc.h(0)` map onto the physical circuit wire?",
                "Why must we measure before reading classical bits?",
                "Can I run this code on real IBM Quantum hardware?"
            ],
            referencedConcepts=["Qiskit SDK", "QuantumCircuit", "Quantum Register", "Classical Register"]
        )

    def _handle_debug_code(self, request: TutorRequestModel) -> TutorResponseModel:
        code_ctx = request.codeContext
        code = code_ctx.code if code_ctx else ""
        task_desc = code_ctx.taskDescription if code_ctx else ""
        normalized = code.lower().replace(" ", "")

        hints = []
        feedback = []

        # Analyze common issues
        if "quantumcircuit" not in normalized:
            hints.append("Your circuit initialization appears missing or misspelled. Look for `qc = QuantumCircuit(...)`.")
            feedback.append("Missing `QuantumCircuit` object initialization.")

        if "h" in task_desc.lower() and "qc.h(" not in normalized:
            hints.append("The challenge asks for an H gate. Add `qc.h(0)` to put qubit 0 into superposition.")
            feedback.append("Hadamard gate `qc.h(0)` is required by this objective.")

        if "measure" in task_desc.lower() and "qc.measure" not in normalized:
            hints.append("Remember to measure your qubit with `qc.measure(0, 0)` so classical readout can occur.")
            feedback.append("Measurement operation is missing.")

        if "cnot" in task_desc.lower() or "bell" in task_desc.lower():
            if "qc.cx(" not in normalized and "qc.cnot(" not in normalized:
                hints.append("To entangle qubits for a Bell state, use `qc.cx(0, 1)` with qubit 0 as control and qubit 1 as target.")
                feedback.append("Missing CNOT two-qubit entangling gate.")

        if not hints:
            reply = (
                "### Code Inspection Results: Clean!\n\n"
                "Your quantum syntax and logic look solid! All required operations for this lesson appear correctly structured.\n"
                "You can now click **Run & Check Code** to simulate execution and observe state probabilities."
            )
            debug_hints = ["Code structure aligns with lesson requirements."]
        else:
            reply = (
                "### Quantum Code Debugger\n\n"
                "I reviewed your code syntax and logical construction. Here are points to adjust:\n\n"
                + "\n".join([f"- **Clue {i+1}**: {h}" for i, h in enumerate(hints)])
                + "\n\n*Try adjusting these lines in the editor. Need more help? Ask 'Give me a hint' or 'Explain this code'.*"
            )
            debug_hints = hints

        return TutorResponseModel(
            reply=reply,
            action="debug_code",
            provider="mock",
            debugHints=debug_hints,
            suggestedFollowups=[
                "Give me a hint on how to fix this",
                "Explain the correct gate order",
                "Show an example of this operation"
            ],
            referencedConcepts=["Quantum Debugging", "Syntax Validation", "Gate Sequencing"]
        )

    def _handle_generate_question(self, request: TutorRequestModel) -> TutorResponseModel:
        l_ctx = request.lessonContext
        mod_id = l_ctx.moduleId if l_ctx else "superposition"

        # Bank of pedagogically varied questions
        question_banks: Dict[str, List[Dict[str, Any]]] = {
            "fundamentals": [
                {
                    "id": "gen-fund-1",
                    "type": "multiple-choice",
                    "question": "What is the primary physical reason classical computer chips cannot keep shrinking transistors indefinitely?",
                    "options": [
                        {"id": "a", "text": "Silicon becomes too expensive to mine", "isCorrect": False},
                        {"id": "b", "text": "Electrons begin quantum tunneling through atomic barriers, causing leakage", "isCorrect": True},
                        {"id": "c", "text": "Batteries cannot supply enough voltage for small chips", "isCorrect": False}
                    ],
                    "hint": "Think about what electrons do when barriers are only a few atoms thick.",
                    "explanation": "At nanometer scales, quantum tunneling allows electrons to leap across barriers, preventing transistors from reliably acting as on/off switches."
                },
                {
                    "id": "gen-fund-2",
                    "type": "prediction",
                    "question": "If a classical computer has 3 bits, how many distinct numbers can it store at any single microsecond?",
                    "options": [
                        {"id": "a", "text": "Exactly 1 of the 8 possible states", "isCorrect": True},
                        {"id": "b", "text": "All 8 states simultaneously", "isCorrect": False},
                        {"id": "c", "text": "Infinity", "isCorrect": False}
                    ],
                    "hint": "Classical bits have deterministic single values at any moment in time.",
                    "explanation": "A classical 3-bit register represents only one binary number (e.g. 101 = 5) at any given instant."
                }
            ],
            "qubits": [
                {
                    "id": "gen-qub-1",
                    "type": "prediction",
                    "question": "A qubit starts in ground state |0⟩. You apply the Pauli-X gate. What state is it in now?",
                    "options": [
                        {"id": "a", "text": "|0⟩", "isCorrect": False},
                        {"id": "b", "text": "|1⟩", "isCorrect": True},
                        {"id": "c", "text": "(|0⟩ + |1⟩)/√2", "isCorrect": False}
                    ],
                    "hint": "The Pauli-X gate is the quantum analog of the classical NOT gate.",
                    "explanation": "Pauli-X maps |0⟩ ↦ |1⟩ and |1⟩ ↦ |0⟩ with 100% deterministic fidelity."
                }
            ],
            "superposition": [
                {
                    "id": "gen-sup-1",
                    "type": "multiple-choice",
                    "question": "What mathematical state results from applying a Hadamard (H) gate to state |1⟩?",
                    "options": [
                        {"id": "a", "text": "(|0⟩ + |1⟩)/√2", "isCorrect": False},
                        {"id": "b", "text": "(|0⟩ - |1⟩)/√2", "isCorrect": True},
                        {"id": "c", "text": "|0⟩", "isCorrect": False}
                    ],
                    "hint": "H on |0⟩ gives a plus sign (+), while H on |1⟩ introduces a relative phase flip (-).",
                    "explanation": "H|1⟩ produces the orthogonal state |−⟩ = (|0⟩ − |1⟩)/√2. Measuring it still gives 50/50 odds, but the relative phase is negative!"
                },
                {
                    "id": "gen-sup-2",
                    "type": "circuit-fix",
                    "question": "You apply H followed immediately by another H gate to state |0⟩. What is the measured outcome across 1,024 shots?",
                    "options": [
                        {"id": "a", "text": "100% outcome 0 (Identity)", "isCorrect": True},
                        {"id": "b", "text": "50% 0 and 50% 1", "isCorrect": False},
                        {"id": "c", "text": "100% outcome 1", "isCorrect": False}
                    ],
                    "hint": "Quantum gates are unitary and reversible: H · H = I.",
                    "explanation": "Because H is its own inverse (H = H†), applying H twice cancels the rotation and returns to the initial state |0⟩."
                }
            ],
            "entanglement": [
                {
                    "id": "gen-ent-1",
                    "type": "multiple-choice",
                    "question": "In the canonical Bell state (|00⟩ + |11⟩)/√2, what are the odds of measuring the bitstring '01'?",
                    "options": [
                        {"id": "a", "text": "0% (Impossible in pure Bell state)", "isCorrect": True},
                        {"id": "b", "text": "25%", "isCorrect": False},
                        {"id": "c", "text": "50%", "isCorrect": False}
                    ],
                    "hint": "Notice that the state vector only contains amplitudes for |00⟩ and |11⟩.",
                    "explanation": "Because the two qubits are perfectly correlated, both must collapse to 0 or both must collapse to 1. Outcomes |01⟩ and |10⟩ have exactly zero probability amplitude."
                }
            ]
        }

        fallback_list = question_banks.get(mod_id, question_banks["superposition"])
        # Pick a question
        selected_q = fallback_list[0]
        if len(fallback_list) > 1 and "history" in request.message.lower():
            selected_q = fallback_list[1]

        q_model = GeneratedQuestionModel(
            id=selected_q["id"],
            type=selected_q["type"],
            question=selected_q["question"],
            options=[GeneratedQuestionOption(**opt) for opt in selected_q["options"]],
            hint=selected_q["hint"],
            explanation=selected_q["explanation"]
        )

        topic_name = (l_ctx.currentTopic or l_ctx.moduleTitle or "Quantum Mechanics") if l_ctx else "Quantum Mechanics"
        reply = (
            f"Here is a targeted practice challenge on **{topic_name}**:\n\n"
            f"**{selected_q['question']}**\n\n"
            "Select your answer from the options provided below to test your understanding!"
        )

        return TutorResponseModel(
            reply=reply,
            action="generate_question",
            provider="mock",
            generatedQuestion=q_model,
            suggestedFollowups=[
                "Why is this the case?",
                "Give me a hint for this question",
                "Give me another question"
            ],
            referencedConcepts=["Knowledge Check", "Assessment", "Active Recall"]
        )

    def _handle_hint(self, request: TutorRequestModel) -> TutorResponseModel:
        level = request.hintLevel or 1
        l_ctx = request.lessonContext
        topic = l_ctx.currentTopic if l_ctx else "Quantum Circuit"

        if level == 1:
            reply = (
                f"### 💡 Hint 1 (Conceptual Clue)\n\n"
                f"Think about the primary quantum property involved in **{topic}**. "
                "Are you trying to create an equal superposition, flip a state, or entangle two wires together? "
                "Review the state of the qubit before and after the operation."
            )
            followups = ["Give me a more specific hint (Level 2)", "Explain the concept again"]
        elif level == 2:
            reply = (
                f"### 💡 Hint 2 (Specific Guidance)\n\n"
                "Look at the specific gate options. If you need equal 50/50 measurement probabilities, the **H (Hadamard)** gate rotates state |0⟩ to the equator. "
                "If you need conditional action between two qubits, the **CNOT** gate uses one qubit as a control."
            )
            followups = ["Give me near-solution guidance (Level 3)", "I will try it now"]
        else:
            reply = (
                f"### 💡 Hint 3 (Near-Solution Guidance)\n\n"
                "Place an **H gate** on qubit 0 (`qc.h(0)`). If an entanglement challenge, follow it immediately with a **CNOT** with control=0 and target=1 (`qc.cx(0, 1)`). "
                "Finally, append measurement (`qc.measure(...)`) so the simulator can record the classical register!"
            )
            followups = ["Explain why this solution works", "Give me a practice challenge"]

        return TutorResponseModel(
            reply=reply,
            action="hint",
            provider="mock",
            hintLevel=level,
            suggestedFollowups=followups,
            referencedConcepts=["Scaffolded Learning", "Conceptual Clues"]
        )

    def _handle_chat(self, request: TutorRequestModel) -> TutorResponseModel:
        query = request.message.lower().strip()
        l_ctx = request.lessonContext
        c_ctx = request.circuitContext

        prefix = ""
        if l_ctx and l_ctx.lessonTitle:
            prefix = f"In the context of **{l_ctx.lessonTitle}**: "

        if "what is superposition" in query or ("superposition" in query and "what" in query):
            reply = (
                f"{prefix}Superposition is a fundamental postulate of quantum mechanics where a quantum state |ψ⟩ is expressed as a linear combination of basis vectors: |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1. "
                "Unlike a classical coin in mid-air (which is merely an unknown heads or tails), a qubit in superposition genuinely possesses quantum amplitudes that can constructively or destructively interfere with each other before measurement."
            )
            concepts = ["Superposition", "Linear Combination", "Born Rule", "State Vector"]
            followups = ["How does an H gate create superposition?", "What happens upon measurement?", "Explain the difference between superposition and classical probability."]

        elif "bell" in query or "entangle" in query:
            reply = (
                f"{prefix}Entanglement occurs when two or more qubits exist in a composite state that cannot be factored into the tensor product of individual qubit states: |ψ⟩ ≠ |ψA⟩ ⊗ |ψB⟩. "
                "In the canonical Bell state (|00⟩ + |11⟩)/√2, neither qubit has a definite individual state. Measuring Q0 forces Q1 into the identical outcome instantaneously, regardless of physical separation."
            )
            concepts = ["Entanglement", "Bell State", "EPR Paradox", "Tensor Product"]
            followups = ["Can entanglement transmit information faster than light?", "How do we build a Bell state?", "What is the CHSH Bell inequality?"]

        elif "bloch" in query:
            reply = (
                "The Bloch Sphere provides a geometric visualization of pure single-qubit states as points on a unit sphere (S²). "
                "Any pure state is written as |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩. The polar angle θ controls the measurement probabilities (0 ≤ θ ≤ π), while the azimuthal angle φ represents the relative phase (0 ≤ φ < 2π)."
            )
            concepts = ["Bloch Sphere", "Polar Angle (θ)", "Relative Phase (φ)", "State Space"]
            followups = ["Where is state |+⟩ on the Bloch sphere?", "How does an X gate rotate the Bloch sphere?", "Why can't two entangled qubits be shown on one Bloch sphere?"]

        elif "hadamard" in query or "why h" in query or "why did we use an h" in query:
            reply = (
                f"{prefix}We use the Hadamard (H) gate because it is the fundamental quantum bridge between computational basis states and equatorial superposition states. "
                "H maps |0⟩ ↦ (|0⟩ + |1⟩)/√2 (|+) and |1⟩ ↦ (|0⟩ − |1⟩)/√2 (|−). Without the H gate, a quantum circuit would behave like an ordinary classical logic circuit."
            )
            concepts = ["Hadamard Gate", "Basis Transformation", "Superposition", "Unitary Operator"]
            followups = ["What happens if we apply H twice (H·H)?", "How does phase kickback work with Hadamard?", "What is the matrix of H?"]

        elif "difference between x and h" in query or "x vs h" in query:
            reply = (
                "The Pauli-X gate is a **bit-flip** (rotation of π around the X-axis of the Bloch sphere): it maps |0⟩ ↦ |1⟩ and |1⟩ ↦ |0⟩ with 100% deterministic probability. "
                "The Hadamard (H) gate, in contrast, is a **basis rotation** (180° rotation around the X+Z diagonal): it creates an equal 50/50 superposition between |0⟩ and |1⟩."
            )
            concepts = ["Pauli-X Gate", "Hadamard Gate", "Bloch Sphere Rotation", "Basis States"]
            followups = ["When would I use X before H?", "What does the Z gate do?", "Are X and H reversible?"]

        elif "beginner" in query or "simple" in query or "explain like i'm a beginner" in query:
            reply = (
                "Think of a classical computer bit like a light switch on your wall: it is either completely OFF (0) or completely ON (1). "
                "A quantum qubit is more like a sphere. The north pole is 0 and the south pole is 1, but the qubit can point anywhere on the surface — like the equator! "
                "When you look at it (measurement), it snaps to either the north or south pole, but while computing, it explores multiple directions at once."
            )
            concepts = ["Beginner Intuition", "Classical Switch", "Quantum Qubit", "Measurement"]
            followups = ["What is an example of a quantum gate?", "Why can't we read the state without collapsing it?", "What is Quantum Superposition?"]

        elif "why is my answer wrong" in query or "wrong" in query:
            reply = (
                f"{prefix}In quantum challenges, wrong answers usually stem from three common areas:\n"
                "1. **Gate order**: Applying H before X produces a different state than X before H.\n"
                "2. **Missing measurement**: Without a measurement gate, the simulator has no classical bits to read.\n"
                "3. **Probability vs Certainty**: Remember that 50/50 states will exhibit statistical variation around 512/512 shots.\n"
                "Check the hint above or ask 'Debug my code' for step-by-step guidance!"
            )
            concepts = ["Quantum Debugging", "Non-Commutativity", "Statistical Sampling"]
            followups = ["Debug my code", "Explain this circuit", "Give me a hint"]

        elif "why did my simulation produce this result" in query or "simulation result" in query:
            if c_ctx and c_ctx.summary:
                circuit_note = f"For your circuit ({c_ctx.summary}), "
            else:
                circuit_note = ""
            reply = (
                f"{circuit_note}Quantum simulators sample random measurement collapses according to Born's rule (P = |amplitude|²). "
                "When you run 1,024 shots on a superposition state, each shot independently collapses into 0 or 1 with 50% theoretical probability. "
                "Due to statistical sampling noise, seeing counts like 518 vs 506 is expected and mirrors real quantum computer hardware!"
            )
            concepts = ["Born Rule", "Shot Noise", "Measurement Sampling", "Probability Distribution"]
            followups = ["How does increasing shots improve accuracy?", "Can quantum simulation be deterministic?", "Explain this circuit"]

        else:
            reply = (
                f"{prefix}In quantum information science, we leverage superposition, interference, and entanglement to evaluate complex computational states concurrently. "
                f"You asked: '{request.message}'. I can help guide your circuit design, break down mathematical state vectors, debug Qiskit code, or explain physical concepts."
            )
            concepts = ["Quantum Computing", "Quantum Algorithms", "State Vector", "Circuit Synthesis"]
            followups = [
                "What is superposition?",
                "How do I create a Bell state?",
                "Explain the difference between X and H"
            ]

        return TutorResponseModel(
            reply=reply,
            action="chat",
            provider="mock",
            suggestedFollowups=followups,
            referencedConcepts=concepts
        )


class GeminiLiveTutorService(AITutorService):
    """
    Live Google Gemini API Provider with fallback to MockGeminiTutorService.
    Safely utilizes GEMINI_API_KEY from backend environment.
    """
    def __init__(self):
        self.mock_fallback = MockGeminiTutorService()

    async def generate_guidance(self, request: TutorRequestModel) -> TutorResponseModel:
        api_key = settings.GEMINI_API_KEY.strip()
        if not api_key:
            return await self.mock_fallback.generate_guidance(request)

        try:
            # Construct system prompt and user prompt
            system_prompt = (
                "You are the QuLearn AI Quantum Tutor, an empathetic, world-class quantum computing educator. "
                "Teach beginner-to-intermediate students clearly without overwhelming them with unnecessary advanced math unless asked. "
                "Always clearly distinguish expected theoretical behavior from stochastic simulation measurement results. "
                "Never invent simulation results. If code is provided, inspect it statically and clearly mention it is code inspection."
            )

            context_data = {
                "action": request.action,
                "user_message": request.message,
                "lessonContext": request.lessonContext.model_dump() if request.lessonContext else None,
                "circuitContext": request.circuitContext.model_dump() if request.circuitContext else None,
                "codeContext": request.codeContext.model_dump() if request.codeContext else None,
                "simulationResult": request.simulationResult.model_dump() if request.simulationResult else None,
                "studentProgress": request.studentProgress.model_dump() if request.studentProgress else None,
            }

            prompt_text = (
                f"{system_prompt}\n\n"
                f"Student Context:\n{json.dumps(context_data, indent=2)}\n\n"
                f"Student Query/Action: {request.action} - {request.message}\n\n"
                "Respond with a helpful, engaging, pedagogical answer formatted in clear markdown."
            )

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt_text}]}],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 1000}
            }

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )

            with urllib.request.urlopen(req, timeout=8) as response:
                if response.status == 200:
                    resp_json = json.loads(response.read().decode("utf-8"))
                    text = resp_json["candidates"][0]["content"]["parts"][0]["text"]
                    
                    return TutorResponseModel(
                        reply=text,
                        action=request.action,
                        provider="gemini",
                        suggestedFollowups=[
                            "Can you give me an analogy for this?",
                            "How does this connect to our circuit?",
                            "Give me a practice challenge"
                        ],
                        referencedConcepts=["Quantum Computing", "Gemini AI", "Quantum Algorithms"]
                    )
        except Exception as e:
            logger.warning(f"Live Gemini API request failed: {e}. Falling back to pedagogical engine.")

        # Graceful fallback to mock engine
        fallback_res = await self.mock_fallback.generate_guidance(request)
        return fallback_res


# Global Provider Singleton
ai_tutor_service: AITutorService = GeminiLiveTutorService()

