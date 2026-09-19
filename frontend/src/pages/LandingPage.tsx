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
import { CircuitLabIcon } from '../components/quantum/CircuitLabIcon';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { theme, cycleTheme } = useTheme();

  const learningLoop = [
    { step: '01', title: 'Learn', desc: 'Interactive concept modules with mathematical Dirac notation and Bloch sphere visualization.', icon: BookOpen },
    { step: '02', title: 'Build', desc: 'Drag-and-drop Circuit Lab with single and multi-qubit unitary gate placement.', icon: CircuitLabIcon },
    { step: '03', title: 'Simulate', desc: 'Execute state vector simulation and projective measurement sampling powered by Aer.', icon: Play },
    { step: '04', title: 'Visualize', desc: 'Real-time probability histograms, Dirac state distributions, and phase angles.', icon: BarChart3 },
    { step: '05', title: 'Ask AI', desc: 'AI Quantum Tutor trained on quantum mechanics to unblock conceptual hurdles in real time.', icon: Bot },
    { step: '06', title: 'Practice', desc: 'Gamified circuit puzzles, Bell state synthesis, and algorithmic optimization challenges.', icon: Trophy },
    { step: '07', title: 'Track', desc: 'Granular skill tree analytics, quiz score mastery meters, and tailored learning paths.', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--fg-main)] selection:bg-sciteal-500/20 selection:text-[var(--fg-main)] transition-colors duration-200">
      {/* Top Navbar */}
      <nav className="border-b border-[var(--border-card)] bg-[var(--bg-canvas)]/90 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 flex items-center justify-center font-bold">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-[var(--fg-main)]">QuLearn</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 font-semibold border border-sciteal-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-[var(--fg-muted)] hidden sm:inline">Smart India Hackathon</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-[var(--fg-muted)] font-medium">
            <Link to="/dashboard" className="hover:text-sciteal-700 dark:hover:text-sciteal-300 transition-colors">Dashboard</Link>
            <Link to="/learn" className="hover:text-sciteal-700 dark:hover:text-sciteal-300 transition-colors">Curriculum</Link>
            <Link to="/lab" className="hover:text-sciteal-700 dark:hover:text-sciteal-300 transition-colors">Circuit Lab</Link>
            <Link to="/challenges" className="hover:text-sciteal-700 dark:hover:text-sciteal-300 transition-colors">Challenges</Link>
            <Link to="/tutor" className="hover:text-sciteal-700 dark:hover:text-sciteal-300 transition-colors">AI Tutor</Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* 3-Theme Cycle Toggle */}
            <button
              onClick={cycleTheme}
              aria-label={`Current theme: ${theme}. Click to switch theme.`}
              title={`Current theme: ${theme}. Click to cycle.`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-[var(--fg-muted)] hover:text-[var(--fg-main)] hover:bg-[var(--surface-hover)] border border-[var(--border-card)] transition-colors"
            >
              {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-sciteal-400" />}
              {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {theme === 'high-contrast' && <span className="w-3 h-3 rounded-full border-2 border-black dark:border-white bg-current" />}
              <span className="hidden sm:inline capitalize">{theme}</span>
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
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-[var(--border-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-card)] text-xs text-[var(--fg-muted)] mb-6 shadow-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-sciteal-600 dark:text-sciteal-400" />
            <span>Interactive Quantum Algorithm Learning Platform</span>
            <Badge variant="teal" size="sm">v1.0 Platform</Badge>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--fg-main)] max-w-4xl mx-auto leading-[1.1]">
            Demystify Quantum Computing with <span className="text-sciteal-700 dark:text-sciteal-400">Interactive Simulation & AI Guidance</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[var(--fg-muted)] max-w-2xl mx-auto leading-relaxed">
            Move beyond static textbooks. Build quantum circuits, simulate superposition and entanglement in your browser, and receive pedagogical guidance from an AI tutor powered by Gemini architecture.
          </p>

          {/* Primary CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/learn">
              <Button variant="quantum" size="lg" leftIcon={<BookOpen className="w-4 h-4" />}>
                Start Learning
              </Button>
            </Link>
            <Link to="/lab">
              <Button variant="secondary" size="lg" leftIcon={<CircuitLabIcon className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />}>
                Open Circuit Lab
              </Button>
            </Link>
          </div>

          {/* Interactive Circuit Hero Mockup */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl p-1 bg-[var(--surface-sunken)] border border-[var(--border-card)] shadow-md">
            <div className="bg-[var(--surface-card)] rounded-[15px] p-6 text-left space-y-4">
              {/* Notebook Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-card)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span className="text-xs font-mono text-[var(--fg-muted)] ml-2">bell_state_circuit.py — Qiskit Aer Simulator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-400 font-semibold">
                    State: (|00⟩ + |11⟩)/√2
                  </span>
                </div>
              </div>

              {/* Circuit Preview Lines */}
              <div className="space-y-4 py-2 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-sciteal-700 dark:text-sciteal-400 font-bold w-16">q[0] |0⟩ ─</span>
                  <span className="px-3 py-1 rounded bg-sciteal-500/15 text-sciteal-800 dark:text-sciteal-300 border border-sciteal-500/40 font-bold">H</span>
                  <span className="text-[var(--circuit-wire)] opacity-70">───────●────────────────</span>
                  <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[10px] font-semibold">Measure</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sciteal-700 dark:text-sciteal-400 font-bold w-16">q[1] |0⟩ ─</span>
                  <span className="text-[var(--circuit-wire)] opacity-70">────────────</span>
                  <span className="px-3 py-1 rounded bg-slate-500/15 text-[var(--fg-main)] border border-[var(--border-card)] font-bold">⊕</span>
                  <span className="text-[var(--circuit-wire)] opacity-70">────────────</span>
                  <span className="px-2 py-1 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/40 text-[10px] font-semibold">Measure</span>
                </div>
              </div>

              {/* Measurement collapse preview */}
              <div className="pt-3 border-t border-[var(--border-card)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[var(--fg-muted)]">|00⟩:</span>
                    <div className="w-24 bg-[var(--surface-sunken)] h-2 rounded-full overflow-hidden border border-[var(--border-card)]">
                      <div className="bg-[var(--visualization-bar)] h-full w-1/2" />
                    </div>
                    <span className="font-mono text-[var(--fg-main)] font-bold">50.0%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[var(--fg-muted)]">|11⟩:</span>
                    <div className="w-24 bg-[var(--surface-sunken)] h-2 rounded-full overflow-hidden border border-[var(--border-card)]">
                      <div className="bg-[var(--visualization-bar)] h-full w-1/2" />
                    </div>
                    <span className="font-mono text-[var(--fg-main)] font-bold">50.0%</span>
                  </div>
                </div>
                <span className="text-[var(--fg-muted)] text-[11px] font-mono">1024 shots sampled (0.42 ms)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core 7-Step Learning Loop */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="teal" size="sm" className="mb-3">The Learning Loop</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--fg-main)] tracking-tight">
            Learn → Build → Simulate → Visualize → Ask AI → Practice → Track
          </h2>
          <p className="mt-3 text-[var(--fg-muted)] max-w-xl mx-auto text-sm">
            A cohesive feedback cycle designed for rapid conceptual mastery of quantum computing fundamentals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningLoop.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} variant="interactive" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 font-bold">{item.step}</span>
                  <div className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[var(--fg-main)] mb-2">{item.title}</h3>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{item.desc}</p>
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
                  <span className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 font-bold">{item.step}</span>
                  <div className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] text-sciteal-700 dark:text-sciteal-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-[var(--fg-main)] mb-2">{item.title}</h3>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-[var(--surface-sunken)] border-t border-[var(--border-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="default" className="p-6">
              <Cpu className="w-8 h-8 text-sciteal-600 dark:text-sciteal-400 mb-4" />
              <h4 className="text-base font-bold text-[var(--fg-main)] mb-2">Qiskit-Ready Circuit Architecture</h4>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                Compose single and two-qubit operations that translate directly to native Python Qiskit scripts and OpenQASM specifications.
              </p>
            </Card>

            <Card variant="default" className="p-6">
              <Bot className="w-8 h-8 text-sciteal-600 dark:text-sciteal-400 mb-4" />
              <h4 className="text-base font-bold text-[var(--fg-main)] mb-2">Context-Aware AI Quantum Tutor</h4>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                Integrated pedagogical assistant powered by Gemini architecture. The tutor inspects your active circuit state and active lesson to deliver hyper-specific guidance.
              </p>
            </Card>

            <Card variant="default" className="p-6">
              <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-4" />
              <h4 className="text-base font-bold text-[var(--fg-main)] mb-2">Gamified Skill Tree & Challenges</h4>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                Hands-on challenges testing superposition, Bell states, and Deutsch-Jozsa algorithms with instant feedback and XP progress tracking.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-card)] py-10 bg-[var(--bg-canvas)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span className="font-bold text-[var(--fg-main)] text-sm">QuLearn AI</span>
            <span className="text-xs text-[var(--fg-muted)]">• Smart India Hackathon MVP</span>
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            Designed for interactive quantum education. Powered by React, TypeScript, FastAPI, Qiskit & Gemini architecture.
          </p>
        </div>
      </footer>
    </div>
  );
};
