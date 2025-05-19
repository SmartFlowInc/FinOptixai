import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, 
  Clock, 
  ClipboardList, 
  DollarSign, 
  FileText, 
  Filter, 
  History, 
  Loader2, 
  MessageSquare, 
  MoreHorizontal,
  Plus, 
  RefreshCw, 
  Search, 
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

// Types
export type ApprovalStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'cancelled';
export type RequestType = 'budget_change' | 'expense_approval' | 'forecast_update';
export type ApprovalType = 'manager' | 'finance' | 'executive';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarUrl?: string;
}

export interface ApprovalStep {
  id: number;
  name: string;
  description?: string;
  approver: User;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approvalType: ApprovalType;
  completedAt?: Date;
  comments?: string;
}

export interface ApprovalRequest {
  id: number;
  title: string;
  description?: string;
  requestType: RequestType;
  status: ApprovalStatus;
  requestedBy: User;
  requestedAt: Date;
  currentStep: number;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  steps: ApprovalStep[];
  comments: {
    id: number;
    user: User;
    content: string;
    createdAt: Date;
    attachments?: string[];
  }[];
  data: {
    amount?: number;
    department?: string;
    category?: string;
    reason?: string;
    period?: string;
    attachments?: string[];
    [key: string]: any;
  };
  lastUpdatedAt: Date;
}

export interface BudgetApprovalProps {
  requests?: ApprovalRequest[];
  currentUser?: User;
  isLoading?: boolean;
  onApprove?: (requestId: number, stepId: number, comments?: string) => void;
  onReject?: (requestId: number, stepId: number, comments: string) => void;
  onComment?: (requestId: number, comment: string) => void;
  onNewRequest?: (request: Partial<ApprovalRequest>) => void;
}

// Helper functions
const getStatusBadge = (status: ApprovalStatus) => {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 px-2 py-1">
          <Clock className="h-3.5 w-3.5" />
          <span>Pending</span>
        </Badge>
      );
    case 'in_review':
      return (
        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1 px-2 py-1">
          <ClipboardList className="h-3.5 w-3.5" />
          <span>In Review</span>
        </Badge>
      );
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1 px-2 py-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Approved</span>
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1 px-2 py-1">
          <XCircle className="h-3.5 w-3.5" />
          <span>Rejected</span>
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1 px-2 py-1">
          <XCircle className="h-3.5 w-3.5" />
          <span>Cancelled</span>
        </Badge>
      );
    default:
      return null;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'low':
      return <Badge className="bg-green-100 text-green-800">Low</Badge>;
    case 'medium':
      return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
    case 'high':
      return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
    case 'urgent':
      return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
    default:
      return null;
  }
};

// Mock data for demonstration
const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Finance Manager', department: 'Finance' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Department Head', department: 'Marketing' },
  { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', role: 'CFO', department: 'Executive' },
  { id: 4, name: 'Emily Williams', email: 'emily.w@example.com', role: 'Budget Analyst', department: 'Finance' }
];

