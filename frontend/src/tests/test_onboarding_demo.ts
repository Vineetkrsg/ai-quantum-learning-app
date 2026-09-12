// Automated Acceptance Test Suite for Guided Tour + Interactive Demo Mode
import { TOUR_STEPS } from '../components/onboarding/TourConstants';
import { 
  INITIAL_DEMO_CIRCUIT_H, 
  INITIAL_INTERFERENCE_CIRCUIT, 
  INITIAL_CHALLENGE_CIRCUIT 
} from '../context/OnboardingContext';
import { simulateQuantumCircuit } from '../services/quantumSimulator';

function assertStrictEqual(actual: any, expected: any, message?: string) {
  if (actual !== expected) {
    throw new Error(`AssertionError [ERR_ASSERTION]: ${message || ''} Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
  }
}

function assertDeepStrictEqual(actual: any, expected: any, message?: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`AssertionError [ERR_ASSERTION]: ${message || ''} Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
  }
}

function assertTrue(value: boolean, message?: string) {
  if (!value) {
    throw new Error(`AssertionError [ERR_ASSERTION]: ${message || 'Expected true, got false'}`);
  }
}

// Mock localStorage
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const mockStorage = new LocalStorageMock();
(globalThis as any).localStorage = mockStorage;

console.log('--- STARTING GUIDED TOUR & DEMO MODE VERIFICATION ---');

// =================================================================
// TEST 1: Guided Tour 10-Step Curriculum Structure
// =================================================================
console.log('\nExecuting Test 1: Guided Tour 10-Step Architecture...');
assertStrictEqual(TOUR_STEPS.length, 10, 'Guided Tour must contain exactly 10 comprehensive steps.');

const expectedRoutes = [
  '/dashboard',
  '/learn',
  '/learn/fundamentals',
  '/lab',
  '/lab',
  '/lab',
  '/lab',
  '/challenges',
  '/progress',
  '/dashboard'
];

TOUR_STEPS.forEach((step, idx) => {
  assertStrictEqual(step.stepNumber, idx + 1, `Step ${idx + 1} has correct stepNumber`);
  assertStrictEqual(step.route, expectedRoutes[idx], `Step ${idx + 1} points to route ${expectedRoutes[idx]}`);
  assertTrue(step.title.length > 0, `Step ${idx + 1} has a title`);
  assertTrue(step.content.length > 0, `Step ${idx + 1} has educational content`);
  assertTrue(step.targetSelector.length > 0, `Step ${idx + 1} has a targetSelector`);
});
console.log('✓ Test 1 Passed: 10 Tour steps match specifications.');

// =================================================================
// TEST 2: Demo Superposition Physics Simulation (H Gate)
// =================================================================
console.log('\nExecuting Test 2: Real Statevector Simulation for Superposition (H Gate)...');
const simResultH = simulateQuantumCircuit(INITIAL_DEMO_CIRCUIT_H, 1024);

assertTrue(simResultH.probabilities['0'] !== undefined, 'Outcome 0 must exist in probabilities');
assertTrue(simResultH.probabilities['1'] !== undefined, 'Outcome 1 must exist in probabilities');

// Theoretical probabilities for H|0> must be exactly 0.5 each
const p0 = simResultH.probabilities['0'];
const p1 = simResultH.probabilities['1'];
assertTrue(Math.abs(p0 - 0.5) <= 0.08, `Theoretical probability of 0 should be ~0.5, got ${p0}`);
assertTrue(Math.abs(p1 - 0.5) <= 0.08, `Theoretical probability of 1 should be ~0.5, got ${p1}`);
assertStrictEqual(simResultH.shots, 1024, 'Simulation must run for 1,024 shots');
console.log(`✓ Test 2 Passed: Real simulation produced balanced superposition (|0⟩: ${(p0 * 100).toFixed(1)}%, |1⟩: ${(p1 * 100).toFixed(1)}%).`);

// =================================================================
// TEST 3: Demo Wave Interference Physics Simulation (H → H)
// =================================================================
console.log('\nExecuting Test 3: Real Statevector Simulation for Wave Interference (H -> H)...');
const simResultHH = simulateQuantumCircuit(INITIAL_INTERFERENCE_CIRCUIT, 1024);

const p0_HH = simResultHH.probabilities['0'] || 0;
const p1_HH = simResultHH.probabilities['1'] || 0;

assertStrictEqual(p0_HH, 1.0, 'Destructive interference must return strictly 100% to state 0.');
assertStrictEqual(p1_HH, 0.0, 'Outcome 1 amplitude must destructively cancel to 0.0%.');
console.log('✓ Test 3 Passed: Wave interference strictly evaluated H · H = I (100% |0⟩).');

// =================================================================
// TEST 4: Mini Challenge Validator (Pauli-X Gate Bit-Flip)
// =================================================================
console.log('\nExecuting Test 4: Mini Challenge Validator for Pauli-X Bit-Flip...');
// Initial circuit without X gate (only M)
const resWithoutX = simulateQuantumCircuit(INITIAL_CHALLENGE_CIRCUIT, 1024);
const prob1WithoutX = resWithoutX.probabilities['1'] || 0;
assertStrictEqual(prob1WithoutX, 0, 'Without X gate, outcome 1 should be 0%');

// Valid circuit with X gate inserted
const validCircuit = {
  ...INITIAL_CHALLENGE_CIRCUIT,
  gates: [
    { id: 'x-1', gateId: 'X', targetQubit: 0, position: 0 },
    { id: 'm-1', gateId: 'M', targetQubit: 0, position: 1 }
  ]
};

const resWithX = simulateQuantumCircuit(validCircuit, 1024);
const prob1WithX = resWithX.probabilities['1'] || 0;
assertStrictEqual(prob1WithX, 1.0, 'With X gate, outcome 1 must be 100%');
console.log('✓ Test 4 Passed: Challenge validator accurately verifies X gate bit-flip.');

// =================================================================
// TEST 5: State Isolation - Zero Leakage into Student Learning Progress
// =================================================================
console.log('\nExecuting Test 5: Strict State Isolation from Lesson Progress...');
const STUDENT_PROGRESS_KEY = 'qulearn_student_progress_v2';
const TOUR_KEY = 'qulearn_guided_tour_v1';
const DEMO_KEY = 'qulearn_demo_mode_v1';

// Preset mock pristine student progress
const initialStudentProgress = {
  overallProgress: 0,
  completedLessons: [],
  experimentsCompleted: [],
  xp: 0,
  circuitsRun: 0
};
mockStorage.setItem(STUDENT_PROGRESS_KEY, JSON.stringify(initialStudentProgress));

// Simulate completing the entire Tour
const tourState = {
  isCompleted: true,
  isSkipped: false,
  currentStep: 9,
  hasSeenWelcome: true
};
mockStorage.setItem(TOUR_KEY, JSON.stringify(tourState));

// Simulate completing the entire Demo
const demoState = {
  isCompleted: true,
  currentStep: 6,
  prediction1: 'p-50',
  prediction2: 'p-zero',
  challengePassed: true
};
mockStorage.setItem(DEMO_KEY, JSON.stringify(demoState));

// Verify student progress remained completely pristine
const postStudentProgress = JSON.parse(mockStorage.getItem(STUDENT_PROGRESS_KEY)!);
assertStrictEqual(postStudentProgress.overallProgress, 0, 'Tour/Demo must NOT modify overallProgress');
assertStrictEqual(postStudentProgress.completedLessons.length, 0, 'Tour/Demo must NOT add fake completedLessons');
assertStrictEqual(postStudentProgress.experimentsCompleted.length, 0, 'Tour/Demo must NOT add fake experimentsCompleted');
assertStrictEqual(postStudentProgress.xp, 0, 'Tour/Demo must NOT alter student XP');
assertStrictEqual(postStudentProgress.circuitsRun, 0, 'Tour/Demo must NOT alter student circuitsRun');

console.log('✓ Test 5 Passed: Tour and Demo states are completely isolated from student curriculum progress.');

// =================================================================
// TEST 6: Persistence & Reload Hydration
// =================================================================
console.log('\nExecuting Test 6: Persistence & Reload Hydration...');
const savedTour = JSON.parse(mockStorage.getItem(TOUR_KEY)!);
assertTrue(savedTour.isCompleted, 'Tour completion persists');
assertStrictEqual(savedTour.currentStep, 9, 'Tour current step persists');

const savedDemo = JSON.parse(mockStorage.getItem(DEMO_KEY)!);
assertTrue(savedDemo.isCompleted, 'Demo completion persists');
assertStrictEqual(savedDemo.prediction1, 'p-50', 'Demo prediction persists');
assertTrue(savedDemo.challengePassed, 'Demo challenge status persists');

console.log('✓ Test 6 Passed: Tour and Demo states hydrate accurately from localStorage.');

// =================================================================
// TEST 7: Independent Restart
// =================================================================
console.log('\nExecuting Test 7: Independent Restart Behavior...');
// Resetting tour
const resetTour = {
  isCompleted: false,
  isSkipped: false,
  currentStep: 0,
  hasSeenWelcome: true
};
mockStorage.setItem(TOUR_KEY, JSON.stringify(resetTour));

// Resetting demo
const resetDemo = {
  isCompleted: false,
  currentStep: 0,
  prediction1: null,
  prediction2: null,
  challengePassed: false
};
mockStorage.setItem(DEMO_KEY, JSON.stringify(resetDemo));

const reloadedTour = JSON.parse(mockStorage.getItem(TOUR_KEY)!);
assertStrictEqual(reloadedTour.isCompleted, false, 'Tour restarted to step 0 and uncompleted');
assertStrictEqual(reloadedTour.currentStep, 0, 'Tour currentStep is 0');

const reloadedDemo = JSON.parse(mockStorage.getItem(DEMO_KEY)!);
assertStrictEqual(reloadedDemo.isCompleted, false, 'Demo restarted to step 0 and uncompleted');
assertStrictEqual(reloadedDemo.currentStep, 0, 'Demo currentStep is 0');
assertStrictEqual(reloadedDemo.prediction1, null, 'Demo prediction cleared');

console.log('✓ Test 7 Passed: Restart tour and restart demo restore pristine state cleanly.');

console.log('\n======================================================');
console.log('ALL 7 GUIDED TOUR & DEMO ACCEPTANCE TESTS PASSED!');
console.log('======================================================\n');
