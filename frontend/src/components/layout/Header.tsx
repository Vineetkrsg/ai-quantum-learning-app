import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Menu, 
  Bot, 
  Bell, 
  Search,
  CheckCircle2,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { USER_OVERVIEW } from '../../mock/progressData';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { xp, streakDays } = useProgress();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard': return { title: 'Dashboard', category: 'Overview' };
      case '/learn': return { title: 'Interactive Learning', category: 'Curriculum' };
      case '/lab': return { title: 'Quantum Circuit Studio', category: 'Lab Environment' };
      case '/challenges': return { title: 'Challenges & Assessments', category: 'Practice' };
      case '/progress': return { title: 'Skill Tree & Progress', category: 'Analytics' };
      case '/tutor': return { title: 'AI Quantum Tutor', category: 'Gemini Assistant' };
      default: return { title: 'Platform', category: 'QuLearn' };
    }
  };

  const { title, category } = getPageTitle(location.pathname);

  return (
    <header className="h-16 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left section: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>QuLearn</span>
            <span>/</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">{category}</span>
          </div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-0.5">
            {title}
          </h1>
        </div>
      </div>

      {/* Center/Right section */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search trigger mock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Search concepts, gates, algorithms...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 font-mono">
            Ctrl+K
          </kbd>
        </div>

        {/* AI Tutor shortcut */}
        <Link
          to="/tutor"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 text-xs font-medium hover:border-cyan-400/50 transition-all shadow-sm"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="hidden sm:inline">Ask AI Tutor</span>
        </Link>

        {/* System status pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="font-mono">Aer Sim Ready</span>
        </div>

        {/* Light/Dark Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Notification indicator */}
        <button
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-white dark:ring-slate-950" />
        </button>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-cyan-500/10">
            <span className="font-mono">QS</span>
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{USER_OVERVIEW.name}</div>
            <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
