'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Monitor } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { TeamTotalScores } from '@/components/quiz/team-total-scores';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const themes = [
  'default', 'dark', 'forest', 'ocean', 'sunset', 'nebula', 'meadow', 'rose', 'industrial', 'cyberpunk'
];

export default function SettingsPage() {
  const { quizState, setQuizState } = useQuiz();
  const router = useRouter();

  const handleThemeChange = (theme: string) => {
    setQuizState(prev => ({
      ...prev,
      monitorSettings: { ...prev.monitorSettings, theme }
    }));
  };

  const handleCompactChange = (checked: boolean) => {
    setQuizState(prev => ({
      ...prev,
      monitorSettings: { ...prev.monitorSettings, compact: checked }
    }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-muted/20">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader>
          <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Scoring
          </Button>
          <div className="flex justify-center items-center gap-4 pt-8">
            <Monitor className="w-10 h-10 text-primary" />
            <CardTitle className="text-center font-headline text-4xl">Monitor Settings</CardTitle>
          </div>
          <CardDescription className="text-center">
            Customize the look and feel of the monitor screen. Changes are reflected live.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">Theme</Label>
              <p className="text-sm text-muted-foreground mb-4">Select a color theme for the monitor display.</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {themes.map(theme => (
                  <Button
                    key={theme}
                    variant={quizState.monitorSettings.theme === theme ? 'default' : 'outline'}
                    onClick={() => handleThemeChange(theme)}
                    className="capitalize"
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Layout</Label>
               <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                        Reduces spacing and text size to fit more on screen.
                    </p>
                </div>
                <Switch
                    checked={quizState.monitorSettings.compact}
                    onCheckedChange={handleCompactChange}
                />
               </div>
            </div>
          </div>
          <div className="space-y-4">
             <Label className="text-lg font-semibold">Live Preview</Label>
             <div className={cn("rounded-lg border p-4 transition-all", `theme-${quizState.monitorSettings.theme}`)}>
                <TeamTotalScores />
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
