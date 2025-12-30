import React from 'react';
import { AppSidebar, SidebarProvider, useSidebarState } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarState();
  
  return (
    <div 
      className={cn(
        "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200",
        isExpanded ? "ml-56" : "ml-14"
      )}
    >
      <AppHeader />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
