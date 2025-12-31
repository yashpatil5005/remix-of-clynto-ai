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
  Layers,
  Play,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Users,
  Target,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WorkflowVisualizationPanel from '@/components/workflow/WorkflowVisualizationPanel';
import AccountImportDialog from '@/components/orchestrator/AccountImportDialog';
import AssignPlaybookPanel from '@/components/orchestrator/AssignPlaybookPanel';
import { Progress } from '@/components/ui/progress';

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

interface PlaybookInstance {
  id: string;
  accountName: string;
  accountSegment: 'Enterprise' | 'Mid-Market' | 'SMB';
  arr: string;
  playbookName: string;
  lifecycleCategory: 'onboarding' | 'at_risk' | 'renewal' | 'expansion';
  progress: number;
  currentPhase: string;
  totalPhases: number;
  currentPhaseIndex: number;
  status: 'running' | 'paused' | 'attention_required';
  daysInPhase: number;
  lastActivity: string;
  workflowData?: { phases: Phase[] };
}

interface ExecutionTask {
  id: string;
  accountName: string;
  playbookName: string;
  lifecycleCategory: 'onboarding' | 'at_risk' | 'renewal' | 'expansion';
  taskName: string;
  phase: string;
  trigger: {
    type: 'workflow' | 'event' | 'system';
    label: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueContext: 'overdue' | 'today' | 'upcoming';
  dueDate?: string;
  progress: number;
  workflowData?: { phases: Phase[] };
}

const OrchestratorAIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orchestration' | 'execution'>('orchestration');
  const [activeLifecycleFilter, setActiveLifecycleFilter] = useState<'all' | 'onboarding' | 'at_risk' | 'renewal' | 'expansion'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'blocked'>('all');
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<PlaybookInstance | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [assignPanelOpen, setAssignPanelOpen] = useState(false);
  const [selectedAccountForAssign, setSelectedAccountForAssign] = useState<{ name: string; segment: string; arr: string } | null>(null);

  // Sample workflow phases for visualization
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

  // Lifecycle categories with counts
  const lifecycleCategories = [
    { 
      id: 'onboarding' as const, 
      label: 'Onboarding', 
      count: 12, 
      icon: Play,
      color: 'bg-[hsl(var(--stage-onboarding))]/15 text-[hsl(var(--stage-onboarding))] border-[hsl(var(--stage-onboarding))]/30',
      activeColor: 'bg-[hsl(var(--stage-onboarding))] text-white',
      description: 'New accounts in setup'
    },
    { 
      id: 'at_risk' as const, 
      label: 'At Risk', 
      count: 8, 
      icon: AlertCircle,
      color: 'bg-destructive/10 text-destructive border-destructive/30',
      activeColor: 'bg-destructive text-white',
      description: 'Accounts needing attention'
    },
    { 
      id: 'renewal' as const, 
      label: 'Renewal', 
      count: 18, 
      icon: RefreshCw,
      color: 'bg-[hsl(var(--stage-renewal))]/15 text-[hsl(var(--stage-renewal))] border-[hsl(var(--stage-renewal))]/30',
      activeColor: 'bg-[hsl(var(--stage-renewal))] text-white',
      description: 'Upcoming renewals'
    },
    { 
      id: 'expansion' as const, 
      label: 'Expansion', 
      count: 9, 
      icon: TrendingUp,
      color: 'bg-accent/15 text-accent border-accent/30',
      activeColor: 'bg-accent text-white',
      description: 'Growth opportunities'
    },
  ];

