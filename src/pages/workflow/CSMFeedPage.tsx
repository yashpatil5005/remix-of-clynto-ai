import React, { useState } from 'react';
import { 
  Radio, 
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  ArrowUpRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Signal {
  id: string;
  type: 'risk' | 'opportunity' | 'sentiment' | 'usage';
  account: string;
  title: string;
  explanation: string;
  evidence: string[];
  confidence: 'high' | 'medium' | 'low';
  timestamp: string;
  recommendation?: {
    action: string;
    addedToTasks?: boolean;
  };
}

const CSMFeedPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [addedTasks, setAddedTasks] = useState<string[]>([]);

  const signalFilters = [
    { id: 'all', label: 'All Signals', icon: Radio },
    { id: 'risk', label: 'Risk', icon: AlertTriangle },
    { id: 'opportunity', label: 'Opportunity', icon: TrendingUp },
    { id: 'sentiment', label: 'Sentiment', icon: MessageSquare },
    { id: 'usage', label: 'Usage', icon: BarChart3 },
  ];

  const signals: Signal[] = [
    {
      id: '1',
      type: 'risk',
      account: 'Vertex Solutions',
      title: 'Renewal risk detected',
      explanation: 'Multiple negative signals converging ahead of Q1 renewal window.',
      evidence: [
        'NPS dropped from 8 to 6 in last 30 days',
        'Executive sponsor changed to unknown contact',
        'Support tickets increased 40% MoM',
      ],
      confidence: 'high',
      timestamp: '2 hours ago',
      recommendation: {
        action: 'Schedule executive alignment call before end of week',
      },
    },
    {
      id: '2',
      type: 'opportunity',
      account: 'Meridian Technologies',
      title: 'Expansion readiness signal',
      explanation: 'Account showing strong indicators for seat expansion and module add-on.',
      evidence: [
        'Power user count increased 45% in 90 days',
        'Feature adoption rate at 92%',
        'Positive QBR feedback with expansion interest noted',
      ],
      confidence: 'high',
      timestamp: '4 hours ago',
      recommendation: {
        action: 'Prepare expansion proposal with ROI deck for VP of CS',
      },
    },
    {
      id: '3',
      type: 'sentiment',
      account: 'Nexus Global',
      title: 'Sentiment shift detected',
      explanation: 'Communication tone has shifted negatively across recent touchpoints.',
      evidence: [
        'Email response times increased from 2h to 12h average',
        'Last QBR attendance reduced to 2 participants',
        'Feature request marked as "critical" but unaddressed',
      ],
      confidence: 'medium',
      timestamp: '6 hours ago',
      recommendation: {
        action: 'Initiate health check call with account team',
      },
    },
    {
      id: '4',
      type: 'usage',
      account: 'Summit Industries',
      title: 'Usage pattern anomaly',
      explanation: 'Significant drop in daily active users despite stable license count.',
      evidence: [
        'DAU dropped 28% week-over-week',
        'Core feature usage declined across all user segments',
        'No reported technical issues in support queue',
      ],
      confidence: 'medium',
      timestamp: '8 hours ago',
      recommendation: {
        action: 'Deploy re-engagement playbook and schedule product review',
      },
    },
    {
      id: '5',
      type: 'opportunity',
      account: 'Pinnacle Tech',
      title: 'Cross-sell opportunity identified',
      explanation: 'Account usage patterns align with Analytics add-on value proposition.',
      evidence: [
        'Heavy usage of reporting features at capacity',
        'Multiple requests for advanced analytics capabilities',
        'Budget cycle aligns with Q2',
      ],
      confidence: 'medium',
      timestamp: '1 day ago',
    },
  ];

  const getSignalColor = (type: Signal['type']) => {
    switch (type) {
      case 'risk': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'opportunity': return 'text-accent bg-accent/10 border-accent/20';
      case 'sentiment': return 'text-warning bg-warning/10 border-warning/20';
      case 'usage': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-secondary border-border/40';
    }
  };

  const getSignalIcon = (type: Signal['type']) => {
    switch (type) {
      case 'risk': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'sentiment': return MessageSquare;
      case 'usage': return BarChart3;
      default: return Radio;
    }
  };

  const getConfidenceColor = (confidence: Signal['confidence']) => {
    switch (confidence) {
      case 'high': return 'bg-accent/20 text-accent';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddToTasks = (signalId: string) => {
    setAddedTasks([...addedTasks, signalId]);
  };

  const filteredSignals = signals.filter(signal => {
    if (activeFilter === 'all') return true;
    return signal.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
        {/* Page Header */}
        <div className="border-b border-border/40 bg-card/30">
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning to-warning/60 flex items-center justify-center shadow-lg shadow-warning/20">
                    <Radio className="w-5 h-5 text-warning-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">CSM Feed</h1>
                    <p className="text-sm text-muted-foreground">Signals and recommendations requiring attention</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh</span>
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">AI Generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            {signalFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40"
                )}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </button>
            ))}
          </div>

          {/* Signal Feed */}
          <div className="space-y-4">
            {filteredSignals.map((signal) => {
              const SignalIcon = getSignalIcon(signal.type);
              const isAddedToTasks = addedTasks.includes(signal.id);

              return (
                <div 
                  key={signal.id}
                  className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden hover:border-primary/30 transition-all"
                >
                  {/* Signal Header */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Signal Type Badge */}
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          getSignalColor(signal.type).split(' ')[1]
                        )}>
                          <SignalIcon className={cn("w-5 h-5", getSignalColor(signal.type).split(' ')[0])} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">{signal.title}</h3>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                              getConfidenceColor(signal.confidence)
                            )}>
                              {signal.confidence} confidence
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="w-3.5 h-3.5" />
                            <span className="font-medium text-foreground">{signal.account}</span>
                            <span>·</span>
                            <span>{signal.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-sm text-muted-foreground leading-relaxed pl-14">
                      {signal.explanation}
                    </p>

                    {/* Evidence */}
                    <div className="pl-14 space-y-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Evidence</span>
                      <ul className="space-y-1.5">
                        {signal.evidence.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2 shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendation Section */}
                  {signal.recommendation && (
                    <div className="border-t border-border/40 bg-secondary/20 px-6 py-4">
                      <div className="flex items-center justify-between pl-14">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recommended Action</span>
                          <p className="text-sm font-medium text-foreground">{signal.recommendation.action}</p>
                        </div>
                        
                        {isAddedToTasks ? (
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Added to Tasks
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddToTasks(signal.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary text-sm font-medium hover:bg-primary/5 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            Add to Tasks
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredSignals.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Radio className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No signals found</h3>
              <p className="text-sm text-muted-foreground mt-1">No signals match your current filter</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default CSMFeedPage;
