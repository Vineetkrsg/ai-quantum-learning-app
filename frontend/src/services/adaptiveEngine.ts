import { GUIDED_EXPERIMENTS } from '../mock/experimentsData';

export type AdaptiveMode = 'reinforcement' | 'standard' | 'extension' | 'advanced';

export interface ConceptAdaptiveRecord {
  conceptId: string;
  mode: AdaptiveMode;
  attemptCount: number;
  mistakeCount: number;
  correctCount: number;
  consecutiveSuccesses: number;
  lastSignal?: string;
  recommendedExperimentId?: string;
  recommendedExperimentTitle?: string;
  recommendedExperimentReason?: string;
  paceScore?: number; // 1 = standard, < 1 = deliberate/struggling, > 1 = fast
  updatedAt: string;
}

export interface AuthoredAdaptiveContent {
  mode: 'reinforcement' | 'standard' | 'extension';
  title: string;
  badge: string;
  leadParagraph: string;
  keyPoints?: string[];
  stepByStepBreakdown?: { step: number; title: string; detail: string }[];
  intuitiveAnalogy?: string;
  mathematicalIntuition?: string;
  practiceSuggestion: string;
  recommendedExperimentId?: string;
  whyExplanation: string;
}

export interface AdaptiveEvaluation {
  mode: AdaptiveMode;
  rationale: string;
  title: string;
  badgeLabel: string;
  badgeVariant: 'amber' | 'teal' | 'emerald';
  showSimplifiedExplanation: boolean;
  showDeepExplanation: boolean;
  showVisualReinforcement: boolean;
  recommendedExperiment?: {
    id: string;
    title: string;
    reason: string;
    levelNumber: number;
  };
  reinforcementSummary?: {
    simplifiedExplanation: string;
    keyTakeaway: string;
    workedExample?: string;
  };
  deepDiveInsight?: {
    title: string;
    mathematicalProof: string;
    extensionChallenge: string;
  };
  authoredContent?: AuthoredAdaptiveContent;
}

/**
 * Normalizes any module slug or concept identifier to standard concept keys
 */
export function normalizeConceptKey(raw: string): string {
  const s = raw.toLowerCase().trim();
  if (s.includes('superpos') || s.includes('hadamard') || s.includes('sup-')) return 'superposition';
  if (s.includes('entangle') || s.includes('bell') || s.includes('cnot') || s.includes('ent-')) return 'entanglement';
  if (s.includes('algo') || s.includes('grover') || s.includes('deutsch') || s.includes('alg-')) return 'algorithms';
  if (s.includes('propagat') || s.includes('circuit') || s.includes('cir-') || s.includes('wire')) return 'circuits';
  if (s.includes('measur') || s.includes('shot') || s.includes('collapse')) return 'measurement';
  if (s.includes('gate') || s.includes('pauli') || s.includes('unitary') || s.includes('gat-')) return 'gates';
  if (s.includes('qubit') || s.includes('qub-') || s.includes('bloch') || s.includes('state')) return 'qubits';
  return 'fundamentals';
}

/**
 * Mapping from normalized concept keyword to canonical Circuit Lab experiments
 */
const MODULE_EXPERIMENT_MAPPINGS: Record<
  string,
  {
    reinforcementExpId: string;
    reinforcementReason: string;
    advancedExpId: string;
    advancedReason: string;
    simplifiedNote: string;
    deepDiveNote: string;
  }
