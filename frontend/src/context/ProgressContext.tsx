import React, { createContext, useContext, useState, useEffect } from 'react';
import { LEARNING_MODULES } from '../mock/modulesData';

export interface RecentActivity {
  id: string;
  type: 'lesson' | 'circuit' | 'quiz' | 'challenge';
  title: string;
  detail: string;
  time: string;
}

export interface QuizRecord {
  id: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface ProgressState {
  overallProgress: number;
  moduleProgress: Record<string, number>;
  completedLessonsByModule: Record<string, string[]>; // moduleSlug -> completed lesson IDs
  completedLessons: string[]; // List of mini-lesson IDs completed across all modules
  completedChallenges: string[];
  circuitsRun: number;
  xp: number;
  streakDays: number;
  recentActivities: RecentActivity[];
  conceptMastery: Record<string, number>;
  quizStats: QuizRecord[];
}

interface ProgressContextType extends ProgressState {
  completeLesson: (moduleSlug: string, lessonId: string, lessonTitle: string, totalLessonsInModule?: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getModuleCompletedCount: (moduleSlug: string) => number;
  recordQuizResult: (topic: string, score: number, total: number) => void;
  recordCircuitRun: (circuitName: string) => void;
  recordChallengeComplete: (challengeId: string, xp: number) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'qulearn_student_progress_v2';

// 100% clean 0% initial state for any new student
const INITIAL_STATE: ProgressState = {
  overallProgress: 0,
  moduleProgress: {
    'fundamentals': 0,
    'qubits': 0,
    'superposition': 0,
    'gates': 0,
    'circuits': 0,
    'entanglement': 0,
    'algorithms': 0,
  },
  completedLessonsByModule: {
    'fundamentals': [],
    'qubits': [],
    'superposition': [],
    'gates': [],
    'circuits': [],
    'entanglement': [],
    'algorithms': [],
  },
  completedLessons: [],
  completedChallenges: [],
  circuitsRun: 0,
  xp: 0,
  streakDays: 0,
  recentActivities: [],
  quizStats: [],
  conceptMastery: {
    'Qubit State Representation': 0,
    'Dirac Bra-Ket Notation': 0,
    'Bloch Sphere Coordinates': 0,
    'Superposition & Born Rule': 0,
    'Pauli & Phase Gates': 0,
    'Two-Qubit Entanglement': 0,
    'Interference & Algorithms': 0,
    'Error Mitigation & Noise': 0,
  }
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Ensure completedLessonsByModule is present and populated
        const completedByModule = parsed.completedLessonsByModule || { ...INITIAL_STATE.completedLessonsByModule };
        
        // If migrated from flat list
        if (parsed.completedLessons && Array.isArray(parsed.completedLessons)) {
          parsed.completedLessons.forEach((lessonId: string) => {
            const foundMod = LEARNING_MODULES.find(m => m.lessons.some(l => l.id === lessonId));
            if (foundMod && !completedByModule[foundMod.slug]?.includes(lessonId)) {
              if (!completedByModule[foundMod.slug]) completedByModule[foundMod.slug] = [];
              completedByModule[foundMod.slug].push(lessonId);
            }
          });
        }

        // Recalculate module progress accurately from actual completed count / total
        const updatedModuleProgress: Record<string, number> = { ...INITIAL_STATE.moduleProgress };
        LEARNING_MODULES.forEach((mod) => {
          const completedCount = (completedByModule[mod.slug] || []).length;
          updatedModuleProgress[mod.slug] = Math.min(100, Math.round((completedCount / mod.lessons.length) * 100));
        });

        // Recalculate overall progress accurately
        const totalLessonsAll = LEARNING_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
        const totalCompletedAll = Object.values(completedByModule).reduce((acc: number, arr: any) => acc + (arr?.length || 0), 0);
        const recalculatedOverall = totalLessonsAll > 0 ? Math.round((totalCompletedAll / totalLessonsAll) * 100) : 0;

        return {
          ...INITIAL_STATE,
          ...parsed,
          completedLessonsByModule: completedByModule,
          moduleProgress: updatedModuleProgress,
          overallProgress: recalculatedOverall,
          quizStats: parsed.quizStats || []
        };
      }
    } catch (e) {
      console.warn('Failed to read saved progress from localStorage', e);
    }
    return INITIAL_STATE;
  });

  // Save changes to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, [state]);

  const isLessonCompleted = (lessonId: string): boolean => {
    return state.completedLessons.includes(lessonId);
  };

  const getModuleCompletedCount = (moduleSlug: string): number => {
    return (state.completedLessonsByModule[moduleSlug] || []).length;
  };

  const completeLesson = (
    moduleSlug: string,
    lessonId: string,
    lessonTitle: string,
    totalLessonsInModule?: number
  ) => {
    setState((prev) => {
      const currentModuleCompleted = prev.completedLessonsByModule[moduleSlug] || [];
      const alreadyCompleted = currentModuleCompleted.includes(lessonId) || prev.completedLessons.includes(lessonId);

      // Guard against duplicate clicks: do NOT increase progress again
      if (alreadyCompleted) {
        return prev;
      }

      const updatedModuleCompleted = [...currentModuleCompleted, lessonId];
      const updatedCompletedByModule = {
        ...prev.completedLessonsByModule,
        [moduleSlug]: updatedModuleCompleted
      };

      const updatedLessons = [...prev.completedLessons, lessonId];

      // Calculate module progress from completed / total * 100
      const moduleMeta = LEARNING_MODULES.find(m => m.slug === moduleSlug || m.id === moduleSlug);
      const totalLessons = totalLessonsInModule || moduleMeta?.lessons.length || 5;
      const newModuleProgress = Math.min(100, Math.round((updatedModuleCompleted.length / totalLessons) * 100));

      const updatedModuleProgress = {
        ...prev.moduleProgress,
        [moduleSlug]: newModuleProgress
      };

      // Calculate overall platform progress from total completed / total lessons
      const totalLessonsAll = LEARNING_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
      const totalCompletedAll = Object.values(updatedCompletedByModule).reduce((acc, arr) => acc + arr.length, 0);
      const newOverall = totalLessonsAll > 0 ? Math.round((totalCompletedAll / totalLessonsAll) * 100) : 0;

      const newActivity: RecentActivity = {
        id: `act-${Date.now()}`,
        type: 'lesson',
        title: `Completed Lesson: ${lessonTitle}`,
        detail: `Progress in ${moduleMeta?.title || moduleSlug} updated to ${newModuleProgress}%`,
        time: 'Just now'
      };

      // Concept mastery boost based on module
      const updatedMastery = { ...prev.conceptMastery };
      if (moduleSlug === 'fundamentals') updatedMastery['Qubit State Representation'] = Math.min(100, (updatedMastery['Qubit State Representation'] || 0) + 20);
      if (moduleSlug === 'qubits') updatedMastery['Dirac Bra-Ket Notation'] = Math.min(100, (updatedMastery['Dirac Bra-Ket Notation'] || 0) + 20);
      if (moduleSlug === 'superposition') updatedMastery['Superposition & Born Rule'] = Math.min(100, (updatedMastery['Superposition & Born Rule'] || 0) + 20);
      if (moduleSlug === 'gates') updatedMastery['Pauli & Phase Gates'] = Math.min(100, (updatedMastery['Pauli & Phase Gates'] || 0) + 20);
      if (moduleSlug === 'circuits') updatedMastery['Bloch Sphere Coordinates'] = Math.min(100, (updatedMastery['Bloch Sphere Coordinates'] || 0) + 20);
      if (moduleSlug === 'entanglement') updatedMastery['Two-Qubit Entanglement'] = Math.min(100, (updatedMastery['Two-Qubit Entanglement'] || 0) + 20);
      if (moduleSlug === 'algorithms') updatedMastery['Interference & Algorithms'] = Math.min(100, (updatedMastery['Interference & Algorithms'] || 0) + 20);

      const nextState: ProgressState = {
        ...prev,
        completedLessonsByModule: updatedCompletedByModule,
        completedLessons: updatedLessons,
        moduleProgress: updatedModuleProgress,
        overallProgress: newOverall,
        xp: prev.xp + 50,
        streakDays: prev.streakDays === 0 ? 1 : prev.streakDays,
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 9)],
        conceptMastery: updatedMastery
      };

      // Save synchronously before navigation
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {
        console.warn('Failed to save immediately to localStorage', e);
      }

      return nextState;
    });
  };

  const recordQuizResult = (topic: string, score: number, total: number) => {
    setState((prev) => {
      const percentage = Math.round((score / total) * 100);
      const newActivity: RecentActivity = {
        id: `act-${Date.now()}`,
        type: 'quiz',
        title: `Quiz: ${topic}`,
        detail: `Scored ${score}/${total} (${percentage}%)`,
        time: 'Just now'
      };

      const newQuizRecord: QuizRecord = {
        id: `quiz-${Date.now()}`,
        topic,
        score,
        totalQuestions: total,
        date: 'Today'
      };

      return {
        ...prev,
        quizStats: [newQuizRecord, ...(prev.quizStats || [])],
        xp: prev.xp + (percentage >= 80 ? 75 : 30),
        streakDays: prev.streakDays === 0 ? 1 : prev.streakDays,
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 9)]
      };
    });
  };

  const recordCircuitRun = (circuitName: string) => {
    setState((prev) => {
      const newActivity: RecentActivity = {
        id: `act-${Date.now()}`,
        type: 'circuit',
        title: `Simulated Circuit: ${circuitName}`,
        detail: 'Sampled 1024 measurement shots',
        time: 'Just now'
      };

      return {
        ...prev,
        circuitsRun: prev.circuitsRun + 1,
        xp: prev.xp + 15,
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 9)]
      };
    });
  };

  const recordChallengeComplete = (challengeId: string, xpEarned: number) => {
    setState((prev) => {
      if (prev.completedChallenges.includes(challengeId)) return prev;

      const newActivity: RecentActivity = {
        id: `act-${Date.now()}`,
        type: 'challenge',
        title: `Challenge Completed`,
        detail: `Earned +${xpEarned} XP`,
        time: 'Just now'
      };

      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        xp: prev.xp + xpEarned,
        recentActivities: [newActivity, ...prev.recentActivities.slice(0, 9)]
      };
    });
  };

  const resetProgress = () => {
    setState(INITIAL_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        ...state,
        completeLesson,
        isLessonCompleted,
        getModuleCompletedCount,
        recordQuizResult,
        recordCircuitRun,
        recordChallengeComplete,
        resetProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
