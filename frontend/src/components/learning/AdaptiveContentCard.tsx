import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdaptiveEvaluation } from '../../services/adaptiveEngine';
import { 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AdaptiveContentCardProps {
  evaluation: AdaptiveEvaluation;
  moduleId?: string;
  lessonId?: string;
  className?: string;
}

export const AdaptiveContentCard: React.FC<AdaptiveContentCardProps> = ({
  evaluation,
  moduleId,
  lessonId,
  className = ''
}) => {
  const [isDeepExpanded, setIsDeepExpanded] = useState(false);
  const { mode, rationale, badgeLabel, recommendedExperiment, reinforcementSummary, deepDiveInsight } = evaluation;

  // Build lab link URL with query params
  const labUrl = recommendedExperiment
    ? `/lab?experiment=${recommendedExperiment.id}${moduleId ? `&moduleId=${moduleId}` : ''}${lessonId ? `&lessonId=${lessonId}` : ''}`
    : '/lab';

  if (mode === 'standard') {
    return null; // Keep standard presentation clean without intrusive cards
  }

  return (
    <div
      className={`p-5 rounded-2xl border transition-all animate-in fade-in duration-200 space-y-4 ${
        mode === 'reinforcement'
          ? 'bg-amber-500/10 border-amber-500/30 text-[var(--fg-main)]'
          : 'bg-emerald-500/10 border-emerald-500/30 text-[var(--fg-main)]'
      } ${className}`}
      data-testid="adaptive-content-card"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-card)] pb-3">
        <div className="flex items-center gap-2">
          {mode === 'reinforcement' ? (
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold font-mono">
                {mode === 'reinforcement' ? 'Adaptive Pace · Reinforcement Mode' : 'Pace Evaluation · Advanced Exploration'}
              </h4>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                  mode === 'reinforcement'
                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                }`}
              >
                {badgeLabel}
              </span>
            </div>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">{rationale}</p>
          </div>
        </div>
      </div>

      {/* REINFORCEMENT MODE BODY */}
      {mode === 'reinforcement' && reinforcementSummary && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1.5 text-xs">
            <span className="font-bold text-amber-800 dark:text-amber-300 font-mono flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Simplified Intuition Breakdown:</span>
            </span>
            <p className="text-[var(--fg-main)] leading-relaxed italic">
              "{reinforcementSummary.simplifiedExplanation}"
            </p>
          </div>

          {/* Recommended Experiment Link */}
          {recommendedExperiment && (
            <div className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-wider block">
                  Recommended Practical Reinforcement:
                </span>
                <span className="font-bold text-sciteal-700 dark:text-sciteal-300 block">
                  Circuit Lab Experiment: {recommendedExperiment.title}
                </span>
                <p className="text-[var(--fg-muted)] text-[11px] leading-relaxed">
                  {recommendedExperiment.reason}
                </p>
              </div>

              <Link to={labUrl} className="flex-shrink-0">
                <Button
                  variant="quantum"
                  size="sm"
                  leftIcon={<Cpu className="w-3.5 h-3.5" />}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Open in Circuit Lab
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ADVANCED MODE BODY */}
      {mode === 'advanced' && deepDiveInsight && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>
                Demonstrated strong mastery. Unlocked: <strong>{deepDiveInsight.title}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsDeepExpanded(!isDeepExpanded)}
              className="flex items-center gap-1 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              <span>{isDeepExpanded ? 'Hide Deep Dive' : 'Explore Deep Dive'}</span>
              {isDeepExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isDeepExpanded && (
            <div className="p-4 rounded-xl bg-[var(--surface-card)] border border-emerald-500/40 space-y-3 text-xs animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="font-bold font-mono text-emerald-800 dark:text-emerald-300 block">
                  Theoretical Formulation & Algebraic Proof:
                </span>
                <p className="text-[var(--fg-main)] font-mono text-[11px] leading-relaxed bg-[var(--surface-sunken)] p-3 rounded-lg border border-[var(--border-card)]">
                  {deepDiveInsight.mathematicalProof}
                </p>
              </div>

              {recommendedExperiment && (
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--border-card)]">
                  <span className="text-[11px] text-[var(--fg-muted)]">
                    Challenge: {deepDiveInsight.extensionChallenge}
                  </span>
                  <Link to={labUrl}>
                    <Button
                      variant="quantum"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Launch Level {recommendedExperiment.levelNumber} Lab Challenge
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
