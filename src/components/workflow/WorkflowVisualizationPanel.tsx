import React, { useState, useRef, useEffect } from 'react';
import { 
  X,
  Edit3,
  Trash2,
  GripVertical,
  Check,
  Circle,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Clock,
  Building2,
  Pause,
  Play,
  ChevronRight,
  ChevronDown,
  Save,
  FileText,
  AlertTriangle,
  Zap
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
  attributesToUpdate: { name: string; value: string; autoUpdated?: boolean }[];
  expectations: string[];
  subTasks: SubTask[];
  completed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  dueDate?: string;
  owner?: string;
  triggerType?: 'playbook' | 'system' | 'event';
  triggerLabel?: string;
}

interface Phase {
  id: string;
  name: string;
  timeline: string;
  tasks: Task[];
  enabled: boolean;
}

interface WorkflowData {
  phases: Phase[];
}

interface WorkflowVisualizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  playbookName: string;
  currentPhase: string;
  workflowData: WorkflowData;
  status?: 'active' | 'paused' | 'modified';
}

const sampleWorkflowData: WorkflowData = {
  phases: [
    {
      id: 'kickoff',
      name: 'Kickoff & Alignment',
      timeline: 'Days 1-3',
      enabled: true,
      tasks: [
        {
          id: 'kick-1',
          name: 'Schedule Kickoff Meeting',
          description: 'Coordinate with key stakeholders to schedule the initial kickoff meeting. Ensure all decision-makers are included.',
          endGoal: 'Meeting scheduled with all key stakeholders, calendar invites sent, agenda prepared.',
          attributesToUpdate: [
            { name: 'Kickoff Date', value: 'Jan 8, 2025', autoUpdated: true },
            { name: 'Primary POC', value: 'Sarah Mitchell', autoUpdated: true },
            { name: 'Meeting Notes', value: 'Pending capture', autoUpdated: false },
          ],
          expectations: [
            'Calendar invite will be automatically synced',
            'Meeting notes will be auto-extracted post-meeting',
            'Action items will create follow-up tasks automatically',
          ],
          subTasks: [
            { id: 'kick-1-1', name: 'Send calendar invite to stakeholders', completed: true },
            { id: 'kick-1-2', name: 'Prepare meeting agenda', completed: true },
            { id: 'kick-1-3', name: 'Confirm attendee availability', completed: false },
          ],
          completed: false,
          status: 'in_progress',
          dueDate: 'Today',
          owner: 'Sarah Chen',
        },
        {
          id: 'kick-2',
          name: 'Document POC Details',
          description: 'Capture and verify primary point of contact information for ongoing communication.',
          endGoal: 'POC details verified and stored in account record.',
          attributesToUpdate: [
            { name: 'POC Name', value: 'Sarah Mitchell', autoUpdated: true },
            { name: 'POC Email', value: 's.mitchell@meridian.tech', autoUpdated: true },
            { name: 'POC Designation', value: 'VP of Operations', autoUpdated: false },
            { name: 'Communication Channel', value: 'Slack', autoUpdated: false },
          ],
          expectations: [
            'Contact details auto-populate from meeting invites',
            'Email verification runs automatically',
          ],
          subTasks: [],
          completed: false,
          status: 'pending',
          dueDate: 'Tomorrow',
          owner: 'Sarah Chen',
        },
      ],
    },
    {
      id: 'setup',
      name: 'Setup & Configuration',
      timeline: 'Days 4-10',
      enabled: true,
      tasks: [
        {
          id: 'setup-1',
          name: 'Technical Environment Setup',
          description: 'Configure the technical environment according to customer specifications and requirements.',
          endGoal: 'Environment fully configured and validated for customer use.',
          attributesToUpdate: [
            { name: 'Environment Status', value: 'Pending', autoUpdated: false },
            { name: 'Configuration Completion', value: '0%', autoUpdated: true },
          ],
          expectations: [
            'Configuration progress tracked automatically',
            'Health checks run on completion',
          ],
          subTasks: [
            { id: 'setup-1-1', name: 'Provision customer workspace', completed: false },
            { id: 'setup-1-2', name: 'Configure SSO settings', completed: false },
            { id: 'setup-1-3', name: 'Set up user roles and permissions', completed: false },
          ],
          completed: false,
          status: 'pending',
          dueDate: 'Jan 12',
          owner: 'Technical Team',
        },
      ],
    },
    {
      id: 'integrations',
      name: 'Integrations & Data Migration',
      timeline: 'Days 11-20',
      enabled: true,
      tasks: [
        {
          id: 'int-1',
          name: 'Connect Core Integrations',
          description: 'Establish connections with customer\'s existing systems and tools.',
          endGoal: 'All required integrations active and data flowing.',
          attributesToUpdate: [
            { name: 'Integration Status', value: 'Not Started', autoUpdated: true },
            { name: 'Connected Systems', value: '0/4', autoUpdated: true },
          ],
          expectations: [
            'Integration health monitored continuously',
            'Data sync validation runs automatically',
          ],
          subTasks: [],
          completed: false,
          status: 'pending',
          dueDate: 'Jan 18',
          owner: 'Integration Team',
        },
        {
          id: 'int-2',
          name: 'Historical Data Migration',
          description: 'Migrate historical data from legacy systems with validation.',
          endGoal: 'All historical data migrated and verified.',
          attributesToUpdate: [
            { name: 'Migration Status', value: 'Scheduled', autoUpdated: true },
            { name: 'Records Migrated', value: '0', autoUpdated: true },
          ],
          expectations: [
            'Migration progress tracked in real-time',
            'Data integrity checks run automatically',
          ],
          subTasks: [],
          completed: false,
          status: 'pending',
          dueDate: 'Jan 22',
          owner: 'Data Team',
        },
      ],
    },
    {
      id: 'training',
      name: 'Training & Enablement',
      timeline: 'Days 21-28',
      enabled: true,
      tasks: [
        {
          id: 'train-1',
          name: 'End User Training Sessions',
          description: 'Conduct comprehensive training sessions for all end users.',
          endGoal: 'All designated users trained and certified.',
          attributesToUpdate: [
            { name: 'Training Completion', value: '0%', autoUpdated: true },
            { name: 'Users Certified', value: '0/25', autoUpdated: true },
          ],
          expectations: [
            'Attendance tracked automatically',
            'Quiz scores recorded per user',
            'Certification status updated on completion',
          ],
          subTasks: [],
          completed: false,
          status: 'pending',
          dueDate: 'Jan 28',
          owner: 'Training Team',
        },
      ],
    },
    {
      id: 'uat',
      name: 'Testing, UAT & Optimization',
      timeline: 'Days 29-35',
      enabled: true,
      tasks: [
        {
          id: 'uat-1',
          name: 'User Acceptance Testing',
          description: 'Coordinate UAT process with customer team to validate all requirements.',
          endGoal: 'Customer sign-off on UAT, all critical issues resolved.',
          attributesToUpdate: [
            { name: 'UAT Status', value: 'Not Started', autoUpdated: false },
            { name: 'Issues Identified', value: '0', autoUpdated: true },
            { name: 'Issues Resolved', value: '0', autoUpdated: true },
          ],
          expectations: [
            'Issue tracking integrated automatically',
            'Resolution status monitored in real-time',
          ],
          subTasks: [],
          completed: false,
          status: 'pending',
          dueDate: 'Feb 4',
          owner: 'QA Team',
        },
      ],
    },
    {
      id: 'golive',
      name: 'Go-Live & Transition',
      timeline: 'Day 36+',
      enabled: true,
      tasks: [
        {
          id: 'go-1',
          name: 'Production Go-Live',
          description: 'Transition customer to production environment with full monitoring.',
          endGoal: 'Customer fully operational in production.',
          attributesToUpdate: [
            { name: 'Go-Live Date', value: 'Scheduled', autoUpdated: false },
            { name: 'Production Status', value: 'Pending', autoUpdated: true },
          ],
          expectations: [
            'Health monitoring begins automatically',
            'Support escalation paths activated',
          ],
          subTasks: [],
          completed: false,
          status: 'pending',
          dueDate: 'Feb 8',
          owner: 'CSM',
        },
      ],
    },
  ],
};

