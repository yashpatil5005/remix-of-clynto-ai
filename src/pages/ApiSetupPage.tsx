import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, ArrowLeft, Check, Key, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface APIConfig {
  id: string;
  name: string;
  logo: string;
  apiKey: string;
  additionalFields?: { label: string; value: string; placeholder: string }[];
  validated: boolean;
}

const ApiSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [apis, setApis] = useState<APIConfig[]>([
    { id: 'hubspot', name: 'HubSpot', logo: '🔶', apiKey: '', validated: false },
    { id: 'mixpanel', name: 'Mixpanel', logo: '🟣', apiKey: '', validated: false },
    { id: 'stripe', name: 'Stripe', logo: '💳', apiKey: '', validated: false },
    { id: 'slack', name: 'Slack', logo: '💬', apiKey: '', additionalFields: [
      { label: 'Webhook URL', value: '', placeholder: 'https://hooks.slack.com/...' }
    ], validated: false },
  ]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [validating, setValidating] = useState<string | null>(null);

  const updateApiKey = (id: string, value: string) => {
    setApis(prev => prev.map(api => 
      api.id === id ? { ...api, apiKey: value, validated: false } : api
    ));
  };

  const updateAdditionalField = (apiId: string, fieldIndex: number, value: string) => {
    setApis(prev => prev.map(api => {
      if (api.id === apiId && api.additionalFields) {
        const newFields = [...api.additionalFields];
        newFields[fieldIndex] = { ...newFields[fieldIndex], value };
        return { ...api, additionalFields: newFields };
      }
      return api;
    }));
  };

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const validateApi = async (id: string) => {
    const api = apis.find(a => a.id === id);
    if (!api?.apiKey) {
      toast.error('Please enter an API key first');
      return;
    }

    setValidating(id);
    
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setApis(prev => prev.map(a => 
      a.id === id ? { ...a, validated: true } : a
    ));
    setValidating(null);
    toast.success(`${api.name} API validated successfully!`);
  };

  const allValidated = apis.filter(a => a.apiKey).every(a => a.validated);

  const handleNext = () => {
    const configuredApis = apis.filter(a => a.apiKey);
    if (configuredApis.length === 0) {
      toast.error('Please configure at least one API');
      return;
    }
    if (!allValidated) {
      toast.warning('Please validate all configured APIs before proceeding');
      return;
    }
    navigate('/field-mapping');
  };

  return (
    <OnboardingLayout showProgress currentStep={4} className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <ClyntoLogo size="sm" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">API Configuration</h1>
          <p className="text-muted-foreground">Add your API keys to connect your tools</p>
        </div>

        <div className="space-y-4">
          {apis.map((api) => (
            <Card key={api.id} variant="glass" className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{api.logo}</span>
                    {api.name}
                  </div>
                  {api.validated && (
                    <span className="flex items-center gap-1 text-sm text-accent font-normal">
                      <CheckCircle2 className="w-4 h-4" />
                      Validated
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showKeys[api.id] ? 'text' : 'password'}
                    placeholder="Enter API Key"
                    value={api.apiKey}
                    onChange={(e) => updateApiKey(api.id, e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(api.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKeys[api.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {api.additionalFields?.map((field, index) => (
                  <div key={index}>
                    <label className="text-sm text-muted-foreground mb-1 block">{field.label}</label>
                    <Input
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) => updateAdditionalField(api.id, index, e.target.value)}
                    />
                  </div>
                ))}

                <Button
                  variant={api.validated ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => validateApi(api.id)}
                  disabled={!api.apiKey || validating === api.id}
                  className="w-full"
                >
                  {validating === api.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                      Validating...
                    </>
                  ) : api.validated ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Validated
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Validate Connection
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => navigate('/data-flow')}>
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

export default ApiSetupPage;
