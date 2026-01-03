import React, { useState } from 'react';
import { 
  Plus,
  Clock,
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
  ArrowRight,
  Target,
  Activity,
  Eye,
  Filter,
  Upload,
  FileUp,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import WorkflowVisualizationPanel from '@/components/workflow/WorkflowVisualizationPanel';
import AccountImportDialog from '@/components/orchestrator/AccountImportDialog';
import AssignPlaybookPanel from '@/components/orchestrator/AssignPlaybookPanel';
import PlaybookPreviewDialog from '@/components/orchestrator/PlaybookPreviewDialog';
import CustomerJourneyView from '@/components/orchestrator/CustomerJourneyView';
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

interface Playbook {
  id: string;
  name: string;
  matchScore: number;
  phases: number;
  avgDuration: string;
  category: 'onboarding' | 'at_risk' | 'renewal' | 'expansion';
}

const OrchestratorAIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'awaiting' | 'active'>('active');
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ActiveWorkflow | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [assignPanelOpen, setAssignPanelOpen] = useState(false);
  const [selectedAwaitingAccount, setSelectedAwaitingAccount] = useState<AwaitingAccount | null>(null);
  const [showSystemAwareness, setShowSystemAwareness] = useState(true);
  const [previewPlaybook, setPreviewPlaybook] = useState<Playbook | null>(null);
  const [previewAccount, setPreviewAccount] = useState<AwaitingAccount | null>(null);
  const [awaitingSearch, setAwaitingSearch] = useState('');

  // System awareness prompts
  const systemPrompts: SystemPrompt[] = [
    { id: 'prompt-1', type: 'activation', message: '5 accounts are awaiting activation.', action: 'Review Accounts', priority: 'high' },
    { id: 'prompt-2', type: 'stalled', message: 'Onboarding workflow appears stalled at Integrations phase.', accountName: 'Axiom Corp', action: 'View Workflow', priority: 'high' },
    { id: 'prompt-3', type: 'misaligned', message: 'Account matches a different lifecycle playbook.', accountName: 'Pinnacle Tech', action: 'Review Match', priority: 'medium' },
    { id: 'prompt-4', type: 'opportunity', message: 'Usage growth of 45% detected. Expansion opportunity identified.', accountName: 'Summit Industries', action: 'View Signal', priority: 'medium' },
  ];

  // Accounts awaiting activation
  const awaitingAccounts: AwaitingAccount[] = [
    { id: 'aw-1', name: 'Quantum Dynamics', segment: 'Enterprise', arr: '$180,000', source: 'CRM', daysSinceCreation: 3, suggestedStage: 'Onboarding', healthScore: 85 },
    { id: 'aw-2', name: 'Atlas Corp', segment: 'Mid-Market', arr: '$65,000', source: 'Bulk Upload', daysSinceCreation: 1, suggestedStage: 'Onboarding', healthScore: 78 },
    { id: 'aw-3', name: 'Vector Labs', segment: 'Enterprise', arr: '$220,000', source: 'CRM', daysSinceCreation: 5, suggestedStage: 'Onboarding', healthScore: 92 },
    { id: 'aw-4', name: 'Prism Technologies', segment: 'SMB', arr: '$28,000', source: 'Manual', daysSinceCreation: 2, suggestedStage: 'Onboarding', healthScore: 70 },
    { id: 'aw-5', name: 'Nova Systems', segment: 'Mid-Market', arr: '$85,000', source: 'CRM', daysSinceCreation: 4, suggestedStage: 'Onboarding', healthScore: 88 },
  ];

  // Available playbooks for compact cards
  const availablePlaybooks: Playbook[] = [
    { id: 'enterprise-onboarding', name: 'Enterprise Onboarding', matchScore: 94, phases: 7, avgDuration: '45 days', category: 'onboarding' },
    { id: 'standard-onboarding', name: 'Standard Onboarding', matchScore: 72, phases: 5, avgDuration: '30 days', category: 'onboarding' },
    { id: 'tech-fast-track', name: 'Tech Fast-Track', matchScore: 68, phases: 4, avgDuration: '21 days', category: 'onboarding' },
    { id: 'white-glove', name: 'White Glove Premium', matchScore: 88, phases: 8, avgDuration: '60 days', category: 'onboarding' },
    { id: 'risk-mitigation', name: 'Risk Mitigation', matchScore: 85, phases: 4, avgDuration: '30 days', category: 'at_risk' },
    { id: 'renewal-90', name: 'Renewal 90-Day', matchScore: 90, phases: 6, avgDuration: '90 days', category: 'renewal' },
    { id: 'expansion-discovery', name: 'Expansion Discovery', matchScore: 82, phases: 5, avgDuration: '45 days', category: 'expansion' },
  ];

  // Active workflows data
  const activeWorkflows: ActiveWorkflow[] = [
    { id: '1', account: { name: 'Meridian Technologies', segment: 'Enterprise', arr: '$420,000', healthScore: 87 }, playbook: { name: 'Enterprise Onboarding', lastActivity: '2 hours ago' }, category: 'onboarding', progress: { currentPhase: 2, totalPhases: 6, percentage: 35 }, currentPhaseName: 'Kickoff & Alignment', phaseTimeline: '3d in phase', status: 'running' },
    { id: '2', account: { name: 'Axiom Corp', segment: 'Enterprise', arr: '$280,000', healthScore: 54 }, playbook: { name: 'Risk Mitigation', lastActivity: '1 day ago' }, category: 'at_risk', progress: { currentPhase: 1, totalPhases: 4, percentage: 20 }, currentPhaseName: 'Assessment', phaseTimeline: '5d in phase', status: 'attention' },
    { id: '3', account: { name: 'Summit Industries', segment: 'Mid-Market', arr: '$145,000', healthScore: 91 }, playbook: { name: 'Expansion Discovery', lastActivity: '4 hours ago' }, category: 'expansion', progress: { currentPhase: 3, totalPhases: 5, percentage: 60 }, currentPhaseName: 'Value Mapping', phaseTimeline: '2d in phase', status: 'running' },
    { id: '4', account: { name: 'Pinnacle Tech', segment: 'Enterprise', arr: '$380,000', healthScore: 76 }, playbook: { name: 'Renewal 90-Day', lastActivity: '6 hours ago' }, category: 'renewal', progress: { currentPhase: 3, totalPhases: 6, percentage: 45 }, currentPhaseName: 'Stakeholder Alignment', phaseTimeline: '4d in phase', status: 'running' },
    { id: '5', account: { name: 'Vertex Solutions', segment: 'Mid-Market', arr: '$195,000', healthScore: 83 }, playbook: { name: 'Enterprise Onboarding', lastActivity: '1 hour ago' }, category: 'onboarding', progress: { currentPhase: 4, totalPhases: 6, percentage: 70 }, currentPhaseName: 'Configuration', phaseTimeline: '1d in phase', status: 'running' },
    { id: '6', account: { name: 'Nexus Global', segment: 'Enterprise', arr: '$520,000', healthScore: 94 }, playbook: { name: 'Renewal 90-Day', lastActivity: '3 hours ago' }, category: 'renewal', progress: { currentPhase: 5, totalPhases: 6, percentage: 85 }, currentPhaseName: 'Contract Review', phaseTimeline: '2d in phase', status: 'running' },
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
      case 'activation': return { bg: 'bg-warning/5', border: 'border-warning/20', icon: 'bg-warning/10 text-warning' };
      case 'stalled': return { bg: 'bg-destructive/5', border: 'border-destructive/20', icon: 'bg-destructive/10 text-destructive' };
      case 'misaligned': return { bg: 'bg-primary/5', border: 'border-primary/20', icon: 'bg-primary/10 text-primary' };
      case 'opportunity': return { bg: 'bg-accent/5', border: 'border-accent/20', icon: 'bg-accent/10 text-accent' };
      default: return { bg: 'bg-muted/50', border: 'border-border', icon: 'bg-muted text-muted-foreground' };
    }
  };

  const filteredAwaitingAccounts = awaitingAccounts.filter(account =>
    account.name.toLowerCase().includes(awaitingSearch.toLowerCase())
  );

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
      description: `Successfully assigned playbook to ${selectedAwaitingAccount?.name || previewAccount?.name}`,
    });
    setAssignPanelOpen(false);
    setSelectedAwaitingAccount(null);
    setPreviewPlaybook(null);
    setPreviewAccount(null);
  };

  const handleSystemPromptAction = (promptId: string, action: string) => {
    if (action === 'Review Accounts') {
      setActiveTab('awaiting');
    } else if (action === 'View Workflow') {
      const workflow = activeWorkflows.find(w => w.status === 'attention');
      if (workflow) openWorkflowPanel(workflow);
    }
    toast({ title: "Action Initiated", description: `${action} has been triggered.` });
  };

  const handleWorkflowAction = (workflowId: string, action: string) => {
    toast({ title: `Workflow ${action}`, description: `Workflow has been ${action.toLowerCase()}ed successfully.` });
  };

  const handleViewAccount = (accountName: string) => {
    toast({ title: "Navigating to Account", description: `Opening ${accountName} details...` });
  };

  const handleBulkAction = () => {
    setImportDialogOpen(true);
  };

  const handlePreviewPlaybook = (playbook: Playbook, account: AwaitingAccount) => {
    setPreviewPlaybook(playbook);
    setPreviewAccount(account);
  };

  const handleQuickAssign = (playbook: Playbook, account: AwaitingAccount) => {
    toast({
      title: "Playbook Assigned",
      description: `${playbook.name} assigned to ${account.name}`,
    });
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
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 font-medium">Live</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Lifecycle assignment and workflow execution engine</p>
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
                  <span className="font-semibold text-foreground tabular-nums">{activeWorkflows.filter(w => w.status === 'attention').length}</span>
                </div>
              </div>

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
                  <div key={prompt.id} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl border shrink-0 transition-all hover:shadow-sm", style.bg, style.border)}>
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", style.icon)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-sm text-foreground whitespace-nowrap">
                      {prompt.accountName && <span className="font-medium">{prompt.accountName}: </span>}
                      {prompt.message}
                    </p>
                    <button onClick={() => handleSystemPromptAction(prompt.id, prompt.action)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all shrink-0">
                      {prompt.action}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setShowSystemAwareness(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all shrink-0">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed System Awareness Toggle */}
      {!showSystemAwareness && (
        <div className="px-8 py-2 border-b border-border/40">
          <button onClick={() => setShowSystemAwareness(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all">
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
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums", activeTab === 'awaiting' ? "bg-warning/15 text-warning" : "bg-secondary text-muted-foreground")}>
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
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums", activeTab === 'active' ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground")}>
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
                <p className="text-sm text-muted-foreground mt-0.5">Accounts ready to be assigned a lifecycle playbook</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={awaitingSearch}
                    onChange={(e) => setAwaitingSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-64 rounded-xl border border-border/60 bg-card/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Awaiting Accounts with Compact Playbook Cards */}
            <div className="space-y-4">
              {filteredAwaitingAccounts.map((account) => (
                <div key={account.id} className="rounded-xl border border-border/60 bg-card/30 overflow-hidden">
                  {/* Account Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{account.name}</h3>
                        <p className="text-xs text-muted-foreground">{account.segment} · {account.arr}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 text-xs">
                        <Badge variant="secondary" className={cn("font-medium", account.source === 'CRM' ? "bg-primary/10 text-primary" : account.source === 'Bulk Upload' ? "bg-accent/10 text-accent" : "bg-secondary")}>
                          {account.source}
                        </Badge>
                        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg font-semibold", (account.healthScore || 0) >= 80 ? "bg-accent/10 text-accent" : (account.healthScore || 0) >= 60 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive")}>
                          <Activity className="w-3 h-3" />
                          {account.healthScore}%
                        </div>
                        <span className={cn("font-medium tabular-nums", account.daysSinceCreation >= 5 ? "text-destructive" : account.daysSinceCreation >= 3 ? "text-warning" : "text-muted-foreground")}>
                          {account.daysSinceCreation}d waiting
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewAccount(account.name)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Compact Playbook Cards */}
                  <div className="px-5 py-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Select Playbook</p>
                    <div className="grid grid-cols-4 xl:grid-cols-7 gap-2">
                      {availablePlaybooks.map((playbook) => (
                        <div
                          key={playbook.id}
                          className="group relative p-3 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-border transition-all cursor-pointer"
                        >
                          <div className="space-y-2">
                            <p className="text-xs font-medium leading-tight line-clamp-2">{playbook.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>{playbook.phases} phases</span>
                              <span>·</span>
                              <span>{playbook.avgDuration}</span>
                            </div>
                            <div className={cn("inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold", playbook.matchScore >= 90 ? "bg-accent/15 text-accent" : playbook.matchScore >= 70 ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground")}>
                              {playbook.matchScore}% match
                            </div>
                          </div>
                          
                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-background/95 rounded-lg flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="outline" className="h-7 text-xs w-full" onClick={(e) => { e.stopPropagation(); handlePreviewPlaybook(playbook, account); }}>
                              <Eye className="w-3 h-3 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" className="h-7 text-xs w-full" onClick={(e) => { e.stopPropagation(); handleQuickAssign(playbook, account); }}>
                              <Target className="w-3 h-3 mr-1" />
                              Assign
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Full Panel Option */}
                    <div className="mt-3 flex justify-end">
                      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => openAssignPanel(account)}>
                        View all options with AI recommendations
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab Content: Active Workflow Execution - Customer Journey View */}
        {activeTab === 'active' && (
          <CustomerJourneyView
            workflows={activeWorkflows}
            onOpenWorkflow={openWorkflowPanel}
            onWorkflowAction={handleWorkflowAction}
            onViewAccount={handleViewAccount}
          />
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
      <AccountImportDialog isOpen={importDialogOpen} onClose={() => setImportDialogOpen(false)} />

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

      {/* Playbook Preview Dialog */}
      {previewPlaybook && previewAccount && (
        <PlaybookPreviewDialog
          isOpen={!!previewPlaybook}
          onClose={() => { setPreviewPlaybook(null); setPreviewAccount(null); }}
          playbook={previewPlaybook}
          onAssign={() => handleAssignPlaybook(previewPlaybook.id)}
        />
      )}
    </div>
  );
};

export default OrchestratorAIPage;
