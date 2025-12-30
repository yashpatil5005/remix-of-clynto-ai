import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Building2,
  Target,
  TrendingUp,
  ArrowRight,
  Calendar,
  DollarSign,
  Users,
  Activity,
  Mail,
  Phone,
  Globe,
  FileText,
  BarChart3,
  Clock,
  MessageSquare,
  Zap,
  Plus,
  Lightbulb,
  Send
} from 'lucide-react';

interface PlaybookRecommendation {
  id: string;
  name: string;
  matchScore: number;
  reasons: string[];
  phases: number;
  avgDuration: string;
  isRecommended?: boolean;
}

interface AccountDetails {
  id: string;
  name: string;
  segment: string;
  arr: string;
  source: 'CRM' | 'Bulk Upload' | 'Manual';
  daysSinceCreation: number;
  suggestedStage: string;
  industry?: string;
  employees?: string;
  website?: string;
  primaryContact?: {
    name: string;
    email: string;
    role: string;
  };
  healthScore?: number;
  lastActivity?: string;
  openTickets?: number;
  npsScore?: number;
  contractValue?: string;
  renewalDate?: string;
  usageMetrics?: {
    activeUsers: number;
    totalUsers: number;
    loginFrequency: string;
  };
}

interface AssignPlaybookPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  segment: string;
  arr: string;
  accountId?: string;
  onAssign: (playbookId: string) => void;
}

