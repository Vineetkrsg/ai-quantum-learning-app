import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { LEARNING_MODULES } from '../../mock/modulesData';

export const RecommendedLessonCard: React.FC = () => {
  const navigate = useNavigate();
  const { moduleProgress } = useProgress();

  // Pick first incomplete module
  const nextModule = LEARNING_MODULES.find(
    (m) => (moduleProgress[m.slug] || 0) < 100
  ) || LEARNING_MODULES[0];

  const firstIncompleteLesson = nextModule.lessons[0] || {
    id: 'les-1-1',
    title: 'Why Quantum Computing Matters',
    durationMinutes: 8
  };

  return (
    <Card variant="interactive" className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Recommended Next Lesson</span>
          </CardTitle>
          <Badge variant="cyan" dot>Next Step</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div>
          <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
            Module: {nextModule.title}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {firstIncompleteLesson.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            {nextModule.description}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{firstIncompleteLesson.durationMinutes ? `${firstIncompleteLesson.durationMinutes} mins` : '8 mins'}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Theory + Circuit</span>
          </span>
        </div>
      </CardContent>

      <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800/60 rounded-b-xl flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">+50 XP upon completion</span>
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
