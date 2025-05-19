import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Eye, 
  FileText, 
  FilterX, 
  History, 
  RefreshCw, 
  Timer, 
  User, 
  Users,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ApprovalStep {
  id: number;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected' | 'waiting';
  approver?: {
    name: string;
    avatarUrl?: string;
  };
  approvedAt?: Date;
  comments?: string;
}

interface BudgetRequest {
  id: number;
  title: string;
  department: string;
  amount: number;
  currentAmount?: number;
  changePercentage: number;
  requestedBy: {
    name: string;
    avatarUrl?: string;
  };
  requestedAt: Date;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  description: string;
  category: string;
  timeline: string;
  reason: string;
  approvalSteps: ApprovalStep[];
  history?: {
    action: string;
    user: string;
    timestamp: Date;
    comments?: string;
  }[];
  documents?: {
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
}

interface BudgetApprovalProps {
  currentUser: {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
  };
  onApprove: (requestId: number, stepId: number, comments?: string) => void;
  onReject: (requestId: number, stepId: number, comments: string) => void;
}

// Helper to calculate status percentage
const calculateProgress = (steps: ApprovalStep[]): number => {
  if (steps.length === 0) return 0;
  
  const completedSteps = steps.filter(step => step.status === 'approved').length;
  return Math.round((completedSteps / steps.length) * 100);
};

// Mock data for budget requests
const mockBudgetRequests: BudgetRequest[] = [
  {
    id: 1,
    title: 'Marketing Campaign Budget Increase',
    department: 'Marketing',
    amount: 75000,
    currentAmount: 50000,
    changePercentage: 50,
    requestedBy: {
      name: 'Jane Smith',
      avatarUrl: '',
    },
    requestedAt: new Date('2023-09-10'),
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2023-09-25'),
    description: 'Request to increase the Q4 marketing campaign budget to target new market segments.',
    category: 'Campaign',
    timeline: 'Q4 2023',
    reason: 'The additional budget will allow us to expand into two new channels that have shown promising results in our pilot tests.',
    approvalSteps: [
      {
        id: 1,
        name: 'Department Head',
        role: 'Marketing Director',
        status: 'approved',
        approver: {
          name: 'Michael Brown',
        },
        approvedAt: new Date('2023-09-12'),
        comments: 'The expansion plan looks solid, approved.'
      },
      {
        id: 2,
        name: 'Finance Review',
        role: 'Finance Manager',
        status: 'pending',
        approver: {
          name: 'John Doe',
        }
      },
      {
        id: 3,
        name: 'Executive Approval',
        role: 'CFO',
        status: 'waiting',
      }
    ],
    history: [
      {
        action: 'Request Created',
        user: 'Jane Smith',
        timestamp: new Date('2023-09-10T10:30:00'),
      },
      {
        action: 'Approved by Department Head',
        user: 'Michael Brown',
        timestamp: new Date('2023-09-12T14:15:00'),
        comments: 'The expansion plan looks solid, approved.'
      }
    ],
    documents: [
      {
        name: 'Marketing_Campaign_Details.pdf',
        url: '#',
        uploadedAt: new Date('2023-09-10T10:30:00'),
      },
      {
        name: 'ROI_Projection.xlsx',
        url: '#',
        uploadedAt: new Date('2023-09-10T10:30:00'),
      }
    ]
  },
  {
    id: 2,
    title: 'IT Infrastructure Upgrade Budget',
    department: 'IT',
    amount: 120000,
    currentAmount: 80000,
    changePercentage: 50,
    requestedBy: {
      name: 'Robert Chen',
      avatarUrl: '',
    },
    requestedAt: new Date('2023-09-08'),
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date('2023-09-30'),
    description: 'Budget request for upgrading our server infrastructure and implementing improved security measures.',
    category: 'Infrastructure',
    timeline: 'Q4 2023 - Q1 2024',
    reason: 'Our current infrastructure is approaching end-of-life and requires upgrades to support growing business needs and enhance security.',
    approvalSteps: [
      {
        id: 1,
        name: 'Department Head',
        role: 'IT Director',
        status: 'approved',
        approver: {
          name: 'Sarah Williams',
        },
        approvedAt: new Date('2023-09-09'),
        comments: 'This upgrade is critical for our operations.'
      },
      {
        id: 2,
        name: 'Finance Review',
        role: 'Finance Manager',
        status: 'approved',
        approver: {
          name: 'John Doe',
        },
        approvedAt: new Date('2023-09-14'),
        comments: 'Reviewed the costs, they are in line with market rates.'
      },
      {
        id: 3,
        name: 'Executive Approval',
        role: 'CFO',
        status: 'pending',
      }
    ],
    history: [
      {
        action: 'Request Created',
        user: 'Robert Chen',
        timestamp: new Date('2023-09-08T09:45:00'),
      },
      {
        action: 'Approved by Department Head',
        user: 'Sarah Williams',
        timestamp: new Date('2023-09-09T11:20:00'),
        comments: 'This upgrade is critical for our operations.'
      },
      {
        action: 'Approved by Finance',
        user: 'John Doe',
        timestamp: new Date('2023-09-14T15:30:00'),
        comments: 'Reviewed the costs, they are in line with market rates.'
      }
    ],
    documents: [
      {
        name: 'IT_Infrastructure_Proposal.pdf',
        url: '#',
        uploadedAt: new Date('2023-09-08T09:45:00'),
      },
      {
        name: 'Vendor_Quotes.pdf',
        url: '#',
        uploadedAt: new Date('2023-09-08T09:45:00'),
      }
    ]
  },
  {
    id: 3,
    title: 'Product Development Research Budget',
    department: 'R&D',
    amount: 200000,
    currentAmount: 150000,
    changePercentage: 33.33,
    requestedBy: {
      name: 'Emily Wilson',
      avatarUrl: '',
    },
    requestedAt: new Date('2023-09-05'),
    status: 'approved',
    priority: 'high',
    dueDate: new Date('2023-09-15'),
    description: 'Additional budget for research and development of our next-generation product line.',
    category: 'Research',
    timeline: 'Q4 2023 - Q2 2024',
    reason: 'The additional funding will accelerate our research timeline and help us stay competitive with emerging market trends.',
    approvalSteps: [
      {
        id: 1,
        name: 'Department Head',
        role: 'R&D Director',
        status: 'approved',
        approver: {
          name: 'David Thompson',
        },
        approvedAt: new Date('2023-09-06'),
        comments: 'This research is vital for our product roadmap.'
      },
      {
        id: 2,
        name: 'Finance Review',
        role: 'Finance Manager',
        status: 'approved',
        approver: {
          name: 'John Doe',
        },
        approvedAt: new Date('2023-09-10'),
        comments: 'The investment aligns with our strategic goals.'
      },
      {
        id: 3,
        name: 'Executive Approval',
        role: 'CFO',
        status: 'approved',
        approver: {
          name: 'Michael Scott',
        },
        approvedAt: new Date('2023-09-14'),
        comments: 'Approved. This research is essential for our long-term growth.'
      }
    ],
    history: [
      {
        action: 'Request Created',
        user: 'Emily Wilson',
        timestamp: new Date('2023-09-05T13:10:00'),
      },
      {
        action: 'Approved by Department Head',
        user: 'David Thompson',
        timestamp: new Date('2023-09-06T09:30:00'),
        comments: 'This research is vital for our product roadmap.'
      },
      {
        action: 'Approved by Finance',
        user: 'John Doe',
        timestamp: new Date('2023-09-10T14:45:00'),
        comments: 'The investment aligns with our strategic goals.'
      },
      {
        action: 'Final Approval by CFO',
        user: 'Michael Scott',
        timestamp: new Date('2023-09-14T10:15:00'),
        comments: 'Approved. This research is essential for our long-term growth.'
      }
    ],
    documents: [
      {
        name: 'Research_Proposal.pdf',
        url: '#',
        uploadedAt: new Date('2023-09-05T13:10:00'),
      },
      {
        name: 'Market_Analysis.pptx',
        url: '#',
        uploadedAt: new Date('2023-09-05T13:10:00'),
      },
      {
        name: 'Budget_Breakdown.xlsx',
        url: '#',
        uploadedAt: new Date('2023-09-05T13:10:00'),
      }
    ]
  },
  {
    id: 4,
    title: 'Sales Team Expansion Budget',
    department: 'Sales',
    amount: 90000,
    currentAmount: 60000,
    changePercentage: 50,
    requestedBy: {
      name: 'Thomas Anderson',
      avatarUrl: '',
    },
    requestedAt: new Date('2023-09-15'),
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2023-10-05'),
    description: 'Budget request to expand our sales team to cover new territories.',
    category: 'Personnel',
    timeline: 'Q4 2023',
    reason: "We've identified key growth opportunities in the west coast region that require dedicated sales staff.",
    approvalSteps: [
      {
        id: 1,
        name: 'Department Head',
        role: 'Sales Director',
        status: 'pending',
        approver: {
          name: 'Jessica Miller',
        }
      },
      {
        id: 2,
        name: 'Finance Review',
        role: 'Finance Manager',
        status: 'waiting',
      },
      {
        id: 3,
        name: 'Executive Approval',
        role: 'CFO',
        status: 'waiting',
      }
    ],
    history: [
      {
        action: 'Request Created',
        user: 'Thomas Anderson',
        timestamp: new Date('2023-09-15T11:25:00'),
      }
    ],
    documents: [
      {
        name: 'Sales_Territory_Analysis.pdf',
        url: '#',
        uploadedAt: new Date('2023-09-15T11:25:00'),
      },
      {
        name: 'Hiring_Plan.xlsx',
        url: '#',
        uploadedAt: new Date('2023-09-15T11:25:00'),
      }
    ]
  }
];

const BudgetApproval: React.FC<BudgetApprovalProps> = ({ 
  currentUser, 
  onApprove, 
  onReject 
}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [comments, setComments] = useState('');
  
  // Filter requests based on active tab
  const filteredRequests = mockBudgetRequests.filter(request => {
    if (activeTab === 'pending') {
      return request.status === 'pending' || request.status === 'in_progress';
    } else if (activeTab === 'approved') {
      return request.status === 'approved';
    } else if (activeTab === 'rejected') {
      return request.status === 'rejected';
    } else if (activeTab === 'all') {
      return true;
    }
    return false;
  });
  
  // Check if current user can approve the current step
  const canCurrentUserApprove = (request: BudgetRequest): boolean => {
    if (!request) return false;
    
    const currentStep = request.approvalSteps.find(step => step.status === 'pending');
    if (!currentStep) return false;
    
    return currentStep.role === currentUser.role;
  };
  
  // Handle approval action
  const handleApprove = () => {
    if (!selectedRequest) return;
    
    const currentStep = selectedRequest.approvalSteps.find(step => step.status === 'pending');
    if (!currentStep) return;
    
    onApprove(selectedRequest.id, currentStep.id, comments);
    setComments('');
  };
  
  // Handle rejection action
  const handleReject = () => {
    if (!selectedRequest || !comments) return;
    
    const currentStep = selectedRequest.approvalSteps.find(step => step.status === 'pending');
    if (!currentStep) return;
    
    onReject(selectedRequest.id, currentStep.id, comments);
    setComments('');
  };
  
  // Format monetary values
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get appropriate status badge for a request
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };
  
