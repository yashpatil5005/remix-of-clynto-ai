import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface AccountData {
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

interface AccountResponseProps {
  data: AccountData;
}

const AccountResponse: React.FC<AccountResponseProps> = ({ data }) => {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="pb-5">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">{data.accountName}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{data.overview}</p>
      </div>

      <div className="h-px bg-border/50" />

      {/* Account Summary */}
      <div className="py-5">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Account Summary</h4>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Industry</p>
            <p className="text-sm font-medium text-foreground">{data.summary.industry}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Primary Use Case</p>
            <p className="text-sm font-medium text-foreground">{data.summary.primaryUseCase}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Tier</p>
            <p className="text-sm font-medium text-foreground">{data.summary.accountTier}</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Engagement & Communication */}
      <div className="py-5">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Engagement & Communication</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recent Activity</span>
            <a href={data.engagement.activityLink} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
              {data.engagement.recentActivity}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Primary Channel</span>
            <span className="text-sm font-medium text-foreground">{data.engagement.primaryChannel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Contacted</span>
            <span className="text-sm font-medium text-foreground">{data.engagement.lastContacted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Relationship Owner</span>
            <span className="text-sm font-medium text-foreground">{data.engagement.relationshipOwner}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Product Utilization */}
      <div className="py-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Utilization</h4>
          <span className="text-xs text-muted-foreground">{data.utilization.period}</span>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Overall Trend</p>
            <p className="text-sm font-medium text-accent">{data.utilization.overallTrend}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Top Metric</p>
            <p className="text-sm font-medium text-foreground">{data.utilization.topMetric}</p>
          </div>
        </div>
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-3">Key Feature Utilization</p>
          <div className="space-y-2.5">
            {data.utilization.keyFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{feature.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-28 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
                      style={{ width: feature.usage }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">{feature.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-3">Power Users</p>
          <div className="flex flex-wrap gap-2">
            {data.utilization.powerUsers.map((user, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 px-3 py-2 bg-secondary/40 rounded-lg border border-border/40">
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
                <span className={`w-2 h-2 rounded-full ${
                  user.intensity === 'high' ? 'bg-accent' : 
                  user.intensity === 'medium' ? 'bg-warning' : 'bg-muted-foreground/50'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Sentiment & Relationship Health */}
      <div className="py-5">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Sentiment & Relationship Health</h4>
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            data.sentiment.status === 'positive' ? 'bg-accent/10 text-accent border border-accent/20' :
            data.sentiment.status === 'neutral' ? 'bg-warning/10 text-warning border border-warning/20' :
            'bg-destructive/10 text-destructive border border-destructive/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              data.sentiment.status === 'positive' ? 'bg-accent' :
              data.sentiment.status === 'neutral' ? 'bg-warning' :
              'bg-destructive'
            }`} />
            {data.sentiment.status.charAt(0).toUpperCase() + data.sentiment.status.slice(1).replace('-', ' ')}
          </span>
          <span className="text-sm text-muted-foreground">{data.sentiment.evidence}</span>
        </div>
        {data.sentiment.concerns.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Recent Concerns</p>
            <ul className="space-y-1.5">
              {data.sentiment.concerns.map((concern, idx) => (
                <li key={idx} className="text-sm text-warning flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-warning" />
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Touchpoint Summary</p>
          <div className="space-y-2.5">
            {data.sentiment.touchpoints.map((tp, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-xs font-medium text-muted-foreground w-16 shrink-0 pt-0.5">{tp.type}</span>
                <span className="text-sm text-foreground">{tp.summary}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Prediction & Recommendations */}
      <div className="py-5">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Prediction & Recommendations</h4>
        {data.prediction.riskSignals.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-destructive font-medium mb-2">Risk Signals</p>
            <ul className="space-y-1.5">
              {data.prediction.riskSignals.map((signal, idx) => (
                <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-destructive" />
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.prediction.expansionIndicators.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-accent font-medium mb-2">Expansion Indicators</p>
            <ul className="space-y-1.5">
              {data.prediction.expansionIndicators.map((indicator, idx) => (
                <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Recommended Actions</p>
          <ul className="space-y-2">
            {data.prediction.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary font-medium mt-0.5">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Renewal & Forecast */}
      <div className="py-5">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Renewal & Forecast</h4>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Renewal Window</p>
            <p className="text-sm font-medium text-foreground">{data.renewal.window}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <p className={`text-sm font-medium ${
              data.renewal.confidence === 'high' ? 'text-accent' :
              data.renewal.confidence === 'medium' ? 'text-warning' :
              'text-destructive'
            }`}>
              {data.renewal.confidence.charAt(0).toUpperCase() + data.renewal.confidence.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Forecast</p>
            <p className={`text-sm font-medium ${
              data.renewal.forecast === 'expand' ? 'text-accent' :
              data.renewal.forecast === 'retain' ? 'text-foreground' :
              'text-destructive'
            }`}>
              {data.renewal.forecast.charAt(0).toUpperCase() + data.renewal.forecast.slice(1).replace('-', ' ')}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Action Layer */}
      <div className="pt-5">
        <p className="text-xs text-muted-foreground mb-4">Available Actions</p>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline">Create task</button>
          <span className="text-muted-foreground/50 mx-2">·</span>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline">Add to workflow</button>
          <span className="text-muted-foreground/50 mx-2">·</span>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline">Run existing playbook</button>
          <span className="text-muted-foreground/50 mx-2">·</span>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-2 hover:underline">Edit action plan</button>
        </div>
        <p className="text-xs text-muted-foreground/70 mt-4 italic">
          This aligns with your "Expansion Opportunity" workflow. Proceed or modify?
        </p>
      </div>
    </div>
  );
};

export default AccountResponse;
