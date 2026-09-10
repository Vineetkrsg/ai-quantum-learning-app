import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Cpu, RotateCcw, X, Plus, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export interface CircuitPracticeState {
  gates: string[];
  isCompleted?: boolean;
}

export interface CircuitPracticeProps {
  moduleId: string;
  lessonId: string;
  activityId?: string;
  scopedKey?: string;
  title?: string;
  instruction?: string;
  initialCircuit?: string[];
  availableGates?: string[];
  onComplete?: () => void;
}

const DEFAULT_GATES = ['H', 'X', 'Y', 'Z', 'M'];

export const CircuitPractice: React.FC<CircuitPracticeProps> = ({
  moduleId,
  lessonId,
  activityId = 'circuit-practice-1',
  scopedKey,
  title = 'Interactive Circuit Practice',
  instruction = 'Add or modify quantum gates on the circuit wire. Test how the operations transform the qubit state.',
  initialCircuit = [],
  availableGates = DEFAULT_GATES,
  onComplete
}) => {
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'lesson'}/${activityId}`;

  const defaultState: CircuitPracticeState = {
    gates: [...initialCircuit],
    isCompleted: false
  };

  const currentState = progress.getActivityState<CircuitPracticeState>(effectiveKey, defaultState);
  const gates = currentState?.gates ?? [...initialCircuit];

  const handleAddGate = (symbol: string) => {
    if (gates.length >= 6) return; // Wire capacity
    const updated = [...gates, symbol];
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      gates: updated,
      isCompleted: true
    });
    if (onComplete) onComplete();
  };

  const handleRemoveGate = (index: number) => {
    const updated = gates.filter((_, i) => i !== index);
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      gates: updated
    });
  };

  const handleReset = () => {
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      gates: [...initialCircuit],
      isCompleted: false
    });
  };

  const handleClear = () => {
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      gates: [],
      isCompleted: false
    });
  };

  // Compute conceptual output state description
  const computeStateDescription = (gateList: string[]): string => {
    if (gateList.length === 0) return '|0⟩ (Ground State)';
    const lastGate = gateList[gateList.length - 1];
    if (lastGate === 'H') return '1/√2 (|0⟩ + |1⟩) [Superposition]';
    if (lastGate === 'X') return '|1⟩ (Excited State)';
    if (lastGate === 'Z') return '|0⟩ (Phase Invariant on Ground)';
    if (lastGate === 'M') return 'Classical Bit Readout (0 or 1)';
    return `Transformed via [${gateList.join(' → ')}]`;
  };

  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
        </div>
        <Badge variant="teal" size="sm">
          Circuit Practice
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
          {instruction}
        </p>

        {/* Quantum Wire Canvas */}
        <div data-testid="circuit-wire-canvas" className="p-5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] overflow-x-auto shadow-inner">
          <div className="flex items-center gap-3 min-w-[380px] relative py-2">
            {/* Qubit Label */}
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-sciteal-700 dark:text-sciteal-400 flex-shrink-0 z-10 bg-[var(--surface-card)] px-2.5 py-1.5 rounded-lg border border-[var(--border-card)] shadow-xs">
              <span>q[0]</span>
              <span className="text-[10px] text-[var(--fg-muted)]">|0⟩</span>
            </div>

            {/* Continuous Wire Line */}
            <div className="flex-1 flex items-center relative min-h-[52px]">
              <div className="absolute left-0 right-0 h-[2px] bg-[var(--circuit-wire)] pointer-events-none" />

              {/* Placed Gates along the wire */}
              <div data-testid="circuit-wire" className="flex items-center gap-3 relative z-10 px-2 flex-wrap sm:flex-nowrap">
                {gates.map((symbol, idx) => (
                  <div
                    key={`${idx}-${symbol}`}
                    data-testid={`placed-gate-item-${idx}`}
                    className="group relative flex items-center justify-center"
                  >
                    <div
                      data-testid={`placed-gate-${symbol}`}
                      className="w-11 h-11 rounded-lg bg-[var(--surface-card)] border-2 border-sciteal-600 dark:border-sciteal-500 text-sciteal-800 dark:text-sciteal-200 font-mono font-bold text-sm flex items-center justify-center shadow-sm"
                    >
                      {symbol}
                    </div>
                    {/* Remove button on hover / focus */}
                    <button
                      type="button"
                      data-testid={`remove-gate-${idx}`}
                      title={`Remove ${symbol} gate`}
                      aria-label={`Remove ${symbol} gate at position ${idx + 1}`}
                      onClick={() => handleRemoveGate(idx)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Empty slot / placeholder if empty */}
                {gates.length === 0 && (
                  <div data-testid="empty-wire-placeholder" className="h-11 px-3 rounded-lg border-2 border-dashed border-[var(--circuit-wire)] text-[var(--fg-muted)] text-xs flex items-center justify-center bg-[var(--surface-card)]/50 font-mono">
                    Wire empty — select a gate below to place
                  </div>
                )}
              </div>
            </div>

            {/* Readout symbol */}
            <div className="flex-shrink-0 font-mono text-xs text-[var(--fg-muted)] z-10 bg-[var(--surface-card)] px-2 py-1 rounded border border-[var(--border-card)]">
              ⊚ Readout
            </div>
          </div>
        </div>

        {/* State Transformation Preview */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400 flex-shrink-0" />
            <span className="text-[var(--fg-muted)]">Predicted Output State:</span>
            <span data-testid="predicted-output-state" className="font-mono font-bold text-[var(--fg-main)]">
              {computeStateDescription(gates)}
            </span>
          </div>
          <span className="font-mono text-[11px] text-[var(--fg-muted)]">
            Gates on Wire: {gates.length} / 6
          </span>
        </div>

        {/* Gate Palette & Placement Controls */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[var(--fg-muted)]">
            Click to Place Gate on Wire:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {availableGates.map((gateSymbol) => (
              <button
                key={gateSymbol}
                type="button"
                data-testid={`gate-btn-${gateSymbol}`}
                aria-label={`Add ${gateSymbol} gate to circuit wire`}
                onClick={() => handleAddGate(gateSymbol)}
                disabled={gates.length >= 6}
                className="px-3.5 py-2 rounded-xl border border-[var(--border-card)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] hover:border-sciteal-500/60 text-[var(--fg-main)] font-mono font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
                <span>[{gateSymbol} Gate]</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)]">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              data-testid="reset-circuit-btn"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset to Default
            </Button>
            {gates.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                data-testid="clear-circuit-btn"
                onClick={handleClear}
              >
                Clear Wire
              </Button>
            )}
          </div>

          <div className="text-[11px] font-mono text-[var(--fg-muted)]">
            Scoped Activity: <span data-testid="scoped-activity-key" className="text-sciteal-700 dark:text-sciteal-400 font-bold">{effectiveKey}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
