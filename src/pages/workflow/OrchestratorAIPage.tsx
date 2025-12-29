import React, { useState } from 'react';
import { 
  Cpu, 
  Filter,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  Pause,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Calendar,
  Zap,
  Users,
  Building2,
  RotateCcw,
  Play,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  account: string;
  trigger: {
    type: 'low_utilization' | 'upsell_signal' | 'renewal_window' | 'random_event' | 'risk_signal';
    label: string;
  };
  action: string;
  dueContext: 'today' | 'overdue' | 'scheduled';
  dueDate?: string;
  status: 'pending' | 'completed' | 'suspended';
  priority: 'high' | 'medium' | 'low';
  expanded?: boolean;
}

const OrchestratorAIPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const instanceFilters = [
    { id: 'all', label: 'All Instances', count: 47 },
    { id: 'onboarding', label: 'Onboarding', count: 12 },
    { id: 'at_risk', label: 'At Risk', count: 8 },
    { id: 'renewal', label: 'Renewal', count: 18 },
    { id: 'expansion', label: 'Expansion', count: 9 },
  ];

  const statusFilters = [
    { id: 'all', label: 'All Tasks', count: 47 },
    { id: 'pending', label: 'Pending', count: 23 },
    { id: 'completed', label: 'Completed', count: 19 },
    { id: 'suspended', label: 'Suspended', count: 5 },
  ];

  const tasks: Task[] = [
    {
      id: '1',
      account: 'Meridian Technologies',
      trigger: { type: 'renewal_window', label: 'Renewal in 45 days' },
      action: 'Send renewal preparation email and schedule QBR',
      dueContext: 'today',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '2',
      account: 'Axiom Corp',
      trigger: { type: 'low_utilization', label: 'Usage dropped 32%' },
      action: 'Initiate re-engagement playbook',
      dueContext: 'overdue',
      dueDate: '2 days ago',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '3',
      account: 'Summit Industries',
      trigger: { type: 'upsell_signal', label: 'Power user growth +45%' },
      action: 'Schedule expansion discovery call',
      dueContext: 'scheduled',
      dueDate: 'Tomorrow',
      status: 'pending',
      priority: 'medium',
    },
    {
      id: '4',
      account: 'Nexus Global',
      trigger: { type: 'random_event', label: 'Support ticket escalation' },
      action: 'Review escalated ticket and reach out to executive sponsor',
      dueContext: 'today',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '5',
      account: 'Vertex Solutions',
      trigger: { type: 'risk_signal', label: 'NPS score dropped to 6' },
      action: 'Schedule urgent health check call',
      dueContext: 'today',
      status: 'suspended',
      priority: 'high',
    },
    {
      id: '6',
      account: 'Pinnacle Tech',
      trigger: { type: 'renewal_window', label: 'Renewed successfully' },
      action: 'Send thank you and schedule adoption review',
      dueContext: 'scheduled',
      dueDate: 'Next week',
      status: 'completed',
      priority: 'low',
    },
  ];

  const getTriggerIcon = (type: Task['trigger']['type']) => {
    switch (type) {
      case 'low_utilization': return TrendingDown;
      case 'upsell_signal': return TrendingUp;
      case 'renewal_window': return Calendar;
      case 'random_event': return Zap;
      case 'risk_signal': return AlertTriangle;
      default: return Zap;
    }
  };

  const getTriggerColor = (type: Task['trigger']['type']) => {
    switch (type) {
      case 'low_utilization': return 'text-warning bg-warning/10 border-warning/20';
      case 'upsell_signal': return 'text-accent bg-accent/10 border-accent/20';
      case 'renewal_window': return 'text-primary bg-primary/10 border-primary/20';
      case 'random_event': return 'text-muted-foreground bg-secondary border-border/40';
      case 'risk_signal': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-secondary border-border/40';
    }
  };

  const getDueColor = (context: Task['dueContext']) => {
    switch (context) {
      case 'overdue': return 'text-destructive';
      case 'today': return 'text-warning';
      case 'scheduled': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'suspended': return Pause;
      default: return Clock;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (activeFilter === 'onboarding') return task.trigger.type === 'low_utilization';
    if (activeFilter === 'at_risk') return task.trigger.type === 'risk_signal' || task.trigger.type === 'low_utilization';
    if (activeFilter === 'renewal') return task.trigger.type === 'renewal_window';
    if (activeFilter === 'expansion') return task.trigger.type === 'upsell_signal';
    return true;
  });

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
        {/* Page Header */}
        <div className="border-b border-border/40 bg-card/30">
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Cpu className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Orchestrator AI</h1>
                    <p className="text-sm text-muted-foreground">Live execution of customer workflows and tasks</p>
                  </div>
                </div>
              </div>

              {/* Live indicator */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="text-xs font-medium text-accent">Live</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  23 pending · 5 executing
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4">
            {/* Instance Filters */}
            <div className="flex items-center gap-2">
              {instanceFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40"
                  )}
                >
                  {filter.label}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-xs",
                    activeFilter === filter.id
                      ? "bg-primary-foreground/20"
                      : "bg-background/80"
                  )}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Add Task Button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary font-medium hover:bg-primary/5 transition-all">
              <Plus className="w-4 h-4" />
              Tasks
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all",
                  statusFilter === filter.id
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.id === 'pending' && <Clock className="w-3.5 h-3.5" />}
                {filter.id === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {filter.id === 'suspended' && <Pause className="w-3.5 h-3.5" />}
                {filter.label}
                <span className="text-xs text-muted-foreground">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* Task Stream */}
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const TriggerIcon = getTriggerIcon(task.trigger.type);
              const StatusIcon = getStatusIcon(task.status);
              const isExpanded = expandedTask === task.id;

              return (
                <div 
                  key={task.id}
                  className={cn(
                    "group rounded-xl border transition-all",
                    task.status === 'suspended' 
                      ? "border-border/30 bg-secondary/20 opacity-70" 
                      : task.status === 'completed'
                      ? "border-accent/20 bg-accent/5"
                      : "border-border/40 bg-card/50 hover:border-primary/30 hover:bg-card/80"
                  )}
                >
                  {/* Task Row */}
                  <div 
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                  >
                    {/* Status Icon */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      task.status === 'completed' ? "bg-accent/20 text-accent" :
                      task.status === 'suspended' ? "bg-muted text-muted-foreground" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      <StatusIcon className="w-4 h-4" />
                    </div>

                    {/* Account & Action */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{task.account}</span>
                        {task.priority === 'high' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{task.action}</p>
                    </div>

                    {/* Trigger Badge */}
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium shrink-0",
                      getTriggerColor(task.trigger.type)
                    )}>
                      <TriggerIcon className="w-3.5 h-3.5" />
                      {task.trigger.label}
                    </div>

                    {/* Due Context */}
                    <div className={cn(
                      "text-sm font-medium shrink-0 w-24 text-right",
                      getDueColor(task.dueContext)
                    )}>
                      {task.dueContext === 'today' ? 'Today' :
                       task.dueContext === 'overdue' ? task.dueDate :
                       task.dueDate}
                    </div>

                    {/* Expand Icon */}
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                      isExpanded && "rotate-180"
                    )} />
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border/40 mt-0">
                      <div className="pt-4 space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Playbook</span>
                            <p className="font-medium mt-1">Renewal Risk Mitigation</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Created</span>
                            <p className="font-medium mt-1">Dec 27, 2024 · 9:14 AM</p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Owner</span>
                            <p className="font-medium mt-1">Sarah Chen</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2">
                          {task.status === 'pending' && (
                            <>
                              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                <Play className="w-4 h-4" />
                                Execute
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-muted-foreground text-sm font-medium hover:bg-secondary/50 hover:text-foreground transition-all">
                                <Pause className="w-4 h-4" />
                                Suspend
                              </button>
                            </>
                          )}
                          {task.status === 'suspended' && (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                              <RotateCcw className="w-4 h-4" />
                              Resume
                            </button>
                          )}
                          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-all ml-auto">
                            <X className="w-4 h-4" />
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">All caught up</h3>
              <p className="text-sm text-muted-foreground mt-1">No tasks match your current filters</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default OrchestratorAIPage;
