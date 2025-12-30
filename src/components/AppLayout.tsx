import React from 'react';
import { AppSidebar } from '@/components/AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      {/* Add left margin to account for fixed sidebar (w-14 = 56px) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden ml-14">
        {children}
      </main>
    </div>
  );
}
