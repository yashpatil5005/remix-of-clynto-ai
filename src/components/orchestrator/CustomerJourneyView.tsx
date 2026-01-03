import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Building2,
  Eye,
  MoreHorizontal,
  Calendar,
  Users,
  Settings,
  RefreshCcw,
  Rocket,
  TrendingUp,
  RotateCw,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

interface ActiveWorkflow {
  id: string;
  account: {
    name: string;
    segment: string;
    arr: string;
    healthScore?: number;
  };
  playbook: {
    name: string;
    lastActivity: string;
  };
  category: 'onboarding' | 'at_risk' | 'renewal' | 'expansion';
  progress: {
    currentPhase: number;
    totalPhases: number;
    percentage: number;
  };
  currentPhaseName: string;
  phaseTimeline: string;
  status: 'running' | 'attention' | 'paused' | 'completed';
}

interface CustomerJourneyViewProps {
  workflows: ActiveWorkflow[];
  onOpenWorkflow: (workflow: ActiveWorkflow) => void;
  onWorkflowAction: (workflowId: string, action: string) => void;
  onViewAccount: (accountName: string) => void;
}

const journeyStages = [
  { 
    id: 'onboarding', 
    label: 'Onboarding', 
    icon: Rocket,
    description: 'New customers getting started',
    color: 'primary'
  },
  { 
    id: 'adoption', 
    label: 'Adoption', 
    icon: TrendingUp,
    description: 'Driving product usage & value',
    color: 'accent'
  },
  { 
    id: 'renewal', 
    label: 'Renewal', 
    icon: RotateCw,
    description: 'Contract renewal cycle',
    color: 'warning'
  },
  { 
    id: 'expansion', 
    label: 'Expansion', 
    icon: Zap,
    description: 'Growth opportunities',
    color: 'accent'
  },
];

