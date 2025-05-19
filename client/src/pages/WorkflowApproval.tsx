import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import BudgetApproval from '@/components/workflow/BudgetApproval';
import { 
  ClipboardList, 
  ClipboardCheck, 
  FileSpreadsheet, 
  CalendarClock,
  Loader2
} from 'lucide-react';

// Defining interfaces for report scheduling
interface ScheduledReport {
  id: number;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated?: Date;
  nextScheduled: Date;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
}

// Mock user data
const currentUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Finance Manager',
  department: 'Finance'
};

const WorkflowApproval = () => {
  const [activeTab, setActiveTab] = useState('budget-approvals');
  const { toast } = useToast();

  // Get user data
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    }
  });

  // Mock scheduled reports data
  const scheduledReports: ScheduledReport[] = [
    {
      id: 1,
      name: 'Monthly Financial Statement',
      description: 'Comprehensive financial statement with P&L, balance sheet, and cash flow',
      frequency: 'monthly',
      lastGenerated: new Date('2023-09-01'),
      nextScheduled: new Date('2023-10-01'),
      recipients: ['finance-team@example.com', 'executive-committee@example.com'],
      format: 'pdf',
      isActive: true
    },
    {
      id: 2,
      name: 'Weekly Cash Flow Report',
      description: 'Weekly cash flow analysis and projections',
      frequency: 'weekly',
      lastGenerated: new Date('2023-09-22'),
      nextScheduled: new Date('2023-09-29'),
      recipients: ['treasury@example.com', 'cfo@example.com'],
      format: 'excel',
      isActive: true
    },
    {
      id: 3,
      name: 'Quarterly Budget vs Actual',
      description: 'Detailed comparison of budgeted amounts against actual expenditures',
      frequency: 'quarterly',
      lastGenerated: new Date('2023-07-01'),
      nextScheduled: new Date('2023-10-01'),
      recipients: ['department-heads@example.com', 'finance-team@example.com'],
      format: 'excel',
      isActive: true
    }
  ];

  // Demo handler for approval actions
  const handleApproveRequest = (requestId: number, stepId: number, comments?: string) => {
    toast({
      title: "Request approved",
      description: "The budget request has moved to the next approval step.",
    });
  };

  // Demo handler for rejection actions
  const handleRejectRequest = (requestId: number, stepId: number, comments: string) => {
    toast({
      title: "Request rejected",
      description: "The budget request has been rejected and the requestor has been notified.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workflow Automation</h1>
        <p className="text-neutral-600">
          Manage approval workflows, scheduled reports, and automated validation rules
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="budget-approvals" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            <span>Budget Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled-reports" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Scheduled Reports</span>
          </TabsTrigger>
          <TabsTrigger value="validation-rules" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Validation Rules</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budget-approvals" className="mt-6">
          {isUserLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <BudgetApproval 
              currentUser={userData || currentUser}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          )}
        </TabsContent>

        <TabsContent value="scheduled-reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Report Generation</CardTitle>
              <CardDescription>
                Configure automated report generation and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md divide-y">
                  {scheduledReports.map((report) => (
                    <div key={report.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-base">{report.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1">
                              <CalendarClock className="h-3 w-3 mr-1" />
                              <span>{report.frequency}</span>
                            </div>
                            
                            <div className="flex items-center text-xs bg-green-50 text-green-700 rounded-full px-2 py-1">
                              <FileSpreadsheet className="h-3 w-3 mr-1" />
                              <span>{report.format.toUpperCase()}</span>
                            </div>
                            
                            <div className="flex items-center text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-1">
                              <span>{report.recipients.length} recipients</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm">
                            Next run: <span className="font-medium">
                              {report.nextScheduled.toLocaleDateString()}
                            </span>
                          </div>
                          {report.lastGenerated && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Last generated: {report.lastGenerated.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation-rules" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Validation Rules</CardTitle>
              <CardDescription>
                Configure automated validation rules and notifications for financial data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md divide-y">
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium text-base">Budget Variance Check</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Validates that department expenses don't exceed 110% of allocated budget
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium text-base">Missing Receipt Alert</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notifies when expenses over $500 are submitted without receipts
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium text-base">Revenue Forecast Validation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Checks that quarterly revenue forecasts are based on historical data and current pipeline
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium text-base">Duplicate Transaction Check</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Identifies potential duplicate transactions based on amount, date, and vendor
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowApproval;