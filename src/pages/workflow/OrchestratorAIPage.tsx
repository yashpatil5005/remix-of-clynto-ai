import React, { useState } from 'react';
import { 
  Plus,
  Clock,
  CheckCircle2,
  Pause,
  Play,
  Building2,
  ChevronRight,
  Upload,
  Layers,
  AlertCircle,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WorkflowVisualizationPanel from '@/components/workflow/WorkflowVisualizationPanel';
import AccountImportDialog from '@/components/orchestrator/AccountImportDialog';
import AssignPlaybookPanel from '@/components/orchestrator/AssignPlaybookPanel';

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

interface ActiveWorkflow {
  id: string;
  account: {
    name: string;
    segment: string;
    arr: string;
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
  const [activeTab, setActiveTab] = useState<'awaiting' | 'active'>('active');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ActiveWorkflow | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [assignPanelOpen, setAssignPanelOpen] = useState(false);
  const [selectedAwaitingAccount, setSelectedAwaitingAccount] = useState<AwaitingAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Accounts awaiting activation
  const awaitingAccounts: AwaitingAccount[] = [
    { id: 'aw-1', name: 'Quantum Dynamics', segment: 'Enterprise', arr: '$180,000', source: 'CRM', daysSinceCreation: 3, suggestedStage: 'Onboarding' },
    { id: 'aw-2', name: 'Atlas Corp', segment: 'Mid-Market', arr: '$65,000', source: 'Bulk Upload', daysSinceCreation: 1, suggestedStage: 'Onboarding' },
    { id: 'aw-3', name: 'Vector Labs', segment: 'Enterprise', arr: '$220,000', source: 'CRM', daysSinceCreation: 5, suggestedStage: 'Onboarding' },
    { id: 'aw-4', name: 'Prism Technologies', segment: 'SMB', arr: '$28,000', source: 'Manual', daysSinceCreation: 2, suggestedStage: 'Onboarding' },
    { id: 'aw-5', name: 'Nova Systems', segment: 'Mid-Market', arr: '$85,000', source: 'CRM', daysSinceCreation: 4, suggestedStage: 'Onboarding' },
  ];

  const categoryFilters = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'onboarding', label: 'Onboarding', count: 8 },
    { id: 'at_risk', label: 'At Risk', count: 4 },
    { id: 'renewal', label: 'Renewal', count: 7 },
    { id: 'expansion', label: 'Expansion', count: 5 },
  ];

  // Active workflows data based on the reference image
  const activeWorkflows: ActiveWorkflow[] = [
    {
      id: '1',
      account: { name: 'Meridian Technologies', segment: 'Enterprise', arr: '$420,000' },
      playbook: { name: 'Enterprise Onboarding', lastActivity: '2 hours ago' },
      category: 'onboarding',
      progress: { currentPhase: 2, totalPhases: 6, percentage: 35 },
      currentPhaseName: 'Kickoff & Alignment',
      phaseTimeline: '3d in phase',
      status: 'running',
    },
    {
      id: '2',
      account: { name: 'Axiom Corp', segment: 'Enterprise', arr: '$280,000' },
      playbook: { name: 'Risk Mitigation', lastActivity: '1 day ago' },
      category: 'at_risk',
      progress: { currentPhase: 1, totalPhases: 4, percentage: 20 },
      currentPhaseName: 'Assessment',
      phaseTimeline: '5d in phase',
      status: 'attention',
    },
    {
      id: '3',
      account: { name: 'Summit Industries', segment: 'Mid-Market', arr: '$145,000' },
      playbook: { name: 'Expansion Discovery', lastActivity: '4 hours ago' },
      category: 'expansion',
      progress: { currentPhase: 3, totalPhases: 5, percentage: 60 },
      currentPhaseName: 'Value Mapping',
      phaseTimeline: '2d in phase',
      status: 'running',
    },
    {
      id: '4',
      account: { name: 'Pinnacle Tech', segment: 'Enterprise', arr: '$380,000' },
      playbook: { name: 'Renewal 90-Day', lastActivity: '6 hours ago' },
      category: 'renewal',
      progress: { currentPhase: 3, totalPhases: 6, percentage: 45 },
      currentPhaseName: 'Stakeholder Alignment',
      phaseTimeline: '4d in phase',
      status: 'running',
    },
    {
      id: '5',
      account: { name: 'Vertex Solutions', segment: 'Mid-Market', arr: '$195,000' },
      playbook: { name: 'Enterprise Onboarding', lastActivity: '1 hour ago' },
      category: 'onboarding',
      progress: { currentPhase: 4, totalPhases: 6, percentage: 70 },
      currentPhaseName: 'Configuration',
      phaseTimeline: '1d in phase',
      status: 'running',
    },
    {
      id: '6',
      account: { name: 'Nexus Global', segment: 'Enterprise', arr: '$520,000' },
      playbook: { name: 'Renewal 90-Day', lastActivity: '3 hours ago' },
      category: 'renewal',
      progress: { currentPhase: 5, totalPhases: 6, percentage: 85 },
      currentPhaseName: 'Contract Review',
      phaseTimeline: '2d in phase',
      status: 'running',
    },
  ];

  const getCategoryConfig = (category: ActiveWorkflow['category']) => {
    switch (category) {
      case 'onboarding':
        return { 
          label: 'Onboarding', 
          bgClass: 'bg-primary/10', 
          textClass: 'text-primary',
          borderClass: 'border-primary/20',
          progressClass: 'bg-primary'
        };
      case 'at_risk':
        return { 
          label: 'At Risk', 
          bgClass: 'bg-destructive/10', 
          textClass: 'text-destructive',
          borderClass: 'border-destructive/20',
          progressClass: 'bg-destructive'
        };
      case 'renewal':
        return { 
          label: 'Renewal', 
          bgClass: 'bg-warning/10', 
          textClass: 'text-warning',
          borderClass: 'border-warning/20',
          progressClass: 'bg-warning'
        };
      case 'expansion':
        return { 
          label: 'Expansion', 
          bgClass: 'bg-accent/10', 
          textClass: 'text-accent',
          borderClass: 'border-accent/20',
          progressClass: 'bg-accent'
        };
    }
  };

  const getStatusConfig = (status: ActiveWorkflow['status']) => {
    switch (status) {
      case 'running':
        return { 
          label: 'Running', 
          icon: Play, 
          bgClass: 'bg-accent/10', 
          textClass: 'text-accent',
          borderClass: 'border-accent/30'
        };
      case 'attention':
        return { 
          label: 'Attention Required', 
          icon: AlertCircle, 
          bgClass: 'bg-warning/10', 
          textClass: 'text-warning',
          borderClass: 'border-warning/30'
        };
      case 'paused':
        return { 
          label: 'Paused', 
          icon: Pause, 
          bgClass: 'bg-muted', 
          textClass: 'text-muted-foreground',
          borderClass: 'border-border'
        };
      case 'completed':
        return { 
          label: 'Completed', 
          icon: CheckCircle2, 
          bgClass: 'bg-accent/10', 
          textClass: 'text-accent',
          borderClass: 'border-accent/30'
        };
    }
  };

  const filteredWorkflows = activeWorkflows.filter(workflow => {
    const matchesCategory = categoryFilter === 'all' || workflow.category === categoryFilter;
    const matchesSearch = workflow.account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workflow.playbook.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openWorkflowPanel = (workflow: ActiveWorkflow) => {
    setSelectedWorkflow(workflow);
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
              <h1 className="text-2xl font-semibold tracking-tight">Orchestrator</h1>
              <p className="text-sm text-muted-foreground">Lifecycle assignment and workflow execution</p>
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
                  <span className="font-semibold text-foreground">{activeWorkflows.length}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-muted-foreground">Awaiting</span>
                  <span className="font-semibold text-foreground">{awaitingAccounts.length}</span>
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

      {/* Tab Navigation - Clear distinction between 2 pages */}
      <div className="px-6 pt-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('awaiting')}
            className={cn(
              "relative flex items-center gap-2.5 px-5 py-3 text-sm font-medium rounded-t-xl transition-all",
              activeTab === 'awaiting'
                ? "bg-card text-foreground border border-border/60 border-b-card -mb-px shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Clock className="w-4 h-4" />
            <span>Accounts Awaiting Activation</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums",
              activeTab === 'awaiting'
                ? "bg-warning/15 text-warning"
                : "bg-secondary text-muted-foreground"
            )}>
              {awaitingAccounts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              "relative flex items-center gap-2.5 px-5 py-3 text-sm font-medium rounded-t-xl transition-all",
              activeTab === 'active'
                ? "bg-card text-foreground border border-border/60 border-b-card -mb-px shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Layers className="w-4 h-4" />
            <span>Active Workflow Execution</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums",
              activeTab === 'active'
                ? "bg-accent/15 text-accent"
                : "bg-secondary text-muted-foreground"
            )}>
              {activeWorkflows.length}
            </span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Tab Content: Accounts Awaiting Activation */}
        {activeTab === 'awaiting' && (
          <section className="space-y-4">
            <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
              {/* Header */}
              <div className="grid grid-cols-[minmax(200px,2fr)_minmax(140px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(120px,1fr)_minmax(180px,auto)] gap-6 px-6 py-3 bg-secondary/40 border-b border-border/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Account</span>
                <span>Segment / ARR</span>
                <span>Source</span>
                <span>Days Waiting</span>
                <span>Suggested Stage</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Rows */}
              {awaitingAccounts.map((account) => (
                <div
                  key={account.id}
                  className="grid grid-cols-[minmax(200px,2fr)_minmax(140px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)_minmax(120px,1fr)_minmax(180px,auto)] gap-6 px-6 py-4 border-b border-border/30 last:border-b-0 items-center hover:bg-secondary/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm truncate">{account.name}</span>
                  </div>

                  <div className="text-sm">
                    <span className="text-foreground">{account.segment}</span>
                    <span className="text-muted-foreground"> · {account.arr}</span>
                  </div>

                  <div>
                    <span className={cn(
                      "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
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
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {account.suggestedStage}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openAssignPanel(account)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                      Assign Playbook
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab Content: Active Workflow Execution */}
        {activeTab === 'active' && (
          <section className="space-y-5">
            {/* Category Filters + Search */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setCategoryFilter(filter.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      categoryFilter === filter.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {filter.label}
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-xs tabular-nums",
                      categoryFilter === filter.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search accounts or playbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-72 rounded-lg border border-border/60 bg-card/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                />
              </div>
            </div>

            {/* Active Workflows Table */}
            <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
              {/* Header */}
              <div className="grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.5fr)_minmax(100px,0.8fr)_minmax(200px,1.5fr)_minmax(180px,1.2fr)_minmax(140px,1fr)_40px] gap-4 px-6 py-3 bg-secondary/40 border-b border-border/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Account</span>
                <span>Playbook</span>
                <span>Category</span>
                <span>Progress</span>
                <span>Current Phase</span>
                <span>Status</span>
                <span></span>
              </div>

              {/* Rows */}
              {filteredWorkflows.map((workflow) => {
                const categoryConfig = getCategoryConfig(workflow.category);
                const statusConfig = getStatusConfig(workflow.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={workflow.id}
                    onClick={() => openWorkflowPanel(workflow)}
                    className="grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.5fr)_minmax(100px,0.8fr)_minmax(200px,1.5fr)_minmax(180px,1.2fr)_minmax(140px,1fr)_40px] gap-4 px-6 py-4 border-b border-border/30 last:border-b-0 items-center hover:bg-secondary/20 transition-all cursor-pointer group"
                  >
                    {/* Account */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 border border-border/40 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{workflow.account.name}</p>
                        <p className="text-xs text-muted-foreground">{workflow.account.segment} · {workflow.account.arr}</p>
                      </div>
                    </div>

                    {/* Playbook */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{workflow.playbook.name}</p>
                      <p className="text-xs text-muted-foreground">{workflow.playbook.lastActivity}</p>
                    </div>

                    {/* Category Badge */}
                    <div>
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border",
                        categoryConfig.bgClass,
                        categoryConfig.textClass,
                        categoryConfig.borderClass
                      )}>
                        {categoryConfig.label}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Phase {workflow.progress.currentPhase} of {workflow.progress.totalPhases}</span>
                        <span className="font-semibold text-foreground">{workflow.progress.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all", categoryConfig.progressClass)}
                          style={{ width: `${workflow.progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Current Phase */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{workflow.currentPhaseName}</p>
                      <p className="text-xs text-muted-foreground">{workflow.phaseTimeline}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border",
                        statusConfig.bgClass,
                        statusConfig.textClass,
                        statusConfig.borderClass
                      )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {workflow.status === 'attention' ? 'Attention' : statusConfig.label}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Workflow Visualization Panel */}
      {selectedWorkflow && (
        <WorkflowVisualizationPanel
          isOpen={workflowPanelOpen}
          onClose={() => setWorkflowPanelOpen(false)}
          accountName={selectedWorkflow.account.name}
          playbookName={selectedWorkflow.playbook.name}
          currentPhase={selectedWorkflow.currentPhaseName}
          workflowData={{ phases: [] }}
        />
      )}

      {/* Account Import Dialog */}
      <AccountImportDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
      />

      {/* Assign Playbook Panel */}
      {selectedAwaitingAccount && (
        <AssignPlaybookPanel
          isOpen={assignPanelOpen}
          onClose={() => setAssignPanelOpen(false)}
          accountName={selectedAwaitingAccount.name}
          segment={selectedAwaitingAccount.segment}
          arr={selectedAwaitingAccount.arr}
          onAssign={handleAssignPlaybook}
        />
      )}
    </div>
  );
};

export default OrchestratorAIPage;
