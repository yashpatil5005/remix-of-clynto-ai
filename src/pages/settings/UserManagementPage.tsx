import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Pencil, Plus, X } from 'lucide-react';

const users = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah.mitchell@acme.com', role: 'Administrator', designation: 'VP Customer Success', initials: 'SM' },
  { id: 2, name: 'James Chen', email: 'james.chen@acme.com', role: 'Manager', designation: 'CS Team Lead', initials: 'JC' },
  { id: 3, name: 'Emily Rodriguez', email: 'emily.r@acme.com', role: 'Member', designation: 'Customer Success Manager', initials: 'ER' },
  { id: 4, name: 'Michael Park', email: 'm.park@acme.com', role: 'Member', designation: 'Customer Success Manager', initials: 'MP' },
  { id: 5, name: 'Lisa Thompson', email: 'l.thompson@acme.com', role: 'Viewer', designation: 'CS Associate', initials: 'LT' },
];

export default function UserManagementPage() {
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);

  return (
    <>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">User Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Team members and access control</p>
            </div>
            <Button onClick={() => setAddMemberOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Member
            </Button>
          </div>

          {/* Users List */}
          <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 divide-y divide-border/30">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
                {/* Profile Image */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary/70">{user.initials}</span>
                </div>
                
                {/* Name & Email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                
                {/* Role */}
                <div className="w-28 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    user.role === 'Administrator' ? 'bg-primary/10 text-primary' :
                    user.role === 'Manager' ? 'bg-blue-500/10 text-blue-400' :
                    user.role === 'Member' ? 'bg-muted text-muted-foreground' :
                    'bg-muted/50 text-muted-foreground'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                {/* Designation */}
                <div className="w-48 flex-shrink-0 hidden md:block">
                  <p className="text-xs text-muted-foreground truncate">{user.designation}</p>
                </div>
                
                {/* Edit */}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setEditingUser(user)}
                  className="text-xs text-muted-foreground hover:text-foreground flex-shrink-0"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Sheet */}
      <Sheet open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <SheetContent className="bg-card border-border/50">
          <SheetHeader>
            <SheetTitle>Add Team Member</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</Label>
              <Input className="mt-1 bg-background/50 border-border/50" placeholder="Enter name" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Email</Label>
              <Input className="mt-1 bg-background/50 border-border/50" type="email" placeholder="Enter email" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Designation</Label>
              <Input className="mt-1 bg-background/50 border-border/50" placeholder="Enter designation" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Role</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 flex gap-2">
              <Button className="flex-1">Send Invite</Button>
              <Button variant="outline" onClick={() => setAddMemberOpen(false)}>Cancel</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <SheetContent className="bg-card border-border/50">
          <SheetHeader>
            <SheetTitle>Edit Member</SheetTitle>
          </SheetHeader>
          {editingUser && (
            <div className="mt-6 space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</Label>
                <Input className="mt-1 bg-background/50 border-border/50" defaultValue={editingUser.name} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Email</Label>
                <Input className="mt-1 bg-background/50 border-border/50" type="email" defaultValue={editingUser.email} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Designation</Label>
                <Input className="mt-1 bg-background/50 border-border/50" defaultValue={editingUser.designation} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Role</Label>
                <Select defaultValue={editingUser.role.toLowerCase()}>
                  <SelectTrigger className="mt-1 bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 flex gap-2">
                <Button className="flex-1">Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
