'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Copy, RefreshCw } from 'lucide-react';
import { ScoringGrid } from '@/components/quiz/scoring-grid';
import { PointButtons } from '@/components/quiz/point-buttons';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function PrimaryPage() {
  const { quizState, setQuizState, initialState } = useQuiz();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!quizState.verificationCode) {
      router.push('/');
    }
  }, [quizState.verificationCode, router]);

  const handleNewCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setQuizState(prev => ({ ...prev, verificationCode: newCode }));
    toast({ title: 'New code generated', description: `The new code is ${newCode}` });
  };

  const handleCopyCode = () => {
    if (quizState.verificationCode) {
      navigator.clipboard.writeText(quizState.verificationCode);
      toast({ title: 'Code Copied!', description: 'The verification code has been copied to your clipboard.' });
    }
  };

  const handleSetTeams = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const teams = Number(formData.get('teams'));
    if (teams > 0 && teams <= 20) {
      setQuizState(prev => ({
        ...prev,
        numTeams: teams,
        activeCell: { question: 0, team: 0 },
        scores: {},
      }));
    } else {
      toast({ variant: 'destructive', title: 'Invalid number of teams', description: 'Please enter a number between 1 and 20.' });
    }
  };
  
  const handleScore = (points: number) => {
    if (!quizState.activeCell) return;
    
    const { question, team } = quizState.activeCell;

    setQuizState(prev => {
      const newScores = { ...prev.scores };
      if (!newScores[question]) {
        newScores[question] = {};
      }
      newScores[question][team] = points;

      let nextTeam = team + 1;
      let nextQuestion = question;

      if (nextTeam >= prev.numTeams) {
        nextTeam = 0;
        nextQuestion = question + 1;
      }
      
      const newActiveCell = nextQuestion < prev.numQuestions ? { question: nextQuestion, team: nextTeam } : null;

      return { ...prev, scores: newScores, activeCell: newActiveCell };
    });
  };

  if (!quizState.verificationCode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  // Team Setup View
  if (quizState.numTeams === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/20">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader>
            <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <CardTitle className="text-center font-headline pt-8">Setup Your Quiz</CardTitle>
            <CardDescription className="text-center">First, share the code with the Monitor. Then, set the number of teams.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center space-y-2">
                <Label className="text-sm text-muted-foreground">Verification Code</Label>
                <div className="flex items-center justify-center gap-2">
                    <p className="text-5xl font-bold font-mono tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-lg">
                        {quizState.verificationCode}
                    </p>
                    <Button variant="ghost" size="icon" onClick={handleCopyCode}><Copy className="h-5 w-5"/></Button>
                    <Button variant="ghost" size="icon" onClick={handleNewCode}><RefreshCw className="h-5 w-5"/></Button>
                </div>
            </div>
            <form className="space-y-4" onSubmit={handleSetTeams}>
                <div className="space-y-2">
                    <Label htmlFor="teams">Number of Teams</Label>
                    <Input id="teams" name="teams" type="number" min="1" max="20" placeholder="e.g., 4" required />
                </div>
                <Button type="submit" className="w-full">Start Scoring</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const numScored = quizState.activeCell ? Object.keys(quizState.scores[quizState.activeCell.question] || {}).length : quizState.numTeams;
  const progress = quizState.activeCell ? (numScored / quizState.numTeams) * 100 : 100;

  // Scoring View
  return (
    <div className="flex flex-col h-screen p-4 gap-4">
        <header className="flex-shrink-0 flex items-center justify-between">
            <h1 className="text-2xl font-bold font-headline">Scoring</h1>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Question Progress</p>
                <div className="flex items-center gap-2 w-48">
                    <Progress value={progress} className="w-full"/>
                    <span className="text-sm font-mono">{Math.round(progress)}%</span>
                </div>
            </div>
        </header>

        <main className="flex-grow overflow-auto">
            <ScoringGrid />
        </main>
        
        <footer className="flex-shrink-0">
            {quizState.activeCell ? (
                <PointButtons onScore={handleScore} />
            ) : (
                <Card className="text-center p-8">
                    <CardTitle className="font-headline">Quiz Complete!</CardTitle>
                    <CardDescription>All questions have been scored.</CardDescription>
                    <Button onClick={() => setQuizState(initialState)} className="mt-4">Start New Quiz</Button>
                </Card>
            )}
        </footer>
    </div>
  )
}
