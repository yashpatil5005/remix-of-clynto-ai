import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  X,
  ArrowRight,
  Building2,
  Lightbulb,
  AlertTriangle,
  User,
  Smile,
  Meh,
  Frown,
  Globe,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const journeyStages = ['Onboarding', 'Adoption', 'Renewal'];

interface Account {
  id: number;
  name: string;
  logo?: string;
  stage: string;
  health: 'Healthy' | 'At Risk' | 'Critical';
  healthScore: number;
  arr: number;
  renewalDate: string;
  renewalDays: number;
  size: string;
  csat: number;
  nps: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  status: 'At Risk' | 'Healthy' | 'Stable';
  csm: {
    name: string;
    avatar?: string;
    email: string;
  };
  plan: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
  industry: 'SaaS' | 'Fintech' | 'Education' | 'Healthcare' | 'Others';
  region: 'APAC' | 'EMEA' | 'North America';
}

const accounts: Account[] = [
  { 
    id: 1, 
    name: 'Acme Corporation', 
    stage: 'Adoption', 
    health: 'Healthy', 
    healthScore: 85,
    arr: 125000, 
    renewalDate: '2025-02-15',
    renewalDays: 45, 
    size: 'Large',
    csat: 4.5,
    nps: 72,
    sentiment: 'Positive',
    status: 'Healthy',
    csm: { name: 'Sarah Chen', email: 'sarah.chen@clynto.com' },
    plan: 'Enterprise',
    industry: 'SaaS',
    region: 'North America'
  },
  { 
    id: 2, 
    name: 'TechStart Inc', 
    stage: 'Onboarding', 
    health: 'At Risk', 
    healthScore: 45,
    arr: 45000, 
    renewalDate: '2025-05-20',
    renewalDays: 120, 
    size: 'Mid',
    csat: 3.2,
    nps: 15,
    sentiment: 'Neutral',
    status: 'At Risk',
    csm: { name: 'Michael Park', email: 'michael.park@clynto.com' },
    plan: 'Premium',
    industry: 'Fintech',
    region: 'APAC'
  },
  { 
    id: 3, 
    name: 'Global Systems Ltd', 
    stage: 'Renewal', 
    health: 'Critical', 
    healthScore: 28,
    arr: 89000, 
    renewalDate: '2025-01-14',
    renewalDays: 15, 
    size: 'Large',
    csat: 2.8,
    nps: -12,
    sentiment: 'Negative',
    status: 'At Risk',
    csm: { name: 'Emily Watson', email: 'emily.watson@clynto.com' },
    plan: 'Enterprise',
    industry: 'Healthcare',
    region: 'EMEA'
  },
  { 
    id: 4, 
    name: 'Innovate Labs', 
    stage: 'Adoption', 
    health: 'Healthy', 
    healthScore: 78,
    arr: 32000, 
    renewalDate: '2025-03-28',
    renewalDays: 90, 
    size: 'Small',
    csat: 4.2,
    nps: 58,
    sentiment: 'Positive',
    status: 'Stable',
    csm: { name: 'Sarah Chen', email: 'sarah.chen@clynto.com' },
    plan: 'Basic',
    industry: 'Education',
    region: 'North America'
  },
  { 
    id: 5, 
    name: 'Enterprise Solutions', 
    stage: 'Adoption', 
    health: 'Healthy', 
    healthScore: 92,
    arr: 210000, 
    renewalDate: '2025-07-15',
    renewalDays: 180, 
    size: 'Large',
    csat: 4.8,
    nps: 85,
    sentiment: 'Positive',
    status: 'Healthy',
    csm: { name: 'James Rodriguez', email: 'james.rodriguez@clynto.com' },
    plan: 'Enterprise',
    industry: 'SaaS',
    region: 'North America'
  },
  { 
    id: 6, 
    name: 'DataDrive Co', 
    stage: 'Onboarding', 
    health: 'Healthy', 
    healthScore: 68,
    arr: 28000, 
    renewalDate: '2025-12-05',
    renewalDays: 340, 
    size: 'Small',
    csat: 4.0,
    nps: 42,
    sentiment: 'Neutral',
    status: 'Stable',
    csm: { name: 'Michael Park', email: 'michael.park@clynto.com' },
    plan: 'Premium',
    industry: 'Fintech',
    region: 'APAC'
  },
  { 
    id: 7, 
    name: 'CloudNine Systems', 
    stage: 'Renewal', 
    health: 'At Risk', 
    healthScore: 52,
    arr: 67000, 
    renewalDate: '2025-01-29',
    renewalDays: 30, 
    size: 'Mid',
    csat: 3.5,
    nps: 22,
    sentiment: 'Neutral',
    status: 'At Risk',
    csm: { name: 'Emily Watson', email: 'emily.watson@clynto.com' },
    plan: 'Premium',
    industry: 'Others',
    region: 'EMEA'
  },
  { 
    id: 8, 
    name: 'Nexus Technologies', 
    stage: 'Adoption', 
    health: 'At Risk', 
    healthScore: 48,
    arr: 156000, 
    renewalDate: '2025-03-14',
    renewalDays: 75, 
    size: 'Large',
    csat: 3.3,
    nps: 18,
    sentiment: 'Negative',
    status: 'At Risk',
    csm: { name: 'James Rodriguez', email: 'james.rodriguez@clynto.com' },
    plan: 'Enterprise',
    industry: 'SaaS',
    region: 'North America'
  },
];

