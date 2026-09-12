import React, { useState } from 'react';
import { ExperimentChallenge, Circuit, SimulationResult } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Trophy, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

interface ExperimentChallengeCardProps {
  challenge: ExperimentChallenge;
  circuit: Circuit;
  simulationResult: SimulationResult | null;
  isPassed: boolean;
  isSubmitted: boolean;
  feedback?: string;
  hintLevel: number;
  showSolution: boolean;
  onSubmitChallenge: () => void;
  onNextHint: () => void;
  onRevealSolution: () => void;
  isRunning?: boolean;
}

export const ExperimentChallengeCard: React.FC<ExperimentChallengeCardProps> = ({
  challenge,
  circuit,
  simulationResult,
  isPassed,
  isSubmitted,
  feedback,
  hintLevel,
  showSolution,
  onSubmitChallenge,
  onNextHint,
  onRevealSolution,
  isRunning = false
}) => {
  const [showHintBox, setShowHintBox] = useState(false);

  // Active hint text based on tier 1, 2, 3
  const getActiveHintText = (): string => {
    const hints = challenge.hints;
    if (hints && hints.length >= hintLevel) {
      return hints[hintLevel - 1];
    }
    return hints[hints.length - 1] || 'Think carefully about what transformation is needed on the qubit.';
  };

  return (
    <Card variant="default" className="overflow-hidden" data-testid="experiment-challenge-card">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <CardTitle className="text-sm sm:text-base">
            Experiment Challenge: {challenge.title}
          </CardTitle>
        </div>
        <Badge variant={isPassed ? "emerald" : "amber"} size="sm">
          {isPassed ? "Challenge Mastered" : "+40 XP Challenge"}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Instruction & Objective */}
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
            {challenge.instruction}
          </p>
          <div className="text-[11px] font-mono text-[var(--fg-muted)]">
            Target Goal: <span className="text-sciteal-700 dark:text-sciteal-400 font-semibold">{challenge.objective}</span>
          </div>
        </div>

        {/* Action Controls: Submit Challenge & Hint Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-card)]">
          <div className="flex items-center gap-2">
            <Button
              variant={isPassed ? "secondary" : "primary"}
              size="sm"
              onClick={onSubmitChallenge}
              disabled={isRunning}
              leftIcon={<Check className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              {isPassed ? 'Test Circuit Again' : 'Submit Challenge'}
            </Button>

            <button
              type="button"
              onClick={() => setShowHintBox(!showHintBox)}
              className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] px-2.5 py-1.5 rounded-lg border border-transparent hover:border-[var(--border-card)] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>{showHintBox ? 'Hide Hints' : 'Need a hint?'}</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[var(--fg-muted)]">
            Active: {circuit.gates.length} Gates on Canvas
          </span>
        </div>

        {/* 3-Tier Scaffolded Hint Box */}
        {showHintBox && (
          <div className="p-4 rounded-xl bg-sciteal-500/10 border border-sciteal-500/30 space-y-2.5 animate-in fade-in duration-150 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sciteal-800 dark:text-sciteal-300 uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Scaffolded Hint Tier {hintLevel} of {challenge.hints.length}</span>
              </span>

              {hintLevel < challenge.hints.length && (
                <button
                  type="button"
                  onClick={onNextHint}
                  className="text-sciteal-700 dark:text-sciteal-300 font-semibold hover:underline cursor-pointer"
                >
                  Need more help? (Tier {hintLevel + 1}) →
                </button>
              )}
            </div>

            <p className="text-[var(--fg-main)] leading-relaxed">
              {getActiveHintText()}
            </p>

            {/* Optional solution reveal */}
            {hintLevel >= 2 && !showSolution && challenge.solutionGates && (
              <div className="pt-2 border-t border-sciteal-500/20 flex justify-end">
                <button
                  type="button"
                  onClick={onRevealSolution}
                  className="text-[11px] font-mono text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span>Reveal Target Solution</span>
                </button>
              </div>
            )}

            {showSolution && challenge.solutionGates && (
              <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-sciteal-500/30 font-mono text-xs text-sciteal-700 dark:text-sciteal-300 font-bold">
                Target Solution Sequence: [{challenge.solutionGates.join(' → ')}]
              </div>
            )}
          </div>
        )}

        {/* Validation Result Banner */}
        {isSubmitted && feedback && (
          <div className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 shadow-xs animate-in fade-in duration-200 ${
            isPassed
              ? 'bg-emerald-500/15 border-emerald-500/50 text-[var(--fg-main)]'
              : 'bg-amber-500/15 border-amber-500/50 text-[var(--fg-main)]'
          }`}>
            <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
              {isPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Challenge Solved!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Not Quite Yet</span>
                </>
              )}
            </div>
            <p className="text-[var(--fg-main)]">{feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
