import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

const attributeGroups = [
  {
    category: 'Account Master Data',
    attributes: [
      { name: 'Company Name', type: 'String' },
      { name: 'Industry', type: 'String' },
      { name: 'Company Size', type: 'Number' },
      { name: 'Contract Start Date', type: 'Date' },
      { name: 'Contract End Date', type: 'Date' },
    ]
  },
  {
    category: 'Engagement',
    attributes: [
      { name: 'Last Login', type: 'Date' },
      { name: 'Active Users', type: 'Number' },
      { name: 'Session Count', type: 'Number' },
      { name: 'Primary Contact', type: 'String' },
    ]
  },
  {
    category: 'Utilization',
    attributes: [
      { name: 'Feature Usage Score', type: 'Number' },
      { name: 'API Calls', type: 'Number' },
      { name: 'Storage Used', type: 'Number' },
      { name: 'Peak Usage Time', type: 'String' },
    ]
  },
  {
    category: 'Renewal',
    attributes: [
      { name: 'Renewal Date', type: 'Date' },
      { name: 'Renewal Probability', type: 'Number' },
      { name: 'Contract Value', type: 'Number' },
      { name: 'Renewal Owner', type: 'String' },
    ]
  },
  {
    category: 'Billing',
    attributes: [
      { name: 'ARR', type: 'Number' },
      { name: 'Billing Frequency', type: 'String' },
      { name: 'Payment Method', type: 'String' },
      { name: 'Last Payment Date', type: 'Date' },
    ]
  },
];

export default function DataModelerPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(attributeGroups.map(g => g.category));

  const toggleGroup = (category: string) => {
    setExpandedGroups(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Data Modeler</h1>
              <p className="text-sm text-muted-foreground mt-1">Account attributes and schema</p>
            </div>
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Attribute
            </Button>
          </div>

          {/* Attribute Groups */}
          <div className="space-y-3">
            {attributeGroups.map((group) => {
              const isExpanded = expandedGroups.includes(group.category);
              return (
                <div key={group.category} className="bg-card/30 backdrop-blur-sm rounded-lg border border-border/30 overflow-hidden">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(group.category)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium text-foreground">{group.category}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{group.attributes.length} attributes</span>
                  </button>

                  {/* Attributes */}
                  {isExpanded && (
                    <div className="border-t border-border/30">
                      {group.attributes.map((attr, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between px-4 py-3 pl-11 border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors"
                        >
                          <span className="text-sm text-foreground">{attr.name}</span>
                          <span className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded">
                            {attr.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Attribute Sheet */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="bg-card border-border/50">
          <SheetHeader>
            <SheetTitle>Add Attribute</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Attribute Name</Label>
              <Input className="mt-1 bg-background/50 border-border/50" placeholder="e.g., Customer Segment" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Data Type</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Category</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master">Account Master Data</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="utilization">Utilization</SelectItem>
                  <SelectItem value="renewal">Renewal</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 flex gap-2">
              <Button className="flex-1">Add Attribute</Button>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
