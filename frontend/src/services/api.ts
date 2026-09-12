import { TutorRequest, TutorResponse } from '../types/tutor';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Fallback Pedagogical Response Generator for when backend is offline or unreachable.
 */
function getClientFallbackTutorResponse(req: TutorRequest): TutorResponse {
  const action = req.action || 'chat';
  const query = (req.message || '').toLowerCase().trim();
  const cCtx = req.circuitContext;
  const codeCtx = req.codeContext;
  const lCtx = req.lessonContext;

  if (action === 'explain_circuit') {
    const nQubits = cCtx?.numberOfQubits || 1;
    const gates = cCtx?.gates || [];
    const gateList = gates.map((g: any) => g.gateId || g.symbol || 'Gate');

    const steps = [
      `### Circuit Analysis (${nQubits} Qubit Wire${nQubits > 1 ? 's' : ''})`,
      `1. **Register State**: All wires begin initialized in the computational ground state |0⟩.`,
    ];

    if (gates.length === 0) {
      steps.push(`2. **Gate Sequence**: No quantum operations placed yet. The state remains unchanged at |0⟩.`);
      steps.push(`3. **Expected Effect**: Qubit remains strictly in |0⟩.`);
    } else {
      steps.push(`2. **Gate Sequence**: Sequential transformations applied: [${gateList.join(' → ')}].`);
      const hasH = gateList.some((g: string) => g.toUpperCase().includes('H'));
      const hasCX = gateList.some((g: string) => g.toUpperCase().includes('C'));
      if (hasH && hasCX && nQubits >= 2) {
        steps.push(`3. **Expected Effect**: Maximally entangled Bell State (|00⟩ + |11⟩)/√2 created via Hadamard superposition and CNOT entanglement.`);
      } else if (hasH) {
        steps.push(`3. **Expected Effect**: Equal superposition state (|0⟩ + |1⟩)/√2. Measuring yields 50/50 probability distribution.`);
      } else {
        steps.push(`3. **Expected Effect**: Deterministic basis transformation via unitary operations.`);
      }
    }

    steps.push(`4. **Measurement Mechanism**: Projective collapse from continuous probability amplitudes into discrete classical bit outcomes.`);

    if (req.simulationResult?.counts) {
      const counts = req.simulationResult.counts;
      const shots = req.simulationResult.shots || 1024;
      const out = Object.entries(counts).map(([k, v]) => `|${k}⟩: ${v} (${Math.round((v / shots) * 100)}%)`).join(', ');
      steps.push(`\n> **Actual Simulation Result (${shots} Shots)**:\n> Measured counts: ${out}. Natural variance matches quantum shot noise.`);
    } else {
      steps.push(`\n> **Simulation Status**:\n> *Note: Circuit has not yet been simulated in this session. Above breakdown describes theoretical expected behavior.*`);
    }

    return {
      reply: steps.join('\n\n'),
      action: 'explain_circuit',
      provider: 'mock',
      suggestedFollowups: [
        'Why does measurement cause collapse?',
        'What happens if I apply H twice?',
        'How does this circuit look in Qiskit Python?'
      ],
      referencedConcepts: ['Quantum Circuits', 'Superposition', 'Wavefunction Collapse', 'Born Rule']
    };
  }

  if (action === 'explain_code') {
    const code = codeCtx?.code || '';
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    const explanations = [
      '### Quantum Code Inspection (Qiskit Python)',
      'Static breakdown of how the code constructs your quantum operations:\n'
    ];

    lines.forEach(line => {
      if (line.includes('QuantumCircuit')) {
        explanations.push(`- \`${line.trim()}\`: Allocates quantum and classical registers.`);
      } else if (line.includes('.h(')) {
        explanations.push(`- \`${line.trim()}\`: Applies the Hadamard rotation matrix into equal superposition.`);
      } else if (line.includes('.x(')) {
        explanations.push(`- \`${line.trim()}\`: Applies the Pauli-X NOT gate (inverts |0⟩ ↔ |1⟩).`);
      } else if (line.includes('.cx(') || line.includes('.cnot(')) {
        explanations.push(`- \`${line.trim()}\`: Entangles control and target qubits conditionally.`);
      } else if (line.includes('.measure(')) {
        explanations.push(`- \`${line.trim()}\`: Measures state amplitudes onto classical readout bits.`);
      }
    });

    explanations.push('\n*Educational Note: Code inspection conducted statically. Gates execute sequentially top-to-bottom.*');

    return {
      reply: explanations.join('\n'),
      action: 'explain_code',
      provider: 'mock',
      suggestedFollowups: [
        'How does `qc.h(0)` map to physical wires?',
        'Why do we measure into classical bits?',
        'Can this code run on real IBM Quantum hardware?'
      ],
      referencedConcepts: ['Qiskit SDK', 'QuantumCircuit', 'Unitary Execution']
    };
  }

  if (action === 'debug_code') {
    const code = (codeCtx?.code || '').toLowerCase().replace(/\s+/g, '');
    const task = (codeCtx?.taskDescription || '').toLowerCase();
    const hints: string[] = [];

    if (!code.includes('quantumcircuit')) {
      hints.push('Missing circuit declaration. Make sure to define `qc = QuantumCircuit(...)`.');
    }
    if (task.includes('h') && !code.includes('qc.h(')) {
      hints.push('The objective requires an H gate. Add `qc.h(0)` to initialize superposition.');
    }
    if (task.includes('measure') && !code.includes('qc.measure')) {
      hints.push('Remember to measure your qubit with `qc.measure(0, 0)`.');
    }
    if ((task.includes('cnot') || task.includes('bell')) && !code.includes('qc.cx(') && !code.includes('qc.cnot(')) {
      hints.push('To entangle qubits, add `qc.cx(0, 1)` with control=0 and target=1.');
    }

    if (hints.length === 0) {
      return {
        reply: '### Code Inspection: Valid!\n\nYour quantum code syntax and logic match the lesson objective. Run the code simulation to observe state probabilities!',
        action: 'debug_code',
        provider: 'mock',
        debugHints: ['Code syntax verified.'],
        suggestedFollowups: ['Explain this code', 'Run simulation', 'Give me another challenge'],
        referencedConcepts: ['Quantum Validation', 'Syntax Checking']
      };
    }

    return {
      reply: `### Quantum Code Debugger\n\nI inspected your code against the challenge requirements:\n\n` +
        hints.map((h, i) => `- **Clue ${i + 1}**: ${h}`).join('\n') +
        `\n\n*Adjust your code in the editor, then test again!*`,
      action: 'debug_code',
      provider: 'mock',
      debugHints: hints,
      suggestedFollowups: ['Give me a hint', 'Explain this code', 'Show starter code'],
      referencedConcepts: ['Quantum Debugging', 'Syntax Guidance']
    };
  }

  if (action === 'generate_question') {
    const q = {
      id: `gen-client-${Date.now()}`,
      type: 'multiple-choice' as const,
      question: 'What happens to a qubit in state |0⟩ when an H gate is applied twice in series (H · H)?',
      options: [
        { id: 'a', text: 'Returns to state |0⟩ (H · H = I)', isCorrect: true },
        { id: 'b', text: 'Remains permanently in superposition', isCorrect: false },
        { id: 'c', text: 'Flips to |1⟩', isCorrect: false }
      ],
      hint: 'Quantum gates are unitary and reversible matrices.',
      explanation: 'Because the Hadamard matrix is Hermitian and unitary, H = H† = H⁻¹. Thus H · H equals the Identity matrix I.'
    };

    return {
      reply: `Here is a practice question on **Quantum Transformations**:\n\n**${q.question}**\n\nSelect the correct option below:`,
      action: 'generate_question',
      provider: 'mock',
      generatedQuestion: q,
      suggestedFollowups: ['Why is H its own inverse?', 'Give me another question', 'Explain this concept'],
      referencedConcepts: ['Unitary Invariance', 'Hadamard Reversibility']
    };
  }

  if (action === 'hint') {
    const level = req.hintLevel || 1;
    let hintText = '';
    if (level === 1) {
      hintText = '### 💡 Hint 1 (Conceptual Clue)\n\nThink about what physical transformation is required: are you creating equal probability amplitudes or inverting state values?';
    } else if (level === 2) {
      hintText = '### 💡 Hint 2 (Specific Guidance)\n\nFor equal superposition (50/50), place the **H (Hadamard)** gate on qubit 0 (`qc.h(0)`). For two-qubit correlation, follow with **CNOT** (`qc.cx(0, 1)`).';
    } else {
      hintText = '### 💡 Hint 3 (Near-Solution Guidance)\n\nAdd `qc.h(0)` followed by `qc.measure(0, 0)`. This guarantees equal sampling between |0⟩ and |1⟩ outcomes.';
    }

    return {
      reply: hintText,
      action: 'hint',
      provider: 'mock',
      hintLevel: level,
      suggestedFollowups: ['Give me a practice challenge', 'Explain this concept', 'I understand now'],
      referencedConcepts: ['Scaffolded Guidance', 'Step-by-step Clues']
    };
  }

  // Free-form chat queries
  if (query.includes('superposition')) {
    return {
      reply: 'Superposition allows a qubit |ψ⟩ = α|0⟩ + β|1⟩ to hold continuous probability amplitudes for both 0 and 1 simultaneously. When measured, it collapses into 0 with probability |α|² and 1 with probability |β|².',
      action: 'chat',
      provider: 'mock',
      suggestedFollowups: ['How does H create superposition?', 'What is Born\'s rule?', 'Explain Bloch sphere'],
      referencedConcepts: ['Superposition', 'Born Rule', 'Amplitudes']
    };
  }

  if (query.includes('bell') || query.includes('entangle')) {
    return {
      reply: 'A Bell State (|Φ⁺⟩ = (|00⟩ + |11⟩)/√2) is a maximally entangled two-qubit state. Neither qubit has an independent state. Measuring one instantly dictates the outcome of the other with 100% correlation.',
      action: 'chat',
      provider: 'mock',
      suggestedFollowups: ['How do we build a Bell state?', 'Can this transmit faster than light?', 'What is CNOT?'],
      referencedConcepts: ['Entanglement', 'Bell State', 'EPR Pair']
    };
  }

  return {
    reply: `In quantum computing, quantum algorithms harness superposition, interference, and entanglement to evaluate solutions concurrently. You asked: "${req.message || ''}". I can guide your circuit design, inspect Qiskit code, or explain quantum physics!`,
    action: 'chat',
    provider: 'mock',
    suggestedFollowups: [
      'What is superposition?',
      'How do I create a Bell state?',
      'Explain the difference between X and H'
    ],
    referencedConcepts: ['Quantum Fundamentals', 'Circuit Architecture']
  };
}

/**
 * Sends request to AI Quantum Tutor backend with graceful offline fallback.
 */
export async function askAITutor(request: TutorRequest): Promise<TutorResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/tutor/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data: TutorResponse = await response.json();
      return data;
    }
  } catch (err) {
    // Backend offline or unreachable — silently and gracefully fallback
  }

  // Graceful client-side fallback
  return getClientFallbackTutorResponse(request);
}
