import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  DollarSign, 
  Calendar,
  FileText,
  Check,
  Edit3,
  ChevronRight,
  Sparkles,
  Database,
  RefreshCw,
  ArrowRight,
  GitBranch,
  TrendingUp,
  Users,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountField {
  label: string;
  value: string;
  icon: React.ElementType;
  editable?: boolean;
}

const OrchestratorNewPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [workflowApproved, setWorkflowApproved] = useState(false);
  const [accountApproved, setAccountApproved] = useState(false);

  const accountFields: AccountField[] = [
    { label: 'Company Name', value: 'Axiom Technologies Inc.', icon: Building2, editable: true },
    { label: 'Primary POC', value: 'Jennifer Walsh', icon: User, editable: true },
    { label: 'Email', value: 'j.walsh@axiomtech.io', icon: Mail, editable: true },
  ];

  const contractDetails = [
    { label: 'ARR', value: '$285,000', icon: DollarSign },
    { label: 'Billing', value: 'Annual', icon: Calendar },
    { label: 'Notes', value: 'Multi-year with expansion clause', icon: FileText },
  ];

  const workflowStages = [
    { id: 'onboarding', label: 'Onboarding', icon: Users, color: 'bg-accent', active: true },
    { id: 'adoption', label: 'Adoption', icon: TrendingUp, color: 'bg-primary', branches: ['Low Utilization', 'High Utilization'] },
    { id: 'expansion', label: 'Expansion', icon: GitBranch, color: 'bg-warning' },
    { id: 'renewal', label: 'Renewal', icon: RotateCcw, color: 'bg-accent' },
  ];

  const handleApproveAccount = () => {
    setIsApproving(true);
    setTimeout(() => {
      setAccountApproved(true);
      setIsApproving(false);
    }, 1500);
  };

  const handleApproveWorkflow = () => {
    setWorkflowApproved(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
        {/* Page Header */}
        <div className="border-b border-border/40 bg-card/30">
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/20">
                    <Database className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Orchestrator</h1>
                    <p className="text-sm text-muted-foreground">New Account Intake</p>
                  </div>
                </div>
              </div>

              {/* Sync Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                  <RefreshCw className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-medium text-accent">Synced from CRM</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last sync: 2 minutes ago
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
          {/* Account Information Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-primary/40" />
                <h2 className="text-lg font-semibold">Account Information</h2>
                {accountApproved && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Approved
                  </span>
                )}
              </div>
              {!accountApproved && (
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              )}
            </div>

            {/* Account Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Main Account Info */}
              {accountFields.map((field, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "col-span-2 p-5 rounded-xl border transition-all",
                    isEditing && field.editable
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/40 bg-card/50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <field.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{field.label}</span>
                  </div>
                  {isEditing && field.editable ? (
                    <input 
                      type="text" 
                      defaultValue={field.value}
                      className="w-full bg-transparent border-b border-primary/40 pb-1 text-lg font-medium focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="text-lg font-medium">{field.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Contract Details */}
            <div className="flex items-center gap-6 p-5 rounded-xl border border-border/40 bg-card/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contract</span>
              <div className="h-4 w-px bg-border" />
              {contractDetails.map((detail, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2">
                    <detail.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">{detail.label}:</span>
                      <span className="font-medium ml-1">{detail.value}</span>
                    </span>
                  </div>
                  {idx < contractDetails.length - 1 && <div className="h-4 w-px bg-border/50" />}
                </React.Fragment>
              ))}
            </div>

            {/* Approval Actions */}
            {!accountApproved && (
              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={handleApproveAccount}
                  disabled={isApproving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 transition-all disabled:opacity-50"
                >
                  {isApproving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve Account Information
                </button>
                <button className="px-5 py-2.5 rounded-xl border border-border/60 text-muted-foreground font-medium hover:bg-secondary/50 hover:text-foreground transition-all">
                  Edit Before Approving
                </button>
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* AI-Suggested Journey Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-accent/40" />
                <div>
                  <h2 className="text-lg font-semibold">Suggested Customer Journey</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Generated using your existing playbooks</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">AI Generated</span>
              </div>
            </div>

            {/* Journey Diagram */}
            <div className="relative p-8 rounded-2xl border border-border/40 bg-card/30 overflow-hidden">
              {/* Subtle grid background */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />

              <div className="relative">
                {/* Main Flow */}
                <div className="flex items-center justify-between">
                  {workflowStages.map((stage, idx) => (
                    <React.Fragment key={stage.id}>
                      {/* Stage Node */}
                      <div className="flex flex-col items-center gap-3 group">
                        <div className={cn(
                          "relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                          stage.active 
                            ? `${stage.color} shadow-lg` 
                            : "bg-secondary border border-border/60 group-hover:border-primary/40"
                        )}>
                          <stage.icon className={cn(
                            "w-6 h-6",
                            stage.active ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )} />
                          {stage.active && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-foreground border-2 border-background" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          stage.active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                          {stage.label}
                        </span>

                        {/* Branches for Adoption */}
                        {stage.branches && (
                          <div className="absolute top-24 flex flex-col items-center gap-2">
                            <div className="h-6 w-px bg-border" />
                            <div className="flex gap-8">
                              {stage.branches.map((branch, bIdx) => (
                                <div key={bIdx} className="flex flex-col items-center gap-1.5">
                                  <div className="w-px h-4 bg-border" />
                                  <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/40">
                                    {branch}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Connector */}
                      {idx < workflowStages.length - 1 && (
                        <div className="flex-1 flex items-center px-4">
                          <div className="flex-1 h-px bg-gradient-to-r from-border via-muted-foreground/30 to-border" />
                          <ChevronRight className="w-5 h-5 text-muted-foreground/50 mx-2" />
                          <div className="flex-1 h-px bg-gradient-to-r from-border via-muted-foreground/30 to-border" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Loop Back Indicator */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCcw className="w-3 h-3" />
                  <span>Lifecycle loops back to Adoption</span>
                </div>
              </div>
            </div>

            {/* Workflow Actions */}
            <div className="flex items-center gap-4 pt-2">
              {workflowApproved ? (
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-accent/10 border border-accent/20">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span className="font-medium text-accent">Workflow Approved</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleApproveWorkflow}
                    disabled={!accountApproved}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" />
                    Approve Workflow
                  </button>
                  <button className="px-5 py-2.5 rounded-xl border border-border/60 text-muted-foreground font-medium hover:bg-secondary/50 hover:text-foreground transition-all">
                    Edit Workflow
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary/30 text-primary font-medium hover:bg-primary/5 transition-all">
                    <Sparkles className="w-4 h-4" />
                    Create New Workflow
                  </button>
                </>
              )}
            </div>

            {/* Info Notice */}
            {!accountApproved && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-warning/5 border border-warning/20">
                <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Approve account information first</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Account data must be verified before workflow can be activated.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Success State */}
          {accountApproved && workflowApproved && (
            <>
              <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Account successfully operationalized</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      All data, contracts, and workflows have been moved to Assets.
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-medium shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all">
                  View in Assets
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
    </div>
  );
};

export default OrchestratorNewPage;
