import React, { useState } from 'react';
import { 
  ChevronRight,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Filter,
  X,
  Paperclip,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const tickets = [
  { 
    id: 'TKT-001', 
    title: 'Integration sync failing intermittently',
    account: 'TechStart Inc',
    status: 'open',
    priority: 'high',
    created: '2024-12-20',
    dueToday: true,
    emails: [
      { from: 'john@techstart.com', date: '2024-12-20', content: 'We are experiencing intermittent sync failures with the CRM integration. This is blocking our team.' },
      { from: 'support@clynto.com', date: '2024-12-20', content: 'Thank you for reporting. We are investigating the issue and will update shortly.' },
      { from: 'john@techstart.com', date: '2024-12-21', content: 'Any update on this? It is now critical for our operations.' }
    ],
    attachments: ['error_log.txt', 'screenshot.png']
  },
  { 
    id: 'TKT-002', 
    title: 'Request for custom report template',
    account: 'Acme Corporation',
    status: 'open',
    priority: 'medium',
    created: '2024-12-18',
    dueToday: false,
    emails: [
      { from: 'sarah@acme.com', date: '2024-12-18', content: 'We need a custom report template that includes quarterly revenue breakdown by region.' }
    ],
    attachments: ['report_requirements.pdf']
  },
  { 
    id: 'TKT-003', 
    title: 'User permissions not applying correctly',
    account: 'Global Systems Ltd',
    status: 'unresolved',
    priority: 'high',
    created: '2024-12-15',
    dueToday: true,
    emails: [
      { from: 'admin@globalsystems.com', date: '2024-12-15', content: 'New users are getting admin access by default instead of viewer access.' },
      { from: 'support@clynto.com', date: '2024-12-15', content: 'We have identified the issue. A fix is being deployed.' },
      { from: 'admin@globalsystems.com', date: '2024-12-19', content: 'Issue still persists after the update.' }
    ],
    attachments: []
  },
  { 
    id: 'TKT-004', 
    title: 'Feature request: Bulk export',
    account: 'Enterprise Solutions',
    status: 'open',
    priority: 'low',
    created: '2024-12-10',
    dueToday: false,
    emails: [
      { from: 'ops@enterprise.com', date: '2024-12-10', content: 'Would be great to have bulk export functionality for all account data.' }
    ],
    attachments: []
  },
  { 
    id: 'TKT-005', 
    title: 'SSO configuration assistance',
    account: 'Innovate Labs',
    status: 'closed',
    priority: 'medium',
    created: '2024-12-08',
    dueToday: false,
    emails: [
      { from: 'it@innovate.com', date: '2024-12-08', content: 'Need help configuring SAML SSO with our identity provider.' },
      { from: 'support@clynto.com', date: '2024-12-09', content: 'Here is the configuration guide. Let me know if you need further assistance.' },
      { from: 'it@innovate.com', date: '2024-12-10', content: 'Successfully configured. Thank you!' }
    ],
    attachments: ['sso_config_guide.pdf']
  },
  { 
    id: 'TKT-006', 
    title: 'API rate limiting question',
    account: 'DataDrive Co',
    status: 'closed',
    priority: 'low',
    created: '2024-12-05',
    dueToday: false,
    emails: [
      { from: 'dev@datadrive.com', date: '2024-12-05', content: 'What are the API rate limits for the enterprise tier?' },
      { from: 'support@clynto.com', date: '2024-12-05', content: 'Enterprise tier has 10,000 requests per minute limit.' }
    ],
    attachments: []
  },
];

export default function TicketsPage() {
  const [accountFilter, setAccountFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);

  const accounts = [...new Set(tickets.map(t => t.account))];

  const filteredTickets = tickets.filter(t => {
    if (accountFilter !== 'all' && t.account !== accountFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    return true;
  });

  const unresolvedCount = tickets.filter(t => t.status === 'unresolved').length;
  const openCount = tickets.filter(t => t.status === 'open').length;
  const closedCount = tickets.filter(t => t.status === 'closed').length;
  const dueTodayCount = tickets.filter(t => t.dueToday && t.status !== 'closed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unresolved': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'open': return <Clock className="w-4 h-4 text-warning" />;
      case 'closed': return <CheckCircle2 className="w-4 h-4 text-accent" />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium': return <Badge variant="secondary" className="text-xs bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b border-border bg-card/50">
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Ticket className="w-4 h-4" />
            <span>Account Canvas</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Tickets</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Tickets</h1>
          <p className="text-muted-foreground mt-1">Support activity and resolution tracking</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Scorecard Strip */}
        <div className="flex items-center gap-8 py-4 px-6 bg-card/60 border border-border rounded-xl">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Unresolved</p>
            <p className="text-2xl font-bold text-destructive">{unresolvedCount}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Open</p>
            <p className="text-2xl font-bold text-warning">{openCount}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Closed</p>
            <p className="text-2xl font-bold text-accent">{closedCount}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Due Today</p>
            <p className="text-2xl font-bold text-primary">{dueTodayCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {accounts.map(account => (
                <SelectItem key={account} value={account}>{account}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets Table */}
        <div className="bg-card/60 border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[100px_1fr_180px_100px_100px_100px] gap-4 px-6 py-3 bg-muted/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <span>ID</span>
            <span>Title</span>
            <span>Account</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Created</span>
          </div>
          <div className="divide-y divide-border">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="w-full grid grid-cols-[100px_1fr_180px_100px_100px_100px] gap-4 px-6 py-4 hover:bg-muted/20 transition-colors text-left group"
              >
                <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">{ticket.title}</span>
                  {ticket.dueToday && ticket.status !== 'closed' && (
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground truncate">{ticket.account}</span>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(ticket.status)}
                  <span className="text-sm text-muted-foreground capitalize">{ticket.status}</span>
                </div>
                <div>{getPriorityBadge(ticket.priority)}</div>
                <span className="text-sm text-muted-foreground">{ticket.created}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Detail Sheet */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent className="w-[60vw] sm:max-w-none p-0 border-l border-border">
          <SheetHeader className="px-8 py-6 border-b border-border bg-card/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm text-muted-foreground">{selectedTicket?.id}</span>
                  {getPriorityBadge(selectedTicket?.priority || '')}
                </div>
                <SheetTitle className="text-xl font-semibold">{selectedTicket?.title}</SheetTitle>
                <p className="text-muted-foreground mt-1">{selectedTicket?.account}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="px-8 py-6 space-y-8">
              {/* Status & Info */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedTicket?.status || '')}
                  <span className="text-sm font-medium capitalize text-foreground">{selectedTicket?.status}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-sm text-muted-foreground">Created: {selectedTicket?.created}</span>
                {selectedTicket?.dueToday && selectedTicket?.status !== 'closed' && (
                  <>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1.5 text-warning">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Due Today</span>
                    </div>
                  </>
                )}
              </div>

              {/* Attachments */}
              {selectedTicket?.attachments && selectedTicket.attachments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Attachments</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.attachments.map((attachment, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg text-sm">
                        <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-foreground">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Trail */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Conversation
                </h3>
                <div className="space-y-4">
                  {selectedTicket?.emails.map((email, idx) => (
                    <div key={idx} className={cn(
                      'p-4 rounded-xl border',
                      email.from.includes('clynto') 
                        ? 'bg-primary/5 border-primary/20 ml-8' 
                        : 'bg-muted/20 border-border mr-8'
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{email.from}</span>
                        <span className="text-xs text-muted-foreground">{email.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{email.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
