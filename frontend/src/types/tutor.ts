export interface GeneratedQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface GeneratedQuestionModel {
  id: string;
  type: 'multiple-choice' | 'prediction' | 'circuit-fix' | 'code-interpretation';
  question: string;
  options: GeneratedQuestionOption[];
  hint?: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  referencedConcepts?: string[];
  codeSnippet?: string;
  action?: string;
  provider?: 'mock' | 'gemini';
  generatedQuestion?: GeneratedQuestionModel;
  debugHints?: string[];
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  query: string;
  category: 'intuition' | 'circuit' | 'math' | 'code';
}

export interface TutorCircuitContext {
  numberOfQubits: number;
  gateCount: number;
  summary?: string;
  gates?: any[];
  circuitName?: string;
  targetOutcome?: string;
}

export interface TutorCodeContext {
  code: string;
  language?: string;
  taskDescription?: string;
  starterCode?: string;
}

export interface TutorSimulationContext {
  counts?: Record<string, number>;
  probabilities?: Record<string, number>;
  shots?: number;
  executionTimeMs?: number;
}

export interface TutorLessonContext {
  moduleId: string;
  moduleTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  currentTopic?: string;
  activityId?: string;
}

export interface TutorContext {
  currentCircuitName?: string;
  qubitCount?: number;
  gateCount?: number;
  activeLessonTitle?: string;
  moduleId?: string;
  moduleTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  currentTopic?: string;
  activityId?: string;
  circuitContext?: TutorCircuitContext;
  codeContext?: TutorCodeContext;
  simulationResult?: TutorSimulationContext;
  currentCode?: string;
  gates?: any[];
}

export interface TutorRequest {
  message?: string;
  action?: 'chat' | 'explain_circuit' | 'explain_code' | 'debug_code' | 'hint' | 'generate_question';
  history?: { id: string; sender: string; text: string; timestamp: string }[];
  circuitContext?: TutorCircuitContext;
  codeContext?: TutorCodeContext;
  simulationResult?: TutorSimulationContext;
  lessonContext?: TutorLessonContext;
  studentProgress?: { overallProgress: number; completedLessonsCount: number; xp: number };
  hintLevel?: number;
}

export interface TutorResponse {
  reply: string;
  action: string;
  suggestedFollowups: string[];
  referencedConcepts: string[];
  provider: 'mock' | 'gemini';
  generatedQuestion?: GeneratedQuestionModel;
  debugHints?: string[];
  hintLevel?: number;
}

