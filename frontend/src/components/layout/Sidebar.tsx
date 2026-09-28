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
  X,
  Compass
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { CircuitLabIcon } from '../quantum/CircuitLabIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { overallProgress, xp, streakDays } = useProgress();
  const { startTour, startDemo } = useOnboarding();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: undefined },
    { to: '/learn', label: 'Interactive Learning', icon: BookOpen, badge: '7 Modules' },
    { to: '/lab', label: 'Quantum Circuit Lab', icon: CircuitLabIcon, badge: 'Studio' },
    { to: '/challenges', label: 'Challenges', icon: Trophy, badge: '4 New' },
    { to: '/progress', label: 'Progress Tracking', icon: TrendingUp, badge: `${overallProgress}%` },
    { to: '/tutor', label: 'AI Quantum Tutor', icon: Bot, badge: 'Assistant' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/95 dark:bg-[#0e141d]/95 backdrop-blur-xl border-r border-slate-200 dark:border-[#223043] 
        flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-[#223043]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-teal-800 dark:bg-teal-700 text-white p-0.5 shadow-sm border border-teal-900 dark:border-teal-500/40 group-hover:scale-105 transition-transform flex items-center justify-center">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-[#e6edf4] group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  QuLearn
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/30">
                  Lab
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Quantum Learning Platform</p>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#1b2636]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Curriculum & Tools
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `
                  group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-500/40 shadow-sm font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-[#1b2636]/60 border border-transparent'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse" />
                      )}
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1b2636] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2b3a4f]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Quick Launch */}
          <div className="pt-5 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Guided Learning & Onboarding
          </div>
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              startTour(0);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#151e2b] hover:bg-slate-100 dark:hover:bg-[#1b2636] border border-slate-200 dark:border-[#223043] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Platform Guided Tour</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              startDemo(0);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100/80 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-500/30 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Try Interactive Demo</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          </button>

          <div className="pt-3 px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Quick Launch
          </div>
          <Link
            to="/lab"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#151e2b] hover:bg-slate-100 dark:hover:bg-[#1b2636] border border-slate-200 dark:border-[#223043] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Launch Circuit Lab</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </Link>
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-[#1b2636]/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </div>
          </Link>
        </div>

        {/* User XP & Simulation Status Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-[#223043] bg-slate-50/60 dark:bg-[#0c111a]/60 space-y-2">
          <div className="p-3 rounded-xl bg-white dark:bg-[#151e2b] border border-slate-200 dark:border-[#223043] shadow-sm">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-current" />
                <span>{xp} XP</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{streakDays} Day Streak</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-[#0c111a] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 dark:bg-amber-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }} 
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>Simulator Ready</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">Statevector</span>
          </div>
        </div>
      </aside>
    </>
  );
};

