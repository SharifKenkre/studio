'use client';

import { useQuiz } from '@/contexts/quiz-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function RoundScores() {
  const { quizState } = useQuiz();
  const { numTeams, rounds, teamNames } = quizState;

  if (!rounds || rounds.length === 0) {
    return null;
  }
  
  const roundTotals = rounds.map(round => {
    return Array.from({ length: numTeams }, (_, teamIndex) => {
        return Object.values(round.scores).reduce((total, questionScores) => {
            return total + (questionScores[teamIndex] || 0);
        }, 0);
    });
  });

  return (
    <Card className={cn("shadow-lg", quizState.monitorSettings.compact && "p-2")}>
        <CardHeader>
            <CardTitle className={cn("text-3xl font-bold font-headline text-center", quizState.monitorSettings.compact && "text-xl")}>
                Round Summary
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="font-headline">Round</TableHead>
                        {teamNames.map((name, teamIndex) => (
                        <TableHead key={teamIndex} className="text-center font-headline">
                            {name}
                        </TableHead>
                        ))}
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {rounds.map((round, roundIndex) => (
                        <TableRow key={roundIndex}>
                        <TableCell className="font-medium font-headline">{round.name}</TableCell>
                        {roundTotals[roundIndex].map((total, teamIndex) => (
                            <TableCell key={teamIndex} className="text-center font-mono text-lg">
                                {total}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
      </CardContent>
    </Card>
  );
}
