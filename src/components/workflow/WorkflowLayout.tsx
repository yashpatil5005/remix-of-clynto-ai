import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  ChevronDown, 
  GitBranch, 
  Plus, 
  Cpu, 
  Radio,
  Settings,
  Bell,
  User,
  Search,
  Command
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface WorkflowLayoutProps {
  children: React.ReactNode;
}

const WorkflowLayout: React.FC<WorkflowLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const workflowRoutes = [
    { 
      path: '/workflow/orchestrator-new', 
      label: 'Orchestrator → New', 
      icon: Plus,
      description: 'New account intake'
    },
    { 
      path: '/workflow/orchestrator-ai', 
      label: 'Orchestrator AI', 
      icon: Cpu,
      description: 'Live execution control'
    },
    { 
      path: '/workflow/csm-feed', 
      label: 'CSM Feed', 
      icon: Radio,
      description: 'Signals & recommendations'
    },
  ];

  const currentRoute = workflowRoutes.find(r => isActive(r.path));

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Left Section - Logo & Nav */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/home" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                  <Sparkles className="w-4.5 h-4.5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg tracking-tight">Clynto</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <Link 
                  to="/home"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                >
                  Command
                </Link>
                
                {/* Workflow Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                      currentRoute 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}>
                      <GitBranch className="w-4 h-4" />
                      <span>Workflow</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 p-2">
                    <div className="px-2 py-1.5 mb-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Orchestration</p>
                    </div>
                    {workflowRoutes.map((route) => (
                      <DropdownMenuItem key={route.path} asChild>
                        <Link 
                          to={route.path}
                          className={cn(
                            "flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                            isActive(route.path) && "bg-primary/10"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            isActive(route.path) 
                              ? "bg-primary/20 text-primary" 
                              : "bg-secondary text-muted-foreground"
                          )}>
                            <route.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium",
                              isActive(route.path) ? "text-primary" : "text-foreground"
                            )}>
                              {route.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {route.description}
                            </p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/workflow/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Workflow Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link 
                  to="/accounts"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                >
                  Accounts
                </Link>
              </nav>
            </div>

            {/* Right Section - Search & Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button className="hidden lg:flex items-center gap-2 h-9 px-4 rounded-lg border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 transition-colors">
                <Search className="w-4 h-4" />
                <span className="text-sm">Search...</span>
                <kbd className="ml-4 flex items-center gap-1 text-xs bg-background/80 px-1.5 py-0.5 rounded border border-border/60">
                  <Command className="w-3 h-3" />K
                </kbd>
              </button>

              {/* Notifications */}
              <button className="relative w-9 h-9 rounded-lg border border-border/60 bg-secondary/30 flex items-center justify-center text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
              </button>

              {/* User */}
              <button className="w-9 h-9 rounded-lg border border-border/60 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-foreground hover:from-primary/30 hover:to-accent/30 transition-colors">
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default WorkflowLayout;
