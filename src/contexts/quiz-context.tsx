'use client';

import { useSyncedState } from '@/hooks/use-synced-state';
import type { CustomTheme } from '@/lib/theme';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext } from 'react';

export type QuizState = {
  verificationCode: string | null;
  quizTitle: string;
  numTeams: number;
  teamNames: string[];
  scores: Record<number, Record<number, number>>; // { [questionIndex]: { [teamIndex]: score } }
  activeCell: { question: number; team: number } | null;
  numQuestions: number; // No longer fixed, just a counter
  rounds: { name: string; scores: Record<number, Record<number, number>> }[];
  pointValues: number[];
  monitorSettings: {
    theme: string;
    compact: boolean;
    customTheme?: CustomTheme;
  };
};

export const initialState: QuizState = {
  verificationCode: null,
  quizTitle: 'Live Scoreboard',
  numTeams: 0,
  teamNames: [],
  scores: {},
  activeCell: { question: 0, team: 0 },
  numQuestions: 0,
  rounds: [],
  pointValues: [-10, -5, 0, 5, 10, 15, 20],
  monitorSettings: {
    theme: 'default',
    compact: false,
    customTheme: {
      background: '234 67% 94%',
      card: '234 67% 99%',
      primary: '231 48% 48%',
    },
  },
};

type QuizContextType = {
  quizState: QuizState;
  setQuizState: Dispatch<SetStateAction<QuizState>>;
  initialState: QuizState;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizState, setQuizState] = useSyncedState('quiz-state', initialState);

  return (
    <QuizContext.Provider value={{ quizState, setQuizState, initialState }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
