import React, { useState } from 'react';
import { 
  Plus,
  Clock,
  CheckCircle2,
  Pause,
  Play,
  Building2,
  ChevronRight,
  ChevronDown,
  Layers,
  AlertCircle,
  Search,
  Sparkles,
  TrendingDown,
  Shuffle,
  Zap,
  RefreshCw,
  ArrowRight,
  MoreHorizontal,
  Target,
  Calendar,
  Users,
  Activity,
  Eye,
  Settings,
  Filter,
  RotateCcw,
  Upload,
  FileUp,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import WorkflowVisualizationPanel from '@/components/workflow/WorkflowVisualizationPanel';
import AccountImportDialog from '@/components/orchestrator/AccountImportDialog';
import AssignPlaybookPanel from '@/components/orchestrator/AssignPlaybookPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  healthScore?: number;
}

interface SystemPrompt {
  id: string;
  type: 'activation' | 'stalled' | 'misaligned' | 'opportunity';
  message: string;
  accountName?: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
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
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [showSystemAwareness, setShowSystemAwareness] = useState(true);

  // System awareness prompts (Larry's intelligence)
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
      message: 'Onboarding workflow appears stalled at Integrations phase.',
      accountName: 'Axiom Corp',
      action: 'View Workflow',
      priority: 'high',
    },
    {
      id: 'prompt-3',
      type: 'misaligned',
      message: 'Account matches a different lifecycle playbook.',
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

  // Accounts awaiting activation
  const awaitingAccounts: AwaitingAccount[] = [
    { id: 'aw-1', name: 'Quantum Dynamics', segment: 'Enterprise', arr: '$180,000', source: 'CRM', daysSinceCreation: 3, suggestedStage: 'Onboarding', healthScore: 85 },
    { id: 'aw-2', name: 'Atlas Corp', segment: 'Mid-Market', arr: '$65,000', source: 'Bulk Upload', daysSinceCreation: 1, suggestedStage: 'Onboarding', healthScore: 78 },
    { id: 'aw-3', name: 'Vector Labs', segment: 'Enterprise', arr: '$220,000', source: 'CRM', daysSinceCreation: 5, suggestedStage: 'Onboarding', healthScore: 92 },
    { id: 'aw-4', name: 'Prism Technologies', segment: 'SMB', arr: '$28,000', source: 'Manual', daysSinceCreation: 2, suggestedStage: 'Onboarding', healthScore: 70 },
    { id: 'aw-5', name: 'Nova Systems', segment: 'Mid-Market', arr: '$85,000', source: 'CRM', daysSinceCreation: 4, suggestedStage: 'Onboarding', healthScore: 88 },
  ];

  const categoryFilters = [
    { id: 'all', label: 'All Workflows', count: 24 },
    { id: 'onboarding', label: 'Onboarding', count: 8 },
    { id: 'at_risk', label: 'At Risk', count: 4 },
    { id: 'renewal', label: 'Renewal', count: 7 },
    { id: 'expansion', label: 'Expansion', count: 5 },
  ];

  // Active workflows data
  const activeWorkflows: ActiveWorkflow[] = [
    {
      id: '1',
      account: { name: 'Meridian Technologies', segment: 'Enterprise', arr: '$420,000', healthScore: 87 },
      playbook: { name: 'Enterprise Onboarding', lastActivity: '2 hours ago' },
      category: 'onboarding',
      progress: { currentPhase: 2, totalPhases: 6, percentage: 35 },
      currentPhaseName: 'Kickoff & Alignment',
      phaseTimeline: '3d in phase',
      status: 'running',
    },
    {
      id: '2',
      account: { name: 'Axiom Corp', segment: 'Enterprise', arr: '$280,000', healthScore: 54 },
      playbook: { name: 'Risk Mitigation', lastActivity: '1 day ago' },
      category: 'at_risk',
      progress: { currentPhase: 1, totalPhases: 4, percentage: 20 },
      currentPhaseName: 'Assessment',
      phaseTimeline: '5d in phase',
      status: 'attention',
    },
    {
      id: '3',
      account: { name: 'Summit Industries', segment: 'Mid-Market', arr: '$145,000', healthScore: 91 },
      playbook: { name: 'Expansion Discovery', lastActivity: '4 hours ago' },
      category: 'expansion',
      progress: { currentPhase: 3, totalPhases: 5, percentage: 60 },
      currentPhaseName: 'Value Mapping',
      phaseTimeline: '2d in phase',
      status: 'running',
    },
    {
      id: '4',
      account: { name: 'Pinnacle Tech', segment: 'Enterprise', arr: '$380,000', healthScore: 76 },
      playbook: { name: 'Renewal 90-Day', lastActivity: '6 hours ago' },
      category: 'renewal',
      progress: { currentPhase: 3, totalPhases: 6, percentage: 45 },
      currentPhaseName: 'Stakeholder Alignment',
      phaseTimeline: '4d in phase',
      status: 'running',
    },
    {
      id: '5',
      account: { name: 'Vertex Solutions', segment: 'Mid-Market', arr: '$195,000', healthScore: 83 },
      playbook: { name: 'Enterprise Onboarding', lastActivity: '1 hour ago' },
      category: 'onboarding',
      progress: { currentPhase: 4, totalPhases: 6, percentage: 70 },
      currentPhaseName: 'Configuration',
      phaseTimeline: '1d in phase',
      status: 'running',
    },
    {
      id: '6',
      account: { name: 'Nexus Global', segment: 'Enterprise', arr: '$520,000', healthScore: 94 },
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
          bgClass: 'bg-destructive/10', 
          textClass: 'text-destructive',
          borderClass: 'border-destructive/30'
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
      case 'activation': return { bg: 'bg-warning/5', border: 'border-warning/20', icon: 'bg-warning/10 text-warning' };
      case 'stalled': return { bg: 'bg-destructive/5', border: 'border-destructive/20', icon: 'bg-destructive/10 text-destructive' };
      case 'misaligned': return { bg: 'bg-primary/5', border: 'border-primary/20', icon: 'bg-primary/10 text-primary' };
      case 'opportunity': return { bg: 'bg-accent/5', border: 'border-accent/20', icon: 'bg-accent/10 text-accent' };
      default: return { bg: 'bg-muted/50', border: 'border-border', icon: 'bg-muted text-muted-foreground' };
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
    toast({
      title: "Playbook Assigned",
      description: `Successfully assigned playbook to ${selectedAwaitingAccount?.name}`,
    });
    setAssignPanelOpen(false);
    setSelectedAwaitingAccount(null);
  };

  const handleSystemPromptAction = (promptId: string, action: string) => {
    if (action === 'Review Accounts') {
      setActiveTab('awaiting');
    } else if (action === 'View Workflow') {
      const workflow = activeWorkflows.find(w => w.status === 'attention');
      if (workflow) openWorkflowPanel(workflow);
    }
    toast({
      title: "Action Initiated",
      description: `${action} has been triggered.`,
    });
  };

  const handleWorkflowAction = (workflowId: string, action: string) => {
    toast({
      title: `Workflow ${action}`,
      description: `Workflow has been ${action.toLowerCase()}ed successfully.`,
    });
  };

  const handleViewAccount = (accountName: string) => {
    toast({
      title: "Navigating to Account",
      description: `Opening ${accountName} details...`,
    });
  };

  const handleBulkAction = () => {
    toast({
      title: "Bulk Import",
      description: "Opening bulk import dialog...",
    });
    setImportDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Hero Header */}
      <div className="border-b border-border/40 bg-gradient-to-b from-card/80 to-background">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">Orchestrator</h1>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-medium">
                  Live
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Lifecycle assignment and workflow execution engine
              </p>
            </div>

            {/* System Metrics */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/80 border border-border/50">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                  </span>
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-semibold text-foreground tabular-nums">{activeWorkflows.length}</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/80 border border-border/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-warning" />
                  <span className="text-muted-foreground">Awaiting</span>
                  <span className="font-semibold text-foreground tabular-nums">{awaitingAccounts.length}</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/80 border border-border/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Attention</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {activeWorkflows.filter(w => w.status === 'attention').length}
                  </span>
                </div>
              </div>

              {/* Primary Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 shadow-sm">
                    <Plus className="w-4 h-4" />
                    Add Accounts
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => setImportDialogOpen(true)} className="gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import from CRM
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkAction} className="gap-2 cursor-pointer">
                    <FileUp className="w-4 h-4" />
                    Bulk Upload (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setImportDialogOpen(true)} className="gap-2 cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                    Add Manually
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Larry's System Awareness */}
      {showSystemAwareness && (
        <div className="px-8 py-4 border-b border-border/40 bg-gradient-to-r from-primary/[0.02] via-transparent to-accent/[0.02]">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">System Awareness</p>
                <p className="text-xs text-muted-foreground">Intelligence requiring attention</p>
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-1">
              {systemPrompts.map((prompt) => {
                const Icon = getPromptIcon(prompt.type);
                const style = getPromptStyle(prompt.type);
                
                return (
                  <div
                    key={prompt.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl border shrink-0 transition-all hover:shadow-sm",
                      style.bg,
                      style.border
                    )}
                  >
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", style.icon)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm text-foreground whitespace-nowrap">
                      {prompt.accountName && <span className="font-medium">{prompt.accountName}: </span>}
                      {prompt.message}
                    </p>
                    <button
                      onClick={() => handleSystemPromptAction(prompt.id, prompt.action)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all shrink-0"
                    >
                      {prompt.action}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowSystemAwareness(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all shrink-0"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed System Awareness Toggle */}
      {!showSystemAwareness && (
        <div className="px-8 py-2 border-b border-border/40">
          <button
            onClick={() => setShowSystemAwareness(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{systemPrompts.length} system insights available</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="px-8 pt-5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('awaiting')}
            className={cn(
              "relative flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium rounded-t-xl transition-all",
              activeTab === 'awaiting'
                ? "bg-card text-foreground border border-border/60 border-b-card -mb-px shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Clock className="w-4 h-4" />
            <span>Accounts Awaiting Activation</span>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums",
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
              "relative flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium rounded-t-xl transition-all",
              activeTab === 'active'
                ? "bg-card text-foreground border border-border/60 border-b-card -mb-px shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Layers className="w-4 h-4" />
            <span>Active Workflow Execution</span>
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums",
              activeTab === 'active'
                ? "bg-accent/15 text-accent"
                : "bg-secondary text-muted-foreground"
            )}>
              {activeWorkflows.length}
            </span>
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Tab Content: Accounts Awaiting Activation */}
        {activeTab === 'awaiting' && (
          <section className="space-y-5">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Pending Activation</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Accounts ready to be assigned a lifecycle playbook
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    className="pl-10 pr-4 py-2.5 w-64 rounded-xl border border-border/60 bg-card/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
              {/* Table Header */}
              <div className="grid grid-cols-[minmax(200px,2fr)_minmax(140px,1fr)_minmax(100px,0.8fr)_minmax(80px,0.6fr)_minmax(100px,0.8fr)_minmax(120px,1fr)_minmax(160px,auto)] gap-4 px-6 py-3.5 bg-secondary/40 border-b border-border/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Account</span>
                <span>Segment / ARR</span>
                <span>Source</span>
                <span>Health</span>
                <span>Waiting</span>
                <span>Suggested Stage</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Table Rows */}
              {awaitingAccounts.map((account, index) => (
                <div
                  key={account.id}
                  className={cn(
                    "grid grid-cols-[minmax(200px,2fr)_minmax(140px,1fr)_minmax(100px,0.8fr)_minmax(80px,0.6fr)_minmax(100px,0.8fr)_minmax(120px,1fr)_minmax(160px,auto)] gap-4 px-6 py-4 items-center transition-all hover:bg-secondary/20",
                    index !== awaitingAccounts.length - 1 && "border-b border-border/30"
                  )}
                >
                  {/* Account */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-sm truncate">{account.name}</span>
                  </div>

                  {/* Segment / ARR */}
                  <div className="text-sm">
                    <span className="text-foreground font-medium">{account.segment}</span>
                    <span className="text-muted-foreground"> · {account.arr}</span>
                  </div>

                  {/* Source */}
                  <div>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        "font-medium",
                        account.source === 'CRM' ? "bg-primary/10 text-primary border-primary/20" :
                        account.source === 'Bulk Upload' ? "bg-accent/10 text-accent border-accent/20" :
                        "bg-secondary text-muted-foreground"
                      )}
                    >
                      {account.source}
                    </Badge>
                  </div>

                  {/* Health Score */}
                  <div>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold tabular-nums",
                      (account.healthScore || 0) >= 80 ? "bg-accent/10 text-accent" :
                      (account.healthScore || 0) >= 60 ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    )}>
                      <Activity className="w-3 h-3" />
                      {account.healthScore}%
                    </div>
                  </div>

                  {/* Days Waiting */}
                  <div className={cn(
                    "text-sm font-medium tabular-nums",
                    account.daysSinceCreation >= 5 ? "text-destructive" :
                    account.daysSinceCreation >= 3 ? "text-warning" :
                    "text-muted-foreground"
                  )}>
                    {account.daysSinceCreation} {account.daysSinceCreation === 1 ? 'day' : 'days'}
                  </div>

                  {/* Suggested Stage */}
                  <div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-medium">
                      {account.suggestedStage}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleViewAccount(account.name)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openAssignPanel(account)}
                      className="gap-1.5"
                    >
                      <Target className="w-3.5 h-3.5" />
                      Assign Playbook
                    </Button>
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
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                      categoryFilter === filter.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {filter.label}
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-xs tabular-nums",
                      categoryFilter === filter.id
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search accounts or playbooks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-72 rounded-xl border border-border/60 bg-card/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Active Workflows List */}
            <div className="space-y-3">
              {filteredWorkflows.map((workflow) => {
                const categoryConfig = getCategoryConfig(workflow.category);
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
                        : "border-border/60 bg-card/30",
                      isExpanded && "ring-1 ring-primary/20 shadow-lg"
                    )}
                  >
                    {/* Main Row */}
                    <div
                      className="grid grid-cols-[minmax(220px,2fr)_minmax(180px,1.5fr)_minmax(100px,0.8fr)_minmax(200px,1.5fr)_minmax(180px,1.2fr)_minmax(140px,1fr)_50px] gap-4 px-6 py-4 items-center cursor-pointer group hover:bg-secondary/20 transition-all"
                      onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
                    >
                      {/* Account */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 border border-border/40 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {workflow.status === 'attention' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
                              <AlertCircle className="w-2.5 h-2.5 text-destructive-foreground" />
                            </div>
                          )}
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
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium",
                            categoryConfig.bgClass,
                            categoryConfig.textClass,
                            categoryConfig.borderClass
                          )}
                        >
                          {categoryConfig.label}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Phase {workflow.progress.currentPhase} of {workflow.progress.totalPhases}</span>
                          <span className="font-semibold text-foreground tabular-nums">{workflow.progress.percentage}%</span>
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
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1.5 font-medium",
                            statusConfig.bgClass,
                            statusConfig.textClass,
                            statusConfig.borderClass
                          )}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {workflow.status === 'attention' ? 'Attention' : statusConfig.label}
                        </Badge>
                      </div>

                      {/* Expand/Actions */}
                      <div className="flex items-center justify-end gap-1">
                        <div className={cn(
                          "text-muted-foreground transition-transform",
                          isExpanded && "rotate-180"
                        )}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 py-5 border-t border-border/40 bg-secondary/10">
                        <div className="grid grid-cols-4 gap-6">
                          {/* Account Health */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Health</h4>
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
                                (workflow.account.healthScore || 0) >= 80 ? "bg-accent/10 text-accent" :
                                (workflow.account.healthScore || 0) >= 60 ? "bg-warning/10 text-warning" :
                                "bg-destructive/10 text-destructive"
                              )}>
                                {workflow.account.healthScore}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">Health Score</p>
                                <p className="text-xs text-muted-foreground">
                                  {(workflow.account.healthScore || 0) >= 80 ? 'Healthy' :
                                   (workflow.account.healthScore || 0) >= 60 ? 'Monitor' : 'At Risk'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Phase Details */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Phase</h4>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-foreground">{workflow.currentPhaseName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{workflow.phaseTimeline}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Users className="w-3.5 h-3.5" />
                                <span>3 tasks remaining</span>
                              </div>
                            </div>
                          </div>

                          {/* Recent Activity */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Activity</h4>
                            <div className="space-y-2">
                              <p className="text-sm text-foreground">Last touch: {workflow.playbook.lastActivity}</p>
                              <p className="text-xs text-muted-foreground">Email sent to stakeholder</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</h4>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openWorkflowPanel(workflow);
                                }}
                                className="gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Workflow
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWorkflowAction(workflow.id, 'Pause');
                                }}
                                className="gap-1.5"
                              >
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
                                  <DropdownMenuItem 
                                    onClick={() => handleViewAccount(workflow.account.name)}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Building2 className="w-4 h-4" />
                                    View Account
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleWorkflowAction(workflow.id, 'Reassign')}
                                    className="gap-2 cursor-pointer"
                                  >
                                    <Settings className="w-4 h-4" />
                                    Change Playbook
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleWorkflowAction(workflow.id, 'Cancel')}
                                    className="gap-2 cursor-pointer text-destructive"
                                  >
                                    <AlertCircle className="w-4 h-4" />
                                    Cancel Workflow
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