> = {
  superposition: {
    reinforcementExpId: 'exp-h-gate',
    reinforcementReason: 'Observe how a single Hadamard gate physically places state |0⟩ into equal 50/50 measurement superposition.',
    advancedExpId: 'exp-h-twice',
    advancedReason: 'Explore how applying H twice triggers wave interference H·H = I, completely cancelling the |1⟩ amplitude.',
    simplifiedNote: 'Think of a classical bit like a light switch (strictly OFF or ON). A qubit in superposition is like a spinning coin: while it is spinning, it has a 50% probability of landing heads (|0⟩) and 50% tails (|1⟩).',
    deepDiveNote: 'Unitary Proof: H = (1/√2)[[1, 1], [1, -1]]. Since H is Hermitian and unitary, H² = I. Applying H|0⟩ yields |+⟩, and applying H again yields H|+⟩ = H²|0⟩ = I|0⟩ = |0⟩ with zero phase dispersion.'
  },
  qubits: {
    reinforcementExpId: 'exp-measurement',
    reinforcementReason: 'Measure the unperturbed ground state |0⟩ to verify deterministic collapse vs superpositions.',
    advancedExpId: 'exp-x-gate',
    advancedReason: 'Test state inversion on the Bloch sphere using the Pauli-X unitary operation.',
    simplifiedNote: 'A qubit is not a classical value. It is represented by a 2D state vector |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1 according to the Born rule.',
    deepDiveNote: 'Bloch Sphere Geometry: Pure states map to the surface of the S² unit sphere parametrized by polar angle θ ∈ [0, π] and azimuthal phase φ ∈ [0, 2π). Orthogonal states |0⟩ and |1⟩ are antipodal (180° apart) on the sphere.'
  },
  fundamentals: {
    reinforcementExpId: 'exp-measurement',
    reinforcementReason: 'Verify how classical bits differ from quantum states through projective measurement.',
    advancedExpId: 'exp-x-gate',
    advancedReason: 'Implement the quantum analogue of the classical NOT gate (Pauli-X).',
    simplifiedNote: 'Classical computers must evaluate 8 possible 3-bit combinations sequentially. Quantum systems process information as linear combinations of all basis states simultaneously.',
    deepDiveNote: 'Hilbert Space Dimension: An n-qubit register lives in a 2^n dimensional complex Hilbert space ℂ^(2^n). Simulating 5 qubits requires tracking 32 complex amplitudes.'
  },
  gates: {
    reinforcementExpId: 'exp-x-gate',
    reinforcementReason: 'Practice applying Pauli-X bit flips before proceeding to phase rotations.',
    advancedExpId: 'exp-phase-flip',
    advancedReason: 'Investigate how the Pauli-Z gate alters relative phase φ without changing measurement probabilities.',
    simplifiedNote: 'Quantum gates are reversible physical rotations of the state vector. Unlike classical AND/OR gates which destroy information, every quantum gate preserves total probability.',
    deepDiveNote: 'Reversibility: All single-qubit quantum gates correspond to 2x2 unitary matrices U satisfying U†U = I. Therefore, det(U) has unit modulus and every transformation is strictly invertible without entropy loss.'
  },
  circuits: {
    reinforcementExpId: 'exp-multi-qubit',
    reinforcementReason: 'Build multi-wire circuits and observe how independent wires combine into joint tensor product states.',
    advancedExpId: 'exp-cnot',
    advancedReason: 'Construct a controlled-NOT gate to create conditional quantum branching.',
    simplifiedNote: 'Circuits are read left to right. Each horizontal line is a qubit initialized to |0⟩. Vertical connections represent multi-qubit interactions.',
    deepDiveNote: 'Tensor Product Structure: The joint state of two independent qubits |ψ₁⟩ and |ψ₂⟩ is their Kronecker product |ψ₁⟩ ⊗ |ψ₂⟩. Multi-qubit unitary operations evolve the composite 2^n vector space.'
  },
  entanglement: {
    reinforcementExpId: 'exp-bell-state',
    reinforcementReason: 'Construct the canonical Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 and observe 100% correlation.',
    advancedExpId: 'exp-entanglement',
    advancedReason: 'Test the Bell inequality violation and verify that entanglement cannot be described by local hidden variables.',
    simplifiedNote: 'Entanglement means two qubits become so strongly correlated that you cannot describe one without the other, regardless of spatial separation. Measuring one immediately dictates the other.',
    deepDiveNote: 'Non-Separability: The state |Φ⁺⟩ cannot be factored as |a⟩ ⊗ |b⟩ for any single-qubit states |a⟩ and |b⟩. Schmidt decomposition yields rank 2, confirming maximal entanglement and von Neumann entropy of 1 bit.'
  },
  algorithms: {
    reinforcementExpId: 'exp-deutsch-jozsa',
    reinforcementReason: 'Run the Deutsch-Jozsa algorithm to determine if an oracle function is constant or balanced in a single evaluation.',
    advancedExpId: 'exp-grover',
    advancedReason: 'Explore Grover search amplitude amplification to find marked items with quadratic speedup.',
    simplifiedNote: 'Quantum algorithms use phase kickback and constructive interference to amplify correct answers while canceling wrong answers.',
    deepDiveNote: 'Quantum Speedup: Deutsch-Jozsa requires 1 quantum evaluation versus 2^(n-1) + 1 classical queries. Grover amplitude amplification rotates the state vector toward the target state in O(√N) iterations.'
  },
  measurement: {
    reinforcementExpId: 'exp-measurement',
    reinforcementReason: 'Practice observing single vs multi-shot projective measurement outcomes.',
    advancedExpId: 'exp-superposition',
    advancedReason: 'Test how repeated measurements converge to Born rule probabilities over large shot samples.',
    simplifiedNote: 'Measurement forces a continuous quantum state into a discrete classical outcome with probability proportional to the square of its amplitude.',
    deepDiveNote: 'Wavefunction Collapse: Projective measurement is described by Hermitian observables with spectral decomposition M = ∑ m_i P_i. Probability of eigenvalue m_i is ⟨ψ|P_i|ψ⟩.'
  }
};