const WorkflowVisualizationPanel: React.FC<WorkflowVisualizationPanelProps> = ({
  isOpen,
  onClose,
  accountName,
  playbookName,
  currentPhase,
  status = 'active',
}) => {
  const [phases, setPhases] = useState<Phase[]>(sampleWorkflowData.phases);
  const [activePhase, setActivePhase] = useState<string>('kickoff');
  const [expandedTasks, setExpandedTasks] = useState<string[]>(['kick-1']);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-accent/15 border-accent/30 text-accent';
      case 'in_progress': return 'bg-primary/10 border-primary/30 text-primary';
      case 'skipped': return 'bg-muted border-border/40 text-muted-foreground';
      default: return 'bg-card border-border/40 text-foreground';
    }
  };

  const getTaskStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <Check className="w-3.5 h-3.5" />;
      case 'in_progress': return <RefreshCw className="w-3.5 h-3.5 animate-spin" />;
      case 'skipped': return <Pause className="w-3.5 h-3.5" />;
      default: return <Circle className="w-3.5 h-3.5" />;
    }
  };

  const getPhaseProgress = (phase: Phase) => {
    const completed = phase.tasks.filter(t => t.status === 'completed').length;
    return phase.tasks.length > 0 ? (completed / phase.tasks.length) * 100 : 0;
  };

  const scrollToPhase = (phaseId: string) => {
    setActivePhase(phaseId);
    const element = document.getElementById(`phase-${phaseId}`);
    if (element && canvasRef.current) {
      element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className="fixed top-0 right-0 w-[80%] h-full bg-background border-l border-border shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInFromRight 0.3s ease-out forwards' }}
      >
        {/* Sticky Header */}
        <div className="border-b border-border/60 bg-card/80 backdrop-blur-xl px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{playbookName}</h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    status === 'active' ? "bg-accent/15 text-accent" :
                    status === 'paused' ? "bg-warning/15 text-warning" :
                    "bg-primary/15 text-primary"
                  )}>
                    {status === 'active' ? 'Active' : status === 'paused' ? 'Paused' : 'Modified'}
                  </span>
                  {hasUnsavedChanges && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-warning">
                      Unsaved Changes
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{accountName}</p>
              </div>
            </div>

            {/* Panel Actions */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                <Edit3 className="w-4 h-4" />
                Edit Workflow
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                Replace Playbook
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                Detach Workflow
              </button>
              <button 
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  hasUnsavedChanges 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary text-muted-foreground"
                )}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-8 mt-4 text-xs">
            <span className="flex items-center gap-1.5 text-accent">
              <Check className="w-3.5 h-3.5" />
              12 data auto-updates applied
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5" />
              5 attributes pending update
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              2 system actions queued
            </span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Phase Navigation */}
          <div className="w-64 border-r border-border/40 bg-card/30 py-4 shrink-0 overflow-y-auto">
            <div className="px-4 mb-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phases</span>
            </div>
            <div className="space-y-1 px-2">
              {phases.map((phase) => {
                const progress = getPhaseProgress(phase);
                const isActive = activePhase === phase.id;
                const completedTasks = phase.tasks.filter(t => t.status === 'completed').length;
                
                return (
                  <button
                    key={phase.id}
                    onClick={() => scrollToPhase(phase.id)}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg transition-all group",
                      isActive 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0",
                        progress === 100 
                          ? "bg-accent/20 text-accent" 
                          : progress > 0 
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      )}>
                        {progress === 100 ? <Check className="w-4 h-4" /> : phases.indexOf(phase) + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {phase.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {completedTasks}/{phase.tasks.length} tasks · {phase.timeline}
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 h-1 bg-secondary/60 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          progress === 100 ? "bg-accent" : "bg-primary"
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Canvas - Horizontal Flow */}
          <div 
            ref={canvasRef}
            className="flex-1 overflow-x-auto overflow-y-auto p-6"
          >
            <div className="flex gap-6 min-w-max pb-4">
              {phases.map((phase, phaseIndex) => {
                const progress = getPhaseProgress(phase);
                
                return (
                  <div 
                    key={phase.id}
                    id={`phase-${phase.id}`}
                    className={cn(
                      "w-[380px] shrink-0 rounded-xl border transition-all",
                      activePhase === phase.id 
                        ? "bg-card border-primary/30 shadow-lg shadow-primary/5" 
                        : "bg-card/50 border-border/40"
                    )}
                  >
                    {/* Phase Header */}
                    <div className="px-5 py-4 border-b border-border/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold",
                            progress === 100 
                              ? "bg-accent/15 text-accent" 
                              : progress > 0 
                              ? "bg-primary/15 text-primary"
                              : "bg-secondary text-muted-foreground"
                          )}>
                            {progress === 100 ? <Check className="w-5 h-5" /> : phaseIndex + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">{phase.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{phase.timeline}</p>
                          </div>
                        </div>
                        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Progress */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              progress === 100 ? "bg-accent" : "bg-primary"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="p-3 space-y-2">
                      {phase.tasks.map((task, taskIndex) => {
                        const isExpanded = expandedTasks.includes(task.id);
                        const isHovered = hoveredTask === task.id;
                        const isEditing = editingTask === task.id;
                        const completedSubtasks = task.subTasks.filter(st => st.completed).length;

                        return (
                          <div 
                            key={task.id}
                            onMouseEnter={() => setHoveredTask(task.id)}
                            onMouseLeave={() => setHoveredTask(null)}
                            className={cn(
                              "rounded-lg border transition-all duration-200",
                              isExpanded 
                                ? "bg-background shadow-md" 
                                : isHovered 
                                ? "shadow-sm translate-y-[-1px]" 
                                : "",
                              getTaskStatusColor(task.status)
                            )}
                          >
                            {/* Task Header */}
                            <div 
                              className="flex items-start gap-3 p-3 cursor-pointer"
                              onClick={() => toggleTaskExpand(task.id)}
                            >
                              {/* Status Icon */}
                              <div className={cn(
                                "w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
                                task.status === 'completed' ? "bg-accent/20 text-accent" :
                                task.status === 'in_progress' ? "bg-primary/20 text-primary" :
                                "bg-secondary text-muted-foreground"
                              )}>
                                {getTaskStatusIcon(task.status)}
                              </div>

                              {/* Task Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-medium">{task.name}</h4>
                                  {task.triggerType === 'event' && (
                                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning/10 text-warning border border-warning/20">
                                      <Zap className="w-2.5 h-2.5" />
                                      Event
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  {task.dueDate && (
                                    <span className={cn(
                                      task.dueDate === 'Today' ? "text-warning" : 
                                      task.dueDate === 'Overdue' ? "text-destructive" : ""
                                    )}>
                                      {task.dueDate}
                                    </span>
                                  )}
                                  {task.owner && (
                                    <span>· {task.owner}</span>
                                  )}
                                  {task.subTasks.length > 0 && (
                                    <span>· {completedSubtasks}/{task.subTasks.length} subtasks</span>
                                  )}
                                </div>
                              </div>

                              {/* Hover Actions */}
                              {isHovered && !isExpanded && (
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setEditingTask(task.id); }}
                                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* Expand Indicator */}
                              <ChevronRight className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                                isExpanded && "rotate-90"
                              )} />
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="px-3 pb-4 space-y-4 border-t border-border/40 animate-fade-in">
                                {/* Task Overview */}
                                <div className="pt-4 space-y-4">
                                  <div>
                                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</h5>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{task.description}</p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">End Goal</h5>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{task.endGoal}</p>
                                  </div>
                                </div>

                                {/* Attributes to Update */}
                                {task.attributesToUpdate.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Attributes to Update</h5>
                                    <div className="space-y-1.5">
                                      {task.attributesToUpdate.map((attr, i) => (
                                        <div 
                                          key={i}
                                          className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary/30"
                                        >
                                          <span className="text-sm font-medium">{attr.name}</span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{attr.value}</span>
                                            {attr.autoUpdated && (
                                              <span className="text-[10px] text-accent font-medium">Auto-updated</span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Expectations */}
                                {task.expectations.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Expectations from Tool</h5>
                                    <ul className="space-y-1.5">
                                      {task.expectations.map((exp, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                                          <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                          {exp}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Subtasks */}
                                {task.subTasks.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Subtasks</h5>
                                    <div className="space-y-1">
                                      {task.subTasks.map((subtask) => (
                                        <div 
                                          key={subtask.id}
                                          className={cn(
                                            "flex items-center gap-2 py-2 px-3 rounded-md",
                                            subtask.completed ? "bg-accent/5" : "bg-secondary/20"
                                          )}
                                        >
                                          <div className={cn(
                                            "w-4 h-4 rounded flex items-center justify-center",
                                            subtask.completed ? "bg-accent/20 text-accent" : "border border-border"
                                          )}>
                                            {subtask.completed && <Check className="w-3 h-3" />}
                                          </div>
                                          <span className={cn(
                                            "text-sm flex-1",
                                            subtask.completed && "text-muted-foreground line-through"
                                          )}>
                                            {subtask.name}
                                          </span>
                                          {subtask.attributeUpdate && (
                                            <span className="text-xs text-accent">{subtask.attributeUpdate}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Task Actions */}
                                <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Edit
                                  </button>
                                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Subtask
                                  </button>
                                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                                    <GripVertical className="w-3.5 h-3.5" />
                                    Reorder
                                  </button>
                                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all ml-auto">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Task Button */}
                      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/30 transition-all">
                        <Plus className="w-4 h-4" />
                        Add Task
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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

export default WorkflowVisualizationPanel;
