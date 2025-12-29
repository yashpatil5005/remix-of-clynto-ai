import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Check, Settings, AlertCircle } from 'lucide-react';

const integrations = [
  { id: 'salesforce', name: 'Salesforce', description: 'CRM data sync and account management', status: 'connected', lastSync: '2 minutes ago' },
  { id: 'hubspot', name: 'HubSpot', description: 'Marketing automation and contact sync', status: 'connected', lastSync: '15 minutes ago' },
  { id: 'slack', name: 'Slack', description: 'Team notifications and alerts', status: 'connected', lastSync: 'Real-time' },
  { id: 'zendesk', name: 'Zendesk', description: 'Support ticket integration', status: 'pending', lastSync: 'Setup incomplete' },
  { id: 'intercom', name: 'Intercom', description: 'Customer messaging platform', status: 'disconnected', lastSync: 'Not connected' },
  { id: 'stripe', name: 'Stripe', description: 'Payment and billing data', status: 'connected', lastSync: '1 hour ago' },
  { id: 'segment', name: 'Segment', description: 'Analytics and data pipeline', status: 'disconnected', lastSync: 'Not connected' },
];

export default function IntegrationsPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Integrations</h1>
            <p className="text-sm text-muted-foreground mt-1">Connect and manage external systems</p>
          </div>

          {/* Integrations Grid */}
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <div 
                key={integration.id} 
                className="flex items-center justify-between p-4 bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Icon placeholder */}
                  <div className="w-10 h-10 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center">
                    <span className="text-xs font-semibold text-muted-foreground">{integration.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{integration.name}</p>
                      {integration.status === 'connected' && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      {integration.status === 'pending' && (
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <AlertCircle className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className={`text-xs ${
                      integration.status === 'connected' ? 'text-emerald-400' :
                      integration.status === 'pending' ? 'text-amber-400' :
                      'text-muted-foreground'
                    }`}>
                      {integration.status === 'connected' ? 'Connected' :
                       integration.status === 'pending' ? 'Pending Setup' :
                       'Not Connected'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">{integration.lastSync}</p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant={integration.status === 'disconnected' ? 'default' : 'ghost'}
                    className="text-xs"
                  >
                    {integration.status === 'connected' && <><Settings className="h-3 w-3 mr-1" /> Configure</>}
                    {integration.status === 'pending' && 'Complete Setup'}
                    {integration.status === 'disconnected' && 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
