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
  const baseStyles = 'rounded-xl border transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-white/95 dark:bg-slate-900/80 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm',
    glass: 'bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border-slate-300 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 shadow-lg shadow-black/5 dark:shadow-black/20',
    interactive: 'bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border-slate-300 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 shadow-lg shadow-black/5 dark:shadow-black/20 hover:border-cyan-500/60 hover:shadow-cyan-500/10 cursor-pointer',
    flat: 'bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-850 text-slate-900 dark:text-slate-100'
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
  <div className={`px-6 py-5 border-b border-slate-300/80 dark:border-slate-800/60 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-600 dark:text-slate-400 mt-1 ${className}`}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-slate-100/80 dark:bg-slate-950/30 border-t border-slate-300/80 dark:border-slate-800/60 rounded-b-xl flex items-center ${className}`}>{children}</div>
);
