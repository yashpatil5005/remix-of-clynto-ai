import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Check, Pencil } from 'lucide-react';

export default function ProfilePage() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@acme.com',
    password: '••••••••••••',
    designation: 'Customer Success Manager',
    accessLevel: 'Administrator'
  });

  const handleSave = (field: string) => {
    setEditingField(null);
    setSaved(field);
    setTimeout(() => setSaved(null), 2000);
  };

  const renderField = (key: string, label: string, readonly = false) => {
    const isEditing = editingField === key;
    const isSaved = saved === key;
    
    return (
      <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">{label}</Label>
          {isEditing ? (
            <Input
              value={profile[key as keyof typeof profile]}
              onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              className="mt-1 max-w-md bg-background/50 border-border/50"
              type={key === 'password' ? 'password' : 'text'}
              autoFocus
            />
          ) : (
            <p className="mt-1 text-foreground font-medium">{profile[key as keyof typeof profile]}</p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
          {!readonly && (
            isEditing ? (
              <Button size="sm" variant="ghost" onClick={() => handleSave(key)} className="text-xs">
                Save
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setEditingField(key)} className="text-xs text-muted-foreground hover:text-foreground">
                <Pencil className="h-3 w-3 mr-1" /> Edit
              </Button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Personal account information and access</p>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Profile Picture */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border/50 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl font-semibold text-primary/60">SM</span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-background border border-border/50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <button className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Change photo
              </button>
            </div>

            {/* Right - Profile Fields */}
            <div className="lg:col-span-2">
              <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 p-6">
                {renderField('name', 'Full Name')}
                {renderField('email', 'Email Address')}
                {renderField('password', 'Password')}
                {renderField('designation', 'Designation')}
                {renderField('accessLevel', 'Access Level', true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
