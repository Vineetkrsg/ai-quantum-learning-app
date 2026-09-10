import React from 'react';
import { PracticeTaskData } from '../../types/learning';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Zap, HelpCircle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export interface PracticeChallengeState {
  selectedGateSymbol: string | null;
  showHint: boolean;
  isCompleted: boolean;
}

const DEFAULT_STATE: PracticeChallengeState = {
  selectedGateSymbol: null,
  showHint: false,
  isCompleted: false
};

interface PracticeChallengeProps {
  moduleId?: string;
  lessonId?: string;
  activityId?: string;
  scopedKey?: string;
  practiceData: PracticeTaskData;
  onComplete?: () => void;
}

export const PracticeChallenge: React.FC<PracticeChallengeProps> = ({
  moduleId,
  lessonId,
  activityId = 'practice-task-1',
  scopedKey,
  practiceData,
  onComplete
}) => {
  const progress = useProgress();
  const effectiveKey = scopedKey || `${moduleId || 'module'}/${lessonId || 'practice'}/${activityId}`;
  const currentState = progress.getActivityState<PracticeChallengeState>(effectiveKey, DEFAULT_STATE);

  const selectedGateSymbol = currentState.selectedGateSymbol;
  const showHint = currentState.showHint;

  const selectedGate = practiceData.availableGates.find((g) => g.symbol === selectedGateSymbol);
  const isCorrect = selectedGate?.isCorrect ?? false;

  const handleSelect = (symbol: string) => {
    const gate = practiceData.availableGates.find((g) => g.symbol === symbol);
    const correct = gate?.isCorrect ?? false;
    progress.setActivityState<PracticeChallengeState>(effectiveKey, {
      ...currentState,
      selectedGateSymbol: symbol,
      isCompleted: correct
    });
    if (correct && onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    progress.setActivityState<PracticeChallengeState>(effectiveKey, {
      ...currentState,
      selectedGateSymbol: null
    });
  };

  const handleToggleHint = () => {
    progress.setActivityState<PracticeChallengeState>(effectiveKey, {
      ...currentState,
      showHint: !showHint
    });
  };

  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-400" />
          <CardTitle className="text-sm sm:text-base">{practiceData.title}</CardTitle>
        </div>
        <Badge variant="teal" size="sm">
          Hands-On Practice
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
          {practiceData.instruction}
        </p>

        {/* Mini Wire with Missing Slot */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] overflow-x-auto shadow-inner">
          <div className="flex items-center justify-center gap-2 min-w-[320px] font-mono text-xs">
            <span className="text-sciteal-700 dark:text-sciteal-400 font-bold">{practiceData.wireTemplate.qubitLabel}</span>
            <span className="text-[var(--fg-muted)]">{practiceData.wireTemplate.beforeGate}</span>

            {/* The Target Slot */}
            <div className={`
              w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all duration-200
              ${selectedGateSymbol 
                ? isCorrect
                  ? 'bg-emerald-500/15 border-emerald-600 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-500/15 border-rose-600 dark:border-rose-500 text-rose-800 dark:text-rose-300'
                : 'border-dashed border-sciteal-500/60 bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-400 animate-pulse'}
            `}>
              {selectedGateSymbol || '?'}
            </div>

            <span className="text-[var(--fg-main)] font-semibold">{practiceData.wireTemplate.afterGate}</span>
          </div>
        </div>

        {/* Gate Selection Palette */}
        <div>
          <div className="text-xs font-semibold text-[var(--fg-muted)] mb-2">
            Select a Gate to Place in the Circuit Wire:
          </div>
          <div className="flex flex-wrap gap-3">
            {practiceData.availableGates.map((gate) => {
              const isPicked = selectedGateSymbol === gate.symbol;
              return (
                <button
                  key={gate.symbol}
                  onClick={() => handleSelect(gate.symbol)}
                  className={`
                    px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all
                    ${isPicked
                      ? gate.isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-[var(--fg-main)] ring-2 ring-emerald-500/50'
                        : 'bg-rose-500/20 border-rose-500 text-[var(--fg-main)]'
                      : 'bg-[var(--surface-subtle)] border-[var(--border-card)] text-[var(--fg-main)] hover:border-sciteal-500/50 hover:bg-[var(--surface-hover)]'}
                  `}
                >
                  <span className="text-sm">{gate.symbol}</span>
                  <span className="text-[11px] font-sans text-[var(--fg-muted)]">({gate.name})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Message */}
        {selectedGateSymbol && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
            isCorrect 
              ? 'bg-emerald-500/10 border-emerald-500/40 text-[var(--fg-main)]' 
              : 'bg-rose-500/10 border-rose-500/40 text-[var(--fg-main)]'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Success! Circuit Complete</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Incorrect Gate Placement</span>
                </>
              )}
            </div>
            <p>
              {isCorrect ? practiceData.successExplanation : 'That gate does not meet the challenge criteria. Review the hint below.'}
            </p>
          </div>
        )}

        {/* Hint Accordion */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleToggleHint}
            className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
            <span>{showHint ? 'Hide Hint' : 'Need a hint for this challenge?'}</span>
          </button>

          {selectedGateSymbol && !isCorrect && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3 h-3" />}
            >
              Reset Slot
            </Button>
          )}
        </div>

        {showHint && (
          <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs text-[var(--fg-muted)] leading-relaxed animate-in fade-in duration-150">
            {practiceData.hint}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
