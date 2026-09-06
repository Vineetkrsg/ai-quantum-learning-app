import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  showLabel?: boolean;
  variant?: 'cyan' | 'indigo' | 'emerald';
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
    md: 'h-2.5',
    lg: 'h-4'
  };

  const barStyles = {
    cyan: 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-sm shadow-cyan-500/50',
    indigo: 'bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-sm shadow-indigo-500/50',
    emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/50'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="text-slate-400">Progress</span>
          <span className="text-cyan-300 font-mono font-medium">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-750 ${sizeStyles[size]}`}>
        <div
          className={`${sizeStyles[size]} ${barStyles[variant]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
