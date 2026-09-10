import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Cpu, Trophy, BookOpen, Clock, Sparkles, ArrowRight, Award } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const RecentActivityCard: React.FC = () => {
  const { recentActivities } = useProgress();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'circuit':
        return {
          icon: Cpu,
          color: 'text-sciteal-700 dark:text-sciteal-300 bg-sciteal-500/10 border-sciteal-500/30'
        };
      case 'quiz':
        return {
          icon: Trophy,
          color: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30'
        };
      case 'challenge':
        return {
          icon: Award,
          color: 'text-slate-700 dark:text-slate-300 bg-slate-500/10 border-slate-500/30'
        };
      default:
        return {
          icon: BookOpen,
          color: 'text-sciteal-700 dark:text-sciteal-300 bg-sciteal-500/10 border-sciteal-500/30'
        };
    }
  };

  return (
    <Card variant="default">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          <Clock className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {recentActivities.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-xl border border-dashed border-[var(--border-card)] bg-[var(--surface-sunken)]">
            <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-sciteal-500/10 flex items-center justify-center text-sciteal-600 dark:text-sciteal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[var(--fg-main)]">
              No recent activity yet
            </p>
            <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-sm mx-auto">
              Start your first lesson in Quantum Computing Fundamentals to begin logging your interactive learning progress!
            </p>
            <Link 
              to="/learn/fundamentals" 
              className="inline-flex items-center gap-1.5 mt-3.5 px-3.5 py-1.5 rounded-lg bg-sciteal-500/10 hover:bg-sciteal-500/20 border border-sciteal-500/30 text-sciteal-700 dark:text-sciteal-300 text-xs font-semibold transition-colors"
            >
              <span>Start First Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          recentActivities.map((act) => {
            const { icon: Icon, color } = getIconForType(act.type);
            return (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] hover:border-[var(--border-highlight)] transition-colors"
              >
                <div className={`p-2 rounded-lg border ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-semibold text-[var(--fg-main)] truncate">{act.title}</h5>
                    <span className="text-[10px] text-[var(--fg-muted)] font-mono">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-[var(--fg-muted)] mt-0.5 truncate">{act.detail}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
