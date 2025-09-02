import type { QuizState } from '@/contexts/quiz-context';
import Papa from 'papaparse';

export const exportToCsv = (quizState: QuizState) => {
  const { rounds, teamNames } = quizState;

  const data: (string | number)[][] = [];
  const headers = ['Round', 'Question', ...teamNames];
  data.push(headers);

  const grandTotals = Array(teamNames.length).fill(0);

  rounds.forEach(round => {
    const roundTotals = Array(teamNames.length).fill(0);
    const questionNumbers = Object.keys(round.scores)
      .map(Number)
      .sort((a, b) => a - b);
    
    questionNumbers.forEach(qIndex => {
      const row = [round.name, `Q${qIndex + 1}`];
      teamNames.forEach((_, teamIndex) => {
        const score = round.scores[qIndex]?.[teamIndex] || 0;
        row.push(score);
        roundTotals[teamIndex] += score;
      });
      data.push(row);
    });

    // Add round totals
    const roundTotalRow = [round.name, 'Round Tot', ...roundTotals];
    data.push(roundTotalRow);
    data.push([]); // Add a blank row for spacing

    roundTotals.forEach((total, i) => {
      grandTotals[i] += total;
    });
  });

  // Add overall grand totals
  data.push(['Overall', 'Grand Tot', ...grandTotals]);

  const csv = Papa.unparse(data);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_scores.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
