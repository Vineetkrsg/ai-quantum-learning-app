import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { ArrowRight, BookOpen, Clock, Layers, Sparkles } from 'lucide-react';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { useProgress } from '../../context/ProgressContext';
import { MiniModulePreview } from './MiniModulePreview';

interface ActiveModuleControlCardProps {
  highlightedSlug?: string | null;
  onHighlightSlug?: (slug: string | null) => void;
}

export const ActiveModuleControlCard: React.FC<ActiveModuleControlCardProps> = ({
  highlightedSlug,
  onHighlightSlug
}) => {
  const { moduleProgress, completedLessonsByModule } = useProgress();
  const [isInternalHovered, setIsInternalHovered] = useState(false);

  // Find the first module that isn't 100% complete
  const activeModuleIndex = LEARNING_MODULES.findIndex(
    (m) => (moduleProgress[m.slug] || 0) < 100
  );
  const currentModule = LEARNING_MODULES[activeModuleIndex >= 0 ? activeModuleIndex : 0];
  const currentModuleProgress = moduleProgress[currentModule.slug] || 0;
  const isCompleted = currentModuleProgress === 100;

  const completedInModule = completedLessonsByModule[currentModule.slug] || [];
  const nextLesson = currentModule.lessons.find((l) => !completedInModule.includes(l.id)) || currentModule.lessons[0];

  const isHighlighted = highlightedSlug === currentModule.slug || isInternalHovered;

  const handleMouseEnter = () => {
    setIsInternalHovered(true);
    if (onHighlightSlug) {
      onHighlightSlug(currentModule.slug);
    }
  };

  const handleMouseLeave = () => {
    setIsInternalHovered(false);
    if (onHighlightSlug) {
      onHighlightSlug(null);
    }
  };

  return (
    <Card
      variant="default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`p-6 relative overflow-hidden transition-all duration-200 ${
        isHighlighted
          ? 'border-sciteal-500 shadow-md ring-1 ring-sciteal-500/30'
          : 'border-[var(--border-card)]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-start gap-3.5">
          {/* Micro Visual Preview */}
          <div className={`w-12 h-12 rounded-xl bg-[var(--surface-sunken)] border transition-all duration-200 flex items-center justify-center p-1 shrink-0 ${
            isHighlighted
              ? 'border-sciteal-500/60 bg-sciteal-500/10'
              : 'border-[var(--border-card)]'
          }`}>
            <MiniModulePreview
              slug={currentModule.slug}
              isActive={!isCompleted}
              isCompleted={isCompleted}
              isHovered={isHighlighted}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" dot>
                Active Learning Focus
              </Badge>
              <span className="text-xs text-[var(--fg-muted)] font-mono">
                Module {(activeModuleIndex >= 0 ? activeModuleIndex : 0) + 1} of 7
              </span>
            </div>
            <h3 className="text-lg font-bold text-[var(--fg-main)] tracking-tight">
              {currentModule.title}
            </h3>
          </div>
        </div>

        <Link to={`/learn/${currentModule.slug}`}>
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            {currentModuleProgress > 0 ? 'Resume Module' : 'Start Module'}
          </Button>
        </Link>
      </div>

      <p className="text-xs text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-4">
        {currentModule.description}
      </p>

      {/* Progress Bar with Real Completion */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[var(--fg-muted)]">
            Module Progress: {completedInModule.length} of {currentModule.lessons.length} Lessons
          </span>
          <span className="text-sciteal-700 dark:text-sciteal-400 font-bold">
            {currentModuleProgress}% Completed
          </span>
        </div>
        <ProgressBar value={currentModuleProgress} variant="cyan" size="md" />
      </div>

      {/* Next lesson teaser */}
      <div className="mt-5 pt-4 border-t border-[var(--border-card)] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[var(--fg-muted)] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
          <span>
            Up next: <strong className="text-[var(--fg-main)] font-medium">{nextLesson?.title || 'Introduction'}</strong>
          </span>
        </span>
        <span className="text-[var(--fg-muted)] font-mono flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{currentModule.estimatedTime}</span>
        </span>
      </div>
    </Card>
  );
};
