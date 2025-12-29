import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2, ExternalLink, ChevronDown, Play, Pause, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
  processingSteps?: string[];
  accountData?: AccountResponse;
}

interface AccountResponse {
  accountName: string;
  overview: string;
  summary: {
    industry: string;
    primaryUseCase: string;
    accountTier: string;
  };
  engagement: {
    recentActivity: string;
    activityLink: string;
    primaryChannel: string;
    lastContacted: string;
    relationshipOwner: string;
  };
  utilization: {
    period: string;
    overallTrend: string;
    topMetric: string;
    keyFeatures: { name: string; usage: string }[];
    powerUsers: { name: string; role: string; intensity: 'high' | 'medium' | 'low' }[];
  };
  sentiment: {
    status: 'positive' | 'neutral' | 'at-risk';
    evidence: string;
    concerns: string[];
    touchpoints: { type: string; summary: string }[];
  };
  prediction: {
    riskSignals: string[];
    expansionIndicators: string[];
    recommendations: string[];
  };
  renewal: {
    window: string;
    confidence: 'high' | 'medium' | 'low';
    forecast: 'retain' | 'at-risk' | 'expand';
  };
}

const examplePrompts = [
  "Which accounts are at risk this month?",
  "Show stalled onboarding projects.",
  "What renewals need my attention?",
  "Summarize sentiment for my enterprise accounts.",
  "List accounts with declining usage.",
  "Who are my top expansion opportunities?",
];

const processingSteps = [
  "Scanning accounts...",
  "Analyzing engagement patterns...",
  "Reviewing recent communications...",
  "Evaluating sentiment signals...",
  "Generating insights...",
];

