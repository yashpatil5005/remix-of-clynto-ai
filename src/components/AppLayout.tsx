import React from 'react';
import { AppSidebar, SidebarProvider, useSidebarState } from '@/components/AppSidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebarState();
  
  return (
    <main 
      className={cn(
        "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200",
        isExpanded ? "ml-56" : "ml-14"
      )}
    >
      {children}
    </main>
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
