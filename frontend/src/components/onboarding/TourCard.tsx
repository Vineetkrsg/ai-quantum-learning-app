import React from 'react';
import { TourStepDefinition } from './TourConstants';
import { Button } from '../ui/Button';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Play
} from 'lucide-react';

interface TourCardProps {
  step: TourStepDefinition;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  onStartDemo: () => void;
  onStartLearning: () => void;
  style?: React.CSSProperties;
}

export const TourCard: React.FC<TourCardProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onClose,
  onStartDemo,
  onStartLearning,
  style
}) => {
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
      style={style}
      className="z-50 w-full max-w-md bg-[var(--surface-card)] border border-sciteal-500/40 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-[var(--fg-main)]"
    >
      {/* Header with Step indicator and Close button */}
      <div className="flex items-start justify-between gap-3 border-b border-[var(--border-card)] pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 font-bold border border-sciteal-500/30">
              {step.badge || `Step ${currentStepIndex + 1} of ${totalSteps}`}
            </span>
            <span className="text-[11px] font-mono text-[var(--fg-muted)]">
              {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
          <h3 className="text-base font-bold text-[var(--fg-main)] tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 flex-shrink-0" />
            <span>{step.title}</span>
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:bg-[var(--surface-sunken)] transition-colors"
          aria-label="Close tour"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body content */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
          {step.content}
        </p>

        {step.actionHint && (
          <div className="p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[11px] text-[var(--fg-muted)] flex items-center gap-2">
            <span className="text-sciteal-600 dark:text-sciteal-400 font-bold">Tip:</span>
            <span>{step.actionHint}</span>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-1 pt-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStepIndex
                ? 'w-6 bg-sciteal-600 dark:bg-sciteal-400'
                : i < currentStepIndex
                ? 'w-2 bg-sciteal-500/50'
                : 'w-2 bg-[var(--border-card)]'
            }`}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[var(--border-card)]">
        {isLast ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs"
              onClick={onClose}
            >
              Close Tour
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto text-xs"
              leftIcon={<BookOpen className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
              onClick={onStartLearning}
            >
              Start Learning
            </Button>
            <Button
              variant="quantum"
              size="sm"
              className="w-full sm:w-auto text-xs font-bold"
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              onClick={onStartDemo}
            >
              Try Interactive Demo
            </Button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:underline cursor-pointer"
            >
              Skip Tour
            </button>

            <div className="flex items-center gap-2">
              {!isFirst && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrev}
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={onNext}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Next Step
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
