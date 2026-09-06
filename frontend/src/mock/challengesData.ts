import { Challenge } from '../types/challenges';

export const CHALLENGES_DATA: Challenge[] = [
  {
    id: 'chal-1',
    title: 'Superposition Challenge',
    description: 'Prepare a single qubit in the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2 and verify 50/50 measurement probabilities.',
    difficulty: 'Easy',
    category: 'Fundamentals',
    xp: 150,
    estimatedMinutes: 10,
    expectedResult: 'Prob(|0⟩) ≈ 0.50, Prob(|1⟩) ≈ 0.50',
    hint: 'Apply a single Hadamard (H) gate to the default |0⟩ state.',
    isCompleted: false,
    targetGateCount: 1
  },
  {
    id: 'chal-2',
    title: 'Quantum Gates Puzzle',
    description: 'Transform initial state |0⟩ into state |-⟩ = (|0⟩ - |1⟩)/√2 using no more than two gate operations.',
    difficulty: 'Medium',
    category: 'Unitary Operations',
    xp: 250,
    estimatedMinutes: 15,
    expectedResult: 'State vector phase offset π on basis |1⟩',
    hint: 'Remember that |-⟩ = X·H|0⟩ or H·Z|0⟩. Think about bit-flip vs phase-flip sequences.',
    isCompleted: false,
    targetGateCount: 2
  },
  {
    id: 'chal-3',
    title: 'Bell State Construction',
    description: 'Construct the maximally entangled Einstein-Podolsky-Rosen (EPR) pair: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 with zero probability of |01⟩ or |10⟩.',
    difficulty: 'Medium',
    category: 'Entanglement',
    xp: 350,
    estimatedMinutes: 20,
    expectedResult: 'Counts exclusively distributed between |00⟩ and |11⟩',
    hint: 'First put Qubit 0 into superposition with an H gate, then entangle with Qubit 1 using a CNOT gate (Q0 control, Q1 target).',
    isCompleted: false,
    targetGateCount: 2
  },
  {
    id: 'chal-4',
    title: 'Quantum Circuit Basics',
    description: 'Design a 3-qubit circuit that flips Qubit 2 if and only if Qubit 0 and Qubit 1 are both in state |1⟩ (Toffoli / CCX decomposition).',
    difficulty: 'Hard',
    category: 'Circuit Synthesis',
    xp: 500,
    estimatedMinutes: 30,
    expectedResult: '|110⟩ → |111⟩ and |100⟩ remains |100⟩',
    hint: 'Decompose the 3-qubit controlled gate using H, CNOT, and T/T† gates.',
    isCompleted: false,
    targetGateCount: 6
  }
];
