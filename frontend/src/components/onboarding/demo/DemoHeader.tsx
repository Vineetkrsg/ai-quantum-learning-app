import React from 'react';
import { Sparkles, RotateCcw, X, Atom } from 'lucide-react';
import { Button } from '../../ui/Button';

interface DemoHeaderProps {
  currentStep: number;
  totalSteps: number;
  onRestart: () => void;
  onClose: () => void;
}

const STEP_LABELS = [
  '1. Understand',
  '2. Predict',
  '3. Build',
  '4. Simulate',
  '5. Interfere',
  '6. Challenge',
  '7. Complete'
];

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  currentStep,
  totalSteps,
  onRestart,
  onClose
}) => {
  return (
    <div className="border-b border-[var(--border-card)] pb-4 space-y-3">
      {/* Top row: Title, Badges, Close */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sciteal-500/15 border border-sciteal-500/30 flex items-center justify-center text-sciteal-600 dark:text-sciteal-400 flex-shrink-0">
            <Atom className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 font-bold border border-sciteal-500/30">
                Interactive Quantum Demo
              </span>
              <span className="text-[10px] text-[var(--fg-muted)] font-mono">
                No prior knowledge required
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--fg-main)] tracking-tight">
              Experiment: Create a Superposition
            </h2>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestart}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Restart experiment from step 1"
          >
            Restart Demo
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:bg-[var(--surface-sunken)] transition-colors"
            aria-label="Close demo"
            title="Close Demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Micro-learning roadmap stepper */}
      <div className="grid grid-cols-7 gap-1 pt-1">
        {STEP_LABELS.map((label, index) => {
          const isCurrent = index === currentStep;
          const isPassed = index < currentStep;

          return (
            <div key={label} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-sciteal-600 dark:bg-sciteal-400'
                    : isPassed
                    ? 'bg-sciteal-500/50'
                    : 'bg-[var(--border-card)]'
                }`}
              />
              <span
                className={`hidden md:block text-[10px] font-mono truncate ${
                  isCurrent
                    ? 'text-sciteal-700 dark:text-sciteal-300 font-bold'
                    : isPassed
                    ? 'text-[var(--fg-muted)]'
                    : 'text-[var(--fg-subtle)]'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
