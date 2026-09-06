import React, { useState } from 'react';
import { TutorPanel } from '../components/tutor/TutorPanel';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Bot, Atom, BookOpen, Sparkles, Layers, Info, CheckCircle2 } from 'lucide-react';

export const TutorPage: React.FC = () => {
  const [selectedCircuit, setSelectedCircuit] = useState('Bell State (|Φ⁺⟩)');
  const [selectedLesson, setSelectedLesson] = useState('Module 3: Superposition');

  const quantumFormulas = [
    { title: 'Superposition State', formula: '|ψ⟩ = α|0⟩ + β|1⟩', note: '|α|² + |β|² = 1' },
    { title: 'Hadamard Transform', formula: 'H|0⟩ = (|0⟩ + |1⟩)/√2', note: 'Maps Z-basis to X-basis' },
    { title: 'Bell State (|Φ⁺⟩)', formula: 'CNOT · (H ⊗ I)|00⟩', note: '(|00⟩ + |11⟩)/√2' },
    { title: 'Bloch Representation', formula: 'cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩', note: 'Unit sphere in ℝ³' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
            Gemini AI Integration Ready
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-cyan-400" />
          <span>AI Quantum Tutor</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pedagogical guidance, circuit debugging, and mathematical derivations tailored to your active quantum state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Context & Formula Reference (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Context Card */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Active Learning Context</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500">Active Circuit Context</span>
                <div className="font-semibold text-white flex items-center gap-2">
                  <Atom className="w-4 h-4 text-cyan-400" />
                  <span>{selectedCircuit}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  2 Qubits • 4 Gates (H, CNOT, M0, M1)
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500">Active Curriculum Context</span>
                <div className="font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>{selectedLesson}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Focus: Probability amplitudes, phase kickback
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Context injected into prompt prompt payload</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Quantum Reference Formulas */}
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Dirac & State Reference</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {quantumFormulas.map((f) => (
                <div key={f.title} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">{f.title}</div>
                  <div className="text-xs font-mono text-cyan-300 font-bold mt-0.5">{f.formula}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{f.note}</div>
                </div>
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
          />
        </div>
      </div>
    </div>
  );
};