  // Playbook instances for strategic view
  const playbookInstances: PlaybookInstance[] = [
    {
      id: 'pb-1',
      accountName: 'Meridian Technologies',
      accountSegment: 'Enterprise',
      arr: '$420,000',
      playbookName: 'Enterprise Onboarding',
      lifecycleCategory: 'onboarding',
      progress: 35,
      currentPhase: 'Kickoff & Alignment',
      totalPhases: 6,
      currentPhaseIndex: 2,
      status: 'running',
      daysInPhase: 3,
      lastActivity: '2 hours ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'pb-2',
      accountName: 'Axiom Corp',
      accountSegment: 'Enterprise',
      arr: '$280,000',
      playbookName: 'Risk Mitigation',
      lifecycleCategory: 'at_risk',
      progress: 20,
      currentPhase: 'Assessment',
      totalPhases: 4,
      currentPhaseIndex: 1,
      status: 'attention_required',
      daysInPhase: 5,
      lastActivity: '1 day ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'pb-3',
      accountName: 'Summit Industries',
      accountSegment: 'Mid-Market',
      arr: '$145,000',
      playbookName: 'Expansion Discovery',
      lifecycleCategory: 'expansion',
      progress: 60,
      currentPhase: 'Value Mapping',
      totalPhases: 5,
      currentPhaseIndex: 3,
      status: 'running',
      daysInPhase: 2,
      lastActivity: '4 hours ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'pb-4',
      accountName: 'Pinnacle Tech',
      accountSegment: 'Enterprise',
      arr: '$380,000',
      playbookName: 'Renewal 90-Day',
      lifecycleCategory: 'renewal',
      progress: 45,
      currentPhase: 'Stakeholder Alignment',
      totalPhases: 6,
      currentPhaseIndex: 3,
      status: 'running',
      daysInPhase: 4,
      lastActivity: '6 hours ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'pb-5',
      accountName: 'Vertex Solutions',
      accountSegment: 'Mid-Market',
      arr: '$95,000',
      playbookName: 'Health Recovery',
      lifecycleCategory: 'at_risk',
      progress: 15,
      currentPhase: 'Root Cause Analysis',
      totalPhases: 5,
      currentPhaseIndex: 1,
      status: 'paused',
      daysInPhase: 7,
      lastActivity: '3 days ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'pb-6',
      accountName: 'Nova Systems',
      accountSegment: 'SMB',
      arr: '$48,000',
      playbookName: 'SMB Onboarding',
      lifecycleCategory: 'onboarding',
      progress: 75,
      currentPhase: 'Training & Enablement',
      totalPhases: 4,
      currentPhaseIndex: 3,
      status: 'running',
      daysInPhase: 1,
      lastActivity: '30 minutes ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'pb-7',
      accountName: 'Quantum Dynamics',
      accountSegment: 'Enterprise',
      arr: '$520,000',
      playbookName: 'Renewal 60-Day',
      lifecycleCategory: 'renewal',
      progress: 25,
      currentPhase: 'Value Review',
      totalPhases: 5,
      currentPhaseIndex: 2,
      status: 'attention_required',
      daysInPhase: 6,
      lastActivity: '1 day ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'pb-8',
      accountName: 'Atlas Corp',
      accountSegment: 'Mid-Market',
      arr: '$125,000',
      playbookName: 'Upsell Motion',
      lifecycleCategory: 'expansion',
      progress: 40,
      currentPhase: 'Opportunity Qualification',
      totalPhases: 6,
      currentPhaseIndex: 3,
      status: 'running',
      daysInPhase: 2,
      lastActivity: '5 hours ago',
      workflowData: { phases: sampleWorkflowPhases },
    },
  ];

  // Execution tasks for operational view
  const executionTasks: ExecutionTask[] = [
    {
      id: 'task-1',
      accountName: 'Meridian Technologies',
      playbookName: 'Enterprise Onboarding',
      lifecycleCategory: 'onboarding',
      taskName: 'Schedule kickoff meeting with stakeholders',
      phase: 'Kickoff & Alignment',
      trigger: { type: 'workflow', label: 'Playbook Step' },
      status: 'in_progress',
      dueContext: 'today',
      progress: 35,
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'task-2',
      accountName: 'Axiom Corp',
      playbookName: 'Risk Mitigation',
      lifecycleCategory: 'at_risk',
      taskName: 'Conduct health assessment call',
      phase: 'Assessment',
      trigger: { type: 'system', label: 'Usage Drop -32%' },
      status: 'pending',
      dueContext: 'overdue',
      dueDate: '2 days ago',
      progress: 20,
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'task-3',
      accountName: 'Summit Industries',
      playbookName: 'Expansion Discovery',
      lifecycleCategory: 'expansion',
      taskName: 'Present expansion proposal',
      phase: 'Value Mapping',
      trigger: { type: 'event', label: 'Champion Request' },
      status: 'pending',
      dueContext: 'upcoming',
      dueDate: 'Tomorrow',
      progress: 60,
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'task-4',
      accountName: 'Pinnacle Tech',
      playbookName: 'Renewal 90-Day',
      lifecycleCategory: 'renewal',
      taskName: 'Send renewal proposal draft',
      phase: 'Stakeholder Alignment',
      trigger: { type: 'workflow', label: 'Playbook Step' },
      status: 'in_progress',
      dueContext: 'today',
      progress: 45,
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'task-5',
      accountName: 'Vertex Solutions',
      playbookName: 'Health Recovery',
      lifecycleCategory: 'at_risk',
      taskName: 'Review support ticket patterns',
      phase: 'Root Cause Analysis',
      trigger: { type: 'system', label: 'Ticket Spike' },
      status: 'blocked',
      dueContext: 'overdue',
      dueDate: '3 days ago',
      progress: 15,
      workflowData: { phases: sampleWorkflowPhases },
    },
    {
      id: 'task-6',
      accountName: 'Quantum Dynamics',
      playbookName: 'Renewal 60-Day',
      lifecycleCategory: 'renewal',
      taskName: 'Schedule executive sponsor meeting',
      phase: 'Value Review',
      trigger: { type: 'workflow', label: 'Playbook Step' },
      status: 'pending',
      dueContext: 'today',
      progress: 25,
      workflowData: { phases: sampleWorkflowPhases },
    },
  ];

