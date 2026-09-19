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
  Contrast, 
  Zap,
  Compass,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { USER_OVERVIEW } from '../../mock/progressData';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const location = useLocation();
  const { theme, cycleTheme } = useTheme();
  const { xp } = useProgress();
  const { startTour, startDemo } = useOnboarding();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard': return { title: 'Dashboard', category: 'Overview' };
      case '/learn': return { title: 'Interactive Learning', category: 'Curriculum' };
      case '/lab': return { title: 'Circuit Lab', category: 'Lab Environment' };
      case '/challenges': return { title: 'Challenges & Assessments', category: 'Practice' };
      case '/progress': return { title: 'Skill Tree & Progress', category: 'Analytics' };
      case '/tutor': return { title: 'AI Quantum Tutor', category: 'Pedagogical Assistant' };
      default: return { title: 'Platform', category: 'QuLearn' };
    }
  };

  const { title, category } = getPageTitle(location.pathname);

  const getThemeDetails = () => {
    switch (theme) {
      case 'dark':
        return {
          icon: <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />,
          label: 'Dark Mode',
          next: 'Switch to Light Mode'
        };
      case 'light':
        return {
          icon: <Contrast className="w-4 h-4 text-slate-800 hover:scale-110 transition-transform" />,
          label: 'Light Mode',
          next: 'Switch to High Contrast'
        };
      case 'high-contrast':
        return {
          icon: <Moon className="w-4 h-4 text-teal-800 dark:text-teal-400 hover:-rotate-12 transition-transform" />,
          label: 'High Contrast',
          next: 'Switch to Dark Mode'
        };
    }
  };

  const themeInfo = getThemeDetails();

  return (
    <header className="h-16 bg-white/95 dark:bg-[#0e141d]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#223043] sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left section: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#1b2636] transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>QuLearn</span>
            <span>/</span>
            <span className="text-teal-700 dark:text-teal-400 font-semibold">{category}</span>
          </div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900 dark:text-[#e6edf4] tracking-tight leading-none mt-0.5">
            {title}
          </h1>
        </div>
      </div>

      {/* Center/Right section */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search trigger mock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151e2b] border border-slate-200 dark:border-[#223043] text-xs text-slate-500 dark:text-slate-400">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Search concepts, gates, algorithms...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1b2636] text-[10px] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-[#2b3a4f] font-mono">
            Ctrl+K
          </kbd>
        </div>

        {/* Guided Tour & Demo Quick Actions */}
        <button
          onClick={() => startTour(0)}
          title="Take Guided Platform Tour"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b2636] border border-slate-200 dark:border-[#223043] transition-colors text-xs font-medium cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="hidden xl:inline">Tour</span>
        </button>

        <button
          onClick={() => startDemo(0)}
          title="Try Interactive Quantum Experiment"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 hover:border-teal-500 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Demo</span>
        </button>

        {/* AI Tutor shortcut */}
        <Link
          to="/tutor"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 text-teal-800 dark:text-teal-300 hover:border-teal-500 text-xs font-semibold transition-colors shadow-sm"
        >
          <Bot className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
          <span className="hidden sm:inline">Ask AI Tutor</span>
        </Link>

        {/* System status pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#151e2b] border border-slate-200 dark:border-[#223043] text-[11px] text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-mono">Aer Sim Ready</span>
        </div>

        {/* 3-Way Theme Switcher Button */}
        <button
          onClick={cycleTheme}
          aria-label={themeInfo.next}
          title={`${themeInfo.label} — Click to ${themeInfo.next}`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b2636] border border-slate-200 dark:border-[#223043] transition-colors text-xs font-medium"
        >
          {themeInfo.icon}
          <span className="hidden xl:inline text-[11px] font-mono capitalize">{theme.replace('-', ' ')}</span>
        </button>

        {/* Notification indicator */}
        <button
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#1b2636] transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white dark:ring-[#0e141d]" />
        </button>

        {/* User profile avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-[#223043]">
          <div className="w-8 h-8 rounded-lg bg-teal-800 dark:bg-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-sm border border-teal-900 dark:border-teal-500/40">
            <span className="font-mono">QS</span>
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-[#e6edf4] leading-tight">{USER_OVERVIEW.name}</div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

