import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { MasteryMeter } from '../components/progress/MasteryMeter';
import { QuizStatsCard } from '../components/progress/QuizStatsCard';
import { RecommendedLessonCard } from '../components/dashboard/RecommendedLessonCard';
import { LEARNING_MODULES } from '../mock/modulesData';
import { TrendingUp, CheckCircle2, Clock, Award, BookOpen } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const ProgressPage: React.FC = () => {
  const { overallProgress, xp, moduleProgress } = useProgress();

  const masteredCount = Object.values(moduleProgress).filter((p) => p === 100).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 font-mono">
            Analytics & Skill Tree
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Learning Progress & Concept Mastery
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your progression across all quantum mechanics domains, assessment scores, and circuit certifications.
        </p>
      </div>

      {/* Overall Progress Hero Card */}
      <Card variant="glass" className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  <span>Overall Curriculum Mastery</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Aggregated across reading materials, circuit laboratories, and quizzes.
                </p>
              </div>
              <span className="text-2xl font-extrabold font-mono text-cyan-600 dark:text-cyan-300">
                {overallProgress}%
              </span>
            </div>

            <ProgressBar value={overallProgress} size="lg" variant="cyan" />

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>{masteredCount} of 7 Modules Mastered</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>{xp > 0 ? `${(xp * 0.05).toFixed(1)} Hours Logged` : '0 Hours Logged'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>{xp} XP Earned</span>
              </span>
            </div>
          </div>

          {/* Mini Milestone card */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">Next Milestone:</div>
            <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
              {overallProgress === 0 ? 'First Qubit State Initialized' : 'Bell State Certified'}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              {overallProgress === 0 
                ? 'Complete your first interactive mini-lesson in Quantum Computing Fundamentals.' 
                : 'Complete the Entanglement lab to unlock Quantum Key Distribution (QKD) topics.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Two-Column Grid: Left is Module Completion List, Right is Concept Mastery & Quiz Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Module Completion Breakdown (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                <BookOpen className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>Module Completion Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {LEARNING_MODULES.map((mod, idx) => {
                const currentModProgress = moduleProgress[mod.slug] ?? 0;
                const isComplete = currentModProgress === 100;
                return (
                  <div
                    key={mod.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 space-y-2 hover:border-slate-400 dark:hover:border-slate-750 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[10px] font-mono flex items-center justify-center text-slate-700 dark:text-slate-400">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{mod.title}</h5>
                      </div>
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <Badge variant="emerald">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </Badge>
                        ) : (
                          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300 font-medium">
                            {currentModProgress}%
                          </span>
                        )}
                      </div>
                    </div>
                    <ProgressBar
                      value={currentModProgress}
                      size="sm"
                      variant={isComplete ? 'emerald' : 'cyan'}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recommended Next Step */}
          <RecommendedLessonCard />
        </div>

        {/* Right Column: Concept Mastery & Quiz Stats (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <MasteryMeter />
          <QuizStatsCard />
        </div>
      </div>
    </div>
  );
};