  const getLifecycleCategoryStyles = (category: string) => {
    switch (category) {
      case 'onboarding':
        return 'bg-[hsl(var(--stage-onboarding))]/10 text-[hsl(var(--stage-onboarding))] border-[hsl(var(--stage-onboarding))]/20';
      case 'at_risk':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'renewal':
        return 'bg-[hsl(var(--stage-renewal))]/10 text-[hsl(var(--stage-renewal))] border-[hsl(var(--stage-renewal))]/20';
      case 'expansion':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'running':
        return { bg: 'bg-accent/15', text: 'text-accent', icon: Play };
      case 'paused':
        return { bg: 'bg-muted', text: 'text-muted-foreground', icon: Pause };
      case 'attention_required':
        return { bg: 'bg-warning/15', text: 'text-warning', icon: AlertCircle };
      case 'in_progress':
        return { bg: 'bg-primary/15', text: 'text-primary', icon: RefreshCw };
      case 'completed':
        return { bg: 'bg-accent/15', text: 'text-accent', icon: CheckCircle2 };
      case 'blocked':
        return { bg: 'bg-destructive/15', text: 'text-destructive', icon: AlertCircle };
      default:
        return { bg: 'bg-secondary', text: 'text-muted-foreground', icon: Clock };
    }
  };

