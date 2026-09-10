import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { DifficultyLevel } from '../../types/learning';

interface LessonHeaderProps {
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  isCompleted: boolean;
  progress: number;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  subtitle,
  difficulty,
  estimatedTime,
  isCompleted,
  progress
}) => {
  const getDifficultyVariant = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'Beginner': return 'emerald' as const;
      case 'Intermediate': return 'teal' as const;
      case 'Advanced': return 'purple' as const;
      default: return 'slate' as const;
    }
  };

  return (
    <div className="space-y-4 pb-6 border-b border-[var(--border-card)]">
      {/* Back to Modules link & Metadata bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--fg-muted)] hover:text-sciteal-600 dark:hover:text-sciteal-400 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to All Curriculum Modules</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant={getDifficultyVariant(difficulty)} dot>
            {difficulty}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-[var(--fg-muted)] font-mono">
            <Clock className="w-3 h-3 text-[var(--fg-muted)]" />
            <span>{estimatedTime}</span>
          </span>
          {isCompleted && (
            <Badge variant="emerald">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Main Lesson Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--fg-main)] tracking-tight flex items-center gap-3">
          <span>{title}</span>
        </h1>
        <p className="text-sm sm:text-base text-[var(--fg-muted)] font-medium mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Mini lesson progress indicator */}
      <div className="max-w-xs pt-1">
        <ProgressBar
          value={progress}
          showLabel
          size="sm"
          variant={isCompleted ? 'emerald' : 'cyan'}
        />
      </div>
    </div>
  );
};
