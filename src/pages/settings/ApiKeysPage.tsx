import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AlertTriangle, Copy, Key, Plus, Trash2 } from 'lucide-react';

const apiKeys = [
  { id: 1, name: 'Production API Key', scope: 'Full Access', created: 'Dec 15, 2024', lastUsed: '2 hours ago', key: 'clynto_live_••••••••••••7x4k' },
  { id: 2, name: 'Reporting Integration', scope: 'Read Only', created: 'Nov 28, 2024', lastUsed: '1 day ago', key: 'clynto_live_••••••••••••9m2p' },
  { id: 3, name: 'Development Key', scope: 'Full Access', created: 'Oct 10, 2024', lastUsed: '5 days ago', key: 'clynto_test_••••••••••••3f8q' },
];

export default function ApiKeysPage() {
  const [generateOpen, setGenerateOpen] = useState(false);
  const [revokeConfirm, setRevokeConfirm] = useState<number | null>(null);

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">API Keys</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage secure programmatic access</p>
            </div>
            <Button onClick={() => setGenerateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Generate Key
            </Button>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-200/80">
              API keys provide full access to your account. Keep them secure and never share them publicly.
            </p>
          </div>

          {/* API Keys List */}
          <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 divide-y divide-border/30">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 border border-border/30 flex items-center justify-center mt-0.5">
                      <Key className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded">
                          {apiKey.key}
                        </code>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="text-right hidden sm:block">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        apiKey.scope === 'Full Access' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {apiKey.scope}
                      </span>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground">Created {apiKey.created}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Last used {apiKey.lastUsed}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setRevokeConfirm(apiKey.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Key Sheet */}
      <Sheet open={generateOpen} onOpenChange={setGenerateOpen}>
        <SheetContent className="bg-card border-border/50">
          <SheetHeader>
            <SheetTitle>Generate API Key</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Key Name</Label>
              <Input className="mt-1 bg-background/50 border-border/50" placeholder="e.g., Production API" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Scope</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="write">Write Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4">
              <Button className="w-full">Generate Key</Button>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                The key will only be shown once. Store it securely.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Revoke Confirmation */}
      <Sheet open={!!revokeConfirm} onOpenChange={() => setRevokeConfirm(null)}>
        <SheetContent className="bg-card border-border/50">
          <SheetHeader>
            <SheetTitle className="text-destructive">Revoke API Key</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. Any applications using this key will immediately lose access.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="destructive" className="flex-1">Revoke Key</Button>
              <Button variant="outline" onClick={() => setRevokeConfirm(null)}>Cancel</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
