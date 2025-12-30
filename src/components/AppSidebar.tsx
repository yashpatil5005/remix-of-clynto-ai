import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Zap, 
  Users, 
  CalendarCheck, 
  Building2, 
  Heart, 
  DollarSign, 
  Video, 
  Ticket, 
  Link2, 
  Workflow, 
  Settings,
  User,
  Sliders,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Navigation items in specified order
const mainNavItems = [
  { title: 'Chat with Larry', url: '/home', icon: MessageSquare },
  { title: 'Orchestrator AI', url: '/workflow/orchestrator-ai', icon: Zap },
  { title: 'CSM Feed', url: '/workflow/csm-feed', icon: Users },
  { title: 'Tasks', url: '/accounts/tasks', icon: CalendarCheck },
  { title: 'Accounts', url: '/accounts/all', icon: Building2 },
  { title: 'Health', url: '/accounts/health', icon: Heart },
  { title: 'Revenue & Forecast', url: '/accounts/revenue', icon: DollarSign },
  { title: 'Meetings & Recordings', url: '/accounts/meetings', icon: Video },
  { title: 'Tickets', url: '/accounts/tickets', icon: Ticket },
  { title: 'Integrations', url: '/settings/integrations', icon: Link2 },
  { title: 'Workflow Repository', url: '/settings/workflow-automation', icon: Workflow },
];

const settingsItems = [
  { title: 'Profile', url: '/settings/profile', icon: User },
  { title: 'User Management', url: '/settings/users', icon: Users },
  { title: 'Properties', url: '/settings/health-score', icon: Sliders },
];

interface NavIconButtonProps {
  item: { title: string; url: string; icon: React.ElementType };
  isActive: boolean;
  onClick: () => void;
}

function NavIconButton({ item, isActive, onClick }: NavIconButtonProps) {
  const Icon = item.icon;
  
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
            isActive 
              ? 'bg-white/20' 
              : 'hover:bg-white/10'
          )}
          aria-label={item.title}
        >
          <Icon 
            className={cn(
              'w-5 h-5 transition-colors',
              isActive ? 'text-white' : 'text-white/70'
            )} 
          />
          {isActive && (
            <span className="absolute left-0 w-0.5 h-6 bg-white rounded-r-full" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        sideOffset={12}
        className="bg-foreground text-background px-3 py-1.5 text-sm font-medium shadow-lg border-0"
      >
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isSettingsActive = settingsItems.some(item => location.pathname === item.url);

  const handleNavClick = (url: string) => {
    navigate(url);
    setSettingsPanelOpen(false);
  };

  const handleSettingsClick = () => {
    setSettingsPanelOpen(!settingsPanelOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Main Navigation Rail */}
      <nav 
        className="w-14 h-full bg-primary flex flex-col items-center py-4 flex-shrink-0"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-6">
          <span className="text-white font-bold text-sm">C</span>
        </div>

        {/* Main Navigation Items */}
        <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto py-2">
          {mainNavItems.map((item) => (
            <NavIconButton
              key={item.url}
              item={item}
              isActive={isActive(item.url)}
              onClick={() => handleNavClick(item.url)}
            />
          ))}
        </div>

        {/* Settings Button - Pinned at Bottom */}
        <div className="pt-4 border-t border-white/10">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={handleSettingsClick}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                  (settingsPanelOpen || isSettingsActive)
                    ? 'bg-white/20' 
                    : 'hover:bg-white/10'
                )}
                aria-label="Settings"
                aria-expanded={settingsPanelOpen}
              >
                <Settings 
                  className={cn(
                    'w-5 h-5 transition-colors',
                    (settingsPanelOpen || isSettingsActive) ? 'text-white' : 'text-white/70'
                  )} 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              sideOffset={12}
              className="bg-foreground text-background px-3 py-1.5 text-sm font-medium shadow-lg border-0"
            >
              Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>

      {/* Settings Panel */}
      <div
        className={cn(
          'h-full bg-card border-r border-border overflow-hidden transition-all duration-200 ease-out',
          settingsPanelOpen ? 'w-48' : 'w-0'
        )}
      >
        {settingsPanelOpen && (
          <div className="w-48 h-full flex flex-col animate-fade-in">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Settings</span>
              <button
                onClick={() => setSettingsPanelOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
                aria-label="Close settings"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Settings Items */}
            <div className="flex-1 py-2 px-2">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                
                return (
                  <button
                    key={item.url}
                    onClick={() => handleNavClick(item.url)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                      active 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className={cn(
                      'w-4 h-4',
                      active ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