const mockRequests: ApprovalRequest[] = [
  {
    id: 1,
    title: 'Marketing Budget Increase - Q4 Campaign',
    description: 'Request to increase the marketing budget for Q4 product launch campaign',
    requestType: 'budget_change',
    status: 'in_review',
    requestedBy: mockUsers[1],
    requestedAt: new Date('2023-09-15T10:30:00'),
    currentStep: 1,
    dueDate: new Date('2023-09-25'),
    priority: 'high',
    steps: [
      {
        id: 1,
        name: 'Department Manager Approval',
        approver: mockUsers[1],
        status: 'approved',
        approvalType: 'manager',
        completedAt: new Date('2023-09-16T14:20:00'),
        comments: 'Approved as this aligns with our department goals for Q4.'
      },
      {
        id: 2,
        name: 'Finance Review',
        description: 'Financial review to ensure budget availability',
        approver: mockUsers[0],
        status: 'pending',
        approvalType: 'finance'
      },
      {
        id: 3,
        name: 'Executive Approval',
        description: 'Final approval for amounts over $50,000',
        approver: mockUsers[2],
        status: 'pending',
        approvalType: 'executive'
      }
    ],
    comments: [
      {
        id: 1,
        user: mockUsers[1],
        content: 'We need this budget increase to support the new product launch in Q4.',
        createdAt: new Date('2023-09-15T10:35:00')
      },
      {
        id: 2,
        user: mockUsers[0],
        content: 'Can you provide more details on the expected ROI for this campaign?',
        createdAt: new Date('2023-09-16T09:20:00')
      },
      {
        id: 3,
        user: mockUsers[1],
        content: 'Based on previous campaigns, we expect a 3.5x return on this investment.',
        createdAt: new Date('2023-09-16T11:45:00')
      }
    ],
    data: {
      amount: 75000,
      department: 'Marketing',
      category: 'Advertising',
      reason: 'Q4 product launch campaign requires additional budget for digital advertising and event sponsorship',
      period: 'Q4 2023',
      attachments: ['campaign_plan.pdf', 'budget_breakdown.xlsx']
    },
    lastUpdatedAt: new Date('2023-09-16T14:20:00')
  },
  {
    id: 2,
    title: 'Sales Team Travel Budget Adjustment',
    description: 'Requesting additional travel budget for client meetings',
    requestType: 'budget_change',
    status: 'pending',
    requestedBy: mockUsers[3],
    requestedAt: new Date('2023-09-18T15:45:00'),
    currentStep: 0,
    dueDate: new Date('2023-09-28'),
    priority: 'medium',
    steps: [
      {
        id: 1,
        name: 'Department Manager Approval',
        approver: mockUsers[1],
        status: 'pending',
        approvalType: 'manager'
      },
      {
        id: 2,
        name: 'Finance Review',
        approver: mockUsers[0],
        status: 'pending',
        approvalType: 'finance'
      }
    ],
    comments: [
      {
        id: 1,
        user: mockUsers[3],
        content: 'We need additional travel budget to meet with key clients for Q4 renewals.',
        createdAt: new Date('2023-09-18T15:50:00')
      }
    ],
    data: {
      amount: 25000,
      department: 'Sales',
      category: 'Travel',
      reason: 'Increased in-person client meetings for Q4 renewals',
      period: 'Q4 2023'
    },
    lastUpdatedAt: new Date('2023-09-18T15:50:00')
  }
];

