import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Accounts', value: '1,284', change: '+12%', trend: 'up', icon: Users },
    { label: 'At Risk', value: '23', change: '-5%', trend: 'down', icon: AlertTriangle },
    { label: 'Expansion Ready', value: '47', change: '+18%', trend: 'up', icon: TrendingUp },
    { label: 'Churn Rate', value: '2.3%', change: '-0.5%', trend: 'down', icon: TrendingDown },
  ];

  const insights = [
    { type: 'warning', title: '3 accounts showing churn signals', description: 'Usage dropped significantly in the last 30 days' },
    { type: 'success', title: 'XYZ Corp ready for expansion', description: 'High engagement and positive sentiment detected' },
    { type: 'info', title: '12 renewals coming up', description: 'Next 30 days - prepare renewal conversations' },
  ];

  const recentActivity = [
    { account: 'Acme Corp', action: 'Support ticket opened', time: '2 hours ago' },
    { account: 'TechStart Inc', action: 'Monthly review completed', time: '4 hours ago' },
    { account: 'Global Solutions', action: 'Feature request submitted', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-background grid-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card/80 backdrop-blur-xl border-r border-border p-4 hidden lg:flex flex-col">
        <ClyntoLogo size="md" className="mb-8" />
        
        <nav className="space-y-1 flex-1">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Users, label: 'Accounts' },
            { icon: BarChart3, label: 'Analytics' },
            { icon: MessageSquare, label: 'Conversations' },
            { icon: Bell, label: 'Alerts' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* AI Assistant Card */}
        <Card variant="gradient" className="mt-auto">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">Larry AI</p>
                <p className="text-xs text-muted-foreground">Your CS Assistant</p>
              </div>
            </div>
            <Button variant="glass" size="sm" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat with Larry
            </Button>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <ClyntoLogo size="sm" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  className="pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium">
                JD
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} variant="glass" className="hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-accent' : 'text-destructive'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* AI Insights */}
            <Card variant="glass" className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Insights
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                      insight.type === 'warning'
                        ? 'bg-warning/5 border-warning/20'
                        : insight.type === 'success'
                        ? 'bg-accent/5 border-accent/20'
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <p className="font-medium mb-1">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                      {activity.account.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{activity.account}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Add Account', icon: Plus },
                  { label: 'Run Health Check', icon: BarChart3 },
                  { label: 'Send Campaign', icon: MessageSquare },
                  { label: 'View Reports', icon: TrendingUp },
                ].map((action) => (
                  <Button key={action.label} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <action.icon className="w-5 h-5" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
