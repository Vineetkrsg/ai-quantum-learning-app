// Acceptance Test Suite for Advanced 2D/3D Visualizations,
// Circuit Step Propagation, and Granular Concept-Isolated Adaptive Content.

import { simulateCircuitSteps } from '../services/quantumSimulator';
import { Circuit } from '../types/quantum';
import {
  evaluateAdaptiveProfile,
  getAuthoredAdaptiveContent,
  normalizeConceptKey
} from '../services/adaptiveEngine';

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

console.log('--- STARTING ADVANCED VISUALIZATIONS & ADAPTIVE CONTENT TEST SUITE ---\n');

// =========================================================================
// TEST 1: Single-Qubit State Propagation Through Circuit
// =========================================================================
console.log('Executing Test 1: Single-Qubit Step-by-Step State Propagation...');

const singleQubitCircuit: Circuit = {
  id: 'test-h-x',
  name: 'H then X Circuit',
  numberOfQubits: 1,
  gates: [
    { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g1', gateId: 'X', targetQubit: 0, position: 1 },
    { id: 'm0', gateId: 'M', targetQubit: 0, position: 2 }
  ],
  measurements: [0]
};

const singleSteps = simulateCircuitSteps(singleQubitCircuit);
assertEqual(singleSteps.length, 4, '1 initial step + 3 gate operations must yield exactly 4 steps');

// Step 0: Initial Ground State
assertEqual(singleSteps[0].stepIndex, 0, 'Step 0 must be initial ground state');
assertEqual(singleSteps[0].theoreticalProbabilities['0'], 1.0, 'Initial state must be 100% |0⟩');
assertEqual(singleSteps[0].blochCoordinates?.z, 1, 'Initial state must point to North Pole (z=1)');

// Step 1: After H
assertEqual(singleSteps[1].stepIndex, 1, 'Step 1 must be after H gate');
assertEqual(singleSteps[1].theoreticalProbabilities['0'], 0.5, 'After H, probability of 0 must be 0.5');
assertEqual(singleSteps[1].theoreticalProbabilities['1'], 0.5, 'After H, probability of 1 must be 0.5');
assert(Math.abs(singleSteps[1].blochCoordinates?.z || 0) < 0.01, 'Equator state must have z=0');

// Step 2: After X
assertEqual(singleSteps[2].stepIndex, 2, 'Step 2 must be after X gate');
assert(singleSteps[2].description.includes('Pauli-X'), 'Step 2 description must explain Pauli-X inversion');

// Step 3: Measurement Readout
assertEqual(singleSteps[3].stepIndex, 3, 'Step 3 must be measurement readout');
assert(singleSteps[3].description.includes('Projective readout'), 'Step 3 must explain measurement collapse');

console.log('✓ Test 1 Passed: Single-qubit state propagation executes with mathematical fidelity.\n');

// =========================================================================
// TEST 2: Two-Qubit Bell State Propagation & Entanglement Concurrence
// =========================================================================
console.log('Executing Test 2: Two-Qubit Bell State Propagation & Concurrence...');

const bellCircuit: Circuit = {
  id: 'test-bell',
  name: 'Bell State Synthesis',
  numberOfQubits: 2,
  gates: [
    { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g1', gateId: 'CNOT', controlQubit: 0, targetQubit: 1, position: 1 },
    { id: 'm0', gateId: 'M', targetQubit: 0, position: 2 },
    { id: 'm1', gateId: 'M', targetQubit: 1, position: 2 }
  ],
  measurements: [0, 1]
};

const bellSteps = simulateCircuitSteps(bellCircuit);
assertEqual(bellSteps.length, 5, 'Initial + H + CNOT + 2 Measurements = 5 steps');

// Step 0: |00⟩
assertEqual(bellSteps[0].isEntangled, false, 'Initial |00⟩ state must not be entangled');
assertEqual(bellSteps[0].theoreticalProbabilities['00'], 1.0, 'Initial state is pure |00⟩');

// Step 1: After H on q0 -> (|00⟩ + |10⟩)/√2 (Product state, unentangled)
assertEqual(bellSteps[1].isEntangled, false, 'Superposition on 1 qubit without interaction is not entangled');
assertEqual(bellSteps[1].theoreticalProbabilities['00'], 0.5, 'Prob(00) = 0.5');
assertEqual(bellSteps[1].theoreticalProbabilities['10'], 0.5, 'Prob(10) = 0.5');

// Step 2: After CNOT(q0 -> q1) -> (|00⟩ + |11⟩)/√2 (Maximally Entangled Bell State!)
assertEqual(bellSteps[2].isEntangled, true, 'CNOT on superposition must produce genuine quantum entanglement');
assertEqual(bellSteps[2].theoreticalProbabilities['00'], 0.5, 'Bell state Prob(00) = 0.5');
assertEqual(bellSteps[2].theoreticalProbabilities['11'], 0.5, 'Bell state Prob(11) = 0.5');
assertEqual(bellSteps[2].theoreticalProbabilities['01'], 0.0, 'Bell state Prob(01) must be strictly 0');
assertEqual(bellSteps[2].theoreticalProbabilities['10'], 0.0, 'Bell state Prob(10) must be strictly 0');
assert(bellSteps[2].description.includes('entanglement'), 'Description must document non-separable entanglement');

console.log('✓ Test 2 Passed: Multi-qubit entanglement concurrence accurately detected.\n');

// =========================================================================
// TEST 3: Normalized Concept Mapping Resolution
// =========================================================================
console.log('Executing Test 3: Concept Normalization Resolution...');

assertEqual(normalizeConceptKey('superposition'), 'superposition', 'superposition maps to superposition');
assertEqual(normalizeConceptKey('sup-2 hadamard gate'), 'superposition', 'hadamard maps to superposition');
assertEqual(normalizeConceptKey('entanglement bell state'), 'entanglement', 'bell state maps to entanglement');
assertEqual(normalizeConceptKey('gates pauli-x'), 'gates', 'pauli maps to gates');
assertEqual(normalizeConceptKey('grovers-search algorithms'), 'algorithms', 'grovers maps to algorithms');
assertEqual(normalizeConceptKey('circuit wire propagation'), 'circuits', 'propagation maps to circuits');
assertEqual(normalizeConceptKey('qubit bloch sphere'), 'qubits', 'qubit maps to qubits');

console.log('✓ Test 3 Passed: Concept normalization is consistent and robust.\n');

// =========================================================================
// TEST 4: Authored Adaptive Content Structure Across Modes
// =========================================================================
console.log('Executing Test 4: Authored Adaptive Content Dynamic Changing...');

const contentReinforce = getAuthoredAdaptiveContent('superposition', 'reinforcement');
assertEqual(contentReinforce.mode, 'reinforcement', 'Mode is reinforcement');
assert(
  contentReinforce.leadParagraph.includes("Let's simplify this"),
  'Reinforcement content starts with simplified explanation'
);
assert(
  Boolean(contentReinforce.stepByStepBreakdown && contentReinforce.stepByStepBreakdown.length >= 3),
  'Reinforcement content contains step-by-step breakdown'
);

const contentExtension = getAuthoredAdaptiveContent('superposition', 'extension');
assertEqual(contentExtension.mode, 'extension', 'Mode is extension');
assert(
  contentExtension.leadParagraph.includes('demonstrated strong conceptual understanding'),
  'Extension content acknowledges strong mastery'
);
assert(
  Boolean(contentExtension.mathematicalIntuition && contentExtension.mathematicalIntuition.includes('Unitary Proof')),
  'Extension content provides rigorous mathematical intuition'
);

const contentStandard = getAuthoredAdaptiveContent('superposition', 'standard');
assertEqual(contentStandard.mode, 'standard', 'Mode is standard');
assert(
  Boolean(contentStandard.keyPoints && contentStandard.keyPoints.length > 0),
  'Standard content provides core principles'
);

console.log('✓ Test 4 Passed: Authored content dynamically shifts presentation across all 3 modes.\n');

// =========================================================================
// TEST 5: Concept-Level Isolation in Adaptive Evaluations
// =========================================================================
console.log('Executing Test 5: Concept-Level Adaptive Isolation...');

// Learner struggling with Superposition
const superposStruggle = evaluateAdaptiveProfile('superposition', 'sup-1', {
  conceptId: 'superposition',
  mode: 'reinforcement',
  attemptCount: 3,
  mistakeCount: 2,
  correctCount: 1,
  consecutiveSuccesses: 0,
  updatedAt: new Date().toISOString()
});

// Learner doing great with Quantum Gates
const gatesMastery = evaluateAdaptiveProfile('gates', 'gat-1', {
  conceptId: 'gates',
  mode: 'extension',
  attemptCount: 1,
  mistakeCount: 0,
  correctCount: 1,
  consecutiveSuccesses: 1,
  updatedAt: new Date().toISOString()
});

assertEqual(superposStruggle.mode, 'reinforcement', 'Superposition evaluated as reinforcement');
assertEqual(gatesMastery.mode, 'extension', 'Gates evaluated as extension');
assert(
  superposStruggle.mode !== gatesMastery.mode,
  'Struggling in superposition must NOT downgrade unrelated concepts like gates'
);

console.log('✓ Test 5 Passed: Concept-specific tracking strictly isolates learner states.\n');

console.log('================================================================');
console.log('ALL 5 ADVANCED VISUALIZATION & PROPAGATION TESTS PASSED!');
console.log('================================================================\n');
