import { LessonContent } from '../types/learning';

export const LESSONS_DATA: Record<string, LessonContent> = {
  // ==========================================
  // MODULE 1: FUNDAMENTALS (5 Mini-Lessons)
  // ==========================================
  'fundamentals': {
    slug: 'fundamentals',
    moduleId: 'mod-1',
    title: 'Quantum Computing Fundamentals',
    subtitle: 'Information, binary bits, physical limits, and introducing the qubit.',
    difficulty: 'Beginner',
    estimatedTime: '40 mins',
    overview: 'Welcome to quantum computing! You do not need a physics or mathematics degree to begin. This module starts with classical computers and demonstrates why moving to quantum mechanical principles opens entirely new ways of solving difficult problems.',
    labPresetId: 'measurement-demo',
    miniLessons: [
      {
        id: 'fund-1',
        title: 'Lesson 1 — What is Computing?',
        durationMinutes: 8,
        conceptExplanation: 'At its core, a computer is an information-processing machine. All our photos, messages, spreadsheets, and games are converted into numbers, and those numbers are represented using the simplest possible unit of information: the binary digit, or bit. A classical bit is a microscopic electrical switch that can only be in one of two states: 0 (switch open / low voltage) or 1 (switch closed / high voltage).',
        analogy: 'Imagine a simple light bulb in your room. It is either completely OFF (0) or completely ON (1). There is no third option. If you string 8 light bulbs together, you have a byte, representing numbers from 0 to 255.',
        visualNote: 'Classical Switch: [OFF = 0] or [ON = 1]',
        interactiveTry: {
          title: 'Thought Experiment: The Power of Scale',
          instruction: 'Consider how classical bits scale. Click below to test how many states 3 classical bits can hold at any single instant.',
          circuitPreview: 'bit[0] = 0 | bit[1] = 1 | bit[2] = 0  ─── (Classical Register)',
          predictionPrompt: 'At any single fraction of a second, how many different numbers can a 3-bit classical register hold simultaneously?',
          predictionOptions: [
            { id: 'opt-1', text: 'Exactly 1 number (e.g. 010 = 2)', isCorrect: true },
            { id: 'opt-2', text: 'All 8 numbers at the exact same moment', isCorrect: false },
            { id: 'opt-3', text: 'Infinite numbers', isCorrect: false }
          ],
          shots: 1,
          expectedDistribution: { '010': 100 },
          whyExplanation: 'Even though 3 bits can represent 8 possible combinations (from 000 to 111), a classical computer must choose exactly ONE state at any given microsecond. To search through 8 options, it checks them one after another.'
        },
        selfCheck: {
          question: 'What is the fundamental unit of classical computer data?',
          options: [
            { id: 'a', text: 'The byte (8 bits)' },
            { id: 'b', text: 'The binary bit (0 or 1)' },
            { id: 'c', text: 'The quantum transistor' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Correct! The binary bit is the smallest indivisible unit of classical information.',
          explanationIncorrect: 'Not quite. The binary bit (taking value 0 or 1) is the fundamental classical building block.'
        }
      },
      {
        id: 'fund-2',
        title: 'Lesson 2 — What Makes Quantum Different?',
        durationMinutes: 8,
        conceptExplanation: 'Quantum computers are NOT simply faster classical computers. They will not make word processors or web browsers run faster. Instead, they use principles of quantum mechanics (superposition and interference) to process structured problems in a fundamentally different mathematical manner. While silicon transistors stop shrinking due to electron leakage (quantum tunneling), quantum systems use those very quantum properties to our advantage.',
        analogy: 'Think of finding your way out of an intricate maze. A classical computer is like a single mouse trying one hallway at a time, backing up when it hits a dead end. A quantum algorithm acts more like water poured into the maze: it explores all paths simultaneously, and interference amplifies the path that reaches the exit.',
        visualNote: 'Classical: Sequential trials | Quantum: Wave interference over all paths',
        selfCheck: {
          question: 'Will quantum computers replace your home smartphone or laptop?',
          options: [
            { id: 'a', text: 'Yes, because they will load websites 1,000,000 times faster' },
            { id: 'b', text: 'No, they are specialized devices designed for specific mathematical problems' },
            { id: 'c', text: 'Yes, once silicon is completely outlawed' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Exactly. Quantum computers are specialized coprocessors for specific computational challenges (molecular modeling, optimization, cryptography), not general PC replacements.',
          explanationIncorrect: 'Remember: quantum computers do not run general sequential software faster; they excel at specific parallel mathematical interference tasks.'
        }
      },
      {
        id: 'fund-3',
        title: 'Lesson 3 — Meet the Qubit',
        durationMinutes: 8,
        conceptExplanation: 'The quantum counterpart of the classical bit is the quantum bit, or qubit. Instead of plain numbers 0 and 1, we use Dirac ket notation: |0⟩ (pronounced "ket zero") and |1⟩ (pronounced "ket one"). A qubit is a physical quantum system — such as the magnetic spin of an electron (spin-up |0⟩ or spin-down |1⟩) or the energy level of a superconducting artificial atom.',
        analogy: 'While a classical bit is like a coin lying flat on a table (definitively heads |0⟩ or tails |1⟩), a qubit is a sphere (the Bloch sphere). The north pole is |0⟩ and the south pole is |1⟩, but the qubit can point anywhere on the surface!',
        visualNote: 'Ground state: |0⟩ | Excited state: |1⟩',
        interactiveTry: {
          title: 'Try It: Measuring the Ground State |0⟩',
          instruction: 'A qubit is initialized to state |0⟩. Make a prediction and run a measurement simulation of 1,024 shots.',
          circuitPreview: 'q0 ─── M (Measure)',
          predictionPrompt: 'When an unperturbed qubit in state |0⟩ is measured, what outcome do you predict?',
          predictionOptions: [
            { id: 'p-0', text: '100% of measurements will yield 0', isCorrect: true },
            { id: 'p-1', text: '50% 0 and 50% 1', isCorrect: false },
            { id: 'p-random', text: 'Completely random output', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '0': 100 },
          whyExplanation: 'Because the qubit was prepared in pure basis state |0⟩ and no gates perturbed it, measuring it produces outcome 0 with 100% certainty. Quantum mechanics is predictable when a system is in a known basis state!'
        },
        selfCheck: {
          question: 'How do physicists write the state for ket-zero?',
          options: [
            { id: 'a', text: '(0)' },
            { id: 'b', text: '|0⟩' },
            { id: 'c', text: '[0]' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Correct! Dirac ket notation surrounds the state label with a vertical bar and angle bracket: |0⟩.',
          explanationIncorrect: 'In quantum mechanics, state vectors are denoted with Dirac notation: |0⟩.'
        }
      },
      {
        id: 'fund-4',
        title: 'Lesson 4 — Measurement & State Collapse',
        durationMinutes: 8,
        conceptExplanation: 'One of the most profound rules of quantum physics is the measurement postulate. A qubit can evolve through continuous, complex transformations, but whenever we physically measure it with a detector, it collapses instantly into a single classical outcome: either 0 or 1. You can never observe a qubit "in between" upon measurement; observation forces the quantum wave to choose.',
        analogy: 'Imagine taking a photograph of a fast-moving dancer. While dancing, they move fluidly in continuous space. But the camera snapshot freezes them into one discrete still frame.',
        visualNote: 'Quantum State ──[ Measurement ⊚ ]──> Classical 0 or 1',
        selfCheck: {
          question: 'What happens to a quantum state when a physical measurement occurs?',
          options: [
            { id: 'a', text: 'It stays in its quantum state permanently' },
            { id: 'b', text: 'It collapses into a definite classical basis state (0 or 1)' },
            { id: 'c', text: 'It disappears into heat' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Spot on! Physical observation forces the wave function to collapse to a deterministic classical outcome.',
          explanationIncorrect: 'Measurement fundamentally forces state collapse into one of the classical basis outcomes.'
        }
      },
      {
        id: 'fund-5',
        title: 'Lesson 5 — Check Your Understanding',
        durationMinutes: 8,
        conceptExplanation: 'Let us consolidate your foundational knowledge. You now understand what information is, why classical bits hit physical limits, how qubits represent quantum states, and the role of measurement collapse.',
        selfCheck: {
          question: 'Which statement accurately describes a qubit before measurement?',
          options: [
            { id: 'a', text: 'It can exist in a linear combination of |0⟩ and |1⟩ basis states' },
            { id: 'b', text: 'It is broken and has no value' },
            { id: 'c', text: 'It is always secretly just a classical 0 or 1' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Excellent! Qubits can be prepared in combinations of basis states, which collapse upon measurement.',
          explanationIncorrect: 'Review Lesson 3: Qubits exist in physical combinations of basis states until measured.'
        }
      }
    ],
    practice: {
      title: 'Fundamentals Practice: Measure the Initial State',
      instruction: 'Complete the measurement circuit by selecting the measurement operator (M) to read out qubit q[0].',
      wireTemplate: {
        qubitLabel: 'q[0] |0⟩ ───',
        beforeGate: '───',
        afterGate: '─── (Readout)'
      },
      availableGates: [
        { symbol: 'M', name: 'Measurement', isCorrect: true },
        { symbol: 'X', name: 'Pauli-X', isCorrect: false },
        { symbol: 'Z', name: 'Pauli-Z', isCorrect: false }
      ],
      hint: 'Choose the operator that extracts a classical bit from the qubit wire.',
      successExplanation: 'Well done! You confirmed that measuring |0⟩ yields a classical 0.'
    },
    tutorSection: {
      lessonContext: 'Fundamentals: Bits, Qubits & Measurement',
      exampleContext: 'Measuring ground state |0⟩',
      suggestedQuestions: [
        {
          id: 'q-f-1',
          label: 'Why classical computing hits limits',
          question: 'Why can classical transistors not shrink forever?',
          answer: 'When transistors shrink to 2–3 nanometers (the width of ~10 silicon atoms), electrons begin quantum tunneling straight through closed barriers, causing unpredictable current leaks.',
          concepts: ['Moore’s Law', 'Quantum Tunneling', 'Silicon Physics']
        },
        {
          id: 'q-f-2',
          label: 'What is a ket vector?',
          question: 'Why do we write |0⟩ with a bar and angle bracket?',
          answer: 'It is Dirac bra-ket notation: |0⟩ represents a column vector [1, 0]ᵀ in complex Hilbert space, representing the ground energy level.',
          concepts: ['Dirac Notation', 'State Vectors']
        }
      ]
    },
    prevLesson: undefined,
    nextLesson: { slug: 'qubits', title: 'Qubits & Quantum States' }
  },

  // ==========================================
  // MODULE 2: QUBITS & STATES (5 Mini-Lessons)
  // ==========================================
  'qubits': {
    slug: 'qubits',
    moduleId: 'mod-2',
    title: 'Qubits & Quantum States',
    subtitle: 'Dirac notation, state transitions, and the Pauli-X bit flip.',
    difficulty: 'Beginner',
    estimatedTime: '45 mins',
    overview: 'Now that you know what a qubit is, explore how to change its state. In this module, you will learn how to flip a qubit from |0⟩ to |1⟩ using the Pauli-X gate and explore how probabilities work in quantum mechanics.',
    labPresetId: 'single-qubit-x',
    miniLessons: [
      {
        id: 'qub-1',
        title: 'Lesson 1 — Qubit States',
        durationMinutes: 8,
        conceptExplanation: 'A single qubit has two standard basis states: |0⟩ and |1⟩. In physical terms, these might represent an electron with spin pointing Up (|0⟩) or spin pointing Down (|1⟩). Any state can be represented geometrically on a unit sphere called the Bloch sphere. State |0⟩ is at the north pole, and state |1⟩ is at the south pole.',
        analogy: 'Think of the Earth. The North Pole is |0⟩ and the South Pole is |1⟩. Any point on the globe is a valid quantum state, but when you ask a sensor "Is it North or South?", it forces the position to one pole.',
        visualNote: 'North Pole = |0⟩ | South Pole = |1⟩',
        selfCheck: {
          question: 'On the Bloch sphere representation, where is state |0⟩ located?',
          options: [
            { id: 'a', text: 'At the equator' },
            { id: 'b', text: 'At the north pole (z = +1)' },
            { id: 'c', text: 'At the center of the sphere' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Correct! State |0⟩ is mapped to the north pole of the Bloch sphere.',
          explanationIncorrect: 'On the standard Bloch sphere, |0⟩ is at the north pole and |1⟩ is at the south pole.'
        }
      },
      {
        id: 'qub-2',
        title: 'Lesson 2 — Changing a Qubit (Pauli-X)',
        durationMinutes: 10,
        conceptExplanation: 'How do we flip a qubit from |0⟩ to |1⟩? In classical computing, we use a NOT gate. In quantum computing, the equivalent operation is the Pauli-X gate. Applying an X gate rotates the qubit 180° around the X-axis of the Bloch sphere: X|0⟩ = |1⟩ and X|1⟩ = |0⟩.',
        analogy: 'Imagine a light switch toggle. Flipping the switch (X gate) turns OFF (|0⟩) into ON (|1⟩).',
        visualNote: '|0⟩ ─── [ X Gate ] ───> |1⟩',
        interactiveTry: {
          title: 'Try It: Predict & Run the Pauli-X Gate',
          instruction: 'Qubit q[0] starts in state |0⟩. We apply an X gate, followed by measurement. Predict what the measurement outcomes will look like.',
          circuitPreview: 'q0 |0⟩ ─── X ─── M',
          predictionPrompt: 'What will measuring 1,024 shots of X|0⟩ produce?',
          predictionOptions: [
            { id: 'p-all-1', text: '100% of measurements will be 1', isCorrect: true },
            { id: 'p-all-0', text: '100% of measurements will be 0', isCorrect: false },
            { id: 'p-half', text: '50% 0 and 50% 1', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '1': 100 },
          whyExplanation: 'The Pauli-X gate acts as a complete bit-flip. Since the input was |0⟩, the state became pure |1⟩. Every single shot measured 1 with zero uncertainty!'
        },
        codeConnection: {
          title: 'From Circuit to Python: The Pauli-X Gate',
          whatAreWeCoding: 'In classical Python, toggling a bit looks like `bit = not bit` or `bit = 1 - bit`. In quantum programming with Qiskit, we instantiate a `QuantumCircuit`, apply the `.x()` gate operation to our qubit wire, and measure the result.',
          circuitPreview: 'q[0]: |0⟩ ─── [ X ] ─── [ M ] ──> c[0]',
          codeSnippet: `from qiskit import QuantumCircuit

# Initialize circuit with 1 qubit and 1 classical bit
qc = QuantumCircuit(1, 1)

# Apply Pauli-X (quantum bit-flip) to qubit 0
qc.x(0)

# Measure qubit 0 into classical bit 0
qc.measure(0, 0)`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'from qiskit import QuantumCircuit',
              explanation: 'Imports Qiskit’s core quantum circuit builder to create quantum programs.',
              circuitMapping: 'Circuit Framework'
            },
            {
              codeSnippet: 'qc = QuantumCircuit(1, 1)',
              explanation: 'Allocates 1 quantum wire (starts at |0⟩) and 1 classical bit for readout.',
              circuitMapping: 'q[0] and c[0] wires'
            },
            {
              codeSnippet: 'qc.x(0)',
              explanation: 'Applies the Pauli-X gate to qubit wire 0, inverting state |0⟩ to |1⟩.',
              circuitMapping: '[ X Gate ]'
            },
            {
              codeSnippet: 'qc.measure(0, 0)',
              explanation: 'Measures quantum state of qubit 0 and stores the collapsed bit in c[0].',
              circuitMapping: '[ M Measure ]'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: 'The Pauli-X gate rotated the state vector 180° to south pole |1⟩. Measurement collapses 100% of runs into outcome 1.',
            counts: { '1': 1024 },
            percentages: { '1': 100 },
            shots: 1024,
            stateDescription: '|ψ⟩ = 1.00|1⟩ (Pure State)'
          }
        },
        codingPractice: {
          title: 'Write Your First Quantum Gate: Pauli-X',
          taskDescription: 'Complete the script below by applying the Pauli-X gate to qubit 0 before the measurement step.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# TODO: Apply the Pauli-X gate to qubit 0


qc.measure(0, 0)`,
          hint: 'Call qc.x(0) on the circuit to apply the Pauli-X gate to qubit 0.',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Apply the Pauli-X gate to qubit 0
qc.x(0)

qc.measure(0, 0)`,
          validationRules: {
            requiredOperations: ['qc.x(0)'],
            forbiddenOperations: ['qc.h(', 'qc.z('],
            successMessage: 'Well done! You coded the Pauli-X gate. Running 1,024 shots confirmed 100% measurement of state 1.',
            failureHint: 'Make sure you add `qc.x(0)` before `qc.measure(0, 0)`.'
          },
          simulatedRun: {
            expectedState: '|1⟩',
            counts: { '1': 1024 },
            explanation: '1,024 shots measured: 100% outcome 1. The bit-flip was successfully executed!'
          }
        },
        selfCheck: {
          question: 'If a qubit is in state |1⟩ and you apply an X gate, what state does it become?',
          options: [
            { id: 'a', text: '|0⟩' },
            { id: 'b', text: '|1⟩' },
            { id: 'c', text: 'State disappears' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! Applying X to |1⟩ flips it back to |0⟩. The X gate is its own inverse (X · X = Identity).',
          explanationIncorrect: 'The X gate is a bit flip: X|0⟩ = |1⟩ and X|1⟩ = |0⟩.'
        }
      },
      {
        id: 'qub-3',
        title: 'Lesson 3 — Probability in Quantum States',
        durationMinutes: 8,
        conceptExplanation: 'In general, a qubit state is written as |ψ⟩ = α|0⟩ + β|1⟩. The values α and β are probability amplitudes. You do not need complex math to understand this: the rule (called the Born rule) simply says the probability of measuring 0 is |α|², and the probability of measuring 1 is |β|². Because the qubit must collapse to something, the probabilities always add up to 100%: |α|² + |β|² = 1.',
        analogy: 'Imagine a pie chart of 100%. If 75% of the pie is colored blue (|0⟩) and 25% is red (|1⟩), spinning a pointer will land on blue 3 out of 4 times.',
        visualNote: 'Prob(0) + Prob(1) = 1.0 (100%)',
        selfCheck: {
          question: 'If the probability of measuring |0⟩ is 0.70 (70%), what MUST the probability of measuring |1⟩ be?',
          options: [
            { id: 'a', text: '0.70' },
            { id: 'b', text: '0.30 (30%)' },
            { id: 'c', text: '0.00' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Spot on! Total probability must equal 1.0 (100%), so 1.0 - 0.70 = 0.30.',
          explanationIncorrect: 'Probabilities in quantum measurement must sum to 100% (1.0).'
        }
      },
      {
        id: 'qub-4',
        title: 'Lesson 4 — State Exploration',
        durationMinutes: 10,
        conceptExplanation: 'Let us compare different single-qubit states. An unperturbed qubit gives 100% 0. An X-flipped qubit gives 100% 1. What happens if we apply two X gates in a row? X · X returns the qubit back to its starting state!',
        interactiveTry: {
          title: 'Try It: Double Bit-Flip (X followed by X)',
          instruction: 'Predict the outcome of applying two consecutive X gates to |0⟩.',
          circuitPreview: 'q0 |0⟩ ─── X ─── X ─── M',
          predictionPrompt: 'What do you expect after two consecutive X gates on |0⟩?',
          predictionOptions: [
            { id: 'p-back-0', text: '100% outcome 0 (returns to start)', isCorrect: true },
            { id: 'p-stay-1', text: '100% outcome 1', isCorrect: false },
            { id: 'p-half', text: '50/50 mix', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '0': 100 },
          whyExplanation: 'The first X flips |0⟩ to |1⟩. The second X flips |1⟩ back to |0⟩. This demonstrates that quantum gates are reversible!'
        },
        selfCheck: {
          question: 'What happens when you apply any quantum gate that is its own inverse twice in a row?',
          options: [
            { id: 'a', text: 'It returns the system to its initial state (Identity)' },
            { id: 'b', text: 'It destroys the qubit hardware' },
            { id: 'c', text: 'It creates permanent random noise' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Yes! When U · U = I, applying the gate twice acts as an identity operation.',
          explanationIncorrect: 'Gates like Pauli-X are self-inverting: X · X = I.'
        }
      },
      {
        id: 'qub-5',
        title: 'Lesson 5 — Self Check',
        durationMinutes: 9,
        conceptExplanation: 'Test your understanding of qubit states and the Pauli-X gate before moving to the magic of Superposition.',
        selfCheck: {
          question: 'Which gate is the quantum equivalent of the classical NOT operator?',
          options: [
            { id: 'a', text: 'Hadamard (H)' },
            { id: 'b', text: 'Pauli-X' },
            { id: 'c', text: 'Pauli-Z' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Correct! The Pauli-X gate is the quantum NOT gate.',
          explanationIncorrect: 'The Pauli-X gate flips |0⟩ to |1⟩ and |1⟩ to |0⟩.'
        }
      }
    ],
    practice: {
      title: 'Practice Challenge: Invert the State',
      instruction: 'Select the Pauli-X gate to turn the ground state |0⟩ into state |1⟩.',
      wireTemplate: {
        qubitLabel: 'q[0] |0⟩ ───',
        beforeGate: '───',
        afterGate: '─── ⊚ (Measure)'
      },
      availableGates: [
        { symbol: 'X', name: 'Pauli-X', isCorrect: true },
        { symbol: 'H', name: 'Hadamard', isCorrect: false },
        { symbol: 'Z', name: 'Pauli-Z', isCorrect: false }
      ],
      hint: 'Choose the bit-flip gate.',
      successExplanation: 'Great work! The X gate turned |0⟩ into |1⟩.'
    },
    tutorSection: {
      lessonContext: 'Qubits & State Inversion',
      exampleContext: 'Pauli-X gate operations',
      suggestedQuestions: [
        {
          id: 'q-q-1',
          label: 'Why is it called Pauli-X?',
          question: 'Why is the X gate named after Wolfgang Pauli?',
          answer: 'Wolfgang Pauli formulated the 2x2 spin matrices in 1927 to describe electron spin. In quantum computing, these matrices become the foundational single-qubit gates.',
          concepts: ['Wolfgang Pauli', 'Spin Physics']
        },
        {
          id: 'q-q-2',
          label: 'What is the Bloch sphere?',
          question: 'Why do we use a sphere to represent a qubit?',
          answer: 'Because any pure two-level quantum state can be parameterized by two angles (latitude θ and longitude φ), mapping onto the surface of a 3D unit sphere.',
          concepts: ['Bloch Sphere', 'Angles θ and φ']
        }
      ]
    },
    prevLesson: { slug: 'fundamentals', title: 'Fundamentals' },
    nextLesson: { slug: 'superposition', title: 'Superposition' }
  },

  // ==========================================
  // MODULE 3: SUPERPOSITION (6 Mini-Lessons)
  // ==========================================
  'superposition': {
    slug: 'superposition',
    moduleId: 'mod-3',
    title: 'Superposition',
    subtitle: 'A qubit can exist in a combination of quantum states until measured.',
    difficulty: 'Beginner',
    estimatedTime: '50 mins',
    overview: 'Superposition is the signature property that enables quantum parallelism. In this module, you will learn what superposition really is (and what it is not), use the Hadamard gate, make predictions, and discover quantum reversibility.',
    labPresetId: 'single-qubit-h',
    miniLessons: [
      {
        id: 'sup-1',
        title: 'Lesson 1 — What is Superposition?',
        durationMinutes: 8,
        conceptExplanation: 'Popular science often says: "A qubit is both 0 and 1 at the same time." This is a misleading simplification! A more accurate description is: a qubit can be prepared in a quantum state that is a linear combination of the |0⟩ and |1⟩ basis states. Before measurement, it has non-zero probability amplitudes for both outcomes. But the moment you observe it, it collapses to either a 0 or a 1.',
        analogy: 'Think of a coin spinning rapidly on a tabletop. While it is spinning, you cannot describe it as heads or tails — it possesses qualities of both. But the instant you slap your palm down on the coin (measurement), it is forced to settle into either heads or tails.',
        visualNote: 'Spinning Coin (Superposition) ──[ Slap Hand (Measure) ]──> Heads or Tails',
        selfCheck: {
          question: 'Which of the following is the most accurate description of superposition?',
          options: [
            { id: 'a', text: 'The qubit is physically broken and oscillates randomly' },
            { id: 'b', text: 'The qubit is in a state containing probability amplitudes for both |0⟩ and |1⟩' },
            { id: 'c', text: 'The qubit is secretly always 1' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Exact! Superposition is a precise, reproducible quantum state with amplitudes for multiple basis outcomes.',
          explanationIncorrect: 'Remember: superposition is a well-defined quantum state with probability amplitudes for both outcomes.'
        }
      },
      {
        id: 'sup-2',
        title: 'Lesson 2 — The Hadamard Gate',
        durationMinutes: 8,
        conceptExplanation: 'How do we put a qubit into superposition? We use the Hadamard gate (symbol: H). When applied to the ground state |0⟩, the H gate creates an equal superposition: |+⟩ = (|0⟩ + |1⟩)/√2. Geometrically on the Bloch sphere, the H gate rotates the state from the north pole |0⟩ down to the equator along the positive X-axis.',
        analogy: 'If the north pole is |0⟩ and south is |1⟩, applying H is like traveling down to the equator: you are exactly midway between the poles.',
        visualNote: '|0⟩ (North Pole) ──[ H Gate ]──> |+⟩ (Equator)',
        codeConnection: {
          title: 'From Circuit to Python: Creating Superposition with Hadamard',
          whatAreWeCoding: 'To place a qubit into an equal superposition of |0⟩ and |1⟩, we apply the Hadamard gate using `qc.h(0)`. When measured, the qubit randomly collapses to 0 or 1 with equal 50% probability.',
          circuitPreview: 'q[0]: |0⟩ ─── [ H ] ─── [ M ] ──> c[0]',
          codeSnippet: `from qiskit import QuantumCircuit

# 1 qubit, 1 classical bit
qc = QuantumCircuit(1, 1)

# Apply Hadamard gate to qubit 0
qc.h(0)

# Measure qubit 0 into classical bit 0
qc.measure(0, 0)`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'qc = QuantumCircuit(1, 1)',
              explanation: 'Allocates a single qubit wire initialized to |0⟩.',
              circuitMapping: 'q[0] wire'
            },
            {
              codeSnippet: 'qc.h(0)',
              explanation: 'Rotates the state vector to the equator of the Bloch sphere, forming (|0⟩ + |1⟩)/√2.',
              circuitMapping: '[ H Gate ]'
            },
            {
              codeSnippet: 'qc.measure(0, 0)',
              explanation: 'Forces the superposition to collapse into a definite classical bit (0 or 1).',
              circuitMapping: '[ M Measure ]'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: 'Equal superposition produces roughly equal 0 and 1 outcomes due to quantum statistical sampling noise.',
            counts: { '0': 518, '1': 506 },
            percentages: { '0': 50.6, '1': 49.4 },
            shots: 1024,
            stateDescription: '|ψ⟩ = 0.707|0⟩ + 0.707|1⟩ (Equal Superposition)'
          }
        },
        codingPractice: {
          title: 'Generate Quantum Superposition',
          taskDescription: 'Put qubit 0 into equal superposition by applying the Hadamard gate `qc.h(0)`.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# TODO: Apply Hadamard gate to qubit 0


qc.measure(0, 0)`,
          hint: 'Use qc.h(0) to apply the Hadamard gate to qubit 0.',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Apply Hadamard gate to qubit 0
qc.h(0)

qc.measure(0, 0)`,
          validationRules: {
            requiredOperations: ['qc.h(0)'],
            forbiddenOperations: ['qc.x('],
            successMessage: 'Brilliant! You placed the qubit into superposition. Simulator shots show balanced ~50/50 distribution.',
            failureHint: 'Add `qc.h(0)` before `qc.measure(0, 0)`.'
          },
          simulatedRun: {
            expectedState: '(|0⟩ + |1⟩)/√2',
            counts: { '0': 512, '1': 512 },
            explanation: '1,024 shots measured: ~50% outcome 0 and ~50% outcome 1. True quantum randomness demonstrated!'
          }
        },
        selfCheck: {
          question: 'What state is produced when a Hadamard gate acts on |0⟩?',
          options: [
            { id: 'a', text: 'State |1⟩' },
            { id: 'b', text: 'Equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2' },
            { id: 'c', text: 'State |0⟩ with zero changes' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Spot on! H|0⟩ produces the symmetric superposition state |+⟩.',
          explanationIncorrect: 'The Hadamard gate creates an equal superposition: (|0⟩ + |1⟩)/√2.'
        }
      },
      {
        id: 'sup-3',
        title: 'Lesson 3 — Predict Before Running',
        durationMinutes: 8,
        conceptExplanation: 'Before running a quantum simulation, trained quantum engineers always form a hypothesis. Consider a single qubit starting in |0⟩, transformed by an H gate, and then measured over 1,024 shots.',
        interactiveTry: {
          title: 'Try It Yourself: Predict the Distribution',
          instruction: 'Consider the circuit below. Select your prediction, then click Run Example to test your hypothesis!',
          circuitPreview: 'q0 |0⟩ ─── H ─── M',
          predictionPrompt: 'What do you predict the 1,024 measurement results will look like?',
          predictionOptions: [
            { id: 'p-half', text: 'Approximately 50% 0 and 50% 1', isCorrect: true },
            { id: 'p-zero', text: 'Almost all 0', isCorrect: false },
            { id: 'p-one', text: 'Almost all 1', isCorrect: false },
            { id: 'p-none', text: 'No result (error)', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '0': 50, '1': 50 },
          whyExplanation: 'Because the H gate creates an equal superposition (|0⟩+|1⟩)/√2, both states have amplitude 1/√2. Squaring this gives |1/√2|² = 1/2 = 50% probability for each outcome. Small statistical fluctuations (~512 vs 512) reflect realistic quantum shot noise!'
        },
        selfCheck: {
          question: 'Why are measurement counts rarely exactly 500/500 in 1,000 shots?',
          options: [
            { id: 'a', text: 'Because quantum simulator software has bugs' },
            { id: 'b', text: 'Because quantum measurement is probabilistic and subject to statistical sampling noise' },
            { id: 'c', text: 'Because qubits degrade after 100 shots' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Exactly. Just like flipping a fair coin 1,000 times will give roughly 504 heads and 496 tails, quantum sampling exhibits natural variance.',
          explanationIncorrect: 'Finite sampling of probabilistic events produces natural statistical variance around the theoretical 50% expectation.'
        }
      },
      {
        id: 'sup-4',
        title: 'Lesson 4 — Applying H Twice (H · H)',
        durationMinutes: 8,
        conceptExplanation: 'What happens if you apply a Hadamard gate to a qubit that is ALREADY in superposition? Because all quantum gates are reversible unitary operations, applying H twice returns the state directly back to where it started: H · H = I (Identity)! H|+⟩ = |0⟩ with 100% certainty.',
        analogy: 'If applying H turns a coin onto its spinning edge, applying H again catches it and places it back flat with the original side facing up.',
        visualNote: '|0⟩ ──[ H ]──> Superposition ──[ H ]──> |0⟩ (100%)',
        interactiveTry: {
          title: 'Try It: Test the Reversibility of H',
          instruction: 'Predict the outcome of applying two Hadamard gates in series to state |0⟩.',
          circuitPreview: 'q0 |0⟩ ─── H ─── H ─── M',
          predictionPrompt: 'What will measuring H · H |0⟩ produce across 1,024 shots?',
          predictionOptions: [
            { id: 'p-return-0', text: '100% outcome 0 (returns to start)', isCorrect: true },
            { id: 'p-half', text: 'Still 50% 0 and 50% 1', isCorrect: false },
            { id: 'p-one', text: '100% outcome 1', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '0': 100 },
          whyExplanation: 'Hadamard is its own inverse: H · H = I. The second Hadamard rotates the equator state vector back to the north pole |0⟩. This proves that quantum superposition is not random destruction of information; it is fully reversible!'
        },
        codeConnection: {
          title: 'From Circuit to Python: Proving H · H = Identity',
          whatAreWeCoding: 'In quantum mechanics, all gate operations are reversible. Applying two consecutive Hadamard gates (`qc.h(0)` followed by `qc.h(0)`) cancels out the superposition and returns the state directly back to |0⟩.',
          circuitPreview: 'q[0]: |0⟩ ─── [ H ] ─── [ H ] ─── [ M ] ──> c[0]',
          codeSnippet: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# First Hadamard: creates superposition |+>
qc.h(0)

# Second Hadamard: reverses superposition back to |0>
qc.h(0)

qc.measure(0, 0)`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'qc.h(0)  # First',
              explanation: 'Takes the qubit from |0⟩ into the equal superposition state |+⟩.',
              circuitMapping: 'First [ H Gate ]'
            },
            {
              codeSnippet: 'qc.h(0)  # Second',
              explanation: 'Because H is Hermitian and unitary (H² = I), this reverses the rotation back to |0⟩.',
              circuitMapping: 'Second [ H Gate ]'
            },
            {
              codeSnippet: 'qc.measure(0, 0)',
              explanation: 'Because the state returned to pure |0⟩, 100% of measurements yield 0.',
              circuitMapping: '[ M Measure ]'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: '100% of shots measured outcome 0. The second Hadamard gate completely un-did the first!',
            counts: { '0': 1024 },
            percentages: { '0': 100 },
            shots: 1024,
            stateDescription: '|ψ⟩ = 1.00|0⟩ (Reversible Restoration)'
          }
        },
        codingPractice: {
          title: 'Prove Quantum Reversibility (H · H)',
          taskDescription: 'The starter code already applies one Hadamard gate. Add a second `qc.h(0)` to reverse the superposition back to state |0⟩.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)

# TODO: Add the second Hadamard gate to reverse the state back to |0>


qc.measure(0, 0)`,
          hint: 'Add another qc.h(0) right below the first one.',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)

# Add the second Hadamard gate
qc.h(0)

qc.measure(0, 0)`,
          validationRules: {
            requiredOperations: ['qc.h(0)'],
            minLines: 7,
            successMessage: 'Excellent! Two consecutive Hadamards act as the Identity operation. 100% of shots returned 0.',
            failureHint: 'Add another `qc.h(0)` before measuring.'
          },
          simulatedRun: {
            expectedState: '|0⟩',
            counts: { '0': 1024 },
            explanation: '1,024 shots measured: 100% outcome 0. H · H = Identity confirmed!'
          }
        },
        selfCheck: {
          question: 'If you apply H to |0⟩, then apply H again, what is the final state?',
          options: [
            { id: 'a', text: '|1⟩' },
            { id: 'b', text: '|0⟩' },
            { id: 'c', text: 'An irreversible mixture' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Correct! H · H = Identity, returning |0⟩ to |0⟩.',
          explanationIncorrect: 'Remember: H is self-inverting. Applying H twice returns to the starting state.'
        }
      },
      {
        id: 'sup-5',
        title: 'Lesson 5 — Superposition Experiment (X then H)',
        durationMinutes: 10,
        conceptExplanation: 'What happens if we apply an X gate first, turning |0⟩ into |1⟩, and THEN apply a Hadamard gate? H|1⟩ creates the state |-⟩ = (|0⟩ - |1⟩)/√2. Notice the minus sign! Both outcomes still have a 50% probability of being measured, but the relative phase is negative (180° offset).',
        interactiveTry: {
          title: 'Try It: X Gate followed by H Gate',
          instruction: 'Predict the measurement distribution of X followed by H.',
          circuitPreview: 'q0 |0⟩ ─── X ─── H ─── M',
          predictionPrompt: 'What measurement distribution do you predict for H|1⟩?',
          predictionOptions: [
            { id: 'p-half', text: 'Approximately 50% 0 and 50% 1', isCorrect: true },
            { id: 'p-zero', text: '100% 0', isCorrect: false },
            { id: 'p-one', text: '100% 1', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '0': 50, '1': 50 },
          whyExplanation: 'The probability of measuring |0⟩ is |1/√2|² = 50%, and for |1⟩ it is |-1/√2|² = 50% (since squaring a negative number yields a positive number!). Even though outcomes are 50/50, the phase difference is what powers quantum interference in algorithms!'
        },
        selfCheck: {
          question: 'Why do |+⟩ = (|0⟩+|1⟩)/√2 and |-⟩ = (|0⟩-|1⟩)/√2 give the same 50/50 measurement probabilities?',
          options: [
            { id: 'a', text: 'Because probability is the square of amplitude: |1/√2|² = |-1/√2|² = 0.5' },
            { id: 'b', text: 'Because measurement ignores negative signs due to classical circuit limitations' },
            { id: 'c', text: 'They do not; |-⟩ always measures 1' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Brilliant! The Born rule squares the amplitude magnitude, so the minus sign is unobservable in direct computational measurement.',
          explanationIncorrect: 'The Born rule squares amplitudes: |α|² and |β|². Since (-1/√2)² = +1/2, the probability is 50%.'
        }
      },
      {
        id: 'sup-6',
        title: 'Lesson 6 — Superposition Challenge',
        durationMinutes: 8,
        conceptExplanation: 'Now put everything together! You know that the Hadamard gate generates superposition, that measurement collapses it to 50/50 outcomes, and that H is reversible.',
        selfCheck: {
          question: 'Which gate would you place on an initial state |0⟩ to create an equal superposition?',
          options: [
            { id: 'a', text: 'X Gate' },
            { id: 'b', text: 'H Gate' },
            { id: 'c', text: 'Z Gate' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Spot on! The Hadamard gate is the standard superposition generator.',
          explanationIncorrect: 'Select the Hadamard gate (H).'
        }
      }
    ],
    practice: {
      title: 'Superposition Challenge: Place the Hadamard Gate',
      instruction: 'Select the correct gate from the palette below to fill the missing slot and place qubit q[0] into an equal superposition before measurement.',
      wireTemplate: {
        qubitLabel: 'q[0] |0⟩ ───',
        beforeGate: '───',
        afterGate: '─── ⊚ (Measure)'
      },
      availableGates: [
        { symbol: 'X', name: 'Pauli-X', isCorrect: false },
        { symbol: 'H', name: 'Hadamard', isCorrect: true },
        { symbol: 'Z', name: 'Pauli-Z', isCorrect: false },
        { symbol: 'S', name: 'Phase (S)', isCorrect: false }
      ],
      hint: 'Choose the gate that maps poles to the equator of the Bloch sphere.',
      successExplanation: 'Bravo! Placing the Hadamard (H) gate creates state |+⟩ = (|0⟩ + |1⟩)/√2.'
    },
    tutorSection: {
      lessonContext: 'Superposition & Hadamard Gate',
      exampleContext: 'H on q[0] with prediction checks',
      suggestedQuestions: [
        {
          id: 'q-sup-1',
          label: 'Why H creates superposition',
          question: 'Why does the H gate create superposition?',
          answer: 'The Hadamard gate applies the unitary transformation matrix [[1, 1], [1, -1]] / √2. When multiplied by vector |0⟩ ([1, 0]ᵀ), the result is [1/√2, 1/√2]ᵀ, which gives equal 50% probabilities for both basis states.',
          concepts: ['Hadamard Gate', 'Unitary Matrix', 'State Vector']
        },
        {
          id: 'q-sup-2',
          label: 'Why are results ~50/50',
          question: 'Why are the results approximately 50/50?',
          answer: 'According to the Born rule, the probability of measuring state |0⟩ is |α|² and |1⟩ is |β|². For (|0⟩+|1⟩)/√2, (1/√2)² = 50%. Slight deviations (~512 vs 512) are due to finite sampling (shot noise).',
          concepts: ['Born Rule', 'Probabilities', 'Shot Noise']
        },
        {
          id: 'q-sup-3',
          label: 'What happens if I apply H twice?',
          question: 'What happens if I apply H twice (H·H)?',
          answer: 'Because quantum gates are unitary, H·H = I (Identity). Applying H twice rotates the state vector directly back to |0⟩ with 100% certainty, proving superposition is reversible.',
          concepts: ['Reversibility', 'Identity Operator']
        }
      ]
    },
    prevLesson: { slug: 'qubits', title: 'Qubits & Quantum States' },
    nextLesson: { slug: 'gates', title: 'Quantum Gates' }
  },

  // ==========================================
  // MODULE 4: QUANTUM GATES (6 Mini-Lessons)
  // ==========================================
  'gates': {
    slug: 'gates',
    moduleId: 'mod-4',
    title: 'Quantum Gates',
    subtitle: 'Reversible Unitary Transformations: Pauli X, Y, Z, and Controlled-NOT.',
    difficulty: 'Intermediate',
    estimatedTime: '55 mins',
    overview: 'Quantum gates are the building blocks of all quantum algorithms. In this module, you will discover why quantum gates must be reversible, learn single-qubit rotations (X, Y, Z, H), and meet the two-qubit CNOT gate.',
    labPresetId: 'phase-gate-demo',
    miniLessons: [
      {
        id: 'gat-1',
        title: 'Lesson 1 — What is a Quantum Gate?',
        durationMinutes: 8,
        conceptExplanation: 'In classical computing, gates like AND, OR, and NAND destroy information: if an AND gate outputs 0, you cannot determine whether inputs were (0,0), (0,1), or (1,0). In quantum computing, all gate operations (except measurement) are strictly reversible unitary matrices. Information is never erased, which preserves total probability at 100%.',
        analogy: 'Imagine rotating a Rubik’s cube. Every twist is a reversible operation: if you twist the top face clockwise, you can always twist it counter-clockwise to return to the original configuration.',
        visualNote: 'Quantum Gate U: U† · U = Identity (Reversible)',
        selfCheck: {
          question: 'Why can classical logic gates like AND not be used directly on quantum states?',
          options: [
            { id: 'a', text: 'Because they are irreversible and erase information' },
            { id: 'b', text: 'Because silicon is too cold' },
            { id: 'c', text: 'Because AND gates require 100 volts' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! Quantum mechanics requires unitary (reversible) evolution to conserve probability.',
          explanationIncorrect: 'Classical AND gates erase information, violating quantum reversibility.'
        }
      },
      {
        id: 'gat-2',
        title: 'Lesson 2 — The Pauli-X Gate (Bit-Flip)',
        durationMinutes: 8,
        conceptExplanation: 'As you learned earlier, the Pauli-X gate acts as a bit-flip. It swaps the amplitudes of |0⟩ and |1⟩: X|0⟩ = |1⟩ and X|1⟩ = |0⟩. Geometrically, it is a 180° rotation around the X-axis of the Bloch sphere.',
        visualNote: '|0⟩ ──[ X ]──> |1⟩ and |1⟩ ──[ X ]──> |0⟩',
        interactiveTry: {
          title: 'Try It: Pauli-X on |0⟩',
          instruction: 'Run the circuit to verify the bit flip.',
          circuitPreview: 'q0 |0⟩ ─── X ─── M',
          predictionPrompt: 'What outcome is measured from X|0⟩?',
          predictionOptions: [
            { id: 'p-1', text: '100% 1', isCorrect: true },
            { id: 'p-0', text: '100% 0', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '1': 100 },
          whyExplanation: 'The X gate performs a deterministic bit flip.'
        },
        selfCheck: {
          question: 'What is the matrix of the Pauli-X gate?',
          options: [
            { id: 'a', text: '[[0, 1], [1, 0]]' },
            { id: 'b', text: '[[1, 0], [0, 1]]' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! The Pauli-X matrix is [[0, 1], [1, 0]].',
          explanationIncorrect: '[[1, 0], [0, 1]] is the Identity matrix. Pauli-X is [[0, 1], [1, 0]].'
        }
      },
      {
        id: 'gat-3',
        title: 'Lesson 3 — The Hadamard Gate (H)',
        durationMinutes: 8,
        conceptExplanation: 'The Hadamard gate maps computational basis states (|0⟩, |1⟩) into superposition basis states (|+⟩, |-⟩). It is represented by matrix [[1, 1], [1, -1]] / √2.',
        visualNote: 'H|0⟩ = |+⟩ = (|0⟩+|1⟩)/√2 | H|1⟩ = |-⟩ = (|0⟩-|1⟩)/√2',
        selfCheck: {
          question: 'What is the difference between H|0⟩ and H|1⟩?',
          options: [
            { id: 'a', text: 'H|0⟩ has a plus sign (+), while H|1⟩ has a relative minus sign (-)' },
            { id: 'b', text: 'H|0⟩ gives 100% 0 and H|1⟩ gives 100% 1' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Exactly! H|0⟩ = (|0⟩+|1⟩)/√2 and H|1⟩ = (|0⟩-|1⟩)/√2.',
          explanationIncorrect: 'Both produce 50/50 measurement probabilities, but H|1⟩ has a negative relative phase.'
        }
      },
      {
        id: 'gat-4',
        title: 'Lesson 4 — Z and Y Phase Gates',
        durationMinutes: 10,
        conceptExplanation: 'The Pauli-Z gate leaves state |0⟩ unchanged, but flips the phase of state |1⟩: Z|0⟩ = |0⟩ and Z|1⟩ = -|1⟩. It performs a 180° rotation around the Z-axis of the Bloch sphere. Pauli-Y combines both a bit flip and a phase flip with an imaginary unit i: Y|0⟩ = i|1⟩ and Y|1⟩ = -i|0⟩.',
        visualNote: 'Z Gate: |0⟩ → |0⟩, |1⟩ → -|1⟩',
        codeConnection: {
          title: 'From Circuit to Python: The Pauli-Z Phase Flip',
          whatAreWeCoding: 'The Pauli-Z gate leaves |0⟩ untouched but multiplies |1⟩ by -1. By sandwiching a Z gate between two Hadamards (H-Z-H), the phase flip is converted into an amplitude flip, effectively creating a Pauli-X bit-flip!',
          circuitPreview: 'q[0]: |0⟩ ─── [ H ] ─── [ Z ] ─── [ H ] ─── [ M ] ──> c[0]',
          codeSnippet: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Step 1: Create superposition |+> = (|0> + |1>)/√2
qc.h(0)

# Step 2: Flip relative phase -> |-> = (|0> - |1>)/√2
qc.z(0)

# Step 3: Interference rotates |-> into |1>
qc.h(0)

qc.measure(0, 0)`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'qc.h(0)',
              explanation: 'Prepares the equal superposition state |+⟩.',
              circuitMapping: 'Initial [ H Gate ]'
            },
            {
              codeSnippet: 'qc.z(0)',
              explanation: 'Multiplies the |1⟩ component by -1, transforming |+⟩ into |-⟩.',
              circuitMapping: '[ Z Gate ]'
            },
            {
              codeSnippet: 'qc.h(0)',
              explanation: 'Maps |-⟩ directly to |1⟩ through quantum interference.',
              circuitMapping: 'Readout [ H Gate ]'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: 'The H-Z-H sequence converts relative phase into observable measurement outcome 1.',
            counts: { '1': 1024 },
            percentages: { '1': 100 },
            shots: 1024,
            stateDescription: '|ψ⟩ = 1.00|1⟩ (Phase-to-Amplitude Conversion)'
          }
        },
        codingPractice: {
          title: 'Apply a Phase Flip with Pauli-Z',
          taskDescription: 'Insert the Pauli-Z gate `qc.z(0)` between the two Hadamard gates to flip the phase of the qubit.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)

# TODO: Apply Pauli-Z gate to flip the relative phase


qc.h(0)
qc.measure(0, 0)`,
          hint: 'Use qc.z(0) between the two Hadamards.',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)
qc.h(0)

# Apply Pauli-Z gate
qc.z(0)

qc.h(0)
qc.measure(0, 0)`,
          validationRules: {
            requiredOperations: ['qc.z(0)'],
            forbiddenOperations: ['qc.x('],
            successMessage: 'Great work! The phase flip was converted to an amplitude flip via interference, measuring 100% 1.',
            failureHint: 'Insert `qc.z(0)` between the first and second `qc.h(0)`.'
          },
          simulatedRun: {
            expectedState: '|1⟩',
            counts: { '1': 1024 },
            explanation: '1,024 shots measured: 100% outcome 1. H · Z · H = X verified!'
          }
        },
        selfCheck: {
          question: 'Does the Pauli-Z gate alter the probability of measuring 0 or 1 on state |0⟩?',
          options: [
            { id: 'a', text: 'No, Z|0⟩ = |0⟩ so measurement outcome is still 100% 0' },
            { id: 'b', text: 'Yes, it flips |0⟩ to |1⟩' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! Z|0⟩ = |0⟩, leaving the ground state completely unchanged.',
          explanationIncorrect: 'Z only alters the phase of |1⟩. On |0⟩, it has zero effect.'
        }
      },
      {
        id: 'gat-5',
        title: 'Lesson 5 — CNOT (Controlled-NOT)',
        durationMinutes: 11,
        conceptExplanation: 'To perform multi-qubit algorithms, qubits must interact. The Controlled-NOT (CNOT or CX) gate operates on two qubits: a control qubit and a target qubit. If the control qubit is in state |0⟩, the target qubit is left alone. If the control qubit is in state |1⟩, the target qubit is flipped!',
        analogy: 'Imagine a motion detector connected to an outdoor floodlight. If no motion is detected (control = 0), the light stays off. If motion is detected (control = 1), the light switch flips!',
        visualNote: 'q[control] ──●──\nq[target]  ──⊕──',
        interactiveTry: {
          title: 'Try It: CNOT with Control in |1⟩',
          instruction: 'Qubit q[0] is set to |1⟩ with an X gate. Qubit q[1] starts in |0⟩. Predict what happens when CNOT(q0 → q1) runs.',
          circuitPreview: 'q0 |0⟩ ─── X ─── ● ─── M\nq1 |0⟩ ───────── ⊕ ─── M',
          predictionPrompt: 'What state will the two qubits measure?',
          predictionOptions: [
            { id: 'p-11', text: '|11⟩ (q0=1 and q1=1)', isCorrect: true },
            { id: 'p-10', text: '|10⟩ (target remains 0)', isCorrect: false },
            { id: 'p-00', text: '|00⟩', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '11': 100 },
          whyExplanation: 'Because control qubit q[0] was in state |1⟩, the CNOT gate triggered and flipped target qubit q[1] from |0⟩ to |1⟩, yielding outcome |11⟩.'
        },
        codeConnection: {
          title: 'From Circuit to Python: The Two-Qubit CNOT Gate',
          whatAreWeCoding: 'In Qiskit, Controlled-NOT is called via `qc.cx(control_index, target_index)`. When control qubit 0 is set to |1⟩ with an X gate, the CNOT gate triggers and flips target qubit 1 to |1⟩.',
          circuitPreview: `q[0]: |0⟩ ─── [ X ] ─── ● ─── [ M ] ──> c[0]
q[1]: |0⟩ ───────────── ⊕ ─── [ M ] ──> c[1]`,
          codeSnippet: `from qiskit import QuantumCircuit

# 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Set control qubit 0 to |1>
qc.x(0)

# Apply CNOT: control is 0, target is 1
qc.cx(0, 1)

# Measure both qubits: [q0, q1] -> [c0, c1]
qc.measure([0, 1], [0, 1])`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'qc = QuantumCircuit(2, 2)',
              explanation: 'Allocates a 2-qubit register (q0, q1) and 2 classical bits (c0, c1).',
              circuitMapping: '2-qubit circuit'
            },
            {
              codeSnippet: 'qc.x(0)',
              explanation: 'Flips control qubit 0 from |0⟩ to |1⟩.',
              circuitMapping: '[ X Gate ] on q[0]'
            },
            {
              codeSnippet: 'qc.cx(0, 1)',
              explanation: 'Controlled-NOT: since control q0 is 1, target q1 is inverted to 1.',
              circuitMapping: '● on q[0], ⊕ on q[1]'
            },
            {
              codeSnippet: 'qc.measure([0, 1], [0, 1])',
              explanation: 'Reads out both qubits into their corresponding classical bits.',
              circuitMapping: 'Dual [ M ] Readouts'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: 'Because control was 1, target was flipped. Outcome is 100% |11⟩.',
            counts: { '11': 1024 },
            percentages: { '11': 100 },
            shots: 1024,
            stateDescription: '|ψ⟩ = 1.00|11⟩ (Both Qubits High)'
          }
        },
        codingPractice: {
          title: 'Connect Two Qubits with CNOT',
          taskDescription: 'The control qubit 0 has been prepared in state |1⟩. Add a CNOT gate with control 0 and target 1 using `qc.cx(0, 1)`.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.x(0)  # Prepare control qubit in |1>

# TODO: Apply CNOT gate with control=0 and target=1


qc.measure([0, 1], [0, 1])`,
          hint: 'Use qc.cx(0, 1) to connect control qubit 0 to target qubit 1.',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.x(0)  # Prepare control qubit in |1>

# Apply CNOT gate
qc.cx(0, 1)

qc.measure([0, 1], [0, 1])`,
          validationRules: {
            requiredOperations: ['qc.cx(0, 1)'],
            successMessage: 'Spot on! The CNOT gate flipped target qubit 1 because control qubit 0 was |1⟩.',
            failureHint: 'Add `qc.cx(0, 1)` before the measurement.'
          },
          simulatedRun: {
            expectedState: '|11⟩',
            counts: { '11': 1024 },
            explanation: '1,024 shots measured: 100% outcome 11. Controlled-NOT successfully triggered!'
          }
        },
        selfCheck: {
          question: 'If the control qubit is in state |0⟩ and target is |0⟩, what is the output of CNOT?',
          options: [
            { id: 'a', text: '|00⟩ (target is not flipped)' },
            { id: 'b', text: '|01⟩ (target is flipped)' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! When control is 0, the target qubit remains completely unchanged.',
          explanationIncorrect: 'CNOT only flips the target when the control qubit is 1.'
        }
      },
      {
        id: 'gat-6',
        title: 'Lesson 6 — Gate Playground',
        durationMinutes: 10,
        conceptExplanation: 'Experiment with combining gates! The universal gate set {H, S, CNOT, T} can approximate any quantum computation imaginable.',
        selfCheck: {
          question: 'Which of the following gates operates on TWO qubits simultaneously?',
          options: [
            { id: 'a', text: 'Hadamard (H)' },
            { id: 'b', text: 'Pauli-X' },
            { id: 'c', text: 'CNOT' }
          ],
          correctOptionId: 'c',
          explanationCorrect: 'Spot on! CNOT is a two-qubit entangling gate.',
          explanationIncorrect: 'H and X are single-qubit gates; CNOT is a two-qubit gate.'
        }
      }
    ],
    practice: {
      title: 'Gate Challenge: Connect the Phase Flip',
      instruction: 'Select the Pauli-Z gate to flip the relative phase of state |+⟩.',
      wireTemplate: {
        qubitLabel: 'q[0] |0⟩ ─── H ───',
        beforeGate: '───',
        afterGate: '─── ⊚ (Measure)'
      },
      availableGates: [
        { symbol: 'Z', name: 'Pauli-Z', isCorrect: true },
        { symbol: 'X', name: 'Pauli-X', isCorrect: false },
        { symbol: 'CNOT', name: 'CNOT', isCorrect: false }
      ],
      hint: 'Select the gate that transforms |+⟩ into |-⟩.',
      successExplanation: 'Success! The Pauli-Z gate changed the phase to |-⟩.'
    },
    tutorSection: {
      lessonContext: 'Quantum Gates: Single & Multi-Qubit',
      exampleContext: 'CNOT & Phase gates',
      suggestedQuestions: [
        {
          id: 'q-g-1',
          label: 'What does CNOT stand for?',
          question: 'What is Controlled-NOT?',
          answer: 'Controlled-NOT flips the target qubit if and only if the control qubit is |1⟩. In a 4x4 matrix, it swaps states |10⟩ and |11⟩.',
          concepts: ['CNOT', 'Multi-Qubit Gates']
        }
      ]
    },
    prevLesson: { slug: 'superposition', title: 'Superposition' },
    nextLesson: { slug: 'circuits', title: 'Quantum Circuits' }
  },

  // ==========================================
  // MODULE 5: QUANTUM CIRCUITS (5 Mini-Lessons)
  // ==========================================
  'circuits': {
    slug: 'circuits',
    moduleId: 'mod-5',
    title: 'Quantum Circuits',
    subtitle: 'Composing sequences of gates across wires and time steps.',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    overview: 'Just like musical sheet music arranges notes over time, a quantum circuit arranges gates on qubit wires from left to right. In this module, you will learn how to read circuits, see why gate ordering matters, and construct multi-step quantum programs.',
    labPresetId: 'circuit-order-demo',
    miniLessons: [
      {
        id: 'cir-1',
        title: 'Lesson 1 — Reading a Circuit Diagram',
        durationMinutes: 9,
        conceptExplanation: 'A quantum circuit diagram reads horizontally from left to right. Each horizontal line represents a qubit wire over time. Boxes placed on the wires represent unitary gates. Time advances in discrete steps: gates in the first column happen first, followed by the next column.',
        analogy: 'Think of an assembly line. A car frame travels down the conveyor belt (qubit wire), and robotic stations along the line (gates) weld parts on sequentially.',
        visualNote: 'Time ──> [Gate 1] ──> [Gate 2] ──> [Measure]',
        selfCheck: {
          question: 'In which direction does computational time flow in a quantum circuit diagram?',
          options: [
            { id: 'a', text: 'From right to left' },
            { id: 'b', text: 'From left to right' },
            { id: 'c', text: 'Top to bottom' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Correct! Time flows strictly from left to right.',
          explanationIncorrect: 'Quantum circuits read left-to-right like text.'
        }
      },
      {
        id: 'cir-2',
        title: 'Lesson 2 — Gate Order Matters (Non-Commutativity)',
        durationMinutes: 10,
        conceptExplanation: 'In basic arithmetic, order does not matter: 2 × 3 = 3 × 2. But quantum gates are matrices, and matrix multiplication is non-commutative! In general, A · B ≠ B · A. Applying an H gate followed by an X gate produces a different state vector than applying an X gate followed by an H gate.',
        analogy: 'Think of putting on your socks and shoes. Putting on socks then shoes is great. Putting on shoes then socks is a very different outcome!',
        visualNote: 'H then X ≠ X then H',
        selfCheck: {
          question: 'Do quantum gates always commute (A·B = B·A)?',
          options: [
            { id: 'a', text: 'Yes, all quantum gates can be swapped freely' },
            { id: 'b', text: 'No, matrix operations are non-commutative; order matters' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Exactly. Gate sequence order is crucial to algorithm correctness.',
          explanationIncorrect: 'Matrix multiplication is non-commutative: order matters.'
        }
      },
      {
        id: 'cir-3',
        title: 'Lesson 3 — Build a Simple Circuit',
        durationMinutes: 10,
        conceptExplanation: 'Let us build a two-step sequential circuit on a single qubit: first put it into superposition with an H gate, then invert it with an X gate.',
        interactiveTry: {
          title: 'Try It: H followed by X',
          instruction: 'Run the two-gate sequence and observe the measurement results.',
          circuitPreview: 'q0 |0⟩ ─── H ─── X ─── M',
          predictionPrompt: 'What distribution do you predict from H followed by X on |0⟩?',
          predictionOptions: [
            { id: 'p-half', text: 'Approximately 50% 0 and 50% 1', isCorrect: true },
            { id: 'p-zero', text: '100% 0', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '0': 50, '1': 50 },
          whyExplanation: 'H produces (|0⟩+|1⟩)/√2. The X gate swaps amplitudes, giving (|1⟩+|0⟩)/√2. Both states still carry 50% probability upon measurement.'
        },
        codeConnection: {
          title: 'From Circuit to Python: Assembling Sequential Gates',
          whatAreWeCoding: 'In quantum programming, gates are appended chronologically to the circuit. In this script, we apply Hadamard to create superposition, followed immediately by Pauli-X.',
          circuitPreview: 'q[0]: |0⟩ ─── [ H ] ─── [ X ] ─── [ M ] ──> c[0]',
          codeSnippet: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Step 1: Create superposition
qc.h(0)

# Step 2: Bit-flip the superposition components
qc.x(0)

# Step 3: Readout
qc.measure(0, 0)`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'qc.h(0)',
              explanation: 'Gate 1 (Time Step 0): Rotates |0⟩ into (|0⟩ + |1⟩)/√2.',
              circuitMapping: '[ H Gate ] at t=0'
            },
            {
              codeSnippet: 'qc.x(0)',
              explanation: 'Gate 2 (Time Step 1): Swaps the 0 and 1 amplitude coefficients.',
              circuitMapping: '[ X Gate ] at t=1'
            },
            {
              codeSnippet: 'qc.measure(0, 0)',
              explanation: 'Step 3: Measures the resulting state into classical bit 0.',
              circuitMapping: '[ M Measure ]'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: 'Sequential operations executed in order. The outcome remains a balanced 50/50 superposition.',
            counts: { '0': 508, '1': 516 },
            percentages: { '0': 49.6, '1': 50.4 },
            shots: 1024,
            stateDescription: '|ψ⟩ = 0.707|1⟩ + 0.707|0⟩ (Depth = 2)'
          }
        },
        codingPractice: {
          title: 'Assemble a Two-Step Circuit: H then X',
          taskDescription: 'Assemble a 2-gate sequential circuit on qubit 0: first apply `qc.h(0)`, then apply `qc.x(0)`.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# TODO: Step 1 - Apply Hadamard gate to qubit 0


# TODO: Step 2 - Apply Pauli-X gate to qubit 0


qc.measure(0, 0)`,
          hint: 'First line: qc.h(0). Second line: qc.x(0).',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(1, 1)

# Step 1 - Apply Hadamard gate
qc.h(0)

# Step 2 - Apply Pauli-X gate
qc.x(0)

qc.measure(0, 0)`,
          validationRules: {
            requiredOperations: ['qc.h(0)', 'qc.x(0)'],
            minLines: 8,
            successMessage: 'Great job! You assembled a 2-step quantum circuit in sequence.',
            failureHint: 'Make sure both `qc.h(0)` and `qc.x(0)` are included in your code.'
          },
          simulatedRun: {
            expectedState: 'Balanced Superposition',
            counts: { '0': 512, '1': 512 },
            explanation: '1,024 shots measured: ~50% 0 and ~50% 1. Circuit depth = 2 successfully evaluated.'
          }
        },
        selfCheck: {
          question: 'What is the circuit depth of a circuit containing 2 sequential gates on one wire?',
          options: [
            { id: 'a', text: 'Depth = 2' },
            { id: 'b', text: 'Depth = 0' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! Circuit depth is the number of sequential time steps: 2.',
          explanationIncorrect: 'Depth counts the sequential steps from input to output: 2.'
        }
      },
      {
        id: 'cir-4',
        title: 'Lesson 4 — Multi-Step Circuits',
        durationMinutes: 11,
        conceptExplanation: 'As circuits grow, multiple qubits evolve in parallel. Gates on different wires occurring at the same time step execute simultaneously. For example, applying H to q[0] while applying X to q[1] takes only 1 time step of circuit depth.',
        visualNote: 'q[0] ─── H ───\nq[1] ─── X ─── (Parallel depth = 1)',
        selfCheck: {
          question: 'If two gates act on two different qubits at the same time, what is the combined time depth?',
          options: [
            { id: 'a', text: '1 time step (they run in parallel)' },
            { id: 'b', text: '2 time steps' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Spot on! Independent operations execute concurrently in parallel.',
          explanationIncorrect: 'Operations on separate qubits occur simultaneously in 1 time step.'
        }
      },
      {
        id: 'cir-5',
        title: 'Lesson 5 — Circuit Challenge',
        durationMinutes: 10,
        conceptExplanation: 'Verify your mastery of circuit reading and composition before advancing to the mystery of Entanglement.',
        selfCheck: {
          question: 'What do double-lines typically represent at the end of a quantum circuit?',
          options: [
            { id: 'a', text: 'Classical bit wires carrying measurement results' },
            { id: 'b', text: 'Power cables' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! Double lines denote classical bit channels.',
          explanationIncorrect: 'Double lines denote classical measurement registers.'
        }
      }
    ],
    practice: {
      title: 'Circuit Practice: Add the Second Step',
      instruction: 'Complete the H + X sequence by placing the X gate.',
      wireTemplate: {
        qubitLabel: 'q[0] |0⟩ ─── H ───',
        beforeGate: '───',
        afterGate: '─── ⊚ (Measure)'
      },
      availableGates: [
        { symbol: 'X', name: 'Pauli-X', isCorrect: true },
        { symbol: 'Z', name: 'Pauli-Z', isCorrect: false }
      ],
      hint: 'Choose the Pauli-X bit-flip gate.',
      successExplanation: 'Well done! You assembled a multi-step quantum circuit.'
    },
    tutorSection: {
      lessonContext: 'Quantum Circuits & Composition',
      exampleContext: 'Sequential and parallel wires',
      suggestedQuestions: [
        {
          id: 'q-c-1',
          label: 'What is circuit depth?',
          question: 'Why does circuit depth matter?',
          answer: 'Circuit depth is the number of sequential time steps. Lower depth is critical to finish computation before environmental noise (decoherence) destroys the quantum information.',
          concepts: ['Circuit Depth', 'Decoherence']
        }
      ]
    },
    prevLesson: { slug: 'gates', title: 'Quantum Gates' },
    nextLesson: { slug: 'entanglement', title: 'Entanglement' }
  },

  // ==========================================
  // MODULE 6: ENTANGLEMENT (6 Mini-Lessons)
  // ==========================================
  'entanglement': {
    slug: 'entanglement',
    moduleId: 'mod-6',
    title: 'Entanglement',
    subtitle: 'Non-separable states, correlated outcomes, and the Bell State.',
    difficulty: 'Intermediate',
    estimatedTime: '55 mins',
    overview: 'Entanglement is what Albert Einstein called "spooky action at a distance." In this module, you will learn what entanglement truly means (strong quantum correlation without faster-than-light communication) and construct the famous Bell State.',
    labPresetId: 'bell-state',
    miniLessons: [
      {
        id: 'ent-1',
        title: 'Lesson 1 — What is Entanglement?',
        durationMinutes: 9,
        conceptExplanation: 'When two particles become entangled, their quantum states become intertwined such that the state of one cannot be described independently of the other. Crucially: entanglement does NOT allow instant communication across space. Measuring one entangled particle gives a completely random result — you cannot choose the outcome to send a message. Instead, it creates perfect statistical correlation when both outcomes are compared.',
        analogy: 'Imagine a pair of matching shoes (left and right) placed in two sealed boxes. One box is shipped to Tokyo and the other to London. When the person in Tokyo opens their box and finds the LEFT shoe, they instantly know the box in London contains the RIGHT shoe. No signal traveled between the boxes!',
        visualNote: 'Entangled State: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
        selfCheck: {
          question: 'Can quantum entanglement be used to send internet messages faster than the speed of light?',
          options: [
            { id: 'a', text: 'No, because measurement outcomes are random and require a classical channel to compare' },
            { id: 'b', text: 'Yes, it provides instantaneous Morse code' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Spot on! The No-Communication Theorem proves entanglement cannot transmit data faster than light.',
          explanationIncorrect: 'Entanglement produces correlations, but because measurement is random, no faster-than-light signal is transmitted.'
        }
      },
      {
        id: 'ent-2',
        title: 'Lesson 2 — Two-Qubit Registers',
        durationMinutes: 9,
        conceptExplanation: 'With two qubits (q0 and q1), there are four possible basis states: |00⟩, |01⟩, |10⟩, and |11⟩. In a separable state, you can factor the state into (q0 state) ⊗ (q1 state). In an entangled state, no such factorization exists: the state belongs to the pair as a unified whole.',
        visualNote: '4 States: |00⟩, |01⟩, |10⟩, |11⟩',
        selfCheck: {
          question: 'How many classical basis states exist for a 2-qubit register?',
          options: [
            { id: 'a', text: '2 states' },
            { id: 'b', text: '4 states (|00⟩, |01⟩, |10⟩, |11⟩)' },
            { id: 'c', text: '8 states' }
          ],
          correctOptionId: 'b',
          explanationCorrect: 'Correct! 2ⁿ states for n qubits: 2² = 4.',
          explanationIncorrect: 'For n qubits, there are 2ⁿ states: 2² = 4.'
        }
      },
      {
        id: 'ent-3',
        title: 'Lesson 3 — CNOT in Action',
        durationMinutes: 9,
        conceptExplanation: 'The entangling engine is the Controlled-NOT (CNOT) gate. When applied to a control qubit that is in superposition, it links the target qubit to the control’s fate.',
        visualNote: 'Superposition on control + CNOT = Entanglement',
        selfCheck: {
          question: 'What happens to the target qubit if the control qubit is in superposition (|0⟩+|1⟩)/√2?',
          options: [
            { id: 'a', text: 'The target flips conditionally, entangling the two qubits' },
            { id: 'b', text: 'Nothing happens' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Yes! The target is conditionally flipped for the |1⟩ component, creating an entangled state.',
          explanationIncorrect: 'When control is in superposition, CNOT creates an entangled superposition of both qubits.'
        }
      },
      {
        id: 'ent-4',
        title: 'Lesson 4 — The Bell State Recipe',
        durationMinutes: 10,
        conceptExplanation: 'Here is the canonical recipe to build the Bell State |Φ⁺⟩: 1) Initialize |00⟩. 2) Apply an H gate to qubit 0: (|00⟩ + |10⟩)/√2. 3) Apply CNOT with qubit 0 as control and qubit 1 as target: (|00⟩ + |11⟩)/√2. Notice: |01⟩ and |10⟩ have vanished!',
        visualNote: '|00⟩ ──[ H on q0 ]──> (|00⟩+|10⟩)/√2 ──[ CNOT ]──> (|00⟩+|11⟩)/√2',
        codeConnection: {
          title: 'From Circuit to Python: Coding the Canonical Bell State',
          whatAreWeCoding: 'To create the maximally entangled Bell state (|00⟩ + |11⟩)/√2 in code, we combine a Hadamard gate on qubit 0 followed by a CNOT from qubit 0 to qubit 1. Measurement of both qubits reveals 100% quantum correlation.',
          circuitPreview: `q[0]: |0⟩ ─── [ H ] ─── ● ─── [ M ] ──> c[0]
q[1]: |0⟩ ───────────── ⊕ ─── [ M ] ──> c[1]`,
          codeSnippet: `from qiskit import QuantumCircuit

# 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Step 1: Put qubit 0 into equal superposition
qc.h(0)

# Step 2: Entangle qubit 1 with qubit 0
qc.cx(0, 1)

# Step 3: Measure both qubits
qc.measure([0, 1], [0, 1])`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'qc.h(0)',
              explanation: 'Places control qubit 0 into equal superposition (|00⟩ + |10⟩)/√2.',
              circuitMapping: '[ H Gate ] on q[0]'
            },
            {
              codeSnippet: 'qc.cx(0, 1)',
              explanation: 'CNOT acts on the |10⟩ component to flip target to |11⟩, producing (|00⟩ + |11⟩)/√2.',
              circuitMapping: 'CNOT (● on q0, ⊕ on q1)'
            },
            {
              codeSnippet: 'qc.measure([0, 1], [0, 1])',
              explanation: 'Collapses both entangled qubits into classical bits.',
              circuitMapping: 'Dual [ M ] Readouts'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: 'Outcomes 01 and 10 NEVER appear! Whenever qubit 0 is 0, qubit 1 is 0. Whenever qubit 0 is 1, qubit 1 is 1.',
            counts: { '00': 514, '11': 510 },
            percentages: { '00': 50.2, '11': 49.8 },
            shots: 1024,
            stateDescription: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 (Maximally Entangled Bell Pair)'
          }
        },
        codingPractice: {
          title: 'Build the Canonical Bell State |Φ⁺⟩',
          taskDescription: 'Complete the Bell state script by applying `qc.h(0)` to create superposition, followed by `qc.cx(0, 1)` to entangle the pair.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# TODO: Step 1: Put qubit 0 into superposition


# TODO: Step 2: Entangle qubit 1 with qubit 0 using CNOT


qc.measure([0, 1], [0, 1])`,
          hint: 'First call qc.h(0), then call qc.cx(0, 1).',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)

# Step 1: Put qubit 0 into superposition
qc.h(0)

# Step 2: Entangle qubit 1 with qubit 0 using CNOT
qc.cx(0, 1)

qc.measure([0, 1], [0, 1])`,
          validationRules: {
            requiredOperations: ['qc.h(0)', 'qc.cx(0, 1)'],
            minLines: 8,
            successMessage: 'Outstanding! You generated the maximally entangled Bell state. Simulation verifies 00 and 11 correlation!',
            failureHint: 'Make sure you apply `qc.h(0)` first, followed by `qc.cx(0, 1)`.'
          },
          simulatedRun: {
            expectedState: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
            counts: { '00': 512, '11': 512 },
            explanation: '1,024 shots measured: ~50% 00 and ~50% 11. Zero cross-terms (01 or 10)! Perfect correlation achieved.'
          }
        },
        selfCheck: {
          question: 'In the Bell state (|00⟩ + |11⟩)/√2, what is the probability of measuring state |01⟩?',
          options: [
            { id: 'a', text: '0% (impossible)' },
            { id: 'b', text: '50%' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! State |01⟩ has zero amplitude in |Φ⁺⟩.',
          explanationIncorrect: 'The state is strictly (|00⟩+|11⟩)/√2, so |01⟩ has 0% chance.'
        }
      },
      {
        id: 'ent-5',
        title: 'Lesson 5 — Entanglement Experiment',
        durationMinutes: 10,
        conceptExplanation: 'Let us simulate the Bell State across 1,024 measurement shots and observe the outcome distribution.',
        interactiveTry: {
          title: 'Try It: Run the Bell State Circuit',
          instruction: 'Predict the outcome of measuring the canonical Bell State circuit.',
          circuitPreview: 'q0 |0⟩ ─── H ─── ● ─── M\nq1 |0⟩ ───────── ⊕ ─── M',
          predictionPrompt: 'Which outcomes will appear in the 1,024 shots?',
          predictionOptions: [
            { id: 'p-bell', text: 'Only |00⟩ (~50%) and |11⟩ (~50%)', isCorrect: true },
            { id: 'p-all', text: 'Equal 25% split across 00, 01, 10, 11', isCorrect: false },
            { id: 'p-zero', text: 'Only 00', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '00': 50, '11': 50 },
          whyExplanation: 'States |01⟩ and |10⟩ NEVER appear! When q0 is measured as 0, q1 is ALWAYS 0. When q0 is measured as 1, q1 is ALWAYS 1. They are 100% correlated.'
        },
        selfCheck: {
          question: 'If you measure qubit 0 and find outcome 1, what will qubit 1 measure in state |Φ⁺⟩?',
          options: [
            { id: 'a', text: 'Outcome 1 with 100% certainty' },
            { id: 'b', text: 'Outcome 0' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Spot on! The outcomes are perfectly correlated.',
          explanationIncorrect: 'In |Φ⁺⟩ = (|00⟩+|11⟩)/√2, measuring 1 on q0 guarantees 1 on q1.'
        }
      },
      {
        id: 'ent-6',
        title: 'Lesson 6 — Entanglement Check',
        durationMinutes: 8,
        conceptExplanation: 'Review your mastery of bipartite entanglement and quantum correlation.',
        selfCheck: {
          question: 'What two gates are needed to create the Bell State from |00⟩?',
          options: [
            { id: 'a', text: 'Hadamard on q0, then CNOT(q0→q1)' },
            { id: 'b', text: 'Pauli-X on both qubits' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! H on q0 followed by CNOT is the canonical Bell recipe.',
          explanationIncorrect: 'The Bell state requires H to create superposition followed by CNOT to entangle.'
        }
      }
    ],
    practice: {
      title: 'Entanglement Practice: Complete the Bell State',
      instruction: 'Select the CNOT gate to entangle qubit q[0] with qubit q[1].',
      wireTemplate: {
        qubitLabel: 'q[0] ─ H ─ ● ─\nq[1] ─────',
        beforeGate: '─',
        afterGate: '─ ⊚'
      },
      availableGates: [
        { symbol: 'CNOT', name: 'Controlled-NOT', isCorrect: true },
        { symbol: 'Z', name: 'Pauli-Z', isCorrect: false }
      ],
      hint: 'Choose the two-qubit entangling gate.',
      successExplanation: 'Success! You built the Bell State.'
    },
    tutorSection: {
      lessonContext: 'Entanglement & Bell Pairs',
      exampleContext: 'H + CNOT on q0 and q1',
      suggestedQuestions: [
        {
          id: 'q-e-1',
          label: 'What is EPR paradox?',
          question: 'What was Einstein’s EPR paradox?',
          answer: 'Einstein, Podolsky, and Rosen argued in 1935 that if quantum mechanics predicted instant correlations, there must be "hidden variables." Decades later, John Bell proved mathematically (Bell’s Theorem) that nature is genuinely non-local!',
          concepts: ['EPR Paradox', 'Bell’s Theorem']
        }
      ]
    },
    prevLesson: { slug: 'circuits', title: 'Quantum Circuits' },
    nextLesson: { slug: 'algorithms', title: 'Quantum Algorithms' }
  },

  // ==========================================
  // MODULE 7: ALGORITHMS (6 Mini-Lessons)
  // ==========================================
  'algorithms': {
    slug: 'algorithms',
    moduleId: 'mod-7',
    title: 'Introduction to Quantum Algorithms',
    subtitle: 'Constructive and destructive interference in Deutsch-Jozsa and Grover search.',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    overview: 'Now you reach the pinnacle of quantum computing: quantum algorithms! Learn how quantum algorithms combine superposition and interference to amplify the correct answer while canceling wrong answers.',
    labPresetId: 'deutsch-jozsa-intro',
    miniLessons: [
      {
        id: 'alg-1',
        title: 'Lesson 1 — What is an Algorithm?',
        durationMinutes: 9,
        conceptExplanation: 'An algorithm is a step-by-step procedure for solving a computational problem — like a recipe for baking a cake or instructions for navigating a map. A classical algorithm takes bits as inputs, applies logic gates, and outputs a result.',
        visualNote: 'Input ──[ Step-by-Step Procedure ]──> Output',
        selfCheck: {
          question: 'What is an algorithm in computer science?',
          options: [
            { id: 'a', text: 'A step-by-step procedure for solving a problem' },
            { id: 'b', text: 'A random error in computer memory' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! Algorithms are well-defined procedures.',
          explanationIncorrect: 'An algorithm is an explicit procedure for solving a task.'
        }
      },
      {
        id: 'alg-2',
        title: 'Lesson 2 — What Makes Quantum Algorithms Different?',
        durationMinutes: 10,
        conceptExplanation: 'If you only use superposition, you evaluate all answers simultaneously. But when you measure, the state collapses onto just ONE random answer — which gives you no advantage over a random classical guess! Quantum algorithms work because probability amplitudes can be negative or positive. By orchestrating interference, the amplitudes of wrong answers destructively cancel out, while the amplitude of the correct answer constructively amplifies!',
        analogy: 'Imagine noise-canceling headphones. They listen to the background noise and play an inverted sound wave (opposite phase) to cancel it out, leaving only the music you want to hear.',
        visualNote: 'Positive wave (+) + Negative wave (-) = Silence (Cancellation)',
        selfCheck: {
          question: 'Why is superposition alone NOT enough for quantum advantage?',
          options: [
            { id: 'a', text: 'Because measuring without interference collapses onto a random guess' },
            { id: 'b', text: 'Because superposition is too slow' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Precisely! Interference is necessary to boost the correct answer before readout.',
          explanationIncorrect: 'Without interference, measurement collapses onto a random outcome.'
        }
      },
      {
        id: 'alg-3',
        title: 'Lesson 3 — From Gates to Procedures',
        durationMinutes: 10,
        conceptExplanation: 'Most quantum algorithms follow a three-stage template: 1) Initialize qubits into superposition using Hadamard gates. 2) Query a quantum "oracle" that marks the solution by flipping its phase. 3) Apply an interference transform (diffusion operator) to amplify the marked state.',
        visualNote: 'Initialize |0...0⟩ ──> [ Superposition ] ──> [ Oracle ] ──> [ Interference ] ──> [ Measure ]',
        selfCheck: {
          question: 'What does a quantum oracle typically do to mark a solution?',
          options: [
            { id: 'a', text: 'It flips the relative phase of the solution state (multiplies by -1)' },
            { id: 'b', text: 'It deletes the other qubits' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! The oracle marks states by inverting their phase: -|solution⟩.',
          explanationIncorrect: 'Oracles mark target states using phase inversion.'
        }
      },
      {
        id: 'alg-4',
        title: 'Lesson 4 — Grover’s Search Intuition',
        durationMinutes: 11,
        conceptExplanation: 'Imagine searching an unsorted phonebook of 1,000,000 names for one specific phone number. Classically, you must check an average of 500,000 entries. Grover’s algorithm uses amplitude amplification to find the item in approximately √1,000,000 = 1,000 steps — a quadratic speedup!',
        analogy: 'Imagine water sloshing in a bucket. Each step of Grover’s algorithm reflects the wave amplitudes about their average, causing the water wave at the target location to rise higher and higher until it holds nearly 100% of the water.',
        visualNote: 'Classical: N/2 steps | Grover: √N steps (Quadratic Speedup)',
        selfCheck: {
          question: 'For an unsorted database of 10,000 items, roughly how many operations does Grover search need?',
          options: [
            { id: 'a', text: '~100 operations (√10,000)' },
            { id: 'b', text: '~5,000 operations' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Spot on! √10,000 = 100 operations.',
          explanationIncorrect: 'Grover runs in O(√N) steps: √10,000 = 100.'
        }
      },
      {
        id: 'alg-5',
        title: 'Lesson 5 — Deutsch-Jozsa Intuition',
        durationMinutes: 10,
        conceptExplanation: 'The Deutsch-Jozsa algorithm was the first proof of exponential quantum speedup. It solves this problem: given a black-box function, is it constant (outputs all 0s or all 1s) or balanced (outputs 0 half the time and 1 half the time)? A classical computer must evaluate 2^(n-1) + 1 inputs in the worst case. Deutsch-Jozsa solves it in exactly ONE quantum query!',
        visualNote: 'Classical: Up to 2^(n-1)+1 queries | Quantum: Exactly 1 query',
        selfCheck: {
          question: 'How many queries does the Deutsch-Jozsa algorithm need to determine if a function is constant or balanced?',
          options: [
            { id: 'a', text: 'Exactly 1 query' },
            { id: 'b', text: '1,024 queries' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Correct! Deutsch-Jozsa solves the problem in a single query.',
          explanationIncorrect: 'Deutsch-Jozsa requires only 1 query.'
        }
      },
      {
        id: 'alg-6',
        title: 'Lesson 6 — Explore an Example',
        durationMinutes: 10,
        conceptExplanation: 'Test a 2-qubit balanced oracle. Through destructive interference, state |0⟩ cancels out completely, leaving 100% measurement on outcome 1!',
        interactiveTry: {
          title: 'Try It: Run the Deutsch-Jozsa Circuit',
          instruction: 'Run the simplified Deutsch-Jozsa balanced oracle and observe destructive interference in action.',
          circuitPreview: 'q0 |0⟩ ─── H ─── ● ─── H ─── M\nq1 |0⟩ ─── X ─── ⊕ ─────────',
          predictionPrompt: 'What outcome will destructive interference force on qubit q0?',
          predictionOptions: [
            { id: 'p-1', text: '100% outcome 1 (proving balanced in 1 query)', isCorrect: true },
            { id: 'p-half', text: '50/50 mix', isCorrect: false }
          ],
          shots: 1024,
          expectedDistribution: { '1': 100 },
          whyExplanation: 'Destructive interference completely wiped out the probability of measuring 0. Measuring 1 with 100% certainty proves in a single query that the function is balanced!'
        },
        codeConnection: {
          title: 'From Circuit to Python: Deutsch-Jozsa Interference Transform',
          whatAreWeCoding: 'In the Deutsch-Jozsa algorithm, we set up quantum interference using phase kickback. Target qubit 1 is initialized to |1⟩ with `qc.x(1)` and placed into superposition with `qc.h(1)`. After the CNOT query, a final `qc.h(0)` on qubit 0 causes destructive interference for |0⟩ and constructive interference for |1⟩.',
          circuitPreview: `q[0]: |0⟩ ─── [ H ] ─── ● ─── [ H ] ─── [ M ] ──> c[0]
q[1]: |0⟩ ─── [ X ] ─── [ H ] ─── ⊕ ───`,
          codeSnippet: `from qiskit import QuantumCircuit

# 2 qubits, 1 measurement bit
qc = QuantumCircuit(2, 1)

# Step 1: Initialize target qubit 1 to |1>
qc.x(1)

# Step 2: Put both qubits into superposition
qc.h(0)
qc.h(1)

# Step 3: Balanced Oracle (CNOT kicks back negative phase to q0)
qc.cx(0, 1)

# Step 4: Interference transform on query qubit q0
qc.h(0)

# Step 5: Measure query qubit q0
qc.measure(0, 0)`,
          language: 'python',
          lineExplanations: [
            {
              codeSnippet: 'qc.x(1)',
              explanation: 'Sets auxiliary qubit 1 to |1⟩ so that subsequent Hadamard creates |-⟩.',
              circuitMapping: '[ X Gate ] on q1'
            },
            {
              codeSnippet: 'qc.h(0)\nqc.h(1)',
              explanation: 'Places query and target qubits into superposition.',
              circuitMapping: 'Parallel [ H Gate ]s'
            },
            {
              codeSnippet: 'qc.cx(0, 1)',
              explanation: 'Query oracle: CNOT against |-⟩ kicks back a (-1) phase to q0.',
              circuitMapping: 'CNOT Oracle'
            },
            {
              codeSnippet: 'qc.h(0)',
              explanation: 'Interference transform: converts the kicked-back phase into destructive interference for 0, yielding pure 1.',
              circuitMapping: 'Final [ H Gate ] on q0'
            }
          ],
          simulatedOutput: {
            outputTitle: 'Aer Simulator Execution (1,024 shots)',
            description: '100% of shots measured outcome 1 in a single query! Destructive interference canceled 0 completely.',
            counts: { '1': 1024 },
            percentages: { '1': 100 },
            shots: 1024,
            stateDescription: '|ψ⟩ = 1.00|1⟩ (Deterministic Single-Query Result)'
          }
        },
        codingPractice: {
          title: 'Complete the Interference Readout Gate',
          taskDescription: 'The Deutsch-Jozsa oracle and phase kickback are prepared. Insert the final interference transform gate `qc.h(0)` before measurement.',
          starterCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 1)
qc.x(1)
qc.h(0)
qc.h(1)

# Balanced Oracle
qc.cx(0, 1)

# TODO: Add the final Hadamard gate on q0 to complete interference


qc.measure(0, 0)`,
          hint: 'Call qc.h(0) right before the measurement step.',
          solutionCode: `from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 1)
qc.x(1)
qc.h(0)
qc.h(1)

# Balanced Oracle
qc.cx(0, 1)

# Add the final Hadamard gate on q0
qc.h(0)

qc.measure(0, 0)`,
          validationRules: {
            requiredOperations: ['qc.h(0)'],
            minLines: 12,
            successMessage: 'Brilliant! The final Hadamard transformed phase kickback into destructive interference. 100% outcome 1 proves the function is balanced in 1 query!',
            failureHint: 'Make sure to add `qc.h(0)` after `qc.cx(0, 1)` and before `qc.measure(0, 0)`.'
          },
          simulatedRun: {
            expectedState: '|1⟩ (Balanced Function Detected)',
            counts: { '1': 1024 },
            explanation: '1,024 shots measured: 100% outcome 1. Destructive interference eliminated outcome 0 with mathematical certainty!'
          }
        },
        selfCheck: {
          question: 'What quantum property cancels out the unwanted outcome in this algorithm?',
          options: [
            { id: 'a', text: 'Destructive quantum interference' },
            { id: 'b', text: 'Classical memory caching' }
          ],
          correctOptionId: 'a',
          explanationCorrect: 'Bravo! Destructive interference cancels non-solution amplitudes.',
          explanationIncorrect: 'Destructive quantum interference cancels the unwanted outcomes.'
        }
      }
    ],
    practice: {
      title: 'Algorithm Practice: Final Interference Transform',
      instruction: 'Place the final Hadamard gate on q[0] to create the interference needed for readout.',
      wireTemplate: {
        qubitLabel: 'q[0] ─ H ─ ● ─',
        beforeGate: '───',
        afterGate: '─── ⊚ (Measure)'
      },
      availableGates: [
        { symbol: 'H', name: 'Hadamard', isCorrect: true },
        { symbol: 'Z', name: 'Pauli-Z', isCorrect: false }
      ],
      hint: 'Choose the gate that converts phase kickback into computational 0 and 1.',
      successExplanation: 'Masterful! You completed the quantum interference transform.'
    },
    tutorSection: {
      lessonContext: 'Quantum Algorithms & Interference',
      exampleContext: 'Deutsch-Jozsa & Grover intuition',
      suggestedQuestions: [
        {
          id: 'q-a-1',
          label: 'What is phase kickback?',
          question: 'How does phase kickback work?',
          answer: 'When a controlled gate acts on an eigenvector of the target qubit, the eigenvalue factor (such as -1) is kicked back onto the control qubit, allowing the algorithm to encode function properties directly into control amplitudes!',
          concepts: ['Phase Kickback', 'Eigenvalues']
        }
      ]
    },
    prevLesson: { slug: 'entanglement', title: 'Entanglement' },
    nextLesson: undefined
  }
};
