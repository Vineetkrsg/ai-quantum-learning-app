import React from 'react';
import { HelpCircle, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';

interface PredictionOption {
  id: string;
  label: string;
  isExpected: boolean;
  explanation: string;
}

interface DemoPredictionProps {
  question: string;
  conceptIntro?: {
    title: string;
    description: string;
    terms: Array<{ term: string; definition: string }>;
  };
  options: PredictionOption[];
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onProceed: () => void;
}

export const DemoPrediction: React.FC<DemoPredictionProps> = ({
  question,
  conceptIntro,
  options,
  selectedOptionId,
  onSelectOption,
  onProceed
}) => {
  const selectedOption = options.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Concept Micro-Learning Box if provided */}
      {conceptIntro && (
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sciteal-700 dark:text-sciteal-300 uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>{conceptIntro.title}</span>
          </div>

          <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
            {conceptIntro.description}
          </p>

          {/* Zero-Jargon First Term Definitions */}
          {conceptIntro.terms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[var(--border-card)]">
              {conceptIntro.terms.map((t) => (
                <div key={t.term} className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-xs">
                  <span className="font-bold text-sciteal-600 dark:text-sciteal-400">{t.term}: </span>
                  <span className="text-[var(--fg-muted)]">{t.definition}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prediction Prompt */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
            {question}
          </h3>
        </div>
        <p className="text-xs text-[var(--fg-muted)]">
          Select what you think will happen before running the circuit. There are no penalties for exploring!
        </p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectOption(opt.id)}
                className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
                  isSelected
                    ? 'bg-sciteal-500/15 border-sciteal-600 dark:border-sciteal-400 text-sciteal-900 dark:text-sciteal-100 font-semibold ring-2 ring-sciteal-500/30'
                    : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-main)] hover:border-sciteal-500/50 hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <span className="flex-1">{opt.label}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    isSelected
                      ? 'border-sciteal-600 bg-sciteal-600 text-white'
                      : 'border-[var(--border-card)] bg-[var(--surface-card)]'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Card shown immediately upon selection */}
      {selectedOption && (
        <div className="p-4 rounded-xl border border-sciteal-500/40 bg-sciteal-500/10 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-sciteal-800 dark:text-sciteal-200">
            <CheckCircle2 className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>
              {selectedOption.isExpected
                ? 'Good prediction!'
                : "Not quite — and that's exactly why we experiment!"}
            </span>
          </div>
          <p className="text-xs text-[var(--fg-main)] leading-relaxed">
            {selectedOption.explanation}
          </p>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={onProceed}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Continue to Circuit Builder
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
