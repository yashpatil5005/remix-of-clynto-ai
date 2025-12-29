import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Check, Settings, AlertCircle, ChevronDown, ChevronRight, Database, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Integration {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'pending' | 'disconnected';
}

interface Category {
  id: string;
  title: string;
  integrations: Integration[];
}

const categories: Category[] = [
  {
    id: 'crm',
    title: 'CRM',
    integrations: [
      { id: 'hubspot', name: 'HubSpot', logo: 'https://www.vectorlogo.zone/logos/hubspot/hubspot-icon.svg', status: 'connected' },
      { id: 'freshdesk', name: 'Freshdesk', logo: 'https://www.vectorlogo.zone/logos/freshdesk/freshdesk-icon.svg', status: 'disconnected' },
      { id: 'intercom', name: 'Intercom', logo: 'https://www.vectorlogo.zone/logos/interaboraborobotsio/interaboraborobotsio-icon.svg', status: 'disconnected' },
      { id: 'salesforce', name: 'Salesforce', logo: 'https://www.vectorlogo.zone/logos/salesforce/salesforce-icon.svg', status: 'connected' },
      { id: 'dynamics', name: 'MS Dynamics', logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg', status: 'disconnected' },
      { id: 'zoho-crm', name: 'Zoho CRM', logo: 'https://www.vectorlogo.zone/logos/zoho/zoho-icon.svg', status: 'pending' },
      { id: 'local-crm', name: 'Local Data', logo: '', status: 'disconnected' },
    ]
  },
  {
    id: 'task-management',
    title: 'Task Management',
    integrations: [
      { id: 'jira', name: 'Jira', logo: 'https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg', status: 'connected' },
      { id: 'trello', name: 'Trello', logo: 'https://www.vectorlogo.zone/logos/trello/trello-icon.svg', status: 'disconnected' },
      { id: 'asana', name: 'Asana', logo: 'https://www.vectorlogo.zone/logos/asaborana/asaborana-icon.svg', status: 'disconnected' },
      { id: 'clickup', name: 'ClickUp', logo: 'https://clickup.com/landing/images/for-se-702x720.png', status: 'disconnected' },
      { id: 'local-task', name: 'Local Data', logo: '', status: 'disconnected' },
    ]
  },
  {
    id: 'product-analytics',
    title: 'Product Analytics',
    integrations: [
      { id: 'mixpanel', name: 'Mixpanel', logo: 'https://www.vectorlogo.zone/logos/mixpanel/mixpanel-icon.svg', status: 'disconnected' },
      { id: 'pendo', name: 'Pendo', logo: 'https://www.vectorlogo.zone/logos/paborendo/paborendo-icon.svg', status: 'connected' },
      { id: 'api-endpoint', name: 'API Endpoint', logo: '', status: 'disconnected' },
      { id: 'api-connector', name: 'API Connector', logo: '', status: 'disconnected' },
      { id: 'local-analytics', name: 'Local Data', logo: '', status: 'disconnected' },
    ]
  },
  {
    id: 'data-warehouse',
    title: 'Data Warehouse',
    integrations: [
      { id: 'bigquery', name: 'Google BigQuery', logo: 'https://www.vectorlogo.zone/logos/google_bigquery/google_bigquery-icon.svg', status: 'disconnected' },
      { id: 'mssql', name: 'MS SQL Server', logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg', status: 'disconnected' },
      { id: 'mysql', name: 'MySQL', logo: 'https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg', status: 'connected' },
      { id: 'oracle', name: 'Oracle', logo: 'https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg', status: 'disconnected' },
      { id: 'postgresql', name: 'PostgreSQL', logo: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg', status: 'disconnected' },
      { id: 'redshift', name: 'Redshift', logo: 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg', status: 'disconnected' },
      { id: 'snowflake', name: 'Snowflake', logo: 'https://www.vectorlogo.zone/logos/snowaborflake/snowaborflake-icon.svg', status: 'pending' },
    ]
  },
  {
    id: 'communication',
    title: 'Communication Channel',
    integrations: [
      { id: 'slack', name: 'Slack', logo: 'https://www.vectorlogo.zone/logos/slack/slack-icon.svg', status: 'connected' },
      { id: 'teams', name: 'MS Teams', logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg', status: 'disconnected' },
    ]
  },
  {
    id: 'billing',
    title: 'Billing',
    integrations: [
      { id: 'stripe', name: 'Stripe', logo: 'https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg', status: 'connected' },
      { id: 'razorpay', name: 'Razorpay', logo: 'https://www.vectorlogo.zone/logos/razorpay/razorpay-icon.svg', status: 'disconnected' },
      { id: 'zoho-billing', name: 'Zoho Billing', logo: 'https://www.vectorlogo.zone/logos/zoho/zoho-icon.svg', status: 'disconnected' },
    ]
  },
  {
    id: 'subscription',
    title: 'Subscription Management',
    integrations: [
      { id: 'chargebee', name: 'Chargebee', logo: 'https://www.chargebee.com/static/resources/brand/chargebee-logo-black.svg', status: 'disconnected' },
      { id: 'zoho-subscriptions', name: 'Zoho Subscriptions', logo: 'https://www.vectorlogo.zone/logos/zoho/zoho-icon.svg', status: 'disconnected' },
    ]
  },
];

export default function IntegrationsPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map(c => c.id));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-accent';
      case 'pending': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'pending': return 'Pending Setup';
      default: return 'Not Connected';
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Integrations</h1>
            <p className="text-sm text-muted-foreground mt-1">Connect and manage external systems</p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-card/60 border border-border rounded-xl overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{category.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {category.integrations.filter(i => i.status === 'connected').length}/{category.integrations.length}
                    </span>
                  </div>
                  {expandedCategories.includes(category.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {/* Integrations Grid */}
                {expandedCategories.includes(category.id) && (
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {category.integrations.map((integration) => (
                        <div
                          key={integration.id}
                          className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            {/* Logo */}
                            <div className="w-9 h-9 rounded-lg bg-background border border-border/50 flex items-center justify-center overflow-hidden">
                              {integration.logo ? (
                                <img
                                  src={integration.logo}
                                  alt={integration.name}
                                  className="w-5 h-5 object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<span class="text-[10px] font-semibold text-muted-foreground">${integration.name.slice(0, 2).toUpperCase()}</span>`;
                                    }
                                  }}
                                />
                              ) : integration.name === 'Local Data' ? (
                                <Database className="w-4 h-4 text-muted-foreground" />
                              ) : integration.name.includes('API') ? (
                                <Upload className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <span className="text-[10px] font-semibold text-muted-foreground">
                                  {integration.name.slice(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium text-foreground truncate">{integration.name}</p>
                                {integration.status === 'connected' && (
                                  <Check className="h-3 w-3 text-accent flex-shrink-0" />
                                )}
                                {integration.status === 'pending' && (
                                  <AlertCircle className="h-3 w-3 text-warning flex-shrink-0" />
                                )}
                              </div>
                              <p className={cn('text-xs', getStatusColor(integration.status))}>
                                {getStatusText(integration.status)}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant={integration.status === 'disconnected' ? 'default' : 'ghost'}
                            className="text-xs h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {integration.status === 'connected' && <Settings className="h-3 w-3" />}
                            {integration.status === 'pending' && 'Setup'}
                            {integration.status === 'disconnected' && 'Connect'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
