import React from 'react';

export interface BadgeProps {
  variant?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate' | 'rose';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  size = 'sm',
  children,
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-medium'
  };

  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };

  const dotColors = {
    cyan: 'bg-cyan-400',
    indigo: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    purple: 'bg-purple-400',
    slate: 'bg-slate-400',
    rose: 'bg-rose-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
