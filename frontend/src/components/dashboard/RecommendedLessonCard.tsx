import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { LEARNING_MODULES } from '../../mock/modulesData';
import { MiniModulePreview } from './MiniModulePreview';

interface RecommendedLessonCardProps {
  className?: string;
  highlightedSlug?: string | null;
  onHighlightSlug?: (slug: string | null) => void;
}

export const RecommendedLessonCard: React.FC<RecommendedLessonCardProps> = ({ 
  className = '',
  highlightedSlug,
  onHighlightSlug
}) => {
  const navigate = useNavigate();
  const { moduleProgress, completedLessonsByModule } = useProgress();
  const [isInternalHovered, setIsInternalHovered] = useState(false);

  // Pick first incomplete module
  const nextModule = LEARNING_MODULES.find(
    (m) => (moduleProgress[m.slug] || 0) < 100
  ) || LEARNING_MODULES[0];

  const completedInModule = completedLessonsByModule[nextModule.slug] || [];
  const firstIncompleteLesson = nextModule.lessons.find(
    (l) => !completedInModule.includes(l.id)
  ) || nextModule.lessons[0] || {
    id: 'les-1-1',
    title: 'Why Quantum Computing Matters',
    durationMinutes: 8
  };

  const isHighlighted = highlightedSlug === nextModule.slug || isInternalHovered;

  const handleMouseEnter = () => {
    setIsInternalHovered(true);
    if (onHighlightSlug) {
      onHighlightSlug(nextModule.slug);
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
      variant="interactive" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col transition-all duration-200 ${
        isHighlighted 
          ? 'border-sciteal-500 shadow-md ring-1 ring-sciteal-500/30' 
          : 'border-[var(--border-card)]'
      } ${className}`.trim()}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Recommended Next Lesson</span>
          </CardTitle>
          <Badge variant="teal" dot>Next Step</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          {/* Micro animated preview for the recommended module */}
          <div className={`w-12 h-11 rounded-lg bg-[var(--surface-sunken)] border transition-all duration-200 flex items-center justify-center p-1 shrink-0 ${
            isHighlighted 
              ? 'border-sciteal-500/60 bg-sciteal-500/10' 
              : 'border-[var(--border-card)]'
          }`}>
            <MiniModulePreview
              slug={nextModule.slug}
              isActive={true}
              isHovered={isHighlighted}
            />
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-mono text-sciteal-700 dark:text-sciteal-400 font-semibold uppercase tracking-wide block">
              Module: {nextModule.title}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-[var(--fg-main)] mt-0.5 truncate">
              {firstIncompleteLesson.title}
            </h4>
          </div>
        </div>

        <p className="text-xs text-[var(--fg-muted)] leading-relaxed line-clamp-2">
          {nextModule.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-[var(--fg-muted)] pt-1">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{firstIncompleteLesson.durationMinutes ? `${firstIncompleteLesson.durationMinutes} mins` : '8 mins'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[var(--fg-muted)]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Concept & Lab</span>
          </span>
        </div>
      </CardContent>

      <div className="p-4 bg-[var(--surface-sunken)] border-t border-[var(--border-card)] rounded-b-xl flex items-center justify-between mt-auto">
        <span className="text-xs text-[var(--fg-muted)] font-mono">+50 XP upon completion</span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/learn/${nextModule.slug}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Start Lesson
        </Button>
      </div>
    </Card>
  );
};
