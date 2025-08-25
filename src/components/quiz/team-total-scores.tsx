'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type PreviewScore = {
  name: string;
  score: number;
  height: number;
};

const TeamScoreCard = ({ name, score, heightPercent, isCompact }: { name: string; score: number; heightPercent: number; isCompact: boolean; }) => (
    <Card
      className="shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500 ease-out"
        style={{ top: `${100 - heightPercent}%` }}
      />
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-headline text-center">{name}</CardTitle>
      </CardHeader>
      <CardContent className="relative text-center">
        <p className={cn(
          "text-7xl font-bold font-mono text-primary",
          isCompact && "text-5xl"
        )}>
          {score}
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

  // This effect runs only on the client, once, after the initial render.
  useEffect(() => {
    setIsMounted(true);
    
    // Generate preview data only on the client to avoid hydration mismatch
    setPreviewScores(
      Array.from({ length: 4 }).map((_, i) => ({
        name: `Team ${i + 1}`,
        score: Math.floor(Math.random() * 100),
        height: Math.random() * 60 + 20,
      }))
    );
  }, []);

  // Before the client has mounted, render a skeleton UI to match the server
  if (!isMounted) {
    return (
        <div className={cn(
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
          monitorSettings.compact && 'gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
        )}>
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
    );
  }
  
  const commonGridClasses = cn(
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    monitorSettings.compact && 'gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
  );

  // If there are no teams, render the client-side generated preview state
  if (numTeams === 0) {
    return (
      <div className={commonGridClasses}>
        {previewScores.map((preview, index) => (
            <TeamScoreCard 
                key={index} 
                name={preview.name} 
                score={preview.score} 
                heightPercent={preview.height}
                isCompact={monitorSettings.compact}
             />
        ))}
      </div>
    );
  }

  const teamTotals = Array.from({ length: numTeams }, (_, teamIndex) => {
    let total = 0;
    (rounds || []).forEach(round => {
        Object.values(round.scores).forEach(questionScores => {
            total += questionScores[teamIndex] || 0;
        });
    });
    Object.values(scores).forEach(questionScores => {
      total += (questionScores[teamIndex] || 0);
    });
    return total;
  });
  
  const maxScore = Math.max(...teamTotals, 1); // Use 1 to avoid division by zero

  return (
    <div className={commonGridClasses}>
      {teamTotals.map((total, index) => (
         <TeamScoreCard 
            key={index} 
            name={teamNames[index] || `Team ${index + 1}`} 
            score={total} 
            heightPercent={(total / maxScore) * 100}
            isCompact={monitorSettings.compact}
         />
      ))}
    </div>
  );
}
