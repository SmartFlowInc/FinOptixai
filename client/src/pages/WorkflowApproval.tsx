import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import BudgetApproval from '@/components/workflow/BudgetApproval';
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  ClipboardList, 
  ClipboardCheck, 
  FileSpreadsheet, 
  CalendarClock,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCw,
  FileEdit,
  UserCircle,
  Clock,
  Calendar,
  BarChart,
  Settings,
  Filter,
  Plus,
  Search,
  ArrowRight,
  MessageSquare,
  Lock,
  Zap,
  FileText,
  Check,
  Bell
} from 'lucide-react';

// Define interfaces for approval requests
interface ApprovalRequest {
  id: number;
  title: string;
  requestor: string;
  requestorDepartment: string;
  dateSubmitted: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  currentApprover?: string;
  approvalStep: number;
  totalSteps: number;
  priority: 'high' | 'medium' | 'low';
  documents: number;
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionReason?: string;
}

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

// Sample approval requests
const approvalRequests = [
  {
    id: 1,
    title: "Marketing Budget Increase",
    requestor: "Sarah Chen",
    requestorDepartment: "Marketing",
    dateSubmitted: "2025-05-15",
    amount: 45000,
    description: "Additional budget required for Q3 digital marketing campaign",
    status: "pending",
    currentApprover: "John Doe",
    approvalStep: 2,
    totalSteps: 3,
    priority: "high",
    documents: 2
  },
  {
    id: 2,
    title: "IT Infrastructure Upgrade",
    requestor: "David Kim",
    requestorDepartment: "Information Technology",
    dateSubmitted: "2025-05-14",
    amount: 120000,
    description: "Server and network equipment upgrades for main office",
    status: "pending",
    currentApprover: "John Doe",
    approvalStep: 1,
    totalSteps: 3,
    priority: "medium",
    documents: 5
  },
  {
    id: 3,
    title: "Research Project Funding",
    requestor: "Michael Park",
    requestorDepartment: "Research & Development",
    dateSubmitted: "2025-05-10",
    amount: 85000,
    description: "Funding for new product research initiative",
    status: "pending",
    currentApprover: "John Doe",
    approvalStep: 2,
    totalSteps: 4,
    priority: "high",
    documents: 3
  },
  {
    id: 4,
    title: "Sales Conference Expenses",
    requestor: "James Peterson",
    requestorDepartment: "Sales",
    dateSubmitted: "2025-05-18",
    amount: 35000,
    description: "Budget for annual sales conference and team building",
    status: "approved",
    approvedBy: "John Doe",
    approvedDate: "2025-05-19",
    approvalStep: 3,
    totalSteps: 3,
    priority: "medium",
    documents: 1
  },
  {
    id: 5,
    title: "Office Renovation Project",
    requestor: "Emily Rodriguez",
    requestorDepartment: "Operations",
    dateSubmitted: "2025-05-05",
    amount: 180000,
    description: "Main office renovation and furniture update",
    status: "rejected",
    rejectedBy: "John Doe",
    rejectedDate: "2025-05-08",
    rejectionReason: "Insufficient budget justification and incomplete cost breakdown",
    approvalStep: 2,
    totalSteps: 3,
    priority: "low",
    documents: 4
  }
];

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
      lastGenerated: new Date('2025-05-01'),
      nextScheduled: new Date('2025-06-01'),
      recipients: ['finance-team@example.com', 'executive-committee@example.com'],
      format: 'pdf',
      isActive: true
    },
    {
      id: 2,
      name: 'Weekly Cash Flow Report',
      description: 'Weekly cash flow analysis and projections',
      frequency: 'weekly',
      lastGenerated: new Date('2025-05-17'),
      nextScheduled: new Date('2025-05-24'),
      recipients: ['treasury@example.com', 'cfo@example.com'],
      format: 'excel',
      isActive: true
    },
    {
      id: 3,
      name: 'Quarterly Budget vs Actual',
      description: 'Detailed comparison of budgeted amounts against actual expenditures',
      frequency: 'quarterly',
      lastGenerated: new Date('2025-03-31'),
      nextScheduled: new Date('2025-06-30'),
      recipients: ['department-heads@example.com', 'finance-team@example.com'],
      format: 'excel',
      isActive: true
    },
    {
      id: 4,
      name: 'Daily Sales Report',
      description: 'Daily summary of sales performance across all channels',
      frequency: 'daily',
      lastGenerated: new Date('2025-05-19'),
      nextScheduled: new Date('2025-05-20'),
      recipients: ['sales-leadership@example.com', 'revenue-ops@example.com'],
      format: 'pdf',
      isActive: false
    }
  ];

  // Sample validation rules
  const validationRules = [
    {
      id: 1,
      name: "Budget Variance Check",
      description: "Validates that department expenses don't exceed 110% of allocated budget",
      type: "financial",
      status: "active",
      lastUpdated: "2025-04-15",
      totalExecutions: 458,
      alerts: 23,
      severity: "high"
    },
    {
      id: 2,
      name: "Missing Receipt Alert",
      description: "Notifies when expenses over $500 are submitted without receipts",
      type: "compliance",
      status: "active",
      lastUpdated: "2025-03-22",
      totalExecutions: 1245,
      alerts: 78,
      severity: "medium"
    },
    {
      id: 3,
      name: "Revenue Forecast Validation",
      description: "Checks that quarterly revenue forecasts are based on historical data and current pipeline",
      type: "financial",
      status: "active",
      lastUpdated: "2025-05-05",
      totalExecutions: 64,
      alerts: 8,
      severity: "high"
    },
    {
      id: 4,
      name: "Duplicate Transaction Check",
      description: "Identifies potential duplicate transactions based on amount, date, and vendor",
      type: "financial",
      status: "active",
      lastUpdated: "2025-04-30",
      totalExecutions: 2340,
      alerts: 45,
      severity: "medium"
    },
    {
      id: 5,
      name: "Approval Policy Enforcement",
      description: "Ensures all expenses above $10,000 have proper approval documentation",
      type: "compliance",
      status: "active",
      lastUpdated: "2025-02-28",
      totalExecutions: 328,
      alerts: 12,
      severity: "critical"
    }
  ];

  // Stats for the premium header
  const headerStats = [
    {
      title: "Pending Approvals",
      value: "3",
      icon: <ClipboardCheck className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Scheduled Reports",
      value: "4",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Active Rules",
      value: "5",
      icon: <ClipboardList className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      title: "Alerts (Last 7 Days)",
      value: "38",
      icon: <Bell className="h-5 w-5" />,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-600"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Settings className="mr-2 h-4 w-4" />
        Configure
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        New Workflow
      </Button>
    </>
  );

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

  // Helper function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-50 text-red-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-50 text-amber-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-slate-100 text-slate-700">Low</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{priority}</Badge>;
    }
  };

  // Helper function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-50 text-red-700">Critical</Badge>;
      case 'high':
        return <Badge className="bg-amber-50 text-amber-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-50 text-blue-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-slate-100 text-slate-700">Low</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{severity}</Badge>;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-50 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-slate-100 text-slate-700">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-amber-50 text-amber-700">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-50 text-green-700">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700">Rejected</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  return (
    <>
      <PremiumPageHeader
        title="Workflow Automation"
        description="Manage approval workflows, scheduled reports, and automated validation rules"
        icon={<Zap className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="budget-approvals" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Budget Approvals
          </TabsTrigger>
          <TabsTrigger value="scheduled-reports" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Scheduled Reports
          </TabsTrigger>
          <TabsTrigger value="validation-rules" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <ClipboardList className="h-4 w-4 mr-2" />
            Validation Rules
          </TabsTrigger>
          <TabsTrigger value="workflow-settings" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4 mr-2" />
            Workflow Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budget-approvals" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search requests..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
          
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Pending Approvals</h3>
                  <p className="text-sm text-slate-500">Budget requests awaiting your approval</p>
                </div>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {approvalRequests
                  .filter(req => req.status === 'pending')
                  .map((request) => (
                    <div key={request.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                            request.priority === 'high' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                            request.priority === 'medium' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                            'bg-gradient-to-br from-blue-500 to-blue-600'
                          } shadow-md`}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{request.title}</h4>
                            <p className="text-sm text-slate-600 mb-2">{request.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {getPriorityBadge(request.priority)}
                              <Badge className="bg-blue-50 text-blue-700">Step {request.approvalStep} of {request.totalSteps}</Badge>
                              <Badge className="bg-slate-100 text-slate-700">{request.requestorDepartment}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <UserCircle className="h-3.5 w-3.5" />
                                <span>{request.requestor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{new Date(request.dateSubmitted).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                <span>{request.documents} document{request.documents !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="bg-slate-50 px-4 py-2 rounded-lg font-semibold text-[#0F1829]">
                            ${request.amount.toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 border-green-200 text-green-600 hover:bg-green-50">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                              <span className="text-xs">Approve</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                              <XCircle className="h-3.5 w-3.5 mr-1.5" />
                              <span className="text-xs">Reject</span>
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-slate-500">
                              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                              <span className="text-xs">Comment</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </PremiumCard>
          
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <p className="text-sm text-slate-500">Recent approval decisions</p>
                </div>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {approvalRequests
                  .filter(req => req.status === 'approved' || req.status === 'rejected')
                  .map((request) => (
                    <div key={request.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                            request.status === 'approved' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                            'bg-gradient-to-br from-red-500 to-red-600'
                          } shadow-md`}>
                            {request.status === 'approved' ? 
                              <CheckCircle2 className="h-5 w-5" /> : 
                              <XCircle className="h-5 w-5" />
                            }
                          </div>
                          <div>
                            <h4 className="font-medium">{request.title}</h4>
                            <p className="text-sm text-slate-600 mb-2">{request.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {getStatusBadge(request.status)}
                              {getPriorityBadge(request.priority)}
                              <Badge className="bg-slate-100 text-slate-700">{request.requestorDepartment}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <UserCircle className="h-3.5 w-3.5" />
                                <span>{request.requestor}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{request.status === 'approved' && request.approvedDate ? 
                                  `Approved on ${new Date(request.approvedDate).toLocaleDateString()}` : 
                                  request.status === 'rejected' && request.rejectedDate ?
                                  `Rejected on ${new Date(request.rejectedDate).toLocaleDateString()}` :
                                  `${request.status.charAt(0).toUpperCase() + request.status.slice(1)}`
                                }</span>
                              </div>
                            </div>
                            {request.status === 'rejected' && request.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-lg">
                                Reason: {request.rejectionReason}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="bg-slate-50 px-4 py-2 rounded-lg font-semibold text-[#0F1829]">
                            ${request.amount.toLocaleString()}
                          </div>
                          <Button variant="outline" size="sm" className="h-8">
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs">View Details</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </PremiumCard>
          
          {isUserLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          <div className="hidden">
            <BudgetApproval 
              currentUser={userData || currentUser}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          </div>
        </TabsContent>

        <TabsContent value="scheduled-reports" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search reports..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {scheduledReports.map((report) => (
              <PremiumCard
                key={report.id}
                className="hover-lift"
                showAccent={true}
                accentColor={report.isActive ? 'from-green-500 to-green-600' : 'from-slate-400 to-slate-500'}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                        report.format === 'pdf' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        report.format === 'excel' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                        'bg-gradient-to-br from-blue-500 to-blue-600'
                      } shadow-md`}>
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{report.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                    
                    <Badge className={report.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'}>
                      {report.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      <span>{report.frequency}</span>
                    </div>
                    
                    <div className="flex items-center text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-1">
                      <FileSpreadsheet className="h-3 w-3 mr-1" />
                      <span>{report.format.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex items-center text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-1">
                      <span>{report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Next Scheduled</div>
                      <div className="font-medium">
                        {report.nextScheduled.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Last Generated</div>
                      <div className="font-medium">
                        {report.lastGenerated ? report.lastGenerated.toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">Status</div>
                      <Switch checked={report.isActive} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                        <FileEdit className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs">Run Now</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
          
          <PremiumCard
            className="hover-lift"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div>
                <h3 className="text-lg font-semibold">Create Scheduled Report</h3>
                <p className="text-sm text-slate-500">Set up a new scheduled report</p>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input id="report-name" placeholder="Enter report name" />
                  </div>
                  
                  <div>
                    <Label htmlFor="report-description">Description</Label>
                    <Input id="report-description" placeholder="Enter report description" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-recipients">Recipients</Label>
                    <Input id="report-recipients" placeholder="Enter email addresses (comma separated)" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  <Check className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>

        <TabsContent value="validation-rules" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search rules..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </div>
          </div>
          
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
          >
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Rule Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Severity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Executions</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Alerts</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validationRules.map((rule) => (
                      <tr key={rule.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-xs text-slate-500">{rule.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize bg-slate-50">{rule.type}</Badge>
                        </td>
                        <td className="py-3 px-4">{getSeverityBadge(rule.severity)}</td>
                        <td className="py-3 px-4">{getStatusBadge(rule.status)}</td>
                        <td className="py-3 px-4 text-slate-600">{rule.totalExecutions.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              rule.alerts > 20 ? 'bg-red-50 text-red-700' :
                              rule.alerts > 10 ? 'bg-amber-50 text-amber-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {rule.alerts}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                              <FileEdit className="h-3.5 w-3.5 mr-1.5" />
                              <span className="text-xs">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PremiumCard>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PremiumCard className="hover-lift">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rules Performance</h3>
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <BarChart className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-xs">Rules Performance Chart</p>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </div>
        </TabsContent>
        
        <TabsContent value="workflow-settings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PremiumCard 
                className="hover-lift mb-6"
                showAccent={true}
                accentColor="from-[#2D71A8] to-[#4D8EC3]"
                headerContent={
                  <div>
                    <h3 className="text-lg font-semibold">Workflow Configuration</h3>
                    <p className="text-sm text-slate-500">Global settings for workflow automation</p>
                  </div>
                }
              >
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium mb-3 pb-2 border-b">Approval Settings</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-sm">Auto-Escalation</div>
                              <div className="text-xs text-slate-500">Escalate pending approvals after timeout</div>
                            </div>
                            <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                              <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-medium mb-3 pb-2 border-b">Notification Settings</h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-sm">Email Notifications</div>
                              <div className="text-xs text-slate-500">Send email notifications</div>
                            </div>
                            <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                              <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-md font-medium mb-3 pb-2 border-b">Workflow Administrators</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                            JD
                          </div>
                          <div>
                            <div className="font-medium">John Doe</div>
                            <div className="text-xs text-slate-500">Finance Manager</div>
                          </div>
                        </div>
                        <Badge>Primary</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                            SC
                          </div>
                          <div>
                            <div className="font-medium">Sarah Chen</div>
                            <div className="text-xs text-slate-500">CFO</div>
                          </div>
                        </div>
                        <Badge>Admin</Badge>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-4 border-[#2D71A8] text-[#2D71A8]">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Add Administrator</span>
                    </Button>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                      <Check className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </PremiumCard>
            </div>
            
            <div className="space-y-6">
              <PremiumCard className="hover-lift">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Workflow Audit Log</h3>
                  <div className="space-y-3">
                    <div className="p-2 border rounded-lg hover:bg-slate-50">
                      <div className="text-xs text-slate-500">Today at 2:45 PM</div>
                      <div className="text-sm font-medium">Budget request approved</div>
                      <div className="text-xs text-slate-600">Sales Conference Expenses - John Doe</div>
                    </div>
                    
                    <div className="p-2 border rounded-lg hover:bg-slate-50">
                      <div className="text-xs text-slate-500">Today at 11:30 AM</div>
                      <div className="text-sm font-medium">Validation rule modified</div>
                      <div className="text-xs text-slate-600">Budget Variance Check - Sarah Chen</div>
                    </div>
                    
                    <div className="p-2 border rounded-lg hover:bg-slate-50">
                      <div className="text-xs text-slate-500">Yesterday at 4:15 PM</div>
                      <div className="text-sm font-medium">Budget request rejected</div>
                      <div className="text-xs text-slate-600">Office Renovation Project - John Doe</div>
                    </div>
                    
                    <div className="p-2 border rounded-lg hover:bg-slate-50">
                      <div className="text-xs text-slate-500">Yesterday at 10:20 AM</div>
                      <div className="text-sm font-medium">Scheduled report created</div>
                      <div className="text-xs text-slate-600">Daily Sales Report - Michael Park</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View Full Audit Log
                  </Button>
                </div>
              </PremiumCard>
              
              <PremiumCard className="hover-lift">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Approval Workflows</div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm font-medium">Operational</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Report Scheduling</div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm font-medium">Operational</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Validation Rules</div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm font-medium">Operational</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Email Notifications</div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                        <div className="text-sm font-medium">Degraded</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">Mobile Notifications</div>
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm font-medium">Operational</div>
                      </div>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

function Minus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PieChart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

export default WorkflowApproval;