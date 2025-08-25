'use client';

import { Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type PingStatus = 'good' | 'medium' | 'bad';

const pingConfig = {
  good: { color: 'text-green-500', label: 'Connection Good' },
  medium: { color: 'text-yellow-500', label: 'Connection Unstable' },
  bad: { color: 'text-red-500', label: 'Connection Bad' },
};

export function PingIndicator() {
  const [status, setStatus] = useState<PingStatus>('good');

  useEffect(() => {
    // This is a simulation. A real implementation would involve
    // WebSockets or polling to get actual connection status.
    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.7) {
        setStatus('good');
      } else if (random < 0.9) {
        setStatus('medium');
      } else {
        setStatus('bad');
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Wifi className={cn('h-5 w-5 transition-colors', pingConfig[status].color)} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{pingConfig[status].label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
