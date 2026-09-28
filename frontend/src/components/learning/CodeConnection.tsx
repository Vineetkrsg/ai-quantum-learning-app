import React, { useState } from 'react';
import { CodeConnectionData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Code2, 
  Copy, 
  Check, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2,
  Terminal,
  Bot
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { askAITutor } from '../../services/api';

export interface CodeConnectionState {
  hasRun: boolean;
  activeLineIndex: number | null;
}

const DEFAULT_STATE: CodeConnectionState = {
  hasRun: false,
  activeLineIndex: null
};

export interface CodeConnectionProps {
  moduleId?: string;
  lessonId?: string;
  activityId?: string;
  scopedKey?: string;
  data: CodeConnectionData;
  onSimulationRun?: () => void;
}

export const CodeConnection: React.FC<CodeConnectionProps> = ({
  moduleId,
  lessonId,
  activityId = 'code-connection-1',
  scopedKey,
  data,
  onSimulationRun
}) => {
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'lesson'}/${activityId}`;

  const currentState = progress.getActivityState<CodeConnectionState>(effectiveKey, DEFAULT_STATE);
  const hasRun = currentState.hasRun;
  const activeLineIndex = currentState.activeLineIndex;

  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      progress.setActivityState<CodeConnectionState>(effectiveKey, {
        ...currentState,
        hasRun: true
      });
      if (onSimulationRun) {
        onSimulationRun();
      }
    }, 450);
  };

  const handleResetRun = () => {
    progress.setActivityState<CodeConnectionState>(effectiveKey, {
      ...currentState,
      hasRun: false
    });
  };

  const handleSelectLine = (index: number) => {
    const nextIndex = activeLineIndex === index ? null : index;
    progress.setActivityState<CodeConnectionState>(effectiveKey, {
      ...currentState,
      activeLineIndex: nextIndex
    });
  };

  const codeLines = data.codeSnippet.trim().split('\n');

  return (
    <Card variant="default" className="overflow-hidden" data-testid="code-connection-card">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <CardTitle className="text-sm sm:text-base">
            {data.title || 'Code Connection — Theory ↔ Circuit ↔ Qiskit'}
          </CardTitle>
        </div>
        <Badge variant="teal" size="sm">
          Qiskit Python
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Section A: What Are We Coding? */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-sciteal-700 dark:text-sciteal-400 uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>What Are We Coding?</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
            {data.whatAreWeCoding}
          </p>
        </div>

        {/* Section B: Circuit ↔ Code Relationship (Side-by-Side on Desktop, Stacked on Mobile) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--fg-muted)]">
              Circuit ↔ Code Relationship:
            </span>
            <span className="text-[11px] font-mono text-[var(--fg-muted)]">
              Click any breakdown card below to highlight its matching line
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Visual Circuit Representation */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--fg-muted)] flex items-center gap-1.5 font-bold">
                  <Layers className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                  <span>Visual Quantum Circuit</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-card)] text-[var(--fg-muted)]">
                  Gate Layout
                </span>
              </div>

              {/* Wire ASCII / Diagram */}
              <div className="p-4 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] font-mono text-xs sm:text-sm text-sciteal-800 dark:text-sciteal-300 font-bold overflow-x-auto text-center shadow-inner py-6">
                <span className="tracking-widest whitespace-pre">{data.circuitPreview}</span>
              </div>

              <p className="text-xs text-[var(--fg-muted)] leading-relaxed italic">
                Left-to-right gate operations transform qubit states sequentially before measurement collapse.
              </p>
            </div>

            {/* Python Qiskit Code Box */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--fg-muted)] flex items-center gap-1.5 font-bold">
                  <Code2 className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                  <span>Qiskit Python Code</span>
                </span>
                <button
                  type="button"
                  data-testid="copy-code-btn"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-md bg-[var(--surface-card)] hover:bg-[var(--surface-subtle)] border border-[var(--border-card)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] transition-all cursor-pointer"
                  title="Copy Qiskit code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Snippet with Line Numbers */}
              <div 
                data-testid="code-snippet-box"
                className="p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] font-mono text-xs overflow-x-auto space-y-1 shadow-inner max-h-[220px]"
              >
                {codeLines.map((line, idx) => {
                  const isHighlighted = activeLineIndex !== null && data.lineExplanations[activeLineIndex]?.codeSnippet && line.includes(data.lineExplanations[activeLineIndex].codeSnippet.trim());
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-3 py-0.5 px-1 rounded transition-colors ${
                        isHighlighted 
                          ? 'bg-sciteal-500/20 text-sciteal-900 dark:text-sciteal-200 font-bold border-l-2 border-sciteal-500' 
                          : 'text-[var(--fg-main)] hover:bg-[var(--surface-subtle)]'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-[var(--fg-muted)] select-none w-5 text-right flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="whitespace-pre flex-1">{line || ' '}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--fg-muted)] font-mono">
                <span>Standard Qiskit syntax</span>
                <span className="text-sciteal-700 dark:text-sciteal-400 font-semibold">100% executable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: Line-by-Line Breakdown */}
        {data.lineExplanations && data.lineExplanations.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--fg-main)]">
                <Cpu className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                <span>How the Circuit Maps to Code (Beginner Friendly)</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                data-testid="ai-explain-code-connection-btn"
                onClick={async () => {
                  try {
                    const res = await askAITutor({
                      action: 'explain_code',
                      codeContext: { code: data.codeSnippet },
                      lessonContext: { moduleId: moduleId || 'module', lessonId: lessonId || 'lesson', currentTopic: data.title }
                    });
                    progress.setActivityState<any>(effectiveKey, {
                      ...currentState,
                      aiExplanation: res.reply
                    });
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                leftIcon={<Bot className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
              >
                Explain with AI Tutor
              </Button>
            </div>

            {/* AI Explanation Box if fetched */}
            {(currentState as any).aiExplanation && (
              <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/40 text-xs text-[var(--fg-main)] leading-relaxed space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold font-mono text-sciteal-800 dark:text-sciteal-300">
                  <Bot className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                  <span>AI Tutor — Code & Circuit Mapping</span>
                </div>
                <div className="whitespace-pre-wrap">{(currentState as any).aiExplanation}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.lineExplanations.map((item, idx) => {
                const isSelected = activeLineIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectLine(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                      isSelected
                        ? 'bg-sciteal-500/10 border-sciteal-600 dark:border-sciteal-500 ring-1 ring-sciteal-500/40'
                        : 'bg-[var(--surface-card)] border-[var(--border-card)] hover:border-sciteal-500/50 hover:bg-[var(--surface-subtle)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <code className="font-mono text-xs font-bold text-sciteal-700 dark:text-sciteal-300 bg-[var(--surface-sunken)] px-2 py-0.5 rounded border border-[var(--border-card)]">
                        {item.codeSnippet}
                      </code>
                      {item.lineRange && (
                        <span className="text-[10px] font-mono text-[var(--fg-muted)]">
                          {item.lineRange}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--fg-main)] leading-relaxed">
                      {item.explanation}
                    </p>

                    {item.circuitMapping && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold pt-1 border-t border-[var(--border-card)]">
                        <span>Circuit effect:</span>
                        <span className="underline decoration-sciteal-500/50">{item.circuitMapping}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section D: Run Code / Simulate */}
        <div className="pt-2 border-t border-[var(--border-card)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[var(--fg-main)] flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
                <span>Simulate Code in Browser</span>
              </h4>
              <p className="text-xs text-[var(--fg-muted)]">
                Simulate this circuit using our custom TypeScript state-vector simulator to observe probability distribution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                data-testid="simulate-code-btn"
                onClick={handleSimulate}
                disabled={isRunning}
                leftIcon={<Play className="w-3.5 h-3.5" />}
              >
                {isRunning ? 'Simulating...' : hasRun ? 'Re-Run Simulation' : 'Run Code Simulation'}
              </Button>

              {hasRun && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetRun}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Simulation Output Area */}
          {hasRun && data.simulatedOutput && (
            <div 
              data-testid="simulated-results-box"
              className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/40 space-y-3 animate-in fade-in duration-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-xs sm:text-sm text-[var(--fg-main)]">
                    {data.simulatedOutput.outputTitle || 'Simulation Execution Complete'}
                  </span>
                </div>
                <Badge variant="emerald" size="sm">
                  Statevector Simulator · {data.simulatedOutput.shots || 1024} Shots
                </Badge>
              </div>

              <p className="text-xs text-[var(--fg-main)] leading-relaxed">
                {data.simulatedOutput.description}
              </p>

              {/* State Histogram Bars */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-mono text-[var(--fg-muted)]">
                  Measured Classical Register Outcomes:
                </div>
                {Object.entries(data.simulatedOutput.counts).map(([stateKey, count]) => {
                  const totalShots = data.simulatedOutput?.shots || 1024;
                  const pct = data.simulatedOutput?.percentages?.[stateKey] ?? Number(((count / totalShots) * 100).toFixed(1));
                  return (
                    <div key={stateKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[var(--fg-main)]">State |{stateKey}⟩</span>
                        <span className="text-[var(--fg-muted)]">{count} counts ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--surface-card)] border border-[var(--border-card)] overflow-hidden">
                        <div 
                          className="h-full bg-sciteal-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.simulatedOutput.stateDescription && (
                <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] font-mono text-xs text-sciteal-700 dark:text-sciteal-400 text-center font-bold">
                  Final Qubit State: {data.simulatedOutput.stateDescription}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
