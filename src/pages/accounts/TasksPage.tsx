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
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "queue" | "time" | "state";
type TaskState = "pending" | "waiting_customer" | "waiting_internal" | "blocked" | "auto_running";
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
}

const categoryConfig: Record<TaskCategory, { label: string; icon: typeof Workflow; color: string }> = {
  workflow: { label: "Workflow", icon: Workflow, color: "text-blue-400" },
  ai_recommended: { label: "AI Recommended", icon: Brain, color: "text-purple-400" },
  meeting: { label: "Meeting", icon: Video, color: "text-emerald-400" },
  manual: { label: "Manual", icon: User, color: "text-slate-400" },
  external: { label: "External", icon: ExternalLink, color: "text-amber-400" },
};

const stateConfig: Record<TaskState, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  waiting_customer: { label: "Waiting on Customer", color: "text-amber-400", bgColor: "bg-amber-500/10" },
  waiting_internal: { label: "Waiting on Team", color: "text-orange-400", bgColor: "bg-orange-500/10" },
  blocked: { label: "Blocked", color: "text-red-400", bgColor: "bg-red-500/10" },
  auto_running: { label: "Auto-running", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
};

const sampleTasks: Task[] = [
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
  },
];

const TaskRow = ({ 
  task, 
  isExpanded, 
  onToggle,
  onComplete,
  onDefer,
  onSnooze,
  onAddNote,
}: { 
  task: Task; 
  isExpanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
  onDefer: () => void;
  onSnooze: () => void;
  onAddNote: () => void;
}) => {
  const CategoryIcon = categoryConfig[task.category].icon;
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");

  return (
    <div 
      className={cn(
        "border border-border/50 rounded-lg transition-all duration-200",
        isExpanded ? "bg-card/80 shadow-lg" : "bg-card/40 hover:bg-card/60"
      )}
    >
      {/* Main Row */}
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Priority Indicator */}
        <div className={cn(
          "w-1 h-12 rounded-full flex-shrink-0",
          task.impact === "high" ? "bg-red-500" : task.impact === "medium" ? "bg-amber-500" : "bg-slate-500"
        )} />

        {/* Expand Icon */}
        <div className="text-muted-foreground flex-shrink-0">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-medium text-foreground truncate">{task.title}</h3>
            {task.larryInsight && (
              <Sparkles className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{task.context}</p>
        </div>

        {/* Account */}
        <div className="flex items-center gap-2 min-w-[140px] flex-shrink-0">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground truncate">{task.account}</span>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 min-w-[130px] flex-shrink-0">
          <CategoryIcon className={cn("h-4 w-4 flex-shrink-0", categoryConfig[task.category].color)} />
          <span className="text-sm text-muted-foreground">{categoryConfig[task.category].label}</span>
        </div>

        {/* State */}
        <Badge 
          variant="secondary" 
          className={cn(
            "min-w-[130px] justify-center flex-shrink-0",
            stateConfig[task.state].bgColor,
            stateConfig[task.state].color
          )}
        >
          {stateConfig[task.state].label}
        </Badge>

        {/* Due Date */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-[80px] flex-shrink-0">
          {task.dueDate ? (
            <>
              <Clock className="h-3.5 w-3.5" />
              <span>{task.dueDate}</span>
            </>
          ) : (
            <span className="text-muted-foreground/50">—</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-emerald-400"
            onClick={onComplete}
          >
            <Check className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onDefer}>
                <Forward className="h-4 w-4 mr-2" />
                Defer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSnooze}>
                <Pause className="h-4 w-4 mr-2" />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNoteInput(true)}>
                <StickyNote className="h-4 w-4 mr-2" />
                Add Note
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowRight className="h-4 w-4 mr-2" />
                Convert to Follow-up
              </DropdownMenuItem>
              <DropdownMenuItem className="text-amber-400">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border/30 mt-0">
          <div className="grid grid-cols-3 gap-6 pt-4">
            {/* Left Column - Details */}
            <div className="space-y-4">
              {task.triggerEvent && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Triggering Event
                  </h4>
                  <p className="text-sm text-foreground">{task.triggerEvent}</p>
                </div>
              )}
              {task.dependencies && task.dependencies.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Dependencies
                  </h4>
                  <ul className="space-y-1">
                    {task.dependencies.map((dep, i) => (
                      <li key={i} className="text-sm text-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {dep}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Middle Column - Suggested Steps */}
            {task.suggestedNextSteps && task.suggestedNextSteps.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Suggested Next Steps
                </h4>
                <ul className="space-y-2">
                  {task.suggestedNextSteps.map((step, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                        {i + 1}
                      </div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Right Column - Larry's Insight */}
            {task.larryInsight && (
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <h4 className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                    Larry's Insight
                  </h4>
                </div>
                <p className="text-sm text-foreground">{task.larryInsight}</p>
              </div>
            )}
          </div>

          {/* Note Input */}
          {showNoteInput && (
            <div className="mt-4 pt-4 border-t border-border/30">
              <Textarea
                placeholder="Add a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="mb-2 bg-background/50"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowNoteInput(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => {
                  onAddNote();
                  setShowNoteInput(false);
                  setNoteText("");
                }}>
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
  const [currentView, setCurrentView] = useState<ViewType>("queue");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTasks = sampleTasks.filter(task => {
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
  };

  const handleComplete = (taskId: string) => {
    console.log("Complete task:", taskId);
  };

  const handleDefer = (taskId: string) => {
    console.log("Defer task:", taskId);
  };

  const handleSnooze = (taskId: string) => {
    console.log("Snooze task:", taskId);
  };

  const handleAddNote = (taskId: string) => {
    console.log("Add note to task:", taskId);
  };

  return (
    <div className="min-h-screen bg-background flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  What needs attention now?
                </p>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Task Title
                      </label>
                      <Input placeholder="Enter task title..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Description
                      </label>
                      <Textarea placeholder="Add context or details..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Account (Optional)
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acme">Acme Corp</SelectItem>
                            <SelectItem value="techflow">TechFlow Inc</SelectItem>
                            <SelectItem value="globaltech">GlobalTech</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Due Date (Optional)
                        </label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Link to Workflow (Optional)
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select workflow" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onboarding">Onboarding Workflow</SelectItem>
                          <SelectItem value="renewal">Renewal Workflow</SelectItem>
                          <SelectItem value="expansion">Expansion Workflow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* View Toggles & Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-muted/50 rounded-lg p-1">
                  <Button
                    variant={currentView === "queue" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setCurrentView("queue")}
                  >
                    <ListTodo className="h-4 w-4" />
                    Action Queue
                  </Button>
                  <Button
                    variant={currentView === "time" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setCurrentView("time")}
                  >
                    <Calendar className="h-4 w-4" />
                    Time-Based
                  </Button>
                  <Button
                    variant={currentView === "state" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
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
                    className="pl-9 w-[240px] bg-background/50"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px] bg-background/50">
                    <Filter className="h-4 w-4 mr-2" />
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
                  <SelectTrigger className="w-[170px] bg-background/50">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="waiting_customer">Waiting on Customer</SelectItem>
                    <SelectItem value="waiting_internal">Waiting on Team</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="auto_running">Auto-running</SelectItem>
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
            <div className="space-y-3">
              {/* Stats Bar */}
              <div className="flex items-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">
                    {filteredTasks.filter(t => t.impact === "high").length} high impact
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">
                    {filteredTasks.filter(t => t.state === "blocked").length} blocked
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">
                    {filteredTasks.filter(t => t.state === "auto_running").length} auto-running
                  </span>
                </div>
                <div className="ml-auto text-muted-foreground">
                  {filteredTasks.length} tasks in queue
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
                  onAddNote={() => handleAddNote(task.id)}
                />
              ))}

              {filteredTasks.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks match your filters</p>
                </div>
              )}
            </div>
          )}

          {/* Time-Based View */}
          {currentView === "time" && (
            <div className="space-y-4">
              <div className="bg-card/40 border border-border/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Showing only tasks with due dates or scheduled times
                </p>
              </div>

              {["Today", "Tomorrow", "This week", "In 3 days"].map((timeGroup) => {
                const tasksInGroup = filteredTasks.filter(t => t.dueDate === timeGroup);
                if (tasksInGroup.length === 0) return null;

                return (
                  <div key={timeGroup}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{timeGroup}</h3>
                    <div className="space-y-2">
                      {tasksInGroup.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          isExpanded={expandedTaskId === task.id}
                          onToggle={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          onComplete={() => handleComplete(task.id)}
                          onDefer={() => handleDefer(task.id)}
                          onSnooze={() => handleSnooze(task.id)}
                          onAddNote={() => handleAddNote(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* State-Based View */}
          {currentView === "state" && (
            <div className="space-y-8">
              {Object.entries(tasksByState).map(([state, tasks]) => {
                if (tasks.length === 0) return null;
                const config = stateConfig[state as TaskState];

                return (
                  <div key={state}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className={cn("text-sm font-medium", config.color)}>
                        {config.label}
                      </h3>
                      <Badge variant="secondary" className={cn(config.bgColor, config.color)}>
                        {tasks.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {tasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          isExpanded={expandedTaskId === task.id}
                          onToggle={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          onComplete={() => handleComplete(task.id)}
                          onDefer={() => handleDefer(task.id)}
                          onSnooze={() => handleSnooze(task.id)}
                          onAddNote={() => handleAddNote(task.id)}
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
