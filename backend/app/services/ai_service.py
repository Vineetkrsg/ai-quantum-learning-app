from abc import ABC, abstractmethod
from backend.app.models.tutor import TutorRequestModel, TutorResponseModel

class AITutorService(ABC):
    """
    Abstract interface for AI Quantum Tutor service.
    Designed for zero-friction swap with Google Gemini API (@google-genai / google-genai SDK).
    """
    @abstractmethod
    async def generate_guidance(self, request: TutorRequestModel) -> TutorResponseModel:
        pass

class MockGeminiTutorService(AITutorService):
    """
    Mock AI Tutor provider generating pedagogical responses based on circuit & lesson context.
    """
    async def generate_guidance(self, request: TutorRequestModel) -> TutorResponseModel:
        query = request.message.lower()
        context_str = ""
        if request.circuitContext:
            context_str = f"Analyzing your {request.circuitContext.numberOfQubits}-qubit circuit ({request.circuitContext.gateCount} gates)... "
            
        if "bell" in query or "entangle" in query:
            reply = (
                f"{context_str}A Bell State is the quintessential maximally entangled two-qubit state (|Φ⁺⟩ = (|00⟩ + |11⟩)/√2). "
                "To construct it, place a Hadamard (H) gate on Q0 to create superposition, followed by a CNOT gate with Q0 as control and Q1 as target. "
                "When measured, measuring Q0 instantly dictates the measurement of Q1 with 100% correlation!"
            )
            followups = [
                "How does measurement collapse the Bell state?",
                "What happens if we apply a Z gate to Q0 first?",
                "Can entanglement transmit information faster than light?"
            ]
            concepts = ["Entanglement", "Superposition", "Hadamard Gate", "CNOT Gate"]
        elif "hadamard" in query or "superposition" in query:
            reply = (
                f"{context_str}The Hadamard (H) gate maps standard computational basis states |0⟩ and |1⟩ into equal superpositions: "
                "H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ - |1⟩)/√2. "
                "In geometric terms on the Bloch sphere, it is a 180° rotation around the X+Z diagonal axis."
            )
            followups = [
                "What happens if we apply H twice (H·H)?",
                "How does phase kickback work with Hadamard?",
                "What is the Bloch sphere coordinates of H|0⟩?"
            ]
            concepts = ["Superposition", "Bloch Sphere", "Quantum State Vector"]
        elif "bloch" in query:
            reply = (
                "The Bloch sphere represents a single qubit's state space on a unit 3D sphere. "
                "The north pole corresponds to |0⟩, the south pole to |1⟩, and the equator represents superpositions with different relative phases."
            )
            followups = ["How are Pauli gates related to Bloch sphere rotations?", "Why can't two entangled qubits be shown on one Bloch sphere?"]
            concepts = ["Bloch Sphere", "Relative Phase", "Pure States"]
        else:
            reply = (
                f"{context_str}In quantum computing, quantum algorithms leverage interference, superposition, and entanglement to evaluate solutions concurrently. "
                f"You asked: '{request.message}'. I can help guide your circuit construction, debug unwanted phase shifts, or explain the mathematical formalism."
            )
            followups = [
                "How do I create a Bell state?",
                "Explain the difference between superposition and classical probability.",
                "How do I read measurement probability histograms?"
            ]
            concepts = ["Quantum Circuits", "Quantum Gates", "State Vector"]
            
        return TutorResponseModel(
            reply=reply,
            suggestedFollowups=followups,
            referencedConcepts=concepts
        )

ai_tutor_service: AITutorService = MockGeminiTutorService()
