import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  X,
  ArrowRight,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const journeyStages = ['Onboarding', 'Adoption', 'Renewal'];

const accounts = [
  { id: 1, name: 'Acme Corporation', stage: 'Adoption', health: 'Healthy', arr: 125000, renewalDays: 45, size: 'Large' },
  { id: 2, name: 'TechStart Inc', stage: 'Onboarding', health: 'At Risk', arr: 45000, renewalDays: 120, size: 'Mid' },
  { id: 3, name: 'Global Systems Ltd', stage: 'Renewal', health: 'Critical', arr: 89000, renewalDays: 15, size: 'Large' },
  { id: 4, name: 'Innovate Labs', stage: 'Adoption', health: 'Healthy', arr: 32000, renewalDays: 90, size: 'Small' },
  { id: 5, name: 'Enterprise Solutions', stage: 'Adoption', health: 'Healthy', arr: 210000, renewalDays: 180, size: 'Large' },
  { id: 6, name: 'DataDrive Co', stage: 'Onboarding', health: 'Healthy', arr: 28000, renewalDays: 340, size: 'Small' },
  { id: 7, name: 'CloudNine Systems', stage: 'Renewal', health: 'At Risk', arr: 67000, renewalDays: 30, size: 'Mid' },
  { id: 8, name: 'Nexus Technologies', stage: 'Adoption', health: 'At Risk', arr: 156000, renewalDays: 75, size: 'Large' },
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
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<number[]>([]);

  const toggleInsight = (index: number) => {
    setExpandedInsights(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'text-accent';
      case 'At Risk': return 'text-warning';
      case 'Critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
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
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-muted/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <span>Account</span>
            <span>Journey Stage</span>
            <span>Health</span>
            <span className="text-right">ARR</span>
            <span className="text-right">Renewal</span>
          </div>
          <div className="divide-y divide-border">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account)}
                className="w-full grid grid-cols-5 gap-4 px-6 py-4 hover:bg-muted/20 transition-colors text-left group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{account.name}</span>
                <span className="text-muted-foreground">{account.stage}</span>
                <span className={cn('font-medium', getHealthColor(account.health))}>{account.health}</span>
                <span className="text-right font-medium text-foreground">{formatCurrency(account.arr)}</span>
                <span className={cn('text-right', account.renewalDays <= 30 ? 'text-destructive font-medium' : 'text-muted-foreground')}>
                  {account.renewalDays} days
                </span>
              </button>
            ))}
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
        <SheetContent className="w-[80vw] sm:max-w-none p-0 border-l border-border">
          <SheetHeader className="px-8 py-6 border-b border-border bg-card/50">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-xl font-semibold">{selectedAccount?.name}</SheetTitle>
                <p className="text-muted-foreground mt-1">Account Overview</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAccount(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="px-8 py-6 space-y-8">
              {/* Account Info */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-muted/20 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Journey Stage</p>
                  <p className="text-lg font-semibold text-foreground">{selectedAccount?.stage}</p>
                </div>
                <div className="bg-muted/20 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Health</p>
                  <p className={cn('text-lg font-semibold', getHealthColor(selectedAccount?.health || ''))}>{selectedAccount?.health}</p>
                </div>
                <div className="bg-muted/20 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">ARR</p>
                  <p className="text-lg font-semibold text-primary">{formatCurrency(selectedAccount?.arr || 0)}</p>
                </div>
                <div className="bg-muted/20 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Renewal</p>
                  <p className="text-lg font-semibold text-foreground">{selectedAccount?.renewalDays} days</p>
                </div>
              </div>

              {/* Placeholder sections */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact Information</h3>
                <div className="bg-muted/20 rounded-xl p-6">
                  <p className="text-muted-foreground">Contact details and stakeholder information would appear here.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent Activity</h3>
                <div className="bg-muted/20 rounded-xl p-6">
                  <p className="text-muted-foreground">Timeline of account activities and interactions would appear here.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Health Metrics</h3>
                <div className="bg-muted/20 rounded-xl p-6">
                  <p className="text-muted-foreground">Detailed health metrics and trend analysis would appear here.</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
