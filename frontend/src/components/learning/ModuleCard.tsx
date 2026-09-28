import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningModule } from '../../types/learning';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Clock, BookOpen, CheckCircle2, ChevronRight, Atom, Sparkles, Layers, Binary, GitCommit, Workflow, Cpu } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { ModulePreviewVisual } from './ModulePreviewVisual';

interface ModuleCardProps {
  module: LearningModule;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const navigate = useNavigate();
  const { moduleProgress } = useProgress();

  const progress = moduleProgress[module.slug] ?? module.progress ?? 0;
  const isCompleted = progress === 100;

  const getDifficultyVariant = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'emerald' as const;
      case 'Intermediate': return 'teal' as const;
      case 'Advanced': return 'purple' as const;
      default: return 'slate' as const;
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />;
      case 'Atom': return <Atom className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300" />;
      case 'Binary': return <Binary className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />;
      case 'GitCommit': return <GitCommit className="w-5 h-5 text-slate-700 dark:text-slate-300" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default: return <BookOpen className="w-5 h-5 text-sciteal-600 dark:text-sciteal-400" />;
    }
  };

  return (
    <Card variant="interactive" className="group flex flex-col justify-between h-full">
      <CardContent className="p-6">
        {/* Header: Icon & Difficulty */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] shadow-sm group-hover:border-sciteal-500/40 group-hover:scale-105 transition-all">
            {getIcon(module.iconName)}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getDifficultyVariant(module.difficulty)} dot>
              {module.difficulty}
            </Badge>
            {isCompleted && (
              <Badge variant="emerald">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-[var(--fg-main)] group-hover:text-sciteal-600 dark:group-hover:text-sciteal-400 transition-colors">
          {module.title}
        </h3>
        <p className="text-xs text-[var(--fg-muted)] mt-2 leading-relaxed line-clamp-2">
          {module.description}
        </p>

        {/* Concept-Specific Visual Preview */}
        <div className="mt-3">
          <ModulePreviewVisual slug={module.slug} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {module.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[var(--fg-muted)] font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-[var(--fg-muted)] mt-4 pt-4 border-t border-[var(--border-card)] font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{module.estimatedTime}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{module.lessons.length} Lessons</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <ProgressBar value={progress} showLabel size="sm" variant={isCompleted ? 'emerald' : 'cyan'} />
        </div>
      </CardContent>

      {/* Footer Action */}
      <div className="p-4 bg-[var(--surface-sunken)] border-t border-[var(--border-card)] rounded-b-xl">
        <Button
          variant={isCompleted ? 'secondary' : 'primary'}
          size="sm"
          className="w-full justify-between"
          onClick={() => navigate(`/learn/${module.slug}`)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          {isCompleted ? 'Review Module' : progress > 0 ? 'Continue Lesson' : 'Start Module'}
        </Button>
      </div>
    </Card>
  );
};
