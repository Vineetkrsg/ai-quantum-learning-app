import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'neutral' | 'negative';
  icon: React.ReactNode;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType = 'positive',
  icon,
  description
}) => {
  const changeColors = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    neutral: 'text-slate-400 bg-slate-800/40 border-slate-700/40',
    negative: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  return (
    <Card variant="glass" className="p-5 relative overflow-hidden group hover:border-cyan-500/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">{value}</span>
            {change && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${changeColors[changeType]}`}>
                {change}
              </span>
            )}
          </div>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
    </Card>
  );
};
