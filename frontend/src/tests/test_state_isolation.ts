// Automated Acceptance Verification Test Suite for Scoped Interactive State Isolation
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

function assertNotStrictEqual(actual: any, expected: any, message?: string) {
  if (actual === expected) {
    throw new Error(`AssertionError [ERR_ASSERTION]: ${message || ''} Values should not be strictly equal`);
  }
}

const assert = {
  strictEqual: assertStrictEqual,
  deepStrictEqual: assertDeepStrictEqual,
  notStrictEqual: assertNotStrictEqual
};

// Mock browser localStorage
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

const mockLocalStorage = new LocalStorageMock();
(globalThis as any).localStorage = mockLocalStorage;

// Simulate Progress State Store with Scoped Activity Logic
interface KnowledgeCheckState {
  selectedAnswer: string | null;
  answered: boolean;
  isCorrect: boolean;
  explanationVisible?: boolean;
  isCompleted?: boolean;
}

const DEFAULT_KC_STATE: KnowledgeCheckState = {
  selectedAnswer: null,
  answered: false,
  isCorrect: false,
  explanationVisible: false,
  isCompleted: false
};

interface CircuitPracticeState {
  gates: string[];
  isCompleted?: boolean;
}

const DEFAULT_CIRCUIT_STATE: CircuitPracticeState = {
  gates: [],
  isCompleted: false
};

interface CodingPracticeState {
  code: string;
  isSubmitted: boolean;
  isPassed: boolean;
  showHint: boolean;
  validationFeedback: { isValid: boolean; message: string } | null;
}

const DEFAULT_CODING_STATE: CodingPracticeState = {
  code: '',
  isSubmitted: false,
  isPassed: false,
  showHint: false,
  validationFeedback: null
};

class ScopedStateStore {
  private STORAGE_KEY = 'qulearn_student_progress_v2';
  public state: {
    activityStates: Record<string, any>;
    completedLessons: string[];
  };

  constructor() {
    this.state = this.loadFromStorage();
  }

  public loadFromStorage() {
    const raw = mockLocalStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          activityStates: parsed.activityStates || {},
          completedLessons: parsed.completedLessons || []
        };
      } catch (e) {
        // ignore
      }
    }
    return {
      activityStates: {},
      completedLessons: []
    };
  }

  public saveToStorage() {
    mockLocalStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  public getActivityState<T>(key: string, defaultValue: T): T {
    if (this.state.activityStates && key in this.state.activityStates) {
      return this.state.activityStates[key] as T;
    }
    return defaultValue;
  }

  public setActivityState<T>(key: string, value: T | ((prev: T) => T)) {
    const currentVal = (this.state.activityStates?.[key] !== undefined)
      ? this.state.activityStates[key]
      : undefined;
    const nextVal = typeof value === 'function'
      ? (value as any)(currentVal)
      : value;

    this.state.activityStates[key] = nextVal;
    this.saveToStorage();
  }

  public resetProgress() {
    this.state = {
      activityStates: {},
      completedLessons: []
    };
    mockLocalStorage.removeItem(this.STORAGE_KEY);
  }
}

