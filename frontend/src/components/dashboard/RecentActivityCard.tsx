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
          color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
        };
      case 'quiz':
        return {
          icon: Trophy,
          color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
        };
      case 'challenge':
        return {
          icon: Award,
          color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'
        };
      default:
        return {
          icon: BookOpen,
          color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
        };
    }
  };

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          <Clock className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {recentActivities.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-350 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
            <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No recent activity yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Start your first lesson in Quantum Computing Fundamentals to begin logging your interactive learning progress!
            </p>
            <Link 
              to="/learn/fundamentals" 
              className="inline-flex items-center gap-1.5 mt-3.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold transition-colors"
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
                className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className={`p-2 rounded-lg border ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{act.title}</h5>
                    <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate">{act.detail}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
