import React, { useState } from 'react';
import { 
  Clock, 
  Building2, 
  AlertCircle, 
  ChevronRight,
  Play,
  X,
  Calendar,
  User,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AwaitingAccount {
  id: string;
  name: string;
  segment: string;
  arr: number;
  healthScore: number;
  csm: string;
  awaitingSince: string;
  reason: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  suggestedPlaybook?: string;
}

const awaitingAccounts: AwaitingAccount[] = [
  {
    id: '1',
    name: 'TechFlow Industries',
    segment: 'Enterprise',
    arr: 450000,
    healthScore: 45,
    csm: 'Sarah Chen',
    awaitingSince: '3 days ago',
    reason: 'No active playbook assigned',
    priority: 'critical',
    suggestedPlaybook: 'Enterprise Health Recovery'
  },
  {
    id: '2',
    name: 'DataStream Corp',
    segment: 'Mid-Market',
    arr: 120000,
    healthScore: 62,
    csm: 'Marcus Johnson',
    awaitingSince: '5 days ago',
    reason: 'Onboarding playbook completed, awaiting next phase',
    priority: 'high',
    suggestedPlaybook: 'Adoption Acceleration'
  },
  {
    id: '3',
    name: 'CloudFirst Solutions',
    segment: 'Enterprise',
    arr: 280000,
    healthScore: 78,
    csm: 'Emily Rodriguez',
    awaitingSince: '1 day ago',
    reason: 'Renewal approaching, no renewal playbook active',
    priority: 'high',
    suggestedPlaybook: 'Renewal Preparation'
  },
  {
    id: '4',
    name: 'Innovate Labs',
    segment: 'SMB',
    arr: 45000,
    healthScore: 55,
    csm: 'David Kim',
    awaitingSince: '7 days ago',
    reason: 'Champion departed, re-engagement needed',
    priority: 'medium',
    suggestedPlaybook: 'Stakeholder Re-engagement'
  },
  {
    id: '5',
    name: 'ScaleUp Inc',
    segment: 'Mid-Market',
    arr: 95000,
    healthScore: 40,
    csm: 'Sarah Chen',
    awaitingSince: '2 days ago',
    reason: 'Health score dropped significantly',
    priority: 'critical',
    suggestedPlaybook: 'Risk Mitigation'
  },
];

const priorityConfig = {
  critical: { label: 'Critical', color: 'bg-red-500/10 text-red-600 border-red-200' },
  high: { label: 'High', color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
  medium: { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  low: { label: 'Low', color: 'bg-green-500/10 text-green-600 border-green-200' },
};

export default function OrchestratorAwaitingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<AwaitingAccount | null>(null);

  const filteredAccounts = awaitingAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          account.csm.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || account.priority === priorityFilter;
    const matchesSegment = segmentFilter === 'all' || account.segment === segmentFilter;
    return matchesSearch && matchesPriority && matchesSegment;
  });

  const criticalCount = awaitingAccounts.filter(a => a.priority === 'critical').length;
  const highCount = awaitingAccounts.filter(a => a.priority === 'high').length;

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Accounts Awaiting Activation</h1>
              <p className="text-sm text-muted-foreground">
                Accounts requiring playbook assignment or workflow activation
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-foreground">{awaitingAccounts.length}</span>
            <span className="text-sm text-muted-foreground">Total Awaiting</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{criticalCount} Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">{highCount} High Priority</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts or CSMs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
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

        {/* Accounts List */}
        <div className="space-y-3">
          {filteredAccounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                'bg-card border border-border rounded-xl p-5 transition-all duration-200',
                'hover:border-primary/30 hover:shadow-sm cursor-pointer',
                selectedAccount?.id === account.id && 'border-primary/50 shadow-md'
              )}
              onClick={() => setSelectedAccount(selectedAccount?.id === account.id ? null : account)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground">{account.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {account.segment}
                      </Badge>
                      <Badge className={cn('text-xs border', priorityConfig[account.priority].color)}>
                        {priorityConfig[account.priority].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{account.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      ${(account.arr / 1000).toFixed(0)}K ARR
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Health: {account.healthScore}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{account.csm}</div>
                    <div className="text-xs text-muted-foreground">{account.awaitingSince}</div>
                  </div>
                  <ChevronRight className={cn(
                    'w-5 h-5 text-muted-foreground transition-transform',
                    selectedAccount?.id === account.id && 'rotate-90'
                  )} />
                </div>
              </div>

              {/* Expanded Content */}
              {selectedAccount?.id === account.id && (
                <div className="mt-5 pt-5 border-t border-border animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Suggested Playbook</p>
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-primary/10 rounded-lg">
                          <span className="text-sm font-medium text-primary">{account.suggestedPlaybook}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Dismiss
                      </Button>
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Activate Playbook
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No accounts found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
