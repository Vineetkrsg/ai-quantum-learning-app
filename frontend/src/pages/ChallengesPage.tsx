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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-mono">
              Practical Assessments
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Quantum Circuit Challenges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Validate your mastery by synthesizing circuits under strict gate limits and probabilistic requirements.
          </p>
        </div>

        {/* User Stats Pill */}
        <div className="flex items-center gap-3 p-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-300 font-mono font-semibold">
            <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-current" />
            <span>{xp} XP</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>{completedCount}/{CHALLENGES_DATA.length} Solved</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Completion Rate</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {Math.round((completedCount / CHALLENGES_DATA.length) * 100)}%
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total XP Pool</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {totalXpAvailable} XP
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <Flame className="w-5 h-5 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Active Streak</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
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
