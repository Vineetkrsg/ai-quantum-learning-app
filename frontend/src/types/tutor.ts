export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  referencedConcepts?: string[];
  codeSnippet?: string;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  query: string;
  category: 'intuition' | 'circuit' | 'math';
}

export interface TutorContext {
  currentCircuitName?: string;
  qubitCount?: number;
  gateCount?: number;
  activeLessonTitle?: string;
}