  // Get approval step status icon
  const getStepStatusIcon = (status: string) => {
    switch(status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'waiting':
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Pending Approval</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Approved</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-1">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>All Requests</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Request List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Budget Requests</CardTitle>
                  <CardDescription>
                    {activeTab === 'pending' ? 'Requests awaiting approval' : 
                     activeTab === 'approved' ? 'Approved budget requests' :
                     activeTab === 'rejected' ? 'Rejected budget requests' :
                     'All budget requests'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map(request => (
                        <div
                          key={request.id}
                          className={`p-3 border rounded-lg transition-colors cursor-pointer 
                            ${selectedRequest?.id === request.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{request.title}</h3>
                            {getPriorityBadge(request.priority)}
                          </div>
                          
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">{request.department}</span>
                            <span className="font-medium">{formatAmount(request.amount)}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Due: {format(request.dueDate, 'MMM d, yyyy')}</span>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                          
                          <div className="mt-2">
                            <Progress value={calculateProgress(request.approvalSteps)} className="h-1" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FilterX className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No budget requests found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Request Details */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedRequest.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {selectedRequest.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(selectedRequest.status)}
                        {getPriorityBadge(selectedRequest.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Financial Information */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Current Budget</div>
                        <div className="text-xl font-bold">
                          {selectedRequest.currentAmount ? formatAmount(selectedRequest.currentAmount) : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Requested Amount</div>
                        <div className="text-xl font-bold text-primary">
                          {formatAmount(selectedRequest.amount)}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Change</div>
                        <div className={`text-xl font-bold ${selectedRequest.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedRequest.changePercentage > 0 ? '+' : ''}{selectedRequest.changePercentage}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Request Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Department:</span>
                            <span className="font-medium">{selectedRequest.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Category:</span>
                            <span className="font-medium">{selectedRequest.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Timeline:</span>
                            <span className="font-medium">{selectedRequest.timeline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Requested By:</span>
                            <span className="font-medium">{selectedRequest.requestedBy.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Requested Date:</span>
                            <span className="font-medium">{format(selectedRequest.requestedAt, 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Due Date:</span>
                            <span className="font-medium">{format(selectedRequest.dueDate, 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Reason for Request</h3>
                        <p className="text-sm">{selectedRequest.reason}</p>
                        
                        {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-medium mb-2">Supporting Documents</h3>
                            <div className="space-y-2">
                              {selectedRequest.documents.map((doc, index) => (
                                <div key={index} className="flex items-center text-sm">
                                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <a href={doc.url} className="text-primary hover:underline">
                                    {doc.name}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Approval Steps */}
                    <div>
                      <h3 className="font-medium mb-3">Approval Workflow</h3>
                      <div className="space-y-3">
                        {selectedRequest.approvalSteps.map((step, index) => (
                          <div 
                            key={step.id} 
                            className={`flex items-center p-3 rounded-lg border
                              ${step.status === 'approved' ? 'bg-green-50 border-green-200' :
                                step.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                step.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                                'bg-muted/20 border-muted'}`}
                          >
                            <div className="mr-3">
                              {getStepStatusIcon(step.status)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="font-medium">{step.name}</div>
                              <div className="text-sm text-muted-foreground">{step.role}</div>
                              
                              {step.approver && (
                                <div className="flex items-center mt-1 text-xs">
                                  <User className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span>{step.approver.name}</span>
                                  {step.approvedAt && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>{format(step.approvedAt, 'MMM d, yyyy')}</span>
                                    </>
                                  )}
                                </div>
                              )}
                              
                              {step.comments && (
                                <div className="mt-1 text-xs italic">
                                  "{step.comments}"
                                </div>
                              )}
                            </div>
                            
                            {step.status === 'pending' && canCurrentUserApprove(selectedRequest) && (
                              <div className="flex gap-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      Reject
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                      <h4 className="font-medium">Rejection Reason</h4>
                                      <Textarea 
                                        placeholder="Please provide a reason for rejection..."
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                      />
                                      <div className="flex justify-end">
                                        <Button 
                                          variant="destructive"
                                          disabled={!comments}
                                          onClick={handleReject}
                                        >
                                          Confirm Rejection
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="default" size="sm">
                                      Approve
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                      <h4 className="font-medium">Approval Comments (Optional)</h4>
                                      <Textarea 
                                        placeholder="Add any comments..."
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                      />
                                      <div className="flex justify-end">
                                        <Button 
                                          variant="default"
                                          onClick={handleApprove}
                                        >
                                          Confirm Approval
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Approval History */}
                    {selectedRequest.history && selectedRequest.history.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3 flex items-center">
                          <History className="h-4 w-4 mr-2" />
                          Approval History
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Action</TableHead>
                              <TableHead>User</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Comments</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedRequest.history.map((entry, index) => (
                              <TableRow key={index}>
                                <TableCell>{entry.action}</TableCell>
                                <TableCell>{entry.user}</TableCell>
                                <TableCell>{format(entry.timestamp, 'MMM d, yyyy')}</TableCell>
                                <TableCell>{entry.comments || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex flex-col justify-center items-center p-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground opacity-40 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Request Selected</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Select a budget request from the list to view its details and take action.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetApproval;