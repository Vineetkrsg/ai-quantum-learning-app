import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Cpu, 
  RotateCcw, 
  X, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Bot, 
  Check, 
  Eye,
  Target
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { askAITutor } from '../../services/api';

export interface CircuitPracticeState {
  gates: string[];
  isSubmitted: boolean;
  isPassed: boolean;
  attempts: number;
  showHint: boolean;
  hintLevel: number;
  showSolution: boolean;
  explanationText?: string;
  aiExplanation?: string;
}

export interface CircuitPracticeProps {
  moduleId: string;
  lessonId: string;
  activityId?: string;
  scopedKey?: string;
  title?: string;
  instruction?: string;
  objective?: string;
  targetOutcome?: string | string[]; // e.g. 'H' or ['H', 'M'] or 'superposition'
  targetDescription?: string;
  hint?: string;
  hints?: string[];
  solutionGates?: string[];
  successExplanation?: string;
  failureExplanation?: string;
  initialCircuit?: string[];
  availableGates?: string[];
  onComplete?: () => void;
  onExplainWithAI?: (circuitSummary: string, gates: string[]) => void;
}

const DEFAULT_GATES = ['H', 'X', 'Y', 'Z', 'M'];

export const CircuitPractice: React.FC<CircuitPracticeProps> = ({
  moduleId,
  lessonId,
  activityId = 'circuit-practice-1',
  scopedKey,
  title = 'Interactive Circuit Practice',
  instruction = 'Add or modify quantum gates on the circuit wire. Test how the operations transform the qubit state.',
  objective,
  targetOutcome,
  targetDescription,
  hint,
  hints,
  solutionGates,
  successExplanation,
  failureExplanation,
  initialCircuit = [],
  availableGates = DEFAULT_GATES,
  onComplete,
  onExplainWithAI
}) => {
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'lesson'}/${activityId}`;

  const defaultState: CircuitPracticeState = {
    gates: [...initialCircuit],
    isSubmitted: false,
    isPassed: false,
    attempts: 0,
    showHint: false,
    hintLevel: 1,
    showSolution: false
  };

  const currentState = progress.getActivityState<CircuitPracticeState>(effectiveKey, defaultState);
  const gates = currentState?.gates ?? [...initialCircuit];
  const isSubmitted = currentState?.isSubmitted ?? false;
  const isPassed = currentState?.isPassed ?? false;
  const attempts = currentState?.attempts ?? 0;
  const showHint = currentState?.showHint ?? false;
  const hintLevel = currentState?.hintLevel ?? 1;
  const showSolution = currentState?.showSolution ?? false;
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  const handleAddGate = (symbol: string) => {
    if (gates.length >= 6) return;
    const updated = [...gates, symbol];
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      gates: updated,
      isSubmitted: false, // Reset submission state on modification
      explanationText: undefined
    });
  };

  const handleRemoveGate = (index: number) => {
    const updated = gates.filter((_, i) => i !== index);
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      gates: updated,
      isSubmitted: false,
      explanationText: undefined
    });
  };

  const handleReset = () => {
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      gates: [...initialCircuit],
      isSubmitted: false,
      isPassed: false,
      attempts: 0,
      showHint: false,
      hintLevel: 1,
      showSolution: false,
      explanationText: undefined,
      aiExplanation: undefined
    });
  };

  const handleClear = () => {
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      gates: [],
      isSubmitted: false,
      explanationText: undefined
    });
  };

  // Evaluate if current gates achieve the target outcome
  const checkCircuitCorrectness = (currentGates: string[]): { isCorrect: boolean; feedback: string } => {
    // 1. Explicit targetOutcome provided
    if (targetOutcome) {
      if (Array.isArray(targetOutcome)) {
        const matchesSequence = currentGates.length === targetOutcome.length && 
          currentGates.every((g, idx) => g.toUpperCase() === targetOutcome[idx].toUpperCase());
        const matchesContains = targetOutcome.every(targetGate => 
          currentGates.map(g => g.toUpperCase()).includes(targetGate.toUpperCase())
        );

        if (matchesSequence || matchesContains) {
          return {
            isCorrect: true,
            feedback: successExplanation || `Correct! Your circuit matches the target sequence [${targetOutcome.join(' → ')}].`
          };
        }
      } else if (typeof targetOutcome === 'string') {
        const normTarget = targetOutcome.toUpperCase();
        if (normTarget === 'SUPERPOSITION') {
          // Check for H gate and no negating H or destructive X immediately after
          const hasH = currentGates.some(g => g.toUpperCase() === 'H');
          const hCount = currentGates.filter(g => g.toUpperCase() === 'H').length;
          if (hasH && hCount % 2 !== 0) {
            return {
              isCorrect: true,
              feedback: successExplanation || 'Excellent! Placing an H gate puts the qubit into equal superposition 1/√2 (|0⟩ + |1⟩).'
            };
          } else if (hCount % 2 === 0 && hCount > 0) {
            return {
              isCorrect: false,
              feedback: 'Notice that applying H twice cancels out back to |0⟩! Remove one of the H gates.'
            };
          }
        } else if (normTarget === 'BELL' || normTarget === 'ENTANGLEMENT') {
          const hasH = currentGates.some(g => g.toUpperCase() === 'H');
          const hasCX = currentGates.some(g => g.toUpperCase() === 'CNOT' || g.toUpperCase() === 'CX');
          if (hasH && hasCX) {
            return {
              isCorrect: true,
              feedback: successExplanation || 'Outstanding! You combined H and CNOT to synthesize the canonical Bell State.'
            };
          }
        } else {
          // Specific gate symbol check
          if (currentGates.map(g => g.toUpperCase()).includes(normTarget)) {
            return {
              isCorrect: true,
              feedback: successExplanation || `Great job! Your circuit correctly applies the [${normTarget} Gate].`
            };
          }
        }
      }
    }

    // Default pedagogical fallback if no targetOutcome explicitly specified
    if (currentGates.length > 0) {
      return {
        isCorrect: true,
        feedback: successExplanation || `Circuit verified! Operations [${currentGates.join(' → ')}] execute as planned: ${computeStateDescription(currentGates)}.`
      };
    }

    return {
      isCorrect: false,
      feedback: failureExplanation || 'The wire is empty. Select a gate from the palette below to begin building your circuit.'
    };
  };

  const handleCheckCircuit = () => {
    const evaluation = checkCircuitCorrectness(gates);
    const newAttempts = attempts + 1;

    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      isSubmitted: true,
      isPassed: evaluation.isCorrect,
      attempts: newAttempts,
      explanationText: evaluation.feedback
    });

    if (evaluation.isCorrect && onComplete) {
      onComplete();
    }
  };

  const handleNextHintTier = () => {
    const nextLevel = Math.min(hintLevel + 1, 3);
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      showHint: true,
      hintLevel: nextLevel
    });
  };

  const handleToggleHint = () => {
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      showHint: !showHint
    });
  };

  const handleRevealSolution = () => {
    progress.setActivityState<CircuitPracticeState>(effectiveKey, {
      ...currentState,
      showSolution: true
    });
  };

  const handleExplainWithAI = async () => {
    if (onExplainWithAI) {
      onExplainWithAI(computeStateDescription(gates), gates);
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await askAITutor({
        action: 'explain_circuit',
        circuitContext: {
          numberOfQubits: 1,
          gateCount: gates.length,
          summary: `Circuit with gates [${gates.join(', ')}] on q[0]`,
          gates: gates.map((g, idx) => ({ gateId: g, targetQubit: 0, position: idx })),
          circuitName: title
        },
        lessonContext: {
          moduleId,
          lessonId,
          lessonTitle: title
        }
      });

      progress.setActivityState<CircuitPracticeState>(effectiveKey, {
        ...currentState,
        aiExplanation: res.reply
      });
    } catch (e) {
      console.warn('AI explanation failed', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Resolve 3-tier hints
  const getActiveHintText = (): string => {
    if (hints && hints.length >= hintLevel) {
      return hints[hintLevel - 1];
    }
    if (hint) {
      if (hintLevel === 1) return `Conceptual Clue: ${hint}`;
      if (hintLevel === 2) return `Specific Guidance: Check which gate creates ${targetDescription || 'the desired rotation'} on qubit 0.`;
      return `Near-solution: Place [${solutionGates?.[0] || 'H'}] on the wire to fulfill this challenge.`;
    }
    if (hintLevel === 1) return 'Think about what transformation is needed from ground state |0⟩.';
    if (hintLevel === 2) return 'Remember: H creates equal superposition (50/50), while X flips |0⟩ to |1⟩.';
    return `Solution hint: Place an [H Gate] to create equal superposition.`;
  };

  return (
    <Card variant="default" className="overflow-hidden" data-testid="circuit-practice-card">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isPassed ? "emerald" : "teal"} size="sm">
            {isPassed ? "Challenge Completed" : "Circuit Practice"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Objective & Instruction */}
        <div className="space-y-2">
          {objective && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)]">
              <Target className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-[var(--fg-main)]">Challenge Objective:</div>
                <p className="text-xs text-[var(--fg-muted)] mt-0.5">{objective}</p>
              </div>
            </div>
          )}
          <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
            {instruction}
          </p>
        </div>

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
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
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

        {/* Action Controls: Check Circuit / AI Explain / Reset / Hints */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-card)]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Check Circuit Submit Button */}
            <Button
              variant="primary"
              size="sm"
              data-testid="check-circuit-btn"
              onClick={handleCheckCircuit}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              {isPassed ? 'Check Circuit Again' : 'Check Circuit'}
            </Button>

            {/* Explain This Circuit with AI */}
            <Button
              variant="secondary"
              size="sm"
              data-testid="explain-circuit-ai-btn"
              onClick={handleExplainWithAI}
              disabled={isAiLoading}
              leftIcon={<Bot className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />}
            >
              {isAiLoading ? 'AI Analyzing...' : 'Explain This Circuit'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              data-testid="reset-circuit-btn"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset
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

          {/* Hint Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="circuit-hint-toggle-btn"
              onClick={handleToggleHint}
              className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Hint Accordion */}
        {showHint && (
          <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-sciteal-800 dark:text-sciteal-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Pedagogical Hint Tier {hintLevel} of 3</span>
              </span>
              {hintLevel < 3 && (
                <button
                  type="button"
                  onClick={handleNextHintTier}
                  className="text-xs text-sciteal-700 dark:text-sciteal-300 hover:underline font-semibold cursor-pointer"
                >
                  Need more help? (Tier {hintLevel + 1}) →
                </button>
              )}
            </div>
            <p className="text-xs text-[var(--fg-main)] leading-relaxed">
              {getActiveHintText()}
            </p>

            {/* Reveal solution option if student tried or is on tier 3 */}
            {hintLevel >= 2 && !showSolution && solutionGates && (
              <div className="pt-2 border-t border-sciteal-500/20 flex justify-end">
                <button
                  type="button"
                  onClick={handleRevealSolution}
                  className="text-[11px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Reveal Solution Circuit</span>
                </button>
              </div>
            )}

            {showSolution && solutionGates && (
              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-sciteal-500/30 text-xs font-mono text-sciteal-700 dark:text-sciteal-300 font-bold">
                Target Solution: [{solutionGates.join(' → ')}]
              </div>
            )}
          </div>
        )}

        {/* Check/Submission Feedback Banner */}
        {isSubmitted && currentState.explanationText && (
          <div 
            data-testid="circuit-validation-feedback"
            className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 shadow-sm animate-in fade-in duration-200 ${
              isPassed
                ? 'bg-emerald-500/15 border-emerald-600 dark:border-emerald-500 text-[var(--fg-main)]'
                : 'bg-amber-500/15 border-amber-600 dark:border-amber-500 text-[var(--fg-main)]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Target Outcome Achieved!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Target Outcome Not Yet Reached</span>
                </>
              )}
            </div>
            <p className="text-xs">{currentState.explanationText}</p>
          </div>
        )}

        {/* AI Circuit Explanation Box if loaded */}
        {currentState.aiExplanation && (
          <div 
            data-testid="ai-circuit-explanation-box"
            className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-sciteal-500/40 space-y-2 animate-in fade-in duration-200 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-sciteal-800 dark:text-sciteal-300 font-mono">
              <Bot className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
              <span>AI Quantum Tutor — Circuit Analysis</span>
            </div>
            <div className="text-xs text-[var(--fg-main)] leading-relaxed whitespace-pre-wrap">
              {currentState.aiExplanation}
            </div>
          </div>
        )}

        {/* Scoped Activity Identity Footer */}
        <div className="text-[11px] font-mono text-[var(--fg-muted)] flex items-center justify-between pt-1 border-t border-[var(--border-card)]">
          <span>Targeted Practice</span>
          <span data-testid="scoped-activity-key" className="text-sciteal-700 dark:text-sciteal-400 font-bold">
            {effectiveKey}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

