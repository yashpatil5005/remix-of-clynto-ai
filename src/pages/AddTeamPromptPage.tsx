import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { Users, ArrowRight } from 'lucide-react';

const AddTeamPromptPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout showProgress currentStep={6} className="items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <ClyntoLogo size="lg" className="justify-center mb-6" />
        </div>

        <Card variant="glass" className="text-center p-8">
          <CardContent className="pt-6">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Users className="w-12 h-12 text-primary-foreground" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Would you like to add the team now?
            </h1>
            <p className="text-muted-foreground mb-8">
              Invite your team members to collaborate on customer success initiatives.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="gradient"
                size="lg"
                className="min-w-[140px]"
                onClick={() => navigate('/invite-users')}
              >
                Yes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[140px]"
                onClick={() => navigate('/permissions')}
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  );
};

export default AddTeamPromptPage;
