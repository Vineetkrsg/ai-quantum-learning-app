import React from 'react';
import { GuidedExperiment } from '../../types/quantum';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Award, 
  BookOpen, 
  Play
} from 'lucide-react';

interface ExperimentCompletionBannerProps {
  experiment: GuidedExperiment;
  onNextExperiment?: () => void;
  nextExperiment?: GuidedExperiment | null;
}

export const ExperimentCompletionBanner: React.FC<ExperimentCompletionBannerProps> = ({
  experiment,
  onNextExperiment,
  nextExperiment
}) => {
  return (
    <Card variant="default" className="border-emerald-500/50 bg-emerald-500/10 overflow-hidden shadow-md animate-in fade-in duration-300" data-testid="experiment-completion-banner">
      <CardContent className="p-5 space-y-4">
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold">
                Experiment Mastery Achieved
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--fg-main)]">
                {experiment.title} Completed!
              </h3>
            </div>
          </div>

          {nextExperiment && onNextExperiment && (
            <Button
              variant="quantum"
              size="sm"
              onClick={onNextExperiment}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs whitespace-nowrap flex-shrink-0"
            >
              Next: {nextExperiment.title}
            </Button>
          )}
        </div>

        {/* You Learned & You Practiced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* You Learned */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>You Learned:</span>
            </div>
            <ul className="space-y-1 text-[var(--fg-muted)] list-disc list-inside">
              {experiment.learningOutcomes.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* You Practiced */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-card)] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-sciteal-800 dark:text-sciteal-300 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You Practiced:</span>
            </div>
            <ul className="space-y-1 text-[var(--fg-muted)] list-disc list-inside">
              <li className="leading-relaxed">Formulating and testing a scientific quantum prediction</li>
              <li className="leading-relaxed">Building and placing operations on the quantum wire</li>
              <li className="leading-relaxed">Simulating statevectors and observing projective sampling noise</li>
              <li className="leading-relaxed">Solving the hands-on circuit challenge</li>
            </ul>
          </div>
        </div>

        {/* Next Recommendation Footer */}
        {nextExperiment && (
          <div className="flex items-center justify-between text-xs text-[var(--fg-muted)] pt-1 border-t border-emerald-500/20">
            <span>Next Experiment Recommendation:</span>
            <span className="font-semibold text-sciteal-700 dark:text-sciteal-300 font-mono">
              {nextExperiment.categoryTitle} · {nextExperiment.title} →
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
