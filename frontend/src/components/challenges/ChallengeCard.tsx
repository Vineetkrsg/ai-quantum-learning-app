import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Challenge } from '../../types/challenges';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Zap, Clock, HelpCircle, ArrowRight, CheckCircle2, Trophy, Cpu, Atom, BookOpen } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const [showHint, setShowHint] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const getDifficultyVariant = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'emerald' as const;
      case 'Medium': return 'amber' as const;
      case 'Hard': return 'rose' as const;
      default: return 'slate' as const;
    }
  };

  // Map challenge category to relevant learning module
  const categoryModuleMap: Record<string, { slug: string; name: string }> = {
    'Fundamentals': { slug: 'superposition', name: 'Superposition Module' },
    'Unitary Operations': { slug: 'gates', name: 'Quantum Gates Module' },
    'Entanglement': { slug: 'entanglement', name: 'Entanglement Module' },
    'Circuit Synthesis': { slug: 'circuits', name: 'Circuits Module' }
  };

  const relatedModule = categoryModuleMap[challenge.category] || { slug: 'circuits', name: 'Circuit Module' };

  return (
    <Card
      variant="interactive"
      className="group flex flex-col justify-between h-full transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

        {/* Interactive Quantum Circuit Preview (Prompt Section 12) */}
        <div className={`mt-4 p-3 rounded-xl border transition-all duration-200 ${
          isHovered
            ? 'bg-sciteal-500/10 dark:bg-sciteal-950/30 border-sciteal-500/50 shadow-sm'
            : 'bg-[var(--surface-sunken)] border-[var(--border-card)]'
        }`}>
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--fg-muted)] mb-2">
            <span className="flex items-center gap-1 font-semibold text-sciteal-700 dark:text-sciteal-400">
              <Cpu className="w-3 h-3" />
              <span>Experiment Circuit Setup</span>
            </span>
            <span>Budget: ≤{challenge.targetGateCount || 2} Gates</span>
          </div>

          {/* Circuit wire representation with responsive gate placeholder slots */}
          <div className="py-2 px-3 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] flex items-center justify-between font-mono text-xs overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-sciteal-700 dark:text-sciteal-400 font-bold">q[0]: |0⟩</span>
              <span className={`h-0.5 w-6 transition-colors duration-200 ${isHovered ? 'bg-sciteal-500' : 'bg-[var(--circuit-wire)]'}`} />
            </div>

            {/* Responding Gate Slot 1 */}
            <div className={`px-2 py-1 rounded border text-center text-[11px] font-bold transition-all duration-200 ${
              isHovered
                ? 'bg-sciteal-500/20 border-sciteal-500 text-sciteal-700 dark:text-sciteal-300 scale-105 animate-pulse'
                : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)]'
            }`}>
              {isHovered ? 'U₁' : '?'}
            </div>

            <span className={`h-0.5 w-6 transition-colors duration-200 ${isHovered ? 'bg-sciteal-500' : 'bg-[var(--circuit-wire)]'}`} />

            {/* Responding Gate Slot 2 */}
            <div className={`px-2 py-1 rounded border text-center text-[11px] font-bold transition-all duration-200 ${
              isHovered
                ? 'bg-purple-500/20 border-purple-500 text-purple-700 dark:text-purple-300 scale-105 animate-pulse'
                : 'bg-[var(--surface-sunken)] border-[var(--border-card)] text-[var(--fg-muted)]'
            }`}>
              {isHovered ? (challenge.targetGateCount && challenge.targetGateCount > 1 ? 'U₂' : '──') : '?'}
            </div>

            <span className={`h-0.5 w-6 transition-colors duration-200 ${isHovered ? 'bg-sciteal-500' : 'bg-[var(--circuit-wire)]'}`} />

            {/* Measurement Observer Icon */}
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--fg-muted)]">
              <span className="px-1.5 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] font-bold">
                ⟨M⟩
              </span>
            </div>
          </div>

          {/* Expected Result State Preview */}
          <div className="mt-2.5 pt-2 border-t border-[var(--border-card)] flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-mono text-[var(--fg-muted)]">Target State:</span>
            <span className={`font-mono text-[11px] font-bold transition-colors ${
              isHovered ? 'text-sciteal-700 dark:text-sciteal-300' : 'text-sciteal-700 dark:text-sciteal-400'
            }`}>
              {challenge.expectedResult}
            </span>
          </div>
        </div>

        {/* Hint accordion */}
        <div className="mt-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg-main)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
            <span>{showHint ? 'Hide Guidance Hint' : 'Need a conceptual hint?'}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs text-[var(--fg-muted)] leading-relaxed animate-fadeIn">
              {challenge.hint}
            </div>
          )}
        </div>

        {/* Metadata & Related Learning Link */}
        <div className="flex items-center justify-between text-xs text-[var(--fg-muted)] mt-4 pt-4 border-t border-[var(--border-card)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>~{challenge.estimatedMinutes} mins</span>
          </span>
          <Link
            to={`/learn/${relatedModule.slug}`}
            className="text-[11px] font-mono text-sciteal-700 dark:text-sciteal-400 hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Study {relatedModule.name}</span>
          </Link>
        </div>
      </CardContent>

      {/* Action CTA */}
      <div className="p-4 bg-[var(--surface-sunken)] border-t border-[var(--border-card)] rounded-b-xl flex items-center gap-2">
        <Button
          variant={challenge.isCompleted ? 'secondary' : 'quantum'}
          size="sm"
          className="w-full justify-between"
          onClick={() => navigate('/lab')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {challenge.isCompleted ? 'Replay Challenge in Lab' : 'Launch Experiment in Circuit Lab'}
        </Button>
      </div>
    </Card>
  );
};

