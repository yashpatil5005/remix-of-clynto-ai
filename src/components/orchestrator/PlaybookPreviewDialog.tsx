import React from 'react';
import { cn } from '@/lib/utils';
import { 
  X, 
  Target,
  Clock,
  ChevronRight,
  Users,
  CheckCircle2,
  Layers,
  Sparkles,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PlaybookPhase {
  name: string;
  duration: string;
  tasks: number;
}

interface PlaybookPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  playbook: {
    id: string;
    name: string;
    matchScore: number;
    phases: number;
    avgDuration: string;
    description?: string;
    successRate?: number;
    phaseDetails?: PlaybookPhase[];
  };
  onAssign: () => void;
}

const PlaybookPreviewDialog: React.FC<PlaybookPreviewProps> = ({
  isOpen,
  onClose,
  playbook,
  onAssign,
}) => {
  if (!isOpen) return null;

  const phaseDetails: PlaybookPhase[] = playbook.phaseDetails || [
    { name: 'Kickoff & Discovery', duration: '3-5 days', tasks: 8 },
    { name: 'Technical Setup', duration: '5-7 days', tasks: 12 },
    { name: 'Configuration', duration: '5-10 days', tasks: 15 },
    { name: 'Training & Enablement', duration: '3-5 days', tasks: 6 },
    { name: 'Go-Live & Handoff', duration: '2-3 days', tasks: 5 },
  ].slice(0, playbook.phases);

  return (
    <>
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-background rounded-2xl border border-border shadow-2xl z-50 flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="border-b border-border/60 px-6 py-4 shrink-0 bg-gradient-to-b from-card/80 to-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{playbook.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {playbook.phases} phases
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {playbook.avgDuration}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Match Score
              </div>
              <p className="text-xl font-bold text-primary">{playbook.matchScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-accent" />
                Success Rate
              </div>
              <p className="text-xl font-bold text-accent">{playbook.successRate || 92}%</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary border border-border/40">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Users className="w-3.5 h-3.5" />
                Accounts
              </div>
              <p className="text-xl font-bold text-foreground">124</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">About this Playbook</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {playbook.description || `A comprehensive ${playbook.name.toLowerCase()} designed to ensure successful outcomes through structured phases, clear milestones, and automated task management. Ideal for accounts requiring high-touch engagement and measurable success criteria.`}
            </p>
          </div>

          {/* Phase Timeline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Phase Timeline</h4>
            <div className="space-y-2">
              {phaseDetails.map((phase, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{phase.name}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {phase.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {phase.tasks} tasks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 px-6 py-4 shrink-0 flex items-center justify-end gap-3 bg-card/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAssign} className="gap-2">
            <Target className="w-4 h-4" />
            Assign Playbook
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default PlaybookPreviewDialog;
