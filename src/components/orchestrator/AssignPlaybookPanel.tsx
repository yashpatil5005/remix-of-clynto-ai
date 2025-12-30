import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Building2,
  Target,
  TrendingUp,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface PlaybookRecommendation {
  id: string;
  name: string;
  matchScore: number;
  reasons: string[];
  phases: number;
  avgDuration: string;
  isRecommended?: boolean;
}

interface AssignPlaybookPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  segment: string;
  arr: string;
  onAssign: (playbookId: string) => void;
}

const AssignPlaybookPanel: React.FC<AssignPlaybookPanelProps> = ({
  isOpen,
  onClose,
  accountName,
  segment,
  arr,
  onAssign,
}) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string>('enterprise-onboarding');

  const recommendations: PlaybookRecommendation[] = [
    {
      id: 'enterprise-onboarding',
      name: 'Enterprise Onboarding',
      matchScore: 94,
      reasons: [
        'Enterprise segment match',
        'ARR above $100K threshold',
        'Industry vertical: Technology',
      ],
      phases: 7,
      avgDuration: '45 days',
      isRecommended: true,
    },
    {
      id: 'standard-onboarding',
      name: 'Standard Onboarding',
      matchScore: 72,
      reasons: [
        'General purpose workflow',
        'Faster time-to-value',
      ],
      phases: 5,
      avgDuration: '30 days',
    },
    {
      id: 'tech-fast-track',
      name: 'Tech Fast-Track',
      matchScore: 68,
      reasons: [
        'Technology industry match',
        'Accelerated implementation',
      ],
      phases: 4,
      avgDuration: '21 days',
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="fixed top-0 right-0 w-[480px] h-full bg-background border-l border-border shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInFromRight 0.25s ease-out forwards' }}
      >
        {/* Header */}
        <div className="border-b border-border/60 px-6 py-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Assign Playbook</h2>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{accountName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{segment}</span>
                <span>•</span>
                <span>{arr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* AI Recommendation Banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">AI Recommendation</p>
              <p className="text-xs text-muted-foreground">
                Based on account attributes, segment, and historical success patterns, 
                we recommend the <span className="font-medium text-primary">Enterprise Onboarding</span> playbook.
              </p>
            </div>
          </div>

          {/* Playbook Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Available Playbooks</h3>
            
            {recommendations.map((playbook) => (
              <div
                key={playbook.id}
                onClick={() => setSelectedPlaybook(playbook.id)}
                className={cn(
                  "relative p-4 rounded-xl border cursor-pointer transition-all",
                  selectedPlaybook === playbook.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/60 hover:border-border hover:bg-secondary/30"
                )}
              >
                {playbook.isRecommended && (
                  <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                    RECOMMENDED
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedPlaybook === playbook.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}>
                      {selectedPlaybook === playbook.id && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="font-medium">{playbook.name}</span>
                  </div>
                  <div className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium tabular-nums",
                    playbook.matchScore >= 90
                      ? "bg-accent/15 text-accent"
                      : playbook.matchScore >= 70
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {playbook.matchScore}% match
                  </div>
                </div>

                <div className="ml-7 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      {playbook.phases} phases
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {playbook.avgDuration}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {playbook.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="w-3 h-3 text-accent" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Workflow Option */}
          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/20 transition-all">
            Create Custom Workflow
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 px-6 py-4 shrink-0 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onAssign(selectedPlaybook)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            Assign & Start
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default AssignPlaybookPanel;
