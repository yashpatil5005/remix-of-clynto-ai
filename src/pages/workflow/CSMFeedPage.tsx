import React, { useState } from 'react';
import { 
  ChevronRight,
  Plus,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Eye,
  ListTodo,
  Workflow,
  Circle,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SignalType = 'risk' | 'opportunity' | 'sentiment' | 'usage';
type SignalState = 'new' | 'acknowledged' | 'actioned';
type ImpactLevel = 'high' | 'medium' | 'informational';

interface Signal {
  id: string;
  type: SignalType;
  state: SignalState;
  account: string;
  insight: string;
  evidence: {
    metric: string;
    direction: 'up' | 'down' | 'neutral';
    comparison: string;
  }[];
  impact: ImpactLevel;
  timestamp: string;
  recommendation?: {
    action: string;
    rationale: string;
  };
  systemNote?: string;
}

const CSMFeedPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | SignalType | 'actioned' | 'unactioned'>('all');
  const [impactFilter, setImpactFilter] = useState<'all' | ImpactLevel>('all');
  const [actionedSignals, setActionedSignals] = useState<Record<string, 'tasks' | 'workflow'>>({});
  const [acknowledgedSignals, setAcknowledgedSignals] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const signals: Signal[] = [
    {
      id: '1',
      type: 'risk',
      state: 'new',
      account: 'Vertex Solutions',
      insight: 'Renewal risk elevated. Executive sponsor departed and NPS declined 25% in the last 30 days.',
      evidence: [
        { metric: 'NPS Score', direction: 'down', comparison: '8 → 6 (last 30d)' },
        { metric: 'Sponsor Status', direction: 'down', comparison: 'Departed on Dec 15' },
        { metric: 'Support Tickets', direction: 'up', comparison: '+40% MoM' },
      ],
      impact: 'high',
      timestamp: '2 hours ago',
      recommendation: {
        action: 'Run Renewal Risk playbook',
        rationale: 'Immediate executive re-alignment needed before Q1 renewal window',
      },
      systemNote: 'Detected based on CRM changes and support data patterns',
    },
    {
      id: '2',
      type: 'opportunity',
      state: 'new',
      account: 'Meridian Technologies',
      insight: 'Expansion readiness confirmed. Power user growth and feature adoption indicate seat expansion opportunity.',
      evidence: [
        { metric: 'Power Users', direction: 'up', comparison: '+45% in 90 days' },
        { metric: 'Feature Adoption', direction: 'up', comparison: '92% of available features' },
        { metric: 'QBR Sentiment', direction: 'up', comparison: 'Expansion interest noted' },
      ],
      impact: 'high',
      timestamp: '4 hours ago',
      recommendation: {
        action: 'Prepare expansion proposal',
        rationale: 'Account primed for upsell conversation with VP of CS',
      },
      systemNote: 'Detected based on usage trends and recent QBR notes',
    },
    {
      id: '3',
      type: 'sentiment',
      state: 'acknowledged',
      account: 'Nexus Global',
      insight: 'Communication sentiment shifted negative. Response latency increased and meeting attendance dropped.',
      evidence: [
        { metric: 'Response Time', direction: 'down', comparison: '2h → 12h avg' },
        { metric: 'QBR Attendance', direction: 'down', comparison: '5 → 2 participants' },
        { metric: 'Feature Request', direction: 'neutral', comparison: 'Marked critical, unaddressed' },
      ],
      impact: 'medium',
      timestamp: '6 hours ago',
      recommendation: {
        action: 'Initiate health check conversation',
        rationale: 'Early intervention can prevent escalation',
      },
    },
    {
      id: '4',
      type: 'usage',
      state: 'new',
      account: 'Summit Industries',
      insight: 'Product usage dropped 28% week-over-week across all user segments despite stable license count.',
      evidence: [
        { metric: 'Daily Active Users', direction: 'down', comparison: '-28% WoW' },
        { metric: 'Core Feature Usage', direction: 'down', comparison: 'Declined across segments' },
        { metric: 'Support Tickets', direction: 'neutral', comparison: 'No reported issues' },
      ],
      impact: 'medium',
      timestamp: '8 hours ago',
      recommendation: {
        action: 'Deploy re-engagement playbook',
        rationale: 'Usage decline without support issues suggests adoption gap',
      },
      systemNote: 'Detected based on product analytics patterns',
    },
    {
      id: '5',
      type: 'opportunity',
      state: 'new',
      account: 'Pinnacle Tech',
      insight: 'Cross-sell signal detected. Heavy reporting usage at capacity with multiple analytics requests.',
      evidence: [
        { metric: 'Reporting Usage', direction: 'up', comparison: 'At 95% capacity' },
        { metric: 'Analytics Requests', direction: 'up', comparison: '3 requests in 60 days' },
        { metric: 'Budget Cycle', direction: 'neutral', comparison: 'Aligns with Q2' },
      ],
      impact: 'informational',
      timestamp: '1 day ago',
    },
    {
      id: '6',
      type: 'risk',
      state: 'actioned',
      account: 'Orion Systems',
      insight: 'Contract value at risk. Pricing concerns raised during last touchpoint with procurement.',
      evidence: [
        { metric: 'Contract Value', direction: 'neutral', comparison: '$240K ARR' },
        { metric: 'Procurement Contact', direction: 'down', comparison: 'Raised pricing concerns' },
        { metric: 'Competitor Mentions', direction: 'up', comparison: '2 mentions in calls' },
      ],
      impact: 'high',
      timestamp: '2 days ago',
      recommendation: {
        action: 'Prepare value realization deck',
        rationale: 'Demonstrate ROI before competitor evaluation deepens',
      },
    },
  ];

  const typeFilters: { id: 'all' | SignalType; label: string }[] = [
    { id: 'all', label: 'All Signals' },
    { id: 'risk', label: 'Risk' },
    { id: 'opportunity', label: 'Opportunity' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'usage', label: 'Usage' },
  ];

  const getSignalState = (signal: Signal): SignalState => {
    if (actionedSignals[signal.id]) return 'actioned';
    if (acknowledgedSignals.includes(signal.id)) return 'acknowledged';
    return signal.state;
  };

  const getTypeStyles = (type: SignalType) => {
    const styles = {
      risk: {
        border: 'border-l-destructive',
        label: 'text-destructive',
        bg: 'bg-destructive/5',
      },
      opportunity: {
        border: 'border-l-accent',
        label: 'text-accent',
        bg: 'bg-accent/5',
      },
      sentiment: {
        border: 'border-l-warning',
        label: 'text-warning',
        bg: 'bg-warning/5',
      },
      usage: {
        border: 'border-l-primary',
        label: 'text-primary',
        bg: 'bg-primary/5',
      },
    };
    return styles[type];
  };

  const getImpactStyles = (impact: ImpactLevel) => {
    const styles = {
      high: 'font-semibold text-foreground',
      medium: 'font-medium text-foreground/80',
      informational: 'font-normal text-muted-foreground',
    };
    return styles[impact];
  };

  const getDirectionIndicator = (direction: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') return '↑';
    if (direction === 'down') return '↓';
    return '→';
  };

  const handleAcknowledge = (signalId: string) => {
    if (!acknowledgedSignals.includes(signalId)) {
      setAcknowledgedSignals([...acknowledgedSignals, signalId]);
    }
  };

  const handleAction = (signalId: string, actionType: 'tasks' | 'workflow') => {
    setActionedSignals({ ...actionedSignals, [signalId]: actionType });
  };

  const filteredSignals = signals.filter(signal => {
    const state = getSignalState(signal);
    
    // Type filter
    if (activeFilter !== 'all' && activeFilter !== 'actioned' && activeFilter !== 'unactioned') {
      if (signal.type !== activeFilter) return false;
    }
    
    // Action state filter
    if (activeFilter === 'actioned' && state !== 'actioned') return false;
    if (activeFilter === 'unactioned' && state === 'actioned') return false;
    
    // Impact filter
    if (impactFilter !== 'all' && signal.impact !== impactFilter) return false;
    
    return true;
  });

  // Group signals by type for visual organization
  const groupedByType = filteredSignals.reduce((acc, signal) => {
    if (!acc[signal.type]) acc[signal.type] = [];
    acc[signal.type].push(signal);
    return acc;
  }, {} as Record<SignalType, Signal[]>);

  const typeOrder: SignalType[] = ['risk', 'opportunity', 'sentiment', 'usage'];
  const typeLabels: Record<SignalType, string> = {
    risk: 'Risk Signals',
    opportunity: 'Opportunity Signals',
    sentiment: 'Sentiment Signals',
    usage: 'Usage Signals',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">CSM Feed</h1>
            <p className="text-sm text-muted-foreground">
              Signals and recommendations requiring attention
              <span className="mx-2 text-border">·</span>
              <span className="text-muted-foreground/70">Live intelligence stream</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-border/40 bg-card/20">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Type Filters */}
            <div className="flex items-center gap-1">
              {typeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    activeFilter === filter.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Additional Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFilter(activeFilter === 'unactioned' ? 'all' : 'unactioned')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeFilter === 'unactioned'
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                Unactioned
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    showFilters || impactFilter !== 'all'
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  Impact
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showFilters && "rotate-180")} />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px] z-20">
                    {(['all', 'high', 'medium', 'informational'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setImpactFilter(level);
                          setShowFilters(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm transition-colors",
                          impactFilter === level
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                      >
                        {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Feed */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {activeFilter === 'all' || activeFilter === 'actioned' || activeFilter === 'unactioned' ? (
          // Grouped view
          <div className="space-y-10">
            {typeOrder.map((type) => {
              const typeSignals = groupedByType[type];
              if (!typeSignals || typeSignals.length === 0) return null;

              return (
                <section key={type} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className={cn("text-sm font-semibold uppercase tracking-wider", getTypeStyles(type).label)}>
                      {typeLabels[type]}
                    </h2>
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                      {typeSignals.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {typeSignals.map((signal, index) => (
                      <SignalBlock
                        key={signal.id}
                        signal={signal}
                        state={getSignalState(signal)}
                        actionType={actionedSignals[signal.id]}
                        typeStyles={getTypeStyles(signal.type)}
                        impactStyles={getImpactStyles(signal.impact)}
                        getDirectionIndicator={getDirectionIndicator}
                        onAcknowledge={handleAcknowledge}
                        onAction={handleAction}
                        animationDelay={index * 50}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Filtered by single type
          <div className="space-y-3">
            {filteredSignals.map((signal, index) => (
              <SignalBlock
                key={signal.id}
                signal={signal}
                state={getSignalState(signal)}
                actionType={actionedSignals[signal.id]}
                typeStyles={getTypeStyles(signal.type)}
                impactStyles={getImpactStyles(signal.impact)}
                getDirectionIndicator={getDirectionIndicator}
                onAcknowledge={handleAcknowledge}
                onAction={handleAction}
                animationDelay={index * 50}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredSignals.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No signals match your current filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface SignalBlockProps {
  signal: Signal;
  state: SignalState;
  actionType?: 'tasks' | 'workflow';
  typeStyles: { border: string; label: string; bg: string };
  impactStyles: string;
  getDirectionIndicator: (direction: 'up' | 'down' | 'neutral') => string;
  onAcknowledge: (id: string) => void;
  onAction: (id: string, type: 'tasks' | 'workflow') => void;
  animationDelay: number;
}

const SignalBlock: React.FC<SignalBlockProps> = ({
  signal,
  state,
  actionType,
  typeStyles,
  impactStyles,
  getDirectionIndicator,
  onAcknowledge,
  onAction,
  animationDelay,
}) => {
  const isActioned = state === 'actioned';
  const isNew = state === 'new';

  return (
    <div
      className={cn(
        "border-l-4 rounded-lg border border-border/40 bg-card/50 overflow-hidden transition-all duration-300",
        typeStyles.border,
        isActioned && "opacity-60",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      onMouseEnter={() => isNew && onAcknowledge(signal.id)}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            {/* Account & Type */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-foreground">{signal.account}</span>
              </div>
              <span className={cn("text-xs font-medium uppercase tracking-wider", typeStyles.label)}>
                {signal.type}
              </span>
              {isNew && (
                <span className="flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-primary text-primary" />
                  <span className="text-xs text-primary font-medium">New</span>
                </span>
              )}
            </div>
            
            {/* Timestamp */}
            <p className="text-xs text-muted-foreground">{signal.timestamp}</p>
          </div>
          
          {/* Impact Indicator */}
          <div className={cn("text-xs uppercase tracking-wider", impactStyles)}>
            {signal.impact === 'high' && 'High Impact'}
            {signal.impact === 'medium' && 'Medium'}
            {signal.impact === 'informational' && 'Info'}
          </div>
        </div>

        {/* Insight */}
        <p className={cn("text-sm leading-relaxed", impactStyles)}>
          {signal.insight}
        </p>

        {/* Evidence Strip */}
        <div className={cn("rounded-md p-3 space-y-2", typeStyles.bg)}>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Evidence</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {signal.evidence.map((item, idx) => (
              <div key={idx} className="text-xs">
                <span className="text-muted-foreground">{item.metric}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={cn(
                    "font-medium",
                    item.direction === 'up' && "text-accent",
                    item.direction === 'down' && "text-destructive",
                    item.direction === 'neutral' && "text-foreground"
                  )}>
                    {getDirectionIndicator(item.direction)}
                  </span>
                  <span className="text-foreground/80">{item.comparison}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Note */}
        {signal.systemNote && (
          <p className="text-xs text-muted-foreground/70 italic">
            {signal.systemNote}
          </p>
        )}
      </div>

      {/* Recommendation & Actions */}
      {signal.recommendation && (
        <div className="border-t border-border/40 bg-secondary/30 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium text-foreground">
                {signal.recommendation.action}
              </p>
              <p className="text-xs text-muted-foreground">
                {signal.recommendation.rationale}
              </p>
            </div>

            {isActioned ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/10 text-accent text-sm font-medium shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                {actionType === 'tasks' ? 'Added to Tasks' : 'Added to Workflow'}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onAction(signal.id, 'tasks')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  <ListTodo className="w-3.5 h-3.5" />
                  Add to Tasks
                </button>
                <button
                  onClick={() => onAction(signal.id, 'workflow')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  <Workflow className="w-3.5 h-3.5" />
                  Add to Workflow
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  View Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CSMFeedPage;
