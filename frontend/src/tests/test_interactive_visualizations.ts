// Acceptance Test Suite for Interactive Quantum Visualization Layer
// Tests mathematical statevector fidelity, Bloch sphere coordinate mapping,
// quantum gate state transformations, entanglement correlation, and measurement sampling.

import { simulateQuantumCircuit } from '../services/quantumSimulator';
import { Circuit } from '../types/quantum';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertNear(actual: number, expected: number, tolerance: number, message: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message}. Expected ~${expected} (±${tolerance}), got ${actual}`);
  }
}

console.log('--- STARTING INTERACTIVE QUANTUM VISUALIZATION ACCEPTANCE TEST SUITE ---\n');

// =========================================================================
// TEST 1: Simulator to Bloch Sphere Coordinate Mapping Fidelity
// =========================================================================
console.log('Executing Test 1: Bloch Sphere Coordinates for Canonical States...');

// Case A: Ground state |0⟩
const groundCircuit: Circuit = {
  id: 'c-ground',
  name: 'Ground State',
  numberOfQubits: 1,
  gates: [],
  measurements: [0]
};
const groundRes = simulateQuantumCircuit(groundCircuit, 1024);
assert(Boolean(groundRes.blochCoordinates), 'Single-qubit simulation must compute blochCoordinates');
assertNear(groundRes.blochCoordinates!.theta, 0, 0.01, '|0⟩ must have polar angle theta = 0 (North Pole)');
assertNear(groundRes.blochCoordinates!.z, 1, 0.01, '|0⟩ must have Cartesian z = +1.0');
assertNear(groundRes.theoreticalProbabilities!['0'], 1.0, 0.001, '|0⟩ must have 100% theoretical probability in state 0');

// Case B: Excited state |1⟩ (X gate)
const excitedCircuit: Circuit = {
  id: 'c-excited',
  name: 'Excited State',
  numberOfQubits: 1,
  gates: [{ id: 'g0', gateId: 'X', targetQubit: 0, position: 0 }],
  measurements: [0]
};
const excitedRes = simulateQuantumCircuit(excitedCircuit, 1024);
assertNear(excitedRes.blochCoordinates!.theta, Math.PI, 0.01, '|1⟩ must have polar angle theta = π (South Pole)');
assertNear(excitedRes.blochCoordinates!.z, -1, 0.01, '|1⟩ must have Cartesian z = -1.0');
assertNear(excitedRes.theoreticalProbabilities!['1'], 1.0, 0.001, '|1⟩ must have 100% theoretical probability in state 1');

// Case C: Superposition state |+⟩ (H gate)
const superposCircuit: Circuit = {
  id: 'c-superpos',
  name: 'Superposition State',
  numberOfQubits: 1,
  gates: [{ id: 'g0', gateId: 'H', targetQubit: 0, position: 0 }],
  measurements: [0]
};
const superposRes = simulateQuantumCircuit(superposCircuit, 1024);
assertNear(superposRes.blochCoordinates!.theta, Math.PI / 2, 0.01, '|+⟩ must have polar angle theta = π/2 (Equator)');
assertNear(superposRes.blochCoordinates!.phi, 0, 0.01, '|+⟩ must have azimuth phi = 0');
assertNear(superposRes.blochCoordinates!.x, 1, 0.01, '|+⟩ must have Cartesian x = +1.0');
assertNear(superposRes.blochCoordinates!.z, 0, 0.01, '|+⟩ must have Cartesian z = 0');
assertNear(superposRes.theoreticalProbabilities!['0'], 0.5, 0.001, '|+⟩ theoretical prob(0) must be 50%');
assertNear(superposRes.theoreticalProbabilities!['1'], 0.5, 0.001, '|+⟩ theoretical prob(1) must be 50%');

console.log('✓ Test 1 Passed: Exact Bloch sphere coordinates verified for |0⟩, |1⟩, and |+⟩.\n');

// =========================================================================
// TEST 2: Quantum Gate State Transformations (H, X, Y, Z, S, T)
// =========================================================================
console.log('Executing Test 2: Gate State Transformations & Relative Phase...');

// Pauli-Z preserves |0⟩
const zGroundCircuit: Circuit = {
  id: 'c-z-ground',
  name: 'Z on Ground',
  numberOfQubits: 1,
  gates: [{ id: 'g0', gateId: 'Z', targetQubit: 0, position: 0 }],
  measurements: [0]
};
const zGroundRes = simulateQuantumCircuit(zGroundCircuit, 1024);
assertNear(zGroundRes.theoreticalProbabilities!['0'], 1.0, 0.001, 'Z|0⟩ must leave ground state unchanged');

// Pauli-Z on |+⟩ flips to |-⟩ (relative phase shift of π on equator)
const zPlusCircuit: Circuit = {
  id: 'c-z-plus',
  name: 'Z on Plus',
  numberOfQubits: 1,
  gates: [
    { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g1', gateId: 'Z', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};
const zPlusRes = simulateQuantumCircuit(zPlusCircuit, 1024);
assertNear(zPlusRes.blochCoordinates!.theta, Math.PI / 2, 0.01, 'Z|+⟩ = |-⟩ remains on equator');
assertNear(zPlusRes.blochCoordinates!.phi, Math.PI, 0.01, 'Z|+⟩ = |-⟩ has azimuth phase phi = π');
assertNear(zPlusRes.blochCoordinates!.x, -1, 0.01, 'Z|+⟩ = |-⟩ points to -X on unit sphere');

// S gate (pi/2 phase gate) on |+⟩ gives |+i⟩ (phi = pi/2)
const sPlusCircuit: Circuit = {
  id: 'c-s-plus',
  name: 'S on Plus',
  numberOfQubits: 1,
  gates: [
    { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g1', gateId: 'S', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};
const sPlusRes = simulateQuantumCircuit(sPlusCircuit, 1024);
assertNear(sPlusRes.blochCoordinates!.phi, Math.PI / 2, 0.01, 'S|+⟩ must shift phase to phi = π/2 (+Y axis)');
assertNear(sPlusRes.blochCoordinates!.y, 1, 0.01, 'S|+⟩ points to +Y on Bloch sphere');

console.log('✓ Test 2 Passed: Gate transformations strictly rotate statevector in Bloch Hilbert space.\n');

// =========================================================================
// TEST 3: Wave Interference Reversibility (H · H = I)
// =========================================================================
console.log('Executing Test 3: Wave Interference Reversibility...');

const hDoubleCircuit: Circuit = {
  id: 'c-h-double',
  name: 'H -> H Double Gate',
  numberOfQubits: 1,
  gates: [
    { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g1', gateId: 'H', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};
const hDoubleRes = simulateQuantumCircuit(hDoubleCircuit, 1024);
assertNear(hDoubleRes.theoreticalProbabilities!['0'], 1.0, 0.001, 'H·H must evaluate to Identity with 100% |0⟩');
assert(hDoubleRes.counts['0'] === 1024, 'All 1024 measurement shots must collapse to 0 after H·H');
assert(!hDoubleRes.counts['1'] || hDoubleRes.counts['1'] === 0, 'Zero shots may measure 1 after H·H');

console.log('✓ Test 3 Passed: Wave interference confirmed mathematically and across all measurement shots.\n');

// =========================================================================
// TEST 4: Multi-Qubit Entanglement & Correlation in Bell State
// =========================================================================
console.log('Executing Test 4: Two-Qubit Bell State Entanglement Correlation...');

const bellCircuit: Circuit = {
  id: 'c-bell',
  name: 'Bell State |Φ⁺⟩',
  numberOfQubits: 2,
  gates: [
    { id: 'g0', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g1', gateId: 'CX', targetQubit: 1, controlQubit: 0, position: 1 }
  ],
  measurements: [0, 1]
};
const bellRes = simulateQuantumCircuit(bellCircuit, 4096);

assertNear(bellRes.theoreticalProbabilities!['00'], 0.5, 0.001, 'Bell state |00⟩ probability must be exactly 0.5');
assertNear(bellRes.theoreticalProbabilities!['11'], 0.5, 0.001, 'Bell state |11⟩ probability must be exactly 0.5');
assert((bellRes.theoreticalProbabilities!['01'] || 0) < 0.0001, 'Cross-state |01⟩ must have 0% theoretical probability');
assert((bellRes.theoreticalProbabilities!['10'] || 0) < 0.0001, 'Cross-state |10⟩ must have 0% theoretical probability');

// Check measurement correlations: count00 + count11 = total shots
const c00 = bellRes.counts['00'] || 0;
const c11 = bellRes.counts['11'] || 0;
const c01 = bellRes.counts['01'] || 0;
const c10 = bellRes.counts['10'] || 0;

assert(c01 === 0, 'No measurement shots should ever yield |01⟩ in Bell state');
assert(c10 === 0, 'No measurement shots should ever yield |10⟩ in Bell state');
assert(c00 + c11 === 4096, 'All 4,096 shots must land strictly in correlated states |00⟩ or |11⟩');
assertNear(c00 / 4096, 0.5, 0.05, '|00⟩ shot distribution should be ~50%');
assertNear(c11 / 4096, 0.5, 0.05, '|11⟩ shot distribution should be ~50%');

console.log('✓ Test 4 Passed: 100% correlation match verified for two-qubit Bell state.\n');

// =========================================================================
// TEST 5: Measurement Shot Sampling & Law of Large Numbers Convergence
// =========================================================================
console.log('Executing Test 5: Measurement Shot Sampling & Statistical Convergence...');

const sampleCircuit: Circuit = {
  id: 'c-sampling',
  name: 'Balanced Superposition Sampling',
  numberOfQubits: 1,
  gates: [{ id: 'g0', gateId: 'H', targetQubit: 0, position: 0 }],
  measurements: [0]
};

// Low shots (10 shots): higher variance allowed
const lowShotRes = simulateQuantumCircuit(sampleCircuit, 10);
assert(lowShotRes.shots === 10, 'Simulator must sample requested 10 shots');

// High shots (4096 shots): law of large numbers convergence
const highShotRes = simulateQuantumCircuit(sampleCircuit, 4096);
assert(highShotRes.shots === 4096, 'Simulator must sample requested 4096 shots');
const highProb0 = (highShotRes.counts['0'] || 0) / 4096;
assertNear(highProb0, 0.5, 0.04, 'At 4096 shots, measured frequency must converge within ±4% of 50%');

console.log('✓ Test 5 Passed: Shot sampling statistical convergence verified.\n');

// =========================================================================
// TEST 6: State Isolation Across Visualizer Invocations
// =========================================================================
console.log('Executing Test 6: State Isolation Between Different Circuit Simulations...');

const resA = simulateQuantumCircuit(groundCircuit, 1024);
const resB = simulateQuantumCircuit(excitedCircuit, 1024);

assert(resA.blochCoordinates?.z === 1, 'Circuit A must remain undisturbed ground state (z=+1)');
assert(resB.blochCoordinates?.z === -1, 'Circuit B must be excited state (z=-1)');
assert(resA.blochCoordinates !== resB.blochCoordinates, 'Bloch coordinate instances must not share object references');

console.log('✓ Test 6 Passed: Strict isolation verified between simulation outputs.\n');

console.log('================================================================');
console.log('ALL 6 INTERACTIVE VISUALIZATION ACCEPTANCE TESTS PASSED!');
console.log('================================================================\n');
