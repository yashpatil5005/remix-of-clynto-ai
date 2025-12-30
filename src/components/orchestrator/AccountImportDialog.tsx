import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Upload, Plus, RefreshCw, FileSpreadsheet, Database, Check } from 'lucide-react';

interface AccountImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountImportDialog: React.FC<AccountImportDialogProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bulk' | 'manual' | 'crm'>('bulk');
  const [uploading, setUploading] = useState(false);
  const [manualAccount, setManualAccount] = useState({
    name: '',
    segment: '',
    arr: '',
    source: 'manual',
  });

  const tabs = [
    { id: 'bulk', label: 'Bulk Upload', icon: FileSpreadsheet },
    { id: 'manual', label: 'Manual Entry', icon: Plus },
    { id: 'crm', label: 'CRM Sync', icon: Database },
  ] as const;

  const handleBulkUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40">
          <DialogTitle className="text-xl font-semibold">Add / Import Accounts</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Bulk Upload Tab */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "border-border/60 bg-secondary/20"
                )}
              >
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop your CSV or Excel file here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse files
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Supported formats: .csv, .xlsx, .xls</span>
                <a href="#" className="text-primary hover:underline">Download template</a>
              </div>

              <button
                onClick={handleBulkUpload}
                disabled={uploading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                  "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                )}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Import
                  </>
                )}
              </button>
            </div>
          )}

          {/* Manual Entry Tab */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Account Name</label>
                <input
                  type="text"
                  value={manualAccount.name}
                  onChange={(e) => setManualAccount(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter account name"
                  className="w-full px-4 py-2.5 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Segment</label>
                  <select
                    value={manualAccount.segment}
                    onChange={(e) => setManualAccount(prev => ({ ...prev, segment: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  >
                    <option value="">Select segment</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="mid-market">Mid-Market</option>
                    <option value="smb">SMB</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">ARR</label>
                  <input
                    type="text"
                    value={manualAccount.arr}
                    onChange={(e) => setManualAccount(prev => ({ ...prev, arr: e.target.value }))}
                    placeholder="$0"
                    className="w-full px-4 py-2.5 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                </div>
              </div>

              <button
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all mt-6",
                  "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                )}
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </div>
          )}

          {/* CRM Sync Tab */}
          {activeTab === 'crm' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sync accounts directly from your connected CRM system.
              </p>

              <div className="space-y-3">
                {[
                  { name: 'Salesforce', connected: true, accounts: 156 },
                  { name: 'HubSpot', connected: true, accounts: 89 },
                  { name: 'Zoho CRM', connected: false, accounts: 0 },
                ].map((crm) => (
                  <div
                    key={crm.name}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border transition-all",
                      crm.connected
                        ? "border-accent/30 bg-accent/5"
                        : "border-border/40 bg-secondary/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        crm.connected ? "bg-accent/15" : "bg-secondary"
                      )}>
                        <Database className={cn(
                          "w-5 h-5",
                          crm.connected ? "text-accent" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{crm.name}</p>
                        {crm.connected ? (
                          <p className="text-xs text-muted-foreground">
                            {crm.accounts} accounts available
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Not connected</p>
                        )}
                      </div>
                    </div>

                    {crm.connected ? (
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-all">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Sync Now
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                        Connect
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountImportDialog;
