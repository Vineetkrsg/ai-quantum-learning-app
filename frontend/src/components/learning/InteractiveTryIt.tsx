import React, { useState } from 'react';
import { InteractiveTryData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Play, RotateCcw, BarChart3, Clock, CheckCircle2, HelpCircle, Cpu, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractiveTryItProps {
  data: InteractiveTryData;
  onRunSuccess?: () => void;
}

export const InteractiveTryIt: React.FC<InteractiveTryItProps> = ({
  data,
  onRunSuccess
}) => {
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [results, setResults] = useState<{
    counts: Record<string, number>;
    percentages: Record<string, number>;
    executionTimeMs: number;
  } | null>(null);

  const navigate = useNavigate();

  const handleRun = () => {
    setIsRunning(true);

    setTimeout(() => {
      const counts: Record<string, number> = {};
      const percentages: Record<string, number> = {};
      const states = Object.keys(data.expectedDistribution);
      const totalShots = data.shots;

      if (states.length === 1) {
        const st = states[0];
        counts[st] = totalShots;
        percentages[st] = 100;
      } else {
        let remaining = totalShots;
        states.forEach((st, idx) => {
          if (idx === states.length - 1) {
            counts[st] = remaining;
          } else {
            const expectedProb = data.expectedDistribution[st] / 100;
            const noise = Math.floor(Math.random() * 21) - 10;
            const c = Math.max(0, Math.round(totalShots * expectedProb) + noise);
            counts[st] = c;
            remaining -= c;
          }
          percentages[st] = Number(((counts[st] / totalShots) * 100).toFixed(1));
        });
      }

      setResults({
        counts,
        percentages,
        executionTimeMs: Number((35 + Math.random() * 15).toFixed(1))
      });

      setIsRunning(false);
      setHasRun(true);
      if (onRunSuccess) {
        onRunSuccess();
      }
    }, 550);
  };

  const handleReset = () => {
    setSelectedPredictionId(null);
    setHasRun(false);
    setResults(null);
  };

  const selectedPrediction = data.predictionOptions.find((p) => p.id === selectedPredictionId);

  return (
    <Card variant="glass" className="overflow-hidden border-cyan-500/40">
      <CardHeader className="pb-3 border-b border-slate-300/80 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base">{data.title}</CardTitle>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{data.instruction}</p>
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          Interactive Activity
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Circuit Diagram Preview */}
        <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 dark:border-slate-800/80 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-sans">
            Circuit Blueprint
          </div>
          <div className="p-2 rounded bg-slate-950/90 dark:bg-slate-900/90 border border-slate-800 font-bold whitespace-pre">
            {data.circuitPreview}
          </div>
        </div>

        {/* Prediction Question Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{data.predictionPrompt}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.predictionOptions.map((opt) => {
              const isSelected = selectedPredictionId === opt.id;
              let btnStyle = 'bg-slate-100 dark:bg-slate-900/80 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-850';

              if (hasRun) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-300';
                }
              } else if (isSelected) {
                btnStyle = 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-500 text-cyan-900 dark:text-cyan-200 font-semibold shadow-sm shadow-cyan-500/10';
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasRun}
                  onClick={() => setSelectedPredictionId(opt.id)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt.text}</span>
                  {hasRun && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Run / Reset Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-300/80 dark:border-slate-800/60">
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-500">
            Shots: {data.shots} • Simulated Engine
          </span>

          <div className="flex items-center gap-2">
            {hasRun && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset
              </Button>
            )}

            <Button
              variant="quantum"
              size="sm"
              onClick={handleRun}
              isLoading={isRunning}
              disabled={!selectedPredictionId}
              leftIcon={<Play className="w-3.5 h-3.5 fill-slate-950" />}
            >
              {hasRun ? 'Run Again' : 'Run Example'}
            </Button>
          </div>
        </div>

        {/* Results & Explanation */}
        {results && (
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-300/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Observed Measurement Results ({data.shots} Shots)
                </span>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-500 font-mono">
                {results.executionTimeMs} ms
              </span>
            </div>

            {/* Bars */}
            <div className="space-y-2.5">
              {Object.entries(results.percentages).map(([state, pct]) => {
                const count = results.counts[state] ?? 0;
                return (
                  <div key={state} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-cyan-800 dark:text-cyan-300 bg-slate-200 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-800">
                        |{state}⟩
                      </span>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-slate-600 dark:text-slate-400">{count} counts</span>
                        <span className="text-slate-900 dark:text-white font-bold">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation of WHY */}
            <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
              <div className="font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Why This Happened:</span>
              </div>
              <p>{data.whyExplanation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
