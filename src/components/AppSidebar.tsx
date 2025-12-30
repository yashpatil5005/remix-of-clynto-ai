import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Zap, 
  Users, 
  CalendarCheck, 
  Building2, 
  DollarSign, 
  Video, 
  Ticket, 
  Link2, 
  Workflow, 
  Settings,
  User,
  Sliders,
  X,
  Clock,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

// Navigation items in specified order (Health removed)
const mainNavItems = [
  { title: 'Chat with Larry', url: '/home', icon: MessageSquare },
  { title: 'Orchestrator AI', url: '/workflow/orchestrator-ai', icon: Zap },
  { title: 'CSM Feed', url: '/workflow/csm-feed', icon: Users },
  { title: 'Tasks', url: '/accounts/tasks', icon: CalendarCheck },
  { title: 'Accounts', url: '/accounts/all', icon: Building2 },
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
            'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 relative',
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

  const isActive = (path: string) => location.pathname === path;
  const isSettingsActive = settingsItems.some(item => location.pathname === item.url);

  const handleNavClick = (url: string) => {
    navigate(url);
  };

  return (
    <div className="flex h-screen fixed left-0 top-0 z-50">
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
        <div className="flex-1 flex flex-col items-center gap-1 py-2">
          {mainNavItems.map((item) => (
            <NavIconButton
              key={item.url}
              item={item}
              isActive={isActive(item.url)}
              onClick={() => handleNavClick(item.url)}
            />
          ))}
        </div>

        {/* Settings Button - Pinned at Bottom with Hover Dropdown */}
        <div className="pt-4 border-t border-white/10">
          <HoverCard openDelay={0} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                  isSettingsActive
                    ? 'bg-white/20' 
                    : 'hover:bg-white/10'
                )}
                aria-label="Settings"
              >
                <Settings 
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isSettingsActive ? 'text-white' : 'text-white/70'
                  )} 
                />
              </button>
            </HoverCardTrigger>
            <HoverCardContent 
              side="right" 
              sideOffset={8}
              align="end"
              className="w-48 p-2 bg-card border border-border shadow-xl"
            >
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Settings
                </div>
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);
                  return (
                    <button
                      key={item.url}
                      onClick={() => navigate(item.url)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150',
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
            </HoverCardContent>
          </HoverCard>
        </div>
      </nav>
    </div>
  );
}
