import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Check } from 'lucide-react';

const initialMetrics = [
  { id: 'usage', name: 'Product Usage', description: 'Feature adoption and activity levels', enabled: true, weight: 25 },
  { id: 'engagement', name: 'Engagement', description: 'Login frequency and session duration', enabled: true, weight: 20 },
  { id: 'sentiment', name: 'Sentiment', description: 'NPS, CSAT, and feedback analysis', enabled: true, weight: 20 },
  { id: 'tickets', name: 'Support Tickets', description: 'Ticket volume and resolution times', enabled: true, weight: 15 },
  { id: 'payment', name: 'Payment Pattern', description: 'On-time payments and billing health', enabled: true, weight: 10 },
  { id: 'adoption', name: 'Feature Adoption', description: 'New feature uptake rate', enabled: true, weight: 10 },
];

export default function HealthScoreBuilderPage() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [saved, setSaved] = useState(false);

  const totalWeight = metrics.filter(m => m.enabled).reduce((sum, m) => sum + m.weight, 0);
  const isValid = totalWeight === 100;

  const updateMetric = (id: string, updates: Partial<typeof metrics[0]>) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, ...updates } : m));
    setSaved(false);
  };

  const handleSave = () => {
    if (isValid) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Health Score Builder</h1>
              <p className="text-sm text-muted-foreground mt-1">Define and weight health metrics</p>
            </div>
            <Button onClick={handleSave} disabled={!isValid} className="gap-2">
              {saved ? <><Check className="h-4 w-4" /> Saved</> : 'Save Configuration'}
            </Button>
          </div>

          {/* Validation Message */}
          {!isValid && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              totalWeight < 100 
                ? 'bg-amber-500/5 border border-amber-500/20' 
                : 'bg-destructive/5 border border-destructive/20'
            }`}>
              <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                totalWeight < 100 ? 'text-amber-400' : 'text-destructive'
              }`} />
              <div>
                <p className={`text-xs font-medium ${totalWeight < 100 ? 'text-amber-200' : 'text-destructive'}`}>
                  Total weight: {totalWeight}%
                </p>
                <p className={`text-xs mt-0.5 ${totalWeight < 100 ? 'text-amber-200/70' : 'text-destructive/70'}`}>
                  {totalWeight < 100 
                    ? `Add ${100 - totalWeight}% more weight to enabled metrics.`
                    : `Remove ${totalWeight - 100}% weight from enabled metrics.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Metrics List */}
          <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 divide-y divide-border/30">
            {metrics.map((metric) => (
              <div 
                key={metric.id} 
                className={`p-4 transition-colors ${metric.enabled ? 'hover:bg-muted/20' : 'opacity-50'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Switch 
                      checked={metric.enabled}
                      onCheckedChange={(checked) => updateMetric(metric.id, { enabled: checked })}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{metric.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{metric.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={metric.weight}
                      onChange={(e) => updateMetric(metric.id, { weight: parseInt(e.target.value) || 0 })}
                      disabled={!metric.enabled}
                      className="w-20 text-right bg-background/50 border-border/50"
                    />
                    <span className="text-xs text-muted-foreground w-4">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 flex items-center justify-between p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-border/30">
            <span className="text-sm text-muted-foreground">Total Weight</span>
            <span className={`text-lg font-semibold ${isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
              {totalWeight}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
