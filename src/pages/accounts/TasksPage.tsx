import { useState } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  CheckCircle2,
  Clock,
  Video,
  Zap,
  Brain,
  Bell,
  User,
  X,
  MoreHorizontal,
  CalendarDays,
  CalendarRange,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Types
interface Task {
  id: string;
  title: string;
  account: string;
  category: "meeting" | "workflow" | "ai" | "manual" | "reminder";
  dueTime?: string;
  status: "pending" | "completed" | "snoozed";
  source: string;
  description?: string;
}

interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

// Sample data
const generateSampleTasks = (): Task[] => [
  { id: "1", title: "Quarterly Business Review", account: "Acme Corp", category: "meeting", dueTime: "10:00 AM", status: "pending", source: "Calendar", description: "Discuss Q4 goals and renewal timeline" },
  { id: "2", title: "Send onboarding materials", account: "TechStart Inc", category: "workflow", dueTime: "11:30 AM", status: "pending", source: "Orchestrator AI", description: "Phase 2 onboarding workflow task" },
  { id: "3", title: "Review usage decline", account: "GlobalTech", category: "ai", dueTime: "2:00 PM", status: "pending", source: "Larry AI", description: "20% usage drop detected last week" },
  { id: "4", title: "Follow up on feature request", account: "Innovate Labs", category: "manual", dueTime: "3:30 PM", status: "pending", source: "Manual", description: "Customer requested API enhancements" },
  { id: "5", title: "Renewal reminder - 30 days", account: "DataFlow Systems", category: "reminder", status: "pending", source: "System", description: "Contract expires in 30 days" },
  { id: "6", title: "Product demo call", account: "Enterprise Solutions", category: "meeting", dueTime: "4:00 PM", status: "completed", source: "Calendar" },
  { id: "7", title: "Check integration status", account: "CloudFirst", category: "workflow", status: "pending", source: "Orchestrator AI" },
  { id: "8", title: "Expansion opportunity", account: "ScaleUp Co", category: "ai", dueTime: "11:00 AM", status: "pending", source: "CSM Feed" },
];

