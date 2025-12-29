import React, { useState } from 'react';
import { 
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentMonth = 11; // December (0-indexed)

const accounts = [
  { 
    name: 'Acme Corporation',
    projections: [10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400],
    collections: [10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, 10400, null],
    variances: [null, null, null, null, null, null, null, null, null, null, null, null]
  },
  { 
    name: 'TechStart Inc',
    projections: [3750, 3750, 3750, 3750, 3750, 3750, 3750, 3750, 3750, 3750, 3750, 3750],
    collections: [3750, 3750, 3750, 3750, 3750, 0, 3750, 3750, 3750, 3750, 3750, null],
    variances: [null, null, null, null, null, { amount: -3750, reason: 'Payment delay due to budget freeze' }, null, null, null, null, null, null]
  },
  { 
    name: 'Global Systems Ltd',
    projections: [7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400],
    collections: [7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400, 7400, 5000, null],
    variances: [null, null, null, null, null, null, null, null, null, null, { amount: -2400, reason: 'Downgrade due to reduced usage' }, null]
  },
  { 
    name: 'Innovate Labs',
    projections: [2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660],
    collections: [2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, 2660, null],
    variances: [null, null, null, null, null, null, null, null, null, null, null, null]
  },
  { 
    name: 'Enterprise Solutions',
    projections: [17500, 17500, 17500, 17500, 17500, 17500, 17500, 17500, 17500, 17500, 17500, 17500],
    collections: [17500, 17500, 17500, 17500, 17500, 17500, 17500, 17500, 19000, 19000, 19000, null],
    variances: [null, null, null, null, null, null, null, null, { amount: 1500, reason: 'Expansion - added 5 seats' }, null, null, null]
  },
  { 
    name: 'DataDrive Co',
    projections: [2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330],
    collections: [2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, 2330, null],
    variances: [null, null, null, null, null, null, null, null, null, null, null, null]
  },
  { 
    name: 'CloudNine Systems',
    projections: [5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580],
    collections: [5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, 5580, null],
    variances: [null, null, null, null, null, null, null, null, null, null, null, null]
  },
  { 
    name: 'Nexus Technologies',
    projections: [13000, 13000, 13000, 13000, 13000, 13000, 13000, 13000, 13000, 13000, 13000, 13000],
    collections: [13000, 13000, 13000, 13000, 13000, 13000, 13000, 13000, 13000, 10000, 10000, null],
    variances: [null, null, null, null, null, null, null, null, null, { amount: -3000, reason: 'Churned 2 business units' }, null, null]
  },
];

const revenueBreakdown = [
  { plan: 'Enterprise', amount: 580000 },
  { plan: 'Professional', amount: 185000 },
  { plan: 'Starter', amount: 67000 },
  { plan: 'Setup Fees', amount: 25000 }
];

const insights = [
  {
    type: 'warning',
    title: 'Q4 forecast deviation',
    summary: 'October-November saw -$5,400 variance',
    details: ['Global Systems Ltd downgrade impact', 'Nexus Technologies partial churn']
  },
  {
    type: 'positive',
    title: 'Expansion revenue captured',
    summary: '+$4,500 from existing accounts',
    details: ['Enterprise Solutions seat expansion in September']
  }
];

const recommendations = [
  {
    title: 'Collection follow-up',
    description: 'TechStart Inc has outstanding June invoice',
    hasPlaybook: false,
    steps: ['Send payment reminder', 'Schedule finance call', 'Offer payment plan if needed']
  }
];

export default function RevenueForecastPage() {
  const [expandedInsights, setExpandedInsights] = useState<number[]>([]);

  const toggleInsight = (index: number) => {
    setExpandedInsights(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
  };

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
  };

  const totalForecast = accounts.reduce((sum, a) => sum + a.projections.reduce((s, p) => s + p, 0), 0);
  const totalCollected = accounts.reduce((sum, a) => sum + a.collections.filter(c => c !== null).reduce((s, c) => s + (c || 0), 0), 0);
  const setupRevenue = 25000;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b border-border bg-card/50">
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Account Canvas</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Revenue, Forecast & Collection</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Revenue, Forecast & Collection</h1>
          <p className="text-muted-foreground mt-1">Yearly projection vs realized revenue</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Scorecard Strip */}
        <div className="flex items-center gap-12 py-4 px-6 bg-card/60 border border-border rounded-xl">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Forecast (Year)</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrencyFull(totalForecast)}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Collection (Till Date)</p>
            <p className="text-2xl font-bold text-accent">{formatCurrencyFull(totalCollected)}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Revenue from Setup Costs</p>
            <p className="text-2xl font-bold text-primary">{formatCurrencyFull(setupRevenue)}</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Revenue by Plan</h3>
          <div className="flex items-center gap-6 py-3 px-6 bg-card/60 border border-border rounded-xl">
            {revenueBreakdown.map((item, idx) => (
              <React.Fragment key={item.plan}>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{item.plan}</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrencyFull(item.amount)}</span>
                </div>
                {idx < revenueBreakdown.length - 1 && <div className="h-4 w-px bg-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Projection vs Collection Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Projection vs Collection</h3>
          <div className="bg-card/60 border border-border rounded-xl overflow-hidden">
            <ScrollArea className="w-full">
              <div className="min-w-[1200px]">
                {/* Header */}
                <div className="grid grid-cols-[200px_repeat(12,1fr)] gap-0 border-b border-border bg-muted/30">
                  <div className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold border-r border-border">Account</div>
                  {months.map((month, idx) => (
                    <div 
                      key={month} 
                      className={cn(
                        'px-3 py-3 text-xs uppercase tracking-wider font-semibold text-center border-r border-border last:border-r-0',
                        idx === currentMonth ? 'bg-primary/5 text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {month}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                <div className="divide-y divide-border">
                  {accounts.map((account, aIdx) => (
                    <div key={aIdx} className="grid grid-cols-[200px_repeat(12,1fr)] gap-0">
                      <div className="px-4 py-3 text-sm font-medium text-foreground border-r border-border flex items-center">
                        {account.name}
                      </div>
                      {months.map((_, mIdx) => {
                        const projection = account.projections[mIdx];
                        const collection = account.collections[mIdx];
                        const variance = account.variances[mIdx];
                        const isFuture = mIdx >= currentMonth;
                        const hasVariance = variance !== null;

                        return (
                          <div 
                            key={mIdx} 
                            className={cn(
                              'px-2 py-3 border-r border-border last:border-r-0 text-center',
                              isFuture ? 'bg-muted/10' : '',
                              mIdx === currentMonth ? 'bg-primary/5' : ''
                            )}
                          >
                            <div className="text-xs text-muted-foreground/70 mb-0.5">
                              {formatCurrency(projection)}
                            </div>
                            {hasVariance ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className={cn(
                                    'text-sm font-semibold cursor-pointer hover:underline',
                                    variance.amount > 0 ? 'text-accent' : 'text-destructive'
                                  )}>
                                    {formatCurrency(collection)}
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      {variance.amount > 0 ? (
                                        <TrendingUp className="w-4 h-4 text-accent" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-destructive" />
                                      )}
                                      <span className={cn(
                                        'text-sm font-semibold',
                                        variance.amount > 0 ? 'text-accent' : 'text-destructive'
                                      )}>
                                        {variance.amount > 0 ? '+' : ''}{formatCurrency(variance.amount)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{variance.reason}</p>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <div className={cn(
                                'text-sm font-medium',
                                isFuture ? 'text-muted-foreground/50' : 'text-foreground'
                              )}>
                                {formatCurrency(collection)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
                      {insight.type === 'warning' && <TrendingDown className="w-4 h-4 text-warning" />}
                      {insight.type === 'positive' && <TrendingUp className="w-4 h-4 text-accent" />}
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
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{rec.title}</p>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                  {rec.steps && (
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
    </div>
  );
}