// Main component
const BudgetApproval: React.FC<BudgetApprovalProps> = ({
  requests = mockRequests,
  currentUser = mockUsers[0],
  isLoading = false,
  onApprove,
  onReject,
  onComment,
  onNewRequest
}) => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequest, setNewRequest] = useState<Partial<ApprovalRequest>>({
    title: '',
    description: '',
    requestType: 'budget_change',
    priority: 'medium',
    data: {}
  });
  const [commentText, setCommentText] = useState('');
  const { toast } = useToast();

  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'approvals') {
      // Show requests where current user is an approver for the current step
      return request.steps.some(step => 
        step.approver.id === currentUser.id && 
        request.currentStep === request.steps.indexOf(step) &&
        request.status === 'in_review'
      );
    } else if (activeTab === 'my-requests') {
      // Show requests submitted by the current user
      return request.requestedBy.id === currentUser.id;
    } else if (activeTab === 'all') {
      // Show all requests
      return true;
    }
    return false;
  });

  // Handle approving a request step
  const handleApprove = (requestId: number, stepId: number, comments: string = '') => {
    if (onApprove) {
      onApprove(requestId, stepId, comments);
    } else {
      // For demo purposes, mock the approval process
      toast({
        title: "Step approved",
        description: "The request will now move to the next approval step.",
      });
    }
    
    // Close the details dialog
    setSelectedRequest(null);
  };

  // Handle rejecting a request step
  const handleReject = (requestId: number, stepId: number, comments: string) => {
    if (onReject) {
      onReject(requestId, stepId, comments);
    } else {
      // For demo purposes, mock the rejection process
      toast({
        title: "Request rejected",
        description: "The request has been rejected and the requestor has been notified.",
        variant: "destructive"
      });
    }
    
    // Close the details dialog
    setSelectedRequest(null);
  };

  // Handle adding a comment
  const handleAddComment = (requestId: number) => {
    if (!commentText.trim()) return;
    
    if (onComment) {
      onComment(requestId, commentText);
    } else {
      // For demo purposes, mock adding a comment
      toast({
        title: "Comment added",
        description: "Your comment has been added to the request.",
      });
    }
    
    // Clear comment text
    setCommentText('');
  };

  // Handle creating a new request
  const handleCreateRequest = () => {
    if (!newRequest.title || !newRequest.data?.amount) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (onNewRequest) {
      onNewRequest({
        ...newRequest,
        requestedBy: currentUser,
        requestedAt: new Date(),
        status: 'pending',
        currentStep: 0,
        lastUpdatedAt: new Date()
      });
    } else {
      // For demo purposes, mock creating a request
      toast({
        title: "Request submitted",
        description: "Your budget change request has been submitted for approval.",
      });
    }
    
    // Close dialog and reset form
    setIsNewRequestOpen(false);
    setNewRequest({
      title: '',
      description: '',
      requestType: 'budget_change',
      priority: 'medium',
      data: {}
    });
  };

  return (
    <div className="space-y-6">
      {/* New Request Dialog */}
      <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submit Budget Change Request</DialogTitle>
            <DialogDescription>
              Create a new request for budget changes that require approval.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title</Label>
                <Input 
                  id="title" 
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a clear title for your request"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newRequest.priority}
                  onValueChange={(value) => setNewRequest(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={newRequest.description || ''}
                onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide details about why this budget change is needed"
                rows={3}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="amount"
                    type="number"
                    className="pl-8"
                    value={newRequest.data?.amount || ''}
                    onChange={(e) => setNewRequest(prev => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        amount: Number(e.target.value)
                      }
                    }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={newRequest.data?.department || ''}
                  onValueChange={(value) => setNewRequest(prev => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      department: value
                    }
                  }))}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Budget Category</Label>
                <Select 
                  value={newRequest.data?.category || ''}
                  onValueChange={(value) => setNewRequest(prev => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      category: value
                    }
                  }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Advertising">Advertising</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Salaries">Salaries</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select 
                  value={newRequest.data?.period || ''}
                  onValueChange={(value) => setNewRequest(prev => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      period: value
                    }
                  }))}
                >
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1 2023">Q1 2023</SelectItem>
                    <SelectItem value="Q2 2023">Q2 2023</SelectItem>
                    <SelectItem value="Q3 2023">Q3 2023</SelectItem>
                    <SelectItem value="Q4 2023">Q4 2023</SelectItem>
                    <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                    <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request</Label>
              <Textarea 
                id="reason"
                value={newRequest.data?.reason || ''}
                onChange={(e) => setNewRequest(prev => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    reason: e.target.value
                  }
                }))}
                placeholder="Explain why this budget change is needed"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Budget Approval Workflows</h2>
          <p className="text-neutral-600">
            Manage budget change requests and approvals
          </p>
        </div>
        
        <Button onClick={() => setIsNewRequestOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Budget Request
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="approvals" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Pending Approvals</span>
                <Badge className="ml-1 bg-primary text-primary-foreground">{
                  requests.filter(r => 
                    r.steps.some(step => 
                      step.approver.id === currentUser.id && 
                      r.currentStep === r.steps.indexOf(step) &&
                      r.status === 'in_review'
                    )
                  ).length
                }</Badge>
              </TabsTrigger>
              <TabsTrigger value="my-requests" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>My Requests</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>All Requests</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9 w-[250px]"
                      placeholder="Search requests..."
                    />
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filter</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh</span>
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Requestor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map(request => (
                      <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRequest(request)}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{request.requestedBy.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{request.requestedBy.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.data.amount ? 
                            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(request.data.amount) : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                        <TableCell>
                          {format(new Date(request.requestedAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                          }}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-md">
              {activeTab === 'approvals' ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Pending Approvals</h3>
                  <p className="text-muted-foreground">
                    You don't have any budget requests waiting for your approval.
                  </p>
                </>
              ) : activeTab === 'my-requests' ? (
                <>
                  <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Requests Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any budget requests yet.
                  </p>
                  <Button onClick={() => setIsNewRequestOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Request
                  </Button>
                </>
              ) : (
                <>
                  <History className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Requests Found</h3>
                  <p className="text-muted-foreground">
                    There are no budget requests in the system.
                  </p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl">{selectedRequest.title}</DialogTitle>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <DialogDescription>
                {selectedRequest.description || 'No description provided'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Requested By</p>
                <p className="font-medium">{selectedRequest.requestedBy.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">
                  {selectedRequest.data.amount ? 
                    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedRequest.data.amount) : 
                    'N/A'
                  }
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{selectedRequest.data.department || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{selectedRequest.data.category || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">{selectedRequest.data.period || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Priority</p>
                <p>{getPriorityBadge(selectedRequest.priority)}</p>
              </div>
            </div>
            
            {selectedRequest.data.reason && (
              <div className="py-2">
                <p className="text-sm text-muted-foreground mb-1">Reason for Request</p>
                <p className="text-sm border rounded-md p-3 bg-muted/30">{selectedRequest.data.reason}</p>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <Tabs defaultValue="approval-path">
              <TabsList>
                <TabsTrigger value="approval-path">Approval Path</TabsTrigger>
                <TabsTrigger value="comments">
                  Comments ({selectedRequest.comments.length})
                </TabsTrigger>
                {selectedRequest.data.attachments && selectedRequest.data.attachments.length > 0 && (
                  <TabsTrigger value="attachments">
                    Attachments ({selectedRequest.data.attachments.length})
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="approval-path" className="pt-4">
                <div className="space-y-4">
                  {selectedRequest.steps.map((step, index) => {
                    const isCurrentStep = index === selectedRequest.currentStep;
                    const isPreviousStep = index < selectedRequest.currentStep;
                    
                    return (
                      <div key={step.id} className={`border rounded-md p-4 ${
                        isCurrentStep ? 'border-primary bg-primary/5' : 
                        step.status === 'approved' ? 'border-green-200 bg-green-50' :
                        step.status === 'rejected' ? 'border-red-200 bg-red-50' :
                        'border-muted'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
                              step.status === 'approved' ? 'bg-green-500' :
                              step.status === 'rejected' ? 'bg-red-500' :
                              isCurrentStep ? 'bg-primary' :
                              'bg-muted-foreground'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{step.name}</h4>
                              {step.description && (
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">
                                  {step.approvalType === 'manager' ? 'Department Level' : 
                                   step.approvalType === 'finance' ? 'Finance Level' : 
                                   'Executive Level'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm">{step.approver.name}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            {step.status === 'approved' && (
                              <Badge className="bg-green-100 text-green-800">Approved</Badge>
                            )}
                            {step.status === 'rejected' && (
                              <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                            )}
                            {step.status === 'pending' && !isCurrentStep && (
                              <Badge variant="outline">Waiting</Badge>
                            )}
                            {step.status === 'pending' && isCurrentStep && (
                              <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                            )}
                          </div>
                        </div>
                        
                        {step.comments && (
                          <div className="mt-2 text-sm bg-white p-2 rounded-md border">
                            <p className="text-muted-foreground mb-1 text-xs">Comment:</p>
                            <p>{step.comments}</p>
                          </div>
                        )}
                        
                        {isCurrentStep && currentUser.id === step.approver.id && selectedRequest.status === 'in_review' && (
                          <div className="mt-4">
                            <Textarea 
                              placeholder="Add your comments here..."
                              className="mb-3"
                              rows={2}
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                className="text-red-600"
                                onClick={() => handleReject(selectedRequest.id, step.id, "Rejected due to budget constraints.")}
                              >
                                Reject
                              </Button>
                              <Button onClick={() => handleApprove(selectedRequest.id, step.id)}>
                                Approve
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="pt-4">
                <div className="space-y-4">
                  {selectedRequest.comments.map((comment, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{comment.user.name}</div>
                          <div className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}</div>
                        </div>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="new-comment">Add Comment</Label>
                    <Textarea 
                      id="new-comment"
                      placeholder="Type your comment here..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex justify-end mt-2">
                      <Button 
                        onClick={() => handleAddComment(selectedRequest.id)}
                        disabled={!commentText.trim()}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {selectedRequest.data.attachments && selectedRequest.data.attachments.length > 0 && (
                <TabsContent value="attachments" className="pt-4">
                  <div className="space-y-3">
                    {selectedRequest.data.attachments.map((attachment, index) => (
                      <div key={index} className="border rounded-md p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span>{attachment}</span>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
              
              {selectedRequest.status === 'in_review' && 
               selectedRequest.steps[selectedRequest.currentStep]?.approver.id === currentUser.id && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(
                      selectedRequest.id, 
                      selectedRequest.steps[selectedRequest.currentStep].id,
                      "Request rejected."
                    )}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(
                      selectedRequest.id, 
                      selectedRequest.steps[selectedRequest.currentStep].id
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BudgetApproval;