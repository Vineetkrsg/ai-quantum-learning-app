import React, { useState } from 'react';
import { LEARNING_MODULES } from '../mock/modulesData';
import { ModuleCard } from '../components/learning/ModuleCard';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Search, Sparkles } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export const LearnPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { completedLessons, overallProgress } = useProgress();

  const filterTabs = [
    { id: 'all', label: 'All Modules', count: LEARNING_MODULES.length },
    { id: 'beginner', label: 'Beginner', count: LEARNING_MODULES.filter(m => m.difficulty === 'Beginner').length },
    { id: 'intermediate', label: 'Intermediate', count: LEARNING_MODULES.filter(m => m.difficulty === 'Intermediate').length },
    { id: 'advanced', label: 'Advanced', count: LEARNING_MODULES.filter(m => m.difficulty === 'Advanced').length },
  ];

  const filteredModules = LEARNING_MODULES.filter((mod) => {
    const matchesCategory = 
      activeCategory === 'all' || 
      mod.difficulty.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch = 
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const totalLessons = LEARNING_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
              Core Curriculum
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--fg-main)] tracking-tight">
            Interactive Quantum Learning Modules
          </h2>
          <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
            Master quantum computing from foundational Dirac notation to advanced multi-qubit algorithms.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or gates..."
            className="w-full bg-[var(--surface-card)] border border-[var(--border-card)] rounded-xl pl-9 pr-4 py-2 text-xs text-[var(--fg-main)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-sciteal-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Curriculum Completion Banner */}
      <Card variant="default" className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--fg-main)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
              <span>Curriculum Completion Status</span>
            </h3>
            <p className="text-xs text-[var(--fg-muted)]">
              {completedCount} of {totalLessons} interactive lessons completed across 7 modules
            </p>
          </div>
          <div className="w-full sm:w-64 space-y-1">
            <ProgressBar value={overallProgress} showLabel size="md" variant="cyan" />
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs
          tabs={filterTabs}
          activeTab={activeCategory}
          onChange={setActiveCategory}
        />
        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          Showing {filteredModules.length} Modules
        </span>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
};
