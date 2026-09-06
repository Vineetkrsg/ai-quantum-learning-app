import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Cpu, 
  Trophy, 
  TrendingUp, 
  Bot, 
  Atom, 
  ExternalLink,
  Zap,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { overallProgress, xp, streakDays } = useProgress();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
    { to: '/learn', label: 'Interactive Learning', icon: BookOpen, badge: '7 Modules' },
    { to: '/lab', label: 'Quantum Lab', icon: Cpu, badge: 'Studio' },
    { to: '/challenges', label: 'Challenges', icon: Trophy, badge: '4 New' },
    { to: '/progress', label: 'Progress Tracking', icon: TrendingUp, badge: `${overallProgress}%` },
    { to: '/tutor', label: 'AI Quantum Tutor', icon: Bot, badge: 'Gemini' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/80 
        flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Atom className="w-5 h-5 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  QuLearn
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">SIH Quantum Platform</p>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* External links / Quick actions */}
          <div className="pt-5 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Launch
          </div>
          <Link
            to="/lab"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Launch Bell State Lab</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </Link>
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </div>
          </Link>
        </div>

        {/* User XP & Simulation Status Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-current" />
                <span>{xp} XP</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{streakDays} Day Streak</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>Simulator Ready</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">v1.0 MVP</span>
          </div>
        </div>
      </aside>
    </>
  );
};
