import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ProcessingStateProps {
  steps: string[];
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ steps }) => {
  return (
    <div className="space-y-4 py-6 px-4 bg-secondary/20 rounded-xl border border-border/40">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Larry is analyzing
      </div>
      <div className="space-y-3 pl-1">
        {steps.map((step, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-3 transition-all duration-500 animate-fade-in`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {idx === steps.length - 1 ? (
              <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <div className="absolute inset-0 w-4 h-4 bg-primary/20 rounded-full animate-ping" />
              </div>
            ) : (
              <CheckCircle2 className="w-4 h-4 text-accent" />
            )}
            <span className={`text-sm font-medium ${
              idx === steps.length - 1 ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingState;
