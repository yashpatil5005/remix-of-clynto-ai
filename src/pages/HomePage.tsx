import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, AlertTriangle, Calendar, ChevronRight, Activity, BarChart3, Zap, History, MessageSquare, Trash2 } from 'lucide-react';
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

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
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

// Mock chat history
const mockChatHistory: ChatHistory[] = [
  { id: '1', title: 'Risk analysis for Q1', timestamp: new Date(Date.now() - 3600000), preview: 'Which accounts are at risk...' },
  { id: '2', title: 'Meridian Technologies review', timestamp: new Date(Date.now() - 86400000), preview: 'Show me details about Meridian...' },
  { id: '3', title: 'Renewal pipeline status', timestamp: new Date(Date.now() - 172800000), preview: 'What renewals are coming up...' },
  { id: '4', title: 'Enterprise sentiment summary', timestamp: new Date(Date.now() - 259200000), preview: 'Summarize sentiment for enterprise...' },
];

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [chatHistory] = useState<ChatHistory[]>(mockChatHistory);
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

    simulateProcessing(assistantMessage.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (text: string) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const hasConversation = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Hero Section - Only shown when no conversation */}
        {!hasConversation && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
            <div className="max-w-2xl w-full space-y-8 animate-fade-in">
              {/* Hero Header */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  AI-Powered Customer Intelligence
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Chat with Larry
                </h1>
                <p className="text-lg text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
                  Your AI-powered customer success assistant
                </p>
              </div>

              {/* Quick Queries */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wider">Quick queries</p>
                <div className="grid grid-cols-2 gap-3">
                  {examplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt.text)}
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

              {/* Chat Input */}
              <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-0 transition-opacity duration-500 ${isFocused ? 'opacity-60' : ''}`} />
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
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
                    <h1 className="text-sm font-semibold">Chat with Larry</h1>
                    <p className="text-xs text-muted-foreground">AI Customer Success Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setMessages([])}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  New Chat
                </button>
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
                    onChange={(e) => setInputValue(e.target.value)}
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

      {/* Right Sidebar - Chat History */}
      <aside className="hidden lg:flex flex-col w-72 border-l border-border/40 bg-card/30">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">History</h3>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear all
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {chatHistory.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left p-3 rounded-xl hover:bg-secondary/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{chat.title}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{chat.preview}</p>
                </div>
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all shrink-0 mt-0.5" />
              </div>
              <p className="text-xs text-muted-foreground/70 mt-2">{formatTimeAgo(chat.timestamp)}</p>
            </button>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-t border-border/40">
          <button 
            onClick={() => setMessages([])}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm font-medium"
          >
            <MessageSquare className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </aside>
    </div>
  );
};

export default HomePage;
