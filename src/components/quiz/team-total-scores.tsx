
'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type PreviewScore = {
  name: string;
  runs: number;
  wickets: number;
  height: number;
};

const TeamScoreCard = ({ name, runs, wickets, isCompact, isOut }: { name: string; runs: number; wickets: number, isCompact: boolean, isOut: boolean }) => (
    <Card
      className={cn(
        "shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden w-full",
         isCompact ? 'sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]' : 'sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]',
         isOut && "bg-muted/50 opacity-70"
      )}
    >
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-headline text-center">
            {isOut && <Lock className="inline-block h-5 w-5 mr-2" />}
            {name}
        </CardTitle>
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

const SkeletonCard = ({ isCompact }: { isCompact: boolean }) => (
     <Card className={cn(
        "shadow-lg animate-pulse",
        "w-full",
         isCompact ? 'sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]' : 'sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]'
      )}>
        <CardHeader><Skeleton className="h-8 w-3/4 mx-auto" /></CardHeader>
        <CardContent><Skeleton className="h-16 w-1/2 mx-auto" /></CardContent>
     </Card>
)

export function TeamTotalScores() {
  const { quizState, isLoaded } = useQuiz();
  const [previewScores, setPreviewScores] = useState<PreviewScore[]>([]);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    // This prevents hydration errors by ensuring Math.random() is not run on the server.
    setPreviewScores(
      Array.from({ length: 4 }).map((_, i) => ({
        name: `Team ${i + 1}`,
        runs: Math.floor(Math.random() * 200),
        wickets: Math.floor(Math.random() * 10),
        height: Math.random() * 60 + 20, 
      }))
    );
  }, []);

  // Use a consistent default for server render and initial client render
  const settings = quizState?.monitorSettings || { compact: false };

  const containerClasses = cn(
    'flex flex-wrap justify-center',
    settings.compact ? 'gap-2' : 'gap-4 md:gap-6'
  );

  if (!isLoaded || !quizState) {
    // On the server and on the initial client render, show skeletons.
    return (
        <Card className={cn("shadow-lg", settings.compact && "p-2")}>
            <CardHeader>
                <Skeleton className="h-8 w-48 mx-auto" />
            </CardHeader>
            <CardContent>
                 <div className={containerClasses}>
                    {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} isCompact={settings.compact} />)}
                </div>
            </CardContent>
        </Card>
    );
  }
  
  const { numTeams, scores, rounds, teamNames, monitorSettings, teamsOut } = quizState;
  
  if (numTeams === 0) {
    // Once mounted on the client and if numTeams is 0, show the randomized preview scores.
    // This part only runs client-side after isLoaded is true.
    return (
      <Card className={cn("shadow-lg", monitorSettings.compact && "p-2")}>
        <CardHeader>
            <CardTitle className={cn("text-3xl font-bold font-headline text-center", monitorSettings.compact && "text-xl")}>
                Scoreboard
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className={containerClasses}>
                {previewScores.map((preview, index) => (
                    <TeamScoreCard 
                        key={index} 
                        name={preview.name} 
                        runs={preview.runs}
                        wickets={preview.wickets}
                        isCompact={monitorSettings.compact}
                        isOut={false}
                    />
                ))}
            </div>
        </CardContent>
      </Card>
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
     <Card className={cn("shadow-lg", monitorSettings.compact && "p-2")}>
        <CardHeader>
            <CardTitle className={cn("text-3xl font-bold font-headline text-center", monitorSettings.compact && "text-xl")}>
                Scoreboard
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className={containerClasses}>
            {teamTotals.map((total, index) => (
                <TeamScoreCard 
                    key={index} 
                    name={teamNames[index] || `Team ${index + 1}`} 
                    runs={total.runs}
                    wickets={total.wickets}
                    isCompact={monitorSettings.compact}
                    isOut={teamsOut[index]}
                />
            ))}
            </div>
        </CardContent>
    </Card>
  );
}
