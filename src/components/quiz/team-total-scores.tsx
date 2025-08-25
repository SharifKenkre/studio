'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type PreviewScore = {
  score: number;
  height: number;
};

export function TeamTotalScores() {
  const { quizState } = useQuiz();
  const { numTeams, scores, rounds } = quizState;
  const [previewScores, setPreviewScores] = useState<PreviewScore[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPreviewScores(
      Array.from({ length: 4 }).map(() => ({
        score: Math.floor(Math.random() * 100),
        height: Math.random() * 60 + 20,
      }))
    );
  }, []);

  // If there are no teams, render a placeholder state for the preview
  if (numTeams === 0) {
    if (!isClient) {
        // Render a static skeleton or empty state on the server
        return (
             <div className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
                 quizState.monitorSettings.compact && 'gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
              )}>
                {Array.from({ length: 4 }).map((_, index) => (
                     <Card key={index} className="shadow-lg animate-pulse">
                        <CardHeader><CardTitle className="text-2xl h-8 rounded-md bg-muted/50 font-headline text-center">Team {index + 1}</CardTitle></CardHeader>
                        <CardContent><div className="h-16 w-1/2 mx-auto rounded-md bg-muted/50" /></CardContent>
                     </Card>
                ))}
              </div>
        )
    }
    return (
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
         quizState.monitorSettings.compact && 'gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
      )}>
        {previewScores.map((preview, index) => (
             <Card
                key={index}
                className="shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
            >
                <div
                    className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500 ease-out"
                    style={{ top: `${100 - preview.height}%` }}
                />
                <CardHeader className="relative">
                    <CardTitle className="text-2xl font-headline text-center">Team {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="relative text-center">
                    <p className={cn(
                    "text-7xl font-bold font-mono text-primary",
                    quizState.monitorSettings.compact && "text-5xl"
                    )}>
                    {preview.score}
                    </p>
                </CardContent>
             </Card>
        ))}
      </div>
    );
  }

  const teamTotals = Array.from({ length: numTeams }, (_, teamIndex) => {
    let total = 0;
    // Add scores from completed rounds
    (rounds || []).forEach(round => {
        Object.values(round.scores).forEach(questionScores => {
            total += questionScores[teamIndex] || 0;
        });
    });
    // Add scores from current round
    Object.values(scores).forEach(questionScores => {
      total += (questionScores[teamIndex] || 0);
    });
    return total;
  });
  
  const maxScore = Math.max(...teamTotals, 0);

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        quizState.monitorSettings.compact && 'gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
      )}
    >
      {teamTotals.map((total, index) => (
        <Card
          key={index}
          className="shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500 ease-out"
            style={{ top: `${100 - (maxScore > 0 ? (total / maxScore) * 100 : 0)}%` }}
          />
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-headline text-center">Team {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <p className={cn(
              "text-7xl font-bold font-mono text-primary",
              quizState.monitorSettings.compact && "text-5xl"
            )}>
              {total}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
