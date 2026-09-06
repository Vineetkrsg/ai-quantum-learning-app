import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BookOpen, Sparkles, Check } from 'lucide-react';

interface ConceptExplanationProps {
  leadParagraph: string;
  keyTakeaways: string[];
  deepDiveParagraphs: string[];
}

export const ConceptExplanation: React.FC<ConceptExplanationProps> = ({
  leadParagraph,
  keyTakeaways,
  deepDiveParagraphs
}) => {
  return (
    <Card variant="glass">
      <CardHeader className="pb-3 border-b border-slate-800/60 flex items-center justify-between">
        <CardTitle className="text-sm sm:text-base">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Core Concept Explanation</span>
        </CardTitle>
        <span className="text-[11px] font-mono text-slate-500">Pedagogical Theory</span>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Lead Paragraph */}
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
          {leadParagraph}
        </p>

        {/* Key Takeaways Box */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Essential Key Takeaways</span>
          </div>

          <div className="space-y-2.5">
            {keyTakeaways.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/30">
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Paragraphs */}
        <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
          {deepDiveParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
