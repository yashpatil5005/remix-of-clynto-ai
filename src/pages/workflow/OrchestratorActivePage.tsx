import React, { useState } from 'react';
import { 
  Play, 
  Building2, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Pause,
  RotateCcw,
  MoreHorizontal,
  Filter,
  Search,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActiveWorkflow {
  id: string;
  accountName: string;
  segment: string;
  playbookName: string;
  currentPhase: string;
  progress: number;
  status: 'running' | 'paused' | 'blocked' | 'completing';
  startedAt: string;
  estimatedCompletion: string;
  tasksCompleted: number;
  totalTasks: number;
  csm: string;
  lastActivity: string;
  blockedReason?: string;
}

const activeWorkflows: ActiveWorkflow[] = [
  {
    id: '1',
    accountName: 'Acme Corporation',
    segment: 'Enterprise',
    playbookName: 'Enterprise Onboarding',
    currentPhase: 'Value Realization',
    progress: 65,
    status: 'running',
    startedAt: '2 weeks ago',
    estimatedCompletion: '3 weeks',
    tasksCompleted: 12,
    totalTasks: 18,
    csm: 'Sarah Chen',
    lastActivity: '2 hours ago'
  },
  {
    id: '2',
    accountName: 'GlobalTech Inc',
    segment: 'Enterprise',
    playbookName: 'Renewal Preparation',
    currentPhase: 'Stakeholder Alignment',
    progress: 40,
    status: 'blocked',
    startedAt: '1 week ago',
    estimatedCompletion: '5 weeks',
    tasksCompleted: 6,
    totalTasks: 15,
    csm: 'Marcus Johnson',
    lastActivity: '1 day ago',
    blockedReason: 'Waiting for executive sponsor meeting'
  },
  {
    id: '3',
    accountName: 'StartupHub',
    segment: 'SMB',
    playbookName: 'Quick Start Onboarding',
    currentPhase: 'Technical Setup',
    progress: 85,
    status: 'completing',
    startedAt: '1 week ago',
    estimatedCompletion: '2 days',
    tasksCompleted: 10,
    totalTasks: 12,
    csm: 'Emily Rodriguez',
    lastActivity: '30 mins ago'
  },
  {
    id: '4',
    accountName: 'MidMarket Solutions',
    segment: 'Mid-Market',
    playbookName: 'Health Recovery',
    currentPhase: 'Engagement',
    progress: 30,
    status: 'paused',
    startedAt: '3 weeks ago',
    estimatedCompletion: '6 weeks',
    tasksCompleted: 4,
    totalTasks: 14,
    csm: 'David Kim',
    lastActivity: '3 days ago'
  },
  {
    id: '5',
    accountName: 'Enterprise Plus',
    segment: 'Enterprise',
    playbookName: 'Expansion Opportunity',
    currentPhase: 'Discovery',
    progress: 20,
    status: 'running',
    startedAt: '4 days ago',
    estimatedCompletion: '8 weeks',
    tasksCompleted: 3,
    totalTasks: 16,
    csm: 'Sarah Chen',
    lastActivity: '4 hours ago'
  },
];

const statusConfig = {
  running: { label: 'Running', color: 'bg-green-500/10 text-green-600 border-green-200', icon: Play },
  paused: { label: 'Paused', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', icon: Pause },
  blocked: { label: 'Blocked', color: 'bg-red-500/10 text-red-600 border-red-200', icon: AlertTriangle },
  completing: { label: 'Completing', color: 'bg-blue-500/10 text-blue-600 border-blue-200', icon: CheckCircle2 },
};

export default function OrchestratorActivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  const filteredWorkflows = activeWorkflows.filter(workflow => {
    const matchesSearch = workflow.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workflow.playbookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workflow.csm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    const matchesSegment = segmentFilter === 'all' || workflow.segment === segmentFilter;
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const runningCount = activeWorkflows.filter(w => w.status === 'running').length;
  const blockedCount = activeWorkflows.filter(w => w.status === 'blocked').length;

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Active Workflow Execution</h1>
              <p className="text-sm text-muted-foreground">
                Monitor and manage running playbooks across all accounts
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground">{activeWorkflows.length}</span>
            <span className="text-sm text-muted-foreground">Active Workflows</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">{runningCount} Running</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{blockedCount} Blocked</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts, playbooks, or CSMs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="completing">Completing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
              <SelectItem value="Mid-Market">Mid-Market</SelectItem>
              <SelectItem value="SMB">SMB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Workflows List */}
        <div className="space-y-3">
          {filteredWorkflows.map((workflow) => {
            const StatusIcon = statusConfig[workflow.status].icon;
            const isExpanded = expandedWorkflow === workflow.id;
            
            return (
              <div
                key={workflow.id}
                className={cn(
                  'bg-card border border-border rounded-xl p-5 transition-all duration-200',
                  'hover:border-primary/30 hover:shadow-sm cursor-pointer',
                  isExpanded && 'border-primary/50 shadow-md'
                )}
                onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-foreground">{workflow.accountName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {workflow.segment}
                        </Badge>
                        <Badge className={cn('text-xs border', statusConfig[workflow.status].color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[workflow.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-primary font-medium">{workflow.playbookName}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{workflow.currentPhase}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-1.5" />
                    </div>
                    <div className="text-right min-w-[100px]">
                      <div className="text-sm text-muted-foreground">{workflow.csm}</div>
                      <div className="text-xs text-muted-foreground">{workflow.lastActivity}</div>
                    </div>
                    <ChevronRight className={cn(
                      'w-5 h-5 text-muted-foreground transition-transform',
                      isExpanded && 'rotate-90'
                    )} />
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-border animate-fade-in">
                    {workflow.blockedReason && (
                      <div className="mb-4 p-3 bg-red-500/5 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-red-600">Blocked: {workflow.blockedReason}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-6 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Tasks Completed</p>
                        <p className="text-sm font-medium text-foreground">
                          {workflow.tasksCompleted} / {workflow.totalTasks}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Started</p>
                        <p className="text-sm font-medium text-foreground">{workflow.startedAt}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Est. Completion</p>
                        <p className="text-sm font-medium text-foreground">{workflow.estimatedCompletion}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Current Phase</p>
                        <p className="text-sm font-medium text-foreground">{workflow.currentPhase}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-3">
                      {workflow.status === 'running' && (
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      {workflow.status === 'paused' && (
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      {workflow.status === 'blocked' && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      )}
                      <Button size="sm">
                        <Zap className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No active workflows found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
