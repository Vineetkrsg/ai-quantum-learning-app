import { Circuit } from '../types/quantum';

export const SAMPLE_CIRCUITS: Circuit[] = [
  {
    id: 'single-qubit-h',
    name: 'Superposition (H Gate)',
    numberOfQubits: 1,
    gates: [
      { id: 'g-1', gateId: 'H', targetQubit: 0, position: 0 },
      { id: 'g-2', gateId: 'M', targetQubit: 0, position: 1 },
    ],
    measurements: [0]
  },
  {
    id: 'single-qubit-x',
    name: 'Bit-Flip (Pauli-X)',
    numberOfQubits: 1,
    gates: [
      { id: 'g-1', gateId: 'X', targetQubit: 0, position: 0 },
      { id: 'g-2', gateId: 'M', targetQubit: 0, position: 1 },
    ],
    measurements: [0]
  },
  {
    id: 'measurement-demo',
    name: 'Ground State Measurement',
    numberOfQubits: 1,
    gates: [
      { id: 'g-1', gateId: 'M', targetQubit: 0, position: 0 },
    ],
    measurements: [0]
  },
  {
    id: 'phase-gate-demo',
    name: 'Phase Flip (H + Z)',
    numberOfQubits: 1,
    gates: [
      { id: 'g-1', gateId: 'H', targetQubit: 0, position: 0 },
      { id: 'g-2', gateId: 'Z', targetQubit: 0, position: 1 },
      { id: 'g-3', gateId: 'M', targetQubit: 0, position: 2 },
    ],
    measurements: [0]
  },
  {
    id: 'circuit-order-demo',
    name: 'Sequence (H + X)',
    numberOfQubits: 1,
    gates: [
      { id: 'g-1', gateId: 'H', targetQubit: 0, position: 0 },
      { id: 'g-2', gateId: 'X', targetQubit: 0, position: 1 },
      { id: 'g-3', gateId: 'M', targetQubit: 0, position: 2 },
    ],
    measurements: [0]
  },
  {
    id: 'bell-state',
    name: 'Bell State (|Φ⁺⟩)',
    numberOfQubits: 2,
    gates: [
      { id: 'g-1', gateId: 'H', targetQubit: 0, position: 0 },
      { id: 'g-2', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 1 },
      { id: 'g-3', gateId: 'M', targetQubit: 0, position: 2 },
      { id: 'g-4', gateId: 'M', targetQubit: 1, position: 2 }
    ],
    measurements: [0, 1]
  },
  {
    id: 'deutsch-jozsa-intro',
    name: 'Deutsch-Jozsa Simplified Oracle',
    numberOfQubits: 2,
    gates: [
      { id: 'g-1', gateId: 'X', targetQubit: 1, position: 0 },
      { id: 'g-2', gateId: 'H', targetQubit: 0, position: 1 },
      { id: 'g-3', gateId: 'H', targetQubit: 1, position: 1 },
      { id: 'g-4', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 2 },
      { id: 'g-5', gateId: 'H', targetQubit: 0, position: 3 },
      { id: 'g-6', gateId: 'M', targetQubit: 0, position: 4 }
    ],
    measurements: [0]
  },
  {
    id: 'superposition-demo',
    name: 'Superposition 3-Qubit',
    numberOfQubits: 3,
    gates: [
      { id: 'g-1', gateId: 'H', targetQubit: 0, position: 0 },
      { id: 'g-2', gateId: 'H', targetQubit: 1, position: 0 },
      { id: 'g-3', gateId: 'H', targetQubit: 2, position: 0 },
      { id: 'g-4', gateId: 'M', targetQubit: 0, position: 1 },
      { id: 'g-5', gateId: 'M', targetQubit: 1, position: 1 },
      { id: 'g-6', gateId: 'M', targetQubit: 2, position: 1 }
    ],
    measurements: [0, 1, 2]
  }
];
