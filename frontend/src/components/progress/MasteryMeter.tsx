import React from 'react';
import { CONCEPT_MASTERY } from '../../mock/progressData';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Award } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const MasteryMeter: React.FC = () => {
  const { conceptMastery } = useProgress();

  const getStatus = (level: number) => {
    if (level >= 80) return 'Mastered' as const;
    if (level >= 50) return 'Proficient' as const;
    if (level > 0) return 'Learning' as const;
    return 'Not Started' as const;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Mastered': return 'emerald' as const;
      case 'Proficient': return 'teal' as const;
      case 'Learning': return 'slate' as const;
      default: return 'slate' as const;
    }
  };

  return (
    <Card variant="default">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            <Award className="w-4 h-4 text-sciteal-600 dark:text-sciteal-400" />
            <span>Concept Mastery Breakdown</span>
          </CardTitle>
          <span className="text-xs text-[var(--fg-muted)] font-mono">8 Core Dimensions</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        {CONCEPT_MASTERY.map((item) => {
          const currentLevel = conceptMastery[item.concept] ?? 0;
          const currentStatus = getStatus(currentLevel);

          return (
            <div key={item.concept} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--fg-main)] font-medium">{item.concept}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(currentStatus)} size="sm">
                    {currentStatus}
                  </Badge>
                  <span className="font-mono text-sciteal-700 dark:text-sciteal-400 font-bold w-9 text-right">
                    {currentLevel}%
                  </span>
                </div>
              </div>
              <ProgressBar
                value={currentLevel}
                size="sm"
                variant={currentLevel >= 80 ? 'emerald' : currentLevel >= 50 ? 'cyan' : 'slate'}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
