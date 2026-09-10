import React, { useState } from 'react';
import { InteractiveTryData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Play, RotateCcw, BarChart3, Clock, CheckCircle2, HelpCircle, Cpu, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';

export interface InteractiveTryState {
  selectedPredictionId: string | null;
  hasRun: boolean;
  results: {
    counts: Record<string, number>;
    percentages: Record<string, number>;
    executionTimeMs: number;
  } | null;
}

const DEFAULT_STATE: InteractiveTryState = {
  selectedPredictionId: null,
  hasRun: false,
  results: null
};

interface InteractiveTryItProps {
  moduleId?: string;
  lessonId?: string;
  activityId?: string;
  scopedKey?: string;
  data: InteractiveTryData;
  onRunSuccess?: () => void;
}

export const InteractiveTryIt: React.FC<InteractiveTryItProps> = ({
  moduleId,
  lessonId,
  activityId = 'interactive-try-1',
  scopedKey,
  data,
  onRunSuccess
}) => {
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'lesson'}/${activityId}`;
  const currentState = progress.getActivityState<InteractiveTryState>(effectiveKey, DEFAULT_STATE);

  const selectedPredictionId = currentState.selectedPredictionId;
  const hasRun = currentState.hasRun;
  const results = currentState.results;

  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();

  const handleSelectPrediction = (id: string) => {
    if (hasRun) return;
    progress.setActivityState<InteractiveTryState>(effectiveKey, {
      ...currentState,
      selectedPredictionId: id
    });
  };

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

      const simResults = {
        counts,
        percentages,
        executionTimeMs: Number((35 + Math.random() * 15).toFixed(1))
      };

      progress.setActivityState<InteractiveTryState>(effectiveKey, {
        selectedPredictionId,
        hasRun: true,
        results: simResults
      });

      setIsRunning(false);
      if (onRunSuccess) {
        onRunSuccess();
      }
    }, 550);
  };

  const handleReset = () => {
    progress.setActivityState<InteractiveTryState>(effectiveKey, DEFAULT_STATE);
  };

  const selectedPrediction = data.predictionOptions.find((p) => p.id === selectedPredictionId);

  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-400 flex items-center justify-center font-bold">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <CardTitle className="text-sm sm:text-base">{data.title}</CardTitle>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">{data.instruction}</p>
          </div>
        </div>

        <Badge variant="teal" size="sm">
          Interactive Activity
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Circuit Diagram Preview */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] font-mono text-xs text-[var(--fg-main)] overflow-x-auto shadow-inner">
          <div className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mb-1.5 font-sans font-semibold">
            Circuit Blueprint
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] font-bold whitespace-pre text-[var(--fg-main)]">
            {data.circuitPreview}
          </div>
        </div>

        {/* Prediction Question Section */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--fg-main)]">
            <HelpCircle className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>{data.predictionPrompt}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.predictionOptions.map((opt) => {
              const isSelected = selectedPredictionId === opt.id;
              let btnStyle = 'bg-[var(--surface-subtle)] border-[var(--border-card)] text-[var(--fg-main)] hover:border-[var(--border-highlight)] hover:bg-[var(--surface-hover)]';

              if (hasRun) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-500/10 border-emerald-600 dark:border-emerald-500 text-[var(--fg-main)] font-semibold';
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-500/10 border-rose-600 dark:border-rose-500 text-[var(--fg-main)]';
                }
              } else if (isSelected) {
                btnStyle = 'bg-sciteal-500/10 border-sciteal-600 dark:border-sciteal-500 text-[var(--fg-main)] font-semibold ring-1 ring-sciteal-500/30';
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasRun}
                  onClick={() => handleSelectPrediction(opt.id)}
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
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[var(--border-card)]">
          <span className="text-[11px] font-mono text-[var(--fg-muted)]">
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
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              {hasRun ? 'Run Again' : 'Run Example'}
            </Button>
          </div>
        </div>

        {/* Results & Explanation */}
        {results && (
          <div className="p-5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--border-card)]">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                <span className="text-xs font-semibold text-[var(--fg-main)]">
                  Observed Measurement Results ({data.shots} Shots)
                </span>
              </div>
              <span className="text-[11px] text-[var(--fg-muted)] font-mono">
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
                      <span className="font-mono font-bold text-[var(--fg-main)] bg-[var(--surface-card)] px-2 py-0.5 rounded border border-[var(--border-card)]">
                        |{state}⟩
                      </span>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-[var(--fg-muted)]">{count} counts</span>
                        <span className="text-[var(--fg-main)] font-bold">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-[var(--surface-subtle)] h-2.5 rounded-full overflow-hidden border border-[var(--border-card)]">
                      <div
                        className="h-full bg-[var(--visualization-bar)] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation of WHY */}
            <div className="p-3.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-xs text-[var(--fg-muted)] leading-relaxed space-y-1">
              <div className="font-semibold text-sciteal-700 dark:text-sciteal-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                <span>Why This Happened:</span>
              </div>
              <p className="text-[var(--fg-main)]">{data.whyExplanation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
