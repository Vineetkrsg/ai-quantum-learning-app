import { Circuit, GuidedExperiment } from '../types/quantum';

export const GUIDED_EXPERIMENTS: GuidedExperiment[] = [
  // ==========================================
  // LEVEL 1: SINGLE QUBIT FUNDAMENTALS
  // ==========================================
  {
    id: 'exp-measurement',
    title: 'Ground State Measurement',
    level: 'beginner',
    levelNumber: 1,
    categoryTitle: 'Level 1 · Single Qubit',
    objective: 'Observe how an unperturbed quantum ground state |0⟩ collapses deterministically upon projective measurement.',
    conceptSummary: 'A qubit initialized in ground state |0⟩ holds 100% amplitude in the 0 state. Projective measurement collapses the quantum state into classical bit 0 with certainty.',
    learningOutcomes: [
      'All circuit wires start initialized in the ground state |0⟩',
      'Measurement converts quantum amplitudes into discrete classical bits',
      'Unmodified ground state yields 100% outcome 0 across all shots'
    ],
    initialCircuit: {
      id: 'circuit-exp-measurement',
      name: 'Ground State Measurement',
      numberOfQubits: 1,
      gates: [
        { id: 'g-m-1', gateId: 'M', targetQubit: 0, position: 0 }
      ],
      measurements: [0]
    },
    availableGates: ['H', 'X', 'Z', 'M'],
    prediction: {
      question: 'What do you think will happen when this circuit is measured?',
      options: [
        { id: 'p-0', label: '100% chance of measuring 0', isExpected: true, feedback: 'Spot on! The qubit begins in state |0⟩ and has undergone no transformations.' },
        { id: 'p-1', label: '100% chance of measuring 1', isExpected: false, feedback: 'The qubit was not flipped. To obtain 1, an X gate is required.' },
        { id: 'p-50', label: 'Approximately 50/50', isExpected: false, feedback: 'A qubit only yields 50/50 if placed in superposition (e.g. using an H gate).' },
        { id: 'p-unsure', label: "I'm not sure yet", isExpected: false, feedback: 'No problem! Run the simulation to see quantum ground state behavior in action.' }
      ]
    },
    expectedBehavior: {
      description: 'Exactly 100% probability of classical outcome 0, with 0% chance of 1.',
      targetProbabilities: { '0': 1.0 }
    },
    interpretation: 'The qubit is initialized in the computational ground state |0⟩. Because no unitary transformation acted upon it, projective measurement collapses directly onto the eigenvalue 0.',
    visualizationType: 'single-qubit',
    challenge: {
      id: 'ch-exp-measurement',
      title: 'Invert the Ground State',
      instruction: 'Modify the circuit by inserting an X gate before measurement so that the circuit measures 1 with 100% probability.',
      objective: 'Obtain 100% measurement outcome for state |1⟩.',
      hints: [
        'Which quantum gate acts like a classical NOT bit-flip?',
        'Look for the Pauli-X gate in the palette.',
        'Place the [X Gate] at t=0, followed by [M Gate] at t=1.'
      ],
      solutionGates: ['X', 'M'],
      validator: (circuit, result) => {
        const hasX = circuit.gates.some(g => g.gateId.toUpperCase() === 'X' && g.targetQubit === 0);
        const prob1 = result.probabilities['1'] || 0;
        if (hasX && prob1 > 0.95) {
          return { isCorrect: true, feedback: 'Excellent! The X gate flipped |0⟩ to |1⟩, producing 100% measured 1.' };
        }
        return { isCorrect: false, feedback: 'Not quite. Place an X gate on wire q[0] before measurement to invert the qubit.' };
      }
    },
    nextExperimentId: 'exp-x-gate'
  },
  {
    id: 'exp-x-gate',
    title: 'Pauli-X Gate (Quantum Bit-Flip)',
    level: 'beginner',
    levelNumber: 1,
    categoryTitle: 'Level 1 · Single Qubit',
    objective: 'Use the Pauli-X gate to invert the quantum state of a qubit from |0⟩ to |1⟩.',
    conceptSummary: 'The Pauli-X gate is the quantum analog of a classical NOT gate. It rotates the qubit state by π radians around the X-axis of the Bloch sphere, exchanging amplitudes |0⟩ ↔ |1⟩.',
    learningOutcomes: [
      'Pauli-X acts as a deterministic quantum NOT operator',
      'X|0⟩ = |1⟩ and X|1⟩ = |0⟩',
      'Measurements confirm state inversion with 100% fidelity'
    ],
    initialCircuit: {
      id: 'circuit-exp-x-gate',
      name: 'Pauli-X Bit-Flip',
      numberOfQubits: 1,
      gates: [
        { id: 'g-x-1', gateId: 'X', targetQubit: 0, position: 0 },
        { id: 'g-x-2', gateId: 'M', targetQubit: 0, position: 1 }
      ],
      measurements: [0]
    },
    availableGates: ['H', 'X', 'Y', 'Z', 'M'],
    prediction: {
      question: 'What outcome will measurement produce after the X gate acts on |0⟩?',
      options: [
        { id: 'p-1', label: '100% chance of measuring 1', isExpected: true, feedback: 'Correct! The X gate inverts the ground state |0⟩ directly to |1⟩.' },
        { id: 'p-0', label: '100% chance of measuring 0', isExpected: false, feedback: 'The X gate inverts the state, so it will not remain in 0.' },
        { id: 'p-50', label: '50% 0 and 50% 1', isExpected: false, feedback: 'The X gate is deterministic, not probabilistic.' },
        { id: 'p-unsure', label: "I'm not sure", isExpected: false, feedback: 'Let us run the simulation to observe the bit-flip.' }
      ]
    },
    expectedBehavior: {
      description: 'Deterministic outcome 1 on 100% of shots.',
      targetProbabilities: { '1': 1.0 }
    },
    interpretation: 'The unitary operator X has matrix [[0, 1], [1, 0]]. Multiplying state vector [1, 0]ᵀ yields [0, 1]ᵀ, which corresponds to the excited basis state |1⟩.',
    visualizationType: 'bit-flip',
    challenge: {
      id: 'ch-exp-x-gate',
      title: 'Double Bit-Flip Reversibility',
      instruction: 'Add a second X gate (X followed by X) on qubit 0 to verify that quantum operations are reversible.',
      objective: 'Produce a circuit where X · X cancels out back to state |0⟩.',
      hints: [
        'Quantum gates are unitary matrices with an inverse.',
        'The Pauli-X gate is its own inverse (X · X = I).',
        'Add a second [X Gate] immediately following the first X gate.'
      ],
      solutionGates: ['X', 'X', 'M'],
      validator: (circuit, result) => {
        const xCount = circuit.gates.filter(g => g.gateId.toUpperCase() === 'X' && g.targetQubit === 0).length;
        const prob0 = result.probabilities['0'] || 0;
        if (xCount >= 2 && xCount % 2 === 0 && prob0 > 0.95) {
          return { isCorrect: true, feedback: 'Outstanding! X · X = I (Identity). Two successive bit-flips returned the qubit back to |0⟩.' };
        }
        return { isCorrect: false, feedback: 'Apply two consecutive X gates on wire q[0] before measurement.' };
      }
    },
    comparisonWith: 'exp-measurement',
    nextExperimentId: 'exp-h-gate'
  },
  {
    id: 'exp-h-gate',
    title: 'Hadamard Gate & Superposition',
    level: 'beginner',
    levelNumber: 1,
    categoryTitle: 'Level 1 · Single Qubit',
    objective: 'Create an equal superposition state where the qubit has approximately equal probability of being measured as 0 or 1.',
    conceptSummary: 'The Hadamard (H) gate transforms the basis state |0⟩ into the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2. Measuring |+⟩ yields outcomes 0 and 1 with equal 50% probability.',
    learningOutcomes: [
      'The Hadamard gate creates quantum superposition from computational basis states',
      'Complex probability amplitudes determine measurement likelihoods via the Born rule (|α|²)',
      'Finite measurement shots exhibit natural quantum statistical noise around 50%'
    ],
    initialCircuit: {
      id: 'circuit-exp-h-gate',
      name: 'Superposition (H Gate)',
      numberOfQubits: 1,
      gates: [
        { id: 'g-h-1', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g-h-2', gateId: 'M', targetQubit: 0, position: 1 }
      ],
      measurements: [0]
    },
    availableGates: ['H', 'X', 'Z', 'M'],
    prediction: {
      question: 'What do you think will happen when this circuit is measured?',
      options: [
        { id: 'p-50', label: 'Approximately 50% outcome 0, 50% outcome 1', isExpected: true, feedback: 'Spot on! The Hadamard gate creates an equal superposition of |0⟩ and |1⟩.' },
        { id: 'p-0', label: 'Always 0', isExpected: false, feedback: 'The H gate splits the probability amplitude between 0 and 1.' },
        { id: 'p-1', label: 'Always 1', isExpected: false, feedback: 'The H gate does not flip to pure 1; it puts the qubit into equal superposition.' },
        { id: 'p-unsure', label: "I'm not sure", isExpected: false, feedback: 'Run the circuit to see quantum randomness in action!' }
      ]
    },
    expectedBehavior: {
      description: 'Theoretical prediction: 50.0% |0⟩ and 50.0% |1⟩. Actual shots will show small statistical fluctuations (e.g. 49% / 51%).',
      targetProbabilities: { '0': 0.5, '1': 0.5 }
    },
    interpretation: 'The Hadamard matrix H transforms [1, 0]ᵀ into [1/√2, 1/√2]ᵀ. By Born\'s rule, P(0) = |1/√2|² = 0.5 and P(1) = |1/√2|² = 0.5. Finite shots sample this distribution, creating realistic quantum shot noise.',
    visualizationType: 'superposition',
    challenge: {
      id: 'ch-exp-h-gate',
      title: 'Superposition from Excited State',
      instruction: 'Modify the circuit by adding an X gate before the H gate (X followed by H). Observe that H applied to |1⟩ also creates a 50/50 superposition, but with negative relative phase (state |-⟩).',
      objective: 'Create a superposition from the excited state |1⟩ using X and H.',
      hints: [
        'First flip the ground state to |1⟩ using X.',
        'Then apply the H gate to place |1⟩ into superposition.',
        'Sequence: [X Gate] at t=0, [H Gate] at t=1, [M Gate] at t=2.'
      ],
      solutionGates: ['X', 'H', 'M'],
      validator: (circuit, result) => {
        const hasX = circuit.gates.some(g => g.gateId.toUpperCase() === 'X' && g.targetQubit === 0);
        const hasH = circuit.gates.some(g => g.gateId.toUpperCase() === 'H' && g.targetQubit === 0);
        const p0 = result.probabilities['0'] || 0;
        const p1 = result.probabilities['1'] || 0;
        if (hasX && hasH && p0 > 0.35 && p1 > 0.35) {
          return { isCorrect: true, feedback: 'Brilliant! X then H produces state |-⟩ = (|0⟩ - |1⟩)/√2. The probabilities are still 50/50, but the relative phase is negative.' };
        }
        return { isCorrect: false, feedback: 'Place both an X gate and an H gate on wire q[0] before measurement.' };
      }
    },
    comparisonWith: 'exp-x-gate',
    nextExperimentId: 'exp-h-twice'
  },
  {
    id: 'exp-h-twice',
    title: 'Hadamard Reversibility (H → H)',
    level: 'beginner',
    levelNumber: 1,
    categoryTitle: 'Level 1 · Single Qubit',
    objective: 'Discover quantum reversibility and destructive wave interference by applying the Hadamard gate twice in series.',
    conceptSummary: 'Quantum operations are unitary matrices with an exact inverse. The Hadamard matrix is Hermitian and unitary (H = H† = H⁻¹), meaning H · H = I (Identity). The superposition cancels out completely!',
    learningOutcomes: [
      'Quantum gates preserve quantum information and are strictly reversible',
      'Applying H twice cancels out: H · H = I',
      'Wave interference causes the amplitudes of state 1 to destructively cancel to 0'
    ],
    initialCircuit: {
      id: 'circuit-exp-h-twice',
      name: 'Reversibility (H → H)',
      numberOfQubits: 1,
      gates: [
        { id: 'g-hh-1', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g-hh-2', gateId: 'H', targetQubit: 0, position: 1 },
        { id: 'g-hh-3', gateId: 'M', targetQubit: 0, position: 2 }
      ],
      measurements: [0]
    },
    availableGates: ['H', 'X', 'Z', 'M'],
    prediction: {
      question: 'If one H gate creates equal 50/50 uncertainty, what will applying a second H gate do?',
      options: [
        { id: 'p-zero', label: 'Returns strictly to 0 (100% |0⟩)', isExpected: true, feedback: 'Correct! H is its own inverse (H · H = I), so the superposition collapses back to ground state |0⟩.' },
        { id: 'p-random', label: 'Even more random (50/50)', isExpected: false, feedback: 'Quantum gates are not random dice rolls; they are coherent wave transformations that interfere.' },
        { id: 'p-one', label: 'Flips to 1 (100% |1⟩)', isExpected: false, feedback: 'The two H gates cancel each other out, returning to the initial state |0⟩.' },
        { id: 'p-unsure', label: "I'm not sure", isExpected: false, feedback: 'Let us run the simulation to see destructive interference!' }
      ]
    },
    expectedBehavior: {
      description: '100% probability of |0⟩. Exactly 0% for |1⟩.',
      targetProbabilities: { '0': 1.0 }
    },
    interpretation: 'The first H gate transforms |0⟩ into (|0⟩ + |1⟩)/√2. The second H gate transforms this state into (H|0⟩ + H|1⟩)/√2 = ((|0⟩+|1⟩) + (|0⟩-|1⟩))/2 = 2|0⟩/2 = |0⟩. The |1⟩ amplitudes cancel out via destructive wave interference!',
    visualizationType: 'superposition',
    challenge: {
      id: 'ch-exp-h-twice',
      title: 'Interference with State Inversion',
      instruction: 'Apply X before the two H gates (X → H → H). Verify that X followed by H·H evaluates back to state |1⟩.',
      objective: 'Prove that H · H acts as Identity on state |1⟩ as well as |0⟩.',
      hints: [
        'Place the X gate first to flip the initial qubit to |1⟩.',
        'Then place two H gates in series.',
        'Target sequence: [X] at t=0, [H] at t=1, [H] at t=2, [M] at t=3.'
      ],
      solutionGates: ['X', 'H', 'H', 'M'],
      validator: (circuit, result) => {
        const hasX = circuit.gates.some(g => g.gateId.toUpperCase() === 'X' && g.targetQubit === 0);
        const hCount = circuit.gates.filter(g => g.gateId.toUpperCase() === 'H' && g.targetQubit === 0).length;
        const p1 = result.probabilities['1'] || 0;
        if (hasX && hCount === 2 && p1 > 0.95) {
          return { isCorrect: true, feedback: 'Superb! Since H · H = I, the circuit effectively evaluates to X · I = X, yielding 100% |1⟩.' };
        }
        return { isCorrect: false, feedback: 'Place an X gate followed by two consecutive H gates on wire q[0].' };
      }
    },
    comparisonWith: 'exp-h-gate',
    nextExperimentId: 'exp-phase-flip'
  },

  // ==========================================
  // LEVEL 2: GATES & PHASE ROTATIONS
  // ==========================================
  {
    id: 'exp-phase-flip',
    title: 'Phase Flip Interference (H → Z → H)',
    level: 'beginner',
    levelNumber: 2,
    categoryTitle: 'Level 2 · Gates & Phase',
    objective: 'Explore how modifying relative phase with the Pauli-Z gate transforms interference from |0⟩ into |1⟩.',
    conceptSummary: 'The Pauli-Z gate shifts the phase of |1⟩ by π radians without changing measurement probabilities in the Z-basis. But sandwiched between two H gates (H · Z · H), this phase flip transforms into a bit flip!',
    learningOutcomes: [
      'The Pauli-Z gate rotates the quantum state around the Z-axis by 180°',
      'Phase differences cannot be detected by direct measurement, but convert to probability changes via interference',
      'H · Z · H is mathematically equivalent to the Pauli-X gate'
    ],
    initialCircuit: {
      id: 'circuit-exp-phase-flip',
      name: 'Phase Flip Interference',
      numberOfQubits: 1,
      gates: [
        { id: 'g-pz-1', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g-pz-2', gateId: 'Z', targetQubit: 0, position: 1 },
        { id: 'g-pz-3', gateId: 'H', targetQubit: 0, position: 2 },
        { id: 'g-pz-4', gateId: 'M', targetQubit: 0, position: 3 }
      ],
      measurements: [0]
    },
    availableGates: ['H', 'X', 'Y', 'Z', 'S', 'T', 'M'],
    prediction: {
      question: 'Does changing the internal relative phase in superposition affect the final measurement outcome after the second H gate?',
      options: [
        { id: 'p-one', label: 'Inverts to outcome 1 (100% |1⟩)', isExpected: true, feedback: 'Spot on! The Z gate inverts the sign of |1⟩, turning constructive interference at 0 into constructive interference at 1.' },
        { id: 'p-zero', label: 'Remains outcome 0 (100% |0⟩)', isExpected: false, feedback: 'Without the Z gate it would be 0, but Z alters the phase trajectory.' },
        { id: 'p-fifty', label: 'Stays 50/50', isExpected: false, feedback: 'The second H gate recombines the amplitudes deterministically.' }
      ]
    },
    expectedBehavior: {
      description: '100% probability of |1⟩. Exactly 0% for |0⟩.',
      targetProbabilities: { '1': 1.0 }
    },
    interpretation: 'First H creates state |+⟩ = (|0⟩ + |1⟩)/√2. The Z gate maps |+⟩ to |-⟩ = (|0⟩ - |1⟩)/√2. The final H gate transforms |-⟩ directly into |1⟩. Thus H · Z · H = X!',
    visualizationType: 'single-qubit',
    challenge: {
      id: 'ch-exp-phase-flip',
      title: 'Partial Phase Shift with S Gate',
      instruction: 'Replace the Z gate with the S gate (Phase π/2). Run simulation to observe how a 90° phase rotation distributes probabilities.',
      objective: 'Synthesize circuit H → S → H and observe equal 50/50 probability distribution.',
      hints: [
        'The S gate represents a square root of Z (rotation of 90°).',
        'Remove gate Z and place an [S Gate] at position t=1.',
        'Target sequence: [H] → [S] → [H] → [M].'
      ],
      solutionGates: ['H', 'S', 'H', 'M'],
      validator: (circuit, result) => {
        const hasS = circuit.gates.some(g => g.gateId.toUpperCase() === 'S' && g.targetQubit === 0);
        const p0 = result.probabilities['0'] || 0;
        const p1 = result.probabilities['1'] || 0;
        if (hasS && p0 > 0.35 && p1 > 0.35) {
          return { isCorrect: true, feedback: 'Great job! S creates an equal superposition along the Y-axis of the Bloch sphere.' };
        }
        return { isCorrect: false, feedback: 'Replace Z with the S gate between the two H gates on wire q[0].' };
      }
    },
    comparisonWith: 'exp-h-twice',
    nextExperimentId: 'exp-gate-order'
  },
  {
    id: 'exp-gate-order',
    title: 'Gate Sequence & Non-Commutativity',
    level: 'beginner',
    levelNumber: 2,
    categoryTitle: 'Level 2 · Gates & Phase',
    objective: 'Demonstrate that the chronological order of quantum operations matters because quantum gates do not generally commute.',
    conceptSummary: 'Quantum operations correspond to matrix multiplication. Because matrices generally do not commute (A · B ≠ B · A), changing gate order changes the quantum state trajectory on the Bloch sphere.',
    learningOutcomes: [
      'Quantum gate order affects phase orientation and state evolution',
      'X · H transforms |0⟩ into |-⟩, whereas H · X transforms |0⟩ into |+⟩',
      'Basis measurements can have identical counts while states differ in relative phase'
    ],
    initialCircuit: {
      id: 'circuit-exp-gate-order',
      name: 'Sequence (X → H)',
      numberOfQubits: 1,
      gates: [
        { id: 'g-go-1', gateId: 'X', targetQubit: 0, position: 0 },
        { id: 'g-go-2', gateId: 'H', targetQubit: 0, position: 1 },
        { id: 'g-go-3', gateId: 'M', targetQubit: 0, position: 2 }
      ],
      measurements: [0]
    },
    availableGates: ['H', 'X', 'Z', 'M'],
    prediction: {
      question: 'How does applying X followed by H compare to applying H followed by X?',
      options: [
        { id: 'p-both-50', label: 'Both produce 50/50 counts, but with opposite relative phase (|+⟩ vs |-⟩)', isExpected: true, feedback: 'Precisely! Both show 50/50 measurement probabilities, but state vectors point in opposite directions on the Bloch sphere.' },
        { id: 'p-one-det', label: 'One produces 100% 0, the other 100% 1', isExpected: false, feedback: 'Both circuits end with an H or start with one, producing superposition.' },
        { id: 'p-cancel', label: 'They cancel each other out', isExpected: false, feedback: 'X and H are distinct rotations and do not cancel.' }
      ]
    },
    expectedBehavior: {
      description: 'Approximately 50% |0⟩ and 50% |1⟩, with state vector (|0⟩ - |1⟩)/√2.',
      targetProbabilities: { '0': 0.5, '1': 0.5 }
    },
    interpretation: 'X|0⟩ = |1⟩, then H|1⟩ = (|0⟩ - |1⟩)/√2 (state |-⟩). In comparison, H|0⟩ = |+⟩, and X|+⟩ = |+⟩ (since X flips 0 and 1, leaving (|1⟩+|0⟩)/√2 invariant).',
    visualizationType: 'single-qubit',
    challenge: {
      id: 'ch-exp-gate-order',
      title: 'Reveal the Negative Phase',
      instruction: 'Add a third gate H after X → H (making X → H → H). Verify that the circuit returns deterministically to |1⟩, proving the state was in |-⟩.',
      objective: 'Differentiate |+⟩ and |-⟩ by applying a terminal H gate.',
      hints: [
        'Applying H to |+⟩ returns to |0⟩.',
        'Applying H to |-⟩ returns to |1⟩.',
        'Add a second [H Gate] at position t=2 before measurement.'
      ],
      solutionGates: ['X', 'H', 'H', 'M'],
      validator: (circuit, result) => {
        const p1 = result.probabilities['1'] || 0;
        const hCount = circuit.gates.filter(g => g.gateId.toUpperCase() === 'H' && g.targetQubit === 0).length;
        if (hCount >= 2 && p1 > 0.95) {
          return { isCorrect: true, feedback: 'Spot on! H|-⟩ = |1⟩, confirming that X·H introduced a negative phase.' };
        }
        return { isCorrect: false, feedback: 'Append an H gate to the wire to convert the phase difference into a measurable bit outcome.' };
      }
    },
    comparisonWith: 'exp-h-gate',
    nextExperimentId: 'exp-multi-qubit'
  },

  // ==========================================
  // LEVEL 3: MULTI-QUBIT & ENTANGLEMENT
  // ==========================================
  {
    id: 'exp-multi-qubit',
    title: 'Multiple Independent Qubits',
    level: 'intermediate',
    levelNumber: 3,
    categoryTitle: 'Level 3 · Multi-Qubit',
    objective: 'Simulate a 2-qubit register where each qubit undergoes an independent transformation in parallel.',
    conceptSummary: 'Before entanglement is introduced, two independent qubits exist in a tensor product state |ψ⟩ = |q₀⟩ ⊗ |q₁⟩. Operations on qubit 0 do not alter the quantum state of qubit 1.',
    learningOutcomes: [
      'Multi-qubit registers grow exponentially as 2ⁿ computational basis states',
      'Independent qubits combine via the Kronecker tensor product (⊗)',
      'Parallel operations execute concurrently across distinct wires'
    ],
    initialCircuit: {
      id: 'circuit-exp-multi-qubit',
      name: 'Independent Parallel Qubits',
      numberOfQubits: 2,
      gates: [
        { id: 'g-mq-1', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g-mq-2', gateId: 'X', targetQubit: 1, position: 0 },
        { id: 'g-mq-3', gateId: 'M', targetQubit: 0, position: 1 },
        { id: 'g-mq-4', gateId: 'M', targetQubit: 1, position: 1 }
      ],
      measurements: [0, 1]
    },
    availableGates: ['H', 'X', 'Z', 'CNOT', 'M'],
    prediction: {
      question: 'With H on q0 and X on q1, which two-qubit measurement outcomes will occur?',
      options: [
        { id: 'p-01-11', label: 'Only |01⟩ and |11⟩ (approximately 50% each)', isExpected: true, feedback: 'Correct! q1 is flipped to 1 with 100% certainty, while q0 is in equal superposition (0 or 1).' },
        { id: 'p-00-11', label: 'Only |00⟩ and |11⟩', isExpected: false, feedback: 'q1 is flipped to 1, so q1 can never be measured as 0 in this circuit.' },
        { id: 'p-all', label: 'All four states (00, 01, 10, 11) equally', isExpected: false, feedback: 'q1 is deterministically 1, so states with q1=0 have 0 amplitude.' }
      ]
    },
    expectedBehavior: {
      description: 'Approximately 50% |01⟩ and 50% |11⟩ (0% for |00⟩ and |10⟩).',
      targetProbabilities: { '01': 0.5, '11': 0.5 }
    },
    interpretation: 'Qubit 0 is in state (|0⟩+|1⟩)/√2 and Qubit 1 is in state |1⟩. The composite state is (|0⟩+|1⟩)/√2 ⊗ |1⟩ = (|01⟩ + |11⟩)/√2. Measurements reflect independent probabilities: P(q0=0)=0.5, P(q1=1)=1.0.',
    visualizationType: 'single-qubit',
    challenge: {
      id: 'ch-exp-multi-qubit',
      title: 'Full 4-State Equal Superposition',
      instruction: 'Replace the X gate on q1 with an H gate so that both qubits are in superposition, generating an equal 4-state distribution.',
      objective: 'Create an equal superposition across all four states |00⟩, |01⟩, |10⟩, and |11⟩.',
      hints: [
        'Apply an H gate to wire q[0] and an H gate to wire q[1].',
        'This creates |+⟩ ⊗ |+⟩.',
        'Target: [H on q0], [H on q1], followed by measurements.'
      ],
      solutionGates: ['H', 'H', 'M', 'M'],
      validator: (circuit, result) => {
        const h0 = circuit.gates.some(g => g.gateId.toUpperCase() === 'H' && g.targetQubit === 0);
        const h1 = circuit.gates.some(g => g.gateId.toUpperCase() === 'H' && g.targetQubit === 1);
        const keys = Object.keys(result.probabilities);
        if (h0 && h1 && keys.length >= 4) {
          return { isCorrect: true, feedback: 'Excellent! Two Hadamard gates in parallel create a 4-state uniform superposition, each with 25% probability.' };
        }
        return { isCorrect: false, feedback: 'Place Hadamard (H) gates on both wire q[0] and wire q[1].' };
      }
    },
    nextExperimentId: 'exp-cnot'
  },
  {
    id: 'exp-cnot',
    title: 'Controlled-NOT (CNOT) Gate',
    level: 'intermediate',
    levelNumber: 3,
    categoryTitle: 'Level 3 · Multi-Qubit',
    objective: 'Explore conditional multi-qubit logic using the Controlled-NOT gate.',
    conceptSummary: 'The CNOT gate acts on two qubits: control and target. If the control qubit is in state |1⟩, it flips the target qubit. If the control is |0⟩, the target is unchanged.',
    learningOutcomes: [
      'CNOT creates conditional state transitions across wires',
      'CNOT|00⟩ = |00⟩, CNOT|01⟩ = |01⟩, CNOT|10⟩ = |11⟩, CNOT|11⟩ = |10⟩',
      'CNOT is the fundamental two-qubit entangling gate in quantum circuits'
    ],
    initialCircuit: {
      id: 'circuit-exp-cnot',
      name: 'Controlled-NOT Gate',
      numberOfQubits: 2,
      gates: [
        { id: 'g-cx-1', gateId: 'X', targetQubit: 0, position: 0 },
        { id: 'g-cx-2', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 1 },
        { id: 'g-cx-3', gateId: 'M', targetQubit: 0, position: 2 },
        { id: 'g-cx-4', gateId: 'M', targetQubit: 1, position: 2 }
      ],
      measurements: [0, 1]
    },
    availableGates: ['H', 'X', 'Z', 'CNOT', 'SWAP', 'M'],
    prediction: {
      question: 'With q0 set to 1 and q1 initially 0, what state will CNOT produce?',
      options: [
        { id: 'p-11', label: '100% chance of |11⟩ (Both qubits 1)', isExpected: true, feedback: 'Correct! Because control qubit q0 is 1, the CNOT gate triggers and flips target qubit q1 to 1.' },
        { id: 'p-10', label: '100% chance of |10⟩', isExpected: false, feedback: 'The target qubit flips from 0 to 1 when the control qubit is 1.' },
        { id: 'p-00', label: '100% chance of |00⟩', isExpected: false, feedback: 'Neither qubit is in state 0.' }
      ]
    },
    expectedBehavior: {
      description: '100% probability of |11⟩ (0% for all other states).',
      targetProbabilities: { '11': 1.0 }
    },
    interpretation: 'The input state to CNOT is |10⟩ (q0=1, q1=0). Because the control qubit is 1, CNOT flips the target qubit, transforming |10⟩ into |11⟩.',
    visualizationType: 'bell-state',
    challenge: {
      id: 'ch-exp-cnot',
      title: 'Control Inactive',
      instruction: 'Remove the X gate so that control qubit q0 is 0. Verify that the target qubit q1 remains untouched at 0.',
      objective: 'Demonstrate that CNOT leaves target unchanged when control is |0⟩.',
      hints: [
        'Click the X gate on wire q[0] and remove it.',
        'Run the circuit with q0 remaining in ground state |0⟩.',
        'Outcome will be strictly |00⟩.'
      ],
      solutionGates: ['CNOT', 'M', 'M'],
      validator: (circuit, result) => {
        const hasX = circuit.gates.some(g => g.gateId.toUpperCase() === 'X' && g.targetQubit === 0);
        const p00 = result.probabilities['00'] || 0;
        if (!hasX && p00 > 0.95) {
          return { isCorrect: true, feedback: 'Great work! When control is |0⟩, CNOT does not activate, leaving state |00⟩ intact.' };
        }
        return { isCorrect: false, feedback: 'Remove the X gate from wire q[0] to test the inactive control condition.' };
      }
    },
    comparisonWith: 'exp-multi-qubit',
    nextExperimentId: 'exp-bell-state'
  },
  {
    id: 'exp-bell-state',
    title: 'Bell State Synthesis (|Φ⁺⟩)',
    level: 'intermediate',
    levelNumber: 3,
    categoryTitle: 'Level 3 · Multi-Qubit',
    objective: 'Create a maximally entangled two-qubit Bell pair using Hadamard and CNOT gates.',
    conceptSummary: 'The Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 cannot be factored into two independent qubit states. Measuring one qubit instantaneously collapses the other with 100% correlation, regardless of distance.',
    learningOutcomes: [
      'Entanglement is synthesized by pairing superposition (H) with conditional logic (CNOT)',
      'Bell states exhibit perfect correlation: measuring one qubit dictates the other',
      'The states |01⟩ and |10⟩ have zero probability in |Φ⁺⟩'
    ],
    initialCircuit: {
      id: 'circuit-exp-bell-state',
      name: 'Bell State (|Φ⁺⟩)',
      numberOfQubits: 2,
      gates: [
        { id: 'g-bell-1', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g-bell-2', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 1 },
        { id: 'g-bell-3', gateId: 'M', targetQubit: 0, position: 2 },
        { id: 'g-bell-4', gateId: 'M', targetQubit: 1, position: 2 }
      ],
      measurements: [0, 1]
    },
    availableGates: ['H', 'X', 'Z', 'CNOT', 'M'],
    prediction: {
      question: 'What measurement outcomes will you observe from this Bell circuit?',
      options: [
        { id: 'p-corr', label: 'Only |00⟩ and |11⟩ (approximately 50% each, zero 01 or 10)', isExpected: true, feedback: 'Spot on! The qubits are maximally entangled: their outcomes always agree perfectly.' },
        { id: 'p-all', label: 'All four combinations (00, 01, 10, 11) equally', isExpected: false, feedback: 'The CNOT gate entangles the qubits, eliminating |01⟩ and |10⟩.' },
        { id: 'p-00', label: 'Strictly 100% |00⟩', isExpected: false, feedback: 'The H gate creates superposition, so both 00 and 11 occur with equal likelihood.' }
      ]
    },
    expectedBehavior: {
      description: 'Approximately 50% |00⟩ and 50% |11⟩. Zero counts for |01⟩ and |10⟩.',
      targetProbabilities: { '00': 0.5, '11': 0.5 }
    },
    interpretation: 'The Hadamard gate puts q0 into superposition (|0⟩+|1⟩)/√2 while q1 is |0⟩ (composite state (|00⟩+|10⟩)/√2). The CNOT gate flips q1 only when q0 is 1, creating the entangled state (|00⟩+|11⟩)/√2. Individual qubits appear random (50/50), but joint measurement is 100% correlated.',
    visualizationType: 'bell-state',
    challenge: {
      id: 'ch-exp-bell-state',
      title: 'Synthesize Anti-Correlated Bell State (|Ψ⁺⟩)',
      instruction: 'Add an X gate to wire q1 before the CNOT gate. Run simulation to produce Bell state |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2, where qubits always disagree.',
      objective: 'Create the anti-correlated Bell pair (|01⟩ and |10⟩).',
      hints: [
        'Flip q1 to 1 before entanglement.',
        'Place [X Gate] on wire q[1] at t=0.',
        'Keep [H Gate] on wire q[0] at t=0 and [CNOT] at t=1.'
      ],
      solutionGates: ['H', 'X', 'CNOT', 'M', 'M'],
      validator: (circuit, result) => {
        const p01 = result.probabilities['01'] || 0;
        const p10 = result.probabilities['10'] || 0;
        if (p01 > 0.35 && p10 > 0.35 && (result.probabilities['00'] || 0) < 0.05) {
          return { isCorrect: true, feedback: 'Brilliant! You synthesized Bell state |Ψ⁺⟩. The two qubits are now perfectly anti-correlated.' };
        }
        return { isCorrect: false, feedback: 'Place an X gate on wire q[1] to invert the correlation.' };
      }
    },
    comparisonWith: 'exp-cnot',
    nextExperimentId: 'exp-entanglement'
  },
  {
    id: 'exp-entanglement',
    title: 'Quantum Entanglement & Correlation',
    level: 'intermediate',
    levelNumber: 3,
    categoryTitle: 'Level 3 · Multi-Qubit',
    objective: 'Explore the phase properties of Bell state |Φ⁻⟩ = (|00⟩ - |11⟩)/√2 and verify quantum correlation.',
    conceptSummary: 'Entangled states can share identical probability distributions while differing in relative phase. In |Φ⁻⟩, the outcomes are still 100% correlated (both 0 or both 1), but with a 180° phase flip between the two branches.',
    learningOutcomes: [
      'Different Bell basis states represent mutually orthogonal entangled states',
      'Phase gates change the relative sign of entangled branches',
      'Computational measurements capture correlation, while phase differences require basis rotation to detect'
    ],
    initialCircuit: {
      id: 'circuit-exp-entanglement',
      name: 'Phase-Flipped Bell State (|Φ⁻⟩)',
      numberOfQubits: 2,
      gates: [
        { id: 'g-ent-1', gateId: 'X', targetQubit: 0, position: 0 },
        { id: 'g-ent-2', gateId: 'H', targetQubit: 0, position: 1 },
        { id: 'g-ent-3', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 2 },
        { id: 'g-ent-4', gateId: 'M', targetQubit: 0, position: 3 },
        { id: 'g-ent-5', gateId: 'M', targetQubit: 1, position: 3 }
      ],
      measurements: [0, 1]
    },
    availableGates: ['H', 'X', 'Z', 'CNOT', 'M'],
    prediction: {
      question: 'How does applying X before the Hadamard gate change the Bell state measurement?',
      options: [
        { id: 'p-phi-minus', label: 'Produces correlated outcomes |00⟩ and |11⟩ with negative relative phase (|Φ⁻⟩)', isExpected: true, feedback: 'Correct! The outcomes are still 50% |00⟩ and 50% |11⟩, but the state is (|00⟩ - |11⟩)/√2.' },
        { id: 'p-cross', label: 'Switches to |01⟩ and |10⟩', isExpected: false, feedback: 'X on q0 affects the phase of superposition; q1 is still flipped only when q0 is 1.' },
        { id: 'p-broke', label: 'Destroys entanglement completely', isExpected: false, feedback: 'Entanglement is fully preserved; only the phase branch has shifted.' }
      ]
    },
    expectedBehavior: {
      description: '50% |00⟩ and 50% |11⟩ (Identical probabilities to |Φ⁺⟩, but negative relative phase).',
      targetProbabilities: { '00': 0.5, '11': 0.5 }
    },
    interpretation: 'X|0⟩ = |1⟩, then H|1⟩ = (|0⟩-|1⟩)/√2. The CNOT flips q1 when q0 is 1, yielding (|00⟩ - |11⟩)/√2. Computational measurements reveal that correlation remains 100%.',
    visualizationType: 'entanglement',
    challenge: {
      id: 'ch-exp-entanglement',
      title: 'Synthesize Bell State |Ψ⁻⟩',
      instruction: 'Combine X on q0 and X on q1 before the Bell circuit to generate the singlet state |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2.',
      objective: 'Synthesize the singlet state |Ψ⁻⟩.',
      hints: [
        'Add an X gate on wire q[0] and an X gate on wire q[1].',
        'Then apply H on q[0] and CNOT(0, 1).',
        'Outcomes will be strictly |01⟩ and |10⟩.'
      ],
      solutionGates: ['X', 'X', 'H', 'CNOT', 'M', 'M'],
      validator: (circuit, result) => {
        const p01 = result.probabilities['01'] || 0;
        const p10 = result.probabilities['10'] || 0;
        if (p01 > 0.35 && p10 > 0.35) {
          return { isCorrect: true, feedback: 'Outstanding! You synthesized the famous quantum Singlet State |Ψ⁻⟩.' };
        }
        return { isCorrect: false, feedback: 'Place X gates on both wires before the entangling H and CNOT gates.' };
      }
    },
    comparisonWith: 'exp-bell-state',
    nextExperimentId: 'exp-deutsch-jozsa'
  },

  // ==========================================
  // LEVEL 4: QUANTUM ALGORITHMS
  // ==========================================
  {
    id: 'exp-deutsch-jozsa',
    title: 'Deutsch-Jozsa Algorithm',
    level: 'advanced',
    levelNumber: 4,
    categoryTitle: 'Level 4 · Quantum Algorithms',
    objective: 'Determine whether a quantum oracle is Constant or Balanced in a single evaluation query.',
    conceptSummary: 'A classical computer must query a black-box function at least twice (or 2^(n-1)+1 times for n qubits) to determine if it is constant or balanced. The Deutsch-Jozsa algorithm uses quantum phase kickback to solve it in exactly 1 query!',
    learningOutcomes: [
      'Demonstrates proven quantum speedup over classical computation',
      'Phase kickback transfers information from the target ancilla qubit into the input register',
      'Constructive vs destructive interference reveals global properties in one query'
    ],
    initialCircuit: {
      id: 'circuit-exp-deutsch-jozsa',
      name: 'Deutsch-Jozsa (Balanced Oracle)',
      numberOfQubits: 2,
      gates: [
        { id: 'g-dj-1', gateId: 'X', targetQubit: 1, position: 0 },
        { id: 'g-dj-2', gateId: 'H', targetQubit: 0, position: 1 },
        { id: 'g-dj-3', gateId: 'H', targetQubit: 1, position: 1 },
        { id: 'g-dj-4', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 2 },
        { id: 'g-dj-5', gateId: 'H', targetQubit: 0, position: 3 },
        { id: 'g-dj-6', gateId: 'M', targetQubit: 0, position: 4 }
      ],
      measurements: [0]
    },
    availableGates: ['H', 'X', 'Z', 'CNOT', 'M'],
    prediction: {
      question: 'For this balanced oracle (the CNOT gate), what will measurement on qubit 0 reveal?',
      options: [
        { id: 'p-one', label: '100% chance of 1 (Proves oracle is Balanced)', isExpected: true, feedback: 'Correct! Measuring 1 on qubit 0 deterministically proves the oracle is balanced in 1 query.' },
        { id: 'p-zero', label: '100% chance of 0 (Constant)', isExpected: false, feedback: 'Measurement of 0 indicates a constant oracle. CNOT is balanced.' },
        { id: 'p-fifty', label: '50% 0 and 50% 1', isExpected: false, feedback: 'Destructive interference leaves zero probability for 0.' }
      ]
    },
    expectedBehavior: {
      description: '100% probability of measured bit 1 on qubit 0. Proves the function is balanced.',
      targetProbabilities: { '10': 0.5, '11': 0.5 }
    },
    interpretation: 'The ancilla qubit q1 is initialized to |-⟩. When the CNOT oracle executes, phase kickback multiplies the |1⟩ component of q0 by -1. The final H gate converts this negative phase into destructive interference for 0 and constructive interference for 1. Qubit 0 measures 1 with certainty!',
    visualizationType: 'algorithm',
    challenge: {
      id: 'ch-exp-deutsch-jozsa',
      title: 'Test a Constant Oracle',
      instruction: 'Remove the CNOT gate (so the oracle is the Identity function f(x)=0, which is Constant). Run simulation to observe that qubit 0 now measures 0 with 100% probability.',
      objective: 'Demonstrate that a Constant oracle always outputs 0.',
      hints: [
        'Click the CNOT gate and remove it from the circuit.',
        'Leave H on q0, X & H on q1, and the final H on q0.',
        'Outcome on q0 will switch from 1 to 0.'
      ],
      solutionGates: ['X', 'H', 'H', 'H', 'M'],
      validator: (circuit, result) => {
        const hasCX = circuit.gates.some(g => g.gateId.toUpperCase() === 'CNOT' || g.gateId.toUpperCase() === 'CX');
        const counts = result.counts;
        const total0 = Object.entries(counts).filter(([k]) => k.startsWith('0')).reduce((a, b) => a + b[1], 0);
        if (!hasCX && total0 > (result.shots * 0.9)) {
          return { isCorrect: true, feedback: 'Brilliant! With no CNOT, the oracle is constant (f(x)=0), and qubit 0 measured 0 with 100% certainty!' };
        }
        return { isCorrect: false, feedback: 'Remove the CNOT gate to simulate a constant oracle.' };
      }
    },
    nextExperimentId: 'exp-grover'
  },
  {
    id: 'exp-grover',
    title: "Grover's 2-Qubit Search Algorithm",
    level: 'advanced',
    levelNumber: 4,
    categoryTitle: 'Level 4 · Quantum Algorithms',
    objective: 'Use quantum amplitude amplification to search an unsorted 2-qubit database and locate marked item |11⟩ in 1 query.',
    conceptSummary: "Classical search through N items requires O(N) queries on average. Grover's algorithm achieves quadratic speedup O(√N). For N=4 (2 qubits), exactly 1 Grover iteration amplifies the target state to 100% probability!",
    learningOutcomes: [
      "Grover's algorithm locates items in unsorted databases with quadratic speedup",
      'The Oracle marks the target state with a negative relative phase',
      'The Diffusion Operator inverts amplitudes about their average mean, boosting the target probability'
    ],
    initialCircuit: {
      id: 'circuit-exp-grover',
      name: "Grover's Search (Target |11⟩)",
      numberOfQubits: 2,
      gates: [
        // 1. Equal superposition
        { id: 'g-gr-1', gateId: 'H', targetQubit: 0, position: 0 },
        { id: 'g-gr-2', gateId: 'H', targetQubit: 1, position: 0 },
        // 2. Oracle marking |11> (Controlled-Z via H-CNOT-H)
        { id: 'g-gr-3', gateId: 'H', targetQubit: 1, position: 1 },
        { id: 'g-gr-4', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 2 },
        { id: 'g-gr-5', gateId: 'H', targetQubit: 1, position: 3 },
        // 3. Diffuser
        { id: 'g-gr-6', gateId: 'H', targetQubit: 0, position: 4 },
        { id: 'g-gr-7', gateId: 'H', targetQubit: 1, position: 4 },
        { id: 'g-gr-8', gateId: 'X', targetQubit: 0, position: 5 },
        { id: 'g-gr-9', gateId: 'X', targetQubit: 1, position: 5 },
        { id: 'g-gr-10', gateId: 'H', targetQubit: 1, position: 6 },
        { id: 'g-gr-11', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 7 },
        { id: 'g-gr-12', gateId: 'H', targetQubit: 1, position: 8 },
        { id: 'g-gr-13', gateId: 'X', targetQubit: 0, position: 9 },
        { id: 'g-gr-14', gateId: 'X', targetQubit: 1, position: 9 },
        { id: 'g-gr-15', gateId: 'H', targetQubit: 0, position: 10 },
        { id: 'g-gr-16', gateId: 'H', targetQubit: 1, position: 10 },
        // Measurement
        { id: 'g-gr-17', gateId: 'M', targetQubit: 0, position: 11 },
        { id: 'g-gr-18', gateId: 'M', targetQubit: 1, position: 11 }
      ],
      measurements: [0, 1]
    },
    availableGates: ['H', 'X', 'Z', 'CNOT', 'M'],
    prediction: {
      question: 'After the Grover oracle and diffusion operator, what will the measurement distribution look like?',
      options: [
        { id: 'p-target', label: 'The marked target state |11⟩ is amplified to near 100%', isExpected: true, feedback: 'Spot on! Amplitude amplification concentrates almost 100% of probability into the marked state |11⟩.' },
        { id: 'p-uniform', label: 'Still an equal 25% across all 4 states', isExpected: false, feedback: 'The diffusion operator inverts amplitudes around the mean, breaking uniformity.' },
        { id: 'p-00', label: '|00⟩ is selected', isExpected: false, feedback: 'The oracle marked |11⟩, not |00⟩.' }
      ]
    },
    expectedBehavior: {
      description: '100% probability of measuring target state |11⟩. All other states suppressed to 0%.',
      targetProbabilities: { '11': 1.0 }
    },
    interpretation: 'The Oracle flips the phase of target |11⟩ from +1/2 to -1/2. The average amplitude becomes (1/2 + 1/2 + 1/2 - 1/2)/4 = 1/4. Inverting each amplitude about the mean (2·avg - amp) leaves unmarked states at 2(1/4) - 1/2 = 0, while the marked state reaches 2(1/4) - (-1/2) = 1.0!',
    visualizationType: 'algorithm',
    challenge: {
      id: 'ch-exp-grover',
      title: 'Inspect Grover Amplification',
      instruction: 'Verify that removing the diffusion step causes the circuit to remain in an equal 25% distribution across all 4 basis states.',
      objective: 'Observe that the oracle alone does not change computational probabilities without diffusion.',
      hints: [
        'The Oracle only changes phase (which is invisible to direct probability measurement).',
        'Diffusion is required to convert negative phase into amplitude boost.',
        'Run the circuit and observe how Grover concentrates probability.'
      ],
      solutionGates: ['H', 'H', 'M', 'M'],
      validator: (circuit, result) => {
        const prob11 = result.probabilities['11'] || 0;
        if (prob11 > 0.9) {
          return { isCorrect: true, feedback: 'Grover amplification verified! 100% target probability reached in a single query.' };
        }
        return { isCorrect: false, feedback: 'Ensure the full Grover circuit runs to observe 100% amplification of |11⟩.' };
      }
    },
    nextExperimentId: 'exp-teleportation'
  },
  {
    id: 'exp-teleportation',
    title: 'Quantum Teleportation Protocol',
    level: 'advanced',
    levelNumber: 4,
    categoryTitle: 'Level 4 · Quantum Algorithms',
    objective: 'Transfer the quantum state of a qubit across an entangled channel using Bell measurements.',
    conceptSummary: 'Quantum teleportation transfers an unknown quantum state |ψ⟩ from Alice (q0) to Bob (q2) using a shared Bell pair (q1, q2) and 2 classical bits of information, respecting the No-Cloning theorem.',
    learningOutcomes: [
      'Quantum states cannot be duplicated (No-Cloning Theorem), only transferred',
      'Teleportation consumes 1 entangled pair and 2 classical bits to transmit 1 qubit state',
      'The original state at Alice collapses upon Bell measurement, appearing at Bob'
    ],
    initialCircuit: {
      id: 'circuit-exp-teleportation',
      name: 'Quantum Teleportation',
      numberOfQubits: 3,
      gates: [
        // 1. Prepare unknown state |ψ> on q0 (H gate makes it |+>)
        { id: 'g-tp-1', gateId: 'H', targetQubit: 0, position: 0 },
        // 2. Create shared Bell pair on q1 and q2
        { id: 'g-tp-2', gateId: 'H', targetQubit: 1, position: 1 },
        { id: 'g-tp-3', gateId: 'CNOT', targetQubit: 2, controlQubit: 1, position: 2 },
        // 3. Alice performs Bell measurement on q0 and q1
        { id: 'g-tp-4', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 3 },
        { id: 'g-tp-5', gateId: 'H', targetQubit: 0, position: 4 },
        { id: 'g-tp-6', gateId: 'M', targetQubit: 0, position: 5 },
        { id: 'g-tp-7', gateId: 'M', targetQubit: 1, position: 5 }
      ],
      measurements: [0, 1]
    },
    availableGates: ['H', 'X', 'Z', 'CNOT', 'M'],
    prediction: {
      question: "Does measuring Alice's qubits (q0 and q1) destroy the original state on q0?",
      options: [
        { id: 'p-transfer', label: 'Yes, q0 collapses, but its quantum state transfers to Bob (q2)', isExpected: true, feedback: 'Correct! The No-Cloning theorem prohibits copying; teleportation transfers the quantum state by destroying it at the source.' },
        { id: 'p-clone', label: 'No, both qubits now retain identical copies', isExpected: false, feedback: 'Quantum states cannot be cloned.' },
        { id: 'p-lost', label: 'The state is permanently destroyed', isExpected: false, feedback: 'With classical correction bits, Bob recovers the exact state.' }
      ]
    },
    expectedBehavior: {
      description: "Equal 25% distribution across Alice's 4 measurement outcomes (00, 01, 10, 11) on q0 and q1, while q2 holds the state.",
      targetProbabilities: { '000': 0.25, '010': 0.25, '100': 0.25, '110': 0.25 }
    },
    interpretation: "Alice's Bell measurement produces 4 equally likely classical outcomes. Based on these 2 bits, Bob applies Pauli corrections (X or Z) to recover state |ψ⟩ with 100% fidelity on q2.",
    visualizationType: 'algorithm',
    isEducationalDemo: true,
    educationalNotes: "Educational demonstration of the 3-qubit teleportation channel. Physical hardware applies dynamic feedforward operations for Bob's corrections.",
    challenge: {
      id: 'ch-exp-teleportation',
      title: 'Verify Entanglement Necessity',
      instruction: 'Observe the 4 classical readout combinations produced by Alice\'s Bell measurement.',
      objective: 'Understand how classical readout and entanglement combine in teleportation.',
      hints: [
        'Notice that Alice measures q0 and q1.',
        'Four outcomes occur: 00, 01, 10, 11.',
        'Bob uses these bits to apply corrections on q2.'
      ],
      solutionGates: ['H', 'H', 'CNOT', 'CNOT', 'H', 'M', 'M'],
      validator: (circuit, result) => {
        const keys = Object.keys(result.probabilities);
        if (keys.length >= 2) {
          return { isCorrect: true, feedback: 'Teleportation protocol verified! Alice sampled Bell measurement outcomes, and the state was conveyed across the entangled channel.' };
        }
        return { isCorrect: false, feedback: 'Run the complete 3-qubit teleportation circuit.' };
      }
    }
  }
];
