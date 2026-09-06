import React from 'react';
import { MiniLesson } from '../../types/learning';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface MiniLessonStepperProps {
  lessons: MiniLesson[];
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (id: string) => void;
}

export const MiniLessonStepper: React.FC<MiniLessonStepperProps> = ({
  lessons,
  activeLessonId,
  completedLessonIds,
  onSelectLesson
}) => {
  return (
    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-300 dark:border-slate-800/80 p-3 overflow-x-auto shadow-sm">
      <div className="flex items-center gap-2 min-w-max">
        {lessons.map((lesson, idx) => {
          const isActive = lesson.id === activeLessonId;
          const isCompleted = completedLessonIds.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`
                px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border text-left
                ${isActive
                  ? 'bg-cyan-50 dark:bg-gradient-to-r dark:from-cyan-500/15 dark:to-indigo-500/15 border-cyan-500 text-cyan-900 dark:text-cyan-300 font-bold shadow-sm shadow-cyan-500/10'
                  : isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
                  : 'bg-slate-100 dark:bg-slate-950/40 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900'}
              `}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <span className={`w-4 h-4 rounded-full border text-[10px] font-mono flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'border-cyan-600 dark:border-cyan-400 text-cyan-700 dark:text-cyan-300 font-bold' : 'border-slate-400 dark:border-slate-700 text-slate-600 dark:text-slate-500'
                }`}>
                  {idx + 1}
                </span>
              )}

              <div className="flex flex-col">
                <span className="truncate max-w-[140px] sm:max-w-[200px]">
                  {lesson.title.replace(/^Lesson \d+ — /, '')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
