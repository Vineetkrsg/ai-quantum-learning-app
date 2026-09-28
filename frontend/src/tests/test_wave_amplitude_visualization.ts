// Acceptance Test Suite for Wave / Amplitude Visualization
// Verifies scientific fidelity, complex amplitude derivation, Born rule probabilities,
// phase angle representation, multi-qubit basis scaling, and dynamic circuit reactivity.

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

console.log('--- STARTING WAVE / AMPLITUDE VISUALIZATION ACCEPTANCE TEST SUITE ---\n');

// =========================================================================
// TEST 1: Ground State |0⟩ Amplitude & Probability Mapping
// =========================================================================
console.log('Executing Test 1: Ground State |0⟩ Amplitude Mapping...');

const cGround: Circuit = {
  id: 'c-ground',
  name: 'Ground State',
  numberOfQubits: 1,
  gates: [],
  measurements: [0]
};

const resGround = simulateQuantumCircuit(cGround, 1024);
assert(Boolean(resGround.stateVector && resGround.stateVector.length === 2), '1-qubit circuit must have 2 basis states in stateVector');

const svGround0 = resGround.stateVector!.find(s => s.state === '0')!;
const svGround1 = resGround.stateVector!.find(s => s.state === '1')!;

// Amplitude magnitude
const magGround0 = Math.sqrt(svGround0.real ** 2 + svGround0.imag ** 2);
const magGround1 = Math.sqrt(svGround1.real ** 2 + svGround1.imag ** 2);

assertNear(magGround0, 1.0, 0.001, 'Ground state |0⟩ amplitude magnitude must be exactly 1.0');
assertNear(magGround1, 0.0, 0.001, 'Ground state |1⟩ amplitude magnitude must be 0.0');
assertNear(svGround0.probability, 1.0, 0.001, 'Ground state |0⟩ Born probability must be 1.0');
assertNear(svGround1.probability, 0.0, 0.001, 'Ground state |1⟩ Born probability must be 0.0');

console.log('✓ Test 1 Passed: Ground state |0⟩ correctly yields α₀=1, α₁=0, P(0)=1, P(1)=0.\n');

// =========================================================================
// TEST 2: Hadamard Equal Superposition H|0⟩
// =========================================================================
console.log('Executing Test 2: Hadamard Superposition H|0⟩ Complex Amplitudes...');

const cH: Circuit = {
  id: 'c-h',
  name: 'Hadamard Superposition',
  numberOfQubits: 1,
  gates: [{ id: 'g-h', gateId: 'H', targetQubit: 0, position: 0 }],
  measurements: [0]
};

const resH = simulateQuantumCircuit(cH, 1024);
const svH0 = resH.stateVector!.find(s => s.state === '0')!;
const svH1 = resH.stateVector!.find(s => s.state === '1')!;

const magH0 = Math.sqrt(svH0.real ** 2 + svH0.imag ** 2);
const magH1 = Math.sqrt(svH1.real ** 2 + svH1.imag ** 2);

assertNear(magH0, 1 / Math.sqrt(2), 0.01, 'H|0⟩ must have amplitude magnitude ~1/√2 ≈ 0.7071 on |0⟩');
assertNear(magH1, 1 / Math.sqrt(2), 0.01, 'H|0⟩ must have amplitude magnitude ~1/√2 ≈ 0.7071 on |1⟩');
assertNear(svH0.probability, 0.5, 0.01, 'H|0⟩ must have theoretical probability 50% on |0⟩');
assertNear(svH1.probability, 0.5, 0.01, 'H|0⟩ must have theoretical probability 50% on |1⟩');

// Born rule invariant: P = |alpha|^2
assertNear(magH0 ** 2, svH0.probability, 0.005, 'Born rule P = |α|² must hold exactly for |0⟩');
assertNear(magH1 ** 2, svH1.probability, 0.005, 'Born rule P = |α|² must hold exactly for |1⟩');

console.log('✓ Test 2 Passed: H|0⟩ correctly yields balanced amplitudes ~0.7071 and probabilities P(0)=0.5, P(1)=0.5.\n');

// =========================================================================
// TEST 3: Pauli-X Bit-Flip State Inversion X|0⟩
// =========================================================================
console.log('Executing Test 3: Pauli-X State Inversion X|0⟩...');

const cX: Circuit = {
  id: 'c-x',
  name: 'Pauli-X Inversion',
  numberOfQubits: 1,
  gates: [{ id: 'g-x', gateId: 'X', targetQubit: 0, position: 0 }],
  measurements: [0]
};

const resX = simulateQuantumCircuit(cX, 1024);
const svX0 = resX.stateVector!.find(s => s.state === '0')!;
const svX1 = resX.stateVector!.find(s => s.state === '1')!;