  const getTriggerStyles = (type: string) => {
    switch (type) {
      case 'workflow':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'system':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'event':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const filteredPlaybooks = playbookInstances.filter(pb => 
    activeLifecycleFilter === 'all' || pb.lifecycleCategory === activeLifecycleFilter
  );

  const filteredTasks = executionTasks.filter(task => {
    const matchesLifecycle = activeLifecycleFilter === 'all' || task.lifecycleCategory === activeLifecycleFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesLifecycle && matchesStatus;
  });

  const openWorkflowPanel = (playbook: PlaybookInstance) => {
    setSelectedPlaybook(playbook);
    setWorkflowPanelOpen(true);
  };

  const handleAssignPlaybook = (playbookId: string) => {
    console.log('Assigned playbook:', playbookId, 'to account:', selectedAccountForAssign?.name);
    setAssignPanelOpen(false);
    setSelectedAccountForAssign(null);
  };

  const totalActivePlaybooks = playbookInstances.length;
  const attentionRequired = playbookInstances.filter(pb => pb.status === 'attention_required').length;
  const pausedCount = playbookInstances.filter(pb => pb.status === 'paused').length;

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Hero Header */}
      <div className="border-b border-border/40 bg-gradient-to-b from-card/80 to-background">
        <div className="px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">Orchestrator AI</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    AI-orchestrated customer journeys with human-first control
                  </p>
                </div>
              </div>
            </div>

            {/* System Status Indicators */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                  </span>
                  <span className="text-muted-foreground">Active Journeys</span>
                  <span className="font-semibold text-foreground tabular-nums">{totalActivePlaybooks}</span>
                </div>
                {attentionRequired > 0 && (
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-warning/10 border border-warning/20">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    <span className="text-muted-foreground">Needs Attention</span>
                    <span className="font-semibold text-foreground tabular-nums">{attentionRequired}</span>
                  </div>
                )}
                {pausedCount > 0 && (
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-secondary border border-border/40">
                    <Pause className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Paused</span>
                    <span className="font-semibold text-foreground tabular-nums">{pausedCount}</span>
                  </div>
                )}
              </div>

              {/* Primary Action */}
              <button
                onClick={() => setImportDialogOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Plus className="w-4 h-4" />
                Add Accounts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="px-8 pt-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orchestration')}
            className={cn(
              "flex items-center gap-2.5 px-6 py-4 text-base font-medium border-b-2 transition-all -mb-px",
              activeTab === 'orchestration'
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Layers className="w-5 h-5" />
            Lifecycle Orchestration
          </button>
          <button
            onClick={() => setActiveTab('execution')}
            className={cn(
              "flex items-center gap-2.5 px-6 py-4 text-base font-medium border-b-2 transition-all -mb-px",
              activeTab === 'execution'
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Target className="w-5 h-5" />
            Active Execution
          </button>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Lifecycle Category Strip - Always Visible */}
        <div className="grid grid-cols-4 gap-4">
          {lifecycleCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeLifecycleFilter === category.id;
            const isAll = activeLifecycleFilter === 'all';
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveLifecycleFilter(isActive ? 'all' : category.id)}
                className={cn(
                  "relative group flex flex-col items-start p-5 rounded-2xl border transition-all duration-300",
                  isActive
                    ? `${category.activeColor} shadow-lg`
                    : `${category.color} hover:shadow-md hover:scale-[1.02]`,
                  isAll && "opacity-100"
                )}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "")} />
                  <span className={cn(
                    "text-2xl font-bold tabular-nums",
                    isActive ? "text-white" : ""
                  )}>
                    {category.count}
                  </span>
                </div>
                <span className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-white" : ""
                )}>
                  {category.label}
                </span>
                <span className={cn(
                  "text-xs mt-1",
                  isActive ? "text-white/80" : "opacity-70"
                )}>
                  {category.description}
                </span>
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-white/80" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Lifecycle Orchestration - Strategic View */}
        {activeTab === 'orchestration' && (
          <section className="space-y-4 animate-fade-in">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Playbook Overview</h2>
                <p className="text-sm text-muted-foreground">All active customer journeys at a glance</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{filteredPlaybooks.length} playbooks</span>
                {activeLifecycleFilter !== 'all' && (
                  <button 
                    onClick={() => setActiveLifecycleFilter('all')}
                    className="text-primary hover:underline ml-2"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>

            {/* Playbook Grid */}
            <div className="rounded-2xl border border-border/60 overflow-hidden bg-card/30">
              {/* Header */}
              <div className="grid grid-cols-[minmax(220px,2fr)_minmax(160px,1.5fr)_minmax(100px,1fr)_minmax(280px,2.5fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_minmax(60px,auto)] gap-4 px-6 py-4 bg-secondary/40 border-b border-border/40 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Account</span>
                <span>Playbook</span>
                <span>Category</span>
                <span>Progress</span>
                <span>Current Phase</span>
                <span>Status</span>
                <span></span>
              </div>

              {/* Rows */}
              {filteredPlaybooks.map((playbook, index) => {
                const statusConfig = getStatusStyles(playbook.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div
                    key={playbook.id}
                    onClick={() => openWorkflowPanel(playbook)}
                    className={cn(
                      "grid grid-cols-[minmax(220px,2fr)_minmax(160px,1.5fr)_minmax(100px,1fr)_minmax(280px,2.5fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_minmax(60px,auto)] gap-4 px-6 py-5 border-b border-border/30 last:border-b-0 items-center cursor-pointer transition-all duration-200 hover:bg-secondary/30",
                      playbook.status === 'attention_required' && "bg-warning/5",
                      playbook.status === 'paused' && "opacity-70"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Account */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{playbook.accountName}</p>
                        <p className="text-xs text-muted-foreground">{playbook.accountSegment} · {playbook.arr}</p>
                      </div>
                    </div>

                    {/* Playbook */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{playbook.playbookName}</p>
                      <p className="text-xs text-muted-foreground">{playbook.lastActivity}</p>
                    </div>

                    {/* Lifecycle Category */}
                    <div>
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize border",
                        getLifecycleCategoryStyles(playbook.lifecycleCategory)
                      )}>
                        {playbook.lifecycleCategory.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress - Visual Dominant */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Phase {playbook.currentPhaseIndex} of {playbook.totalPhases}</span>
                        <span className="font-semibold text-foreground tabular-nums">{playbook.progress}%</span>
                      </div>
                      <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                            playbook.status === 'attention_required' 
                              ? "bg-gradient-to-r from-warning to-warning/70" 
                              : playbook.status === 'paused'
                              ? "bg-muted-foreground"
                              : "bg-gradient-to-r from-primary to-primary/70"
                          )}
                          style={{ width: `${playbook.progress}%` }}
                        />
                        {/* Phase markers */}
                        {Array.from({ length: playbook.totalPhases - 1 }).map((_, i) => (
                          <div 
                            key={i}
                            className="absolute top-0 bottom-0 w-px bg-background/50"
                            style={{ left: `${((i + 1) / playbook.totalPhases) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Current Phase */}
                    <div className="min-w-0">
                      <p className="text-sm truncate">{playbook.currentPhase}</p>
                      <p className="text-xs text-muted-foreground">{playbook.daysInPhase}d in phase</p>
                    </div>

                    {/* Status */}
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
                      statusConfig.bg,
                      statusConfig.text
                    )}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="capitalize">{playbook.status.replace('_', ' ')}</span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tab 2: Active Execution - Operational View */}
        {activeTab === 'execution' && (
          <section className="space-y-4 animate-fade-in">
            {/* Status Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[
                  { id: 'all' as const, label: 'All Tasks', icon: Layers },
                  { id: 'pending' as const, label: 'Pending', icon: Clock },
                  { id: 'in_progress' as const, label: 'In Progress', icon: RefreshCw },
                  { id: 'blocked' as const, label: 'Blocked', icon: AlertCircle },
                  { id: 'completed' as const, label: 'Completed', icon: CheckCircle2 },
                ].map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setStatusFilter(filter.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        statusFilter === filter.id
                          ? "bg-foreground text-background shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredTasks.length} tasks
              </span>
            </div>

            {/* Task Stream */}
            <div className="space-y-3">
              {filteredTasks.map((task, index) => {
                const statusConfig = getStatusStyles(task.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={task.id}
                    className={cn(
                      "group rounded-2xl border transition-all duration-200 overflow-hidden",
                      task.status === 'blocked' 
                        ? "border-destructive/30 bg-destructive/5" 
                        : task.status === 'completed'
                        ? "border-accent/30 bg-accent/5"
                        : "border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/60 hover:shadow-md"
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-center gap-5 px-5 py-4">
                      {/* Status Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        statusConfig.bg
                      )}>
                        <StatusIcon className={cn("w-5 h-5", statusConfig.text)} />
                      </div>

                      {/* Account & Playbook Context */}
                      <div className="w-52 shrink-0">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm font-medium truncate">{task.accountName}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate">{task.playbookName}</p>
                        </div>
                      </div>

                      {/* Mini Progress */}
                      <div className="w-20 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums">{task.progress}%</span>
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{task.taskName}</p>
                        <p className="text-xs text-muted-foreground">Phase: {task.phase}</p>
                      </div>

                      {/* Lifecycle Category */}
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize border shrink-0",
                        getLifecycleCategoryStyles(task.lifecycleCategory)
                      )}>
                        {task.lifecycleCategory.replace('_', ' ')}
                      </span>

                      {/* Trigger */}
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border shrink-0",
                        getTriggerStyles(task.trigger.type)
                      )}>
                        {task.trigger.type === 'workflow' && <FileText className="w-3.5 h-3.5" />}
                        {task.trigger.type === 'system' && <Activity className="w-3.5 h-3.5" />}
                        {task.trigger.type === 'event' && <Zap className="w-3.5 h-3.5" />}
                        <span className="max-w-[100px] truncate">{task.trigger.label}</span>
                      </div>

                      {/* Due */}
                      <div className={cn(
                        "flex items-center gap-1.5 text-xs shrink-0 w-24",
                        task.dueContext === 'overdue' ? "text-destructive" :
                        task.dueContext === 'today' ? "text-warning" :
                        "text-muted-foreground"
                      )}>
                        <Calendar className="w-3.5 h-3.5" />
                        {task.dueContext === 'today' ? 'Today' : 
                         task.dueContext === 'overdue' ? task.dueDate : 
                         task.dueDate}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const matchingPlaybook = playbookInstances.find(pb => pb.accountName === task.accountName);
                            if (matchingPlaybook) {
                              openWorkflowPanel(matchingPlaybook);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 text-foreground hover:bg-secondary/60 transition-all"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                          View Playbook
                        </button>
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
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
          setSelectedAccountForAssign(null);
        }}
        accountName={selectedAccountForAssign?.name || ''}
        segment={selectedAccountForAssign?.segment || ''}
        arr={selectedAccountForAssign?.arr || ''}
        onAssign={handleAssignPlaybook}
      />

      <WorkflowVisualizationPanel
        isOpen={workflowPanelOpen}
        onClose={() => {
          setWorkflowPanelOpen(false);
          setSelectedPlaybook(null);
        }}
        accountName={selectedPlaybook?.accountName || ''}
        playbookName={selectedPlaybook?.playbookName || 'Workflow'}
        currentPhase={selectedPlaybook?.currentPhase || ''}
        workflowData={{ phases: sampleWorkflowPhases as any }}
        status={selectedPlaybook?.status === 'running' ? 'active' : selectedPlaybook?.status === 'paused' ? 'paused' : 'modified'}
      />
    </div>
  );
};

export default OrchestratorAIPage;
