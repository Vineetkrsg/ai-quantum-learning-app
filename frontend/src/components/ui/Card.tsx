import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'flat';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-150';
  
  const variantStyles = {
    default: 'bg-white dark:bg-[#151e2b] border-slate-200 dark:border-[#223043] text-slate-900 dark:text-[#e6edf4] shadow-sm',
    glass: 'bg-white/95 dark:bg-[#151e2b]/95 border-slate-200 dark:border-[#223043] text-slate-900 dark:text-[#e6edf4] shadow-sm',
    interactive: 'bg-white dark:bg-[#151e2b] border-slate-200 dark:border-[#223043] text-slate-900 dark:text-[#e6edf4] shadow-sm hover:border-teal-600/50 dark:hover:border-teal-500/50 cursor-pointer',
    flat: 'bg-slate-50 dark:bg-[#111823] border-slate-200 dark:border-[#1e2a3b] text-slate-900 dark:text-[#e6edf4]'
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-slate-200 dark:border-[#223043] ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-slate-50/70 dark:bg-[#111823]/60 border-t border-slate-200 dark:border-[#223043] rounded-b-xl flex items-center ${className}`}>{children}</div>
);

