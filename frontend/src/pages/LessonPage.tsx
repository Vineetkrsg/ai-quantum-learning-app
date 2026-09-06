import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LESSONS_DATA } from '../mock/lessonsData';
import { useProgress } from '../context/ProgressContext';
import { LessonHeader } from '../components/learning/LessonHeader';
import { MiniLessonStepper } from '../components/learning/MiniLessonStepper';
import { InteractiveTryIt } from '../components/learning/InteractiveTryIt';
import { KnowledgeCheck } from '../components/learning/KnowledgeCheck';
import { LessonTutor } from '../components/learning/LessonTutor';
import { PracticeChallenge } from '../components/learning/PracticeChallenge';
import { LessonNavigation } from '../components/learning/LessonNavigation';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  AlertCircle, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle,
  Play
} from 'lucide-react';

export const LessonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const progress = useProgress();

  const lessonContent = slug ? LESSONS_DATA[slug] : undefined;

  // Active mini-lesson ID state
  const [activeLessonId, setActiveLessonId] = useState<string>('');

  useEffect(() => {
    if (lessonContent && lessonContent.miniLessons.length > 0) {
      setActiveLessonId(lessonContent.miniLessons[0].id);
    }
  }, [slug, lessonContent]);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, activeLessonId]);

  if (!lessonContent) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lesson Not Found</h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The requested learning module "{slug}" does not exist or is currently being authored.
        </p>
        <Link to="/learn">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Return to Curriculum
          </Button>
        </Link>
      </div>
    );
  }

  const activeLessonIndex = lessonContent.miniLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = lessonContent.miniLessons[activeLessonIndex] || lessonContent.miniLessons[0];
  const isLastLesson = activeLessonIndex === lessonContent.miniLessons.length - 1;

  const modulePercent = slug ? (progress.moduleProgress[slug] || 0) : 0;
  const isModuleComplete = modulePercent === 100;
  const isCurrentLessonComplete = progress.completedLessons.includes(activeLesson.id);
  const completedLessonsInModule = slug ? (progress.completedLessonsByModule[slug] || []).length : 0;

  const handleCompleteCurrentMiniLesson = () => {
    if (slug) {
      progress.completeLesson(
        slug,
        activeLesson.id,
        activeLesson.title,
        lessonContent.miniLessons.length
      );
    }

    // Advance to next mini-lesson if available
    if (!isLastLesson) {
      setActiveLessonId(lessonContent.miniLessons[activeLessonIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Module Header */}
      <LessonHeader
        title={lessonContent.title}
        subtitle={lessonContent.subtitle}
        difficulty={lessonContent.difficulty}
        estimatedTime={lessonContent.estimatedTime}
        isCompleted={isModuleComplete}
        progress={modulePercent}
      />

      {/* 2. Mini-Lesson Stepper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Module Lessons ({activeLessonIndex + 1} of {lessonContent.miniLessons.length})
          </span>
          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
            {completedLessonsInModule} of {lessonContent.miniLessons.length} Completed
          </span>
        </div>
        <MiniLessonStepper
          lessons={lessonContent.miniLessons}
          activeLessonId={activeLesson.id}
          completedLessonIds={progress.completedLessons}
          onSelectLesson={(id) => setActiveLessonId(id)}
        />
      </div>

      {/* 3. Active Mini-Lesson Body */}
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Core Lesson Card */}
        <Card variant="glass">
          <CardHeader className="pb-3 border-b border-slate-300/80 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-semibold">
                  Lesson {activeLessonIndex + 1} of {lessonContent.miniLessons.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  ~{activeLesson.durationMinutes} mins
                </span>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {activeLesson.title}
              </CardTitle>
            </div>

            {isCurrentLessonComplete && (
              <Badge variant="emerald">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Lesson Completed
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Concept Explanation */}
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              {activeLesson.conceptExplanation}
            </p>

            {/* Beginner-friendly Analogy Card if present */}
            {activeLesson.analogy && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-gradient-to-r dark:from-amber-950/20 dark:via-slate-900/60 dark:to-slate-950 border border-amber-300 dark:border-amber-500/30 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider font-mono">
                  <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Intuitive Analogy</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{activeLesson.analogy}"
                </p>
              </div>
            )}

            {/* Visual Note if present */}
            {activeLesson.visualNote && (
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 text-center font-mono text-xs sm:text-sm text-cyan-800 dark:text-cyan-300 font-bold">
                {activeLesson.visualNote}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Interactive "Try It Yourself" Prediction Activity if present */}
        {activeLesson.interactiveTry && (
          <InteractiveTryIt
            data={activeLesson.interactiveTry}
            onRunSuccess={() => {
              progress.recordCircuitRun(activeLesson.interactiveTry?.title || 'Mini-Lesson Simulation');
            }}
          />
        )}

        {/* 5. Self-Check Quiz Question if present (Reusable KnowledgeCheck Component) */}
        {activeLesson.selfCheck && (
          <KnowledgeCheck
            data={activeLesson.selfCheck}
            onComplete={(isCorrect) => {
              if (isCorrect) {
                progress.recordQuizResult(activeLesson.title, 1, 1);
                if (slug) {
                  progress.completeLesson(
                    slug,
                    activeLesson.id,
                    activeLesson.title,
                    lessonContent.miniLessons.length
                  );
                }
              }
            }}
            onContinue={() => {
              if (!isLastLesson) {
                setActiveLessonId(lessonContent.miniLessons[activeLessonIndex + 1].id);
              } else {
                const practiceElem = document.getElementById('practice-task');
                practiceElem?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        )}

        {/* 6. Mini-Lesson Action / Step Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-300 dark:border-slate-800/80">
          <Button
            variant="outline"
            size="sm"
            disabled={activeLessonIndex === 0}
            onClick={() => setActiveLessonId(lessonContent.miniLessons[activeLessonIndex - 1].id)}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Previous Topic
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={isCurrentLessonComplete ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                if (slug) {
                  progress.completeLesson(
                    slug,
                    activeLesson.id,
                    activeLesson.title,
                    lessonContent.miniLessons.length
                  );
                }
              }}
              leftIcon={isCurrentLessonComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : undefined}
            >
              {isCurrentLessonComplete ? 'Topic Completed' : 'Mark Topic Complete'}
            </Button>

            <Button
              variant="quantum"
              size="sm"
              onClick={handleCompleteCurrentMiniLesson}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {isLastLesson ? 'Complete & Start Practice' : 'Next Topic →'}
            </Button>
          </div>
        </div>
      </div>

      {/* 7. Practice Challenge */}
      <section id="practice-task" className="pt-4">
        <PracticeChallenge
          practiceData={lessonContent.practice}
          onComplete={() => {
            progress.recordChallengeComplete(`chal-${slug}`, 50);
          }}
        />
      </section>

      {/* 8. AI Tutor Section */}
      <section id="ai-tutor" className="pt-4">
        <LessonTutor
          lessonContext={lessonContent.tutorSection.lessonContext}
          exampleContext={lessonContent.tutorSection.exampleContext}
          suggestedQuestions={lessonContent.tutorSection.suggestedQuestions}
        />
      </section>

      {/* 9. Open in Quantum Lab CTA & Module Navigation */}
      <section id="lesson-navigation" className="pt-4">
        <LessonNavigation
          labPresetId={lessonContent.labPresetId}
          isCompleted={isModuleComplete}
          onToggleComplete={() => {
            if (slug) {
              lessonContent.miniLessons.forEach((l) => {
                progress.completeLesson(slug, l.id, l.title, lessonContent.miniLessons.length);
              });
            }
          }}
          prevLesson={lessonContent.prevLesson}
          nextLesson={lessonContent.nextLesson}
        />
      </section>
    </div>
  );
};
