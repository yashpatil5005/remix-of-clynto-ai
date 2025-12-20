import React from 'react';
import { cn } from '@/lib/utils';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  className,
  showProgress = false,
  currentStep = 1,
  totalSteps = 10,
}) => {
  return (
    <div className="min-h-screen bg-background grid-background">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-warning/5 rounded-full blur-3xl" />
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50">
          <div
            className="h-full gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div className={cn("relative z-10 min-h-screen flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;
