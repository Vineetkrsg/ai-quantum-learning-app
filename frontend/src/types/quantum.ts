export type GateCategory = 'single' | 'two-qubit' | 'phase' | 'measure';

export interface QuantumGate {
  id: string;
  name: string;
  symbol: string;
  description: string;
  numberOfQubits: number;
  category: GateCategory;
  color: string;
  matrixLabel?: string;
}

export interface GateOperation {
  id: string;
  gateId: string;
  targetQubit: number;
  controlQubit?: number;
  position: number; // column/step index on the circuit grid
  params?: Record<string, number>;
}

export interface Circuit {
  id: string;
  name: string;
  numberOfQubits: number;
  gates: GateOperation[];
  measurements: number[];
}

export interface StateVectorElement {
  state: string;
  real: number;
  imag: number;
  probability: number;
}

export interface SimulationResult {
  circuitId?: string;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
  stateVector?: StateVectorElement[];
  executionTimeMs: number;
  shots: number;
  timestamp?: string;
}
