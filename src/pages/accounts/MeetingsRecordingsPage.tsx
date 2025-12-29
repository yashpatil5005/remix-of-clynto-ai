import React, { useState } from 'react';
import { 
  ChevronRight,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FileText,
  Mail,
  ListChecks,
  ExternalLink,
  Filter
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const meetings = [
  { 
    id: 1, 
    title: 'Quarterly Business Review', 
    account: 'Acme Corporation', 
    date: '2024-12-15', 
    time: '10:00 AM',
    status: 'completed',
    summary: 'Discussed Q4 performance metrics and expansion opportunities. Client expressed interest in adding 10 more seats.',
    actionItems: ['Send pricing for 10 additional seats', 'Schedule demo for new features', 'Follow up on integration timeline']
  },
  { 
    id: 2, 
    title: 'Onboarding Kickoff', 
    account: 'DataDrive Co', 
    date: '2024-12-18', 
    time: '2:00 PM',
    status: 'completed',
    summary: 'Initial onboarding session completed successfully. Team is aligned on timeline and responsibilities.',
    actionItems: ['Send onboarding documentation', 'Create sandbox environment', 'Schedule week 2 training']
  },
  { 
    id: 3, 
    title: 'Support Escalation Call', 
    account: 'TechStart Inc', 
    date: '2024-12-20', 
    time: '11:00 AM',
    status: 'completed',
    summary: 'Addressed critical integration issues. Engineering team provided hotfix timeline.',
    actionItems: ['Deploy hotfix by Friday', 'Send updated documentation', 'Schedule follow-up verification call']
  },
  { 
    id: 4, 
    title: 'Renewal Discussion', 
    account: 'Global Systems Ltd', 
    date: '2024-12-28', 
    time: '3:00 PM',
    status: 'upcoming'
  },
  { 
    id: 5, 
    title: 'Feature Demo', 
    account: 'Enterprise Solutions', 
    date: '2024-12-30', 
    time: '10:30 AM',
    status: 'upcoming'
  },
  { 
    id: 6, 
    title: 'Monthly Check-in', 
    account: 'Innovate Labs', 
    date: '2024-12-10', 
    time: '4:00 PM',
    status: 'cancelled'
  },
];

export default function MeetingsRecordingsPage() {
  const [dateFilter, setDateFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetings[0] | null>(null);
  const [showSummaryDraft, setShowSummaryDraft] = useState(false);
  const [showMOMDraft, setShowMOMDraft] = useState(false);
  const [draftContent, setDraftContent] = useState('');

  const completedCount = meetings.filter(m => m.status === 'completed').length;
  const upcomingCount = meetings.filter(m => m.status === 'upcoming').length;
  const cancelledCount = meetings.filter(m => m.status === 'cancelled').length;

  const accounts = [...new Set(meetings.map(m => m.account))];

  const filteredMeetings = meetings.filter(m => {
    if (accountFilter !== 'all' && m.account !== accountFilter) return false;
    return true;
  });

  const previousMeetings = filteredMeetings.filter(m => m.status === 'completed' || m.status === 'cancelled');
  const upcomingMeetings = filteredMeetings.filter(m => m.status === 'upcoming');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-accent" />;
      case 'upcoming': return <Clock className="w-4 h-4 text-primary" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const handleDraftSummary = (meeting: typeof meetings[0]) => {
    setSelectedMeeting(meeting);
    setDraftContent(`Meeting Summary: ${meeting.title}\n\nAccount: ${meeting.account}\nDate: ${meeting.date}\n\n${meeting.summary || 'Summary will be generated based on meeting recording...'}`);
    setShowSummaryDraft(true);
  };

  const handleDraftMOM = (meeting: typeof meetings[0]) => {
    setSelectedMeeting(meeting);
    setDraftContent(`Minutes of Meeting\n\nMeeting: ${meeting.title}\nAccount: ${meeting.account}\nDate: ${meeting.date}\n\nKey Discussion Points:\n- ${meeting.summary || 'To be extracted from recording...'}\n\nAction Items:\n${meeting.actionItems?.map((item, i) => `${i + 1}. ${item}`).join('\n') || 'To be extracted...'}`);
    setShowMOMDraft(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b border-border bg-card/50">
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Video className="w-4 h-4" />
            <span>Account Canvas</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Meetings & Recordings</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Meetings & Recordings</h1>
          <p className="text-muted-foreground mt-1">Customer conversations and outcomes</p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
            </SelectContent>
          </Select>
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
        </div>

        {/* Scorecard Strip */}
        <div className="flex items-center gap-8 py-4 px-6 bg-card/60 border border-border rounded-xl">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Total Meetings</p>
            <p className="text-2xl font-bold text-foreground">{meetings.length}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Completed</p>
            <p className="text-2xl font-bold text-accent">{completedCount}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Upcoming</p>
            <p className="text-2xl font-bold text-primary">{upcomingCount}</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-muted-foreground">{cancelledCount}</p>
          </div>
        </div>

        {/* Upcoming Meetings */}
        {upcomingMeetings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Upcoming Meetings</h3>
            <div className="bg-card/60 border border-border rounded-xl overflow-hidden divide-y divide-border">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(meeting.status)}
                    <div>
                      <p className="font-medium text-foreground">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">{meeting.account}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{meeting.date}</p>
                      <p className="text-xs text-muted-foreground">{meeting.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Meetings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Previous Meetings</h3>
          <div className="bg-card/60 border border-border rounded-xl overflow-hidden divide-y divide-border">
            {previousMeetings.map((meeting) => (
              <div key={meeting.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(meeting.status)}
                    <div>
                      <p className="font-medium text-foreground">{meeting.title}</p>
                      <p className="text-sm text-muted-foreground">{meeting.account}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium text-foreground">{meeting.date}</p>
                      <p className="text-xs text-muted-foreground">{meeting.time}</p>
                    </div>
                    {meeting.status === 'completed' && (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          Summary
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5" />
                          Recording
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Transcript
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {meeting.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground font-medium">AI Assistance</p>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs gap-1.5"
                          onClick={() => handleDraftSummary(meeting)}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Draft Summary
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs gap-1.5"
                          onClick={() => handleDraftMOM(meeting)}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Draft MOM Email
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs gap-1.5">
                          <ListChecks className="w-3.5 h-3.5" />
                          Extract Actions
                        </Button>
                      </div>
                    </div>
                    
                    {meeting.actionItems && meeting.actionItems.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Action Items</p>
                        <div className="space-y-1.5">
                          {meeting.actionItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                <span className="text-muted-foreground">{item}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="text-xs h-7">
                                Create Task
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Draft Summary Dialog */}
      <Dialog open={showSummaryDraft} onOpenChange={setShowSummaryDraft}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Draft Meeting Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              value={draftContent} 
              onChange={(e) => setDraftContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSummaryDraft(false)}>
                Cancel
              </Button>
              <Button>
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Draft MOM Dialog */}
      <Dialog open={showMOMDraft} onOpenChange={setShowMOMDraft}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Draft Minutes of Meeting Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              value={draftContent} 
              onChange={(e) => setDraftContent(e.target.value)}
              className="min-h-[250px] font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowMOMDraft(false)}>
                Cancel
              </Button>
              <Button>
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
