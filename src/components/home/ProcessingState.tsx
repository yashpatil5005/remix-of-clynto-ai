import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ProcessingStateProps {
  steps: string[];
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ steps }) => {
  return (
    <div className="space-y-3 py-4">
      {steps.map((step, idx) => (
        <div 
          key={idx} 
          className={`flex items-center gap-3 transition-all duration-300 ${
            idx === steps.length - 1 ? 'opacity-100' : 'opacity-70'
          }`}
        >
          {idx === steps.length - 1 ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-accent" />
          )}
          <span className={`text-sm ${
            idx === steps.length - 1 ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProcessingState;
