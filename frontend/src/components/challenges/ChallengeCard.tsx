import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Challenge } from '../../types/challenges';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Zap, Clock, HelpCircle, ArrowRight, CheckCircle2, Trophy } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  const getDifficultyVariant = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'emerald' as const;
      case 'Medium': return 'amber' as const;
      case 'Hard': return 'rose' as const;
      default: return 'slate' as const;
    }
  };

  return (
    <Card variant="interactive" className="group flex flex-col justify-between h-full">
      <CardContent className="p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={getDifficultyVariant(challenge.difficulty)} dot>
            {challenge.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-xs font-mono text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
            <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400 fill-amber-400" />
            <span>+{challenge.xp} XP</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[var(--fg-main)] group-hover:text-sciteal-600 dark:group-hover:text-sciteal-400 transition-colors flex items-center gap-2">
          {challenge.isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
          <span>{challenge.title}</span>
        </h3>

        <p className="text-xs text-[var(--fg-muted)] mt-2 leading-relaxed">
          {challenge.description}
        </p>

        {/* Target objective */}
        <div className="mt-4 p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted)]">
            Expected Result:
          </div>
          <div className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 font-bold">
            {challenge.expectedResult}
          </div>
        </div>

        {/* Hint accordion */}
        <div className="mt-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
            <span>{showHint ? 'Hide Guidance Hint' : 'Need a hint?'}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs text-[var(--fg-muted)] leading-relaxed animate-in fade-in duration-150">
              {challenge.hint}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-[var(--fg-muted)] mt-4 pt-4 border-t border-[var(--border-card)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>~{challenge.estimatedMinutes} mins</span>
          </span>
          <span className="font-mono text-[11px] text-[var(--fg-muted)]">
            Category: {challenge.category}
          </span>
        </div>
      </CardContent>

      {/* Action CTA */}
      <div className="p-4 bg-[var(--surface-sunken)] border-t border-[var(--border-card)] rounded-b-xl">
        <Button
          variant={challenge.isCompleted ? 'secondary' : 'quantum'}
          size="sm"
          className="w-full justify-between"
          onClick={() => navigate('/lab')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {challenge.isCompleted ? 'Replay Challenge' : 'Launch in Lab'}
        </Button>
      </div>
    </Card>
  );
};