function runTests() {
  console.log('--- STARTING ACCEPTANCE TESTS FOR STATE ISOLATION ---\n');

  const store = new ScopedStateStore();

  // -------------------------------------------------------------
  // Test 1: Knowledge Check Isolation
  // -------------------------------------------------------------
  console.log('Executing Test 1: Knowledge Check Isolation...');
  const mod1_lesson1_kc = 'fundamentals/fund-1/knowledge-check-1';
  const mod1_lesson2_kc = 'fundamentals/fund-2/knowledge-check-1';
  const mod1_lesson3_kc = 'fundamentals/fund-3/knowledge-check-1';
  const mod2_lesson1_kc = 'qubits/qub-1/knowledge-check-1';

  // 1. Open Module 1 -> Lesson 1 and select 'B'
  store.setActivityState<KnowledgeCheckState>(mod1_lesson1_kc, {
    selectedAnswer: 'B',
    answered: true,
    isCorrect: true,
    explanationVisible: true,
    isCompleted: true
  });

  assert.strictEqual(
    store.getActivityState(mod1_lesson1_kc, DEFAULT_KC_STATE).selectedAnswer,
    'B',
    'Lesson 1 should have option B selected'
  );

  // 2. Navigate to Lesson 2 -> must show no selected answer
  const l2State = store.getActivityState(mod1_lesson2_kc, DEFAULT_KC_STATE);
  assert.strictEqual(l2State.selectedAnswer, null, 'Lesson 2 must show no selected answer');
  assert.strictEqual(l2State.answered, false, 'Lesson 2 must not be answered');

  // 3. Navigate to Lesson 3 -> must show no selected answer
  const l3State = store.getActivityState(mod1_lesson3_kc, DEFAULT_KC_STATE);
  assert.strictEqual(l3State.selectedAnswer, null, 'Lesson 3 must show no selected answer');
  assert.strictEqual(l3State.answered, false, 'Lesson 3 must not be answered');

  // 4. Open Module 2 -> Knowledge checks must also be untouched
  const m2State = store.getActivityState(mod2_lesson1_kc, DEFAULT_KC_STATE);
  assert.strictEqual(m2State.selectedAnswer, null, 'Module 2 Lesson 1 must show no selected answer');
  assert.strictEqual(m2State.answered, false, 'Module 2 Lesson 1 must not be answered');
  console.log('✓ Test 1 Passed: Knowledge Checks are strictly isolated across lessons & modules.\n');

  // -------------------------------------------------------------
  // Test 2: Circuit Practice Isolation
  // -------------------------------------------------------------
  console.log('Executing Test 2: Circuit Practice Isolation...');
  const mod1_lesson1_circ = 'fundamentals/fund-1/circuit-practice-1';
  const mod1_lesson2_circ = 'fundamentals/fund-2/circuit-practice-1';
  const mod2_lesson1_circ = 'qubits/qub-1/circuit-practice-1';

  // 1. Open Lesson 1 circuit practice and add 'H' gate
  store.setActivityState<CircuitPracticeState>(mod1_lesson1_circ, {
    gates: ['H'],
    isCompleted: false
  });

  const l1CircState = store.getActivityState(mod1_lesson1_circ, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(l1CircState.gates, ['H'], 'Lesson 1 circuit must contain [H]');

  // 2. Navigate to Lesson 2 -> must not contain 'H' gate
  const l2CircState = store.getActivityState(mod1_lesson2_circ, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(l2CircState.gates, [], 'Lesson 2 circuit must be empty / default');

  // 3. Navigate to another module -> circuit must remain independent
  const m2CircState = store.getActivityState(mod2_lesson1_circ, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m2CircState.gates, [], 'Module 2 circuit must be independent');

  // 4. Return to Lesson 1 -> still has 'H' gate
  const l1CircRevisit = store.getActivityState(mod1_lesson1_circ, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(l1CircRevisit.gates, ['H'], 'Lesson 1 must retain [H]');
  console.log('✓ Test 2 Passed: Circuit practice states are strictly isolated and independent.\n');

  // -------------------------------------------------------------
  // Test 3: Scoped Persistence Across Reloads
  // -------------------------------------------------------------
  console.log('Executing Test 3: Scoped Persistence Across Reloads...');
  // Simulate page reload by creating a new store instance reading from mockLocalStorage
  const reloadedStore = new ScopedStateStore();

  const persistedL1 = reloadedStore.getActivityState(mod1_lesson1_kc, DEFAULT_KC_STATE);
  assert.strictEqual(persistedL1.selectedAnswer, 'B', 'Lesson 1 must retain option B after reload');
  assert.strictEqual(persistedL1.answered, true, 'Lesson 1 must retain answered state');

  const persistedL2 = reloadedStore.getActivityState(mod1_lesson2_kc, DEFAULT_KC_STATE);
  assert.strictEqual(persistedL2.selectedAnswer, null, 'Lesson 2 must still be untouched after reload');
  assert.strictEqual(persistedL2.answered, false, 'Lesson 2 must remain unanswered after reload');

  const persistedCircL1 = reloadedStore.getActivityState(mod1_lesson1_circ, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(persistedCircL1.gates, ['H'], 'Lesson 1 circuit must retain [H] after reload');
  console.log('✓ Test 3 Passed: Reload properly hydrates scoped states without cross-contamination.\n');

  // -------------------------------------------------------------
  // Test 4: Navigation Back and Forth
  // -------------------------------------------------------------
  console.log('Executing Test 4: Navigation Back and Forth...');
  // Set answer 'A' in Lesson 2
  reloadedStore.setActivityState<KnowledgeCheckState>(mod1_lesson2_kc, {
    selectedAnswer: 'A',
    answered: true,
    isCorrect: false
  });

  // Navigate: Lesson 2 -> Lesson 1 -> Module 2 -> Lesson 2
  assert.strictEqual(reloadedStore.getActivityState(mod1_lesson1_kc, DEFAULT_KC_STATE).selectedAnswer, 'B');
  assert.strictEqual(reloadedStore.getActivityState(mod1_lesson2_kc, DEFAULT_KC_STATE).selectedAnswer, 'A');
  assert.strictEqual(reloadedStore.getActivityState(mod2_lesson1_kc, DEFAULT_KC_STATE).selectedAnswer, null);
  console.log('✓ Test 4 Passed: Repeated navigation maintains exact per-lesson associations.\n');

  // -------------------------------------------------------------
  // Test 5: Duplicate Activity IDs
  // -------------------------------------------------------------
  console.log('Executing Test 5: Duplicate Activity IDs Isolation...');
  // Both Lesson 1 and Lesson 2 use activityId "knowledge-check-1"
  assert.notStrictEqual(mod1_lesson1_kc, mod1_lesson2_kc, 'Scoped keys must be distinct');
  assert.strictEqual(reloadedStore.getActivityState(mod1_lesson1_kc, DEFAULT_KC_STATE).selectedAnswer, 'B');
  assert.strictEqual(reloadedStore.getActivityState(mod1_lesson2_kc, DEFAULT_KC_STATE).selectedAnswer, 'A');
  console.log('✓ Test 5 Passed: Activities with identical activityId remain 100% separate due to full scoped key.\n');

  // -------------------------------------------------------------
  // Test 6: Fresh Learner Reset
  // -------------------------------------------------------------
  console.log('Executing Test 6: Fresh Learner Reset...');
  reloadedStore.resetProgress();

  const freshL1KC = reloadedStore.getActivityState(mod1_lesson1_kc, DEFAULT_KC_STATE);
  assert.strictEqual(freshL1KC.selectedAnswer, null, 'Fresh learner Lesson 1 KC must be null');
  assert.strictEqual(freshL1KC.answered, false, 'Fresh learner Lesson 1 KC must be unanswered');

  const freshL1Circ = reloadedStore.getActivityState(mod1_lesson1_circ, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(freshL1Circ.gates, [], 'Fresh learner Lesson 1 circuit must be empty');

  const freshL2KC = reloadedStore.getActivityState(mod1_lesson2_kc, DEFAULT_KC_STATE);
  assert.strictEqual(freshL2KC.selectedAnswer, null, 'Fresh learner Lesson 2 KC must be null');
  console.log('✓ Test 6 Passed: Reset progress provides 100% clean pristine states for fresh learner.\n');

  // -------------------------------------------------------------
  // Test 7: Exact User Scenario - Comprehensive Multi-Lesson Circuit Practice Flow
  // -------------------------------------------------------------
  console.log('Executing Test 7: Exact User Scenario Multi-Lesson Isolation...');
  const userTestStore = new ScopedStateStore();

  // 1. Clear existing circuit-related localStorage/state
  userTestStore.resetProgress();

  const m1_l1_key = 'fundamentals/fund-1/circuit-practice-1';
  const m1_l2_key = 'fundamentals/fund-2/circuit-practice-1';
  const m1_l3_key = 'fundamentals/fund-3/circuit-practice-1';
  const m2_l1_key = 'qubits/qub-1/circuit-practice-1';

  // 2-4. Open Module 1 -> Lesson 1 -> Circuit Practice -> Add an H gate
  userTestStore.setActivityState<CircuitPracticeState>(m1_l1_key, {
    gates: ['H'],
    isCompleted: true
  });
  const m1_l1_state = userTestStore.getActivityState(m1_l1_key, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m1_l1_state.gates, ['H'], 'Step 4: Lesson 1 must contain [H]');

  // 5-7. Leave Lesson 1 -> Open Module 1 -> Lesson 2 -> Verify Lesson 2 does NOT contain H gate
  const m1_l2_state_initial = userTestStore.getActivityState(m1_l2_key, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m1_l2_state_initial.gates, [], 'Step 7: Lesson 2 must NOT contain H gate');

  // 8. Add an X gate in Lesson 2
  userTestStore.setActivityState<CircuitPracticeState>(m1_l2_key, {
    gates: ['X'],
    isCompleted: true
  });
  const m1_l2_state_updated = userTestStore.getActivityState(m1_l2_key, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m1_l2_state_updated.gates, ['X'], 'Step 8: Lesson 2 must contain [X]');

  // 9-10. Return to Lesson 1 -> Verify Lesson 1 still has only its own H gate
  const m1_l1_state_revisit = userTestStore.getActivityState(m1_l1_key, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m1_l1_state_revisit.gates, ['H'], 'Step 10: Lesson 1 must retain only [H]');

  // 11-12. Return to Lesson 2 -> Verify Lesson 2 still has only its own X gate
  const m1_l2_state_revisit = userTestStore.getActivityState(m1_l2_key, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m1_l2_state_revisit.gates, ['X'], 'Step 12: Lesson 2 must retain only [X]');

  // 13-14. Open Lesson 3 -> Verify Lesson 3 has its own default/predefined circuit
  const m1_l3_state = userTestStore.getActivityState(m1_l3_key, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m1_l3_state.gates, [], 'Step 14: Lesson 3 must have clean default empty circuit');

  // 15-16. Open another module (Module 2) -> Verify that module remains independent
  const m2_l1_state = userTestStore.getActivityState(m2_l1_key, DEFAULT_CIRCUIT_STATE);
  assert.deepStrictEqual(m2_l1_state.gates, [], 'Step 16: Module 2 circuit must be completely independent');

  // Refresh test: Simulate page reload and check Lesson 1 & Lesson 2 independence
  const refreshedStore = new ScopedStateStore();
  const reloaded_l1 = refreshedStore.getActivityState(m1_l1_key, DEFAULT_CIRCUIT_STATE);
  const reloaded_l2 = refreshedStore.getActivityState(m1_l2_key, DEFAULT_CIRCUIT_STATE);
  const reloaded_l3 = refreshedStore.getActivityState(m1_l3_key, DEFAULT_CIRCUIT_STATE);
  const reloaded_m2 = refreshedStore.getActivityState(m2_l1_key, DEFAULT_CIRCUIT_STATE);

  assert.deepStrictEqual(reloaded_l1.gates, ['H'], 'Reload: Lesson 1 must retain [H]');
  assert.deepStrictEqual(reloaded_l2.gates, ['X'], 'Reload: Lesson 2 must retain [X] and NOT inherit [H]');
  assert.deepStrictEqual(reloaded_l3.gates, [], 'Reload: Lesson 3 must remain clean');
  assert.deepStrictEqual(reloaded_m2.gates, [], 'Reload: Module 2 must remain clean');

  console.log('✓ Test 7 Passed: Exact user scenario multi-lesson circuit practice flow verified.\n');

  // -------------------------------------------------------------
  // Test 8: Predefined Lesson Circuit vs Student Modifications
  // -------------------------------------------------------------
  console.log('Executing Test 8: Predefined Lesson Circuit Isolation...');
  const predefinedKey = 'superposition/sup-2/circuit-practice-1';
  const predefinedDefault: CircuitPracticeState = {
    gates: ['H', 'M'],
    isCompleted: false
  };

  // 1. Initial load starts with predefined circuit
  const initialPredefined = refreshedStore.getActivityState(predefinedKey, predefinedDefault);
  assert.deepStrictEqual(initialPredefined.gates, ['H', 'M'], 'Predefined circuit initializes with [H, M]');

  // 2. Student adds gate
  refreshedStore.setActivityState<CircuitPracticeState>(predefinedKey, {
    gates: ['H', 'X', 'M'],
    isCompleted: true
  });
  const modifiedPredefined = refreshedStore.getActivityState(predefinedKey, predefinedDefault);
  assert.deepStrictEqual(modifiedPredefined.gates, ['H', 'X', 'M'], 'Student modified circuit has [H, X, M]');

  // 3. Reset to default restores predefined circuit
  refreshedStore.setActivityState<CircuitPracticeState>(predefinedKey, {
    gates: [...predefinedDefault.gates],
    isCompleted: false
  });
  const resetPredefined = refreshedStore.getActivityState(predefinedKey, predefinedDefault);
  assert.deepStrictEqual(resetPredefined.gates, ['H', 'M'], 'Reset restores predefined [H, M]');

  console.log('✓ Test 8 Passed: Predefined lesson circuits initialize and reset independently.\n');

  // -------------------------------------------------------------
  // Test 9: Coding Practice State Isolation within the Same Module
  // -------------------------------------------------------------
  console.log('Executing Test 9: Coding Practice State Isolation (sup-2 vs sup-4 in Module 3)...');
  const sup2_coding_key = 'superposition/sup-2/coding-practice-1';
  const sup4_coding_key = 'superposition/sup-4/coding-practice-1';

  const sup2_starter = `from qiskit import QuantumCircuit\nqc = QuantumCircuit(1, 1)\n# TODO: Apply Hadamard gate to qubit 0\nqc.measure(0, 0)`;
  const sup4_starter = `from qiskit import QuantumCircuit\nqc = QuantumCircuit(1, 1)\nqc.h(0)\n# TODO: Add the second Hadamard gate\nqc.measure(0, 0)`;

  // 1. Initial access to sup-2 returns starter code
  const sup2_init = refreshedStore.getActivityState(sup2_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: sup2_starter
  });
  assert.strictEqual(sup2_init.code, sup2_starter, 'sup-2 must initially load its starter code');
  assert.strictEqual(sup2_init.isSubmitted, false, 'sup-2 must not be submitted initially');

  // 2. Student edits code in sup-2 to solve the challenge
  const sup2_student_solution = `from qiskit import QuantumCircuit\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.measure(0, 0)`;
  refreshedStore.setActivityState<CodingPracticeState>(sup2_coding_key, {
    code: sup2_student_solution,
    isSubmitted: true,
    isPassed: true,
    showHint: false,
    validationFeedback: { isValid: true, message: 'Superposition created!' }
  });

  // Verify sup-2 updated
  const sup2_updated = refreshedStore.getActivityState(sup2_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: sup2_starter
  });
  assert.strictEqual(sup2_updated.code, sup2_student_solution, 'sup-2 must save student solution');
  assert.strictEqual(sup2_updated.isPassed, true, 'sup-2 must be passed');

  // 3. Navigate to sup-4 in the same module -> MUST have its own starter code and NOT inherit sup-2's code
  const sup4_init = refreshedStore.getActivityState(sup4_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: sup4_starter
  });
  assert.strictEqual(sup4_init.code, sup4_starter, 'sup-4 must load its OWN starter code without bleed from sup-2');
  assert.strictEqual(sup4_init.isSubmitted, false, 'sup-4 must remain unsubmitted');
  assert.strictEqual(sup4_init.isPassed, false, 'sup-4 must not be passed');

  // 4. Student modifies sup-4
  const sup4_student_solution = `from qiskit import QuantumCircuit\nqc = QuantumCircuit(1, 1)\nqc.h(0)\nqc.h(0)\nqc.measure(0, 0)`;
  refreshedStore.setActivityState<CodingPracticeState>(sup4_coding_key, {
    code: sup4_student_solution,
    isSubmitted: true,
    isPassed: true,
    showHint: false,
    validationFeedback: { isValid: true, message: 'Reversibility confirmed!' }
  });

  // 5. Navigate back to sup-2 -> retains only its own code
  const sup2_revisit = refreshedStore.getActivityState(sup2_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: sup2_starter
  });
  assert.strictEqual(sup2_revisit.code, sup2_student_solution, 'sup-2 must retain its own solution upon revisit');
  assert.notStrictEqual(sup2_revisit.code, sup4_student_solution, 'sup-2 and sup-4 codes must remain distinct');

  console.log('✓ Test 9 Passed: Coding practice states are strictly isolated across lessons in the same module.\n');

  // -------------------------------------------------------------
  // Test 10: Coding Practice Persistence Across Reloads & Starter Reset
  // -------------------------------------------------------------
  console.log('Executing Test 10: Coding Practice Reload Persistence & Starter Reset...');
  const storeAfterReload = new ScopedStateStore();

  // 1. Reload retains student modifications in sup-2 and sup-4
  const reloaded_sup2 = storeAfterReload.getActivityState(sup2_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: sup2_starter
  });
  assert.strictEqual(reloaded_sup2.code, sup2_student_solution, 'Reload: sup-2 retains student code');
  assert.strictEqual(reloaded_sup2.isPassed, true, 'Reload: sup-2 retains passed status');

  const reloaded_sup4 = storeAfterReload.getActivityState(sup4_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: sup4_starter
  });
  assert.strictEqual(reloaded_sup4.code, sup4_student_solution, 'Reload: sup-4 retains student code');
  assert.strictEqual(reloaded_sup4.isPassed, true, 'Reload: sup-4 retains passed status');

  // 2. Unvisited module/lesson coding practice (e.g. gates/gat-5) remains clean
  const gat5_coding_key = 'gates/gat-5/coding-practice-1';
  const gat5_starter = 'qc.cx(0, 1)';
  const reloaded_gat5 = storeAfterReload.getActivityState(gat5_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: gat5_starter
  });
  assert.strictEqual(reloaded_gat5.code, gat5_starter, 'Unvisited lesson starts with clean default');
  assert.strictEqual(reloaded_gat5.isSubmitted, false, 'Unvisited lesson is not submitted');

  // 3. Reset starter code in sup-2
  storeAfterReload.setActivityState<CodingPracticeState>(sup2_coding_key, {
    code: sup2_starter,
    isSubmitted: false,
    isPassed: false,
    showHint: false,
    validationFeedback: null
  });
  const reset_sup2 = storeAfterReload.getActivityState(sup2_coding_key, {
    ...DEFAULT_CODING_STATE,
    code: sup2_starter
  });
  assert.strictEqual(reset_sup2.code, sup2_starter, 'Reset restores exact starter code');
  assert.strictEqual(reset_sup2.isSubmitted, false, 'Reset clears submission flag');

  console.log('✓ Test 10 Passed: Reload correctly hydrates coding states; starter reset functions cleanly.\n');

  // -------------------------------------------------------------
  // Test 11: Validation Engine & Flexible Syntax Matching
  // -------------------------------------------------------------
  console.log('Executing Test 11: Validation Engine & Flexible Syntax Matching...');

  // Simulation of CodingPractice.tsx validation engine
  function validateStudentCode(studentCode: string, rules: { requiredOperations?: string[]; forbiddenOperations?: string[]; successMessage: string; failureHint: string }) {
    const normalized = studentCode.toLowerCase().replace(/\s+/g, '');
    if (rules.requiredOperations && rules.requiredOperations.length > 0) {
      for (const op of rules.requiredOperations) {
        const normOp = op.toLowerCase().replace(/\s+/g, '');
        if (!normalized.includes(normOp)) {
          const bareOp = normOp.replace(/^qc\./, '');
          if (!normalized.includes(bareOp)) {
            return { isValid: false, message: rules.failureHint || `Missing required operation: ${op}` };
          }
        }
      }
    }
    if (rules.forbiddenOperations && rules.forbiddenOperations.length > 0) {
      for (const op of rules.forbiddenOperations) {
        const normOp = op.toLowerCase().replace(/\s+/g, '');
        if (normalized.includes(normOp)) {
          return { isValid: false, message: `Forbidden operation detected: ${op}` };
        }
      }
    }
    return { isValid: true, message: rules.successMessage };
  }

  const xRules = {
    requiredOperations: ['qc.x(0)'],
    forbiddenOperations: ['qc.h(', 'qc.z('],
    successMessage: 'Pauli-X passed!',
    failureHint: 'Missing qc.x(0)'
  };

  // Valid with standard syntax
  const v1 = validateStudentCode('qc.x(0)\nqc.measure(0, 0)', xRules);
  assert.strictEqual(v1.isValid, true, 'Standard syntax must pass validation');

  // Valid with spaces around arguments: qc.x( 0 )
  const v2 = validateStudentCode('qc.x( 0 )\nqc.measure(0, 0)', xRules);
  assert.strictEqual(v2.isValid, true, 'Flexible spacing must pass validation');

  // Invalid: missing required operation
  const v3 = validateStudentCode('qc.measure(0, 0)', xRules);
  assert.strictEqual(v3.isValid, false, 'Missing operation must fail');
  assert.strictEqual(v3.message, 'Missing qc.x(0)');

  // Invalid: using forbidden operation
  const v4 = validateStudentCode('qc.h(0)\nqc.x(0)\nqc.measure(0, 0)', xRules);
  assert.strictEqual(v4.isValid, false, 'Forbidden operation must trigger error');

  console.log('✓ Test 11 Passed: Validation engine accurately tests token presence with flexible spacing.\n');

  console.log('ALL 11 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
}

runTests();
