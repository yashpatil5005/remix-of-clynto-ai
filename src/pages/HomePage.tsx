import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, TrendingUp, Users, AlertTriangle, Calendar, ChevronRight, Play, Pause, CheckCircle2, Clock, Activity, BarChart3, Shield, Zap } from 'lucide-react';
import AccountResponse, { AccountData } from '@/components/home/AccountResponse';
import ProcessingState from '@/components/home/ProcessingState';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
  processingSteps?: string[];
  accountData?: AccountData;
}

const examplePrompts = [
  { icon: AlertTriangle, text: "Which accounts are at risk this month?", category: "Risk" },
  { icon: Activity, text: "Show stalled onboarding projects", category: "Adoption" },
  { icon: Calendar, text: "What renewals need my attention?", category: "Renewals" },
  { icon: BarChart3, text: "Summarize sentiment for enterprise accounts", category: "Health" },
];

const processingSteps = [
  "Reviewing account health signals...",
  "Analyzing product usage trends...",
  "Evaluating renewal timelines...",
  "Synthesizing insights...",
];

const mockAccountResponse: AccountData = {
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
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateProcessing = async (messageId: string) => {
    for (let i = 0; i < processingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setMessages(prev => prev.map(m => 
        m.id === messageId 
          ? { ...m, processingSteps: processingSteps.slice(0, i + 1) }
          : m
      ));
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
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

  const hasConversation = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar - System Status */}
      <aside className="hidden xl:flex flex-col w-72 border-r border-border/40 bg-card/30">
        <div className="p-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Clynto AI</h1>
              <p className="text-xs text-muted-foreground">Command Center</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
          {/* Active Workflows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Workflows</h3>
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">3</span>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Renewal Risk', status: 'active', count: 8, color: 'bg-destructive' },
                { name: 'Onboarding', status: 'active', count: 12, color: 'bg-accent' },
                { name: 'Expansion', status: 'paused', count: 5, color: 'bg-warning' },
              ].map((wf, i) => (
                <div 
                  key={i} 
                  className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/40 hover:border-primary/30 hover:bg-secondary/50 transition-all cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${wf.color} ${wf.status === 'active' ? 'animate-pulse' : 'opacity-50'}`} />
                  <span className="flex-1 text-sm font-medium">{wf.name}</span>
                  <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-md">{wf.count}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Approvals</h3>
              <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">2</span>
            </div>
            <div className="space-y-2">
              {[
                { action: 'Send renewal reminder', account: 'Nexus Corp', time: '2h ago' },
                { action: 'Escalate to manager', account: 'Summit Inc', time: '4h ago' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-warning/5 border border-warning/20 hover:border-warning/40 transition-all cursor-pointer">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{item.account}</span>
                    <span className="text-xs text-muted-foreground/50">·</span>
                    <span className="text-xs text-muted-foreground/70">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Portfolio Pulse</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'At Risk', value: '12', color: 'text-destructive', bg: 'bg-destructive/10' },
                { label: 'Renewals', value: '18', color: 'text-warning', bg: 'bg-warning/10' },
                { label: 'Healthy', value: '168', color: 'text-accent', bg: 'bg-accent/10' },
                { label: 'Expansion', value: '24', color: 'text-primary', bg: 'bg-primary/10' },
              ].map((stat, i) => (
                <div key={i} className={`p-3 rounded-xl ${stat.bg} border border-transparent hover:border-border/40 transition-all cursor-pointer`}>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Hero Section - Only shown when no conversation */}
        {!hasConversation && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
            <div className="max-w-2xl w-full space-y-12 animate-fade-in">
              {/* Hero Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  AI-Powered Customer Intelligence
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Clynto AI
                </h1>
                <p className="text-lg text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
                  AI first Customer Success with human first output
                </p>
              </div>

              {/* Input Section */}
              <div className="space-y-6">
                <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-60' : ''}`} />
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsTyping(e.target.value.length > 0);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Ask Larry about accounts, renewals, risk, usage, or tasks..."
                      rows={1}
                      className="w-full resize-none bg-card border border-border/60 rounded-2xl px-6 py-5 pr-16 text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all shadow-lg shadow-black/5"
                      style={{ minHeight: '64px', maxHeight: '160px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={!inputValue.trim()}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:shadow-none"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Prompt Suggestions */}
                {!isTyping && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground text-center">Quick queries</p>
                    <div className="grid grid-cols-2 gap-3">
                      {examplePrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputValue(prompt.text)}
                          className="group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-black/5 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <prompt.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{prompt.text}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{prompt.category}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-8 pt-4">
                {[
                  { icon: Shield, text: 'SOC 2 Compliant' },
                  { icon: Zap, text: 'Real-time Sync' },
                  { icon: Users, text: '248 Accounts' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground/70">
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversation View */}
        {hasConversation && (
          <>
            {/* Compact Header */}
            <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md shadow-primary/20">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold">Clynto AI</h1>
                    <p className="text-xs text-muted-foreground">Larry is assisting</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    3 workflows active
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    2 pending
                  </span>
                </div>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {message.role === 'user' ? (
                      <div className="flex justify-end mb-6">
                        <div className="max-w-xl bg-primary/10 border border-primary/20 rounded-2xl px-5 py-4">
                          <p className="text-sm text-foreground leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {message.isProcessing ? (
                              <ProcessingState steps={message.processingSteps || []} />
                            ) : message.accountData ? (
                              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg shadow-black/5">
                                <AccountResponse data={message.accountData} />
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">{message.content}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Conversation Mode */}
            <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm sticky bottom-0">
              <div className="max-w-4xl mx-auto px-8 py-4">
                <form onSubmit={handleSubmit} className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setIsTyping(e.target.value.length > 0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up question..."
                    rows={1}
                    className="w-full resize-none bg-background border border-border/60 rounded-xl px-5 py-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    style={{ minHeight: '56px', maxHeight: '120px' }}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </footer>
          </>
        )}
      </main>

      {/* Right Sidebar - Contextual Panel */}
      <aside className="hidden lg:flex flex-col w-80 border-l border-border/40 bg-card/30">
        <div className="p-6 border-b border-border/40">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {hasConversation ? 'Account Context' : 'Portfolio Overview'}
          </h3>
        </div>

        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
          {/* Health Distribution */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground">Health Distribution</h4>
            <div className="space-y-3">
              {[
                { label: 'Healthy', percent: 68, color: 'bg-accent' },
                { label: 'Monitor', percent: 22, color: 'bg-warning' },
                { label: 'At Risk', percent: 10, color: 'bg-destructive' },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart Placeholder */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground">Health Trend (90d)</h4>
            <div className="h-24 flex items-end justify-between gap-1 p-3 bg-secondary/30 rounded-xl border border-border/40">
              {[45, 52, 48, 55, 60, 58, 65, 70, 68, 72, 75, 78].map((value, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-primary/30 hover:bg-primary/50 rounded-t transition-all cursor-pointer"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground">This Week</h4>
            <div className="space-y-2">
              {[
                { icon: TrendingUp, text: '+5 accounts improved', color: 'text-accent' },
                { icon: AlertTriangle, text: '2 new risk signals', color: 'text-warning' },
                { icon: Users, text: '42 users onboarded', color: 'text-primary' },
                { icon: Calendar, text: '3 renewals completed', color: 'text-accent' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/40 hover:border-primary/20 transition-all cursor-pointer">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground">Upcoming</h4>
            <div className="space-y-2">
              {[
                { event: 'QBR with Meridian', date: 'Jan 15', type: 'meeting' },
                { event: 'Renewal: Atlas Corp', date: 'Jan 22', type: 'renewal' },
                { event: 'Health Review', date: 'Jan 28', type: 'review' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                  </div>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default HomePage;
