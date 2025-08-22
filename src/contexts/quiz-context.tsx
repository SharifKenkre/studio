'use client';

import { useSyncedState } from '@/hooks/use-synced-state';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext } from 'react';

export type QuizState = {
  verificationCode: string | null;
  numTeams: number;
  scores: Record<number, Record<number, number>>; // { [questionIndex]: { [teamIndex]: score } }
  activeCell: { question: number; team: number } | null;
  numQuestions: number;
};

export const initialState: QuizState = {
  verificationCode: null,
  numTeams: 0,
  scores: {},
  activeCell: { question: 0, team: 0 },
  numQuestions: 10,
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
