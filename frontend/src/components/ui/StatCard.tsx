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
    positive: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 font-medium',
    neutral: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1b2636] border-slate-300 dark:border-[#2b3a4f] font-medium',
    negative: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 font-medium'
  };

  return (
    <Card variant="interactive" className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#e6edf4] font-mono">{value}</span>
            {change && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${changeColors[changeType]}`}>
                {change}
              </span>
            )}
          </div>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#1b2636] text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-[#2b3a4f]">
          {icon}
        </div>
      </div>
    </Card>
  );
};

