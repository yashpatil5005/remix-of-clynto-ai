import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Edit, 
  Plus,
  DollarSign,
  TrendingUp,
  User,
  Clock,
  ChevronDown,
  ChevronRight,
  Folder
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Account {
  id: number;
  name: string;
  logo?: string;
  stage: string;
  health: 'Healthy' | 'At Risk' | 'Critical';
  healthScore: number;
  arr: number;
  renewalDate: string;
  renewalDays: number;
  size: string;
  csat: number;
  nps: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  status: 'At Risk' | 'Healthy' | 'Stable';
  csm: {
    name: string;
    avatar?: string;
    email: string;
  };
  plan: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
  industry: 'SaaS' | 'Fintech' | 'Education' | 'Healthcare' | 'Others';
  region: 'APAC' | 'EMEA' | 'North America';
}

interface AccountDetailDrawerProps {
  account: Account | null;
  open: boolean;
  onClose: () => void;
}

const overviewChartData = [
  { month: 'Sep', value: 5 },
  { month: 'Oct', value: 12 },
  { month: 'Nov', value: 8 },
  { month: 'Dec', value: 18 },
  { month: 'Jan', value: 15 },
  { month: 'Feb', value: 22 },
];

const engagementChartData = [
  { month: 'Sep', value: 50 },
  { month: 'Oct', value: 65 },
  { month: 'Nov', value: 78 },
  { month: 'Dec', value: 95 },
  { month: 'Jan', value: 82 },
  { month: 'Feb', value: 70 },
];

const teamMembers = [
  { name: 'Jane Doe', role: 'Customer Success Manager', initials: 'J', color: 'bg-primary' },
  { name: 'Jennifer Lee', role: 'Account Executive', initials: 'JL', color: 'bg-accent' },
  { name: 'Tom Harrison', role: 'Solutions Architect', initials: 'TH', color: 'bg-muted-foreground' },
];

const activities = [
  { text: 'CSM meeting completed', date: 'Feb 10, 2025' },
  { text: 'Support ticket resolved', date: 'Feb 8, 2025' },
  { text: 'Feature usage increased 25%', date: 'Feb 5, 2025' },
  { text: 'Quarterly Business Review scheduled', date: 'Feb 1, 2025' },
];

const healthMetrics = [
  { label: 'Product Adoption', score: 85 },
  { label: 'Engagement', score: 92 },
  { label: 'Support Health', score: 78 },
  { label: 'Financial Health', score: 95 },
];

const usageMetrics = [
  { label: 'MAU', value: '0' },
  { label: 'Login Frequency', value: '0' },
  { label: 'Feature Adoption', value: '0%' },
  { label: 'NPS Score', value: 'N/A' },
  { label: 'Open Tickets', value: '0' },
  { label: 'CSAT Score', value: 'N/A' },
];

export function AccountDetailDrawer({ account, open, onClose }: AccountDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [assetsExpanded, setAssetsExpanded] = useState(false);

  if (!account) return null;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-accent/10 text-accent border-accent/20';
      case 'At Risk': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Stable': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'text-accent';
      case 'At Risk': return 'text-warning';
      case 'Critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[80vw] sm:max-w-none p-0 border-l border-border bg-background">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Avatar + Title + Status + Score */}
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={account.logo} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {account.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">{account.name}</h2>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full border font-medium',
                  account.health === 'Critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                  getStatusBadgeClass(account.status)
                )}>
                  {account.health === 'Critical' ? 'critical' : account.status.toLowerCase()}
                </span>
                <span className="text-sm text-muted-foreground">
                  Score: {account.healthScore}
                </span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <Calendar className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Plus className="w-4 h-4 mr-2" />
                Asset
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="h-auto p-0 bg-transparent border-b-0 gap-6">
              {['Overview', 'Health', 'Activity', 'Team'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className={cn(
                    'pb-3 px-0 rounded-none border-b-2 border-transparent bg-transparent',
                    'data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent',
                    'data-[state=inactive]:text-muted-foreground hover:text-foreground',
                    'transition-all duration-200'
                  )}
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Chart Section */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={overviewChartData}>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          domain={[0, 25]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Account Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="Industry" value={account.industry} />
                    <DetailRow label="Segment" value={account.size} />
                    <DetailRow label="Region" value={account.region} />
                    <DetailRow label="Contract Type" value="Annual" />
                    <DetailRow label="Renewal Date" value={formatDate(account.renewalDate)} />
                    <DetailRow label="Active Users" value="0 / 0" />
                    <DetailRow label="Primary Contact" value="Sarah John" />
                  </div>
                </div>

                {/* Assets Expandable Section */}
                <button
                  onClick={() => setAssetsExpanded(!assetsExpanded)}
                  className="flex items-center gap-3 w-full py-3 text-left hover:bg-muted/20 rounded-lg px-2 transition-colors"
                >
                  <Folder className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Assets</span>
                  {assetsExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  )}
                </button>
                {assetsExpanded && (
                  <div className="pl-10 py-2 text-sm text-muted-foreground">
                    No assets uploaded yet.
                  </div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard icon={<DollarSign className="w-5 h-5" />} label="ARR" value={`$${account.arr.toLocaleString()}`} />
                  <MetricCard icon={<TrendingUp className="w-5 h-5" />} label="Engagement" value="35%" />
                  <MetricCard icon={<User className="w-5 h-5" />} label="CSM Owner" value={account.csm.name} />
                  <MetricCard icon={<Clock className="w-5 h-5" />} label="Last Activity" value="2 days ago" />
                </div>

                {/* Engagement Trend Chart */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Engagement Trend (6 Months)</h3>
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementChartData}>
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            domain={[0, 100]}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full" size="lg">
                  View Full Account Details
                </Button>
              </>
            )}

            {/* Health Tab */}
            {activeTab === 'health' && (
              <>
                {/* Health Score Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Health Score Details</h3>
                  <div className="space-y-5">
                    {healthMetrics.map((metric) => (
                      <div key={metric.label} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-foreground w-40">{metric.label}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                        <span className="text-base font-bold text-foreground w-10 text-right">{metric.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Metrics */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Usage Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {usageMetrics.map((metric) => (
                      <div key={metric.label} className="bg-card border border-border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                        <p className="text-lg font-bold text-foreground">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full" size="lg">
                  View Full Account Details
                </Button>
              </>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
                  <div className="space-y-4">
                    {activities.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full" size="lg">
                  View Full Account Details
                </Button>
              </>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <>
                {/* Account Team */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Account Team</h3>
                  <div className="space-y-3">
                    {teamMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 hover:bg-muted/20 rounded-lg px-2 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarFallback className={cn(member.color, 'text-white text-sm font-medium')}>
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Contact */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Primary Contact</h3>
                  <div className="space-y-3">
                    <DetailRow label="Name" value="Sarah John" />
                    <DetailRow label="Role" value="CTO" />
                    <DetailRow 
                      label="Email" 
                      value={
                        <a href="mailto:sarah@ac-2.com" className="text-primary hover:underline">
                          sarah@ac-2.com
                        </a>
                      } 
                    />
                    <DetailRow label="Phone" value="N/A" />
                  </div>
                </div>

                {/* CTA Button */}
                <Button className="w-full" size="lg">
                  View Full Account Details
                </Button>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-lg font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
