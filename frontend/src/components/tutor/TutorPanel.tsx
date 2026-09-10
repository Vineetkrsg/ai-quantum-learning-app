import React, { useState } from 'react';
import { ChatMessage, SuggestedPrompt, TutorContext } from '../../types/tutor';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Bot, Send, Sparkles, User, Atom, Lightbulb, BookOpen, Layers } from 'lucide-react';

interface TutorPanelProps {
  context?: TutorContext;
  compact?: boolean;
}

export const TutorPanel: React.FC<TutorPanelProps> = ({ context, compact = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'tutor',
      text: "Hello! I am your AI Quantum Tutor. I can help clarify quantum mechanics postulates, guide your circuit design, debug state vectors, or explain mathematical bra-ket formalism. What concept would you like to explore?",
      timestamp: 'Just now',
      referencedConcepts: ['Superposition', 'Bloch Sphere', 'Entanglement']
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts: SuggestedPrompt[] = [
    {
      id: 'sp-1',
      label: 'Explain Bell State',
      query: 'How do Hadamard and CNOT gates create the maximally entangled Bell state?',
      category: 'intuition'
    },
    {
      id: 'sp-2',
      label: 'What is Superposition?',
      query: 'What is the physical meaning of quantum superposition vs classical randomness?',
      category: 'intuition'
    },
    {
      id: 'sp-3',
      label: 'Bloch Sphere Coordinates',
      query: 'How are the theta and phi angles mapped on the Bloch sphere for state |+⟩?',
      category: 'math'
    },
    {
      id: 'sp-4',
      label: 'Phase Kickback Trick',
      query: 'How does phase kickback work in the Deutsch-Jozsa and Grover algorithms?',
      category: 'circuit'
    }
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate pedagogical AI response (Gemini integration hook)
    setTimeout(() => {
      let replyText = '';
      let concepts: string[] = [];

      const q = query.toLowerCase();
      if (q.includes('bell') || q.includes('entangle')) {
        replyText = "In a Bell State (|Φ⁺⟩ = (|00⟩ + |11⟩)/√2), the two qubits lose individual identities. When you measure Qubit 0, it collapses to either |0⟩ or |1⟩ with 50% probability, and Qubit 1 collapses instantaneously to the exact same value. In the lab, try placing an H gate on Q0 and a CNOT with Q0 as control!";
        concepts = ['Bell State', 'Entanglement', 'EPR Pair', 'CNOT'];
      } else if (q.includes('superposition') || q.includes('hadamard')) {
        replyText = "A classical bit is definitively either 0 or 1. A qubit in superposition |ψ⟩ = α|0⟩ + β|1⟩ has continuous probability amplitudes. Applying the Hadamard matrix puts state |0⟩ into equal amplitudes 1/√2 (|0⟩ + |1⟩), so measurement yields 50% chance for each state.";
        concepts = ['Hadamard Transform', 'Probability Amplitudes', 'Born Rule'];
      } else if (q.includes('bloch')) {
        replyText = "The Bloch sphere is a geometric representation: |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩. The angle θ represents the latitude (relative weight of |0⟩ vs |1⟩), while φ is the azimuthal longitude (the relative phase). Pure states live strictly on the sphere's surface (radius = 1).";
        concepts = ['Bloch Sphere', 'Relative Phase', 'State Vector'];
      } else {
        replyText = `Great question regarding "${query}". In quantum algorithms, we harness interference to cancel out erroneous paths and amplify the correct solution amplitude. You can test this right now in the Quantum Circuit Studio!`;
        concepts = ['Quantum Interference', 'Unitary Evolution', 'Circuit Depth'];
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'tutor',
        text: replyText,
        timestamp: 'Just now',
        referencedConcepts: concepts
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <Card variant="default" className={`flex flex-col ${compact ? 'h-[500px]' : 'h-[620px]'}`}>
      <CardHeader className="py-3 px-5 border-b border-[var(--border-card)] flex items-center justify-between bg-[var(--surface-sunken)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4 text-sciteal-700 dark:text-sciteal-300" />
          </div>
          <div>
            <CardTitle className="text-sm">AI Quantum Tutor</CardTitle>
            <p className="text-[11px] text-[var(--fg-muted)]">Pedagogical Assistant powered by Gemini Architecture</p>
          </div>
        </div>

        {/* Context Badges */}
        <div className="hidden sm:flex items-center gap-2">
          {context?.currentCircuitName && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-card)] text-[var(--fg-main)] flex items-center gap-1 font-semibold">
              <Atom className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
              <span>Circuit: {context.currentCircuitName}</span>
            </span>
          )}
          {context?.activeLessonTitle && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-card)] text-[var(--fg-main)] flex items-center gap-1 font-semibold">
              <BookOpen className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
              <span>{context.activeLessonTitle}</span>
            </span>
          )}
        </div>
      </CardHeader>

      {/* Suggested prompts strip */}
      <div className="px-4 py-2.5 bg-[var(--surface-sunken)] border-b border-[var(--border-card)] overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono text-[var(--fg-muted)] flex items-center gap-1 flex-shrink-0 font-semibold">
          <Lightbulb className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          Prompt:
        </span>
        {suggestedPrompts.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSend(p.query)}
            className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-hover)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] border border-[var(--border-card)] hover:border-[var(--border-highlight)] whitespace-nowrap transition-colors flex-shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`
                w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-semibold
                ${isUser ? 'bg-sciteal-600 text-white' : 'bg-[var(--surface-subtle)] text-sciteal-600 dark:text-sciteal-400 border border-[var(--border-card)]'}
              `}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`
                max-w-[85%] rounded-xl p-3 text-xs leading-relaxed
                ${isUser 
                  ? 'bg-sciteal-600 dark:bg-sciteal-700 text-white font-medium rounded-tr-none shadow-sm' 
                  : 'bg-[var(--surface-sunken)] border border-[var(--border-card)] text-[var(--fg-main)] rounded-tl-none shadow-sm'}
              `}>
                <p>{msg.text}</p>

                {/* Concepts tags if tutor */}
                {msg.referencedConcepts && msg.referencedConcepts.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border-card)] flex flex-wrap gap-1">
                    {msg.referencedConcepts.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-card)] text-sciteal-700 dark:text-sciteal-400 border border-[var(--border-card)] font-semibold"
                      >
                        #{c}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`text-[9px] mt-1.5 font-mono ${isUser ? 'text-white/80 text-right' : 'text-[var(--fg-muted)]'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)] pl-9">
            <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] text-[var(--fg-muted)] font-mono">Tutor is synthesizing explanation...</span>
          </div>
        )}
      </CardContent>

      {/* Input bar */}
      <div className="p-3 bg-[var(--surface-sunken)] border-t border-[var(--border-card)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about qubits, gates, circuits, or algorithms..."
            className="flex-1 bg-[var(--surface-card)] border border-[var(--border-card)] rounded-xl px-4 py-2.5 text-xs text-[var(--fg-main)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-sciteal-500 transition-colors shadow-sm"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!input.trim() || isTyping}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Ask
          </Button>
        </form>
      </div>
    </Card>
  );
};
