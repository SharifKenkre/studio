
'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type PreviewScore = {
  name: string;
  runs: number;
  wickets: number;
  height: number;
};

const TeamScoreCard = ({ name, runs, wickets, isCompact }: { name: string; runs: number; wickets: number, isCompact: boolean; }) => (
    <Card
      className="shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
    >
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-headline text-center">{name}</CardTitle>
      </CardHeader>
      <CardContent className="relative text-center">
        <p className={cn(
          "text-7xl font-bold font-mono text-primary",
          isCompact && "text-5xl"
        )}>
          {runs}/{wickets}
        </p>
      </CardContent>
    </Card>
);

const SkeletonCard = () => (
     <Card className="shadow-lg animate-pulse">
        <CardHeader><CardTitle className="text-2xl h-8 rounded-md bg-muted/50 font-headline text-center"></CardTitle></CardHeader>
        <CardContent><div className="h-16 w-1/2 mx-auto rounded-md bg-muted/50" /></CardContent>
     </Card>
)

export function TeamTotalScores() {
  const { quizState } = useQuiz();
  const { numTeams, scores, rounds, teamNames, monitorSettings } = quizState;
  const [isMounted, setIsMounted] = useState(false);
  const [previewScores, setPreviewScores] = useState<PreviewScore[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setPreviewScores(
      Array.from({ length: 4 }).map((_, i) => ({
        name: `Team ${i + 1}`,
        runs: Math.floor(Math.random() * 200),
        wickets: Math.floor(Math.random() * 10),
        height: Math.random() * 60 + 20,
      }))
    );
  }, []);

  const gridClasses = cn(
    'grid gap-4 md:gap-6',
    monitorSettings.compact ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  );

  if (!isMounted) {
    return (
        <div className={gridClasses}>
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
    );
  }
  
  if (numTeams === 0) {
    return (
      <div className={gridClasses}>
        {previewScores.map((preview, index) => (
            <TeamScoreCard 
                key={index} 
                name={preview.name} 
                runs={preview.runs}
                wickets={preview.wickets}
                isCompact={monitorSettings.compact}
             />
        ))}
      </div>
    );
  }

  const teamTotals = Array.from({ length: numTeams }, (_, teamIndex) => {
    let totalRuns = 0;
    let totalWickets = 0;

    const processScores = (scoreData: Record<number, Record<number, any>>) => {
        Object.values(scoreData).forEach(questionScores => {
            const score = questionScores[teamIndex];
            if (score) {
                totalRuns += score.runs || 0;
                if (score.isWicket) {
                    totalWickets += 1;
                }
            }
        });
    };

    (rounds || []).forEach(round => processScores(round.scores));
    processScores(scores);
    
    return { runs: totalRuns, wickets: totalWickets };
  });

  return (
    <div className={gridClasses}>
      {teamTotals.map((total, index) => (
         <TeamScoreCard 
            key={index} 
            name={teamNames[index] || `Team ${index + 1}`} 
            runs={total.runs}
            wickets={total.wickets}
            isCompact={monitorSettings.compact}
         />
      ))}
    </div>
  );
}