const AssignPlaybookPanel: React.FC<AssignPlaybookPanelProps> = ({
  isOpen,
  onClose,
  accountName,
  segment,
  arr,
  onAssign,
}) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<string>('enterprise-onboarding');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'custom'>('recommended');

  // Extended account details (would come from API in real implementation)
  const accountDetails: AccountDetails = {
    id: '1',
    name: accountName,
    segment: segment,
    arr: arr,
    source: 'CRM',
    daysSinceCreation: 3,
    suggestedStage: 'Onboarding',
    industry: 'Technology',
    employees: '500-1000',
    website: 'www.example.com',
    primaryContact: {
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      role: 'VP of Operations',
    },
    healthScore: 85,
    lastActivity: '2 hours ago',
    openTickets: 0,
    npsScore: 8,
    contractValue: arr,
    renewalDate: 'Dec 15, 2025',
    usageMetrics: {
      activeUsers: 0,
      totalUsers: 25,
      loginFrequency: 'New Account',
    },
  };

  const recommendations: PlaybookRecommendation[] = [
    {
      id: 'enterprise-onboarding',
      name: 'Enterprise Onboarding',
      matchScore: 94,
      reasons: [
        'Enterprise segment match',
        'ARR above $100K threshold',
        'Industry vertical: Technology',
        'High-touch implementation required',
      ],
      phases: 7,
      avgDuration: '45 days',
      isRecommended: true,
    },
    {
      id: 'standard-onboarding',
      name: 'Standard Onboarding',
      matchScore: 72,
      reasons: [
        'General purpose workflow',
        'Faster time-to-value',
        'Suitable for mid-market deals',
      ],
      phases: 5,
      avgDuration: '30 days',
    },
    {
      id: 'tech-fast-track',
      name: 'Tech Fast-Track',
      matchScore: 68,
      reasons: [
        'Technology industry match',
        'Accelerated implementation',
        'API-first approach',
      ],
      phases: 4,
      avgDuration: '21 days',
    },
    {
      id: 'white-glove',
      name: 'White Glove Premium',
      matchScore: 88,
      reasons: [
        'High ARR justifies premium service',
        'Executive stakeholder engagement',
        'Custom success metrics',
      ],
      phases: 8,
      avgDuration: '60 days',
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel - Full width like workflow visualization */}
      <div 
        className="fixed top-0 right-0 w-[85%] max-w-[1400px] h-full bg-background border-l border-border shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInFromRight 0.3s ease-out forwards' }}
      >
        {/* Header */}
        <div className="border-b border-border/60 px-8 py-5 shrink-0 bg-gradient-to-b from-card/80 to-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{accountName}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                  <span>{segment}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span>{arr}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-warning">{accountDetails.daysSinceCreation} days awaiting</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Column - Account Information */}
          <div className="w-[380px] border-r border-border/40 overflow-y-auto bg-secondary/10">
            <div className="p-6 space-y-6">
              {/* Account Overview */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account Overview</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Contract Value
                    </div>
                    <p className="text-sm font-semibold">{accountDetails.contractValue}</p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Renewal Date
                    </div>
                    <p className="text-sm font-semibold">{accountDetails.renewalDate}</p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Activity className="w-3.5 h-3.5" />
                      Health Score
                    </div>
                    <p className="text-sm font-semibold text-accent">{accountDetails.healthScore}%</p>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-card/60 border border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Users className="w-3.5 h-3.5" />
                      License Seats
                    </div>
                    <p className="text-sm font-semibold">{accountDetails.usageMetrics?.totalUsers}</p>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Company Details</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-all">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Industry</p>
                      <p className="text-sm font-medium">{accountDetails.industry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-all">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Company Size</p>
                      <p className="text-sm font-medium">{accountDetails.employees} employees</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-all">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Website</p>
                      <p className="text-sm font-medium">{accountDetails.website}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-all">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Source</p>
                      <p className="text-sm font-medium">{accountDetails.source}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Contact */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Primary Contact</h3>
                
                <div className="p-4 rounded-xl bg-card/60 border border-border/40">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {accountDetails.primaryContact?.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{accountDetails.primaryContact?.name}</p>
                      <p className="text-xs text-muted-foreground">{accountDetails.primaryContact?.role}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      {accountDetails.primaryContact?.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Activity Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/60 border border-border/40">
                    <span className="text-sm text-muted-foreground">Last Activity</span>
                    <span className="text-sm font-medium">{accountDetails.lastActivity}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/60 border border-border/40">
                    <span className="text-sm text-muted-foreground">Open Tickets</span>
                    <span className="text-sm font-medium">{accountDetails.openTickets}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-card/60 border border-border/40">
                    <span className="text-sm text-muted-foreground">NPS Score</span>
                    <span className={cn(
                      "text-sm font-medium",
                      (accountDetails.npsScore || 0) >= 9 ? "text-accent" :
                      (accountDetails.npsScore || 0) >= 7 ? "text-primary" :
                      "text-warning"
                    )}>{accountDetails.npsScore}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Playbook Selection */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* AI Recommendation Banner */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground mb-1">Larry's Recommendation</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Based on <span className="text-foreground font-medium">{accountName}</span>'s enterprise segment, 
                    <span className="text-foreground font-medium"> {arr}</span> ARR, and technology industry classification, 
                    I recommend the <span className="font-semibold text-primary">Enterprise Onboarding</span> playbook. 
                    This playbook has a <span className="font-medium text-accent">92% success rate</span> for similar accounts.
                  </p>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/40 border border-border/40 w-fit">
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === 'recommended' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Recommended
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === 'all' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Playbooks
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-all",
                    activeTab === 'custom' 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Create with Larry
                </button>
              </div>

              {/* Playbook Options */}
              {(activeTab === 'recommended' || activeTab === 'all') && (
                <div className="grid grid-cols-2 gap-4">
                  {recommendations
                    .filter(p => activeTab === 'all' || p.matchScore >= 70)
                    .map((playbook) => (
                    <div
                      key={playbook.id}
                      onClick={() => setSelectedPlaybook(playbook.id)}
                      className={cn(
                        "relative p-5 rounded-xl border cursor-pointer transition-all",
                        selectedPlaybook === playbook.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border/60 hover:border-border hover:bg-secondary/20"
                      )}
                    >
                      {playbook.isRecommended && (
                        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground">
                          TOP MATCH
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                            selectedPlaybook === playbook.id
                              ? "border-primary bg-primary"
                              : "border-border"
                          )}>
                            {selectedPlaybook === playbook.id && (
                              <Check className="w-3.5 h-3.5 text-primary-foreground" />
                            )}
                          </div>
                          <span className="font-semibold">{playbook.name}</span>
                        </div>
                        <div className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-semibold tabular-nums",
                          playbook.matchScore >= 90
                            ? "bg-accent/15 text-accent"
                            : playbook.matchScore >= 70
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-muted-foreground"
                        )}>
                          {playbook.matchScore}%
                        </div>
                      </div>

                      <div className="ml-9 space-y-4">
                        <div className="flex items-center gap-5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5" />
                            {playbook.phases} phases
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {playbook.avgDuration}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {playbook.reasons.slice(0, 3).map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <ChevronRight className="w-3 h-3 text-accent shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Playbook Creation with Larry */}
              {activeTab === 'custom' && (
                <div className="space-y-5">
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/40">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Create a Custom Playbook with Larry</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Describe your specific requirements, goals, or constraints for this account. 
                          Larry will generate a tailored playbook based on your input and the account's characteristics.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="E.g., 'This account has a tight 30-day implementation deadline. Focus on API integrations first, then user training. They have a technical team so we can skip basic onboarding steps...'"
                        className="w-full h-32 px-4 py-3 rounded-xl bg-background border border-border/60 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Zap className="w-3.5 h-3.5" />
                          Larry will analyze your requirements and generate phases, tasks, and timelines
                        </div>
                        <button
                          disabled={!customPrompt.trim()}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            customPrompt.trim()
                              ? "bg-accent text-accent-foreground hover:bg-accent/90"
                              : "bg-secondary text-muted-foreground cursor-not-allowed"
                          )}
                        >
                          <Send className="w-4 h-4" />
                          Generate Playbook
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Templates */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Quick Templates</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Fast-track implementation (under 30 days)',
                        'Technical-first approach with API focus',
                        'Executive stakeholder engagement priority',
                        'Self-serve with minimal touchpoints',
                      ].map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCustomPrompt(template)}
                          className="p-3 rounded-lg border border-border/40 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-border transition-all"
                        >
                          <Plus className="w-3.5 h-3.5 inline-block mr-2" />
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 px-8 py-4 shrink-0 flex items-center justify-between bg-card/30">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {selectedPlaybook && activeTab !== 'custom' && (
              <>
                <Check className="w-4 h-4 text-accent" />
                <span>
                  Selected: <span className="font-medium text-foreground">
                    {recommendations.find(p => p.id === selectedPlaybook)?.name}
                  </span>
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onAssign(selectedPlaybook)}
              disabled={activeTab === 'custom' && !customPrompt.trim()}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm",
                (activeTab !== 'custom' || customPrompt.trim())
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              )}
            >
              {activeTab === 'custom' ? 'Create & Assign' : 'Assign & Start'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default AssignPlaybookPanel;
