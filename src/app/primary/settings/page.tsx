'use client';

import { useQuiz } from '@/contexts/quiz-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Monitor, Palette } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { TeamTotalScores } from '@/components/quiz/team-total-scores';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { CustomTheme, hexToHsl, hslToHex } from '@/lib/theme';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const themes = ['default', 'dark', 'light'];

export default function SettingsPage() {
  const { quizState, setQuizState } = useQuiz();
  const router = useRouter();
  const [customTheme, setCustomTheme] = useState<CustomTheme>(
    quizState.monitorSettings.customTheme || {
      background: '234 67% 94%',
      card: '234 67% 99%',
      primary: '231 48% 48%',
    }
  );

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

  const handleCustomThemeChange = (colorName: keyof CustomTheme, value: string) => {
    setCustomTheme(prev => ({ ...prev, [colorName]: value }));
  };
  
  const applyCustomTheme = () => {
     setQuizState(prev => ({
      ...prev,
      monitorSettings: { ...prev.monitorSettings, theme: 'custom', customTheme }
    }));
  }

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
            Customize the look and feel of the monitor and primary screens. Changes are reflected live.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold">Theme</Label>
              <p className="text-sm text-muted-foreground mb-4">Select a color theme.</p>
              <div className="grid grid-cols-2 gap-2">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={quizState.monitorSettings.theme === 'custom' ? 'default' : 'outline'}>
                      <Palette className="mr-2" /> Custom
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Custom Theme</DialogTitle>
                      <DialogDescription>
                        Pick your own colors to create a unique theme.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <Label>Background Color</Label>
                        <Input
                          type="color"
                          value={hslToHex(customTheme.background)}
                          onChange={(e) => handleCustomThemeChange('background', hexToHsl(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Card Color</Label>
                        <Input
                          type="color"
                          value={hslToHex(customTheme.card)}
                          onChange={(e) => handleCustomThemeChange('card', hexToHsl(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Primary/Accent Color</Label>
                         <Input
                          type="color"
                          value={hslToHex(customTheme.primary)}
                          onChange={(e) => handleCustomThemeChange('primary', hexToHsl(e.target.value))}
                          className="w-24"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={applyCustomTheme}>Apply Custom Theme</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Layout</Label>
               <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                        Reduces spacing on the monitor to fit more on screen.
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
             <div className="rounded-lg border p-4 transition-all h-full">
                <TeamTotalScores />
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
