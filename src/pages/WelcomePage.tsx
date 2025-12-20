import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, Sparkles, Heart, Bot } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <OnboardingLayout className="items-center justify-center p-4">
      <div className={`w-full max-w-2xl mx-auto text-center transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Animated Logo */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          <div className="relative w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow animate-float">
            <Sparkles className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold animate-slide-up">
            Welcome to <span className="text-gradient-primary">Clynto AI</span>!
          </h1>
          
          <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.2s' }}>
            You're an important part of this Journey
          </p>
          
          <div className="flex items-center justify-center gap-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Bot className="w-6 h-6 text-accent" />
            <p className="text-lg font-medium">
              Enjoy talking to <span className="text-accent">Larry</span>
            </p>
            <Heart className="w-5 h-5 text-destructive animate-pulse" />
          </div>
        </div>

        {/* CTA */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button
            variant="gradient"
            size="xl"
            onClick={() => navigate('/home')}
            className="min-w-[200px]"
          >
            Go to Home
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default WelcomePage;
