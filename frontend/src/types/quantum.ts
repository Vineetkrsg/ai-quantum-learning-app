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
  theoreticalProbabilities?: Record<string, number>;
  blochCoordinates?: { theta: number; phi: number; x: number; y: number; z: number };
  stateVector?: StateVectorElement[];
  executionTimeMs: number;
  shots: number;
  timestamp?: string;
}

export type ExperimentLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ExperimentPredictionOption {
  id: string;
  label: string;
  isExpected: boolean;
  feedback: string;
}

export interface ExperimentChallenge {
  id: string;
  title: string;
  instruction: string;
  objective: string;
  hints: string[];
  solutionGates?: string[];
  validator: (circuit: Circuit, result: SimulationResult) => { isCorrect: boolean; feedback: string };
}

export interface GuidedExperiment {
  id: string;
  title: string;
  level: ExperimentLevel;
  levelNumber: 1 | 2 | 3 | 4;
  categoryTitle: string;
  objective: string;
  conceptSummary: string;
  learningOutcomes: string[];
  initialCircuit: Circuit;
  availableGates: string[];
  prediction: {
    question: string;
    options: ExperimentPredictionOption[];
  };
  expectedBehavior: {
    description: string;
    targetProbabilities: Record<string, number>;
  };
  interpretation: string;
  visualizationType: 'single-qubit' | 'superposition' | 'bit-flip' | 'bell-state' | 'entanglement' | 'algorithm';
  challenge: ExperimentChallenge;
  comparisonWith?: string;
  nextExperimentId?: string;
  isEducationalDemo?: boolean;
  educationalNotes?: string;
}

export interface ExperimentUserState {
  circuit: Circuit;
  prediction: string | null;
  predictionSubmitted: boolean;
  simulationResult: SimulationResult | null;
  isCompleted: boolean;
  challengeSubmitted: boolean;
  challengePassed: boolean;
  challengeFeedback?: string;
  hintLevel: number;
  showSolution: boolean;
}