const insights = [
  {
    type: 'risk',
    title: 'Health drop detected',
    summary: '3 accounts showing declining engagement',
    reasons: ['Utilization dropped 40% in last 30 days', 'No product logins for 2 weeks', 'Negative sentiment in recent tickets']
  },
  {
    type: 'opportunity',
    title: 'Expansion signals identified',
    summary: '2 accounts showing upsell potential',
    reasons: ['Usage consistently at 90%+ capacity', 'New team members added', 'Inquiry about premium features']
  },
  {
    type: 'warning',
    title: 'Renewal risk flagged',
    summary: '1 account with high churn probability',
    reasons: ['Low engagement score', 'Pending support tickets unresolved', 'Champion recently left company']
  }
];

const recommendations = [
  {
    title: 'At-Risk Recovery Playbook',
    description: 'Structured intervention for declining accounts',
    hasPlaybook: true
  },
  {
    title: 'Expansion Outreach',
    description: 'Proactive engagement for high-usage accounts',
    hasPlaybook: false,
    steps: ['Schedule business review', 'Prepare usage analysis', 'Draft expansion proposal']
  }
];

export default function AllAccountsPage() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<number[]>([]);

  const toggleInsight = (index: number) => {
    setExpandedInsights(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'text-accent';
      case 'At Risk': return 'text-warning';
      case 'Critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthBarColor = (score: number) => {
    if (score >= 70) return 'bg-accent';
    if (score >= 40) return 'bg-warning';
    return 'bg-destructive';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <Smile className="w-4 h-4 text-accent" />;
      case 'Neutral': return <Meh className="w-4 h-4 text-warning" />;
      case 'Negative': return <Frown className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-accent/10 text-accent border-accent/20';
      case 'At Risk': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Stable': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPlanBadgeClass = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'bg-primary/10 text-primary';
      case 'Premium': return 'bg-accent/10 text-accent';
      case 'Basic': return 'bg-muted text-muted-foreground';
      case 'Free': return 'bg-muted/50 text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getNPSColor = (nps: number) => {
    if (nps >= 50) return 'text-accent';
    if (nps >= 0) return 'text-warning';
    return 'text-destructive';
  };

  const totalAccounts = accounts.length;
  const totalARR = accounts.reduce((sum, a) => sum + a.arr, 0);
  const smallAccounts = accounts.filter(a => a.size === 'Small').length;
  const midAccounts = accounts.filter(a => a.size === 'Mid').length;
  const largeAccounts = accounts.filter(a => a.size === 'Large').length;
  const smallARR = accounts.filter(a => a.size === 'Small').reduce((sum, a) => sum + a.arr, 0);
  const midARR = accounts.filter(a => a.size === 'Mid').reduce((sum, a) => sum + a.arr, 0);
  const largeARR = accounts.filter(a => a.size === 'Large').reduce((sum, a) => sum + a.arr, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b border-border bg-card/50">
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Building2 className="w-4 h-4" />
            <span>Account Canvas</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">All Accounts</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">All Accounts</h1>
          <p className="text-muted-foreground mt-1">Portfolio view across the customer lifecycle</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Scorecard Strip */}
        <div className="flex items-center justify-between py-4 px-6 bg-card/60 border border-border rounded-xl">
          <div className="flex items-center gap-12">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Accounts</p>
              <p className="text-2xl font-bold text-foreground">{totalAccounts}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Small</p>
                <p className="text-lg font-semibold text-foreground">{smallAccounts}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Mid</p>
                <p className="text-lg font-semibold text-foreground">{midAccounts}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Large</p>
                <p className="text-lg font-semibold text-foreground">{largeAccounts}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total ARR</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalARR)}</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Small ARR</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(smallARR)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Mid ARR</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(midARR)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Large ARR</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(largeARR)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Overview */}
        <div className="flex items-center gap-2">
          {journeyStages.map((stage, idx) => {
            const count = accounts.filter(a => a.stage === stage).length;
            return (
              <React.Fragment key={stage}>
                <div className="flex items-center gap-3 px-5 py-3 bg-card/60 border border-border rounded-lg">
                  <span className="text-sm font-medium text-foreground">{stage}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{count}</span>
                </div>
                {idx < journeyStages.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Journey View Table */}
        <div className="bg-card/60 border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[1fr_120px_140px_100px_100px_140px] gap-4 px-6 py-3 bg-muted/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <span>Account</span>
                <span>Health Score</span>
                <span className="text-right">ARR</span>
                <span className="text-right">Renewal</span>
                <span>Status</span>
                <span>CSM</span>
              </div>
              <div className="divide-y divide-border">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className="w-full grid grid-cols-[1fr_120px_140px_100px_100px_140px] gap-4 px-6 py-4 hover:bg-muted/20 transition-all duration-200 text-left group"
                  >
                    {/* Account Name with Logo */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarImage src={account.logo} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {account.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{account.name}</span>
                    </div>
                    
                    {/* Health Score with Bar */}
                    <div className="flex items-center gap-2">
                      <span className={cn('font-semibold text-sm', getHealthColor(account.health))}>{account.healthScore}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[60px]">
                        <div 
                          className={cn('h-full rounded-full transition-all', getHealthBarColor(account.healthScore))}
                          style={{ width: `${account.healthScore}%` }}
                        />
                      </div>
                    </div>

                    {/* ARR */}
                    <span className="text-right font-medium text-foreground">{formatCurrency(account.arr)}</span>
                    
                    {/* Renewal */}
                    <span className={cn('text-right text-sm', account.renewalDays <= 30 ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                      {account.renewalDays}d
                    </span>

                    {/* Status */}
                    <div>
                      <span className={cn('text-xs px-2 py-1 rounded-full border font-medium', getStatusBadgeClass(account.status))}>
                        {account.status}
                      </span>
                    </div>

                    {/* CSM */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-border">
                        <AvatarImage src={account.csm.avatar} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
                          {account.csm.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground truncate">{account.csm.name.split(' ')[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights & Recommendations */}
        <div className="grid grid-cols-2 gap-6">
          {/* Insights */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Insights</h3>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className="bg-card/60 border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleInsight(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {insight.type === 'risk' && <TrendingDown className="w-4 h-4 text-destructive" />}
                      {insight.type === 'opportunity' && <TrendingUp className="w-4 h-4 text-accent" />}
                      {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
                      <div className="text-left">
                        <p className="font-medium text-foreground">{insight.title}</p>
                        <p className="text-sm text-muted-foreground">{insight.summary}</p>
                      </div>
                    </div>
                    {expandedInsights.includes(idx) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {expandedInsights.includes(idx) && (
                    <div className="px-5 pb-4 pt-0 border-t border-border bg-muted/10">
                      <ul className="space-y-2 mt-3">
                        {insight.reasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5 shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-card/60 border border-border rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{rec.title}</p>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                    {rec.hasPlaybook ? (
                      <Button size="sm" variant="outline" className="shrink-0">
                        Add to Workflow
                      </Button>
                    ) : null}
                  </div>
                  {!rec.hasPlaybook && rec.steps && (
                    <div className="mt-4 pl-7">
                      <div className="space-y-2">
                        {rec.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">{sIdx + 1}</span>
                              <span className="text-muted-foreground">{step}</span>
                            </div>
                            <Button size="sm" variant="ghost" className="text-xs h-7">
                              Add to Task
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Detail Sheet */}
      <Sheet open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <SheetContent className="w-[80vw] sm:max-w-none p-0 border-l border-border bg-background">
          <SheetHeader className="px-8 py-6 border-b border-border bg-gradient-to-r from-card/80 to-card/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-border shadow-lg">
                  <AvatarImage src={selectedAccount?.logo} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {selectedAccount?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle className="text-xl font-semibold text-foreground">{selectedAccount?.name}</SheetTitle>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', getStatusBadgeClass(selectedAccount?.status || ''))}>
                      {selectedAccount?.status}
                    </span>
                    <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', getPlanBadgeClass(selectedAccount?.plan || ''))}>
                      {selectedAccount?.plan}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAccount(null)} className="hover:bg-muted">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>
          
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="px-8 py-6 space-y-8">
              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-4 gap-4">
                {/* Health Score */}
                <div className="bg-gradient-to-br from-card to-card/60 border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Health Score</p>
                  <div className="flex items-end gap-3">
                    <p className={cn('text-3xl font-bold', getHealthColor(selectedAccount?.health || ''))}>{selectedAccount?.healthScore}</p>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                      <div 
                        className={cn('h-full rounded-full transition-all', getHealthBarColor(selectedAccount?.healthScore || 0))}
                        style={{ width: `${selectedAccount?.healthScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* ARR */}
                <div className="bg-gradient-to-br from-card to-card/60 border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">ARR</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(selectedAccount?.arr || 0)}</p>
                </div>

                {/* Renewal Date */}
                <div className="bg-gradient-to-br from-card to-card/60 border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Renewal Date</p>
                  <p className="text-lg font-semibold text-foreground">{formatDate(selectedAccount?.renewalDate || '')}</p>
                  <p className={cn('text-sm', (selectedAccount?.renewalDays || 0) <= 30 ? 'text-destructive' : 'text-muted-foreground')}>
                    {selectedAccount?.renewalDays} days remaining
                  </p>
                </div>

                {/* Manager / CSM */}
                <div className="bg-gradient-to-br from-card to-card/60 border border-border rounded-xl p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Assigned CSM</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={selectedAccount?.csm.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {selectedAccount?.csm.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{selectedAccount?.csm.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedAccount?.csm.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {/* CSAT */}
                <div className="bg-card/60 border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">CSAT Score</p>
                    <Smile className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{selectedAccount?.csat.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">/ 5.0</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${((selectedAccount?.csat || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* NPS */}
                <div className="bg-card/60 border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">NPS</p>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-2xl font-bold', getNPSColor(selectedAccount?.nps || 0))}>{selectedAccount?.nps}</span>
                    <span className="text-xs text-muted-foreground">
                      {(selectedAccount?.nps || 0) >= 50 ? 'Promoter' : (selectedAccount?.nps || 0) >= 0 ? 'Passive' : 'Detractor'}
                    </span>
                  </div>
                </div>

                {/* Sentiment */}
                <div className="bg-card/60 border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Sentiment</p>
                    {getSentimentIcon(selectedAccount?.sentiment || '')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-lg font-semibold',
                      selectedAccount?.sentiment === 'Positive' ? 'text-accent' :
                      selectedAccount?.sentiment === 'Negative' ? 'text-destructive' : 'text-warning'
                    )}>
                      {selectedAccount?.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">AI-driven tone analysis</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Account Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Industry */}
                  <div className="bg-card/60 border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Industry</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{selectedAccount?.industry}</p>
                  </div>

                  {/* Region */}
                  <div className="bg-card/60 border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Region</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{selectedAccount?.region}</p>
                  </div>

                  {/* Plan */}
                  <div className="bg-card/60 border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Plan</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-foreground">{selectedAccount?.plan}</p>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', getPlanBadgeClass(selectedAccount?.plan || ''))}>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact Information</h3>
                <div className="bg-card/60 border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Primary Contact</p>
                      <p className="text-sm text-muted-foreground">Contact details would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent Activity</h3>
                <div className="bg-card/60 border border-border rounded-xl p-6">
                  <p className="text-muted-foreground">Timeline of account activities and interactions would appear here.</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
