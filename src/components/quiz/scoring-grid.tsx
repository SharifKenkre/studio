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
  const { quizState } = useQuiz();
  const { numTeams, numQuestions, scores, activeCell } = quizState;
  const activeCellRef = useRef<HTMLTableCellElement>(null);

  const teamHeaders = Array.from({ length: numTeams }, (_, i) => i);
  // We need at least one row to show, even if no questions have been answered yet.
  const questionRows = Array.from({ length: Math.max(1, numQuestions + 1) }, (_, i) => i);


  useEffect(() => {
    activeCellRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [activeCell]);

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-headline">Question</TableHead>
            {teamHeaders.map(teamIndex => (
              <TableHead key={teamIndex} className="text-center font-headline">
                Team {teamIndex + 1}
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
                      'text-center font-mono text-lg transition-all duration-200',
                      isActive && 'bg-accent/20 ring-2 ring-accent rounded-md',
                      score !== undefined ? 'font-bold' : 'text-muted-foreground'
                    )}
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
