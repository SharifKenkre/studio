
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
    // This effect runs only on the client, after the component has mounted.
    // This ensures that the random data generation for the preview doesn't cause
    // a hydration mismatch between the server and client.
    setIsMounted(true);
    setPreviewScores(
      Array.from({ length: 4 }).map((_, i) => ({
        name: `Team ${i + 1}`,
        runs: Math.floor(Math.random() * 200),
        wickets: Math.floor(Math.random() * 10),
        height: Math.random() * 60 + 20, // Not used, but kept for potential future use
      }))
    );
  }, []);

  const gridClasses = cn(
    'grid gap-4 md:gap-6',
    monitorSettings.compact ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  );

  // On the server, and on the initial client render, render a skeleton UI
  // to prevent hydration errors.
  if (!isMounted) {
    return (
        <div className={gridClasses}>
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
    );
  }
  
  // After mounting on the client, if there are no teams, show the animated preview.
  if (numTeams === 0) {
    return (
      <Card className={cn("shadow-lg", quizState.monitorSettings.compact && "p-2")}>
        <CardHeader>
            <CardTitle className={cn("text-3xl font-bold font-headline text-center", quizState.monitorSettings.compact && "text-xl")}>
                Scoreboard
            </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    );
  }

  // Once teams are set up, display the actual scores.
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
     <Card className={cn("shadow-lg", quizState.monitorSettings.compact && "p-2")}>
        <CardHeader>
            <CardTitle className={cn("text-3xl font-bold font-headline text-center", quizState.monitorSettings.compact && "text-xl")}>
                Scoreboard
            </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
    </Card>
  );
}
