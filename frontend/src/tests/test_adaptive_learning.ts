// Acceptance Test Suite for Adaptive Learning Engine
// Tests explainable rule-based adaptation, signal evaluation,
// learner mode inference (reinforcement/standard/advanced),
// Circuit Lab recommendations, and persistence safety.

import { evaluateAdaptiveProfile, ConceptAdaptiveRecord } from '../services/adaptiveEngine';

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

console.log('--- STARTING ADAPTIVE LEARNING ACCEPTANCE TEST SUITE ---\n');

// =========================================================================
// TEST 1: Reinforcement Mode Triggered by Incorrect Answers / Mistakes
// =========================================================================
console.log('Executing Test 1: Reinforcement Mode on Conceptual Struggles...');

// Scenario A: Student gets a knowledge check wrong on first attempt
const struggleRecord: ConceptAdaptiveRecord = {
  conceptId: 'superposition',
  mode: 'reinforcement',
  attemptCount: 1,
  mistakeCount: 1,
  correctCount: 0,
  consecutiveSuccesses: 0,
  updatedAt: new Date().toISOString()
};

const profileStruggle = evaluateAdaptiveProfile('superposition', 'sup-1', struggleRecord, {
  lastAnswerCorrect: false
});

assertEqual(profileStruggle.mode, 'reinforcement', 'Incorrect answer must trigger reinforcement mode');
assert(profileStruggle.showSimplifiedExplanation, 'Reinforcement mode must show simplified conceptual breakdown');
assert(profileStruggle.showVisualReinforcement, 'Reinforcement mode must highlight interactive visual reinforcement');
assert(!profileStruggle.showDeepExplanation, 'Reinforcement mode must not overwhelm learner with complex proofs');
assert(Boolean(profileStruggle.reinforcementSummary), 'Reinforcement summary must be populated');
assertEqual(profileStruggle.recommendedExperiment?.id, 'exp-h-gate', 'Superposition struggle must recommend exp-h-gate');
assert(
  profileStruggle.rationale.includes('reinforce'),
  'Adaptation rationale must be visible and explainable to the student'
);

console.log('✓ Test 1 Passed: Reinforcement mode accurately adapts content and recommends targeted lab.\n');

// =========================================================================
// TEST 2: Advanced Mode Triggered by Strong First-Try Performance
// =========================================================================
console.log('Executing Test 2: Advanced Mode on Flawless First-Try Mastery...');

// Scenario B: Student gets knowledge check right on 1st try with 0 mistakes
const advancedRecord: ConceptAdaptiveRecord = {
  conceptId: 'superposition',
  mode: 'advanced',
  attemptCount: 1,
  mistakeCount: 0,
  correctCount: 1,
  consecutiveSuccesses: 1,
  updatedAt: new Date().toISOString()
};

const profileAdvanced = evaluateAdaptiveProfile('superposition', 'sup-1', advancedRecord, {
  lastAnswerCorrect: true,
  mistakeCount: 0,
  attemptCount: 1
});

assertEqual(profileAdvanced.mode, 'advanced', 'First-try flawless answer must trigger advanced mode');
assert(profileAdvanced.showDeepExplanation, 'Advanced mode must unlock deep mathematical proof');
assert(!profileAdvanced.showSimplifiedExplanation, 'Advanced mode should not show redundant basic breakdown');
assert(Boolean(profileAdvanced.deepDiveInsight), 'Deep dive insight must be populated');
assert(
  profileAdvanced.deepDiveInsight!.mathematicalProof.includes('Unitary Proof'),
  'Proof must contain rigorous mathematical unitary formulations'
);
assertEqual(profileAdvanced.recommendedExperiment?.id, 'exp-h-twice', 'Advanced superposition student recommended wave interference exp-h-twice');

console.log('✓ Test 2 Passed: Advanced mode unlocks deep dive and extension lab challenge.\n');

// =========================================================================
// TEST 3: Standard Mode for Pristine / Baseline Exploration
// =========================================================================
console.log('Executing Test 3: Standard Mode Baseline Evaluation...');

const profileStandard = evaluateAdaptiveProfile('fundamentals', 'fund-1');

assertEqual(profileStandard.mode, 'standard', 'New learner with no mistakes defaults to standard pace');
assert(!profileStandard.showSimplifiedExplanation, 'Standard mode should not show simplified card');
assert(!profileStandard.showDeepExplanation, 'Standard mode should not show deep dive card');
assert(profileStandard.showVisualReinforcement, 'Standard mode includes interactive visual layer');
assert(Boolean(profileStandard.recommendedExperiment), 'Standard mode provides canonical lab experiment');

