import { QuantumGate } from '../types/quantum';

export const QUANTUM_GATES: QuantumGate[] = [
  {
    id: 'H',
    name: 'Hadamard',
    symbol: 'H',
    description: 'Creates an equal superposition state: H|0⟩ = (|0⟩+|1⟩)/√2',
    numberOfQubits: 1,
    category: 'single',
    color: 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-500/40 dark:border-cyan-500/50 hover:bg-cyan-500/25 dark:hover:bg-cyan-500/30',
    matrixLabel: '[[1, 1], [1, -1]] / √2'
  },
  {
    id: 'X',
    name: 'Pauli-X (NOT)',
    symbol: 'X',
    description: 'Quantum bit-flip gate: X|0⟩ = |1⟩, X|1⟩ = |0⟩',
    numberOfQubits: 1,
    category: 'single',
    color: 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 dark:border-emerald-500/50 hover:bg-emerald-500/25 dark:hover:bg-emerald-500/30',
    matrixLabel: '[[0, 1], [1, 0]]'
  },
  {
    id: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    description: 'Bit and phase flip: Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩',
    numberOfQubits: 1,
    category: 'single',
    color: 'bg-teal-500/15 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border-teal-500/40 dark:border-teal-500/50 hover:bg-teal-500/25 dark:hover:bg-teal-500/30',
    matrixLabel: '[[0, -i], [i, 0]]'
  },
  {
    id: 'Z',
    name: 'Pauli-Z (Phase)',
    symbol: 'Z',
    description: 'Phase flip gate: Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩',
    numberOfQubits: 1,
    category: 'phase',
    color: 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/40 dark:border-blue-500/50 hover:bg-blue-500/25 dark:hover:bg-blue-500/30',
    matrixLabel: '[[1, 0], [0, -1]]'
  },
  {
    id: 'S',
    name: 'Phase (S)',
    symbol: 'S',
    description: 'Phase shift of π/2: S = √Z',
    numberOfQubits: 1,
    category: 'phase',
    color: 'bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-500/40 dark:border-indigo-500/50 hover:bg-indigo-500/25 dark:hover:bg-indigo-500/30',
    matrixLabel: '[[1, 0], [0, i]]'
  },
  {
    id: 'T',
    name: 'π/8 (T)',
    symbol: 'T',
    description: 'Phase shift of π/4: T = √S',
    numberOfQubits: 1,
    category: 'phase',
    color: 'bg-violet-500/15 dark:bg-violet-500/20 text-violet-800 dark:text-violet-300 border-violet-500/40 dark:border-violet-500/50 hover:bg-violet-500/25 dark:hover:bg-violet-500/30',
    matrixLabel: '[[1, 0], [0, e^(iπ/4)]]'
  },
  {
    id: 'CNOT',
    name: 'Controlled-NOT',
    symbol: 'CX',
    description: 'Flips target qubit if and only if control qubit is |1⟩',
    numberOfQubits: 2,
    category: 'two-qubit',
    color: 'bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/40 dark:border-purple-500/50 hover:bg-purple-500/25 dark:hover:bg-purple-500/30',
    matrixLabel: '4x4 Permutation Matrix'
  },
  {
    id: 'SWAP',
    name: 'SWAP',
    symbol: 'SW',
    description: 'Exchanges the states of two qubits',
    numberOfQubits: 2,
    category: 'two-qubit',
    color: 'bg-fuchsia-500/15 dark:bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-500/40 dark:border-fuchsia-500/50 hover:bg-fuchsia-500/25 dark:hover:bg-fuchsia-500/30',
    matrixLabel: '4x4 SWAP Matrix'
  },
  {
    id: 'M',
    name: 'Measurement',
    symbol: '⊚',
    description: 'Measures qubit into classical bit register',
    numberOfQubits: 1,
    category: 'measure',
    color: 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 dark:border-amber-500/50 hover:bg-amber-500/25 dark:hover:bg-amber-500/30',
    matrixLabel: 'Projective Measurement'
  }
];
