
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
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';

export function ScoringGrid() {
  const { quizState, setQuizState, calculateTotalWickets } = useQuiz();
  const { scores, activeCell, teamNames, numQuestions, teamsOut } = quizState;
  const activeCellRef = useRef<HTMLTableCellElement>(null);
  
  const numTeams = teamNames?.length || 0;
  const questionRows = Array.from({ length: numQuestions + 1 }, (_, i) => i);


  useEffect(() => {
    activeCellRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [activeCell]);

  const handleCellClick = (question: number, team: number) => {
    if (question > numQuestions) return;

    if (teamsOut[team]) {
        return; // Don't allow selecting cells for teams that are out
    }

    setQuizState(prev => ({
      ...prev,
      activeCell: { question, team }
    }));
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-headline">Ball</TableHead>
            {teamNames && teamNames.map((name, teamIndex) => (
              <TableHead key={teamIndex} className={cn("text-center font-headline", teamsOut[teamIndex] && "text-muted-foreground line-through")}>
                {teamsOut[teamIndex] && <Lock className="h-4 w-4 inline-block mr-2" />}
                {name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionRows.map(questionIndex => (
            <TableRow key={questionIndex} className={cn(questionIndex > numQuestions && "opacity-50 cursor-not-allowed")}>
              <TableCell className="font-medium font-headline">B{questionIndex + 1}</TableCell>
              {Array.from({ length: numTeams }).map((_, teamIndex) => {
                const isActive =
                  activeCell?.question === questionIndex && activeCell?.team === teamIndex;
                const score = scores[questionIndex]?.[teamIndex];
                const isTeamOut = teamsOut[teamIndex];

                let displayValue = '-';
                if (score) {
                    if (score.isWicket) {
                        displayValue = 'W';
                    } else {
                        displayValue = score.runs.toString();
                    }
                }

                return (
                  <TableCell
                    key={teamIndex}
                    ref={isActive ? activeCellRef : null}
                    className={cn(
                      'text-center font-mono text-lg transition-all duration-200',
                      isActive && 'bg-accent/20 ring-2 ring-accent rounded-md',
                      score !== undefined ? 'font-bold' : 'text-muted-foreground',
                      score?.isWicket && 'text-destructive',
                      questionIndex > numQuestions && 'cursor-not-allowed',
                      isTeamOut ? 'cursor-not-allowed bg-muted/30 text-muted-foreground' : 'cursor-pointer hover:bg-muted/50'
                    )}
                    onClick={() => handleCellClick(questionIndex, teamIndex)}
                  >
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
