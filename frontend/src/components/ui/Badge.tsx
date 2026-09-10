import React from 'react';

export interface BadgeProps {
  variant?: 'cyan' | 'teal' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate' | 'rose';
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
    cyan: 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-500/40',
    teal: 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-500/40',
    indigo: 'bg-slate-100 dark:bg-[#1b2636] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-[#2b3a4f]',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40',
    purple: 'bg-slate-100 dark:bg-[#1b2636] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-[#2b3a4f]',
    slate: 'bg-slate-100 dark:bg-[#1b2636] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#2b3a4f]',
    rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40',
  };

  const dotColors = {
    cyan: 'bg-teal-600 dark:bg-teal-400',
    teal: 'bg-teal-600 dark:bg-teal-400',
    indigo: 'bg-slate-600 dark:bg-slate-400',
    emerald: 'bg-emerald-600 dark:bg-emerald-400',
    amber: 'bg-amber-600 dark:bg-amber-400',
    purple: 'bg-slate-600 dark:bg-slate-400',
    slate: 'bg-slate-500 dark:bg-slate-400',
    rose: 'bg-rose-600 dark:bg-rose-400',
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

