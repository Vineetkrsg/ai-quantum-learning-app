export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  category: string;
  xp: number;
  estimatedMinutes: number;
  expectedResult: string;
  hint: string;
  isCompleted: boolean;
  targetGateCount?: number;
}