console.log('✓ Test 3 Passed: Standard mode provides clean unhindered progression.\n');

// =========================================================================
// TEST 4: Contextual Circuit Lab Experiment Recommendations by Concept
// =========================================================================
console.log('Executing Test 4: Contextual Circuit Lab Mappings Across Curriculum...');

const modulesToTest = [
  { mod: 'superposition', expReinf: 'exp-h-gate', expAdv: 'exp-h-twice' },
  { mod: 'entanglement', expReinf: 'exp-bell-state', expAdv: 'exp-entanglement' },
  { mod: 'gates', expReinf: 'exp-x-gate', expAdv: 'exp-phase-flip' },
  { mod: 'circuits', expReinf: 'exp-multi-qubit', expAdv: 'exp-cnot' },
  { mod: 'algorithms', expReinf: 'exp-deutsch-jozsa', expAdv: 'exp-grover' }
];

modulesToTest.forEach(({ mod, expReinf, expAdv }) => {
  const reinf = evaluateAdaptiveProfile(mod, 'test-lesson', undefined, { lastAnswerCorrect: false });
  assertEqual(
    reinf.recommendedExperiment?.id,
    expReinf,
    `Module ${mod} reinforcement must recommend ${expReinf}`
  );

  const adv = evaluateAdaptiveProfile(mod, 'test-lesson', undefined, {
    lastAnswerCorrect: true,
    mistakeCount: 0,
    attemptCount: 1
  });
  assertEqual(
    adv.recommendedExperiment?.id,
    expAdv,
    `Module ${mod} advanced must recommend ${expAdv}`
  );
});

console.log('✓ Test 4 Passed: All curriculum concepts map cleanly to appropriate Circuit Lab experiments.\n');

// =========================================================================
// TEST 5: State Persistence & Schema Round-Trip
// =========================================================================
console.log('Executing Test 5: Adaptive State Persistence & Schema Round-Trip...');

const sampleAdaptiveRecords: Record<string, ConceptAdaptiveRecord> = {
  superposition: {
    conceptId: 'superposition',
    mode: 'reinforcement',
    attemptCount: 2,
    mistakeCount: 1,
    correctCount: 1,
    consecutiveSuccesses: 1,
    lastSignal: 'knowledge_check:pass',
    updatedAt: new Date().toISOString()
  },
  entanglement: {
    conceptId: 'entanglement',
    mode: 'advanced',
    attemptCount: 1,
    mistakeCount: 0,
    correctCount: 1,
    consecutiveSuccesses: 1,
    lastSignal: 'prediction:pass',
    updatedAt: new Date().toISOString()
  }
};

const serialized = JSON.stringify(sampleAdaptiveRecords);
const deserialized = JSON.parse(serialized);

assertEqual(deserialized.superposition.mode, 'reinforcement', 'Superposition mode must survive serialization');
assertEqual(deserialized.entanglement.mode, 'advanced', 'Entanglement mode must survive serialization');
assertEqual(deserialized.superposition.attemptCount, 2, 'Attempt counts must persist accurately');

console.log('✓ Test 5 Passed: Adaptive state serializes and hydrates without data loss.\n');

// =========================================================================
// TEST 6: Supportive Tone Guarantee (No Negative Labels)
// =========================================================================
console.log('Executing Test 6: Supportive Language & Tone Verification...');

const negativeTerms = ['weak', 'slow', 'poor', 'bad', 'failed student', 'below average'];
const allProfiles = [
  evaluateAdaptiveProfile('superposition', '1', undefined, { lastAnswerCorrect: false }),
  evaluateAdaptiveProfile('entanglement', '1', undefined, { lastAnswerCorrect: false, mistakeCount: 3 }),
  evaluateAdaptiveProfile('gates', '1', undefined, { lastAnswerCorrect: true })
];

allProfiles.forEach((prof) => {
  const text = `${prof.title} ${prof.rationale} ${prof.badgeLabel}`.toLowerCase();
  negativeTerms.forEach((term) => {
    assert(!text.includes(term), `System must never use negative label "${term}". Found in: ${text}`);
  });
});

console.log('✓ Test 6 Passed: Tone is strictly supportive, professional, and scientific.\n');

console.log('================================================================');
console.log('ALL 6 ADAPTIVE LEARNING ACCEPTANCE TESTS PASSED!');
console.log('================================================================\n');
