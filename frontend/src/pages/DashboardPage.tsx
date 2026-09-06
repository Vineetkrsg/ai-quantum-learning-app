import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Trophy, 
  TrendingUp, 
  ArrowRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { QuickLabCard } from '../components/dashboard/QuickLabCard';
import { RecommendedLessonCard } from '../components/dashboard/RecommendedLessonCard';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { TutorPanel } from '../components/tutor/TutorPanel';
import { USER_OVERVIEW } from '../mock/progressData';
import { LEARNING_MODULES } from '../mock/modulesData';
import { useProgress } from '../context/ProgressContext';

export const DashboardPage: React.FC = () => {
  const { overallProgress, circuitsRun, xp, streakDays, moduleProgress, quizStats } = useProgress();

  // Find the first module that isn't 100% complete, default to module 0
  const activeModuleIndex = LEARNING_MODULES.findIndex(
    (m) => (moduleProgress[m.slug] || 0) < 100
  );
  const currentModule = LEARNING_MODULES[activeModuleIndex >= 0 ? activeModuleIndex : 0];
  const currentModuleProgress = moduleProgress[currentModule.slug] || 0;

  const userRank = xp === 0 
    ? 'Novice Quantum Explorer' 
    : xp < 200 
    ? 'Level 1 Qubit Apprentice' 
    : xp < 500 
    ? 'Level 2 Circuit Builder' 
    : 'Level 3 Qubit Engineer';

  const quizAverage = quizStats.length > 0 
    ? `${Math.round(quizStats.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / quizStats.length)}%` 
    : '0.0%';

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {USER_OVERVIEW.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-mono">
              {userRank}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick up right where you left off in your quantum mechanics and circuit journey.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/lab">
            <Button variant="quantum" size="sm" leftIcon={<Cpu className="w-4 h-4" />}>
              Open Quantum Lab
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Progress"
          value={`${overallProgress}%`}
          change={overallProgress > 0 ? `+${overallProgress}% this week` : 'Ready to start'}
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
          description="Across 7 core modules"
        />
        <StatCard
          label="Circuits Simulated"
          value={circuitsRun}
          change="Aer Ready"
          changeType="positive"
          icon={<Cpu className="w-5 h-5" />}
          description="1024 shots default"
        />
        <StatCard
          label="Quiz Average"
          value={quizAverage}
          change={quizStats.length > 0 ? `${quizStats.length} Quizzes` : '0 Quizzes'}
          changeType="positive"
          icon={<Trophy className="w-5 h-5" />}
          description={quizStats.length > 0 ? `${quizStats.length} assessments completed` : 'Complete a lesson self-check'}
        />
        <StatCard
          label="Learning Streak"
          value={`${streakDays} Days`}
          change={`${xp} XP`}
          changeType="positive"
          icon={<Flame className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
          description={streakDays > 0 ? 'Keep up the momentum' : 'Complete 1 lesson today'}
        />
      </div>

      {/* Primary 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Active Module, Lab Card, Recommended Lesson */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Active Module Card */}
          <Card variant="glass" className="p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="cyan" dot>Active Module</Badge>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Module {(activeModuleIndex >= 0 ? activeModuleIndex : 0) + 1} of 7
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentModule.title}
                </h3>
              </div>
              <Link to={`/learn/${currentModule.slug}`}>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  {currentModuleProgress > 0 ? 'Resume Module' : 'Start Module'}
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-4">
              {currentModule.description}
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Current Progress</span>
                <span className="text-cyan-600 dark:text-cyan-300 font-bold">{currentModuleProgress}% Completed</span>
              </div>
              <ProgressBar value={currentModuleProgress} variant="cyan" size="md" />
            </div>

            {/* Next lesson teaser */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                Up next: <span className="text-slate-900 dark:text-white font-medium">{currentModule.lessons[0]?.title || 'Introduction'}</span>
              </span>
              <span className="text-slate-500 font-mono">{currentModule.estimatedTime}</span>
            </div>
          </Card>

          {/* Quick Lab & Recommended Lesson Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickLabCard />
            <RecommendedLessonCard />
          </div>

          {/* Recent Activity Card */}
          <RecentActivityCard />
        </div>

        {/* Right Column: AI Quantum Tutor Widget */}
        <div className="space-y-6">
          <TutorPanel
            compact
            context={{
              activeLessonTitle: currentModule.title,
              currentCircuitName: 'Quantum State Explorer',
              qubitCount: 2,
              gateCount: 2
            }}
          />
        </div>
      </div>
    </div>
  );
};
