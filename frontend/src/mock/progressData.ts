export interface ConceptMastery {
  concept: string;
  level: number; // 0-100
  status: 'Mastered' | 'Proficient' | 'Learning' | 'Not Started';
}

export interface QuizStat {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export const CONCEPT_MASTERY: ConceptMastery[] = [
  { concept: 'Qubit State Representation', level: 0, status: 'Not Started' },
  { concept: 'Dirac Bra-Ket Notation', level: 0, status: 'Not Started' },
  { concept: 'Bloch Sphere Coordinates', level: 0, status: 'Not Started' },
  { concept: 'Superposition & Born Rule', level: 0, status: 'Not Started' },
  { concept: 'Pauli & Phase Gates', level: 0, status: 'Not Started' },
  { concept: 'Two-Qubit Entanglement', level: 0, status: 'Not Started' },
  { concept: 'Interference & Algorithms', level: 0, status: 'Not Started' },
  { concept: 'Error Mitigation & Noise', level: 0, status: 'Not Started' }
];

export const QUIZ_STATS: QuizStat[] = [];

export const USER_OVERVIEW = {
  name: 'Quantum Student',
  xp: 0,
  streakDays: 0,
  circuitsRun: 0,
  overallProgress: 0, // 0% Clean starting point
  currentModule: 'Quantum Computing Fundamentals',
  recommendedNextLesson: {
    id: 'fund-1',
    moduleId: 'mod-1',
    slug: 'fundamentals',
    moduleTitle: 'Quantum Computing Fundamentals',
    title: 'Lesson 1: What is Computing?',
    duration: '8 mins'
  }
};
