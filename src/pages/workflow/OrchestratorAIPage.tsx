import React, { useState } from 'react';
import { 
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
  Building2,
  Activity,
  X,
  Edit3,
  Trash2,
  GripVertical,
  ArrowRight,
  RefreshCw,
  FileText,
  Settings,
  MoreHorizontal,
  Check,
  Circle,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const OrchestratorAIPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<WorkflowTask | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['preparation', 'kickoff']);
  const [expandedWorkflowTasks, setExpandedWorkflowTasks] = useState<string[]>([]);

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
            { id: 'prep-1-3', name: 'Update account attributes', completed: false, attributeUpdate: 'Contract Value → $125,000' },
          ],
          completed: false,
        },
        {
          id: 'prep-2',
          name: 'Capture Sales Notes',
          description: 'Document key insights from sales handoff',
          endGoal: 'All sales context is captured for CSM reference',
          attributesToUpdate: ['Sales Notes', 'Key Stakeholders', 'Primary Use Case'],
          expectations: 'Notes are parsed and key entities are extracted automatically',
          subTasks: [
            { id: 'prep-2-1', name: 'Document pain points', completed: true },
            { id: 'prep-2-2', name: 'Identify key stakeholders', completed: true },
          ],
          completed: true,
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
        {
          id: 'kickoff-2',
          name: 'Document POC Details',
          description: 'Capture primary point of contact information',
          endGoal: 'POC details are complete and verified',
          attributesToUpdate: ['Primary POC', 'POC Email', 'POC Phone'],
          expectations: 'Auto-populates contact fields in account record',
          subTasks: [],
          completed: false,
        },
      ],
    },
    {
      id: 'setup',
      name: 'Setup & Configuration',
      timeline: 'Days 4-10',
      tasks: [
        {
          id: 'setup-1',
          name: 'Technical Onboarding',
          description: 'Complete technical setup and integration',
          endGoal: 'System is configured for customer use case',
          attributesToUpdate: ['Integration Status', 'Configuration Completion'],
          expectations: 'Integration health checks run automatically',
          subTasks: [],
          completed: false,
        },
      ],
    },
    {
      id: 'integrations',
      name: 'Integrations & Migration',
      timeline: 'Days 11-20',
      tasks: [
        {
          id: 'int-1',
          name: 'Data Migration',
          description: 'Migrate historical data from legacy systems',
          endGoal: 'All historical data is accessible in new system',
          attributesToUpdate: ['Migration Status', 'Data Volume'],
          expectations: 'Migration progress tracked automatically',
          subTasks: [],
          completed: false,
        },
      ],
    },
    {
      id: 'training',
      name: 'Training',
      timeline: 'Days 21-28',
      tasks: [
        {
          id: 'train-1',
          name: 'User Training Sessions',
          description: 'Conduct training for end users',
          endGoal: 'All users are certified on the platform',
          attributesToUpdate: ['Training Completion', 'Certification Status'],
          expectations: 'Training attendance and quiz scores tracked',
          subTasks: [],
          completed: false,
        },
      ],
    },
    {
      id: 'uat',
      name: 'UAT & Optimization',
      timeline: 'Days 29-35',
      tasks: [
        {
          id: 'uat-1',
          name: 'User Acceptance Testing',
          description: 'Validate system meets requirements',
          endGoal: 'Customer sign-off on UAT',
          attributesToUpdate: ['UAT Status', 'Issues Identified'],
          expectations: 'Issue tracking and resolution monitored',
          subTasks: [],
          completed: false,
        },
      ],
    },
    {
      id: 'golive',
      name: 'Go-Live & Transition',
      timeline: 'Day 36+',
      tasks: [
        {
          id: 'go-1',
          name: 'Production Go-Live',
          description: 'Transition to production environment',
          endGoal: 'Customer is live in production',
          attributesToUpdate: ['Go-Live Date', 'Production Status'],
          expectations: 'Health monitoring begins automatically',
          subTasks: [],
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

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleWorkflowTask = (taskId: string) => {
    setExpandedWorkflowTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      {/* Page Header */}
      <div className="border-b border-border/40 bg-gradient-to-b from-card/50 to-background">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Orchestrator AI</h1>
              <p className="text-sm text-muted-foreground">Live customer journeys and workflow control</p>
            </div>

            {/* System Indicators */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm">
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
                  <span className="text-muted-foreground">Paused</span>
                  <span className="font-semibold text-foreground">5</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Awaiting Input</span>
                  <span className="font-semibold text-foreground">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-5">
        {/* Top Control Bar */}
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

          {/* Add Task Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            Tasks
          </button>
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
                  "group rounded-lg border transition-all duration-200",
                  task.status === 'suspended' 
                    ? "border-border/30 bg-muted/30 opacity-80" 
                    : task.status === 'completed'
                    ? "border-accent/20 bg-accent/5"
                    : "border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/60"
                )}
              >
                {/* Task Row */}
                <div 
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer"
                  onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                >
                  {/* Status Icon */}
                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                    task.status === 'completed' ? "bg-accent/15 text-accent" :
                    task.status === 'suspended' ? "bg-muted text-muted-foreground" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    <StatusIcon className="w-4 h-4" />
                  </div>

                  {/* Account & Task Info */}
                  <div className="flex-1 min-w-0 grid grid-cols-[1fr,160px,200px] gap-4 items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (task.workflowData) openWorkflowPanel(task);
                          }}
                          className={cn(
                            "font-medium hover:text-primary transition-colors",
                            task.workflowData ? "hover:underline" : ""
                          )}
                        >
                          {task.account}
                        </button>
                        {task.priority === 'high' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 truncate">{task.currentTask}</p>
                    </div>

                    {/* Journey Phase */}
                    <div className="text-sm">
                      <span className="text-muted-foreground">{task.journeyPhase}</span>
                    </div>

                    {/* Trigger Badge */}
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium w-fit",
                      getTriggerColor(task.trigger.type)
                    )}>
                      <TriggerIcon className="w-3.5 h-3.5" />
                      {task.trigger.label}
                    </div>
                  </div>

                  {/* Due Context */}
                  <div className={cn(
                    "text-sm font-medium shrink-0 w-20 text-right tabular-nums",
                    getDueColor(task.dueContext)
                  )}>
                    {task.dueContext === 'today' ? 'Today' :
                     task.dueContext === 'overdue' ? task.dueDate :
                     task.dueDate}
                  </div>

                  {/* Playbook Link */}
                  {task.playbook && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (task.workflowData) openWorkflowPanel(task);
                      }}
                      className="text-xs text-primary hover:underline shrink-0"
                    >
                      View Playbook
                    </button>
                  )}

                  {/* Expand Icon */}
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-180"
                  )} />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border/40">
                    <div className="pt-4 space-y-4">
                      <div className="grid grid-cols-4 gap-6 text-sm">
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Playbook</span>
                          <p className="font-medium mt-1">{task.playbook || 'None'}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Phase</span>
                          <p className="font-medium mt-1">{task.journeyPhase}</p>
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

                      {/* Trust Indicators */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-accent" />
                          3 attributes auto-updated
                        </span>
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5" />
                          Last sync: 2 min ago
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        {task.workflowData && (
                          <button 
                            onClick={() => openWorkflowPanel(task)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                          >
                            <Settings className="w-4 h-4" />
                            View Workflow
                          </button>
                        )}
                        {task.status === 'pending' && (
                          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-muted-foreground text-sm font-medium hover:bg-secondary/50 hover:text-foreground transition-all">
                            <Pause className="w-4 h-4" />
                            Pause
                          </button>
                        )}
                        {task.status === 'suspended' && (
                          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                            <Activity className="w-4 h-4" />
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

      {/* Workflow Visualization Panel */}
      {workflowPanelOpen && selectedAccount && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setWorkflowPanelOpen(false)}
          />
          
          {/* Panel */}
          <div className="fixed top-0 right-0 w-[80%] h-full bg-background border-l border-border shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-up">
            {/* Panel Header */}
            <div className="border-b border-border/60 bg-card/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{selectedAccount.account}</h2>
                    <p className="text-sm text-muted-foreground">{selectedAccount.playbook} · {selectedAccount.journeyPhase}</p>
                  </div>
                </div>

                {/* Panel Actions */}
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                    Replace Playbook
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                    Detach Workflow
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setWorkflowPanelOpen(false)}
                    className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-accent" />
                  12 data auto-updates applied
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  5 attributes pending update
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  2 system actions queued
                </span>
              </div>
            </div>

            {/* Workflow Timeline */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Timeline Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider px-2">Workflow Timeline</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Phases */}
              <div className="space-y-4">
                {sampleWorkflowPhases.map((phase, phaseIndex) => {
                  const isPhaseExpanded = expandedPhases.includes(phase.id);
                  const completedTasks = phase.tasks.filter(t => t.completed).length;
                  const totalTasks = phase.tasks.length;
                  const phaseProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                  return (
                    <div key={phase.id} className="relative">
                      {/* Phase Header */}
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left",
                          isPhaseExpanded 
                            ? "bg-card border-border/60" 
                            : "bg-card/50 border-border/40 hover:bg-card/80 hover:border-border/60"
                        )}
                      >
                        {/* Phase Icon */}
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold",
                          phaseProgress === 100 
                            ? "bg-accent/15 text-accent" 
                            : phaseProgress > 0 
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-muted-foreground"
                        )}>
                          {phaseProgress === 100 ? <Check className="w-5 h-5" /> : phaseIndex + 1}
                        </div>

                        {/* Phase Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{phase.name}</h3>
                            <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded">
                              {phase.timeline}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {completedTasks} of {totalTasks} tasks
                            </span>
                            {/* Mini Progress */}
                            <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  phaseProgress === 100 ? "bg-accent" : "bg-primary"
                                )}
                                style={{ width: `${phaseProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <ChevronDown className={cn(
                          "w-5 h-5 text-muted-foreground transition-transform",
                          isPhaseExpanded && "rotate-180"
                        )} />
                      </button>

                      {/* Phase Tasks */}
                      {isPhaseExpanded && (
                        <div className="mt-2 ml-5 pl-9 border-l-2 border-border/40 space-y-2">
                          {phase.tasks.map((task) => {
                            const isTaskExpanded = expandedWorkflowTasks.includes(task.id);
                            const completedSubtasks = task.subTasks.filter(st => st.completed).length;

                            return (
                              <div key={task.id} className="relative">
                                {/* Connection Dot */}
                                <div className="absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full bg-background border-2 border-border" />
                                
                                {/* Task Card */}
                                <div className={cn(
                                  "rounded-lg border transition-all",
                                  task.completed 
                                    ? "bg-accent/5 border-accent/20" 
                                    : "bg-card/60 border-border/40"
                                )}>
                                  <div 
                                    className="flex items-center gap-3 p-3 cursor-pointer"
                                    onClick={() => toggleWorkflowTask(task.id)}
                                  >
                                    {/* Task Status */}
                                    <div className={cn(
                                      "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                                      task.completed 
                                        ? "bg-accent/20 text-accent" 
                                        : "bg-secondary text-muted-foreground"
                                    )}>
                                      {task.completed ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                    </div>

                                    {/* Task Info */}
                                    <div className="flex-1 min-w-0">
                                      <h4 className={cn(
                                        "font-medium text-sm",
                                        task.completed && "text-muted-foreground"
                                      )}>
                                        {task.name}
                                      </h4>
                                      {task.subTasks.length > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                          {completedSubtasks} of {task.subTasks.length} sub-tasks
                                        </span>
                                      )}
                                    </div>

                                    {/* Task Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                      <button className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground cursor-grab">
                                        <GripVertical className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <ChevronRight className={cn(
                                      "w-4 h-4 text-muted-foreground transition-transform",
                                      isTaskExpanded && "rotate-90"
                                    )} />
                                  </div>

                                  {/* Task Details */}
                                  {isTaskExpanded && (
                                    <div className="px-3 pb-3 pt-0 border-t border-border/40 mt-0">
                                      <div className="pt-3 space-y-4">
                                        {/* Task Meta */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Description</span>
                                            <p className="mt-1">{task.description}</p>
                                          </div>
                                          <div>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">End Goal</span>
                                            <p className="mt-1">{task.endGoal}</p>
                                          </div>
                                        </div>

                                        {/* Attributes */}
                                        <div>
                                          <span className="text-xs text-muted-foreground uppercase tracking-wider">Attributes to Update</span>
                                          <div className="flex flex-wrap gap-1.5 mt-2">
                                            {task.attributesToUpdate.map((attr, i) => (
                                              <span key={i} className="text-xs bg-secondary/80 text-foreground px-2 py-1 rounded">
                                                {attr}
                                              </span>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Expectations */}
                                        <div>
                                          <span className="text-xs text-muted-foreground uppercase tracking-wider">System Behavior</span>
                                          <p className="text-sm mt-1 text-muted-foreground">{task.expectations}</p>
                                        </div>

                                        {/* Sub-tasks */}
                                        {task.subTasks.length > 0 && (
                                          <div>
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Sub-tasks</span>
                                            <div className="mt-2 space-y-1.5">
                                              {task.subTasks.map((subTask) => (
                                                <div 
                                                  key={subTask.id}
                                                  className="flex items-center gap-2 text-sm"
                                                >
                                                  <div className={cn(
                                                    "w-4 h-4 rounded flex items-center justify-center",
                                                    subTask.completed 
                                                      ? "bg-accent/20 text-accent" 
                                                      : "bg-secondary border border-border/60"
                                                  )}>
                                                    {subTask.completed && <Check className="w-2.5 h-2.5" />}
                                                  </div>
                                                  <span className={subTask.completed ? "text-muted-foreground line-through" : ""}>
                                                    {subTask.name}
                                                  </span>
                                                  {subTask.attributeUpdate && (
                                                    <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-auto">
                                                      {subTask.attributeUpdate}
                                                    </span>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Task Actions */}
                                        <div className="flex items-center gap-2 pt-2">
                                          <button className="text-xs text-primary hover:underline">+ Add Sub-task</button>
                                          <span className="text-muted-foreground">·</span>
                                          <button className="text-xs text-muted-foreground hover:text-foreground">Skip Task</button>
                                          <span className="text-muted-foreground">·</span>
                                          <button className="text-xs text-muted-foreground hover:text-foreground">Pause</button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Add Task to Phase */}
                          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 pl-3 transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                            Add task to {phase.name}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrchestratorAIPage;
