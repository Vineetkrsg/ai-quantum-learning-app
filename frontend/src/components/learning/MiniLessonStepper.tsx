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
    <div className="bg-white dark:bg-[#151e2b] rounded-xl border border-slate-200 dark:border-[#223043] p-2.5 overflow-x-auto shadow-sm">
      <div className="flex items-center gap-2 min-w-max">
        {lessons.map((lesson, idx) => {
          const isActive = lesson.id === activeLessonId;
          const isCompleted = completedLessonIds.includes(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border text-left
                ${isActive
                  ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 dark:border-teal-500 text-teal-900 dark:text-teal-200 font-bold shadow-sm'
                  : isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
                  : 'bg-slate-50 dark:bg-[#111823] border-slate-200 dark:border-[#223043] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1b2636]'}
              `}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <span className={`w-4 h-4 rounded-full border text-[10px] font-mono flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'border-teal-700 dark:border-teal-400 text-teal-800 dark:text-teal-300 font-bold' : 'border-slate-300 dark:border-[#2b3a4f] text-slate-500 dark:text-slate-400'
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

