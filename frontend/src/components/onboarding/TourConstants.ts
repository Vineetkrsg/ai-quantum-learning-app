export interface TourStepDefinition {
  id: string;
  stepNumber: number;
  route: string;
  targetSelector: string;
  title: string;
  badge?: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionHint?: string;
  tabSwitch?: 'canvas' | 'code' | 'visualization' | 'compare';
}

export const TOUR_STEPS: TourStepDefinition[] = [
  // Step 1 — Dashboard
  {
    id: 'tour-dashboard',
    stepNumber: 1,
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-overview"]',
    title: 'Your Quantum Learning Home',
    badge: 'Step 1: Dashboard',
    content: 'Welcome to your personalized dashboard! Here you can check your overall curriculum progress, continue right where you left off, view active module goals, and launch experiments.',
    position: 'bottom',
    actionHint: 'Your starting point for all quantum courses and tools.'
  },

  // Step 2 — Learn
  {
    id: 'tour-learn',
    stepNumber: 2,
    route: '/learn',
    targetSelector: '[data-tour="learn-curriculum"]',
    title: 'Interactive Curriculum',
    badge: 'Step 2: Learn',
    content: 'Start here if quantum computing is new to you. Explore 7 structured modules from Dirac bra-ket notation and single qubits to superposition, entanglement, and Grover search. Zero prior quantum knowledge required!',
    position: 'bottom',
    actionHint: 'Each module contains structured interactive lessons and self-checks.'
  },

  // Step 3 — Interactive Lesson
  {
    id: 'tour-lesson',
    stepNumber: 3,
    route: '/learn/fundamentals',
    targetSelector: '[data-tour="lesson-pattern"]',
    title: 'The QuLearn Learning Pattern',
    badge: 'Step 3: Interactive Lesson',
    content: 'Every lesson follows a proven pedagogy: Understand → Interact → Predict → Practice → Check Understanding. Intuitive physical analogies and sandboxes let you touch concepts before seeing mathematical equations.',
    position: 'bottom',
    actionHint: 'Exploring lessons will never modify your progress until you complete activities.'
  },

  // Step 4 — Circuit Building
  {
    id: 'tour-circuit-building',
    stepNumber: 4,
    route: '/lab',
    targetSelector: '[data-tour="circuit-building"]',
    title: 'Circuit Building & Qubit Wires',
    badge: 'Step 4: Circuits',
    content: 'Quantum programs are represented as circuits! Each horizontal wire represents a qubit starting in |0⟩, and you place quantum gates (such as H, X, Z, or CNOT) at sequential time steps to manipulate the quantum state.',
    position: 'bottom',
    actionHint: 'Click a gate from the palette, then click any wire slot to position it.'
  },

  // Step 5 — Circuit Lab
  {
    id: 'tour-lab-studio',
    stepNumber: 5,
    route: '/lab',
    targetSelector: '[data-tour="lab-studio"]',
    title: 'Circuit Lab',
    badge: 'Step 5: Circuit Lab',
    content: 'This is the platform\'s powerful experimentation environment. Build custom circuits, explore guided scientific experiments across 4 difficulty tiers, make hypotheses, and understand the deep physics of what happened.',
    position: 'bottom',
    actionHint: 'Features full statevector simulation, step-by-step hints, and AI tutor assistance.'
  },

  // Step 6 — Circuit ↔ Code
  {
    id: 'tour-lab-code',
    stepNumber: 6,
    route: '/lab',
    targetSelector: '[data-tour="lab-code"]',
    title: 'Circuit ↔ Code Translation',
    badge: 'Step 6: Code Connection',
    content: 'QuLearn AI seamlessly translates your visual quantum circuits into production-grade Python Qiskit code and OpenQASM 2.0. You can copy code directly to run on IBM Quantum hardware or local Jupyter notebooks.',
    position: 'top',
    tabSwitch: 'code',
    actionHint: 'Connects visual conceptual models directly with industry tools.'
  },

  // Step 7 — Simulation & Visualization
  {
    id: 'tour-lab-visualization',
    stepNumber: 7,
    route: '/lab',
    targetSelector: '[data-tour="lab-visualization"]',
    title: 'Simulation & State Visualization',
    badge: 'Step 7: Visualization',
    content: 'Running a circuit executes our exact statevector simulator across 1,024 shots. QuLearn AI renders probability distributions, complex amplitude bars, and measurement histograms so you can intuitively see quantum behavior.',
    position: 'top',
    tabSwitch: 'canvas',
    actionHint: 'Observe quantum statistical fluctuations and state collapses in real time.'
  },

  // Step 8 — Challenges
  {
    id: 'tour-challenges',
    stepNumber: 8,
    route: '/challenges',
    targetSelector: '[data-tour="challenges-area"]',
    title: 'Practical Challenges & Assessments',
    badge: 'Step 8: Challenges',
    content: 'Once you grasp a concept, challenges test your synthesis skills! Synthesize quantum states under strict gate limits, solve phase inversions, construct Bell states, and earn XP.',
    position: 'bottom',
    actionHint: 'Put your knowledge to the test with real algorithmic problem-solving.'
  },

  // Step 9 — Progress
  {
    id: 'tour-progress',
    stepNumber: 9,
    route: '/progress',
    targetSelector: '[data-tour="progress-analytics"]',
    title: 'Authentic Progress & Mastery',
    badge: 'Step 9: Progress',
    content: 'Your progress is calculated strictly from what you actually complete — lessons mastered, quizzes solved, and circuits simulated. No fake progress is ever awarded for merely viewing the tour.',
    position: 'bottom',
    actionHint: 'Track concept mastery across Dirac notation, superposition, and algorithms.'
  },

  // Step 10 — You're Ready!
  {
    id: 'tour-finish',
    stepNumber: 10,
    route: '/dashboard',
    targetSelector: '[data-tour="dashboard-overview"]',
    title: "You're Ready to Begin!",
    badge: 'Step 10: Complete',
    content: 'You now know how QuLearn AI works! Start with the Fundamentals in the curriculum, test what quantum computing actually feels like in the Interactive Demo, or experiment freely in Circuit Lab.',
    position: 'center',
    actionHint: 'Choose your next step below to begin your journey.'
  }
];
