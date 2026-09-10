import { QuantumGate } from '../types/quantum';

export const QUANTUM_GATES: QuantumGate[] = [
  {
    id: 'H',
    name: 'Hadamard',
    symbol: 'H',
    description: 'Creates an equal superposition state: H|0⟩ = (|0⟩+|1⟩)/√2',
    numberOfQubits: 1,
    category: 'single',
    color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-500/50 hover:bg-teal-100 dark:hover:bg-teal-900/60',
    matrixLabel: '[[1, 1], [1, -1]] / √2'
  },
  {
    id: 'X',
    name: 'Pauli-X (NOT)',
    symbol: 'X',
    description: 'Quantum bit-flip gate: X|0⟩ = |1⟩, X|1⟩ = |0⟩',
    numberOfQubits: 1,
    category: 'single',
    color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60',
    matrixLabel: '[[0, 1], [1, 0]]'
  },
  {
    id: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    description: 'Bit and phase flip: Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩',
    numberOfQubits: 1,
    category: 'single',
    color: 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-500/50 hover:bg-teal-100 dark:hover:bg-teal-900/50',
    matrixLabel: '[[0, -i], [i, 0]]'
  },
  {
    id: 'Z',
    name: 'Pauli-Z (Phase)',
    symbol: 'Z',
    description: 'Phase flip gate: Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩',
    numberOfQubits: 1,
    category: 'phase',
    color: 'bg-slate-100 dark:bg-[#1b2636] text-slate-900 dark:text-[#e6edf4] border-slate-300 dark:border-[#2b3a4f] hover:bg-slate-200 dark:hover:bg-[#223145]',
    matrixLabel: '[[1, 0], [0, -1]]'
  },
  {
    id: 'S',
    name: 'Phase (S)',
    symbol: 'S',
    description: 'Phase shift of π/2: S = √Z',
    numberOfQubits: 1,
    category: 'phase',
    color: 'bg-slate-100 dark:bg-[#1b2636] text-slate-900 dark:text-[#e6edf4] border-slate-300 dark:border-[#2b3a4f] hover:bg-slate-200 dark:hover:bg-[#223145]',
    matrixLabel: '[[1, 0], [0, i]]'
  },
  {
    id: 'T',
    name: 'π/8 (T)',
    symbol: 'T',
    description: 'Phase shift of π/4: T = √S',
    numberOfQubits: 1,
    category: 'phase',
    color: 'bg-slate-100 dark:bg-[#1b2636] text-slate-900 dark:text-[#e6edf4] border-slate-300 dark:border-[#2b3a4f] hover:bg-slate-200 dark:hover:bg-[#223145]',
    matrixLabel: '[[1, 0], [0, e^(iπ/4)]]'
  },
  {
    id: 'CNOT',
    name: 'Controlled-NOT',
    symbol: 'CX',
    description: 'Flips target qubit if and only if control qubit is |1⟩',
    numberOfQubits: 2,
    category: 'two-qubit',
    color: 'bg-slate-100 dark:bg-[#1b2636] text-slate-900 dark:text-teal-300 border-slate-300 dark:border-teal-600/50 hover:bg-slate-200 dark:hover:bg-[#223145]',
    matrixLabel: '4x4 Permutation Matrix'
  },
  {
    id: 'SWAP',
    name: 'SWAP',
    symbol: 'SW',
    description: 'Exchanges the states of two qubits',
    numberOfQubits: 2,
    category: 'two-qubit',
    color: 'bg-slate-100 dark:bg-[#1b2636] text-slate-900 dark:text-slate-200 border-slate-300 dark:border-[#2b3a4f] hover:bg-slate-200 dark:hover:bg-[#223145]',
    matrixLabel: '4x4 SWAP Matrix'
  },
  {
    id: 'M',
    name: 'Measurement',
    symbol: '⊚',
    description: 'Measures qubit into classical bit register',
    numberOfQubits: 1,
    category: 'measure',
    color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-900/50',
    matrixLabel: 'Projective Measurement'
  }
];

