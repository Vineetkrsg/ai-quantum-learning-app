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
    <Card variant="glass" className="overflow-hidden border-cyan-500/30">
      {/* Header */}
      <CardHeader className="pb-3 border-b border-slate-300/80 dark:border-slate-800/60 bg-slate-100/80 dark:bg-gradient-to-r dark:from-slate-900/90 dark:via-slate-900/60 dark:to-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">
                <span>AI Quantum Tutor</span>
              </CardTitle>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Contextual pedagogical guidance powered by Gemini abstraction</p>
            </div>
          </div>

          {/* Context badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-800 dark:text-indigo-300 flex items-center gap-1 font-semibold">
              <BookOpen className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Lesson: {lessonContext}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-cyan-800 dark:text-cyan-300 flex items-center gap-1 font-semibold">
              <Atom className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              <span>{exampleContext}</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Suggested Questions Strip */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-2.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Suggested Questions for this Concept:</span>
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
                      ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-500/10 font-bold'
                      : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-850'
                  }`}
                >
                  <Sparkles className={`w-3 h-3 ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{q.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected QA Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 space-y-3">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {customQA ? customQA.question : activeQuestion.question}
            </div>
          </div>

          <div className="pl-6.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 border-l-2 border-cyan-500/40 pl-3 ml-2">
            {isThinking ? (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono py-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
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
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 font-semibold"
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
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
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
