import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ClyntoLogo from '@/components/ClyntoLogo';
import OnboardingLayout from '@/components/OnboardingLayout';
import { ArrowRight, Check, Loader2, Database, Building2, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface LegacyRecord {
  id: string;
  accountName: string;
  source: string;
  logo: string;
  data: { field: string; value: string }[];
  approved: boolean;
}

const PermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [records, setRecords] = useState<LegacyRecord[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate fetching legacy records
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timer = setTimeout(() => {
      setFetching(false);
      setRecords([
        {
          id: '1',
          accountName: 'Acme Corporation',
          source: 'HubSpot',
          logo: '🔶',
          data: [
            { field: 'Contact Count', value: '234' },
            { field: 'Deal Value', value: '$125,000' },
            { field: 'Last Activity', value: '2 days ago' },
          ],
          approved: false,
        },
        {
          id: '2',
          accountName: 'TechStart Inc',
          source: 'Mixpanel',
          logo: '🟣',
          data: [
            { field: 'Active Users', value: '1,234' },
            { field: 'Sessions', value: '45,678' },
            { field: 'Avg Duration', value: '8m 32s' },
          ],
          approved: false,
        },
        {
          id: '3',
          accountName: 'Global Solutions Ltd',
          source: 'Stripe',
          logo: '💳',
          data: [
            { field: 'MRR', value: '$45,000' },
            { field: 'Status', value: 'Active' },
            { field: 'Next Invoice', value: 'Jan 15, 2025' },
          ],
          approved: false,
        },
        {
          id: '4',
          accountName: 'DataFlow Systems',
          source: 'HubSpot',
          logo: '🔶',
          data: [
            { field: 'Contact Count', value: '89' },
            { field: 'Deal Value', value: '$78,500' },
            { field: 'Last Activity', value: '1 week ago' },
          ],
          approved: false,
        },
        {
          id: '5',
          accountName: 'CloudNine Software',
          source: 'Stripe',
          logo: '💳',
          data: [
            { field: 'MRR', value: '$12,500' },
            { field: 'Status', value: 'Active' },
            { field: 'Next Invoice', value: 'Jan 20, 2025' },
          ],
          approved: false,
        },
      ]);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const approveRecord = (id: string) => {
    setRecords(prev => prev.map(r =>
      r.id === id ? { ...r, approved: true } : r
    ));
    toast.success('Record approved!');
  };

  const approveAll = () => {
    setRecords(prev => prev.map(r => ({ ...r, approved: true })));
    toast.success('All records approved!');
  };

  const handleNext = () => {
    navigate('/welcome');
  };

  const handleSkip = () => {
    navigate('/welcome');
  };

  const allApproved = records.every(r => r.approved);

  return (
    <OnboardingLayout showProgress currentStep={8} className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <ClyntoLogo size="sm" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Final Permission</h1>
          <p className="text-muted-foreground">Review and approve your legacy records</p>
        </div>

        {fetching ? (
          <Card variant="glass" className="p-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Fetching Legacy Records</h2>
            <p className="text-muted-foreground mb-6">This will take 2-3 minutes...</p>
            <div className="w-full max-w-md mx-auto h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
          </Card>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={approveAll} disabled={allApproved}>
                <Check className="w-4 h-4 mr-2" />
                Approve All
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {records.map((record) => (
                <Card
                  key={record.id}
                  variant="glass"
                  className={`transition-all duration-300 ${
                    record.approved ? 'ring-2 ring-accent bg-accent/5' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{record.logo}</span>
                        <span className="text-sm text-muted-foreground">{record.source}</span>
                      </div>
                      {record.approved && (
                        <span className="flex items-center gap-1 text-xs text-accent">
                          <Check className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {record.accountName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {record.data.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.field}</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    {!record.approved && (
                      <Button
                        variant="accent"
                        size="sm"
                        className="w-full"
                        onClick={() => approveRecord(record.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between mt-10">
              <Button variant="ghost" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button variant="gradient" size="lg" onClick={handleNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </OnboardingLayout>
  );
};

export default PermissionsPage;
