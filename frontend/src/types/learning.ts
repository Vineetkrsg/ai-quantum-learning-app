export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  isCompleted: boolean;
  type: 'concept' | 'interactive' | 'circuit-lab' | 'quiz';
}

export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  progress: number; // 0 to 100
  estimatedTime: string;
  lessons: Lesson[];
  tags: string[];
  iconName: string;
}

export interface PredictionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface InteractiveTryData {
  title: string;
  instruction: string;
  circuitPreview: string; // e.g. "q0 ─── H ─── M"
  predictionPrompt: string;
  predictionOptions: PredictionOption[];
  shots: number;
  expectedDistribution: Record<string, number>; // state -> percentage (0 to 100)
  whyExplanation: string;
  presetId?: string;
}

export interface SelfCheckData {
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanationCorrect: string;
  explanationIncorrect: string;
}

export interface CodeLineExplanation {
  lineRange?: string;
  codeSnippet: string;
  explanation: string;
  circuitMapping?: string;
}

export interface SimulatedOutputData {
  outputTitle?: string;
  description: string;
  counts: Record<string, number>;
  percentages?: Record<string, number>;
  shots?: number;
  stateDescription?: string;
}

export interface CodeConnectionData {
  title?: string;
  whatAreWeCoding: string;
  circuitPreview: string;
  codeSnippet: string;
  language?: string;
  lineExplanations: CodeLineExplanation[];
  simulatedOutput?: SimulatedOutputData;
}

export interface CodingValidationRules {
  requiredOperations?: string[];
  forbiddenOperations?: string[];
  minLines?: number;
  customValidatorId?: string;
  successMessage: string;
  failureHint: string;
}

export interface CodingPracticeData {
  title: string;
  taskDescription: string;
  starterCode: string;
  hint?: string;
  solutionCode?: string;
  validationRules: CodingValidationRules;
  simulatedRun: {
    expectedState: string;
    counts: Record<string, number>;
    explanation: string;
  };
}

export interface MiniLesson {
  id: string;
  title: string;
  durationMinutes: number;
  conceptExplanation: string;
  analogy?: string;
  visualNote?: string;
  visualExplanation?: {
    title: string;
    description: string;
    steps: VisualStep[];
  };
  interactiveTry?: InteractiveTryData;
  selfCheck?: SelfCheckData;
  initialCircuit?: string[];
  availableGates?: string[];
  hasCircuitPractice?: boolean;
  practiceObjective?: string;
  targetOutcome?: string;
  codeConnection?: CodeConnectionData;
  codingPractice?: CodingPracticeData;
}

export interface PracticeTaskData {
  title: string;
  instruction: string;
  wireTemplate: {
    qubitLabel: string;
    beforeGate: string;
    afterGate: string;
  };
  availableGates: { symbol: string; name: string; isCorrect: boolean }[];
  hint: string;
  successExplanation: string;
}

export interface CircuitWireElement {
  type: 'gate' | 'control' | 'target' | 'wire' | 'measure';
  name?: string;
  badge?: string;
  label?: string;
  symbol?: string;
}

export interface CircuitWireRow {
  qubit: string;
  elements: CircuitWireElement[];
}

export interface GuidedCircuitData {
  title: string;
  description: string;
  instruction?: string;
  qubitCount: number;
  initialState: string;
  expectedOutput: string;
  expectedDistribution: Record<string, number>;
  shots: number;
  circuitSteps: CircuitWireRow[];
  resultExplanation?: string;
  labPresetId?: string;
}

export interface AssessmentData {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  explanationCorrect?: string;
  explanationIncorrect?: Record<string, string> | string;
}

export interface VisualStep {
  label: string;
  stateNotation: string;
  description: string;
  blochAngles?: { theta: string; phi: string };
  colorVariant: 'slate' | 'cyan' | 'indigo' | 'emerald' | 'purple' | 'amber';
}

export interface LessonContent {
  slug: string;
  moduleId: string;
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  overview: string;
  miniLessons: MiniLesson[];
  practice: PracticeTaskData;
  labPresetId: string;
  tutorSection: {
    lessonContext: string;
    exampleContext: string;
    suggestedQuestions: {
      id: string;
      label: string;
      question: string;
      answer: string;
      concepts: string[];
    }[];
  };
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
}
