import React, { useState } from 'react';
import { 
  Plus,
  ChevronDown,
  Clock,
  CheckCircle2,
  Pause,
  Zap,
  Activity,
  FileText,
  Building2,
  Calendar,
  ArrowUpRight,
  MoreHorizontal,
  ChevronRight,
  Upload,
  Settings2,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WorkflowVisualizationPanel from '@/components/workflow/WorkflowVisualizationPanel';
import AccountImportDialog from '@/components/orchestrator/AccountImportDialog';
import AssignPlaybookPanel from '@/components/orchestrator/AssignPlaybookPanel';
import LarrySystemAwareness from '@/components/orchestrator/LarrySystemAwareness';

// Types
interface SubTask {
  id: string;
  name: string;
  completed: boolean;
  attributeUpdate?: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  endGoal: string;
  attributesToUpdate: string[];
  expectations: string;
  subTasks: SubTask[];
  completed: boolean;
}

interface Phase {
  id: string;
  name: string;
  timeline: string;
  tasks: Task[];
  expanded?: boolean;
}

interface WorkflowTask {
  id: string;
  account: string;
  journeyPhase: string;
  currentTask: string;
  trigger: {
    type: 'playbook' | 'system' | 'random_event';
    label: string;
  };
  dueContext: 'today' | 'overdue' | 'scheduled';
  dueDate?: string;
  status: 'pending' | 'completed' | 'suspended';
  priority: 'high' | 'medium' | 'low';
  playbook?: string;
  workflowData?: {
    phases: Phase[];
  };
}

interface AwaitingAccount {
  id: string;
  name: string;
  segment: string;
  arr: string;
  source: 'CRM' | 'Bulk Upload' | 'Manual';
  daysSinceCreation: number;
  suggestedStage: string;
}

const OrchestratorAIPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<WorkflowTask | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [assignPanelOpen, setAssignPanelOpen] = useState(false);
  const [selectedAwaitingAccount, setSelectedAwaitingAccount] = useState<AwaitingAccount | null>(null);

  // Accounts awaiting activation
  const awaitingAccounts: AwaitingAccount[] = [
    { id: 'aw-1', name: 'Quantum Dynamics', segment: 'Enterprise', arr: '$180,000', source: 'CRM', daysSinceCreation: 3, suggestedStage: 'Onboarding' },
    { id: 'aw-2', name: 'Atlas Corp', segment: 'Mid-Market', arr: '$65,000', source: 'Bulk Upload', daysSinceCreation: 1, suggestedStage: 'Onboarding' },
    { id: 'aw-3', name: 'Vector Labs', segment: 'Enterprise', arr: '$220,000', source: 'CRM', daysSinceCreation: 5, suggestedStage: 'Onboarding' },
    { id: 'aw-4', name: 'Prism Technologies', segment: 'SMB', arr: '$28,000', source: 'Manual', daysSinceCreation: 2, suggestedStage: 'Onboarding' },
    { id: 'aw-5', name: 'Nova Systems', segment: 'Mid-Market', arr: '$85,000', source: 'CRM', daysSinceCreation: 4, suggestedStage: 'Onboarding' },
  ];

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

  const sampleWorkflowPhases: Phase[] = [
    {
      id: 'preparation',
      name: 'Preparation',
      timeline: 'Pre Day 1',
      tasks: [
        {
          id: 'prep-1',
          name: 'Upload Contract',
          description: 'Upload the signed contract to the system',
          endGoal: 'Contract is accessible and terms are extracted',
          attributesToUpdate: ['Contract', 'Contract Value', 'Contract Term'],
          expectations: 'Automatically extracts key terms and populates account attributes',
          subTasks: [
            { id: 'prep-1-1', name: 'Verify contract signature', completed: true },
            { id: 'prep-1-2', name: 'Extract key terms', completed: true },
            { id: 'prep-1-3', name: 'Update account attributes', completed: false },
          ],
          completed: false,
        },
      ],
    },
    {
      id: 'kickoff',
      name: 'Kickoff & Alignment',
      timeline: 'Days 1-3',
      tasks: [
        {
          id: 'kickoff-1',
          name: 'Schedule Kickoff Meeting',
          description: 'Coordinate with stakeholders for kickoff',
          endGoal: 'Meeting scheduled with all key stakeholders',
          attributesToUpdate: ['Kickoff Date', 'Meeting Notes'],
          expectations: 'Calendar invite sent, meeting notes auto-extracted post-meeting',
          subTasks: [
            { id: 'kickoff-1-1', name: 'Send calendar invite', completed: true },
            { id: 'kickoff-1-2', name: 'Confirm attendees', completed: false },
          ],
          completed: false,
        },
      ],
    },
  ];

  const tasks: WorkflowTask[] = [
    {
      id: '1',
      account: 'Meridian Technologies',
      journeyPhase: 'Kickoff & Alignment',
      currentTask: 'Schedule kickoff meeting with stakeholders',
      trigger: { type: 'playbook', label: 'Onboarding Playbook' },
      dueContext: 'today',
      status: 'pending',
      priority: 'high',
      playbook: 'Enterprise Onboarding',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: '2',
      account: 'Axiom Corp',
      journeyPhase: 'Adoption',
      currentTask: 'Initiate re-engagement playbook',
      trigger: { type: 'system', label: 'Usage dropped 32%' },
      dueContext: 'overdue',
      dueDate: '2 days ago',
      status: 'pending',
      priority: 'high',
      playbook: 'Re-engagement',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: '3',
      account: 'Summit Industries',
      journeyPhase: 'Expansion',
      currentTask: 'Schedule expansion discovery call',
      trigger: { type: 'system', label: 'Power user growth +45%' },
      dueContext: 'scheduled',
      dueDate: 'Tomorrow',
      status: 'pending',
      priority: 'medium',
      playbook: 'Expansion Playbook',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: '4',
      account: 'Nexus Global',
      journeyPhase: 'Adoption',
      currentTask: 'Review escalated ticket',
      trigger: { type: 'random_event', label: 'Support escalation' },
      dueContext: 'today',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '5',
      account: 'Vertex Solutions',
      journeyPhase: 'At Risk',
      currentTask: 'Schedule urgent health check call',
      trigger: { type: 'system', label: 'NPS dropped to 6' },
      dueContext: 'today',
      status: 'suspended',
      priority: 'high',
      playbook: 'Risk Mitigation',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: '6',
      account: 'Pinnacle Tech',
      journeyPhase: 'Renewal',
      currentTask: 'Send renewal preparation email',
      trigger: { type: 'playbook', label: 'Renewal 90-day' },
      dueContext: 'scheduled',
      dueDate: 'Next week',
      status: 'completed',
      priority: 'low',
      playbook: 'Renewal 90-Day',
      workflowData: { phases: sampleWorkflowPhases },
    },
  ];

  const getTriggerIcon = (type: WorkflowTask['trigger']['type']) => {
    switch (type) {
      case 'playbook': return FileText;
      case 'system': return Activity;
      case 'random_event': return Zap;
      default: return Zap;
    }
  };

  const getTriggerColor = (type: WorkflowTask['trigger']['type']) => {
    switch (type) {
      case 'playbook': return 'text-primary bg-primary/10 border-primary/20';
      case 'system': return 'text-warning bg-warning/10 border-warning/20';
      case 'random_event': return 'text-muted-foreground bg-secondary border-border/40';
      default: return 'text-muted-foreground bg-secondary border-border/40';
    }
  };

  const getDueColor = (context: WorkflowTask['dueContext']) => {
    switch (context) {
      case 'overdue': return 'text-destructive';
      case 'today': return 'text-warning';
      case 'scheduled': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: WorkflowTask['status']) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'suspended': return Pause;
      default: return Clock;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (activeFilter === 'onboarding') return task.journeyPhase.includes('Kickoff') || task.journeyPhase.includes('Setup');
    if (activeFilter === 'at_risk') return task.journeyPhase === 'At Risk' || task.trigger.type === 'system';
    if (activeFilter === 'renewal') return task.journeyPhase === 'Renewal';
    if (activeFilter === 'expansion') return task.journeyPhase === 'Expansion';
    return true;
  });

  const openWorkflowPanel = (task: WorkflowTask) => {
    setSelectedAccount(task);
    setWorkflowPanelOpen(true);
  };

  const openAssignPanel = (account: AwaitingAccount) => {
    setSelectedAwaitingAccount(account);
    setAssignPanelOpen(true);
  };

  const handleAssignPlaybook = (playbookId: string) => {
    console.log('Assigned playbook:', playbookId, 'to account:', selectedAwaitingAccount?.name);
    setAssignPanelOpen(false);
    setSelectedAwaitingAccount(null);
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Hero Header */}
      <div className="border-b border-border/40 bg-gradient-to-b from-card/80 to-background">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Orchestrator AI</h1>
              <p className="text-sm text-muted-foreground">Lifecycle assignment and live workflow execution</p>
            </div>

            {/* System Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-semibold text-foreground">23</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">Awaiting</span>
                  <span className="font-semibold text-foreground">{awaitingAccounts.length}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="text-muted-foreground">Paused</span>
                  <span className="font-semibold text-foreground">3</span>
                </div>
              </div>

              {/* Primary Action */}
              <button
                onClick={() => setImportDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add / Import Accounts
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Section 1: Accounts Awaiting Activation */}
        {awaitingAccounts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <h2 className="text-base font-semibold">Accounts Awaiting Activation</h2>
                  <p className="text-xs text-muted-foreground">Accounts without assigned playbooks</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning/15 text-warning tabular-nums">
                  {awaitingAccounts.length} pending
                </span>
              </div>
            </div>

            {/* Awaiting Accounts Table */}
            <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
              {/* Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-secondary/40 border-b border-border/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Account</span>
                <span>Segment / ARR</span>
                <span>Source</span>
                <span>Days Waiting</span>
                <span>Suggested Stage</span>
                <span>Actions</span>
              </div>

              {/* Rows */}
              {awaitingAccounts.map((account) => (
                <div
                  key={account.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 border-b border-border/30 last:border-b-0 items-center hover:bg-secondary/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{account.name}</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-foreground">{account.segment}</span>
                    <span className="text-muted-foreground"> / {account.arr}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      account.source === 'CRM' ? "bg-primary/10 text-primary" :
                      account.source === 'Bulk Upload' ? "bg-accent/10 text-accent" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {account.source}
                    </span>
                  </div>

                  <div className={cn(
                    "text-sm font-medium tabular-nums",
                    account.daysSinceCreation >= 5 ? "text-destructive" :
                    account.daysSinceCreation >= 3 ? "text-warning" :
                    "text-muted-foreground"
                  )}>
                    {account.daysSinceCreation} days
                  </div>

                  <div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stage-onboarding/15 text-[hsl(var(--stage-onboarding))]">
                      {account.suggestedStage}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAssignPanel(account)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                      Assign Playbook
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Active Workflow Execution */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <Layers className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Active Workflow Execution</h2>
              <p className="text-xs text-muted-foreground">Live task stream across all accounts</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between gap-4">
            {/* Instance Filters */}
            <div className="flex items-center gap-1.5">
              {instanceFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeFilter === filter.id
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  {filter.label}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-xs tabular-nums",
                    activeFilter === filter.id
                      ? "bg-background/20 text-background"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1 pb-4 border-b border-border/40">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all",
                  statusFilter === filter.id
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {filter.id === 'pending' && <Clock className="w-3.5 h-3.5" />}
                {filter.id === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {filter.id === 'suspended' && <Pause className="w-3.5 h-3.5" />}
                {filter.label}
                <span className="text-xs text-muted-foreground tabular-nums">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* Task Stream */}
          <div className="space-y-1.5">
            {filteredTasks.map((task) => {
              const TriggerIcon = getTriggerIcon(task.trigger.type);
              const StatusIcon = getStatusIcon(task.status);
              const isExpanded = expandedTask === task.id;

              return (
                <div 
                  key={task.id}
                  className={cn(
                    "group rounded-xl border transition-all duration-200",
                    task.status === 'suspended' 
                      ? "border-border/30 bg-muted/30 opacity-80" 
                      : task.status === 'completed'
                      ? "border-accent/20 bg-accent/5"
                      : "border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/60"
                  )}
                >
                  {/* Task Row */}
                  <div 
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer"
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                  >
                    {/* Status Icon */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      task.status === 'completed' ? "bg-accent/15 text-accent" :
                      task.status === 'suspended' ? "bg-muted text-muted-foreground" :
                      task.priority === 'high' ? "bg-warning/15 text-warning" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      <StatusIcon className="w-4 h-4" />
                    </div>

                    {/* Account */}
                    <div className="w-44 shrink-0">
                      <p className="text-sm font-medium truncate">{task.account}</p>
                      <p className="text-xs text-muted-foreground">{task.journeyPhase}</p>
                    </div>

                    {/* Task */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{task.currentTask}</p>
                    </div>

                    {/* Trigger */}
                    <div className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0",
                      getTriggerColor(task.trigger.type)
                    )}>
                      <TriggerIcon className="w-3.5 h-3.5" />
                      {task.trigger.label}
                    </div>

                    {/* Due */}
                    <div className={cn(
                      "flex items-center gap-1.5 text-xs shrink-0 w-24",
                      getDueColor(task.dueContext)
                    )}>
                      <Calendar className="w-3.5 h-3.5" />
                      {task.dueContext === 'today' ? 'Today' : 
                       task.dueContext === 'overdue' ? task.dueDate : 
                       task.dueDate}
                    </div>

                    {/* Expand */}
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border/30 mt-0">
                      <div className="flex items-center gap-3 pt-3">
                        {task.playbook && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openWorkflowPanel(task);
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border/60 text-foreground hover:bg-secondary/60 transition-all"
                          >
                            <Settings2 className="w-4 h-4" />
                            View Playbook
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                          Mark Complete
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                          Defer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Larry's System Awareness */}
        <section className="max-w-2xl">
          <LarrySystemAwareness 
            onAction={(promptId, action) => {
              console.log('Action triggered:', promptId, action);
            }} 
          />
        </section>
      </div>

      {/* Dialogs & Panels */}
      <AccountImportDialog 
        isOpen={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)} 
      />

      <AssignPlaybookPanel
        isOpen={assignPanelOpen}
        onClose={() => {
          setAssignPanelOpen(false);
          setSelectedAwaitingAccount(null);
        }}
        accountName={selectedAwaitingAccount?.name || ''}
        segment={selectedAwaitingAccount?.segment || ''}
        arr={selectedAwaitingAccount?.arr || ''}
        onAssign={handleAssignPlaybook}
      />

      <WorkflowVisualizationPanel
        isOpen={workflowPanelOpen}
        onClose={() => {
          setWorkflowPanelOpen(false);
          setSelectedAccount(null);
        }}
        accountName={selectedAccount?.account || ''}
        playbookName={selectedAccount?.playbook || 'Workflow'}
        currentPhase={selectedAccount?.journeyPhase || ''}
        workflowData={{ phases: sampleWorkflowPhases as any }}
      />
    </div>
  );
};

export default OrchestratorAIPage;
