import React from 'react';
import { SimulationResult, GuidedExperiment, Circuit } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BarChart3, 
  HelpCircle, 
  Sparkles, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Info,
  Layers,
  Bot
} from 'lucide-react';

interface ExpectedVsActualProps {
  result: SimulationResult | null;
  experiment?: GuidedExperiment | null;
  circuit: Circuit;
  isLoading?: boolean;
  onExplainWhy?: () => void;
  onExplainCircuit?: () => void;
}

export const ExpectedVsActual: React.FC<ExpectedVsActualProps> = ({
  result,
  experiment,
  circuit,
  isLoading = false,
  onExplainWhy,
  onExplainCircuit
}) => {
  if (isLoading) {
    return (
      <Card variant="default" className="p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-9 h-9 border-2 border-sciteal-600 dark:border-sciteal-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-[var(--fg-main)]">Simulating Quantum State Vector Evolution...</p>
        <p className="text-xs text-[var(--fg-muted)] mt-1">Evaluating unitary matrices & sampling projective measurements</p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card variant="default" className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
        <BarChart3 className="w-10 h-10 text-[var(--fg-muted)] mb-2 opacity-50" />
        <p className="text-sm font-medium text-[var(--fg-main)]">Awaiting Simulation</p>
        <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-sm">
          Place your gates on the circuit wires and click "Run Circuit" to execute statevector calculation and projective sampling.
        </p>
      </Card>
    );
  }

  const entries = Object.entries(result.probabilities).sort((a, b) => b[1] - a[1]);
  const theoreticalEntries = result.theoreticalProbabilities || {};

  return (
    <Card variant="default" className="overflow-hidden" data-testid="expected-vs-actual-card">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>Measurement Results & Theoretical Fidelity</span>
          </CardTitle>
          <div className="flex items-center gap-2.5 text-xs text-[var(--fg-muted)] mt-1 font-mono">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span>{result.shots} Shots</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
              <span>{result.executionTimeMs} ms</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Custom Statevector Simulator</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onExplainCircuit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExplainCircuit}
              leftIcon={<Layers className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Explain Circuit
            </Button>
          )}

          {onExplainWhy && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExplainWhy}
              leftIcon={<Bot className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
              className="text-xs"
            >
              Why Did This Happen?
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Probability Bars: Measured vs Expected */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--fg-muted)] pb-1 border-b border-[var(--border-card)]">
            <span>State Basis |ψ⟩</span>
            <div className="flex items-center gap-4">
              <span>Expected Theoretical</span>
              <span>Actual Measured (Shots)</span>
            </div>
          </div>

          {entries.map(([state, prob]) => {
            const count = result.counts[state] || Math.round(prob * result.shots);
            const actualPct = (prob * 100).toFixed(1);
            const expProb = theoreticalEntries[state] ?? prob;
            const expectedPct = (expProb * 100).toFixed(1);

            return (
              <div key={state} className="space-y-1.5 p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-sciteal-800 dark:text-sciteal-300 bg-[var(--surface-card)] px-2 py-0.5 rounded border border-[var(--border-card)]">
                    |{state}⟩
                  </span>

                  <div className="flex items-center gap-4 font-mono text-xs">
                    <span className="text-[var(--fg-muted)] text-[11px]">
                      Theory: {expectedPct}%
                    </span>
                    <span className="text-[var(--fg-main)] font-semibold">
                      {count} counts ({actualPct}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar with Dual Visual: Theoretical marker vs Actual fill */}
                <div className="w-full bg-[var(--surface-card)] h-3 rounded-full overflow-hidden border border-[var(--border-card)] relative">
                  <div
                    className="h-full bg-sciteal-600 dark:bg-sciteal-500 rounded-full transition-all duration-300 shadow-xs"
                    style={{ width: `${actualPct}%` }}
                  />
                  {/* Theoretical marker tick */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
                    style={{ left: `${expectedPct}%` }}
                    title={`Theoretical target: ${expectedPct}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Section: Expected vs Actual Explanation */}
        <div className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--fg-main)]">
            <Info className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
            <span>Understanding Expected vs Actual Differences</span>
          </div>
          <p className="text-[var(--fg-muted)] leading-relaxed">
            Theoretical probability is determined by exact state amplitudes $|c_i|^2$ (indicated by the amber tick).
            Actual measurement samples finite projective shots ({result.shots} runs), demonstrating the statistical
            quantum shot noise observed on real physical quantum processors.
          </p>
        </div>

        {/* Section: Result Interpretation (What happened?) */}
        <div className="p-3.5 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-sciteal-800 dark:text-sciteal-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
            <span>What Happened in the Circuit?</span>
          </div>
          <p className="text-[var(--fg-main)] leading-relaxed">
            {experiment?.interpretation || (
              circuit.gates.length === 0
                ? 'All qubits remained in the computational ground state |0⟩, yielding 100% 0 outcome.'
                : `The sequence of ${circuit.gates.length} quantum operations transformed the initial ground state into the observed superposition distribution.`
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
