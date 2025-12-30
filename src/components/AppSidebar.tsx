import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, GitBranch, ChevronDown, ChevronRight, Sparkles, Users, Activity, Zap, Building2, Heart, DollarSign, Video, Ticket, Settings, User, Link2, Key, Sliders, Database, Workflow, PanelLeftClose, PanelLeft, CalendarCheck } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

const accountCanvasSubItems = [
  { title: 'All Accounts', url: '/accounts/all', icon: Building2 },
  { title: 'Tasks', url: '/accounts/tasks', icon: CalendarCheck },
  { title: 'Health', url: '/accounts/health', icon: Heart },
  { title: 'Revenue & Forecast', url: '/accounts/revenue', icon: DollarSign },
  { title: 'Meetings & Recordings', url: '/accounts/meetings', icon: Video },
  { title: 'Tickets', url: '/accounts/tickets', icon: Ticket },
];

const settingsSubItems = [
  { title: 'Profile', url: '/settings/profile', icon: User },
  { title: 'User Management', url: '/settings/users', icon: Users },
];

const integrationsSubItems = [
  { title: 'Integrations', url: '/settings/integrations', icon: Link2 },
  { title: 'API Keys', url: '/settings/api-keys', icon: Key },
];

const propertiesSubItems = [
  { title: 'Health Score Builder', url: '/settings/health-score', icon: Sliders },
  { title: 'Data Modeler', url: '/settings/data-modeler', icon: Database },
  { title: 'Workflow Automation', url: '/settings/workflow-automation', icon: Workflow },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  
  const isWorkflowActive = workflowSubItems.some(item => location.pathname === item.url);
  const isAccountCanvasActive = accountCanvasSubItems.some(item => location.pathname === item.url);
  const isSettingsActive = [...settingsSubItems, ...integrationsSubItems, ...propertiesSubItems].some(item => location.pathname === item.url);
  const isIntegrationsActive = integrationsSubItems.some(item => location.pathname === item.url);
  const isPropertiesActive = propertiesSubItems.some(item => location.pathname === item.url);

  const [workflowOpen, setWorkflowOpen] = useState(isWorkflowActive);
  const [accountCanvasOpen, setAccountCanvasOpen] = useState(isAccountCanvasActive);
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);
  const [integrationsOpen, setIntegrationsOpen] = useState(isIntegrationsActive);
  const [propertiesOpen, setPropertiesOpen] = useState(isPropertiesActive);

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

              {/* Account Canvas Dropdown */}
              <Collapsible
                open={accountCanvasOpen}
                onOpenChange={setAccountCanvasOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Account Canvas"
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                        isAccountCanvasActive 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'hover:bg-sidebar-accent text-sidebar-foreground'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isAccountCanvasActive 
                          ? 'bg-primary/20' 
                          : 'bg-sidebar-accent group-hover:bg-primary/10'
                      )}>
                        <Building2 className={cn(
                          'w-4 h-4 transition-colors',
                          isAccountCanvasActive ? 'text-primary' : 'text-sidebar-foreground/70 group-hover:text-primary'
                        )} />
                      </div>
                      {!collapsed && (
                        <>
                          <span className="flex-1 font-medium">Account Canvas</span>
                          {accountCanvasOpen ? (
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
                        {accountCanvasSubItems.map((item) => (
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

              {/* Settings Dropdown */}
              <Collapsible
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Settings"
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                        isSettingsActive 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'hover:bg-sidebar-accent text-sidebar-foreground'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isSettingsActive 
                          ? 'bg-primary/20' 
                          : 'bg-sidebar-accent group-hover:bg-primary/10'
                      )}>
                        <Settings className={cn(
                          'w-4 h-4 transition-colors',
                          isSettingsActive ? 'text-primary' : 'text-sidebar-foreground/70 group-hover:text-primary'
                        )} />
                      </div>
                      {!collapsed && (
                        <>
                          <span className="flex-1 font-medium">Settings</span>
                          {settingsOpen ? (
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
                        {/* Profile & User Management */}
                        {settingsSubItems.map((item) => (
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

                        {/* Integrations Nested */}
                        <Collapsible
                          open={integrationsOpen}
                          onOpenChange={setIntegrationsOpen}
                          className="group/nested"
                        >
                          <SidebarMenuSubItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton
                                className={cn(
                                  'group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm w-full',
                                  isIntegrationsActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                )}
                              >
                                <Link2 className={cn(
                                  'w-3.5 h-3.5 transition-colors',
                                  isIntegrationsActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-primary'
                                )} />
                                <span className="flex-1">Integrations</span>
                                {integrationsOpen ? (
                                  <ChevronDown className="w-3 h-3 text-sidebar-foreground/50" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-sidebar-foreground/50" />
                                )}
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="animate-accordion-down">
                              <div className="ml-4 mt-1 border-l border-sidebar-border/50 pl-3 space-y-1">
                                {integrationsSubItems.map((item) => (
                                  <button
                                    key={item.url}
                                    onClick={() => navigate(item.url)}
                                    className={cn(
                                      'group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs w-full',
                                      isActive(item.url)
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                    )}
                                  >
                                    <item.icon className={cn(
                                      'w-3 h-3 transition-colors',
                                      isActive(item.url) ? 'text-primary' : 'text-sidebar-foreground/40 group-hover:text-primary'
                                    )} />
                                    <span>{item.title}</span>
                                  </button>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </SidebarMenuSubItem>
                        </Collapsible>

                        {/* Properties Nested */}
                        <Collapsible
                          open={propertiesOpen}
                          onOpenChange={setPropertiesOpen}
                          className="group/nested"
                        >
                          <SidebarMenuSubItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton
                                className={cn(
                                  'group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm w-full',
                                  isPropertiesActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                )}
                              >
                                <Sliders className={cn(
                                  'w-3.5 h-3.5 transition-colors',
                                  isPropertiesActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-primary'
                                )} />
                                <span className="flex-1">Properties</span>
                                {propertiesOpen ? (
                                  <ChevronDown className="w-3 h-3 text-sidebar-foreground/50" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-sidebar-foreground/50" />
                                )}
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="animate-accordion-down">
                              <div className="ml-4 mt-1 border-l border-sidebar-border/50 pl-3 space-y-1">
                                {propertiesSubItems.map((item) => (
                                  <button
                                    key={item.url}
                                    onClick={() => navigate(item.url)}
                                    className={cn(
                                      'group flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs w-full',
                                      isActive(item.url)
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                                    )}
                                  >
                                    <item.icon className={cn(
                                      'w-3 h-3 transition-colors',
                                      isActive(item.url) ? 'text-primary' : 'text-sidebar-foreground/40 group-hover:text-primary'
                                    )} />
                                    <span>{item.title}</span>
                                  </button>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </SidebarMenuSubItem>
                        </Collapsible>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Collapse Button at Bottom */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <button
          onClick={toggleSidebar}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
