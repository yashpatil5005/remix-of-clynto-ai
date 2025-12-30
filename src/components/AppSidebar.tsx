import React, { createContext, useContext, useState } from 'react';
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
  ChevronRight,
  ChevronLeft
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

// Context for sidebar state
interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: false,
  setIsExpanded: () => {},
});

export const useSidebarState = () => useContext(SidebarContext);

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

interface NavItemProps {
  item: { title: string; url: string; icon: React.ElementType };
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

function NavItem({ item, isActive, isExpanded, onClick }: NavItemProps) {
  const Icon = item.icon;
  
  const button = (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-10 flex items-center gap-3 rounded-lg transition-all duration-150 relative',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        isExpanded ? 'px-3' : 'justify-center',
        isActive 
          ? 'bg-white/20' 
          : 'hover:bg-white/10'
      )}
      aria-label={item.title}
    >
      <Icon 
        className={cn(
          'w-5 h-5 flex-shrink-0 transition-colors',
          isActive ? 'text-white' : 'text-white/70'
        )} 
      />
      {isExpanded && (
        <span className={cn(
          'text-sm font-medium truncate transition-colors',
          isActive ? 'text-white' : 'text-white/70'
        )}>
          {item.title}
        </span>
      )}
      {isActive && (
        <span className="absolute left-0 w-0.5 h-6 bg-white rounded-r-full" />
      )}
    </button>
  );

  if (isExpanded) {
    return button;
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        {button}
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

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isExpanded, setIsExpanded } = useSidebarState();

  const isActive = (path: string) => location.pathname === path;
  const isSettingsActive = settingsItems.some(item => location.pathname === item.url);

  const handleNavClick = (url: string) => {
    navigate(url);
  };

  return (
    <div 
      className={cn(
        "flex h-screen fixed left-0 top-0 z-50 transition-all duration-200",
        isExpanded ? "w-56" : "w-14"
      )}
    >
      {/* Main Navigation Rail */}
      <nav 
        className="w-full h-full bg-primary flex flex-col py-4 px-2 flex-shrink-0"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo & Toggle */}
        <div className={cn(
          "flex items-center mb-6",
          isExpanded ? "justify-between px-1" : "justify-center"
        )}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          {isExpanded && (
            <span className="text-white font-semibold text-lg">Clynto</span>
          )}
        </div>

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full h-8 flex items-center gap-2 rounded-lg transition-all duration-150 mb-4",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            "hover:bg-white/10 text-white/70 hover:text-white",
            isExpanded ? "px-3 justify-start" : "justify-center"
          )}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Main Navigation Items */}
        <div className="flex-1 flex flex-col gap-1 py-2 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.url}
              item={item}
              isActive={isActive(item.url)}
              isExpanded={isExpanded}
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
                  'w-full h-10 flex items-center gap-3 rounded-lg transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                  isExpanded ? 'px-3' : 'justify-center',
                  isSettingsActive
                    ? 'bg-white/20' 
                    : 'hover:bg-white/10'
                )}
                aria-label="Settings"
              >
                <Settings 
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isSettingsActive ? 'text-white' : 'text-white/70'
                  )} 
                />
                {isExpanded && (
                  <span className={cn(
                    'text-sm font-medium',
                    isSettingsActive ? 'text-white' : 'text-white/70'
                  )}>
                    Settings
                  </span>
                )}
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
