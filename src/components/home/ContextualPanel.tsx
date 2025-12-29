import React from 'react';
import { TrendingUp, TrendingDown, Users, AlertCircle, Calendar, Activity } from 'lucide-react';

interface ContextualPanelProps {
  hasActiveConversation: boolean;
}

const ContextualPanel: React.FC<ContextualPanelProps> = ({ hasActiveConversation }) => {
  if (!hasActiveConversation) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-border/40">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Portfolio Overview</h3>
        </div>
        
        <div className="flex-1 p-6 space-y-6">
          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Accounts</span>
              <span className="text-sm font-semibold">248</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">At Risk</span>
              <span className="text-sm font-semibold text-destructive">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Renewals (30d)</span>
              <span className="text-sm font-semibold text-warning">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expansion Ready</span>
              <span className="text-sm font-semibold text-accent">24</span>
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Health Distribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Health Distribution</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '68%' }} />
                </div>
                <span className="text-xs text-muted-foreground w-16">Healthy 68%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '22%' }} />
                </div>
                <span className="text-xs text-muted-foreground w-16">At Risk 22%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: '10%' }} />
                </div>
                <span className="text-xs text-muted-foreground w-16">Critical 10%</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/40" />

          {/* Recent Trends */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">This Week</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-3.5 h-3.5 text-accent" />
                <span className="text-muted-foreground">+5 accounts improved</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                <span className="text-muted-foreground">-2 accounts declined</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">42 new users onboarded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border/40">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Context</h3>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Account Health Trend */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Health Trend (90d)</h4>
          <div className="h-20 flex items-end justify-between gap-1">
            {[65, 68, 72, 70, 75, 78, 82, 85, 88, 86, 89, 92].map((value, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/40"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Usage Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Usage Snapshot</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="text-lg font-semibold">4.2k</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="text-lg font-semibold text-accent">+18%</p>
              <p className="text-xs text-muted-foreground">vs Last Month</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Related Accounts */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Similar Accounts</h4>
          <div className="space-y-2">
            {['Apex Corp', 'Stellar Inc', 'Quantum Ltd'].map((name, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className={`text-xs ${i === 0 ? 'text-accent' : i === 1 ? 'text-warning' : 'text-accent'}`}>
                  {i === 0 ? 'Healthy' : i === 1 ? 'At Risk' : 'Healthy'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Upcoming Events */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Upcoming</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">QBR Scheduled</p>
                <p className="text-xs text-muted-foreground">Jan 15, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Activity className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Usage Review</p>
                <p className="text-xs text-muted-foreground">Jan 22, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualPanel;
