import { LearningModule } from '../types/learning';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    slug: 'fundamentals',
    title: 'Quantum Computing Fundamentals',
    description: 'Learn what information is, why classical bits hit physical limits, and how qubits change the foundation of computation.',
    difficulty: 'Beginner',
    progress: 0,
    estimatedTime: '40 mins',
    tags: ['Information', 'Classical vs Quantum', 'Qubits'],
    iconName: 'Sparkles',
    lessons: [
      { id: 'fund-1', title: 'What is Computing?', description: 'Information, switches, and why computers use binary bits', durationMinutes: 8, isCompleted: false, type: 'concept' },
      { id: 'fund-2', title: 'What Makes Quantum Different?', description: 'How quantum algorithms provide unique advantage for specific problems', durationMinutes: 8, isCompleted: false, type: 'concept' },
      { id: 'fund-3', title: 'Meet the Qubit', description: 'Understanding |0⟩ and |1⟩ as physical states', durationMinutes: 8, isCompleted: false, type: 'interactive' },
      { id: 'fund-4', title: 'Measurement', description: 'How quantum states collapse into classical readout values', durationMinutes: 8, isCompleted: false, type: 'circuit-lab' },
      { id: 'fund-5', title: 'Check Your Understanding', description: 'Test your understanding with quick self-check questions', durationMinutes: 8, isCompleted: false, type: 'quiz' }
    ]
  },
  {
    id: 'mod-2',
    slug: 'qubits',
    title: 'Qubits & Quantum States',
    description: 'Explore state representation, the Pauli-X bit-flip gate, and the role of probability in quantum systems.',
    difficulty: 'Beginner',
    progress: 0,
    estimatedTime: '45 mins',
    tags: ['|0⟩ & |1⟩', 'Pauli-X', 'Probabilities'],
    iconName: 'Atom',
    lessons: [
      { id: 'qub-1', title: 'Qubit States', description: 'Visualizing |0⟩ and |1⟩ as distinct physical states', durationMinutes: 8, isCompleted: false, type: 'concept' },
      { id: 'qub-2', title: 'Changing a Qubit (Pauli-X)', description: 'Transforming |0⟩ into |1⟩ using the quantum NOT gate', durationMinutes: 10, isCompleted: false, type: 'interactive' },
      { id: 'qub-3', title: 'Probability in Quantum States', description: 'Understanding how likelihoods govern measurement without dense math', durationMinutes: 8, isCompleted: false, type: 'concept' },
      { id: 'qub-4', title: 'State Exploration', description: 'Comparing outcomes between unchanged and flipped states', durationMinutes: 10, isCompleted: false, type: 'circuit-lab' },
      { id: 'qub-5', title: 'Self Check', description: 'Review your mastery of single qubit states and transitions', durationMinutes: 9, isCompleted: false, type: 'quiz' }
    ]
  },
  {
    id: 'mod-3',
    slug: 'superposition',
    title: 'Superposition',
    description: 'Discover how qubits exist in combinations of states, explore the Hadamard gate, and predict probability distributions.',
    difficulty: 'Beginner',
    progress: 0,
    estimatedTime: '50 mins',
    tags: ['Superposition', 'Hadamard', '50/50 Outcomes'],
    iconName: 'Layers',
    lessons: [
      { id: 'sup-1', title: 'What is Superposition?', description: 'Combining possibilities before physical measurement', durationMinutes: 8, isCompleted: false, type: 'concept' },
      { id: 'sup-2', title: 'The Hadamard Gate', description: 'Creating equal superpositions with the H gate', durationMinutes: 8, isCompleted: false, type: 'interactive' },
      { id: 'sup-3', title: 'Predict Before Running', description: 'Predict measurement distributions and test your intuition', durationMinutes: 8, isCompleted: false, type: 'interactive' },
      { id: 'sup-4', title: 'Applying H Twice', description: 'Discover quantum reversibility: why H followed by H returns to start', durationMinutes: 8, isCompleted: false, type: 'circuit-lab' },
      { id: 'sup-5', title: 'Superposition Experiment', description: 'Compare H, H→H, and X→H in live simulations', durationMinutes: 10, isCompleted: false, type: 'circuit-lab' },
      { id: 'sup-6', title: 'Superposition Challenge', description: 'Synthesize a superposition circuit from scratch', durationMinutes: 8, isCompleted: false, type: 'quiz' }
    ]
  },
  {
    id: 'mod-4',
    slug: 'gates',
    title: 'Quantum Gates',
    description: 'Master reversible transformations: Pauli X, Y, Z, phase rotations, and the two-qubit CNOT gate.',
    difficulty: 'Intermediate',
    progress: 0,
    estimatedTime: '55 mins',
    tags: ['Unitary Operations', 'Phase Flips', 'CNOT'],
    iconName: 'Binary',
    lessons: [
      { id: 'gat-1', title: 'What is a Quantum Gate?', description: 'Reversible operations that steer quantum states', durationMinutes: 8, isCompleted: false, type: 'concept' },
      { id: 'gat-2', title: 'The Pauli-X Gate', description: 'The bit-flip operator in practice', durationMinutes: 8, isCompleted: false, type: 'interactive' },
      { id: 'gat-3', title: 'The Hadamard Gate', description: 'Rotating poles into equatorial superpositions', durationMinutes: 8, isCompleted: false, type: 'interactive' },
      { id: 'gat-4', title: 'Z and Y Phase Gates', description: 'Flipping relative phase without changing measurement odds', durationMinutes: 10, isCompleted: false, type: 'concept' },
      { id: 'gat-5', title: 'CNOT (Controlled-NOT)', description: 'Two-qubit conditional flipping: control and target', durationMinutes: 11, isCompleted: false, type: 'circuit-lab' },
      { id: 'gat-6', title: 'Gate Playground', description: 'Explore how different gates modify quantum wires', durationMinutes: 10, isCompleted: false, type: 'quiz' }
    ]
  },
  {
    id: 'mod-5',
    slug: 'circuits',
    title: 'Quantum Circuits',
    description: 'Learn how to read, order, and compose sequences of quantum gates across multiple wires and time steps.',
    difficulty: 'Intermediate',
    progress: 0,
    estimatedTime: '50 mins',
    tags: ['Circuit Diagrams', 'Gate Ordering', 'Composition'],
    iconName: 'GitCommit',
    lessons: [
      { id: 'cir-1', title: 'Reading a Circuit', description: 'Wires, temporal steps, gate blocks, and measurement symbols', durationMinutes: 9, isCompleted: false, type: 'concept' },
      { id: 'cir-2', title: 'Gate Order Matters', description: 'Why H→X produces different intermediate states than X→H', durationMinutes: 10, isCompleted: false, type: 'interactive' },
      { id: 'cir-3', title: 'Build a Simple Circuit', description: 'Constructing your first custom sequential transformation', durationMinutes: 10, isCompleted: false, type: 'circuit-lab' },
      { id: 'cir-4', title: 'Multi-Step Circuits', description: 'Executing multi-gate combinations and verifying readouts', durationMinutes: 11, isCompleted: false, type: 'circuit-lab' },
      { id: 'cir-5', title: 'Circuit Challenge', description: 'Solve sequential ordering puzzles under gate constraints', durationMinutes: 10, isCompleted: false, type: 'quiz' }
    ]
  },
  {
    id: 'mod-6',
    slug: 'entanglement',
    title: 'Entanglement',
    description: 'Understand non-separable states, Einstein’s EPR paradox, and build the canonical Bell State.',
    difficulty: 'Intermediate',
    progress: 0,
    estimatedTime: '55 mins',
    tags: ['Bell State', 'Correlations', 'Two-Qubits'],
    iconName: 'Workflow',
    lessons: [
      { id: 'ent-1', title: 'What is Entanglement?', description: 'Correlated quantum states without faster-than-light signaling', durationMinutes: 9, isCompleted: false, type: 'concept' },
      { id: 'ent-2', title: 'Two-Qubit Registers', description: 'Four basis states: |00⟩, |01⟩, |10⟩, and |11⟩', durationMinutes: 9, isCompleted: false, type: 'concept' },
      { id: 'ent-3', title: 'CNOT in Action', description: 'Conditioning one qubit based on the state of another', durationMinutes: 9, isCompleted: false, type: 'interactive' },
      { id: 'ent-4', title: 'The Bell State', description: 'Step-by-step synthesis: H on q0 followed by CNOT(q0→q1)', durationMinutes: 10, isCompleted: false, type: 'circuit-lab' },
      { id: 'ent-5', title: 'Entanglement Experiment', description: 'Simulating 1,024 shots and observing 100% correlation', durationMinutes: 10, isCompleted: false, type: 'circuit-lab' },
      { id: 'ent-6', title: 'Entanglement Check', description: 'Validate your understanding of quantum correlations', durationMinutes: 8, isCompleted: false, type: 'quiz' }
    ]
  },
  {
    id: 'mod-7',
    slug: 'algorithms',
    title: 'Introduction to Quantum Algorithms',
    description: 'Learn how interference amplifies correct solutions in Deutsch-Jozsa and Grover search.',
    difficulty: 'Advanced',
    progress: 0,
    estimatedTime: '60 mins',
    tags: ['Interference', 'Deutsch-Jozsa', 'Grover Search'],
    iconName: 'Cpu',
    lessons: [
      { id: 'alg-1', title: 'What is an Algorithm?', description: 'Recipes for computation from sorting numbers to searching', durationMinutes: 9, isCompleted: false, type: 'concept' },
      { id: 'alg-2', title: 'What Makes Quantum Algorithms Different?', description: 'Harnessing interference to cancel incorrect answers', durationMinutes: 10, isCompleted: false, type: 'concept' },
      { id: 'alg-3', title: 'From Gates to Procedures', description: 'Combining initialization, oracle queries, and interference', durationMinutes: 10, isCompleted: false, type: 'interactive' },
      { id: 'alg-4', title: 'Grover’s Search Intuition', description: 'Quadratic speedup for searching unstructured data', durationMinutes: 11, isCompleted: false, type: 'concept' },
      { id: 'alg-5', title: 'Deutsch-Jozsa Oracle', description: 'Determining constant vs balanced functions in one query', durationMinutes: 10, isCompleted: false, type: 'interactive' },
      { id: 'alg-6', title: 'Explore an Example', description: 'Run a 2-qubit interference circuit and inspect outcomes', durationMinutes: 10, isCompleted: false, type: 'circuit-lab' }
    ]
  }
];
