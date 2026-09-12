import React from 'react';
import { SimulationResult } from '../../../types/quantum';
import { Button } from '../../ui/Button';
import { BarChart2, CheckCircle2, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

interface DemoResultViewProps {
  result: SimulationResult | null;
  userPrediction: string | null;
  onProceedToInterference: () => void;
}

export const DemoResultView: React.FC<DemoResultViewProps> = ({
  result,
  userPrediction,
  onProceedToInterference
}) => {
  if (!result) return null;

  const count0 = result.counts['0'] || 0;
  const count1 = result.counts['1'] || 0;
  const total = result.shots || 1024;

  const prob0 = ((count0 / total) * 100).toFixed(1);
  const prob1 = ((count1 / total) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Simulation Results Metric & Histogram */}
      <div className="p-5 rounded-2xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
              Simulation Results (1,024 Shots)
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--fg-muted)]">
            Execution: {result.executionTimeMs.toFixed(1)}ms • Aer Statevector
          </span>
        </div>

        {/* Visual Probability Distribution Bars */}
        <div className="space-y-4 pt-1">
          {/* Outcome |0⟩ */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[var(--fg-main)]">State |0⟩</span>
              <span className="text-sciteal-700 dark:text-sciteal-400 font-bold">
                {prob0}% ({count0} shots)
              </span>
            </div>
            <div className="w-full bg-[var(--surface-card)] h-6 rounded-lg overflow-hidden border border-[var(--border-card)] flex items-center p-0.5">
              <div
                className="bg-teal-600 dark:bg-teal-500 h-full rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white"
                style={{ width: `${Math.max(10, Number(prob0))}%` }}
              >
                {prob0}%
              </div>
            </div>
          </div>

          {/* Outcome |1⟩ */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[var(--fg-main)]">State |1⟩</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">
                {prob1}% ({count1} shots)
              </span>
            </div>
            <div className="w-full bg-[var(--surface-card)] h-6 rounded-lg overflow-hidden border border-[var(--border-card)] flex items-center p-0.5">
              <div
                className="bg-amber-600 dark:bg-amber-500 h-full rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-white"
                style={{ width: `${Math.max(10, Number(prob1))}%` }}
              >
                {prob1}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Cards: What happened & Why did it happen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: What happened? */}
        <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sciteal-700 dark:text-sciteal-300 font-mono">
            <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>1. What Happened?</span>
          </div>
          <p className="text-xs text-[var(--fg-main)] leading-relaxed">
            We ran the experiment 1,024 times. About half of the measurements produced <strong>0</strong> and about half produced <strong>1</strong>.
            The slight difference ({prob0}% vs {prob1}%) is natural quantum statistical shot noise, just like flipping a fair coin 1,024 times.
          </p>
        </div>

        {/* Card 2: Why did it happen? */}
        <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 font-mono">
            <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>2. Why Did It Happen?</span>
          </div>
          <p className="text-xs text-[var(--fg-main)] leading-relaxed">
            The Hadamard (H) gate transformed the qubit from starting state <code>|0⟩</code> into an equal superposition:
            <code className="block mt-1 font-mono text-center text-teal-700 dark:text-teal-300">
              |+⟩ = (|0⟩ + |1⟩) / √2
            </code>
            When measured, quantum amplitudes square into 50% probabilities.
          </p>
        </div>
      </div>

      {/* Action to proceed */}
      <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[var(--fg-main)]">
            Step 5: Change the Experiment
          </h4>
          <p className="text-xs text-[var(--fg-muted)]">
            What happens if we apply a second H gate before measurement?
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onProceedToInterference}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Try Two H Gates (H → H)
        </Button>
      </div>
    </div>
  );
};
