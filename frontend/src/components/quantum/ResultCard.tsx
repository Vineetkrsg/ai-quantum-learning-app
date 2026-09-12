import React from 'react';
import { SimulationResult } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BarChart3, Clock, Zap, CheckCircle2, Sparkles } from 'lucide-react';

interface ResultCardProps {
  result: SimulationResult | null;
  isLoading?: boolean;
  onExplainWithAI?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, isLoading = false, onExplainWithAI }) => {
  if (isLoading) {
    return (
      <Card variant="default" className="p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-10 h-10 border-2 border-teal-600 dark:border-teal-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-900 dark:text-[#e6edf4]">Simulating Circuit via Qiskit Aer Engine...</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculating state vector & sampling projective measurements</p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card variant="default" className="p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
        <BarChart3 className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-2" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No Simulation Data Yet</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Place gates on the circuit canvas and click "Run Circuit" to observe quantum state probabilities.
        </p>
      </Card>
    );
  }

  const entries = Object.entries(result.probabilities);

  return (
    <Card variant="default">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-sm">
            <BarChart3 className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            <span>Measurement Probabilities & State Counts</span>
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>{result.shots} Shots</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>{result.executionTimeMs} ms</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulation Converged</span>
            </span>
          </div>
        </div>

        {onExplainWithAI && (
          <button
            onClick={onExplainWithAI}
            className="text-xs px-3 py-1.5 rounded-lg bg-sciteal-500/10 hover:bg-sciteal-500/20 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Explain with AI</span>
          </button>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-3">
        {/* Probability Bars */}
        <div className="space-y-3">
          {entries.map(([state, prob]) => {
            const count = result.counts[state] || Math.round(prob * result.shots);
            const percentage = (prob * 100).toFixed(1);

            return (
              <div key={state} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-[#111823] px-2 py-0.5 rounded border border-teal-200 dark:border-[#223043]">
                    |{state}⟩
                  </span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-500 dark:text-slate-400">{count} counts</span>
                    <span className="text-slate-900 dark:text-[#e6edf4] font-semibold">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-[#111823] h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-[#223043]">
                  <div
                    className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

