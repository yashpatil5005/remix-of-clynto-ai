import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  X,
  Heart,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const accounts = [
  { id: 1, name: 'Acme Corporation', score: 85, change: '+5', status: 'Healthy', factors: ['High utilization', 'Positive sentiment', 'Regular engagement'] },
  { id: 2, name: 'TechStart Inc', score: 45, change: '-12', status: 'At Risk', factors: ['Usage decline', 'Delayed responses', 'Open tickets'] },
  { id: 3, name: 'Global Systems Ltd', score: 28, change: '-8', status: 'Critical', factors: ['No logins 14 days', 'Champion left', 'Payment overdue'] },
  { id: 4, name: 'Innovate Labs', score: 78, change: '+2', status: 'Healthy', factors: ['Growing team', 'Feature adoption', 'Positive feedback'] },
  { id: 5, name: 'Enterprise Solutions', score: 92, change: '+1', status: 'Healthy', factors: ['Power users', 'High NPS', 'Expansion interest'] },
  { id: 6, name: 'DataDrive Co', score: 72, change: '0', status: 'Healthy', factors: ['Stable usage', 'Neutral sentiment'] },
  { id: 7, name: 'CloudNine Systems', score: 52, change: '-6', status: 'At Risk', factors: ['Decreasing logins', 'Support escalations'] },
  { id: 8, name: 'Nexus Technologies', score: 58, change: '-3', status: 'At Risk', factors: ['Low feature adoption', 'Infrequent engagement'] },
];

const healthIntelligence = [
  'Portfolio health score declined 3% this month, primarily driven by 3 accounts in renewal window',
  'Predictive model identifies 2 additional accounts at risk of downgrade in next 60 days',
  'Sentiment analysis shows correlation between ticket response time and health score changes'
];

const insights = [
  {
    type: 'drop',
    title: 'Significant health drops',
    summary: '2 accounts dropped more than 10 points',
    details: ['TechStart Inc: -12 points (usage decline primary driver)', 'Global Systems Ltd: -8 points (champion departure impact)']
  },
  {
    type: 'critical',
    title: 'Critical status explanation',
    summary: '1 account requires immediate attention',
    details: ['Global Systems Ltd scoring logic: No product activity (40%), Negative sentiment (30%), Payment risk (30%)']
  }
];

const recommendations = [
  {
    title: 'Critical Recovery Intervention',
    description: 'Immediate executive outreach for critical accounts',
    hasPlaybook: true
  },
  {
    title: 'At-Risk Monitoring',
    description: 'Enhanced tracking for declining accounts',
    hasPlaybook: false,
    steps: ['Set up daily health alerts', 'Schedule weekly check-ins', 'Prepare retention offers']
  }
];

export default function HealthPage() {
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[0] | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<number[]>([]);

  const toggleInsight = (index: number) => {
    setExpandedInsights(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy': return <Heart className="w-4 h-4 text-accent" />;
      case 'At Risk': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'Critical': return <AlertOctagon className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getChangeIcon = (change: string) => {
    if (change.startsWith('+')) return <TrendingUp className="w-3.5 h-3.5 text-accent" />;
    if (change.startsWith('-')) return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-accent';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const healthyCount = accounts.filter(a => a.status === 'Healthy').length;
  const atRiskCount = accounts.filter(a => a.status === 'At Risk').length;
  const criticalCount = accounts.filter(a => a.status === 'Critical').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b border-border bg-card/50">
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Heart className="w-4 h-4" />
            <span>Account Canvas</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Health</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Health</h1>
          <p className="text-muted-foreground mt-1">Predictive account health and risk intelligence</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Health Score Strip */}
        <div className="flex items-center gap-8 py-4 px-6 bg-card/60 border border-border rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Healthy</p>
              <p className="text-2xl font-bold text-accent">{healthyCount}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">At Risk</p>
              <p className="text-2xl font-bold text-warning">{atRiskCount}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Critical</p>
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
            </div>
          </div>
        </div>

        {/* Health Intelligence */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Health Intelligence</h3>
          <div className="bg-card/60 border border-border rounded-xl p-5">
            <ul className="space-y-3">
              {healthIntelligence.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Health Table */}
        <div className="bg-card/60 border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-muted/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <span>Account</span>
            <span className="text-center">Health Score</span>
            <span className="text-center">Change</span>
            <span>Status</span>
            <span>Primary Factors</span>
          </div>
          <div className="divide-y divide-border">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account)}
                className="w-full grid grid-cols-5 gap-4 px-6 py-4 hover:bg-muted/20 transition-colors text-left group"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{account.name}</span>
                <div className="flex items-center justify-center">
                  <span className={cn('text-lg font-bold', getScoreColor(account.score))}>{account.score}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  {getChangeIcon(account.change)}
                  <span className={cn(
                    'text-sm font-medium',
                    account.change.startsWith('+') ? 'text-accent' : account.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'
                  )}>{account.change}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(account.status)}
                  <span className="text-muted-foreground">{account.status}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {account.factors.slice(0, 2).map((factor, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 bg-muted/50 rounded-full text-muted-foreground">{factor}</span>
                  ))}
                  {account.factors.length > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-muted/50 rounded-full text-muted-foreground">+{account.factors.length - 2}</span>
                  )}
                </div>
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
                      {insight.type === 'drop' && <TrendingDown className="w-4 h-4 text-destructive" />}
                      {insight.type === 'critical' && <AlertOctagon className="w-4 h-4 text-destructive" />}
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
                        {insight.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-1.5 shrink-0" />
                            {detail}
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
                <p className="text-muted-foreground mt-1">Health Details</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedAccount(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="px-8 py-6 space-y-8">
              {/* Health Overview */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-muted/20 rounded-xl p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Health Score</p>
                  <p className={cn('text-3xl font-bold', getScoreColor(selectedAccount?.score || 0))}>{selectedAccount?.score}</p>
                </div>
                <div className="bg-muted/20 rounded-xl p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Trend</p>
                  <div className="flex items-center justify-center gap-2">
                    {getChangeIcon(selectedAccount?.change || '0')}
                    <p className="text-xl font-semibold text-foreground">{selectedAccount?.change}</p>
                  </div>
                </div>
                <div className="bg-muted/20 rounded-xl p-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Status</p>
                  <div className="flex items-center justify-center gap-2">
                    {getStatusIcon(selectedAccount?.status || '')}
                    <p className="text-lg font-semibold text-foreground">{selectedAccount?.status}</p>
                  </div>
                </div>
              </div>

              {/* Factors */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contributing Factors</h3>
                <div className="bg-muted/20 rounded-xl p-6">
                  <ul className="space-y-3">
                    {selectedAccount?.factors.map((factor, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-foreground">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Health History</h3>
                <div className="bg-muted/20 rounded-xl p-6">
                  <p className="text-muted-foreground">Health score trend and historical data would appear here.</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