/**
 * Rich authored structured content that genuinely changes the written lesson presentation
 * based on whether the learner is in REINFORCEMENT, STANDARD, or EXTENSION mode.
 */
export function getAuthoredAdaptiveContent(
  conceptKey: string,
  mode: AdaptiveMode
): AuthoredAdaptiveContent {
  const normKey = normalizeConceptKey(conceptKey);
  const normalizedMode = mode === 'advanced' ? 'extension' : mode;

  switch (normKey) {
    case 'superposition':
      if (normalizedMode === 'reinforcement') {
        return {
          mode: 'reinforcement',
          title: 'Superposition · Step-by-Step Breakdown',
          badge: 'Reinforcement Mode',
          leadParagraph:
            "Let's simplify this. Instead of thinking about the final measurement first, watch what happens when we apply the H gate step-by-step.",
          stepByStepBreakdown: [
            { step: 1, title: 'Start at Ground State |0⟩', detail: 'The qubit begins deterministic at the North Pole with 100% certainty of measuring 0.' },
            { step: 2, title: 'Apply the Hadamard Gate (H)', detail: 'The H gate performs a 90° rotation around Y followed by 180° around X, steering the statevector onto the equator.' },
            { step: 3, title: 'Observe Resulting Probabilities', detail: 'On the equator, the state holds equal amplitudes α = β = 1/√2, giving exactly 50% probability for |0⟩ and 50% for |1⟩.' }
          ],
          intuitiveAnalogy:
            'Think of a classical bit like a light switch (strictly OFF or ON). A qubit in superposition is like a spinning coin: while it is spinning, it has a 50% probability of landing heads (|0⟩) and 50% tails (|1⟩).',
          practiceSuggestion: 'Try the single Hadamard experiment in Circuit Lab to see this physical rotation demonstrated.',
          recommendedExperimentId: 'exp-h-gate',
          whyExplanation: "We noticed earlier questions or checks on this topic were challenging. Here is a scaffolded, step-by-step breakdown."
        };
      }
      if (normalizedMode === 'extension') {
        return {
          mode: 'extension',
          title: 'Superposition · Unitary Invariance & Phase Intuition',
          badge: 'Extension Mode',
          leadParagraph:
            "You have demonstrated strong conceptual understanding of basic superposition. Now explore how unitary invariance and phase interference govern superpositions across different basis inputs.",
          mathematicalIntuition:
            'Unitary Proof: The Hadamard matrix H = (1/√2)[[1, 1], [1, -1]] is Hermitian and unitary (H = H† = H⁻¹), which implies H² = I. Applying H to |+⟩ yields H|+⟩ = H²|0⟩ = |0⟩, demonstrating constructive and destructive wave interference.',
          keyPoints: [
            'Hermitian & Unitary Invariance: H² = I implies perfect reversibility without entropy loss.',
            'Phase Encoding: H|1⟩ = |−⟩ = (|0⟩ − |1⟩)/√2 encodes a relative π phase difference with identical 50/50 measurement probabilities.',
            'Orthogonal Superpositions: States |+⟩ and |−⟩ form a complete orthonormal basis on the X-axis.'
          ],
          practiceSuggestion: 'Synthesize the H · H = I circuit in Circuit Lab to verify total phase cancellation of the |1⟩ state.',
          recommendedExperimentId: 'exp-h-twice',
          whyExplanation: "You demonstrated strong mastery on your first attempt. Deeper mathematical intuition and challenge unlocked."
        };
      }
      // Standard
      return {
        mode: 'standard',
        title: 'Understanding Quantum Superposition',
        badge: 'Standard Mode',
        leadParagraph:
          'A qubit can be prepared in a quantum state that leads to multiple possible measurement outcomes. Unlike classical switches that must be strictly 0 or 1, a qubit holds continuous probability amplitudes.',
        keyPoints: [
          'Statevector: |ψ⟩ = α|0⟩ + β|1⟩ where α and β are complex probability amplitudes.',
          'Born Rule: The probability of measuring outcome 0 is |α|² and outcome 1 is |β|² (totaling 100%).',
          'Hadamard Gate: Maps basis state |0⟩ into equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2.'
        ],
        intuitiveAnalogy:
          'Like a musical chord holding multiple resonant frequencies simultaneously before a microphone records a specific pitch.',
        practiceSuggestion: 'Interact with the Superposition Visualizer below to test applying and removing the H gate.',
        recommendedExperimentId: 'exp-h-gate',
        whyExplanation: 'Standard guided sequence: conceptual core, interactive visualizer, prediction check, and circuit practice.'
      };

    case 'qubits':
      if (normalizedMode === 'reinforcement') {
        return {
          mode: 'reinforcement',
          title: 'Qubit States · First-Principles Simplification',
          badge: 'Reinforcement Mode',
          leadParagraph:
            "Let's break down the qubit state from first principles. A qubit is not a mystical particle—it is simply a physical 2-level quantum system.",
          stepByStepBreakdown: [
            { step: 1, title: 'Ground State |0⟩', detail: 'The lowest energy state. Measuring an unperturbed qubit in |0⟩ yields outcome 0 with 100% certainty.' },
            { step: 2, title: 'Excited State |1⟩', detail: 'Applying a Pauli-X NOT gate flips the state completely to |1⟩ (100% certainty of 1).' },
            { step: 3, title: 'Continuous Coordinates', detail: 'Any state between |0⟩ and |1⟩ is described by two angles: latitude (θ) and longitude (φ) on the Bloch sphere.' }
          ],
          intuitiveAnalogy:
            'Imagine planet Earth: the North Pole is state |0⟩ and the South Pole is state |1⟩. While a classical bit can only live at the poles, a qubit can point to any city on the globe.',
          practiceSuggestion: 'Switch between Probability View and Bloch Sphere View to see how the coordinates map directly to odds.',
          recommendedExperimentId: 'exp-measurement',
          whyExplanation: "We simplified the description into 3 concrete steps to clarify the physical meaning of |0⟩ and |1⟩."
        };
      }
      if (normalizedMode === 'extension') {
        return {
          mode: 'extension',
          title: 'Qubit States · Hilbert Space Geometry & Phase',
          badge: 'Extension Mode',
          leadParagraph:
            "You have demonstrated strong grasp of basic qubit states. Now explore how global phase vs relative phase determines physical distinguishability.",
          mathematicalIntuition:
            'Bloch Parametrization: Up to an unobservable global phase e^(iγ), any pure qubit state can be uniquely written as |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, where polar angle θ ∈ [0, π] and azimuthal angle φ ∈ [0, 2π). Antipodal points on the sphere are strictly orthogonal: ⟨0|1⟩ = 0.',
          keyPoints: [
            'Global Phase Invariance: |ψ⟩ and e^(iγ)|ψ⟩ produce identical measurement probabilities and expectation values for all observables.',
            'Relative Phase Observability: The relative phase φ between |0⟩ and |1⟩ alters expectation values ⟨X⟩ and ⟨Y⟩, even when ⟨Z⟩ is unchanged.',
            'Density Matrix: Pure states satisfy Tr(ρ²) = 1 and reside on the surface of the Bloch ball.'
          ],
          practiceSuggestion: 'Apply a Phase-S gate in Circuit Lab to rotate azimuthal angle φ without changing polar angle θ.',
          recommendedExperimentId: 'exp-x-gate',
          whyExplanation: "High first-attempt accuracy detected. Advanced geometric state-space formulation unlocked."
        };
      }
      return {
        mode: 'standard',
        title: 'Qubit State Representation & Vectors',
        badge: 'Standard Mode',
        leadParagraph:
          'A quantum bit (qubit) generalizes the classical binary bit into a complex two-dimensional Hilbert space. Its state is denoted in Dirac notation as |ψ⟩ = α|0⟩ + β|1⟩.',
        keyPoints: [
          'Dirac Ket Notation: |0⟩ and |1⟩ represent standard computational basis states.',
          'Amplitudes: α and β are complex numbers whose squared magnitudes satisfy |α|² + |β|² = 1.',
          'Bloch Sphere: A geometric sphere of radius 1 where any pure single-qubit state corresponds to a point on the surface.'
        ],
        intuitiveAnalogy:
          'While a classical bit is like a coin lying flat on a table (definitively heads or tails), a qubit can point anywhere on the surface of a sphere.',
        practiceSuggestion: 'Explore the 3 views below: Probability View, State Amplitudes, and Bloch Sphere.',
        recommendedExperimentId: 'exp-measurement',
        whyExplanation: 'Standard guided sequence.'
      };

    case 'entanglement':
      if (normalizedMode === 'reinforcement') {
        return {
          mode: 'reinforcement',
          title: 'Entanglement · Demystifying Quantum Correlation',
          badge: 'Reinforcement Mode',
          leadParagraph:
            "Let's simplify entanglement: it is not a physical invisible string connecting particles, but rather an unbreakable mathematical correlation between measurement outcomes.",
          stepByStepBreakdown: [
            { step: 1, title: 'Two Independent Wires', detail: 'We start with two unentangled qubits: q0 in |0⟩ and q1 in |0⟩. The joint state is |00⟩.' },
            { step: 2, title: 'Hadamard on Qubit 0', detail: 'Qubit 0 enters superposition: state becomes (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2.' },
            { step: 3, title: 'CNOT Entangles Wires', detail: 'CNOT flips Qubit 1 only when Qubit 0 is 1. The state transforms to (|00⟩ + |11⟩)/√2.' }
          ],
          intuitiveAnalogy:
            'Imagine a pair of shoes sealed into two identical boxes. You send one to Mumbai and one to London. Opening your box and seeing a left shoe immediately guarantees the other box contains the right shoe, without sending any signal.',
          practiceSuggestion: 'Run the Bell State Experiment in Circuit Lab to observe 100% correlation across 1,024 shots.',
          recommendedExperimentId: 'exp-bell-state',
          whyExplanation: "We simplified the two-qubit interaction to clearly demonstrate why measuring one qubit dictates the other."
        };
      }
      if (normalizedMode === 'extension') {
        return {
          mode: 'extension',
          title: 'Entanglement · Non-Separability & Bell Inequalities',
          badge: 'Extension Mode',
          leadParagraph:
            "You have demonstrated solid understanding of Bell state synthesis. Now explore non-separability, concurrence, and Bell inequality violations.",
          mathematicalIntuition:
            'Non-Separability & Concurrence: A two-qubit pure state |ψ⟩ = ∑ c_ij |ij⟩ is separable if and only if c_00 c_11 - c_01 c_10 = 0. For Bell state |Φ⁺⟩, this determinant equals 0.5 - 0 = 0.5, achieving maximal entanglement and violating the CHSH inequality with S = 2√2 ≈ 2.828 > 2.',
          keyPoints: [
            'Schmidt Rank: The Schmidt decomposition of |Φ⁺⟩ has rank 2, confirming that neither qubit has a reduced density matrix with purity 1.',
            'No-Signaling Theorem: Although outcomes are correlated, local density matrix ρ_A = Tr_B(|Φ⁺⟩⟨Φ⁺|) = I/2 is maximally mixed, preventing superluminal communication.',
            'Complete Bell Basis: Four mutually orthogonal maximally entangled states form an orthonormal basis for ℂ⁴.'
          ],
          practiceSuggestion: 'Verify the 4-basis state probability distribution in Circuit Lab with 4,096 shots.',
          recommendedExperimentId: 'exp-entanglement',
          whyExplanation: "Strong performance on multi-qubit gates detected. Theoretical non-separability insights unlocked."
        };
      }
      return {
        mode: 'standard',
        title: 'Two-Qubit States & Entanglement',
        badge: 'Standard Mode',
        leadParagraph:
          'Entanglement is a fundamental quantum phenomenon where two or more qubits form a joint composite state that cannot be decomposed into individual independent states.',
        keyPoints: [
          'Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 exhibits perfect 100% outcome correlation.',
          'Created by pairing a Hadamard gate on q0 with a Controlled-NOT (CNOT) targeting q1.',
          'Local measurements yield random 50/50 bits, but comparing measurements reveals identical values.'
        ],
        intuitiveAnalogy:
          'Two coins tossed in different rooms that always land on the exact same face (both heads or both tails), even though each coin individually has fair 50/50 odds.',
        practiceSuggestion: 'Use the Entanglement Visualizer below to test single-qubit measurement collapse.',
        recommendedExperimentId: 'exp-bell-state',
        whyExplanation: 'Standard guided sequence.'
      };

    default:
      // Generic fallback for any other concept
      if (normalizedMode === 'reinforcement') {
        return {
          mode: 'reinforcement',
          title: 'Reinforced Explanation & Step-by-Step Context',
          badge: 'Reinforcement Mode',
          leadParagraph:
            "Let's look at this concept from a more intuitive perspective with simplified steps before continuing.",
          stepByStepBreakdown: [
            { step: 1, title: 'Initial Condition', detail: 'Every quantum register begins in the known computational ground state.' },
            { step: 2, title: 'Transformation', detail: 'Quantum operations rotate probability amplitudes reversibly.' },
            { step: 3, title: 'Measurement', detail: 'Readout converts quantum probabilities into classical bits.' }
          ],
          intuitiveAnalogy: 'Think of quantum systems like wave interference: waves can add together or cancel each other out.',
          practiceSuggestion: 'Run a live experiment in Circuit Lab to ground this intuition.',
          whyExplanation: "Adaptive reinforcement active based on recent question checks."
        };
      }
      if (normalizedMode === 'extension') {
        return {
          mode: 'extension',
          title: 'Advanced Theoretical Formulation',
          badge: 'Extension Mode',
          leadParagraph:
            "You have demonstrated strong proficiency with this concept. Explore the deeper mathematical framework and formal properties below.",
          mathematicalIntuition:
            'Hilbert Space Framework: Quantum transformations are bounded linear unitary operators on complex Hilbert space preserving the inner product ⟨ψ|φ⟩ = ⟨Uψ|Uφ⟩.',
          keyPoints: [
            'Preservation of Total Probability: U†U = I ensures unitary evolution is strictly entropy-conserving.',
            'Composite Spaces: Tensor products ⨂ scale Hilbert space dimension as 2^n for n qubits.',
            'Measurement Postulate: Expectation values satisfy ⟨A⟩ = ⟨ψ|A|ψ⟩.'
          ],
          practiceSuggestion: 'Test an advanced circuit challenge in Circuit Lab.',
          whyExplanation: "Demonstrated conceptual mastery. Advanced insights unlocked."
        };
      }
      return {
        mode: 'standard',
        title: 'Core Concept & Interactive Exploration',
        badge: 'Standard Mode',
        leadParagraph:
          'Explore this foundational quantum computing concept through structured explanations, visual models, and interactive circuit experiments.',
        keyPoints: [
          'Quantum states represent information as linear combinations in complex vector space.',
          'Unitary gates steer amplitudes without losing information.',
          'Measurements project quantum states into discrete classical bits.'
        ],
        practiceSuggestion: 'Follow the interactive learning steps below.',
        whyExplanation: 'Standard guided curriculum.'
      };
  }
}