const CustomerJourneyView: React.FC<CustomerJourneyViewProps> = ({
  workflows,
  onOpenWorkflow,
  onWorkflowAction,
  onViewAccount,
}) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  const getWorkflowsForStage = (stageId: string) => {
    if (stageId === 'adoption') {
      // Adoption includes at_risk workflows that are being actively managed
      return workflows.filter(w => w.category === 'at_risk');
    }
    return workflows.filter(w => w.category === stageId);
  };

  const getStatusConfig = (status: ActiveWorkflow['status']) => {
    switch (status) {
      case 'running':
        return { label: 'Running', icon: Play, bgClass: 'bg-accent/10', textClass: 'text-accent' };
      case 'attention':
        return { label: 'Attention', icon: AlertCircle, bgClass: 'bg-destructive/10', textClass: 'text-destructive' };
      case 'paused':
        return { label: 'Paused', icon: Pause, bgClass: 'bg-muted', textClass: 'text-muted-foreground' };
      case 'completed':
        return { label: 'Completed', icon: CheckCircle2, bgClass: 'bg-accent/10', textClass: 'text-accent' };
    }
  };

  const getStageColor = (color: string) => {
    switch (color) {
      case 'primary': return { bg: 'bg-primary', light: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' };
      case 'accent': return { bg: 'bg-accent', light: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' };
      case 'warning': return { bg: 'bg-warning', light: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' };
      default: return { bg: 'bg-primary', light: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' };
    }
  };

  const renderWorkflowCard = (workflow: ActiveWorkflow) => {
    const statusConfig = getStatusConfig(workflow.status);
    const StatusIcon = statusConfig.icon;
    const isExpanded = expandedWorkflow === workflow.id;

    return (
      <div
        key={workflow.id}
        className={cn(
          "rounded-xl border transition-all overflow-hidden",
          workflow.status === 'attention' 
            ? "border-destructive/30 bg-destructive/[0.02]" 
            : "border-border/60 bg-card/50",
          isExpanded && "ring-1 ring-primary/20"
        )}
      >
        {/* Main Row */}
        <div
          className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-secondary/20 transition-all"
          onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
        >
          {/* Account */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 border border-border/40 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              {workflow.status === 'attention' && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-destructive flex items-center justify-center">
                  <AlertCircle className="w-2 h-2 text-destructive-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{workflow.account.name}</p>
              <p className="text-xs text-muted-foreground truncate">{workflow.account.arr}</p>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${workflow.progress.percentage * 1.256} 125.6`}
                className="text-primary transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {workflow.progress.percentage}%
            </span>
          </div>

          {/* Phase */}
          <div className="hidden lg:block min-w-0 w-36">
            <p className="text-xs font-medium truncate">{workflow.currentPhaseName}</p>
            <p className="text-[11px] text-muted-foreground">{workflow.phaseTimeline}</p>
          </div>

          {/* Status */}
          <Badge variant="outline" className={cn("gap-1 shrink-0", statusConfig.bgClass, statusConfig.textClass)}>
            <StatusIcon className="w-3 h-3" />
            <span className="hidden sm:inline">{statusConfig.label}</span>
          </Badge>

          {/* Expand Icon */}
          <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", isExpanded && "rotate-90")} />
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 py-4 border-t border-border/40 bg-secondary/10 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Health */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Health</p>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-semibold",
                  (workflow.account.healthScore || 0) >= 80 ? "bg-accent/10 text-accent" :
                  (workflow.account.healthScore || 0) >= 60 ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                )}>
                  {workflow.account.healthScore}%
                </div>
              </div>

              {/* Phase Progress */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Phase Progress</p>
                <p className="text-sm font-medium">{workflow.progress.currentPhase} of {workflow.progress.totalPhases}</p>
              </div>

              {/* Last Activity */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Activity</p>
                <p className="text-sm">{workflow.playbook.lastActivity}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => onOpenWorkflow(workflow)} className="gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                View Workflow
              </Button>
              <Button variant="outline" size="sm" onClick={() => onWorkflowAction(workflow.id, 'Pause')} className="gap-1.5">
                <Pause className="w-3.5 h-3.5" />
                Pause
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewAccount(workflow.account.name)} className="gap-2 cursor-pointer">
                    <Building2 className="w-4 h-4" />
                    View Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onWorkflowAction(workflow.id, 'Reassign')} className="gap-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Change Playbook
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onWorkflowAction(workflow.id, 'Cancel')} className="gap-2 cursor-pointer text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    Cancel Workflow
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Cyclical Journey Visualization */}
      <div className="relative">
        {/* Cycle Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/40">
            <RefreshCcw className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Continuous Customer Success Cycle</span>
          </div>
        </div>

        {/* Stage Cards - Circular Layout Concept */}
        <div className="grid grid-cols-4 gap-4">
          {journeyStages.map((stage, idx) => {
            const stageWorkflows = getWorkflowsForStage(stage.id);
            const StageIcon = stage.icon;
            const colors = getStageColor(stage.color);
            const isSelected = selectedStage === stage.id;
            const attentionCount = stageWorkflows.filter(w => w.status === 'attention').length;

            return (
              <div
                key={stage.id}
                onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                className={cn(
                  "relative cursor-pointer rounded-2xl border-2 p-5 transition-all",
                  isSelected 
                    ? cn(colors.border, colors.light, "shadow-lg scale-[1.02]")
                    : "border-border/40 bg-card/50 hover:border-border hover:bg-secondary/20"
                )}
              >
                {/* Connection Arrow */}
                {idx < journeyStages.length - 1 && (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                )}
                {/* Loop back arrow for last item */}
                {idx === journeyStages.length - 1 && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden xl:flex items-center gap-1 text-muted-foreground/50">
                    <RotateCw className="w-4 h-4" />
                    <span className="text-[10px]">cycle continues</span>
                  </div>
                )}

                {/* Attention Indicator */}
                {attentionCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive flex items-center justify-center text-[10px] font-bold text-destructive-foreground shadow-sm">
                    {attentionCount}
                  </div>
                )}

                {/* Stage Icon */}
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", colors.light)}>
                  <StageIcon className={cn("w-6 h-6", colors.text)} />
                </div>

                {/* Stage Info */}
                <h3 className="text-base font-semibold mb-1">{stage.label}</h3>
                <p className="text-xs text-muted-foreground mb-4">{stage.description}</p>

                {/* Count & Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-2xl font-bold tabular-nums", colors.text)}>
                      {stageWorkflows.length}
                    </span>
                    <span className="text-xs text-muted-foreground">accounts</span>
                  </div>
                  {stageWorkflows.length > 0 && (
                    <div className="w-16">
                      <Progress 
                        value={stageWorkflows.reduce((sum, w) => sum + w.progress.percentage, 0) / stageWorkflows.length} 
                        className="h-1.5"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Stage View */}
      {selectedStage && (
        <div className="mt-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {(() => {
                const stage = journeyStages.find(s => s.id === selectedStage);
                if (!stage) return null;
                const StageIcon = stage.icon;
                const colors = getStageColor(stage.color);
                return (
                  <>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.light)}>
                      <StageIcon className={cn("w-4 h-4", colors.text)} />
                    </div>
                    <h3 className="text-lg font-semibold">{stage.label} Workflows</h3>
                  </>
                );
              })()}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedStage(null)}>
              Show All Stages
            </Button>
          </div>

          <div className="space-y-2">
            {getWorkflowsForStage(selectedStage).length > 0 ? (
              getWorkflowsForStage(selectedStage).map(workflow => renderWorkflowCard(workflow))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No active workflows in this stage</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Default View - All Workflows Grouped */}
      {!selectedStage && (
        <div className="space-y-6 mt-6">
          {journeyStages.map(stage => {
            const stageWorkflows = getWorkflowsForStage(stage.id);
            if (stageWorkflows.length === 0) return null;

            const StageIcon = stage.icon;
            const colors = getStageColor(stage.color);

            return (
              <div key={stage.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", colors.light)}>
                    <StageIcon className={cn("w-3.5 h-3.5", colors.text)} />
                  </div>
                  <h4 className="text-sm font-semibold">{stage.label}</h4>
                  <Badge variant="secondary" className="text-xs">{stageWorkflows.length}</Badge>
                </div>
                <div className="space-y-2 pl-10">
                  {stageWorkflows.map(workflow => renderWorkflowCard(workflow))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerJourneyView;
