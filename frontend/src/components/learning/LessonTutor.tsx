import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Lightbulb, 
  HelpCircle,
  Cpu,
  Terminal,
  Bug,
  HelpCircle as QuestionIcon,
  CheckCircle2
} from 'lucide-react';
import { askAITutor } from '../../services/api';
import { GeneratedQuestionModel } from '../../types/tutor';

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
  moduleId?: string;
  lessonId?: string;
  currentCircuit?: any;
  currentCode?: string;
}

export const LessonTutor: React.FC<LessonTutorProps> = ({
  lessonContext,
  exampleContext,
  suggestedQuestions,
  moduleId,
  lessonId,
  currentCircuit,
  currentCode
}) => {
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem>(suggestedQuestions[0]);
  const [customInput, setCustomInput] = useState('');
  const [customQA, setCustomQA] = useState<{ 
    question: string; 
    answer: string; 
    concepts?: string[];
    provider?: string;
  } | null>(null);
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestionModel | null>(null);
  const [selectedGenOption, setSelectedGenOption] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [hintLevel, setHintLevel] = useState<number>(1);
  const [activeProvider, setActiveProvider] = useState<'mock' | 'gemini'>('mock');

  const handleSelectQuestion = (q: QuestionItem) => {
    setCustomQA(null);
    setGeneratedQuestion(null);
    setActiveQuestion(q);
  };

  const handleAsk = async (queryText: string, action: 'chat' | 'explain_circuit' | 'explain_code' | 'debug_code' | 'hint' | 'generate_question' = 'chat') => {
    if (!queryText.trim() && action === 'chat') return;

    setIsThinking(true);
    setCustomInput('');
    setGeneratedQuestion(null);
    setSelectedGenOption(null);

    try {
      const res = await askAITutor({
        message: queryText,
        action,
        hintLevel,
        lessonContext: {
          moduleId: moduleId || 'fundamentals',
          lessonTitle: lessonContext,
          currentTopic: exampleContext
        },
        circuitContext: currentCircuit ? {
          numberOfQubits: currentCircuit.numberOfQubits || 1,
          gateCount: currentCircuit.gates?.length || 0,
          summary: currentCircuit.name || 'Active Lesson Circuit',
          gates: currentCircuit.gates || []
        } : undefined,
        codeContext: currentCode ? {
          code: currentCode
        } : undefined
      });

      setActiveProvider(res.provider);

      if (res.generatedQuestion) {
        setGeneratedQuestion(res.generatedQuestion);
      }

      setCustomQA({
        question: queryText || (action === 'generate_question' ? 'Generate Practice Challenge' : action.replace('_', ' ').toUpperCase()),
        answer: res.reply,
        concepts: res.referencedConcepts,
        provider: res.provider
      });
    } catch (e) {
      setCustomQA({
        question: queryText,
        answer: 'I am here to guide your quantum learning journey! Ask any question about superposition, gates, entanglement, or code.',
        provider: 'mock'
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    handleAsk(customInput, 'chat');
  };

  return (
    <Card variant="default" className="overflow-hidden" data-testid="lesson-tutor-card">
      {/* Header */}
      <CardHeader className="py-3 px-4 sm:px-6 border-b border-[var(--border-card)] bg-[var(--surface-sunken)]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border border-sciteal-500/30 flex items-center justify-center font-bold shrink-0">
            <Bot className="w-4 h-4 text-sciteal-700 dark:text-sciteal-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-sm sm:text-base font-semibold text-[var(--fg-main)]">AI Quantum Tutor</CardTitle>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border bg-sciteal-500/15 text-sciteal-700 dark:text-sciteal-300 border-sciteal-500/30 whitespace-nowrap shrink-0">
                Pedagogical Engine
              </span>
            </div>
            <p className="text-[11px] text-[var(--fg-muted)] truncate">Context-aware guidance for quantum theory, circuits, and Python code</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Quick Intelligence Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[var(--border-card)]">
          <span className="text-[10px] uppercase font-mono text-[var(--fg-muted)] font-bold mr-1">
            Actions:
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAsk("Explain the current circuit operations and expected effect.", "explain_circuit")}
            leftIcon={<Cpu className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />}
          >
            Explain This Circuit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAsk("Explain how the quantum code works line-by-line.", "explain_code")}
            leftIcon={<Terminal className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />}
          >
            Explain This Code
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAsk("Inspect my code and guide me on any errors.", "debug_code")}
            leftIcon={<Bug className="w-3 h-3 text-amber-500" />}
          >
            Debug My Code
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setHintLevel(prev => (prev % 3) + 1);
              handleAsk("Give me a hint for this concept.", "hint");
            }}
            leftIcon={<Lightbulb className="w-3 h-3 text-amber-500" />}
          >
            Give Me a Hint
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAsk("Generate another practice question for this topic.", "generate_question")}
            leftIcon={<QuestionIcon className="w-3 h-3 text-sciteal-600 dark:text-sciteal-400" />}
          >
            Give Me Another Question
          </Button>
        </div>

        {/* Suggested Questions Strip */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] mb-2.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="font-semibold text-[var(--fg-main)]">Suggested Topic Questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => {
              const isSelected = !customQA && !generatedQuestion && activeQuestion.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center gap-1.5 border cursor-pointer ${
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

        {/* Selected QA / Active Response Card */}
        <div className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--border-card)] space-y-3 shadow-inner">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-semibold text-[var(--fg-main)]">
              {customQA ? customQA.question : activeQuestion.question}
            </div>
          </div>

          <div className="text-xs text-[var(--fg-muted)] leading-relaxed space-y-2 border-l-2 border-sciteal-500/40 pl-3 ml-2">
            {isThinking ? (
              <div className="flex items-center gap-2 text-[var(--fg-muted)] font-mono py-2">
                <span className="w-2 h-2 rounded-full bg-sciteal-500 animate-ping" />
                <span>AI Tutor is reasoning through quantum mechanics...</span>
              </div>
            ) : (
              <>
                <div className="text-[var(--fg-main)] leading-relaxed whitespace-pre-wrap">
                  {customQA ? customQA.answer : activeQuestion.answer}
                </div>

                {/* Inline AI Generated Question if active */}
                {generatedQuestion && (
                  <div className="mt-4 pt-3 border-t border-[var(--border-card)] space-y-2.5">
                    <div className="text-xs font-bold text-[var(--fg-main)]">
                      {generatedQuestion.question}
                    </div>
                    <div className="space-y-1.5">
                      {generatedQuestion.options.map((opt) => {
                        const isChosen = selectedGenOption === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedGenOption(opt.id)}
                            className={`w-full p-2.5 rounded-lg text-left text-xs border transition-all cursor-pointer flex items-center justify-between ${
                              isChosen
                                ? opt.isCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold'
                                  : 'bg-rose-500/20 border-rose-500 text-rose-950 dark:text-rose-200 font-bold'
                                : 'bg-[var(--surface-card)] border-[var(--border-card)] text-[var(--fg-main)] hover:bg-[var(--surface-subtle)]'
                            }`}
                          >
                            <span>{opt.text}</span>
                            {isChosen && (
                              <span>{opt.isCorrect ? '✓ Correct' : '✕ Try again'}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedGenOption && (
                      <div className="p-2.5 rounded-lg bg-[var(--surface-card)] border border-[var(--border-card)] text-[11px] text-[var(--fg-muted)]">
                        {generatedQuestion.explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Concept hashtags */}
                {(customQA?.concepts || activeQuestion.concepts) && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(customQA?.concepts || activeQuestion.concepts || []).map((c) => (
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

        {/* Free-form Question Input Form */}
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask anything: 'What is superposition?', 'Why did we use H?', 'Explain this like I am a beginner'..."
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

