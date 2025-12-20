import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, Sparkles, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

const DataFlowVisual: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState(0);
  
  const sources = [
    { name: 'HubSpot', color: '#FF7A59', category: 'CRM' },
    { name: 'Mixpanel', color: '#7856FF', category: 'Analytics' },
    { name: 'Stripe', color: '#635BFF', category: 'Billing' },
    { name: 'Salesforce', color: '#00A1E0', category: 'CRM' },
    { name: 'Pendo', color: '#EC2059', category: 'Analytics' },
  ];

  const insights = [
    { icon: AlertTriangle, text: '3 accounts may churn', color: 'text-destructive' },
    { icon: TrendingDown, text: 'Usage dropped for 4 accounts', color: 'text-warning' },
    { icon: TrendingUp, text: 'Expansion opportunity for XYZ Corp', color: 'text-accent' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlow(prev => (prev + 1) % sources.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" fill="none">
        {/* Data flow lines */}
        {sources.map((_, index) => (
          <path
            key={index}
            d={`M 100 ${80 + index * 60} Q 300 ${80 + index * 60} 400 200`}
            stroke={`url(#flowGradient${index})`}
            strokeWidth="2"
            fill="none"
            className={`transition-opacity duration-500 ${activeFlow === index ? 'opacity-100' : 'opacity-20'}`}
            style={{ 
              strokeDasharray: '10',
              animation: activeFlow === index ? 'dash 1s linear infinite' : 'none'
            }}
          />
        ))}
        {/* Output lines */}
        <path d="M 400 200 Q 500 120 700 100" stroke="url(#outGradient1)" strokeWidth="2" fill="none" className="data-flow-line" />
        <path d="M 400 200 Q 500 200 700 200" stroke="url(#outGradient2)" strokeWidth="2" fill="none" className="data-flow-line" style={{ animationDelay: '0.3s' }} />
        <path d="M 400 200 Q 500 280 700 300" stroke="url(#outGradient3)" strokeWidth="2" fill="none" className="data-flow-line" style={{ animationDelay: '0.6s' }} />
        
        <defs>
          {sources.map((source, index) => (
            <linearGradient key={index} id={`flowGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={source.color} />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          ))}
          <linearGradient id="outGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="outGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <linearGradient id="outGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 flex items-center justify-between px-4">
        {/* Sources */}
        <div className="flex flex-col gap-3">
          {sources.map((source, index) => (
            <div
              key={source.name}
              className={`glass-card px-4 py-2 flex items-center gap-2 transition-all duration-300 ${
                activeFlow === index ? 'scale-105 shadow-lg' : 'opacity-60'
              }`}
              style={{ borderColor: activeFlow === index ? source.color : undefined }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
              <span className="text-sm font-medium">{source.name}</span>
              <span className="text-xs text-muted-foreground">{source.category}</span>
            </div>
          ))}
        </div>

        {/* Clynto AI Hub */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-pulse-slow">
            <div className="w-24 h-24 rounded-full bg-card/90 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary animate-float" />
            </div>
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-lg font-bold text-gradient-primary">Clynto AI</span>
          </div>
        </div>

        {/* Insights */}
        <div className="flex flex-col gap-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="glass-card px-4 py-3 flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <insight.icon className={`w-5 h-5 ${insight.color}`} />
              <span className="text-sm font-medium">{insight.text}</span>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">Predict</span>
            <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">Orchestrate</span>
            <span className="text-xs px-3 py-1 rounded-full bg-warning/10 text-warning font-medium">Execute</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OnboardingIntro: React.FC = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout showProgress currentStep={1} className="items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <ClyntoLogo size="lg" className="justify-center mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Data, <span className="text-gradient-primary">Unified</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect your CRM, analytics, and billing data to unlock powerful customer insights powered by AI.
          </p>
        </div>

        <DataFlowVisual />

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-6">Let's get started!</h2>
          <Button variant="gradient" size="xl" onClick={() => navigate('/connect-data')}>
            Click Next
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingIntro;