const categoryConfig = {
  meeting: { icon: Video, label: "Meeting", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  workflow: { icon: Zap, label: "Workflow", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  ai: { icon: Brain, label: "AI Recommendation", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  manual: { icon: User, label: "Manual", color: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  reminder: { icon: Bell, label: "Reminder", color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
};

const TasksPage = () => {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDayForPanel, setSelectedDayForPanel] = useState<Date | null>(new Date());
  const [tasks, setTasks] = useState<Task[]>(generateSampleTasks());
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAccount, setFilterAccount] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", account: "", description: "", dueTime: "" });

  // Get current week dates
  const getWeekDates = (date: Date): Date[] => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  // Get month dates
  const getMonthDates = (date: Date): DayData[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: DayData[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString(),
        tasks: getTasksForDate(currentDate),
      });
    }
    return days;
  };

  const getTasksForDate = (date: Date): Task[] => {
    // For demo, distribute tasks across current week
    const today = new Date();
    const dayDiff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff >= -1 && dayDiff <= 5) {
      return tasks.filter((_, index) => index % 7 === Math.abs(dayDiff));
    }
    return [];
  };

  const filteredTasks = tasks.filter(task => {
    if (filterType !== "all" && task.category !== filterType) return false;
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterAccount !== "all" && task.account !== filterAccount) return false;
    return true;
  });

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "completed" as const } : t));
  };

  const handleSnoozeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "snoozed" as const } : t));
  };

  const handleCreateTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      account: newTask.account || "Unassigned",
      category: "manual",
      dueTime: newTask.dueTime,
      status: "pending",
      source: "Manual",
      description: newTask.description,
    };
    setTasks(prev => [...prev, task]);
    setNewTask({ title: "", account: "", description: "", dueTime: "" });
    setIsCreateOpen(false);
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() + direction);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + (direction * 7));
    else newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const formatDateRange = () => {
    if (viewMode === "day") {
      return selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    } else if (viewMode === "week") {
      const weekDates = getWeekDates(selectedDate);
      const start = weekDates[0];
      const end = weekDates[6];
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
  };

  const uniqueAccounts = [...new Set(tasks.map(t => t.account))];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">Your daily execution hub</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border/50">
              <button
                onClick={() => setViewMode("day")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                  viewMode === "day" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarDays className="h-4 w-4" />
                Day
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                  viewMode === "week" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarRange className="h-4 w-4" />
                Week
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                  viewMode === "month" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Month
              </button>
            </div>

            {/* Create Task */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input 
                      placeholder="Enter task title..."
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account (Optional)</Label>
                    <Select 
                      value={newTask.account} 
                      onValueChange={(v) => setNewTask(prev => ({ ...prev, account: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueAccounts.map(account => (
                          <SelectItem key={account} value={account}>{account}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Time (Optional)</Label>
                    <Input 
                      type="time"
                      value={newTask.dueTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea 
                      placeholder="Add details..."
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-lg font-medium text-foreground min-w-[240px]">
              {formatDateRange()}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedDate(new Date());
                setSelectedDayForPanel(new Date());
              }}
              className="text-muted-foreground"
            >
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Task Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="snoozed">Snoozed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAccount} onValueChange={setFilterAccount}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {uniqueAccounts.map(account => (
                  <SelectItem key={account} value={account}>{account}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Calendar Grid */}
        <div className={cn(
          "flex-1 overflow-auto p-6 transition-all duration-300",
          selectedDayForPanel ? "pr-0" : ""
        )}>
          {viewMode === "week" && (
            <WeekView 
              dates={getWeekDates(selectedDate)} 
              tasks={filteredTasks}
              selectedDay={selectedDayForPanel}
              onSelectDay={setSelectedDayForPanel}
              getTasksForDate={getTasksForDate}
            />
          )}
          {viewMode === "month" && (
            <MonthView 
              days={getMonthDates(selectedDate)}
              selectedDay={selectedDayForPanel}
              onSelectDay={setSelectedDayForPanel}
            />
          )}
          {viewMode === "day" && (
            <DayView 
              date={selectedDate}
              tasks={filteredTasks}
              onSelectDay={() => setSelectedDayForPanel(selectedDate)}
            />
          )}
        </div>

        {/* Day Detail Panel */}
        {selectedDayForPanel && (
          <DayDetailPanel
            date={selectedDayForPanel}
            tasks={filteredTasks}
            onClose={() => setSelectedDayForPanel(null)}
            onComplete={handleCompleteTask}
            onSnooze={handleSnoozeTask}
          />
        )}
      </div>
    </div>
  );
};

// Week View Component
const WeekView = ({ 
  dates, 
  tasks, 
  selectedDay, 
  onSelectDay,
  getTasksForDate 
}: { 
  dates: Date[]; 
  tasks: Task[];
  selectedDay: Date | null;
  onSelectDay: (date: Date) => void;
  getTasksForDate: (date: Date) => Task[];
}) => {
  const today = new Date().toDateString();
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  return (
    <div className="h-full flex flex-col">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px bg-border/50 rounded-t-lg overflow-hidden">
        {dates.map((date, index) => {
          const isToday = date.toDateString() === today;
          const isSelected = selectedDay?.toDateString() === date.toDateString();
          return (
            <button
              key={index}
              onClick={() => onSelectDay(date)}
              className={cn(
                "p-3 text-center transition-all duration-200 bg-background",
                isSelected && "bg-primary/5",
                "hover:bg-muted/50"
              )}
            >
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className={cn(
                "text-lg font-semibold mt-1 w-8 h-8 flex items-center justify-center mx-auto rounded-full",
                isToday && "bg-primary text-primary-foreground"
              )}>
                {date.getDate()}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="flex-1 grid grid-cols-7 gap-px bg-border/50 overflow-y-auto">
        {dates.map((date, dateIndex) => {
          const dayTasks = getTasksForDate(date);
          const isSelected = selectedDay?.toDateString() === date.toDateString();
          
          return (
            <div 
              key={dateIndex}
              onClick={() => onSelectDay(date)}
              className={cn(
                "bg-background p-2 min-h-[400px] cursor-pointer transition-all duration-200",
                isSelected && "bg-primary/5 ring-1 ring-primary/20",
                "hover:bg-muted/30"
              )}
            >
              {dayTasks.slice(0, 5).map((task) => {
                const config = categoryConfig[task.category];
                const Icon = config.icon;
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "mb-1.5 p-2 rounded-md border text-xs transition-all duration-200",
                      config.color,
                      task.status === "completed" && "opacity-50 line-through"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="h-3 w-3 flex-shrink-0" />
                      {task.dueTime && (
                        <span className="font-medium">{task.dueTime}</span>
                      )}
                    </div>
                    <div className="font-medium truncate">{task.title}</div>
                    <div className="text-[10px] opacity-70 truncate mt-0.5">{task.account}</div>
                  </div>
                );
              })}
              {dayTasks.length > 5 && (
                <div className="text-xs text-muted-foreground text-center mt-2">
                  +{dayTasks.length - 5} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Month View Component
const MonthView = ({ 
  days, 
  selectedDay, 
  onSelectDay 
}: { 
  days: DayData[]; 
  selectedDay: Date | null;
  onSelectDay: (date: Date) => void;
}) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="h-full flex flex-col">
      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-px bg-border/50 rounded-t-lg overflow-hidden">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-border/50">
        {days.map((day, index) => {
          const isSelected = selectedDay?.toDateString() === day.date.toDateString();
          return (
            <button
              key={index}
              onClick={() => onSelectDay(day.date)}
              className={cn(
                "p-2 text-left transition-all duration-200 min-h-[100px]",
                day.isCurrentMonth ? "bg-background" : "bg-muted/20",
                isSelected && "bg-primary/5 ring-1 ring-primary/20",
                "hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                day.isToday && "bg-primary text-primary-foreground",
                !day.isCurrentMonth && "text-muted-foreground"
              )}>
                {day.date.getDate()}
              </div>
              <div className="space-y-0.5">
                {day.tasks.slice(0, 3).map((task) => {
                  const config = categoryConfig[task.category];
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] truncate border",
                        config.color
                      )}
                    >
                      {task.title}
                    </div>
                  );
                })}
                {day.tasks.length > 3 && (
                  <div className="text-[10px] text-muted-foreground pl-1">
                    +{day.tasks.length - 3} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Day View Component
const DayView = ({ 
  date, 
  tasks,
  onSelectDay 
}: { 
  date: Date; 
  tasks: Task[];
  onSelectDay: () => void;
}) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);
  
  return (
    <div className="h-full overflow-y-auto">
      {hours.map((hour) => {
        const timeStr = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        const hourTasks = tasks.filter(t => {
          if (!t.dueTime) return false;
          const taskHour = parseInt(t.dueTime.split(':')[0]);
          const isPM = t.dueTime.includes('PM');
          const task24Hour = isPM && taskHour !== 12 ? taskHour + 12 : taskHour;
          return task24Hour === hour;
        });

        return (
          <div 
            key={hour} 
            className="flex border-b border-border/30 min-h-[60px] hover:bg-muted/20 cursor-pointer transition-all duration-200"
            onClick={onSelectDay}
          >
            <div className="w-20 flex-shrink-0 p-2 text-xs text-muted-foreground text-right pr-4 border-r border-border/30">
              {timeStr}
            </div>
            <div className="flex-1 p-2 space-y-1">
              {hourTasks.map((task) => {
                const config = categoryConfig[task.category];
                const Icon = config.icon;
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "p-2 rounded-md border flex items-center gap-2",
                      config.color
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs opacity-70">{task.account}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Day Detail Panel Component
const DayDetailPanel = ({ 
  date, 
  tasks,
  onClose,
  onComplete,
  onSnooze
}: { 
  date: Date;
  tasks: Task[];
  onClose: () => void;
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const groupedTasks = {
    meeting: tasks.filter(t => t.category === "meeting"),
    workflow: tasks.filter(t => t.category === "workflow"),
    ai: tasks.filter(t => t.category === "ai"),
    manual: tasks.filter(t => t.category === "manual"),
    reminder: tasks.filter(t => t.category === "reminder"),
  };

  const nonEmptyGroups = Object.entries(groupedTasks).filter(([_, items]) => items.length > 0);

  return (
    <div className="w-[380px] flex-shrink-0 border-l border-border/50 bg-gradient-to-b from-background to-muted/10 overflow-y-auto">
      {/* Panel Header */}
      <div className="p-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">
              {date.toLocaleDateString("en-US", { weekday: "long" })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{tasks.filter(t => t.status === "pending").length} pending</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{tasks.filter(t => t.status === "completed").length} completed</span>
          </div>
        </div>
      </div>

      {/* Task Groups */}
      <div className="p-4 space-y-6">
        {nonEmptyGroups.map(([category, categoryTasks]) => {
          const config = categoryConfig[category as keyof typeof categoryConfig];
          const Icon = config.icon;
          
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">{config.label}</h4>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {categoryTasks.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "border rounded-lg transition-all duration-200",
                      task.status === "completed" && "opacity-60"
                    )}
                  >
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="w-full p-3 text-left hover:bg-muted/50 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(task.id);
                          }}
                          className={cn(
                            "mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-200",
                            task.status === "completed" 
                              ? "bg-emerald-500 border-emerald-500" 
                              : "border-muted-foreground/50 hover:border-emerald-500"
                          )}
                        >
                          {task.status === "completed" && (
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "font-medium text-sm",
                            task.status === "completed" && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{task.account}</span>
                            {task.dueTime && (
                              <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {task.dueTime}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {expandedTask === task.id && (
                      <div className="px-3 pb-3 pt-0 border-t border-border/50 mt-2">
                        <div className="pt-3 space-y-3">
                          {task.description && (
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Source: {task.source}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onComplete(task.id)}
                              className="h-7 text-xs"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onSnooze(task.id)}
                              className="h-7 text-xs"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Snooze
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 text-xs"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {nonEmptyGroups.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No tasks for this day</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
