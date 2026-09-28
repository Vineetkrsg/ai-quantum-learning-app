import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TutorPanel } from '../components/tutor/TutorPanel';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Bot, Atom, BookOpen, Sparkles, Layers, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { TutorAtmosphere } from '../components/tutor/TutorAtmosphere';
import { QuantumBackground } from '../components/quantum/visual/QuantumBackground';

export const TutorPage: React.FC = () => {
  const [selectedCircuit, setSelectedCircuit] = useState('Bell State (|Φ⁺⟩)');
  const [selectedLesson, setSelectedLesson] = useState('Module 3: Superposition');
  const [isTyping, setIsTyping] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  const quantumFormulas = [
    { title: 'Superposition State', formula: '|ψ⟩ = α|0⟩ + β|1⟩', note: '|α|² + |β|² = 1' },
    { title: 'Hadamard Transform', formula: 'H|0⟩ = (|0⟩ + |1⟩)/√2', note: 'Maps Z-basis to X-basis' },
    { title: 'Bell State (|Φ⁺⟩)', formula: 'CNOT · (H ⊗ I)|00⟩', note: '(|00⟩ + |11⟩)/√2' },
    { title: 'Bloch Representation', formula: 'cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩', note: 'Unit sphere in ℝ³' },
  ];

  return (
    <div className="space-y-6 relative" data-tour="tutor-page">
      {/* Background ambient quantum traces */}
      <QuantumBackground variant="subtle" />

      {/* Living Quantum Assistant Status & Atmospheric Header with live typing feedback */}
      <TutorAtmosphere
        isTyping={isTyping}
        onSelectPrompt={(query) => setExternalPrompt(query)}
      />

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-sunken)] text-sciteal-700 dark:text-sciteal-300 border border-[var(--border-card)] font-mono font-semibold">
            AI Tutor · Pedagogical Engine Active
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[var(--fg-main)] tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-sciteal-600 dark:text-sciteal-400" />
          <span>AI Quantum Tutor</span>
        </h2>
        <p className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
          Pedagogical guidance, circuit debugging, and mathematical derivations tailored to your active quantum state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Context & Formula Reference (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Context Card */}
          <Card variant="default">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                <Info className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                <span>Active Learning Context</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-[var(--fg-muted)]">Active Circuit Context</span>
                  <Link to="/lab" className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 hover:underline flex items-center gap-0.5">
                    <span>Open in Lab</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
                <div className="font-semibold text-[var(--fg-main)] flex items-center gap-2">
                  <Atom className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                  <span>{selectedCircuit}</span>
                </div>
                <div className="text-[11px] text-[var(--fg-muted)] font-mono">
                  2 Qubits • 4 Gates (H, CNOT, M0, M1)
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-[var(--fg-muted)]">Active Curriculum Context</span>
                  <Link to="/learn/superposition" className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 hover:underline flex items-center gap-0.5">
                    <span>Open Module</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
                <div className="font-semibold text-[var(--fg-main)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
                  <span>{selectedLesson}</span>
                </div>
                <div className="text-[11px] text-[var(--fg-muted)]">
                  Focus: Probability amplitudes, phase kickback
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Context injected into prompt payload</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Quantum Reference Formulas with click-to-ask interaction */}
          <Card variant="default">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Dirac & State Reference</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-1">
              <p className="text-[11px] text-[var(--fg-muted)]">
                Click any formula to ask the AI Tutor for a step-by-step derivation:
              </p>
              {quantumFormulas.map((f) => (
                <button
                  key={f.title}
                  onClick={() => setExternalPrompt(`Explain the mathematical derivation and physical meaning of ${f.title}: ${f.formula}`)}
                  className="w-full text-left p-2.5 rounded-lg bg-[var(--surface-sunken)] hover:bg-[var(--surface-subtle)] border border-[var(--border-card)] hover:border-sciteal-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] text-[var(--fg-muted)] font-medium">
                    <span>{f.title}</span>
                    <span className="text-[10px] font-mono text-sciteal-700 dark:text-sciteal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ask Tutor →
                    </span>
                  </div>
                  <div className="text-xs font-mono text-sciteal-700 dark:text-sciteal-400 font-bold mt-0.5 group-hover:text-sciteal-600">
                    {f.formula}
                  </div>
                  <div className="text-[10px] text-[var(--fg-muted)] mt-1">{f.note}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Primary Chat Interface (Span 8) */}
        <div className="lg:col-span-8">
          <TutorPanel
            context={{
              currentCircuitName: selectedCircuit,
              qubitCount: 2,
              gateCount: 4,
              activeLessonTitle: selectedLesson
            }}
            externalPrompt={externalPrompt}
            onClearExternalPrompt={() => setExternalPrompt(null)}
            onTypingStateChange={(typing) => setIsTyping(typing)}
          />
        </div>
      </div>
    </div>
  );
};
