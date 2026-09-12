import React, { useState } from 'react';
import { CHALLENGES_DATA } from '../mock/challengesData';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Trophy, Zap, CheckCircle2, Flame, Award } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const ChallengesPage: React.FC = () => {
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const { xp, streakDays, completedChallenges } = useProgress();

  const filterTabs = [
    { id: 'all', label: 'All Challenges', count: CHALLENGES_DATA.length },
    { id: 'easy', label: 'Easy', count: CHALLENGES_DATA.filter(c => c.difficulty === 'Easy').length },
    { id: 'medium', label: 'Medium', count: CHALLENGES_DATA.filter(c => c.difficulty === 'Medium').length },
    { id: 'hard', label: 'Hard', count: CHALLENGES_DATA.filter(c => c.difficulty === 'Hard').length },
  ];

  const filteredChallenges = CHALLENGES_DATA.filter((c) => {
    if (filterDifficulty === 'all') return true;
    return c.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
  });

  const completedCount = completedChallenges.length;
  const totalXpAvailable = CHALLENGES_DATA.reduce((sum, c) => sum + c.xp, 0);

  return (
    <div className="space-y-6" data-tour="challenges-area">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
              Practical Assessments
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--fg-main)] tracking-tight">
            Quantum Circuit Challenges
          </h2>
          <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
            Validate your mastery by synthesizing circuits under strict gate limits and probabilistic requirements.
          </p>
        </div>

        {/* User Stats Pill */}
        <div className="flex items-center gap-3 p-2 px-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)]">
          <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 font-mono font-semibold">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-current" />
            <span>{xp} XP</span>
          </div>
          <span className="text-[var(--border-card)]">|</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{completedCount}/{CHALLENGES_DATA.length} Solved</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sciteal-500/10 border border-sciteal-500/30 text-sciteal-700 dark:text-sciteal-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--fg-muted)]">Completion Rate</div>
            <div className="text-lg font-bold text-[var(--fg-main)] font-mono">
              {Math.round((completedCount / CHALLENGES_DATA.length) * 100)}%
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-[var(--fg-muted)]">Total XP Pool</div>
            <div className="text-lg font-bold text-[var(--fg-main)] font-mono">
              {totalXpAvailable} XP
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-500/10 border border-[var(--border-card)] text-[var(--fg-main)]">
            <Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-[var(--fg-muted)]">Active Streak</div>
            <div className="text-lg font-bold text-[var(--fg-main)] font-mono">
              {streakDays} Days
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs
        tabs={filterTabs}
        activeTab={filterDifficulty}
        onChange={setFilterDifficulty}
      />

      {/* Challenges Grid: Superposition, Quantum Gates, Bell State, Quantum Circuit Basics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
};
