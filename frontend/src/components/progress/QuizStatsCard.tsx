import React from 'react';
import { QUIZ_STATS } from '../../mock/progressData';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const QuizStatsCard: React.FC = () => {
  const { quizStats } = useProgress();
  const displayStats = quizStats.length > 0 ? quizStats : QUIZ_STATS;

  const averageScore = displayStats.length > 0
    ? `${Math.round(displayStats.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / displayStats.length)}% Avg`
    : '0.0% Avg';

  return (
    <Card variant="default">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Quiz & Assessment Performance</span>
          </CardTitle>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold">
            {averageScore}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        {displayStats.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-xl border border-dashed border-[var(--border-card)] bg-[var(--surface-sunken)]">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-500 dark:text-amber-400" />
            <p className="text-xs font-semibold text-[var(--fg-main)]">
              No quiz attempts yet
            </p>
            <p className="text-[11px] text-[var(--fg-muted)] mt-1">
              Complete the self-check questions in any lesson or take an assessment to log your performance.
            </p>
          </div>
        ) : (
          displayStats.map((quiz) => {
            const scorePercent = Math.round((quiz.score / quiz.totalQuestions) * 100);
            return (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)]"
              >
                <div>
                  <h5 className="text-xs font-semibold text-[var(--fg-main)]">{quiz.topic}</h5>
                  <span className="text-[10px] text-[var(--fg-muted)] font-mono">{quiz.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 font-bold">
                    {quiz.score}/{quiz.totalQuestions} ({scorePercent}%)
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
