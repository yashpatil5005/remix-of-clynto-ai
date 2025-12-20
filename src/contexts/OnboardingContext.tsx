import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  // Auth data
  email: string;
  name: string;
  company: string;
  designation: string;
  domain: string;
  phone: string;
  
  // Connections
  connections: {
    crm: string[];
    taskManagement: string[];
    productAnalytics: string[];
    dataWarehouse: string[];
    communication: string[];
    billing: string[];
    subscription: string[];
  };
  
  // API Keys
  apiKeys: Record<string, string>;
  
  // Field mappings
  fieldMappings: Record<string, { source: string; target: string; category: string }[]>;
  
  // Team members
  teamMembers: { name: string; email: string; designation: string; role: string; phone: string }[];
  
  // Approvals
  approvedRecords: string[];
}

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const defaultData: OnboardingData = {
  email: '',
  name: '',
  company: '',
  designation: '',
  domain: '',
  phone: '',
  connections: {
    crm: [],
    taskManagement: [],
    productAnalytics: [],
    dataWarehouse: [],
    communication: [],
    billing: [],
    subscription: [],
  },
  apiKeys: {},
  fieldMappings: {},
  teamMembers: [],
  approvedRecords: [],
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 10));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <OnboardingContext.Provider value={{ currentStep, setCurrentStep, data, updateData, nextStep, prevStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
