import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ChevronDown, ChevronRight, Lightbulb, Pencil, Plus } from 'lucide-react';

const playbooks = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    useCase: 'New customer activation and setup',
    steps: [
      { name: 'Welcome Call', timeline: 'Day 1', priority: 'High', purpose: 'Introduce team and set expectations' },
      { name: 'Technical Setup', timeline: 'Day 2-3', priority: 'High', purpose: 'Configure integrations and data sync' },
      { name: 'Training Session', timeline: 'Day 5', priority: 'Medium', purpose: 'Product walkthrough and best practices' },
      { name: 'Check-in Call', timeline: 'Day 14', priority: 'Medium', purpose: 'Address questions and ensure adoption' },
    ]
  },
  {
    id: 'renewal-30',
    name: 'Renewal (30 Days)',
    useCase: 'Pre-renewal engagement for accounts expiring in 30 days',
    steps: [
      { name: 'Renewal Notice', timeline: 'Day 1', priority: 'High', purpose: 'Send formal renewal reminder' },
      { name: 'Value Review Call', timeline: 'Day 7', priority: 'High', purpose: 'Review usage and demonstrate ROI' },
      { name: 'Contract Discussion', timeline: 'Day 14', priority: 'High', purpose: 'Negotiate terms and address concerns' },
      { name: 'Final Follow-up', timeline: 'Day 25', priority: 'Critical', purpose: 'Close renewal or escalate' },
    ]
  },
  {
    id: 'renewal-60',
    name: 'Renewal (60 Days)',
    useCase: 'Early renewal engagement for strategic accounts',
    steps: [
      { name: 'Account Review', timeline: 'Day 1', priority: 'Medium', purpose: 'Analyze usage and health metrics' },
      { name: 'Executive Check-in', timeline: 'Day 14', priority: 'Medium', purpose: 'Engage decision makers' },
      { name: 'Proposal Preparation', timeline: 'Day 30', priority: 'High', purpose: 'Prepare renewal proposal' },
    ]
  },
  {
    id: 'expansion',
    name: 'Expansion',
    useCase: 'Upsell and cross-sell opportunities',
    steps: [
      { name: 'Usage Analysis', timeline: 'Day 1', priority: 'Medium', purpose: 'Identify growth signals' },
      { name: 'Solution Presentation', timeline: 'Day 7', priority: 'High', purpose: 'Present additional capabilities' },
      { name: 'Proposal Delivery', timeline: 'Day 14', priority: 'High', purpose: 'Send expansion proposal' },
    ]
  },
  {
    id: 'risk',
    name: 'Risk Mitigation',
    useCase: 'Intervention for at-risk accounts',
    steps: [
      { name: 'Risk Assessment', timeline: 'Day 1', priority: 'Critical', purpose: 'Analyze churn signals' },
      { name: 'Executive Outreach', timeline: 'Day 2', priority: 'Critical', purpose: 'Engage stakeholders' },
      { name: 'Recovery Plan', timeline: 'Day 5', priority: 'High', purpose: 'Implement retention strategy' },
      { name: 'Progress Review', timeline: 'Day 14', priority: 'High', purpose: 'Assess recovery status' },
    ]
  },
];

const aiInsights = [
  { type: 'usage', text: 'Onboarding playbook has 92% completion rate across 45 accounts this quarter' },
  { type: 'gap', text: 'Risk mitigation playbook shows 40% faster resolution when Executive Outreach happens within 24 hours' },
  { type: 'opportunity', text: 'Accounts completing full Expansion playbook show 3.2x higher upsell conversion' },
];

export default function WorkflowAutomationPage() {
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Workflow Automation</h1>
              <p className="text-sm text-muted-foreground mt-1">Playbooks powering automation</p>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Playbook
            </Button>
          </div>

          {/* AI Insights */}
          <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                {aiInsights.map((insight, idx) => (
                  <p key={idx} className="text-xs text-foreground/80">{insight.text}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Playbooks */}
          <div className="space-y-3">
            {playbooks.map((playbook) => {
              const isExpanded = expandedPlaybook === playbook.id;
              return (
                <div key={playbook.id} className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 overflow-hidden">
                  {/* Playbook Header */}
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() => setExpandedPlaybook(isExpanded ? null : playbook.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{playbook.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{playbook.useCase}</p>
                      </div>
                    </button>
                    <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  </div>

                  {/* Steps */}
                  {isExpanded && (
                    <div className="border-t border-border/30 p-4">
                      <div className="space-y-3">
                        {playbook.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-4 pl-7">
                            <div className="w-6 h-6 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs text-muted-foreground">{idx + 1}</span>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Task</p>
                                <p className="text-sm text-foreground mt-0.5">{step.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Timeline</p>
                                <p className="text-sm text-foreground mt-0.5">{step.timeline}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Priority</p>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                  step.priority === 'Critical' ? 'bg-destructive/10 text-destructive' :
                                  step.priority === 'High' ? 'bg-amber-500/10 text-amber-400' :
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {step.priority}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Purpose</p>
                                <p className="text-sm text-foreground mt-0.5">{step.purpose}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Playbook Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="bg-card border-border/50 sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Create Playbook</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Playbook Name</Label>
              <Input className="mt-1 bg-background/50 border-border/50" placeholder="e.g., Quarterly Business Review" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Use Case</Label>
              <Input className="mt-1 bg-background/50 border-border/50" placeholder="Describe when this playbook should be used" />
            </div>
            <div className="pt-4">
              <Button className="w-full">Create & Add Steps</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
