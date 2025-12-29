import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header with trigger for mobile */}
          <header className="md:hidden flex items-center h-14 border-b border-border px-4 bg-background">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm font-medium">Clynto</span>
          </header>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
