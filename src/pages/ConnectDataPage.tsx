import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, Database, Upload, Link2 } from 'lucide-react';
import { toast } from 'sonner';

const ConnectDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'crm' | 'sample' | null>(null);

  const handleCRMConnect = () => {
    setSelectedOption('crm');
    toast.success('Great choice! Let\'s connect your CRM.');
    setTimeout(() => navigate('/data-flow'), 500);
  };

  const handleSampleData = () => {
    setSelectedOption('sample');
    toast.success('Sample data loaded successfully!');
    setTimeout(() => navigate('/data-flow'), 500);
  };

  return (
    <OnboardingLayout showProgress currentStep={2} className="items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <ClyntoLogo size="md" className="justify-center mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Connect Your Data</h1>
          <p className="text-lg text-muted-foreground">
            Choose how you'd like to get started with Clynto AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* CRM Connection Option */}
          <Card
            variant="glass"
            className={`hover-lift cursor-pointer transition-all duration-300 ${
              selectedOption === 'crm' ? 'ring-2 ring-primary shadow-glow' : ''
            }`}
            onClick={handleCRMConnect}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                <Link2 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Your CRM</h3>
              <p className="text-muted-foreground mb-6">
                Connect HubSpot, Freshdesk, or other CRM platforms to sync your customer data.
              </p>
              <Button variant="gradient" className="w-full">
                Start Connecting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Sample Data Option */}
          <Card
            variant="glass"
            className={`hover-lift cursor-pointer transition-all duration-300 ${
              selectedOption === 'sample' ? 'ring-2 ring-accent shadow-lg' : ''
            }`}
            onClick={handleSampleData}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-accent flex items-center justify-center shadow-lg">
                <Upload className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Start with Sample Data</h3>
              <p className="text-muted-foreground mb-6">
                Upload a local file or use our sample dataset to explore Clynto AI features.
              </p>
              <Button variant="accent" className="w-full">
                Upload
                <Database className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default ConnectDataPage;
