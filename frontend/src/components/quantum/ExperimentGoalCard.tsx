import React from 'react';
import { GuidedExperiment } from '../../types/quantum';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Target, 
  BookOpen, 
  RotateCcw, 
  Lightbulb, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface ExperimentGoalCardProps {
  experiment: GuidedExperiment;
  onResetExperiment: () => void;
  isCompleted?: boolean;
}

export const ExperimentGoalCard: React.FC<ExperimentGoalCardProps> = ({
  experiment,
  onResetExperiment,
  isCompleted = false
}) => {
  return (
    <Card variant="default" className="overflow-hidden" data-testid="experiment-goal-card">
      <CardHeader className="pb-3 border-b border-[var(--border-card)] flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 rounded-lg bg-sciteal-500/10 text-sciteal-700 dark:text-sciteal-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sciteal-700 dark:text-sciteal-400">
                {experiment.categoryTitle}
              </span>
              {experiment.isEducationalDemo && (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Educational Simulation
                </span>
              )}
            </div>
            <CardTitle className="text-base sm:text-lg text-[var(--fg-main)]">
              {experiment.title}
            </CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
              <span>Completed</span>
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onResetExperiment}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Restore original starting circuit for this experiment"
            className="text-xs"
          >
            Reset Experiment
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Objective Box */}
        <div className="p-3.5 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sciteal-800 dark:text-sciteal-300 font-mono">
            <Target className="w-3.5 h-3.5" />
            <span>Experiment Objective:</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--fg-main)] leading-relaxed">
            {experiment.objective}
          </p>
        </div>

        {/* Concept Summary & Learning Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Concept Summary */}
          <div className="space-y-1.5 p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)]">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--fg-main)]">
              <BookOpen className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
              <span>Core Concept:</span>
            </div>
            <p className="text-[var(--fg-muted)] leading-relaxed">
              {experiment.conceptSummary}
            </p>
          </div>

          {/* Expected Learning Outcomes */}
          <div className="space-y-1.5 p-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)]">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--fg-main)]">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Key Takeaways:</span>
            </div>
            <ul className="space-y-1 text-[var(--fg-muted)] list-disc list-inside">
              {experiment.learningOutcomes.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {experiment.educationalNotes && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>{experiment.educationalNotes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
