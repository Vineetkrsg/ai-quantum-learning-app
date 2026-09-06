import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningModule } from '../../types/learning';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { Clock, BookOpen, CheckCircle2, ChevronRight, Atom, Sparkles, Layers, Binary, GitCommit, Workflow, Cpu } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

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
      case 'Intermediate': return 'cyan' as const;
      case 'Advanced': return 'purple' as const;
      default: return 'slate' as const;
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />;
      case 'Atom': return <Atom className="w-5 h-5 text-teal-500 dark:text-teal-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
      case 'Binary': return <Binary className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      case 'GitCommit': return <GitCommit className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'Workflow': return <Workflow className="w-5 h-5 text-fuchsia-500 dark:text-fuchsia-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      default: return <BookOpen className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />;
    }
  };

  return (
    <Card variant="interactive" className="group flex flex-col justify-between h-full">
      <CardContent className="p-6">
        {/* Header: Icon & Difficulty */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 shadow-sm group-hover:border-cyan-500/40 group-hover:scale-105 transition-all">
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
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
          {module.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
          {module.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {module.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-500 mt-4 pt-4 border-t border-slate-300 dark:border-slate-800/60 font-medium">
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
      <div className="p-4 bg-slate-100/80 dark:bg-slate-950/40 border-t border-slate-300 dark:border-slate-800/60 rounded-b-xl">
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
