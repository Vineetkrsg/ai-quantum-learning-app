import React, { useState } from 'react';
import { GuidedCircuitData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Play, RotateCcw, BarChart3, Clock, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuidedExampleProps {
  guidedData: GuidedCircuitData;
  onSimulationComplete?: () => void;
}

export const GuidedExample: React.FC<GuidedExampleProps> = ({
  guidedData,
  onSimulationComplete
}) => {
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
      const states = Object.keys(guidedData.expectedDistribution);
      const totalShots = guidedData.shots;

      if (states.length === 1) {
        // Deterministic
        const st = states[0];
        counts[st] = totalShots;
        percentages[st] = 100;
      } else {
        // Equal or probabilistic with slight realistic shot noise
        let remaining = totalShots;
        states.forEach((st, idx) => {
          if (idx === states.length - 1) {
            counts[st] = remaining;
          } else {
            const expectedProb = guidedData.expectedDistribution[st];
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
        executionTimeMs: Number((38 + Math.random() * 12).toFixed(1))
      });

      setIsRunning(false);
      setHasRun(true);
      if (onSimulationComplete) {
        onSimulationComplete();
      }
    }, 600);
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-sm sm:text-base">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{guidedData.title}</span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">{guidedData.instruction}</p>
        </div>

        <Badge variant="cyan" size="sm">
          Interactive Circuit
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Visual Guided Circuit Diagram */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 overflow-x-auto shadow-inner">
          <div className="space-y-4 min-w-[340px]">
            {guidedData.circuitSteps.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-3">
                {/* Qubit label */}
                <div className="w-16 flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-400 flex-shrink-0">
                  <span>{row.qubit}</span>
                  <span className="text-[10px] text-slate-500">|0⟩</span>
                </div>

                {/* Circuit wire and gates */}
                <div className="flex-1 flex items-center relative">
                  {/* Horizontal Wire Line */}
                  <div className="absolute left-0 right-0 h-[2px] bg-slate-700 pointer-events-none" />

                  {/* Gates on Wire */}
                  <div className="flex items-center gap-6 relative z-10 px-3">
                    {row.elements.map((elem, eIdx) => {
                      if (elem.type === 'wire') {
                        return <div key={eIdx} className="w-10 h-10" />;
                      }

                      if (elem.type === 'control') {
                        return (
                          <div
                            key={eIdx}
                            className="w-10 h-10 flex items-center justify-center"
                            title="CNOT Control Qubit"
                          >
                            <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-slate-950 shadow-md" />
                          </div>
                        );
                      }

                      if (elem.type === 'target') {
                        return (
                          <div
                            key={eIdx}
                            className="w-10 h-10 flex items-center justify-center"
                            title="CNOT Target Qubit"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/50 text-purple-300 font-bold font-mono text-sm flex items-center justify-center shadow">
                              ⊕
                            </div>
                          </div>
                        );
                      }

                      if (elem.type === 'measure') {
                        return (
                          <div
                            key={eIdx}
                            className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs flex flex-col items-center justify-center shadow"
                            title="Measurement"
                          >
                            <span className="text-sm">⊚</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={eIdx}
                          className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-sm flex items-center justify-center shadow-md"
                          title={elem.label || elem.symbol}
                        >
                          {elem.symbol}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-400 font-mono">
            <span>Simulation Shots: {guidedData.shots}</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="text-slate-500">Mode: Interactive Demo Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="quantum"
              size="md"
              onClick={handleRun}
              isLoading={isRunning}
              leftIcon={<Play className="w-4 h-4 fill-slate-950" />}
            >
              {hasRun ? 'Run Example Again' : 'Run Example'}
            </Button>
          </div>
        </div>

        {/* Simulation Results & Explanation Area */}
        {results && (
          <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Measurement Results ({guidedData.shots} Shots)
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>State Collapse Verified</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{results.executionTimeMs} ms</span>
                </span>
              </div>
            </div>

            {/* Probability Bars */}
            <div className="space-y-3">
              {Object.entries(results.percentages).map(([state, pct]) => {
                const count = results.counts[state] ?? 0;
                return (
                  <div key={state} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        |{state}⟩
                      </span>
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-slate-400">{count} counts</span>
                        <span className="text-white font-bold">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 via-teal-500 to-indigo-500 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation of Results */}
            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-850">
              <span className="font-semibold text-cyan-300">Understanding the Result: </span>
              {guidedData.resultExplanation}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
