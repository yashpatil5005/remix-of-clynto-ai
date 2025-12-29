import React from 'react';
import { Play, Pause, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const SystemAwarenessStrip: React.FC = () => {
  const workflows = [
    { name: 'Renewal Risk', status: 'active', accounts: 8 },
    { name: 'Onboarding', status: 'active', accounts: 12 },
    { name: 'Expansion', status: 'paused', accounts: 5 },
  ];

  const approvals = [
    { action: 'Send renewal reminder', account: 'Nexus Corp', time: '2h ago' },
    { action: 'Escalate to manager', account: 'Summit Inc', time: '4h ago' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border/40">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Status</h3>
      </div>
      
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Active Workflows */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Workflows</h4>
          <div className="space-y-2">
            {workflows.map((wf, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                {wf.status === 'active' ? (
                  <Play className="w-3 h-3 text-accent" />
                ) : (
                  <Pause className="w-3 h-3 text-warning" />
                )}
                <span className="flex-1 text-foreground">{wf.name}</span>
                <span className="text-xs text-muted-foreground">{wf.accounts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Pending Approvals */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Approvals</h4>
            <span className="text-xs bg-warning/10 text-warning px-1.5 py-0.5 rounded-full">{approvals.length}</span>
          </div>
          <div className="space-y-3">
            {approvals.map((approval, i) => (
              <div key={i} className="text-sm">
                <p className="text-foreground">{approval.action}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{approval.account}</span>
                  <span className="text-xs text-muted-foreground/60">·</span>
                  <span className="text-xs text-muted-foreground/60">{approval.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/40" />

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Actions</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5" />
              <div>
                <p className="text-muted-foreground">Task completed</p>
                <p className="text-xs text-muted-foreground/60">Atlas Corp · 15m ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-3.5 h-3.5 text-warning mt-0.5" />
              <div>
                <p className="text-muted-foreground">Risk detected</p>
                <p className="text-xs text-muted-foreground/60">Prism Ltd · 1h ago</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">Workflow triggered</p>
                <p className="text-xs text-muted-foreground/60">Orbit Inc · 2h ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAwarenessStrip;
