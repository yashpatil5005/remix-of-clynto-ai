import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, ArrowLeft, UserPlus, Trash2, Upload, Mail, User, Briefcase, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  designation: string;
  role: string;
  phone: string;
}

const InviteUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: '', email: '', designation: '', role: 'member', phone: '' },
  ]);

  const addMember = () => {
    setMembers(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', email: '', designation: '', role: 'member', phone: '' },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length === 1) return;
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setMembers(prev => prev.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSubmit = () => {
    const validMembers = members.filter(m => m.name && m.email);
    if (validMembers.length === 0) {
      toast.error('Please add at least one team member with name and email');
      return;
    }
    toast.success(`${validMembers.length} team member(s) invited!`);
    navigate('/permissions');
  };

  const handleUpload = () => {
    toast.info('Upload feature coming soon!');
  };

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'member', label: 'Member' },
    { value: 'viewer', label: 'Viewer' },
  ];

  return (
    <OnboardingLayout showProgress currentStep={7} className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <ClyntoLogo size="sm" />
          <Button variant="outline" size="sm" onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Users
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Invite Your Team</h1>
          <p className="text-muted-foreground">Add team members to collaborate on Clynto AI</p>
        </div>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 rounded-xl bg-secondary/30 animate-scale-in"
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Designation"
                    value={member.designation}
                    onChange={(e) => updateMember(member.id, 'designation', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={member.role}
                    onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-input bg-card/50 backdrop-blur-sm pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Phone (optional)"
                    value={member.phone}
                    onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => removeMember(member.id)}
                    disabled={members.length === 1}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addMember} className="w-full mt-4">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Another Member
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-10">
          <Button variant="ghost" onClick={() => navigate('/add-team-prompt')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="gradient" size="lg" onClick={handleSubmit}>
            Submit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default InviteUsersPage;