const magX0 = Math.sqrt(svX0.real ** 2 + svX0.imag ** 2);
const magX1 = Math.sqrt(svX1.real ** 2 + svX1.imag ** 2);

assertNear(magX0, 0.0, 0.001, 'X|0⟩ must have 0 amplitude on |0⟩');
assertNear(magX1, 1.0, 0.001, 'X|0⟩ must have 1.0 amplitude on |1⟩');
assertNear(svX0.probability, 0.0, 0.001, 'X|0⟩ must have 0% probability on |0⟩');
assertNear(svX1.probability, 1.0, 0.001, 'X|0⟩ must have 100% probability on |1⟩');

console.log('✓ Test 3 Passed: X|0⟩ completely inverts wave amplitude from |0⟩ to |1⟩.\n');

// =========================================================================
// TEST 4: Quantum Wave Interference H -> H (H · H = I)
// =========================================================================
console.log('Executing Test 4: Quantum Wave Interference H -> H Return to |0⟩...');

const cHH: Circuit = {
  id: 'c-hh',
  name: 'Wave Interference H-H',
  numberOfQubits: 1,
  gates: [
    { id: 'g-h1', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g-h2', gateId: 'H', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};

const resHH = simulateQuantumCircuit(cHH, 1024);
const svHH0 = resHH.stateVector!.find(s => s.state === '0')!;
const svHH1 = resHH.stateVector!.find(s => s.state === '1')!;

const magHH0 = Math.sqrt(svHH0.real ** 2 + svHH0.imag ** 2);
const magHH1 = Math.sqrt(svHH1.real ** 2 + svHH1.imag ** 2);

assertNear(magHH0, 1.0, 0.001, 'H-H must constructively return amplitude to 1.0 on |0⟩');
assertNear(magHH1, 0.0, 0.001, 'H-H must destructively interfere |1⟩ amplitude to 0.0');
assertNear(svHH0.probability, 1.0, 0.001, 'H-H probability on |0⟩ must be 100%');
assertNear(svHH1.probability, 0.0, 0.001, 'H-H probability on |1⟩ must be 0%');

console.log('✓ Test 4 Passed: Consecutive Hadamards exhibit destructive interference cancelling |1⟩.\n');

// =========================================================================
// TEST 5: Maximally Entangled Two-Qubit Bell State
// =========================================================================
console.log('Executing Test 5: Entangled Bell State (|00⟩ + |11⟩)/√2...');

const cBell: Circuit = {
  id: 'c-bell',
  name: 'Bell State',
  numberOfQubits: 2,
  gates: [
    { id: 'g-1', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g-2', gateId: 'CNOT', targetQubit: 1, controlQubit: 0, position: 1 }
  ],
  measurements: [0, 1]
};

const resBell = simulateQuantumCircuit(cBell, 1024);
assert(resBell.stateVector!.length === 4, '2-qubit circuit must produce 4 basis states');

const sv00 = resBell.stateVector!.find(s => s.state === '00')!;
const sv01 = resBell.stateVector!.find(s => s.state === '01')!;
const sv10 = resBell.stateVector!.find(s => s.state === '10')!;
const sv11 = resBell.stateVector!.find(s => s.state === '11')!;

assertNear(sv00.probability, 0.5, 0.01, 'P(00) must be ~0.5');
assertNear(sv11.probability, 0.5, 0.01, 'P(11) must be ~0.5');
assertNear(sv01.probability, 0.0, 0.001, 'P(01) must be 0.0 in Bell pair');
assertNear(sv10.probability, 0.0, 0.001, 'P(10) must be 0.0 in Bell pair');

const mag00 = Math.sqrt(sv00.real ** 2 + sv00.imag ** 2);
const mag11 = Math.sqrt(sv11.real ** 2 + sv11.imag ** 2);
assertNear(mag00, 1 / Math.sqrt(2), 0.01, 'Amplitude |00⟩ magnitude must be ~0.7071');
assertNear(mag11, 1 / Math.sqrt(2), 0.01, 'Amplitude |11⟩ magnitude must be ~0.7071');

console.log('✓ Test 5 Passed: Bell state amplitudes correctly concentrated on |00⟩ and |11⟩.\n');

// =========================================================================
// TEST 6: Multi-Qubit Computational Basis Scaling (1 to 5 Qubits: 2 to 32 States)
// =========================================================================
console.log('Executing Test 6: Multi-Qubit Basis State Vector Scaling (up to 5 qubits)...');

for (let n = 1; n <= 5; n++) {
  const cMulti: Circuit = {
    id: `c-${n}-qubit`,
    name: `${n}-Qubit System`,
    numberOfQubits: n,
    // Put qubit 0 in superposition to test distribution
    gates: [{ id: 'g0', gateId: 'H', targetQubit: 0, position: 0 }],
    measurements: Array.from({ length: n }, (_, i) => i)
  };

  const resMulti = simulateQuantumCircuit(cMulti, 1024);
  const expectedStates = 1 << n;
  assert(resMulti.stateVector!.length === expectedStates, `${n}-qubit register must yield exactly 2^${n} = ${expectedStates} basis states`);

  // Check normalization condition Σ P(i) = 1.0000
  const sumProb = resMulti.stateVector!.reduce((acc, el) => acc + el.probability, 0);
  assertNear(sumProb, 1.0, 0.01, `${n}-qubit system total probability must sum to 1.0`);

  // Check each basis element satisfies Born rule P = real^2 + imag^2
  for (const el of resMulti.stateVector!) {
    const calcMagSq = el.real ** 2 + el.imag ** 2;
    assertNear(calcMagSq, el.probability, 0.005, `State |${el.state}⟩ magnitude squared must match probability`);
  }
}

console.log('✓ Test 6 Passed: Multi-qubit registers accurately scale 2, 4, 8, 16, 32 states with unit norm preserved.\n');

// =========================================================================
// TEST 7: Complex Phase Distinguishability (S Gate Phase Shift)
// =========================================================================
console.log('Executing Test 7: Complex Phase Angle Representation...');

const cPhase: Circuit = {
  id: 'c-phase-s',
  name: 'Phase S State',
  numberOfQubits: 1,
  gates: [
    { id: 'g-h', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g-s', gateId: 'S', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
};

const resPhase = simulateQuantumCircuit(cPhase, 1024);
const svP0 = resPhase.stateVector!.find(s => s.state === '0')!;
const svP1 = resPhase.stateVector!.find(s => s.state === '1')!;

// |0⟩ amplitude has real ~0.7071, imag ~0 (phase 0 rad)
assertNear(svP0.real, 1 / Math.sqrt(2), 0.01, 'Phase |0⟩ component has real ~0.7071');
assertNear(svP0.imag, 0, 0.01, 'Phase |0⟩ component has imag ~0');

// |1⟩ amplitude has real ~0, imag ~0.7071 (phase +pi/2 rad = 90 deg)
assertNear(svP1.real, 0, 0.01, 'Phase |1⟩ component has real ~0');
assertNear(svP1.imag, 1 / Math.sqrt(2), 0.01, 'Phase |1⟩ component has imag ~0.7071 (+i)');

const phaseRad0 = Math.atan2(svP0.imag, svP0.real);
const phaseRad1 = Math.atan2(svP1.imag, svP1.real);
assertNear(phaseRad0, 0, 0.05, '|0⟩ phase must be 0 radians');
assertNear(phaseRad1, Math.PI / 2, 0.05, '|1⟩ phase must be +π/2 radians (+90°)');

console.log('✓ Test 7 Passed: Complex phase angles φ strictly distinguish physical states beyond magnitude.\n');

// =========================================================================
// TEST 8: Dynamic Circuit Reactivity (Circuit Change -> Statevector Update)
// =========================================================================
console.log('Executing Test 8: Circuit Change Reactive Updates...');

// Step A: Initial Superposition
const simA = simulateQuantumCircuit({
  id: 'reactive-step-1',
  name: 'Step 1',
  numberOfQubits: 1,
  gates: [{ id: 'g1', gateId: 'H', targetQubit: 0, position: 0 }],
  measurements: [0]
}, 1024);

assertNear(simA.stateVector!.find(s => s.state === '0')!.probability, 0.5, 0.01, 'Step A must be 50/50 superposition');

// Step B: User adds second H gate on canvas
const simB = simulateQuantumCircuit({
  id: 'reactive-step-2',
  name: 'Step 2',
  numberOfQubits: 1,
  gates: [
    { id: 'g1', gateId: 'H', targetQubit: 0, position: 0 },
    { id: 'g2', gateId: 'H', targetQubit: 0, position: 1 }
  ],
  measurements: [0]
}, 1024);

assertNear(simB.stateVector!.find(s => s.state === '0')!.probability, 1.0, 0.01, 'Step B must return to 100% |0⟩');
assert(simA.stateVector![0].probability !== simB.stateVector![0].probability, 'Simulation must dynamically change statevector on circuit change');

console.log('✓ Test 8 Passed: Changing circuit gates dynamically updates the statevector with zero stale data.\n');

console.log('================================================================');
console.log('ALL 8 WAVE / AMPLITUDE ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
console.log('================================================================');