/**
 * Evaluates the learner's signals and generates a transparent adaptation profile.
 */
export function evaluateAdaptiveProfile(
  moduleSlug: string,
  conceptId: string,
  record?: ConceptAdaptiveRecord,
  contextSignals?: {
    lastAnswerCorrect?: boolean;
    mistakeCount?: number;
    attemptCount?: number;
    challengeHintsUsed?: number;
  }
): AdaptiveEvaluation {
  const normKey = normalizeConceptKey(`${moduleSlug} ${conceptId}`);
  const mapping = MODULE_EXPERIMENT_MAPPINGS[normKey] || MODULE_EXPERIMENT_MAPPINGS['fundamentals'];

  // Infer mode from signals
  const mistakes = (record?.mistakeCount || 0) + (contextSignals?.mistakeCount || 0);
  const attempts = (record?.attemptCount || 0) + (contextSignals?.attemptCount || 0);
  const correct = (record?.correctCount || 0) + (contextSignals?.lastAnswerCorrect ? 1 : 0);
  const hintsUsed = contextSignals?.challengeHintsUsed || 0;

  let mode: AdaptiveMode = 'standard';

  if (contextSignals?.lastAnswerCorrect === false || mistakes > 0 || hintsUsed >= 2) {
    mode = 'reinforcement';
  } else if (correct >= 1 && mistakes === 0 && attempts <= 1 && hintsUsed === 0) {
    mode = record?.mode === 'advanced' ? 'advanced' : 'extension';
  } else if (record?.mode) {
    mode = record.mode;
  }

  // Lookup recommended experiments
  const recExpId = mode === 'reinforcement' ? mapping.reinforcementExpId : mapping.advancedExpId;
  const recExp = GUIDED_EXPERIMENTS.find((e) => e.id === recExpId) || GUIDED_EXPERIMENTS[0];
  const recReason = mode === 'reinforcement' ? mapping.reinforcementReason : mapping.advancedReason;

  const authored = getAuthoredAdaptiveContent(normKey, mode);

  if (mode === 'reinforcement') {
    return {
      mode: 'reinforcement',
      title: 'Adaptive Learning · Reinforcement Focus',
      badgeLabel: 'Reinforcement Mode',
      badgeVariant: 'amber',
      rationale: "Let's reinforce this concept with a visual breakdown and a worked example before moving on.",
      showSimplifiedExplanation: true,
      showDeepExplanation: false,
      showVisualReinforcement: true,
      authoredContent: authored,
      recommendedExperiment: {
        id: recExp.id,
        title: recExp.title,
        reason: recReason,
        levelNumber: recExp.levelNumber
      },
      reinforcementSummary: {
        simplifiedExplanation: mapping.simplifiedNote,
        keyTakeaway: 'Mastering the physical intuition ensures circuit experiments make total sense.',
        workedExample: `Try the ${recExp.title} in Circuit Lab to see this behavior demonstrated step-by-step.`
      }
    };
  }

  if (mode === 'extension' || mode === 'advanced') {
    return {
      mode,
      title: mode === 'advanced' ? 'Concept Mastered · Advanced Exploration Unlocked' : 'Concept Mastered · Extension & Deep Dive',
      badgeLabel: mode === 'advanced' ? 'Advanced Exploration' : 'Extension Mode',
      badgeVariant: 'emerald',
      rationale: "You've demonstrated strong conceptual understanding on your first attempt. Optional deeper insight and challenge unlocked.",
      showSimplifiedExplanation: false,
      showDeepExplanation: true,
      showVisualReinforcement: false,
      authoredContent: authored,
      recommendedExperiment: {
        id: recExp.id,
        title: recExp.title,
        reason: recReason,
        levelNumber: recExp.levelNumber
      },
      deepDiveInsight: {
        title: 'Deep Mathematical & Theoretical Insight',
        mathematicalProof: mapping.deepDiveNote,
        extensionChallenge: `Test your mastery by completing ${recExp.title} with 0 hints.`
      }
    };
  }

  // Standard Mode
  return {
    mode: 'standard',
    title: 'Standard Curriculum · Guided Exploration',
    badgeLabel: 'Standard Pace',
    badgeVariant: 'teal',
    rationale: 'Follow the standard interactive learning sequence: concept explanation, interactive visualizer, prediction, and circuit practice.',
    showSimplifiedExplanation: false,
    showDeepExplanation: false,
    showVisualReinforcement: true,
    authoredContent: authored,
    recommendedExperiment: {
      id: recExp.id,
      title: recExp.title,
      reason: recReason,
      levelNumber: recExp.levelNumber
    }
  };
}
