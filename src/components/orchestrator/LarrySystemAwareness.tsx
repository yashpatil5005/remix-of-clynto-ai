import React from 'react';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  ArrowRight,
  Zap,
  TrendingDown,
  Shuffle
} from 'lucide-react';

interface SystemPrompt {
  id: string;
  type: 'activation' | 'stalled' | 'misaligned' | 'opportunity';
  message: string;
  accountName?: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

interface LarrySystemAwarenessProps {
  onAction: (promptId: string, action: string) => void;
}

const LarrySystemAwareness: React.FC<LarrySystemAwarenessProps> = ({ onAction }) => {
  const systemPrompts: SystemPrompt[] = [
    {
      id: 'prompt-1',
      type: 'activation',
      message: '5 accounts are awaiting activation.',
      action: 'Review Accounts',
      priority: 'high',
    },
    {
      id: 'prompt-2',
      type: 'stalled',
      message: 'This onboarding workflow appears stalled at Integrations.',
      accountName: 'Nexus Global',
      action: 'View Workflow',
      priority: 'high',
    },
    {
      id: 'prompt-3',
      type: 'misaligned',
      message: 'This account matches a different lifecycle playbook.',
      accountName: 'Pinnacle Tech',
      action: 'Review Match',
      priority: 'medium',
    },
    {
      id: 'prompt-4',
      type: 'opportunity',
      message: 'Usage growth of 45% detected. Expansion opportunity identified.',
      accountName: 'Summit Industries',
      action: 'View Signal',
      priority: 'medium',
    },
  ];

  const getPromptIcon = (type: SystemPrompt['type']) => {
    switch (type) {
      case 'activation': return Clock;
      case 'stalled': return TrendingDown;
      case 'misaligned': return Shuffle;
      case 'opportunity': return Zap;
      default: return AlertCircle;
    }
  };

  const getPromptStyle = (type: SystemPrompt['type']) => {
    switch (type) {
      case 'activation': return 'border-warning/30 bg-warning/5';
      case 'stalled': return 'border-destructive/30 bg-destructive/5';
      case 'misaligned': return 'border-primary/30 bg-primary/5';
      case 'opportunity': return 'border-accent/30 bg-accent/5';
      default: return 'border-border/40 bg-secondary/30';
    }
  };

  const getIconStyle = (type: SystemPrompt['type']) => {
    switch (type) {
      case 'activation': return 'bg-warning/15 text-warning';
      case 'stalled': return 'bg-destructive/15 text-destructive';
      case 'misaligned': return 'bg-primary/15 text-primary';
      case 'opportunity': return 'bg-accent/15 text-accent';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <RefreshCw className="w-3.5 h-3.5 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">System Awareness</h3>
        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-secondary text-muted-foreground tabular-nums">
          {systemPrompts.length}
        </span>
      </div>

      <div className="space-y-2">
        {systemPrompts.map((prompt) => {
          const Icon = getPromptIcon(prompt.type);
          
          return (
            <div
              key={prompt.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-all",
                getPromptStyle(prompt.type)
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                getIconStyle(prompt.type)
              )}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  {prompt.accountName && (
                    <span className="font-medium">{prompt.accountName}: </span>
                  )}
                  {prompt.message}
                </p>
              </div>

              <button
                onClick={() => onAction(prompt.id, prompt.action)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all shrink-0"
              >
                {prompt.action}
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">
        All suggestions require explicit approval before action.
      </p>
    </div>
  );
};

export default LarrySystemAwareness;
