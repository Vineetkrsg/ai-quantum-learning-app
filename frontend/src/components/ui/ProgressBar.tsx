import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  variant?: 'cyan' | 'teal' | 'indigo' | 'slate' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  variant = 'cyan',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const barStyles = {
    cyan: 'bg-teal-600 dark:bg-teal-500',
    teal: 'bg-teal-600 dark:bg-teal-500',
    indigo: 'bg-slate-600 dark:bg-slate-400',
    slate: 'bg-slate-600 dark:bg-slate-400',
    emerald: 'bg-emerald-600 dark:bg-emerald-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Progress</span>
          <span className="text-teal-700 dark:text-teal-300 font-mono font-semibold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-[#111823] rounded-full overflow-hidden border border-slate-300 dark:border-[#223043] ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} ${barStyles[variant]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

