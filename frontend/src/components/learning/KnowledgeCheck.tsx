import React from 'react';
import { SelfCheckData } from '../../types/learning';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useProgress } from '../../context/ProgressContext';

export interface KnowledgeCheckState {
  selectedAnswer: string | null;
  answered: boolean;
  isCorrect: boolean;
  explanationVisible?: boolean;
  isCompleted?: boolean;
}

const DEFAULT_STATE: KnowledgeCheckState = {
  selectedAnswer: null,
  answered: false,
  isCorrect: false,
  explanationVisible: false,
  isCompleted: false
};

interface KnowledgeCheckProps {
  moduleId?: string;
  lessonId?: string;
  activityId?: string;
  scopedKey?: string;
  data: SelfCheckData;
  onComplete?: (isCorrect: boolean) => void;
  onContinue?: () => void;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
  moduleId,
  lessonId,
  activityId = 'knowledge-check-1',
  scopedKey,
  data,
  onComplete,
  onContinue
}) => {
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'lesson'}/${activityId}`;
  const currentState = progress.getActivityState<KnowledgeCheckState>(effectiveKey, DEFAULT_STATE);

  const selectedOptionId = currentState.selectedAnswer;
  const hasAnswered = currentState.answered;
  const isCorrect = currentState.isCorrect;

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return; // Prevent repeated clicks after evaluation

    const correct = optionId === data.correctOptionId;
    progress.setActivityState<KnowledgeCheckState>(effectiveKey, {
      selectedAnswer: optionId,
      answered: true,
      isCorrect: correct,
      explanationVisible: true,
      isCompleted: correct
    });

    if (onComplete) {
      onComplete(correct);
    }
  };

  const handleRetry = () => {
    progress.setActivityState<KnowledgeCheckState>(effectiveKey, DEFAULT_STATE);
  };

  return (
    <div className="space-y-4">
      {/* Question Prompt */}
      <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
        {data.question}
      </div>

      {/* Answer Options */}
      <div className="space-y-2.5" role="radiogroup" aria-label="Knowledge check answer options">
        {data.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C'...
          const isSelected = selectedOptionId === opt.id;
          const isThisCorrect = opt.id === data.correctOptionId;

          let optionStyle = 'bg-white dark:bg-[#151e2b] border-slate-200 dark:border-[#223043] text-slate-800 dark:text-[#e6edf4] hover:border-teal-600 dark:hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-[#1b2636]';
          let badgeStyle = 'bg-slate-100 dark:bg-[#1b2636] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#2b3a4f]';

          if (hasAnswered) {
            if (isSelected) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold shadow-sm';
                badgeStyle = 'bg-emerald-700 dark:bg-emerald-600 text-white font-bold border-transparent';
              } else {
                optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-600 dark:border-rose-500 text-rose-950 dark:text-rose-200 font-semibold shadow-sm';
                badgeStyle = 'bg-rose-700 dark:bg-rose-600 text-white font-bold border-transparent';
              }
            } else if (isThisCorrect) {
              // Highlight the correct answer if user picked wrong
              optionStyle = 'bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
              badgeStyle = 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-400 font-bold';
            } else {
              optionStyle = 'opacity-50 bg-slate-100/70 dark:bg-[#0c111a]/40 border-slate-200 dark:border-[#1e2a3b] text-slate-500 dark:text-slate-500 cursor-not-allowed';
            }
          }

          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              disabled={hasAnswered}
              onClick={() => handleSelectOption(opt.id)}
              className={`
                w-full p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all duration-150 flex items-center justify-between gap-3 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${optionStyle}
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 border ${badgeStyle}`}>
                  {letter}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </div>

              {hasAnswered && (
                <div className="flex-shrink-0">
                  {isSelected && isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Correct</span>
                    </span>
                  )}
                  {isSelected && !isCorrect && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400">
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Incorrect</span>
                    </span>
                  )}
                  {!isSelected && isThisCorrect && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-semibold">
                      Correct Answer
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Evaluated Feedback & Explanation */}
      {hasAnswered && (
        <div className={`
          p-4 rounded-xl border animate-in fade-in duration-150 space-y-3
          ${isCorrect 
            ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200' 
            : 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-300 dark:border-rose-500/40 text-rose-950 dark:text-rose-200'}
        `}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span className="text-sm font-bold text-rose-900 dark:text-rose-300">
                    Incorrect
                  </span>
                </>
              )}
            </div>
            <Badge variant={isCorrect ? 'emerald' : 'rose'} size="sm">
              {isCorrect ? '+25 XP' : 'Review & Retry'}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {isCorrect ? data.explanationCorrect : data.explanationIncorrect}
          </p>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-[#223043]">
            {!isCorrect ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Try Again
              </Button>
            ) : (
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                Topic Mastery Verified
              </span>
            )}

            {onContinue && (
              <Button
                variant="primary"
                size="sm"
                onClick={onContinue}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
