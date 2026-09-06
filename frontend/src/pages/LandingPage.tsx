import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Atom, 
  Cpu, 
  BookOpen, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  BarChart3, 
  Play, 
  Trophy,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const learningLoop = [
    { step: '01', title: 'Learn', desc: 'Interactive concept modules with mathematical Dirac notation and Bloch sphere visualization.', icon: BookOpen },
    { step: '02', title: 'Build', desc: 'Drag-and-drop quantum circuit studio with single and multi-qubit unitary gate placement.', icon: Cpu },
    { step: '03', title: 'Simulate', desc: 'Execute state vector simulation and projective measurement sampling powered by Aer.', icon: Play },
    { step: '04', title: 'Visualize', desc: 'Real-time probability histograms, Dirac state distributions, and phase angles.', icon: BarChart3 },
    { step: '05', title: 'Ask AI', desc: 'AI Quantum Tutor trained on quantum mechanics to unblock conceptual hurdles in real time.', icon: Bot },
    { step: '06', title: 'Practice', desc: 'Gamified circuit puzzles, Bell state synthesis, and algorithmic optimization challenges.', icon: Trophy },
    { step: '07', title: 'Track', desc: 'Granular skill tree analytics, quiz score mastery meters, and tailored learning paths.', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B13] text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#090D16]/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Atom className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">QuLearn</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">Smart India Hackathon</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <Link to="/dashboard" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">Dashboard</Link>
            <Link to="/learn" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">Curriculum</Link>
            <Link to="/lab" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">Circuit Studio</Link>
            <Link to="/challenges" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">Challenges</Link>
            <Link to="/tutor" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors">AI Tutor</Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle */}
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

            <Link to="/dashboard">
              <Button variant="secondary" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/lab">
              <Button variant="quantum" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Open Lab
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800/80">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>SIH Problem Statement: Interactive Quantum Algorithm Learning Platform</span>
            <Badge variant="cyan" size="sm">v1.0 MVP</Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Demystify Quantum Computing with <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-teal-400 to-indigo-500 dark:from-cyan-400 dark:via-teal-300 dark:to-indigo-400">Interactive Simulation & AI Guidance</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Move beyond static textbooks. Build real quantum circuits, simulate superposition and entanglement in your browser, and receive pedagogical guidance from an AI tutor powered by Gemini.
          </p>

          {/* Primary CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/learn">
              <Button variant="quantum" size="lg" leftIcon={<BookOpen className="w-4 h-4" />}>
                Start Learning
              </Button>
            </Link>
            <Link to="/lab">
              <Button variant="secondary" size="lg" leftIcon={<Cpu className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />}>
                Open Quantum Lab
              </Button>
            </Link>
          </div>

          {/* Interactive Circuit Hero Mockup */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 dark:from-slate-750 dark:via-slate-800/60 dark:to-slate-900 shadow-2xl dark:shadow-cyan-950/40 border border-slate-200 dark:border-slate-800">
            <div className="bg-white dark:bg-[#090D16] rounded-[15px] p-6 text-left space-y-4 shadow-inner">
              {/* Fake IDE Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">bell_state_circuit.py — Qiskit Aer Simulator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
                    State: (|00⟩ + |11⟩)/√2
                  </span>
                </div>
              </div>

              {/* Circuit Preview Lines */}
              <div className="space-y-4 py-2 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-600 dark:text-cyan-400 w-16">q[0] |0⟩ ─</span>
                  <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/50 font-bold">H</span>
                  <span className="text-slate-300 dark:text-slate-600">───────●────────────────</span>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px]">Measure</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-600 dark:text-cyan-400 w-16">q[1] |0⟩ ─</span>
                  <span className="text-slate-300 dark:text-slate-600">────────────</span>
                  <span className="px-3 py-1 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/50 font-bold">⊕</span>
                  <span className="text-slate-300 dark:text-slate-600">────────────</span>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px]">Measure</span>
                </div>
              </div>

              {/* Measurement collapse preview */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 dark:text-slate-400">|00⟩:</span>
                    <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 dark:bg-cyan-400 h-full w-1/2" />
                    </div>
                    <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">50.0%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 dark:text-slate-400">|11⟩:</span>
                    <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 dark:bg-indigo-400 h-full w-1/2" />
                    </div>
                    <span className="font-mono text-indigo-600 dark:text-indigo-300 font-bold">50.0%</span>
                  </div>
                </div>
                <span className="text-slate-500 text-[11px] font-mono">1024 shots sampled (0.42 ms)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core 7-Step Learning Loop */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="cyan" size="sm" className="mb-3">The Learning Loop</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learn → Build → Simulate → Visualize → Ask AI → Practice → Track
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
            A cohesive feedback cycle designed for rapid conceptual mastery of quantum computing fundamentals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningLoop.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} variant="interactive" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">{item.step}</span>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {learningLoop.slice(4).map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} variant="interactive" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">{item.step}</span>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-slate-100/50 dark:bg-[#090D16]/50 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="glass" className="p-6">
              <Cpu className="w-8 h-8 text-cyan-500 dark:text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Qiskit-Ready Circuit Architecture</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Compose single and two-qubit operations that translate directly to native Python Qiskit scripts and OpenQASM specifications.
              </p>
            </Card>

            <Card variant="glass" className="p-6">
              <Bot className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mb-4" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Context-Aware AI Quantum Tutor</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrated abstraction layer ready for Gemini API. The tutor inspects your active circuit state and active lesson to deliver hyper-specific pedagogical guidance.
              </p>
            </Card>

            <Card variant="glass" className="p-6">
              <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-400 mb-4" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Gamified Skill Tree & Challenges</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hands-on challenges testing superposition, Bell states, and Deutsch-Jozsa algorithms with instant feedback and XP progress tracking.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-10 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">QuLearn AI</span>
            <span className="text-xs text-slate-500">• Smart India Hackathon MVP</span>
          </div>
          <p className="text-xs text-slate-500">
            Designed for interactive quantum education. Powered by React, TypeScript, FastAPI, Qiskit & Gemini architecture.
          </p>
        </div>
      </footer>
    </div>
  );
};