const mockAccountResponse: AccountResponse = {
  accountName: "Meridian Technologies",
  overview: "Enterprise account showing strong engagement with emerging expansion signals",
  summary: {
    industry: "Financial Services",
    primaryUseCase: "Customer Success Automation",
    accountTier: "Enterprise",
  },
  engagement: {
    recentActivity: "Product demo completed with expansion team",
    activityLink: "#",
    primaryChannel: "Slack",
    lastContacted: "2 days ago",
    relationshipOwner: "Sarah Chen",
  },
  utilization: {
    period: "Last 90 Days",
    overallTrend: "Increasing (+18%)",
    topMetric: "4,200 active users",
    keyFeatures: [
      { name: "Health Scoring", usage: "92%" },
      { name: "Automated Playbooks", usage: "78%" },
      { name: "Risk Detection", usage: "65%" },
    ],
    powerUsers: [
      { name: "Michael Torres", role: "VP of CS", intensity: "high" },
      { name: "Lisa Park", role: "CS Manager", intensity: "high" },
      { name: "James Wright", role: "CS Analyst", intensity: "medium" },
    ],
  },
  sentiment: {
    status: "positive",
    evidence: "Recent QBR feedback was highly positive. NPS response: 9.",
    concerns: ["Minor feature request pending for 3 weeks"],
    touchpoints: [
      { type: "QBR", summary: "Exceeded ROI expectations, discussing expansion" },
      { type: "Support", summary: "2 tickets resolved within SLA" },
      { type: "Email", summary: "Positive response to product roadmap preview" },
    ],
  },
  prediction: {
    riskSignals: [],
    expansionIndicators: [
      "Active evaluation of additional seats",
      "Interest expressed in Analytics add-on",
      "Budget cycle alignment in Q2",
    ],
    recommendations: [
      "Schedule expansion discovery call with VP of CS",
      "Prepare ROI deck with current usage metrics",
      "Loop in AE for commercial discussion",
    ],
  },
  renewal: {
    window: "April 15, 2025",
    confidence: "high",
    forecast: "expand",
  },
};

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % examplePrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateProcessing = async (messageId: string) => {
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, processingSteps: processingSteps.slice(0, i + 1) }
          : m
      ));
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, isProcessing: false, accountData: mockAccountResponse }
        : m
    ));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isProcessing: true,
      processingSteps: [],
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue('');
    setIsTyping(false);

    simulateProcessing(assistantMessage.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderAccountResponse = (data: AccountResponse) => (
    <div className="space-y-0">
      {/* Header */}
      <div className="pb-4">
        <h3 className="text-lg font-semibold text-foreground">{data.accountName}</h3>
        <p className="text-sm text-muted-foreground mt-1">{data.overview}</p>
      </div>

      <div className="h-px bg-border/60" />

      {/* Account Summary */}
      <div className="py-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Account Summary</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Industry</p>
            <p className="text-sm font-medium">{data.summary.industry}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Primary Use Case</p>
            <p className="text-sm font-medium">{data.summary.primaryUseCase}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Tier</p>
            <p className="text-sm font-medium">{data.summary.accountTier}</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Engagement & Communication */}
      <div className="py-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Engagement & Communication</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recent Activity</span>
            <a href={data.engagement.activityLink} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              {data.engagement.recentActivity}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Primary Channel</span>
            <span className="text-sm font-medium">{data.engagement.primaryChannel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Contacted</span>
            <span className="text-sm font-medium">{data.engagement.lastContacted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Relationship Owner</span>
            <span className="text-sm font-medium">{data.engagement.relationshipOwner}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Product Utilization */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Utilization</h4>
          <span className="text-xs text-muted-foreground">{data.utilization.period}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Overall Trend</p>
            <p className="text-sm font-medium text-accent">{data.utilization.overallTrend}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Top Metric</p>
            <p className="text-sm font-medium">{data.utilization.topMetric}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Key Feature Utilization</p>
          <div className="space-y-2">
            {data.utilization.keyFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">{feature.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: feature.usage }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{feature.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Power Users</p>
          <div className="flex flex-wrap gap-2">
            {data.utilization.powerUsers.map((user, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
                <span className={`w-2 h-2 rounded-full ${
                  user.intensity === 'high' ? 'bg-accent' : 
                  user.intensity === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Sentiment & Relationship Health */}
      <div className="py-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Sentiment & Relationship Health</h4>
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            data.sentiment.status === 'positive' ? 'bg-accent/10 text-accent' :
            data.sentiment.status === 'neutral' ? 'bg-warning/10 text-warning' :
            'bg-destructive/10 text-destructive'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              data.sentiment.status === 'positive' ? 'bg-accent' :
              data.sentiment.status === 'neutral' ? 'bg-warning' :
              'bg-destructive'
            }`} />
            {data.sentiment.status.charAt(0).toUpperCase() + data.sentiment.status.slice(1)}
          </span>
          <span className="text-sm text-muted-foreground">{data.sentiment.evidence}</span>
        </div>
        {data.sentiment.concerns.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Recent Concerns</p>
            <ul className="space-y-1">
              {data.sentiment.concerns.map((concern, idx) => (
                <li key={idx} className="text-sm text-warning">{concern}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Touchpoint Summary</p>
          <div className="space-y-2">
            {data.sentiment.touchpoints.map((tp, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">{tp.type}</span>
                <span className="text-sm">{tp.summary}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Prediction & Recommendations */}
      <div className="py-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Prediction & Recommendations</h4>
        {data.prediction.riskSignals.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-destructive mb-1">Risk Signals</p>
            <ul className="space-y-1">
              {data.prediction.riskSignals.map((signal, idx) => (
                <li key={idx} className="text-sm">{signal}</li>
              ))}
            </ul>
          </div>
        )}
        {data.prediction.expansionIndicators.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-accent mb-1">Expansion Indicators</p>
            <ul className="space-y-1">
              {data.prediction.expansionIndicators.map((indicator, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Recommended Actions</p>
          <ul className="space-y-1.5">
            {data.prediction.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm flex items-center gap-2">
                <span className="text-primary">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Renewal & Forecast */}
      <div className="py-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Renewal & Forecast</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Renewal Window</p>
            <p className="text-sm font-medium">{data.renewal.window}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className={`text-sm font-medium ${
              data.renewal.confidence === 'high' ? 'text-accent' :
              data.renewal.confidence === 'medium' ? 'text-warning' :
              'text-destructive'
            }`}>
              {data.renewal.confidence.charAt(0).toUpperCase() + data.renewal.confidence.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Forecast</p>
            <p className={`text-sm font-medium ${
              data.renewal.forecast === 'expand' ? 'text-accent' :
              data.renewal.forecast === 'retain' ? 'text-foreground' :
              'text-destructive'
            }`}>
              {data.renewal.forecast.charAt(0).toUpperCase() + data.renewal.forecast.slice(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Action Layer */}
      <div className="pt-4">
        <p className="text-xs text-muted-foreground mb-3">Available Actions</p>
        <div className="flex flex-wrap gap-3">
          <button className="text-sm text-primary hover:underline">Create task</button>
          <span className="text-muted-foreground">|</span>
          <button className="text-sm text-primary hover:underline">Add to workflow</button>
          <span className="text-muted-foreground">|</span>
          <button className="text-sm text-primary hover:underline">Run existing playbook</button>
          <span className="text-muted-foreground">|</span>
          <button className="text-sm text-primary hover:underline">Edit plan</button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          This matches your "Expansion Opportunity" workflow. Proceed?
        </p>
      </div>
    </div>
  );

  const renderProcessingState = (steps: string[]) => (
    <div className="space-y-2 py-2">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
          {idx === steps.length - 1 ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
          )}
          <span className={idx === steps.length - 1 ? 'text-foreground' : ''}>{step}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-8 text-center border-b border-border/40">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Clynto AI</h1>
        <p className="text-sm text-muted-foreground mt-1">AI first Customer Success with human first output</p>
      </header>

      {/* Main Conversation Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <div className="space-y-2 mb-12">
              <p className="text-lg text-muted-foreground">Ask anything about your accounts.</p>
              <p className="text-sm text-muted-foreground/70">
                Risk, adoption, renewals, sentiment, tasks, workflows.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`${message.role === 'user' ? 'flex justify-end' : ''}`}>
                {message.role === 'user' ? (
                  <div className="max-w-lg bg-secondary/50 rounded-2xl px-5 py-3">
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className="w-full">
                    {message.isProcessing ? (
                      renderProcessingState(message.processingSteps || [])
                    ) : message.accountData ? (
                      renderAccountResponse(message.accountData)
                    ) : (
                      <p className="text-sm text-muted-foreground">{message.content}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="border-t border-border/40 bg-background">
        <div className="max-w-3xl w-full mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder=""
              rows={1}
              className="w-full resize-none bg-secondary/30 border border-border/60 rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>

          {/* Example Prompts */}
          {!isTyping && messages.length === 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {examplePrompts.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(prompt)}
                  className={`text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all ${
                    idx === currentPromptIndex % 4 ? 'border-primary/30 text-foreground' : ''
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Workflow awareness hint */}
          {messages.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                3 active workflows
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                2 pending approvals
              </span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
