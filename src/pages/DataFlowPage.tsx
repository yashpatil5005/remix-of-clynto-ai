import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, ArrowLeft, Check, Database, MessageSquare, CreditCard, BarChart3, ListTodo, Warehouse } from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  logo: string;
  color: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ElementType;
  integrations: Integration[];
}

const categories: Category[] = [
  {
    id: 'crm',
    title: 'Connect your CRM',
    icon: Database,
    integrations: [
      { id: 'hubspot', name: 'HubSpot', logo: '🔶', color: '#FF7A59' },
      { id: 'freshdesk', name: 'Freshdesk', logo: '🟢', color: '#00BFA5' },
      { id: 'intercom', name: 'Intercom', logo: '🔵', color: '#1F8CEB' },
      { id: 'salesforce', name: 'Salesforce', logo: '☁️', color: '#00A1E0' },
      { id: 'dynamics', name: 'MS Dynamics', logo: '🔷', color: '#002050' },
      { id: 'zoho-crm', name: 'Zoho CRM', logo: '🔴', color: '#C8202F' },
      { id: 'local-crm', name: 'Local Data', logo: '📁', color: '#6B7280' },
    ],
  },
  {
    id: 'task',
    title: 'Connect your Task Management',
    icon: ListTodo,
    integrations: [
      { id: 'jira', name: 'Jira', logo: '🔵', color: '#0052CC' },
      { id: 'trello', name: 'Trello', logo: '📘', color: '#0079BF' },
      { id: 'asana', name: 'Asana', logo: '🟠', color: '#F06A6A' },
      { id: 'clickup', name: 'ClickUp', logo: '🟣', color: '#7B68EE' },
      { id: 'local-task', name: 'Local Data', logo: '📁', color: '#6B7280' },
    ],
  },
  {
    id: 'analytics',
    title: 'Connect for Product Analytics',
    icon: BarChart3,
    integrations: [
      { id: 'mixpanel', name: 'Mixpanel', logo: '🟣', color: '#7856FF' },
      { id: 'pendo', name: 'Pendo', logo: '🔴', color: '#EC2059' },
      { id: 'api-endpoint', name: 'API Endpoint', logo: '🔗', color: '#10B981' },
      { id: 'api-connector', name: 'API Connector', logo: '⚡', color: '#F59E0B' },
      { id: 'local-analytics', name: 'Local Data', logo: '📁', color: '#6B7280' },
    ],
  },
  {
    id: 'warehouse',
    title: 'Data Warehouse',
    icon: Warehouse,
    integrations: [
      { id: 'bigquery', name: 'Google BigQuery', logo: '🔵', color: '#4285F4' },
      { id: 'mssql', name: 'MS SQL Server', logo: '🔷', color: '#CC2927' },
      { id: 'mysql', name: 'MySQL', logo: '🐬', color: '#4479A1' },
      { id: 'oracle', name: 'Oracle', logo: '🔴', color: '#F80000' },
      { id: 'postgresql', name: 'PostgreSQL', logo: '🐘', color: '#336791' },
      { id: 'redshift', name: 'Redshift', logo: '🔶', color: '#8C4FFF' },
      { id: 'snowflake', name: 'Snowflake', logo: '❄️', color: '#29B5E8' },
    ],
  },
  {
    id: 'communication',
    title: 'Communication Channel',
    icon: MessageSquare,
    integrations: [
      { id: 'slack', name: 'Slack', logo: '💬', color: '#4A154B' },
      { id: 'teams', name: 'MS Teams', logo: '🟣', color: '#464EB8' },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: CreditCard,
    integrations: [
      { id: 'stripe', name: 'Stripe', logo: '💳', color: '#635BFF' },
      { id: 'razorpay', name: 'Razorpay', logo: '💙', color: '#0066FF' },
      { id: 'zoho-billing', name: 'Zoho Billing', logo: '🔴', color: '#C8202F' },
    ],
  },
  {
    id: 'subscription',
    title: 'Subscription Management',
    icon: Database,
    integrations: [
      { id: 'chargebee', name: 'Chargebee', logo: '🟠', color: '#FF7E0E' },
      { id: 'zoho-sub', name: 'Zoho Subscription', logo: '🔴', color: '#C8202F' },
    ],
  },
];

const DataFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIntegrations, setSelectedIntegrations] = useState<Record<string, string[]>>({});

  const toggleIntegration = (categoryId: string, integrationId: string) => {
    setSelectedIntegrations(prev => {
      const current = prev[categoryId] || [];
      const isSelected = current.includes(integrationId);
      
      return {
        ...prev,
        [categoryId]: isSelected
          ? current.filter(id => id !== integrationId)
          : [...current, integrationId],
      };
    });
  };

  const isSelected = (categoryId: string, integrationId: string) => {
    return (selectedIntegrations[categoryId] || []).includes(integrationId);
  };

  const totalSelected = Object.values(selectedIntegrations).flat().length;

  const handleNext = () => {
    if (totalSelected === 0) {
      toast.error('Please select at least one integration');
      return;
    }
    toast.success(`${totalSelected} integrations selected!`);
    navigate('/api-setup');
  };

  return (
    <OnboardingLayout showProgress currentStep={3} className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <ClyntoLogo size="sm" />
          </div>
          <div className="text-sm text-muted-foreground">
            {totalSelected} integration{totalSelected !== 1 ? 's' : ''} selected
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Set Up Your Data Flow</h1>
          <p className="text-muted-foreground">Select the tools you want to connect to Clynto AI</p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <Card key={category.id} variant="glass" className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {category.integrations.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => toggleIntegration(category.id, integration.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                        isSelected(category.id, integration.id)
                          ? 'bg-primary/10 border-primary shadow-md'
                          : 'bg-card/50 border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-lg">{integration.logo}</span>
                      <span className="font-medium text-sm">{integration.name}</span>
                      {isSelected(category.id, integration.id) && (
                        <Check className="w-4 h-4 text-primary ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => navigate('/connect-data')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="gradient" size="lg" onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default DataFlowPage;
