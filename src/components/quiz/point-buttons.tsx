'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuiz } from '@/contexts/quiz-context';

const points = [-10, -5, 0, 5, 10, 15, 20];

interface PointButtonsProps {
  onScore: (points: number) => void;
}

export function PointButtons({ onScore }: PointButtonsProps) {
    const { quizState } = useQuiz();
    const activeTeamIndex = quizState.activeCell ? quizState.activeCell.team : null;
    const activeTeamName = activeTeamIndex !== null ? quizState.teamNames[activeTeamIndex] : '';
    const activeQuestion = quizState.activeCell ? quizState.activeCell.question + 1 : null;

  if (!quizState.activeCell) {
    return (
        <Card className="text-center p-8">
            <CardTitle className="font-headline">Ready for next question</CardTitle>
            <CardDescription>All teams scored for the current question.</CardDescription>
        </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-headline">
          Scoring Question {activeQuestion} for {activeTeamName}
        </CardTitle>
        <CardDescription>Select a point value to assign.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {points.map(point => (
            <Button
              key={point}
              onClick={() => onScore(point)}
              className="h-16 text-xl font-bold transform hover:scale-110 transition-transform"
              variant={point > 0 ? 'default' : point < 0 ? 'destructive' : 'secondary'}
            >
              {point > 0 ? `+${point}` : point}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
