import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import ContextualPanel from '@/components/home/ContextualPanel';
import SystemAwarenessStrip from '@/components/home/SystemAwarenessStrip';
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
  "Which accounts are at risk this month?",
  "Show stalled onboarding projects.",
  "What renewals need my attention?",
  "Summarize sentiment for my enterprise accounts.",
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Header */}
      <header className="py-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Clynto AI</h1>
        <p className="text-base text-muted-foreground mt-2 font-light">
          AI first Customer Success with human first output
        </p>
      </header>

      {/* Main Three-Zone Layout */}
      <main className="flex-1 flex max-w-[1600px] w-full mx-auto px-6">
        {/* Left: System Awareness Strip */}
        <aside className="hidden xl:block w-64 shrink-0 border-r border-border/40">
          <SystemAwarenessStrip />
        </aside>

        {/* Center: Conversation Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {!hasConversation ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="space-y-3 mb-16 max-w-lg">
                  <p className="text-lg text-muted-foreground">
                    Ask anything about your accounts.
                  </p>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">
                    Risk, adoption, renewals, sentiment, tasks, workflows. Larry understands your entire portfolio.
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === 'user' ? (
                      <div className="flex justify-end mb-6">
                        <div className="max-w-xl bg-secondary/40 border border-border/40 rounded-xl px-5 py-3">
                          <p className="text-sm text-foreground">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        {message.isProcessing ? (
                          <ProcessingState steps={message.processingSteps || []} />
                        ) : message.accountData ? (
                          <AccountResponse data={message.accountData} />
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
          </div>

          {/* Input Area */}
          <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto px-8 py-5">
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsTyping(e.target.value.length > 0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Larry about accounts, renewals, risk, usage, or tasks..."
                  rows={1}
                  className="w-full resize-none bg-secondary/30 border border-border/50 rounded-xl px-5 py-4 pr-14 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  style={{ minHeight: '56px', maxHeight: '140px' }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </form>

              {/* Example Prompts */}
              {!isTyping && !hasConversation && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {examplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputValue(prompt)}
                      className="text-xs px-4 py-2 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/30 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Workflow awareness hint */}
              {hasConversation && (
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    3 active workflows
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                    2 pending approvals
                  </span>
                </div>
              )}
            </div>
          </footer>
        </div>

        {/* Right: Contextual Panel */}
        <aside className="hidden lg:block w-72 shrink-0 border-l border-border/40">
          <ContextualPanel hasActiveConversation={hasConversation} />
        </aside>
      </main>
    </div>
  );
};

export default HomePage;
