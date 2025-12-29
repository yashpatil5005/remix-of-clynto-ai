import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, GitBranch, ChevronDown, ChevronRight, Sparkles, Users, Activity, Zap } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const workflowSubItems = [
  { title: 'Orchestrator → New', url: '/workflow/orchestrator-new', icon: Zap },
  { title: 'Orchestrator AI', url: '/workflow/orchestrator-ai', icon: Activity },
  { title: 'CSM Feed', url: '/workflow/csm-feed', icon: Users },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  
  const isWorkflowActive = workflowSubItems.some(item => location.pathname === item.url);
  const [workflowOpen, setWorkflowOpen] = useState(isWorkflowActive);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-base font-semibold tracking-tight text-sidebar-foreground">Clynto</h1>
              <p className="text-xs text-sidebar-foreground/60">AI Command Center</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Chat with Larry */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/home')}
                  isActive={isActive('/home')}
                  tooltip="Chat with Larry"
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive('/home') 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                    isActive('/home') 
                      ? 'bg-primary/20' 
                      : 'bg-sidebar-accent group-hover:bg-primary/10'
                  )}>
                    <MessageSquare className={cn(
                      'w-4 h-4 transition-colors',
                      isActive('/home') ? 'text-primary' : 'text-sidebar-foreground/70 group-hover:text-primary'
                    )} />
                  </div>
                  {!collapsed && <span className="font-medium">Chat with Larry</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Workflow Dropdown */}
              <Collapsible
                open={workflowOpen}
                onOpenChange={setWorkflowOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Workflow"
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                        isWorkflowActive 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'hover:bg-sidebar-accent text-sidebar-foreground'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isWorkflowActive 
                          ? 'bg-primary/20' 
                          : 'bg-sidebar-accent group-hover:bg-primary/10'
                      )}>
                        <GitBranch className={cn(
                          'w-4 h-4 transition-colors',
                          isWorkflowActive ? 'text-primary' : 'text-sidebar-foreground/70 group-hover:text-primary'
                        )} />
                      </div>
                      {!collapsed && (
                        <>
                          <span className="flex-1 font-medium">Workflow</span>
                          {workflowOpen ? (
                            <ChevronDown className="w-4 h-4 text-sidebar-foreground/50 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-sidebar-foreground/50 transition-transform duration-200" />
                          )}
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  {!collapsed && (
                    <CollapsibleContent className="animate-accordion-down">
                      <SidebarMenuSub className="ml-6 mt-1 border-l border-sidebar-border pl-3 space-y-1">
                        {workflowSubItems.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton
                              onClick={() => navigate(item.url)}
                              className={cn(
                                'group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm',
                                isActive(item.url)
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                              )}
                            >
                              <item.icon className={cn(
                                'w-3.5 h-3.5 transition-colors',
                                isActive(item.url) ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-primary'
                              )} />
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
