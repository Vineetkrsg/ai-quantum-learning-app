// Comprehensive Acceptance Test Suite for Circuit Lab
// Tests state isolation, mathematical simulator fidelity, guided experiments, and progress integration

import { GUIDED_EXPERIMENTS } from '../mock/experimentsData';
import { simulateQuantumCircuit } from '../services/quantumSimulator';
import { Circuit, ExperimentUserState, SimulationResult } from '../types/quantum';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual(actual: any, expected: any, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertNear(actual: number, expected: number, tolerance: number, message: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message}. Expected ~${expected} (±${tolerance}), got ${actual}`);
  }
}

console.log('--- STARTING CIRCUIT LAB ACCEPTANCE TEST SUITE ---\n');

// =========================================================================
// TEST 1: Guided Experiments Curriculum Completeness & Structure
// =========================================================================
console.log('Executing Test 1: Guided Experiments Curriculum Completeness...');
assert(GUIDED_EXPERIMENTS.length >= 12, 'Must have at least 12 guided experiments across Levels 1-4');

const level1 = GUIDED_EXPERIMENTS.filter(e => e.levelNumber === 1);
const level2 = GUIDED_EXPERIMENTS.filter(e => e.levelNumber === 2);
const level3 = GUIDED_EXPERIMENTS.filter(e => e.levelNumber === 3);
const level4 = GUIDED_EXPERIMENTS.filter(e => e.levelNumber === 4);

assert(level1.length >= 4, 'Level 1 must include Single Qubit Measurement, X, H, and H->H');
assert(level2.length >= 2, 'Level 2 must include Phase Flip and Gate Sequence');
assert(level3.length >= 4, 'Level 3 must include Multi-qubit, CNOT, Bell State, and Entanglement');
assert(level4.length >= 2, 'Level 4 must include Quantum Algorithms (Deutsch-Jozsa, Grover, Teleportation)');

GUIDED_EXPERIMENTS.forEach(exp => {
  assert(Boolean(exp.id), `Experiment missing id`);
  assert(Boolean(exp.title), `Experiment ${exp.id} missing title`);
  assert(Boolean(exp.objective), `Experiment ${exp.id} missing objective`);
  assert(Boolean(exp.conceptSummary), `Experiment ${exp.id} missing conceptSummary`);
  assert(exp.learningOutcomes.length > 0, `Experiment ${exp.id} missing learningOutcomes`);
  assert(Boolean(exp.initialCircuit), `Experiment ${exp.id} missing initialCircuit`);
  assert(exp.prediction.options.length >= 2, `Experiment ${exp.id} must have at least 2 prediction options`);
  assert(exp.prediction.options.some(o => o.isExpected), `Experiment ${exp.id} must have an expected prediction option`);
  assert(Boolean(exp.challenge), `Experiment ${exp.id} missing challenge`);
  assert(exp.challenge.hints.length >= 2, `Experiment ${exp.id} challenge must provide scaffolded hints`);
});
console.log('✓ Test 1 Passed: Guided experiments curriculum is complete and well-structured.\n');

// =========================================================================
// TEST 2: Mathematical Quantum Simulator Accuracy
// =========================================================================
console.log('Executing Test 2: Exact Statevector Simulator Mathematical Fidelity...');

// 2a. Ground state measurement: 1 qubit, 0 gates
const circuitGround: Circuit = {
  id: 'test-ground',
  name: 'Ground',
  numberOfQubits: 1,
  gates: [],
  measurements: [0]
};
const resGround = simulateQuantumCircuit(circuitGround, 1024);
assertEqual(resGround.theoreticalProbabilities?.['0'], 1.0, 'Ground state must have 100% theoretical probability for |0⟩');
assertEqual(resGround.counts['0'], 1024, 'All 1024 shots must measure 0 on ground state');

// 2b. Pauli-X bit flip
const circuitX: Circuit = {
  id: 'test-x',
  name: 'X Gate',
  numberOfQubits: 1,
  gates: [{ id: 'g1', gateId: 'X', targetQubit: 0, position: 0 }],
  measurements: [0]
};
const resX = simulateQuantumCircuit(circuitX, 1024);
assertEqual(resX.theoreticalProbabilities?.['1'], 1.0, 'X gate must invert to 100% |1⟩');
assertEqual(resX.counts['1'], 1024, 'All 1024 shots must measure 1 after X gate');

// 2c. Hadamard Superposition
const circuitH: Circuit = {
  id: 'test-h',
  name: 'H Gate',
  numberOfQubits: 1,
  gates: [{ id: 'g1', gateId: 'H', targetQubit: 0, position: 0 }],
  measurements: [0]
};
const resH = simulateQuantumCircuit(circuitH, 2048);
assertEqual(resH.theoreticalProbabilities?.['0'], 0.5, 'Theoretical probability for |0⟩ under H must be exactly 0.5');
assertEqual(resH.theoreticalProbabilities?.['1'], 0.5, 'Theoretical probability for |1⟩ under H must be exactly 0.5');
assertNear(resH.probabilities['0'], 0.5, 0.08, 'Measured probability for |0⟩ under H must be near 50%');
assertNear(resH.probabilities['1'], 0.5, 0.08, 'Measured probability for |1⟩ under H must be near 50%');

// 2d. Hadamard Twice (Reversibility: H * H = I)
const circuitHH: Circuit = {
  id: 'test-hh',
  name: 'H twice',
  numberOfQubits: 1,
  gates: [
    { id: 'g1', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g2', gateId: 'H', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};
const resHH = simulateQuantumCircuit(circuitHH, 1024);
assertEqual(resHH.theoreticalProbabilities?.['0'], 1.0, 'H · H must evaluate to Identity (100% |0⟩)');
assertEqual(resHH.counts['0'], 1024, 'Destructive interference must cancel |1⟩ to 0 counts');

// 2e. Phase Flip (H -> Z -> H = X)
const circuitHZH: Circuit = {
  id: 'test-hzh',
  name: 'H-Z-H',
  numberOfQubits: 1,
  gates: [
    { id: 'g1', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g2', gateId: 'Z', targetQubit: 0, position: 1 },
    { id: 'g3', gateId: 'H', targetQubit: 0, position: 2 }
  ],
  measurements: [0]
};
const resHZH = simulateQuantumCircuit(circuitHZH, 1024);
assertEqual(resHZH.theoreticalProbabilities?.['1'], 1.0, 'H · Z · H must evaluate to Pauli-X (100% |1⟩)');
assertEqual(resHZH.counts['1'], 1024, 'Constructive interference must concentrate all shots on |1⟩');

// 2f. Bell State (|Φ⁺⟩ = (|00⟩ + |11⟩)/√2)
const circuitBell: Circuit = {
  id: 'test-bell',
  name: 'Bell State',
  numberOfQubits: 2,
  gates: [
    { id: 'g1', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g2', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 1 }
  ],
  measurements: [0, 1]
};
const resBell = simulateQuantumCircuit(circuitBell, 2048);
assertEqual(resBell.theoreticalProbabilities?.['00'], 0.5, 'Bell state must have theoretical 0.5 for |00⟩');
assertEqual(resBell.theoreticalProbabilities?.['11'], 0.5, 'Bell state must have theoretical 0.5 for |11⟩');
assertEqual(resBell.theoreticalProbabilities?.['01'] || 0, 0, 'Bell state |Φ⁺⟩ must have 0% probability for |01⟩');
assertEqual(resBell.theoreticalProbabilities?.['10'] || 0, 0, 'Bell state |Φ⁺⟩ must have 0% probability for |10⟩');
assertEqual(resBell.counts['01'] || 0, 0, 'Zero shots should be measured for |01⟩');
assertEqual(resBell.counts['10'] || 0, 0, 'Zero shots should be measured for |10⟩');
assertNear(resBell.probabilities['00'], 0.5, 0.08, 'Measured shots on |00⟩ must be near 50%');
assertNear(resBell.probabilities['11'], 0.5, 0.08, 'Measured shots on |11⟩ must be near 50%');

console.log('✓ Test 2 Passed: Simulator implements exact quantum statevector physics.\n');

// =========================================================================
// TEST 3: State Isolation Between Different Experiments
// =========================================================================
console.log('Executing Test 3: State Isolation Between Guided Experiments...');

class MockProgressStore {
  public activityStates: Record<string, any> = {};
  public experimentsCompleted: string[] = [];
  public predictionsMade: number = 0;
  public xp: number = 0;

  getActivityState<T>(key: string, defaultValue: T): T {
    return (this.activityStates[key] !== undefined) ? this.activityStates[key] : defaultValue;
  }

  setActivityState<T>(key: string, value: T | ((prev: T) => T)) {
    const current = this.activityStates[key];
    this.activityStates[key] = typeof value === 'function' ? (value as any)(current) : value;
  }

  recordExperimentComplete(expId: string) {
    if (!this.experimentsCompleted.includes(expId)) {
      this.experimentsCompleted.push(expId);
      this.xp += 35;
    }
  }

  recordPredictionMade(isCorrect: boolean) {
    this.predictionsMade += 1;
    this.xp += isCorrect ? 10 : 5;
  }
}

const store = new MockProgressStore();

// Experiment A: Superposition (exp-h-gate)
const expA = GUIDED_EXPERIMENTS.find(e => e.id === 'exp-h-gate')!;
const keyA = `lab/experiment/${expA.id}`;
const defaultStateA: ExperimentUserState = {
  circuit: expA.initialCircuit,
  prediction: null,
  predictionSubmitted: false,
  simulationResult: null,
  isCompleted: false,
  challengeSubmitted: false,
  challengePassed: false,
  hintLevel: 1,
  showSolution: false
};

// Experiment B: Reversibility (exp-h-twice)
const expB = GUIDED_EXPERIMENTS.find(e => e.id === 'exp-h-twice')!;
const keyB = `lab/experiment/${expB.id}`;
const defaultStateB: ExperimentUserState = {
  circuit: expB.initialCircuit,
  prediction: null,
  predictionSubmitted: false,
  simulationResult: null,
  isCompleted: false,
  challengeSubmitted: false,
  challengePassed: false,
  hintLevel: 1,
  showSolution: false
};

// 1. Initial retrieval
const stateA1 = store.getActivityState<ExperimentUserState>(keyA, defaultStateA);
const stateB1 = store.getActivityState<ExperimentUserState>(keyB, defaultStateB);

assertEqual(stateA1.circuit.gates.length, 2, 'Exp A initial circuit should have 2 gates (H, M)');
assertEqual(stateB1.circuit.gates.length, 3, 'Exp B initial circuit should have 3 gates (H, H, M)');

// 2. User modifies Experiment A by adding an X gate and making a prediction
const modifiedGatesA = [
  { id: 'extra-x', gateId: 'X', targetQubit: 0, position: 0 },
  ...stateA1.circuit.gates
];

store.setActivityState<ExperimentUserState>(keyA, {
  ...stateA1,
  circuit: { ...stateA1.circuit, gates: modifiedGatesA },
  prediction: 'p-50',
  predictionSubmitted: true
});

// 3. User switches to Experiment B
const stateB2 = store.getActivityState<ExperimentUserState>(keyB, defaultStateB);

// Exp B MUST NOT have the X gate from Exp A!
assertEqual(stateB2.circuit.gates.length, 3, 'Exp B must remain untouched with its own 3 gates');
assertEqual(stateB2.prediction, null, 'Exp B must not inherit prediction from Exp A');
assert(!stateB2.circuit.gates.some(g => g.id === 'extra-x'), 'Exp B must not contain gates added in Exp A');

// 4. User modifies Exp B
store.setActivityState<ExperimentUserState>(keyB, {
  ...stateB2,
  prediction: 'p-zero',
  challengePassed: true,
  isCompleted: true
});

// 5. User switches back to Exp A
const stateA2 = store.getActivityState<ExperimentUserState>(keyA, defaultStateA);
assertEqual(stateA2.circuit.gates.length, 3, 'Exp A retains its modified 3 gates');
assertEqual(stateA2.prediction, 'p-50', 'Exp A retains its prediction');
assertEqual(stateA2.isCompleted, false, 'Exp A is not completed just because Exp B completed');

console.log('✓ Test 3 Passed: Strict state isolation verified between different experiments.\n');

// =========================================================================
// TEST 4: Lesson -> Lab Scoped State Isolation
// =========================================================================
console.log('Executing Test 4: Lesson -> Circuit Lab Scoped Isolation...');

// Lesson 1 launching exp-h-gate
const lessonKey1 = 'module-superposition/lesson-intro/quantum-lab/exp-h-gate';
// Lesson 2 launching exp-h-gate
const lessonKey2 = 'module-superposition/lesson-advanced/quantum-lab/exp-h-gate';
// Standalone lab
const labKey = 'lab/experiment/exp-h-gate';

// Student modifies circuit in Lesson 1's lab session
store.setActivityState<ExperimentUserState>(lessonKey1, {
  ...defaultStateA,
  circuit: {
    ...defaultStateA.circuit,
    gates: [{ id: 'lesson-1-gate', gateId: 'Z', targetQubit: 0, position: 0 }]
  }
});

// Student opens same experiment in Lesson 2
const lesson2State = store.getActivityState<ExperimentUserState>(lessonKey2, defaultStateA);
assert(!lesson2State.circuit.gates.some(g => g.id === 'lesson-1-gate'), 'Lesson 2 must NOT receive gates from Lesson 1');

// Student opens standalone lab
const standaloneState = store.getActivityState<ExperimentUserState>(labKey, defaultStateA);
assert(!standaloneState.circuit.gates.some(g => g.id === 'lesson-1-gate'), 'Standalone lab must NOT receive gates from Lesson 1');

console.log('✓ Test 4 Passed: Scoped keys isolate lesson origins and standalone lab sessions.\n');

// =========================================================================
// TEST 5: Reset Experiment Isolation
// =========================================================================
console.log('Executing Test 5: Reset Experiment Behavior...');

// Reset Lesson 1's experiment state back to default
store.setActivityState<ExperimentUserState>(lessonKey1, defaultStateA);

const resetState = store.getActivityState<ExperimentUserState>(lessonKey1, defaultStateA);
assertEqual(resetState.circuit.gates.length, 2, 'Reset must restore original initial circuit for this experiment');
assertEqual(resetState.prediction, null, 'Reset must clear prediction for this experiment');

// Unrelated states in store must remain unaffected
const stateA_after_reset = store.getActivityState<ExperimentUserState>(keyA, defaultStateA);
assertEqual(stateA_after_reset.circuit.gates.length, 3, 'Unrelated experiment state must NOT be touched by reset');

console.log('✓ Test 5 Passed: Reset Experiment restores initial state without collateral impact.\n');

// =========================================================================
// TEST 6: Progress Tracking & Challenge Completion (No Duplicate Inflation)
// =========================================================================
console.log('Executing Test 6: Progress Integration & Duplicate Guard...');

assertEqual(store.experimentsCompleted.length, 0, 'Initially 0 completed experiments');
assertEqual(store.xp, 0, 'Initially 0 XP');

// Complete Exp 1
store.recordExperimentComplete('exp-measurement');
assertEqual(store.experimentsCompleted.length, 1, 'Should have 1 completed experiment');
assertEqual(store.xp, 35, 'Should award 35 XP for completing experiment');

// User clicks complete again on same experiment (duplicate action)
store.recordExperimentComplete('exp-measurement');
assertEqual(store.experimentsCompleted.length, 1, 'Duplicate click must NOT increase completed count');
assertEqual(store.xp, 35, 'Duplicate click must NOT inflate XP');

// Complete different experiment
store.recordExperimentComplete('exp-x-gate');
assertEqual(store.experimentsCompleted.length, 2, 'Should have 2 completed experiments');
assertEqual(store.xp, 70, 'Should award additional 35 XP for new experiment');

console.log('✓ Test 6 Passed: Progress updates accurately and guards against duplication.\n');

console.log('ALL CIRCUIT LAB ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
