import React from 'react';
import { GuidedExperiment, SimulationResult } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface PredictionCardProps {
  experiment: GuidedExperiment;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  simulationResult: SimulationResult | null;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  experiment,
  selectedOptionId,
  onSelectOption,
  simulationResult
}) => {
  const prediction = experiment.prediction;
  const selectedOption = prediction.options.find(o => o.id === selectedOptionId);
  const hasSimulated = simulationResult !== null;

  // Determine actual predominant outcome from simulation
  const getActualOutcomeSummary = (): string => {
    if (!simulationResult) return 'Not yet simulated';
    const probs = simulationResult.probabilities;
    const entries = Object.entries(probs).sort((a, b) => b[1] - a[1]);

    if (entries.length === 1) {
      return `100% state |${entries[0][0]}⟩`;
    }

    if (entries.length === 2 && Math.abs(entries[0][1] - entries[1][1]) < 0.15) {
      return `Balanced distribution: ~${(entries[0][1] * 100).toFixed(0)}% |${entries[0][0]}⟩ / ~${(entries[1][1] * 100).toFixed(0)}% |${entries[1][0]}⟩`;
    }

    const top = entries.slice(0, 2).map(([k, v]) => `|${k}⟩ ${(v * 100).toFixed(0)}%`).join(', ');
    return `Measured: ${top}`;
  };

  const isPredictionCorrect = selectedOption ? selectedOption.isExpected : false;

  return (
    <Card variant="default" className="overflow-hidden" data-testid="prediction-card">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <CardTitle className="text-sm sm:text-base">
            Step 1: Predict Before Running
          </CardTitle>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[var(--fg-muted)]">
          Hypothesis Testing
        </span>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Question Prompt */}
        <div className="text-xs sm:text-sm font-semibold text-[var(--fg-main)] leading-relaxed">
          {prediction.question}
        </div>

        {/* Multiple Choice Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {prediction.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
                  isSelected
                    ? 'bg-sciteal-500/15 border-sciteal-600 dark:border-sciteal-400 text-sciteal-900 dark:text-sciteal-100 font-semibold ring-1 ring-sciteal-500/30'
                    : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-main)] hover:border-sciteal-500/50 hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <span className="flex-1">{option.label}</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isSelected 
                    ? 'border-sciteal-600 bg-sciteal-600 text-white' 
                    : 'border-[var(--border-card)] bg-[var(--surface-card)]'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Status / Feedback Area */}
        {!selectedOption && !hasSimulated && (
          <p className="text-[11px] text-[var(--fg-muted)] italic">
            Select a prediction above before running your circuit. Making hypotheses deepens your intuitive quantum model!
          </p>
        )}

        {selectedOption && !hasSimulated && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-2">
            <span className="text-[var(--fg-main)]">
              Prediction locked in: <span className="font-semibold">{selectedOption.label}</span>
            </span>
            <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1 font-bold whitespace-nowrap">
              <span>Ready to Run</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

        {/* Post-Simulation Result & Comparison */}
        {hasSimulated && (
          <div className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-200 ${
            selectedOption && isPredictionCorrect
              ? 'bg-emerald-500/15 border-emerald-500/40 text-[var(--fg-main)]'
              : 'bg-sciteal-500/10 border-sciteal-500/30 text-[var(--fg-main)]'
          }`}>
            <div className="flex items-center justify-between border-b border-[var(--border-card)]/40 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                {selectedOption && isPredictionCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Hypothesis Confirmed!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                    <span>Experimental Observation</span>
                  </>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted)]">
                Prediction vs Actual
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)]">
                <div className="text-[10px] font-mono text-[var(--fg-muted)] uppercase">Your Prediction:</div>
                <div className="font-semibold text-[var(--fg-main)] mt-0.5">
                  {selectedOption ? selectedOption.label : 'No prediction selected'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)]">
                <div className="text-[10px] font-mono text-[var(--fg-muted)] uppercase">Actual Simulation:</div>
                <div className="font-semibold text-[var(--fg-main)] mt-0.5">
                  {getActualOutcomeSummary()}
                </div>
              </div>
            </div>

            {selectedOption && (
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed pt-1">
                {isPredictionCorrect ? (
                  selectedOption.feedback
                ) : (
                  <>
                    Your prediction differed from the simulation result. That is completely okay — this is how quantum intuition is built! {selectedOption.feedback}
                  </>
                )}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
