import React, { useState } from 'react';
import { SelfCheckData } from '../../types/learning';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface KnowledgeCheckProps {
  data: SelfCheckData;
  onComplete?: (isCorrect: boolean) => void;
  onContinue?: () => void;
}

export const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({
  data,
  onComplete,
  onContinue
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isCorrect = selectedOptionId === data.correctOptionId;

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return; // Prevent repeated clicks after evaluation

    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const correct = optionId === data.correctOptionId;
    if (onComplete) {
      onComplete(correct);
    }
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setHasAnswered(false);
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

          let optionStyle = 'bg-white dark:bg-slate-900/70 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500 hover:bg-slate-50 dark:hover:bg-slate-850';
          let badgeStyle = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700';

          if (hasAnswered) {
            if (isSelected) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-100/80 dark:bg-emerald-950/40 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/50 shadow-sm';
                badgeStyle = 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold border-transparent';
              } else {
                optionStyle = 'bg-rose-100/80 dark:bg-rose-950/40 border-rose-600 dark:border-rose-500 text-rose-950 dark:text-rose-200 font-semibold ring-1 ring-rose-500/50 shadow-sm';
                badgeStyle = 'bg-rose-600 dark:bg-rose-500 text-white font-bold border-transparent';
              }
            } else if (isThisCorrect) {
              // Highlight the correct answer if user picked wrong
              optionStyle = 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 font-medium';
              badgeStyle = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold';
            } else {
              optionStyle = 'opacity-40 bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed';
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
                focus:outline-none focus:ring-2 focus:ring-cyan-500/50
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
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
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
          p-4 rounded-xl border animate-in fade-in duration-200 space-y-3
          ${isCorrect 
            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/40 text-emerald-950 dark:text-emerald-200' 
            : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-500/40 text-rose-950 dark:text-rose-200'}
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
              {isCorrect ? '+25 XP' : 'Keep Trying'}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {isCorrect ? data.explanationCorrect : data.explanationIncorrect}
          </p>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-current/10">
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
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                Topic Mastery Verified
              </span>
            )}

            {onContinue && (
              <Button
                variant={isCorrect ? 'quantum' : 'secondary'}
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
