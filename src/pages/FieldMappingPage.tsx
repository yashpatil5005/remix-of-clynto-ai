import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, ArrowLeft, Sparkles, Edit2, Check, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

interface FieldMapping {
  id: string;
  sourceField: string;
  targetField: string;
  category: string;
  editable: boolean;
}

interface ConnectionMapping {
  id: string;
  name: string;
  logo: string;
  mappings: FieldMapping[];
}

const FieldMappingPage: React.FC = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<ConnectionMapping[]>([
    {
      id: 'hubspot',
      name: 'HubSpot',
      logo: '🔶',
      mappings: [
        { id: '1', sourceField: 'contact_name', targetField: 'customer_name', category: 'Customer', editable: false },
        { id: '2', sourceField: 'company_name', targetField: 'account_name', category: 'Account', editable: false },
        { id: '3', sourceField: 'deal_value', targetField: 'contract_value', category: 'Revenue', editable: false },
        { id: '4', sourceField: 'lifecycle_stage', targetField: 'customer_stage', category: 'Status', editable: false },
        { id: '5', sourceField: 'last_activity', targetField: 'last_interaction', category: 'Activity', editable: false },
      ],
    },
    {
      id: 'mixpanel',
      name: 'Mixpanel',
      logo: '🟣',
      mappings: [
        { id: '1', sourceField: 'user_id', targetField: 'customer_id', category: 'Customer', editable: false },
        { id: '2', sourceField: 'event_count', targetField: 'usage_count', category: 'Usage', editable: false },
        { id: '3', sourceField: 'session_duration', targetField: 'engagement_time', category: 'Engagement', editable: false },
        { id: '4', sourceField: 'last_seen', targetField: 'last_active', category: 'Activity', editable: false },
      ],
    },
    {
      id: 'stripe',
      name: 'Stripe',
      logo: '💳',
      mappings: [
        { id: '1', sourceField: 'customer_email', targetField: 'billing_email', category: 'Customer', editable: false },
        { id: '2', sourceField: 'subscription_status', targetField: 'payment_status', category: 'Status', editable: false },
        { id: '3', sourceField: 'mrr', targetField: 'monthly_revenue', category: 'Revenue', editable: false },
        { id: '4', sourceField: 'next_invoice', targetField: 'renewal_date', category: 'Billing', editable: false },
      ],
    },
  ]);

  const toggleEdit = (connectionId: string, mappingId: string) => {
    setConnections(prev => prev.map(conn => {
      if (conn.id === connectionId) {
        return {
          ...conn,
          mappings: conn.mappings.map(m =>
            m.id === mappingId ? { ...m, editable: !m.editable } : m
          ),
        };
      }
      return conn;
    }));
  };

  const updateTargetField = (connectionId: string, mappingId: string, value: string) => {
    setConnections(prev => prev.map(conn => {
      if (conn.id === connectionId) {
        return {
          ...conn,
          mappings: conn.mappings.map(m =>
            m.id === mappingId ? { ...m, targetField: value } : m
          ),
        };
      }
      return conn;
    }));
  };

  const handleNext = () => {
    toast.success('Field mappings saved successfully!');
    navigate('/add-team-prompt');
  };

  return (
    <OnboardingLayout showProgress currentStep={5} className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <ClyntoLogo size="sm" />
          <div className="flex items-center gap-2 text-sm text-accent">
            <Sparkles className="w-4 h-4" />
            AI-Powered Mapping
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Field Mapping</h1>
          <p className="text-muted-foreground">AI has automatically mapped your fields. Review and edit as needed.</p>
        </div>

        <div className="space-y-6">
          {connections.map((connection) => (
            <Card key={connection.id} variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-2xl">{connection.logo}</span>
                  {connection.name} Mapping
                </CardTitle>
                <CardDescription>
                  {connection.mappings.length} fields mapped
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground px-2">
                    <div className="col-span-4">Source Field</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-4">Clynto Field</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Mappings */}
                  {connection.mappings.map((mapping) => (
                    <div
                      key={mapping.id}
                      className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="col-span-4">
                        <code className="text-sm bg-card px-2 py-1 rounded">{mapping.sourceField}</code>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="col-span-4">
                        {mapping.editable ? (
                          <Input
                            value={mapping.targetField}
                            onChange={(e) => updateTargetField(connection.id, mapping.id, e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <code className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            {mapping.targetField}
                          </code>
                        )}
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
                          {mapping.category}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => toggleEdit(connection.id, mapping.id)}
                          className="p-1.5 rounded-lg hover:bg-card transition-colors"
                        >
                          {mapping.editable ? (
                            <Check className="w-4 h-4 text-accent" />
                          ) : (
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => navigate('/api-setup')}>
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

export default FieldMappingPage;
