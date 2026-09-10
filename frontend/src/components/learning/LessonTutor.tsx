import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Bot, Sparkles, Send, Lightbulb, BookOpen, Atom, HelpCircle } from 'lucide-react';

interface QuestionItem {
  id: string;
  label: string;
  question: string;
  answer: string;
  concepts: string[];
}

interface LessonTutorProps {
  lessonContext: string;
  exampleContext: string;
  suggestedQuestions: QuestionItem[];
}

export const LessonTutor: React.FC<LessonTutorProps> = ({
  lessonContext,
  exampleContext,
  suggestedQuestions
}) => {
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem>(suggestedQuestions[0]);
  const [customInput, setCustomInput] = useState('');
  const [customQA, setCustomQA] = useState<{ question: string; answer: string } | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleSelectQuestion = (q: QuestionItem) => {
    setCustomQA(null);
    setActiveQuestion(q);
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsThinking(true);
    const query = customInput;
    setCustomInput('');

    setTimeout(() => {
      let reply = `Regarding "${query}": in quantum mechanics, unitary operators preserve probability conservation while altering quantum state vector coordinates. In this lesson, observing how state amplitudes interfere is key to mastering the concept.`;

      const qLower = query.toLowerCase();
      if (qLower.includes('twice') || qLower.includes('h*h') || qLower.includes('h·h')) {
        reply = "Applying the Hadamard gate twice (H·H) acts as the identity operator I. If you apply H to |0⟩, you get |+⟩ = (|0⟩ + |1⟩)/√2. Applying H again rotates the state directly back to |0⟩ with 100% certainty!";
      } else if (qLower.includes('beginner') || qLower.includes('simple')) {
        reply = "Imagine a coin spinning on a table. While it is spinning, it is not purely heads or tails — it has probability of both. That is superposition. Slapping your hand on it to read it is measurement, forcing it into heads or tails.";
      }

      setCustomQA({
        question: query,
        answer: reply
      });
      setIsThinking(false);
    }, 600);
  };

  return (
    <Card variant="default" className="overflow-hidden">
      {/* Header */}
      <CardHeader className="pb-3 border-b border-[var(--border-card)] bg-[var(--surface-sunken)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 flex items-center justify-center font-bold">
              <Bot className="w-4 h-4 text-sciteal-700 dark:text-sciteal-300" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">
                <span>AI Quantum Tutor</span>
              </CardTitle>
              <p className="text-[11px] text-[var(--fg-muted)]">Contextual pedagogical guidance powered by Gemini abstraction</p>
            </div>
          </div>

          {/* Context badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-card)] text-[var(--fg-main)] flex items-center gap-1 font-semibold">
              <BookOpen className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
              <span>Lesson: {lessonContext}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-card)] text-[var(--fg-main)] flex items-center gap-1 font-semibold">
              <Atom className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />
              <span>{exampleContext}</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Suggested Questions Strip */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] mb-2.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="font-semibold text-[var(--fg-main)]">Suggested Questions for this Concept:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => {
              const isSelected = !customQA && activeQuestion.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-sciteal-500/10 text-[var(--fg-main)] border-sciteal-500/50 font-bold'
                      : 'bg-[var(--surface-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg-main)] border-[var(--border-card)] hover:border-[var(--border-highlight)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <Sparkles className={`w-3 h-3 ${isSelected ? 'text-sciteal-600 dark:text-sciteal-400' : 'text-[var(--fg-muted)]'}`} />
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected QA Card */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-semibold text-[var(--fg-main)]">
              {customQA ? customQA.question : activeQuestion.question}
            </div>
          </div>

          <div className="text-xs text-[var(--fg-muted)] leading-relaxed space-y-2 border-l-2 border-sciteal-500/40 pl-3 ml-2">
            {isThinking ? (
              <div className="flex items-center gap-2 text-[var(--fg-muted)] font-mono py-1">
                <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-ping" />
                <span>AI Tutor is reasoning through quantum mechanics...</span>
              </div>
            ) : (
              <>
                <p>{customQA ? customQA.answer : activeQuestion.answer}</p>

                {!customQA && activeQuestion.concepts && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {activeQuestion.concepts.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface-card)] text-sciteal-700 dark:text-sciteal-400 border border-[var(--border-card)] font-semibold"
                      >
                        #{c}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Ask custom question input */}
        <form onSubmit={handleAskCustom} className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask a specific question about this quantum concept..."
            className="flex-1 bg-[var(--surface-sunken)] border border-[var(--border-card)] rounded-xl px-4 py-2.5 text-xs text-[var(--fg-main)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-sciteal-500 transition-colors shadow-sm"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!customInput.trim() || isThinking}
            leftIcon={<Send className="w-3.5 h-3.5" />}
          >
            Ask AI
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
