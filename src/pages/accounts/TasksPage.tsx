import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ListTodo,
  Calendar,
  Layers,
  Plus,
  Search,
  Filter,
  Check,
  Clock,
  ArrowRight,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Workflow,
  Brain,
  Video,
  User,
  ExternalLink,
  MoreHorizontal,
  Pause,
  Forward,
  StickyNote,
  Building2,
  Sparkles,
  X,
  Bell,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type ViewType = "queue" | "time" | "state";
type TaskState = "pending" | "waiting_customer" | "waiting_internal" | "blocked" | "auto_running" | "completed";
type TaskCategory = "workflow" | "ai_recommended" | "meeting" | "manual" | "external";

interface Task {
  id: string;
  title: string;
  account: string;
  category: TaskCategory;
  state: TaskState;
  context: string;
  priority: number;
  impact: "high" | "medium" | "low";
  dueDate?: string;
  triggerEvent?: string;
  dependencies?: string[];
  suggestedNextSteps?: string[];
  larryInsight?: string;
  notes?: string[];
}

const categoryConfig: Record<TaskCategory, { label: string; icon: typeof Workflow }> = {
  workflow: { label: "Workflow", icon: Workflow },
  ai_recommended: { label: "AI Recommended", icon: Brain },
  meeting: { label: "Meeting", icon: Video },
  manual: { label: "Manual", icon: User },
  external: { label: "External", icon: ExternalLink },
};

const stateConfig: Record<TaskState, { label: string }> = {
  pending: { label: "Pending" },
  waiting_customer: { label: "Waiting on Customer" },
  waiting_internal: { label: "Waiting on Team" },
  blocked: { label: "Blocked" },
  auto_running: { label: "Auto-running" },
  completed: { label: "Completed" },
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review onboarding blockers and schedule technical call",
    account: "Acme Corp",
    category: "workflow",
    state: "pending",
    context: "Integration stalled at API configuration for 5 days",
    priority: 1,
    impact: "high",
    dueDate: "Today",
    triggerEvent: "Onboarding workflow detected no progress in Integrations phase",
    dependencies: ["Technical team availability"],
    suggestedNextSteps: ["Schedule 30-min technical call", "Prepare API documentation", "Review error logs"],
    larryInsight: "High priority: This account represents $85K ARR and has shown declining engagement.",
    notes: [],
  },
  {
    id: "2",
    title: "Send renewal proposal with updated pricing",
    account: "TechFlow Inc",
    category: "ai_recommended",
    state: "pending",
    context: "Contract expires in 30 days, expansion signals detected",
    priority: 2,
    impact: "high",
    triggerEvent: "Larry detected renewal window + 3 expansion signals",
    suggestedNextSteps: ["Review usage data", "Prepare multi-year discount options", "Schedule renewal call"],
    larryInsight: "Usage increased 47% this quarter. Consider proposing tier upgrade.",
    notes: [],
  },
  {
    id: "3",
    title: "Follow up on feature request from last call",
    account: "GlobalTech",
    category: "meeting",
    state: "waiting_customer",
    context: "Customer requested roadmap visibility during QBR",
    priority: 3,
    impact: "medium",
    dueDate: "Tomorrow",
    triggerEvent: "Meeting recording analysis identified action item",
    notes: [],
  },
  {
    id: "4",
    title: "Investigate login issues reported by admin user",
    account: "Nexus Solutions",
    category: "external",
    state: "blocked",
    context: "SSO integration failing, waiting on identity provider response",
    priority: 4,
    impact: "high",
    dependencies: ["Identity provider support", "Customer IT team response"],
    larryInsight: "Escalation recommended: Issue blocking 50+ users for 3 days.",
    notes: [],
  },
  {
    id: "5",
    title: "Complete quarterly health score review",
    account: "DataStream",
    category: "manual",
    state: "pending",
    context: "Scheduled quarterly review to assess account trajectory",
    priority: 5,
    impact: "medium",
    dueDate: "This week",
    notes: [],
  },
  {
    id: "6",
    title: "Monitor automated email sequence performance",
    account: "CloudScale",
    category: "workflow",
    state: "auto_running",
    context: "Onboarding nurture sequence in progress, 3 of 5 emails sent",
    priority: 6,
    impact: "low",
    triggerEvent: "Workflow automation running successfully",
    notes: [],
  },
  {
    id: "7",
    title: "Prepare executive summary for stakeholder meeting",
    account: "Enterprise Plus",
    category: "meeting",
    state: "waiting_internal",
    context: "Need input from product team on Q1 roadmap items",
    priority: 7,
    impact: "medium",
    dueDate: "In 3 days",
    dependencies: ["Product team roadmap confirmation"],
    notes: [],
  },
  {
    id: "8",
    title: "Review and respond to NPS feedback",
    account: "StartupX",
    category: "ai_recommended",
    state: "pending",
    context: "Detractor score (6) received with specific feedback",
    priority: 8,
    impact: "medium",
    triggerEvent: "NPS survey response triggered follow-up recommendation",
    larryInsight: "Customer mentioned pricing concerns. Consider scheduling value discussion.",
    notes: [],
  },
];

interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
  onDefer: () => void;
  onSnooze: () => void;
  onAddNote: (note: string) => void;
  onEscalate: () => void;
  onConvertToFollowUp: () => void;
}

const TaskRow = ({ 
  task, 
  isExpanded, 
  onToggle,
  onComplete,
  onDefer,
  onSnooze,
  onAddNote,
  onEscalate,
  onConvertToFollowUp,
}: TaskRowProps) => {
  const CategoryIcon = categoryConfig[task.category].icon;
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");

  const getImpactStyles = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStateStyles = (state: TaskState) => {
    switch (state) {
      case "pending":
        return "bg-primary/10 text-primary border-primary/20";
      case "waiting_customer":
        return "bg-warning/10 text-warning border-warning/20";
      case "waiting_internal":
        return "bg-secondary text-secondary-foreground border-border";
      case "blocked":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "auto_running":
        return "bg-accent/50 text-accent-foreground border-accent/20";
      case "completed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
      setNoteText("");
      setShowNoteInput(false);
    }
  };

  return (
    <div 
      className={cn(
        "border border-border/50 rounded-xl transition-all duration-300 overflow-hidden",
        isExpanded 
          ? "bg-card shadow-lg ring-1 ring-primary/10" 
          : "bg-card/50 hover:bg-card hover:shadow-md hover:border-border",
        task.state === "completed" && "opacity-60"
      )}
    >
      {/* Main Row */}
      <div 
        className="flex items-center gap-4 p-5 cursor-pointer group"
        onClick={onToggle}
      >
        {/* Expand Icon */}
        <div className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        {/* Impact Indicator */}
        <div className={cn(
          "w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-card",
          task.impact === "high" ? "bg-destructive ring-destructive/30" : 
          task.impact === "medium" ? "bg-warning ring-warning/30" : 
          "bg-muted-foreground ring-muted-foreground/30"
        )} />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className={cn(
              "font-medium text-foreground truncate",
              task.state === "completed" && "line-through"
            )}>
              {task.title}
            </h3>
            {task.larryInsight && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 flex-shrink-0">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">AI Insight</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{task.context}</p>
        </div>

        {/* Account */}
        <div className="flex items-center gap-2.5 min-w-[150px] flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground truncate">{task.account}</span>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 min-w-[130px] flex-shrink-0">
          <CategoryIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm text-muted-foreground">{categoryConfig[task.category].label}</span>
        </div>

        {/* State Badge */}
        <Badge 
          variant="outline" 
          className={cn(
            "min-w-[140px] justify-center flex-shrink-0 font-medium border",
            getStateStyles(task.state)
          )}
        >
          {stateConfig[task.state].label}
        </Badge>

        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-sm min-w-[90px] flex-shrink-0">
          {task.dueDate ? (
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md",
              task.dueDate === "Today" ? "bg-destructive/10 text-destructive" : "text-muted-foreground"
            )}>
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">{task.dueDate}</span>
            </div>
          ) : (
            <span className="text-muted-foreground/50 px-2">—</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-lg transition-all",
              task.state === "completed" 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
            onClick={onComplete}
            disabled={task.state === "completed"}
          >
            {task.state === "completed" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={onDefer} className="gap-2 cursor-pointer">
                <Forward className="h-4 w-4" />
                Defer to Tomorrow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSnooze} className="gap-2 cursor-pointer">
                <Pause className="h-4 w-4" />
                Snooze for 1 Hour
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNoteInput(true)} className="gap-2 cursor-pointer">
                <StickyNote className="h-4 w-4" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onConvertToFollowUp} className="gap-2 cursor-pointer">
                <ArrowRight className="h-4 w-4" />
                Convert to Follow-up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEscalate} className="gap-2 cursor-pointer text-warning">
                <AlertTriangle className="h-4 w-4" />
                Escalate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 border-t border-border/50">
          <div className="grid grid-cols-3 gap-6 pt-5">
            {/* Left Column - Details */}
            <div className="space-y-5">
              {task.triggerEvent && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Triggering Event
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">{task.triggerEvent}</p>
                </div>
              )}
              {task.dependencies && task.dependencies.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Dependencies
                  </h4>
                  <ul className="space-y-2">
                    {task.dependencies.map((dep, i) => (
                      <li key={i} className="text-sm text-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                        {dep}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {task.notes && task.notes.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Notes
                  </h4>
                  <ul className="space-y-2">
                    {task.notes.map((note, i) => (
                      <li key={i} className="text-sm text-foreground bg-muted/50 rounded-lg p-3">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Middle Column - Suggested Steps */}
            {task.suggestedNextSteps && task.suggestedNextSteps.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Suggested Next Steps
                </h4>
                <ul className="space-y-2.5">
                  {task.suggestedNextSteps.map((step, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Right Column - Larry's Insight */}
            {task.larryInsight && (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
                    AI Insight
                  </h4>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{task.larryInsight}</p>
              </div>
            )}
          </div>

          {/* Note Input */}
          {showNoteInput && (
            <div className="mt-5 pt-5 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Add a Note</span>
              </div>
              <Textarea
                placeholder="Write your note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="mb-3 bg-background min-h-[80px] resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowNoteInput(false);
                    setNoteText("");
                  }}
                  className="gap-2"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveNote}
                  disabled={!noteText.trim()}
                  className="gap-2"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Note
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [currentView, setCurrentView] = useState<ViewType>("queue");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Create task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAccount, setNewTaskAccount] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskWorkflow, setNewTaskWorkflow] = useState("");

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.account.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;
    const matchesState = stateFilter === "all" || task.state === stateFilter;
    return matchesSearch && matchesCategory && matchesState;
  });

  const tasksByState = {
    pending: filteredTasks.filter(t => t.state === "pending"),
    waiting_customer: filteredTasks.filter(t => t.state === "waiting_customer"),
    waiting_internal: filteredTasks.filter(t => t.state === "waiting_internal"),
    blocked: filteredTasks.filter(t => t.state === "blocked"),
    auto_running: filteredTasks.filter(t => t.state === "auto_running"),
    completed: filteredTasks.filter(t => t.state === "completed"),
  };

  const handleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, state: "completed" as TaskState } : task
    ));
    toast({
      title: "Task Completed",
      description: "The task has been marked as complete.",
    });
  };

  const handleDefer = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, dueDate: "Tomorrow" } : task
    ));
    toast({
      title: "Task Deferred",
      description: "The task has been moved to tomorrow.",
    });
  };

  const handleSnooze = (taskId: string) => {
    toast({
      title: "Task Snoozed",
      description: "You'll be reminded about this task in 1 hour.",
    });
  };

  const handleAddNote = (taskId: string, note: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, notes: [...(task.notes || []), note] } 
        : task
    ));
    toast({
      title: "Note Added",
      description: "Your note has been saved to the task.",
    });
  };

  const handleEscalate = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    toast({
      title: "Task Escalated",
      description: `${task?.title} has been escalated for review.`,
      variant: "destructive",
    });
  };

  const handleConvertToFollowUp = (taskId: string) => {
    toast({
      title: "Converted to Follow-up",
      description: "The task has been converted to a follow-up action.",
    });
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      account: newTaskAccount || "Unassigned",
      category: "manual",
      state: "pending",
      context: newTaskDescription || "No description provided",
      priority: tasks.length + 1,
      impact: "medium",
      dueDate: newTaskDueDate ? new Date(newTaskDueDate).toLocaleDateString('en-US', { weekday: 'long' }) : undefined,
      notes: [],
    };

    setTasks(prev => [newTask, ...prev]);
    setIsCreateDialogOpen(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskAccount("");
    setNewTaskDueDate("");
    setNewTaskWorkflow("");
    
    toast({
      title: "Task Created",
      description: "Your new task has been added to the queue.",
    });
  };

  const stats = {
    high: filteredTasks.filter(t => t.impact === "high" && t.state !== "completed").length,
    blocked: filteredTasks.filter(t => t.state === "blocked").length,
    autoRunning: filteredTasks.filter(t => t.state === "auto_running").length,
    total: filteredTasks.filter(t => t.state !== "completed").length,
  };

  return (
    <div className="min-h-screen bg-background flex-1 overflow-auto">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Tasks</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Prioritized actions requiring your attention
              </p>
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg">
                  <Plus className="h-4 w-4" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 py-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Task Title <span className="text-destructive">*</span>
                    </label>
                    <Input 
                      placeholder="Enter task title..." 
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea 
                      placeholder="Add context or details..." 
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Account
                      </label>
                      <Select value={newTaskAccount} onValueChange={setNewTaskAccount}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                          <SelectItem value="TechFlow Inc">TechFlow Inc</SelectItem>
                          <SelectItem value="GlobalTech">GlobalTech</SelectItem>
                          <SelectItem value="Nexus Solutions">Nexus Solutions</SelectItem>
                          <SelectItem value="DataStream">DataStream</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Due Date
                      </label>
                      <Input 
                        type="date" 
                        className="h-11"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Link to Workflow
                    </label>
                    <Select value={newTaskWorkflow} onValueChange={setNewTaskWorkflow}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select workflow (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding Workflow</SelectItem>
                        <SelectItem value="renewal">Renewal Workflow</SelectItem>
                        <SelectItem value="expansion">Expansion Workflow</SelectItem>
                        <SelectItem value="at-risk">At-Risk Recovery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setNewTaskTitle("");
                      setNewTaskDescription("");
                      setNewTaskAccount("");
                      setNewTaskDueDate("");
                      setNewTaskWorkflow("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* View Toggles & Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
                <Button
                  variant={currentView === "queue" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 rounded-lg transition-all",
                    currentView === "queue" && "shadow-sm"
                  )}
                  onClick={() => setCurrentView("queue")}
                >
                  <ListTodo className="h-4 w-4" />
                  Action Queue
                </Button>
                <Button
                  variant={currentView === "time" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 rounded-lg transition-all",
                    currentView === "time" && "shadow-sm"
                  )}
                  onClick={() => setCurrentView("time")}
                >
                  <Calendar className="h-4 w-4" />
                  Time-Based
                </Button>
                <Button
                  variant={currentView === "state" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 rounded-lg transition-all",
                    currentView === "state" && "shadow-sm"
                  )}
                  onClick={() => setCurrentView("state")}
                >
                  <Layers className="h-4 w-4" />
                  State-Based
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[260px] h-10 bg-background/50 border-border/50"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px] h-10 bg-background/50 border-border/50">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="ai_recommended">AI Recommended</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[180px] h-10 bg-background/50 border-border/50">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="waiting_customer">Waiting on Customer</SelectItem>
                  <SelectItem value="waiting_internal">Waiting on Team</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="auto_running">Auto-running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {/* Action Queue View */}
        {currentView === "queue" && (
          <div className="space-y-4">
            {/* Stats Bar */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-card/50 border border-border/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive ring-4 ring-destructive/10" />
                <span className="text-sm font-medium text-foreground">{stats.high}</span>
                <span className="text-sm text-muted-foreground">high impact</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-warning ring-4 ring-warning/10" />
                <span className="text-sm font-medium text-foreground">{stats.blocked}</span>
                <span className="text-sm text-muted-foreground">blocked</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10" />
                <span className="text-sm font-medium text-foreground">{stats.autoRunning}</span>
                <span className="text-sm text-muted-foreground">auto-running</span>
              </div>
              <div className="ml-auto flex items-center gap-2 text-muted-foreground">
                <Bell className="h-4 w-4" />
                <span className="text-sm">{stats.total} tasks in queue</span>
              </div>
            </div>

            {/* Task List */}
            {filteredTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                isExpanded={expandedTaskId === task.id}
                onToggle={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                onComplete={() => handleComplete(task.id)}
                onDefer={() => handleDefer(task.id)}
                onSnooze={() => handleSnooze(task.id)}
                onAddNote={(note) => handleAddNote(task.id, note)}
                onEscalate={() => handleEscalate(task.id)}
                onConvertToFollowUp={() => handleConvertToFollowUp(task.id)}
              />
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-20 bg-card/30 border border-border/50 rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
                <p className="text-sm text-muted-foreground mb-6">No tasks match your current filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setStateFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Time-Based View */}
        {currentView === "time" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border/50 rounded-xl">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Showing tasks organized by their due dates
              </p>
            </div>

            {["Today", "Tomorrow", "This week", "In 3 days"].map((timeGroup) => {
              const tasksInGroup = filteredTasks.filter(t => t.dueDate === timeGroup);
              if (tasksInGroup.length === 0) return null;

              return (
                <div key={timeGroup}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className={cn(
                      "text-sm font-semibold uppercase tracking-wider",
                      timeGroup === "Today" ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {timeGroup}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {tasksInGroup.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {tasksInGroup.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        isExpanded={expandedTaskId === task.id}
                        onToggle={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        onComplete={() => handleComplete(task.id)}
                        onDefer={() => handleDefer(task.id)}
                        onSnooze={() => handleSnooze(task.id)}
                        onAddNote={(note) => handleAddNote(task.id, note)}
                        onEscalate={() => handleEscalate(task.id)}
                        onConvertToFollowUp={() => handleConvertToFollowUp(task.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredTasks.filter(t => t.dueDate).length === 0 && (
              <div className="text-center py-20 bg-card/30 border border-border/50 rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No scheduled tasks</h3>
                <p className="text-sm text-muted-foreground">No tasks have due dates assigned</p>
              </div>
            )}
          </div>
        )}

        {/* State-Based View */}
        {currentView === "state" && (
          <div className="space-y-8">
            {Object.entries(tasksByState).map(([state, stateTasks]) => {
              if (stateTasks.length === 0) return null;
              const config = stateConfig[state as TaskState];

              return (
                <div key={state}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                      {config.label}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {stateTasks.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {stateTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        isExpanded={expandedTaskId === task.id}
                        onToggle={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        onComplete={() => handleComplete(task.id)}
                        onDefer={() => handleDefer(task.id)}
                        onSnooze={() => handleSnooze(task.id)}
                        onAddNote={(note) => handleAddNote(task.id, note)}
                        onEscalate={() => handleEscalate(task.id)}
                        onConvertToFollowUp={() => handleConvertToFollowUp(task.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
