'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TeamTotalScores() {
  const { quizState } = useQuiz();
  const { numTeams, scores } = quizState;

  const teamTotals = Array.from({ length: numTeams }, (_, teamIndex) => {
    return Object.values(scores).reduce((total, questionScores) => {
      return total + (questionScores[teamIndex] || 0);
    }, 0);
  });
  
  const maxScore = Math.max(...teamTotals, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {teamTotals.map((total, index) => (
        <Card key={index} className="shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500 ease-out"
            style={{ top: `${100 - (maxScore > 0 ? (total / maxScore) * 100 : 0)}%` }}
          />
          <CardHeader className="relative">
            <CardTitle className="text-2xl font-headline text-center">Team {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="relative text-center">
            <p className="text-7xl font-bold font-mono text-primary">{total}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
