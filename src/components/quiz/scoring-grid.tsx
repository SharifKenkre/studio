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

export function ScoringGrid() {
  const { quizState, setQuizState } = useQuiz();
  const { scores, activeCell, teamNames } = quizState;
  const activeCellRef = useRef<HTMLTableCellElement>(null);
  
  const numTeams = teamNames?.length || 0;
  // Show at least 5 questions initially, or more if we have data for them.
  const numQuestions = quizState.numQuestions > 0 ? quizState.numQuestions + 2 : 5;


  const teamHeaders = Array.from({ length: numTeams }, (_, i) => i);
  const questionRows = Array.from({ length: Math.max(1, numQuestions) }, (_, i) => i);

  useEffect(() => {
    activeCellRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [activeCell]);

  const handleCellClick = (question: number, team: number) => {
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
            <TableHead className="w-[100px] font-headline">Question</TableHead>
            {teamNames && teamNames.map((name, teamIndex) => (
              <TableHead key={teamIndex} className="text-center font-headline">
                {name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionRows.map(questionIndex => (
            <TableRow key={questionIndex}>
              <TableCell className="font-medium font-headline">Q{questionIndex + 1}</TableCell>
              {teamHeaders.map(teamIndex => {
                const isActive =
                  activeCell?.question === questionIndex && activeCell?.team === teamIndex;
                const score = scores[questionIndex]?.[teamIndex];

                return (
                  <TableCell
                    key={teamIndex}
                    ref={isActive ? activeCellRef : null}
                    className={cn(
                      'text-center font-mono text-lg transition-all duration-200 cursor-pointer hover:bg-muted/50',
                      isActive && 'bg-accent/20 ring-2 ring-accent rounded-md',
                      score !== undefined ? 'font-bold' : 'text-muted-foreground'
                    )}
                    onClick={() => handleCellClick(questionIndex, teamIndex)}
                  >
                    {score !== undefined ? score : '-'}
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
