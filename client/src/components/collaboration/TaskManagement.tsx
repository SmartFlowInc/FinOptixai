import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  ClipboardList, 
  Edit, 
  Eye,
  FileText, 
  Filter, 
  ListChecks, 
  MessageSquare, 
  MoreVertical, 
  Plus, 
  RefreshCw, 
  Search, 
  Share2, 
  Tag, 
  Trash, 
  User, 
  Users
} from "lucide-react";
import { format } from "date-fns";

// Define types for task management
type TaskStatus = 'not_started' | 'in_progress' | 'under_review' | 'completed' | 'blocked';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type WorkflowStage = 'period_close' | 'data_validation' | 'reconciliation' | 'adjustments' | 'reporting' | 'review';

interface User {
  id: number;
  name: string;
  role: string;
  avatarInitials: string;
  avatarColor: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  stage: WorkflowStage;
  assignee: User | null;
  assignedBy: User;
  createdAt: Date;
  dueDate: Date | null;
  completedAt: Date | null;
  comments: TaskComment[];
  attachments: TaskAttachment[];
  subtasks: SubTask[];
  tags: string[];
}

interface TaskComment {
  id: number;
  user: User;
  text: string;
  timestamp: Date;
  attachments: TaskAttachment[];
}

interface TaskAttachment {
  id: number;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: User;
}

interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

interface Document {
  id: number;
  name: string;
  type: string;
  versionNumber: number;
  createdBy: User;
  createdAt: Date;
  modifiedAt: Date;
  status: 'draft' | 'review' | 'approved' | 'published';
  description: string;
  tags: string[];
  size: number;
  downloadUrl: string;
  previousVersions: number[];
}

// Sample users
const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Financial Analyst",
    avatarInitials: "JD",
    avatarColor: "bg-primary/10 text-primary"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Finance Director",
    avatarInitials: "JS",
    avatarColor: "bg-green-100 text-green-800"
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Accounting Manager",
    avatarInitials: "MB",
    avatarColor: "bg-purple-100 text-purple-800"
  },
  {
    id: 4,
    name: "Alicia Kim",
    role: "Senior Accountant",
    avatarInitials: "AK",
    avatarColor: "bg-amber-100 text-amber-800"
  },
  {
    id: 5,
    name: "David Chen",
    role: "Budget Analyst",
    avatarInitials: "DC",
    avatarColor: "bg-blue-100 text-blue-800"
  }
];

// Sample tasks
const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Review Q2 Revenue Reconciliation",
    description: "Compare revenue figures from sales system with financial database and investigate any discrepancies greater than 0.5%.",
    status: "in_progress",
    priority: "high",
    stage: "reconciliation",
    assignee: sampleUsers[3], // Alicia
    assignedBy: sampleUsers[1], // Jane
    createdAt: new Date(2025, 4, 10, 9, 0, 0),
    dueDate: new Date(2025, 4, 17, 17, 0, 0),
    completedAt: null,
    comments: [
      {
        id: 1,
        user: sampleUsers[3],
        text: "I've started the reconciliation process. Found a few minor discrepancies in the North America region that I'm investigating.",
        timestamp: new Date(2025, 4, 12, 14, 30, 0),
        attachments: []
      },
      {
        id: 2,
        user: sampleUsers[1],
        text: "Thanks for the update. Let me know if you need access to any additional systems for this.",
        timestamp: new Date(2025, 4, 12, 15, 45, 0),
        attachments: []
      }
    ],
    attachments: [
      {
        id: 1,
        name: "Q2_Revenue_Data.xlsx",
        size: 4500000,
        type: "spreadsheet",
        url: "/files/q2_revenue_data.xlsx",
        uploadedAt: new Date(2025, 4, 10, 9, 30, 0),
        uploadedBy: sampleUsers[1]
      }
    ],
    subtasks: [
      {
        id: 1,
        title: "Review North America sales data",
        completed: true
      },
      {
        id: 2,
        title: "Review Europe sales data",
        completed: true
      },
      {
        id: 3,
        title: "Review APAC sales data",
        completed: false
      },
      {
        id: 4,
        title: "Document reconciliation results",
        completed: false
      }
    ],
    tags: ["Q2", "Reconciliation", "Revenue"]
  },
  {
    id: 2,
    title: "Prepare Monthly Expense Report",
    description: "Compile monthly expense reports for all departments and create summary for management review.",
    status: "not_started",
    priority: "medium",
    stage: "reporting",
    assignee: sampleUsers[0], // John
    assignedBy: sampleUsers[2], // Michael
    createdAt: new Date(2025, 4, 13, 11, 0, 0),
    dueDate: new Date(2025, 4, 20, 17, 0, 0),
    completedAt: null,
    comments: [],
    attachments: [],
    subtasks: [
      {
        id: 5,
        title: "Collect expense data from all departments",
        completed: false
      },
      {
        id: 6,
        title: "Generate preliminary expense reports",
        completed: false
      },
      {
        id: 7,
        title: "Review reports for accuracy",
        completed: false
      },
      {
        id: 8,
        title: "Create executive summary",
        completed: false
      }
    ],
    tags: ["Expenses", "Monthly", "Reports"]
  },
  {
    id: 3,
    title: "Update Cash Flow Forecast",
    description: "Update the 6-month cash flow forecast with latest actuals and revised projections.",
    status: "completed",
    priority: "high",
    stage: "reporting",
    assignee: sampleUsers[4], // David
    assignedBy: sampleUsers[1], // Jane
    createdAt: new Date(2025, 4, 5, 14, 0, 0),
    dueDate: new Date(2025, 4, 12, 17, 0, 0),
    completedAt: new Date(2025, 4, 11, 16, 30, 0),
    comments: [
      {
        id: 3,
        user: sampleUsers[4],
        text: "I've completed the cash flow forecast update. Notable change: we're projecting 12% higher cash reserves in August due to improved collections.",
        timestamp: new Date(2025, 4, 11, 16, 30, 0),
        attachments: []
      },
      {
        id: 4,
        user: sampleUsers[1],
        text: "Great work! This will be helpful for our upcoming planning meeting.",
        timestamp: new Date(2025, 4, 11, 17, 15, 0),
        attachments: []
      }
    ],
    attachments: [
      {
        id: 2,
        name: "Cashflow_Forecast_Q2_Q3.pptx",
        size: 3200000,
        type: "presentation",
        url: "/files/cashflow_forecast.pptx",
        uploadedAt: new Date(2025, 4, 11, 16, 25, 0),
        uploadedBy: sampleUsers[4]
      }
    ],
    subtasks: [
      {
        id: 9,
        title: "Update with April actuals",
        completed: true
      },
      {
        id: 10,
        title: "Revise May-September projections",
        completed: true
      },
      {
        id: 11,
        title: "Review with Treasury team",
        completed: true
      },
      {
        id: 12,
        title: "Create executive presentation",
        completed: true
      }
    ],
    tags: ["Cash Flow", "Forecast", "Q2", "Q3"]
  },
  {
    id: 4,
    title: "Reconcile Intercompany Transactions",
    description: "Reconcile intercompany transactions for all subsidiaries and prepare elimination entries for consolidation.",
    status: "blocked",
    priority: "urgent",
    stage: "reconciliation",
    assignee: sampleUsers[2], // Michael
    assignedBy: sampleUsers[1], // Jane
    createdAt: new Date(2025, 4, 12, 9, 0, 0),
    dueDate: new Date(2025, 4, 15, 17, 0, 0),
    completedAt: null,
    comments: [
      {
        id: 5,
        user: sampleUsers[2],
        text: "I'm blocked on this task because we're missing the transaction data from the APAC subsidiary. Their financial system was down yesterday.",
        timestamp: new Date(2025, 4, 13, 11, 30, 0),
        attachments: []
      },
      {
        id: 6,
        user: sampleUsers[1],
        text: "I'll follow up with the APAC team to get an ETA on when their system will be back online.",
        timestamp: new Date(2025, 4, 13, 13, 45, 0),
        attachments: []
      }
    ],
    attachments: [],
    subtasks: [
      {
        id: 13,
        title: "Download intercompany transactions from all subsidiaries",
        completed: false
      },
      {
        id: 14,
        title: "Match and reconcile transactions",
        completed: false
      },
      {
        id: 15,
        title: "Identify and investigate discrepancies",
        completed: false
      },
      {
        id: 16,
        title: "Prepare elimination journal entries",
        completed: false
      }
    ],
    tags: ["Intercompany", "Reconciliation", "Monthly Close"]
  },
  {
    id: 5,
    title: "Review Budget Variance Reports",
    description: "Review budget variance reports for all departments, highlighting any variances over 10% for management discussion.",
    status: "under_review",
    priority: "medium",
    stage: "review",
    assignee: sampleUsers[0], // John
    assignedBy: sampleUsers[1], // Jane
    createdAt: new Date(2025, 4, 7, 10, 0, 0),
    dueDate: new Date(2025, 4, 14, 17, 0, 0),
    completedAt: null,
    comments: [
      {
        id: 7,
        user: sampleUsers[0],
        text: "Completed the variance analysis. Major variances: Marketing department is 23% over budget due to the new product launch campaign, and IT is 15% under budget due to delayed infrastructure upgrades.",
        timestamp: new Date(2025, 4, 13, 15, 30, 0),
        attachments: []
      }
    ],
    attachments: [
      {
        id: 3,
        name: "April_Budget_Variances.xlsx",
        size: 2800000,
        type: "spreadsheet",
        url: "/files/april_budget_variances.xlsx",
        uploadedAt: new Date(2025, 4, 13, 15, 25, 0),
        uploadedBy: sampleUsers[0]
      }
    ],
    subtasks: [
      {
        id: 17,
        title: "Download budget vs actual data",
        completed: true
      },
      {
        id: 18,
        title: "Calculate variances by department",
        completed: true
      },
      {
        id: 19,
        title: "Identify significant variances",
        completed: true
      },
      {
        id: 20,
        title: "Prepare variance explanations",
        completed: true
      },
      {
        id: 21,
        title: "Create management presentation",
        completed: false
      }
    ],
    tags: ["Budget", "Variance", "Monthly"]
  }
];

// Sample documents
const sampleDocuments: Document[] = [
  {
    id: 1,
    name: "Q2 2023 Financial Results",
    type: "spreadsheet",
    versionNumber: 3,
    createdBy: sampleUsers[0],
    createdAt: new Date(2025, 3, 20, 9, 30, 0),
    modifiedAt: new Date(2025, 4, 5, 14, 30, 0),
    status: "approved",
    description: "Quarterly financial results with departmental breakdowns",
    tags: ["Q2", "Financial Results", "Final"],
    size: 4800000,
    downloadUrl: "/documents/q2_financial_results_v3.xlsx",
    previousVersions: [1, 2]
  },
  {
    id: 2,
    name: "2023 Budget Planning",
    type: "presentation",
    versionNumber: 5,
    createdBy: sampleUsers[1],
    createdAt: new Date(2025, 2, 5, 11, 30, 0),
    modifiedAt: new Date(2025, 4, 10, 16, 45, 0),
    status: "published",
    description: "Annual budget planning presentation for executive team",
    tags: ["Budget", "2023", "Planning"],
    size: 6500000,
    downloadUrl: "/documents/2023_budget_planning_v5.pptx",
    previousVersions: [1, 2, 3, 4]
  },
  {
    id: 3,
    name: "Cash Flow Forecast - Q2-Q3",
    type: "spreadsheet",
    versionNumber: 2,
    createdBy: sampleUsers[4],
    createdAt: new Date(2025, 4, 1, 10, 15, 0),
    modifiedAt: new Date(2025, 4, 11, 16, 30, 0),
    status: "approved",
    description: "Six-month cash flow forecast for Q2-Q3 2023",
    tags: ["Cash Flow", "Forecast", "Q2", "Q3"],
    size: 3700000,
    downloadUrl: "/documents/cashflow_forecast_q2q3_v2.xlsx",
    previousVersions: [1]
  },
  {
    id: 4,
    name: "Monthly Expense Report - April",
    type: "spreadsheet",
    versionNumber: 1,
    createdBy: sampleUsers[0],
    createdAt: new Date(2025, 4, 12, 9, 45, 0),
    modifiedAt: new Date(2025, 4, 12, 9, 45, 0),
    status: "draft",
    description: "Monthly expense report for April 2023",
    tags: ["Expenses", "Monthly", "April"],
    size: 2200000,
    downloadUrl: "/documents/april_expense_report_v1.xlsx",
    previousVersions: []
  },
  {
    id: 5,
    name: "Q2 Financial Review",
    type: "presentation",
    versionNumber: 1,
    createdBy: sampleUsers[1],
    createdAt: new Date(2025, 4, 14, 13, 0, 0),
    modifiedAt: new Date(2025, 4, 14, 13, 0, 0),
    status: "draft",
    description: "Quarterly financial review presentation",
    tags: ["Financial Review", "Q2", "Presentation"],
    size: 5100000,
    downloadUrl: "/documents/q2_financial_review_v1.pptx",
    previousVersions: []
  }
];

// Task prioritization logic
const getPriorityBadge = (priority: TaskPriority) => {
  switch (priority) {
    case 'urgent':
      return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
    case 'high':
      return <Badge className="bg-amber-100 text-amber-800">High</Badge>;
    case 'medium':
      return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
    case 'low':
      return <Badge className="bg-green-100 text-green-800">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  };
};

// Task status logic
const getStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case 'not_started':
      return <Badge variant="outline">Not Started</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    case 'under_review':
      return <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case 'blocked':
      return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Stage formatting
const getStageDisplay = (stage: WorkflowStage) => {
  switch (stage) {
    case 'period_close':
      return "Period Close";
    case 'data_validation':
      return "Data Validation";
    case 'reconciliation':
      return "Reconciliation";
    case 'adjustments':
      return "Adjustments";
    case 'reporting':
      return "Reporting";
    case 'review':
      return "Review";
    default:
      return stage;
  }
};

interface TaskManagementProps {
  activeProcess?: string; // e.g., "monthly_close", "quarterly_review", "annual_budget"
}

const TaskManagement: React.FC<TaskManagementProps> = ({ 
  activeProcess = "monthly_close" 
}) => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [activeTab, setActiveTab] = useState<string>("tasks");
  const [taskView, setTaskView] = useState<string>("list");
  const [stageView, setStageView] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);
  const [newTaskOpen, setNewTaskOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    stage: 'period_close',
    assigneeId: '',
    dueDate: '',
    tags: ''
  });
  const [documentFilter, setDocumentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Stage filter
    const stageMatch = stageView === 'all' || task.stage === stageView;
    
    // Search query filter
    const searchMatch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return stageMatch && searchMatch;
  });
  
  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    // Status filter
    const statusMatch = documentFilter === 'all' || doc.status === documentFilter;
    
    // Search query filter
    const searchMatch = !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });
  
  // Calculate statistics for task board
  const taskStats = {
    total: tasks.length,
    notStarted: tasks.filter(t => t.status === 'not_started').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    underReview: tasks.filter(t => t.status === 'under_review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    overdue: tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== 'completed').length
  };
  
  // View task details
  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };
  
  // Create new task
  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    
    const assignee = newTask.assigneeId 
      ? sampleUsers.find(u => u.id === parseInt(newTask.assigneeId)) || null
      : null;
    
    const newTaskObj: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: newTask.title,
      description: newTask.description,
      status: 'not_started',
      priority: newTask.priority as TaskPriority,
      stage: newTask.stage as WorkflowStage,
      assignee: assignee,
      assignedBy: sampleUsers[0], // Current user
      createdAt: new Date(),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
      completedAt: null,
      comments: [],
      attachments: [],
      subtasks: [],
      tags: newTask.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTaskOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      stage: 'period_close',
      assigneeId: '',
      dueDate: '',
      tags: ''
    });
  };
  
  // Update task status
  const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task, 
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : task.completedAt
        };
      }
      return task;
    }));
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask, 
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date() : selectedTask.completedAt
      });
    }
  };
  
  // Add comment to task
  const addComment = (taskId: number, commentText: string) => {
    if (!commentText.trim()) return;
    
    const newComment: TaskComment = {
      id: Date.now(),
      user: sampleUsers[0], // Current user
      text: commentText,
      timestamp: new Date(),
      attachments: []
    };
    
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: [...task.comments, newComment]
        };
      }
      return task;
    }));
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        comments: [...selectedTask.comments, newComment]
      });
    }
  };
  
  // Format date utility
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(date, "MMM d, yyyy");
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Manage tasks and documents for financial processes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task for the financial process
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Task Title</label>
                      <Input 
                        placeholder="Enter task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        placeholder="Enter task description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select 
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask({...newTask, priority: value})}
                        >
                          <SelectTrigger>
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
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Stage</label>
                        <Select 
                          value={newTask.stage}
                          onValueChange={(value) => setNewTask({...newTask, stage: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="period_close">Period Close</SelectItem>
                            <SelectItem value="data_validation">Data Validation</SelectItem>
                            <SelectItem value="reconciliation">Reconciliation</SelectItem>
                            <SelectItem value="adjustments">Adjustments</SelectItem>
                            <SelectItem value="reporting">Reporting</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Assignee</label>
                        <Select 
                          value={newTask.assigneeId}
                          onValueChange={(value) => setNewTask({...newTask, assigneeId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            {sampleUsers.map(user => (
                              <SelectItem key={user.id} value={user.id.toString()}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Due Date</label>
                        <Input 
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tags</label>
                      <Input 
                        placeholder="Enter comma-separated tags"
                        value={newTask.tags}
                        onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                      />
                      <p className="text-xs text-neutral-500">E.g., Monthly Close, Q2, Reconciliation</p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewTaskOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="relative w-[180px]">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input 
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tasks">
                <ListChecks className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="board">
                <ClipboardList className="h-4 w-4 mr-2" />
                Task Board
              </TabsTrigger>
              <TabsTrigger value="workflow">
                <RefreshCw className="h-4 w-4 mr-2" />
                Workflow
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Task List Tab */}
          <TabsContent value="tasks" className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Select 
                  value={stageView}
                  onValueChange={setStageView}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="period_close">Period Close</SelectItem>
                    <SelectItem value="data_validation">Data Validation</SelectItem>
                    <SelectItem value="reconciliation">Reconciliation</SelectItem>
                    <SelectItem value="adjustments">Adjustments</SelectItem>
                    <SelectItem value="reporting">Reporting</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm text-neutral-500">Filters:</span>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">
                    My Tasks
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">
                    Due Soon
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">
                    Overdue
                  </Badge>
                </div>
              </div>
              
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Timeline
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Task</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Priority</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Stage</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Assignee</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Due Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4" onClick={() => viewTaskDetails(task)}>
                        <div className="cursor-pointer">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-neutral-500 truncate max-w-[250px]">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(task.status)}</td>
                      <td className="py-3 px-4">{getPriorityBadge(task.priority)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{getStageDisplay(task.stage)}</span>
                      </td>
                      <td className="py-3 px-4">
                        {task.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={task.assignee.avatarColor + " text-xs"}>
                                {task.assignee.avatarInitials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-500">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm ${task.dueDate && task.dueDate < new Date() && task.status !== 'completed' ? 'text-red-600 font-medium' : ''}`}>
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => viewTaskDetails(task)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Select 
                            value={task.status}
                            onValueChange={(value) => updateTaskStatus(task.id, value as TaskStatus)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_started">Not Started</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="blocked">Blocked</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <ListChecks className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No tasks found matching your filters</p>
                  <Button variant="link" onClick={() => {
                    setStageView('all');
                    setSearchQuery('');
                  }}>
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Task Board Tab */}
          <TabsContent value="board" className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-neutral-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Total Tasks</div>
                      <div className="text-2xl font-bold mt-1">{taskStats.total}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">In Progress</div>
                      <div className="text-2xl font-bold mt-1">{taskStats.inProgress}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Blocked Tasks</div>
                      <div className="text-2xl font-bold mt-1">{taskStats.blocked}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Completed</div>
                      <div className="text-2xl font-bold mt-1">{taskStats.completed}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Not Started Column */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <div className="font-medium flex items-center">
                    <div className="h-2 w-2 bg-neutral-400 rounded-full mr-2"></div>
                    Not Started
                    <Badge variant="outline" className="ml-2">{taskStats.notStarted}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-neutral-50 rounded-lg min-h-[400px] p-2 space-y-2">
                  {tasks
                    .filter(task => task.status === 'not_started')
                    .map(task => (
                      <div 
                        key={task.id} 
                        className="bg-white p-3 rounded-lg border cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
                        onClick={() => viewTaskDetails(task)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{task.description}</p>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-neutral-500 gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs py-0 h-5">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          {task.assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={task.assignee.avatarColor + " text-xs"}>
                                {task.assignee.avatarInitials}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* In Progress Column */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <div className="font-medium flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                    In Progress
                    <Badge variant="outline" className="ml-2">{taskStats.inProgress}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-blue-50/30 rounded-lg min-h-[400px] p-2 space-y-2">
                  {tasks
                    .filter(task => task.status === 'in_progress')
                    .map(task => (
                      <div 
                        key={task.id} 
                        className="bg-white p-3 rounded-lg border cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
                        onClick={() => viewTaskDetails(task)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{task.description}</p>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-neutral-500 gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs py-0 h-5">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          {task.assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={task.assignee.avatarColor + " text-xs"}>
                                {task.assignee.avatarInitials}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Under Review Column */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <div className="font-medium flex items-center">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mr-2"></div>
                    Under Review
                    <Badge variant="outline" className="ml-2">{taskStats.underReview}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-purple-50/30 rounded-lg min-h-[400px] p-2 space-y-2">
                  {tasks
                    .filter(task => task.status === 'under_review')
                    .map(task => (
                      <div 
                        key={task.id} 
                        className="bg-white p-3 rounded-lg border cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
                        onClick={() => viewTaskDetails(task)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{task.description}</p>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-neutral-500 gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs py-0 h-5">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          {task.assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={task.assignee.avatarColor + " text-xs"}>
                                {task.assignee.avatarInitials}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Completed Column */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <div className="font-medium flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    Completed
                    <Badge variant="outline" className="ml-2">{taskStats.completed}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-green-50/30 rounded-lg min-h-[400px] p-2 space-y-2">
                  {tasks
                    .filter(task => task.status === 'completed')
                    .map(task => (
                      <div 
                        key={task.id} 
                        className="bg-white p-3 rounded-lg border cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
                        onClick={() => viewTaskDetails(task)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{task.title}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 mb-2">{task.description}</p>
                        {task.completedAt && (
                          <div className="flex items-center text-xs text-green-600 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Completed {format(task.completedAt, "MMM d")}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs py-0 h-5">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          {task.assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={task.assignee.avatarColor + " text-xs"}>
                                {task.assignee.avatarInitials}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Workflow Tab */}
          <TabsContent value="workflow" className="px-6 py-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Monthly Close Process</h3>
              <p className="text-neutral-500">Track the progress of the monthly close process through each stage</p>
            </div>
            
            <div className="relative mb-10">
              <div className="absolute h-1 bg-neutral-200 top-5 left-0 right-0 z-0"></div>
              <div className="relative z-10 flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-sm font-medium">Period Close</div>
                  <div className="text-xs text-neutral-500">May 10</div>
                  <Badge className="mt-1 bg-green-100 text-green-800">Completed</Badge>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-sm font-medium">Data Validation</div>
                  <div className="text-xs text-neutral-500">May 11</div>
                  <Badge className="mt-1 bg-green-100 text-green-800">Completed</Badge>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-sm font-medium">Reconciliation</div>
                  <div className="text-xs text-neutral-500">May 12-15</div>
                  <Badge className="mt-1 bg-blue-100 text-blue-800">In Progress</Badge>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-neutral-500">Adjustments</div>
                  <div className="text-xs text-neutral-500">May 16-17</div>
                  <Badge className="mt-1 bg-neutral-100 text-neutral-500">Not Started</Badge>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-neutral-500">Reporting</div>
                  <div className="text-xs text-neutral-500">May 18-20</div>
                  <Badge className="mt-1 bg-neutral-100 text-neutral-500">Not Started</Badge>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center">
                    <span className="text-sm font-medium">6</span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-neutral-500">Review</div>
                  <div className="text-xs text-neutral-500">May 21-22</div>
                  <Badge className="mt-1 bg-neutral-100 text-neutral-500">Not Started</Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stage Metrics</CardTitle>
                  <CardDescription>Current stage completion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Period Close</div>
                        <div className="text-sm font-medium">100%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Data Validation</div>
                        <div className="text-sm font-medium">100%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Reconciliation</div>
                        <div className="text-sm font-medium">60%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Adjustments</div>
                        <div className="text-sm font-medium">0%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-neutral-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Reporting</div>
                        <div className="text-sm font-medium">0%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-neutral-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Review</div>
                        <div className="text-sm font-medium">0%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-neutral-500 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-neutral-500 text-sm">Overall Completion:</div>
                    <div className="font-medium">43%</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Critical Path Tasks</CardTitle>
                  <CardDescription>Tasks on the critical path</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[260px] pr-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-l-4 border-green-500 pl-3 py-1">
                        <div>
                          <div className="font-medium">Close accounting period</div>
                          <div className="text-sm text-neutral-500">Finance Team</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between border-l-4 border-green-500 pl-3 py-1">
                        <div>
                          <div className="font-medium">Account balances validation</div>
                          <div className="text-sm text-neutral-500">Michael Brown</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between border-l-4 border-blue-500 pl-3 py-1">
                        <div>
                          <div className="font-medium">Review Q2 Revenue Reconciliation</div>
                          <div className="text-sm text-neutral-500">Alicia Kim</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between border-l-4 border-red-500 pl-3 py-1">
                        <div>
                          <div className="font-medium">Reconcile Intercompany Transactions</div>
                          <div className="text-sm text-neutral-500">Michael Brown</div>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Blocked</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between border-l-4 border-neutral-300 pl-3 py-1">
                        <div>
                          <div className="font-medium text-neutral-500">Create adjustment entries</div>
                          <div className="text-sm text-neutral-500">Jane Smith</div>
                        </div>
                        <Badge variant="outline">Not Started</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between border-l-4 border-neutral-300 pl-3 py-1">
                        <div>
                          <div className="font-medium text-neutral-500">Generate financial reports</div>
                          <div className="text-sm text-neutral-500">John Doe</div>
                        </div>
                        <Badge variant="outline">Not Started</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between border-l-4 border-neutral-300 pl-3 py-1">
                        <div>
                          <div className="font-medium text-neutral-500">Executive team review</div>
                          <div className="text-sm text-neutral-500">Jane Smith</div>
                        </div>
                        <Badge variant="outline">Not Started</Badge>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Team Status</CardTitle>
                  <CardDescription>Team member tasks and statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[260px] pr-4">
                    <div className="space-y-3">
                      {sampleUsers.map(user => {
                        const userTasks = tasks.filter(t => t.assignee?.id === user.id);
                        const completedTasks = userTasks.filter(t => t.status === 'completed').length;
                        const totalTasks = userTasks.length;
                        const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                        
                        return (
                          <div key={user.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className={user.avatarColor + " text-xs"}>
                                    {user.avatarInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-neutral-500">{user.role}</div>
                                </div>
                              </div>
                              <Badge variant="outline" className="h-6">
                                {completedTasks}/{totalTasks} Tasks
                              </Badge>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-100 rounded-full">
                              <div 
                                className="h-1.5 bg-primary rounded-full" 
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                            {userTasks.length > 0 && (
                              <div className="mt-2 pt-2 border-t text-xs">
                                <div className="font-medium">Current Task:</div>
                                <div className="text-neutral-600 mt-1">
                                  {userTasks.find(t => t.status !== 'completed')?.title || 'All tasks completed'}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents" className="px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Select 
                  value={documentFilter}
                  onValueChange={setDocumentFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative w-[250px]">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input 
                    placeholder="Search documents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(document => (
                <Card key={document.id} className="overflow-hidden">
                  <div className={`
                    h-2 w-full
                    ${document.status === 'draft' ? 'bg-blue-500' : 
                      document.status === 'review' ? 'bg-amber-500' : 
                      document.status === 'approved' ? 'bg-green-500' :
                      'bg-purple-500'
                    }
                  `}></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{document.name}</h3>
                        <p className="text-xs text-neutral-500">{document.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={document.createdBy.avatarColor + " text-xs"}>
                            {document.createdBy.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-neutral-500">
                          {document.createdBy.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        v{document.versionNumber}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {document.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center mt-4 justify-between border-t pt-3">
                      <div className="text-xs text-neutral-500">
                        {format(document.modifiedAt, "MMM d, yyyy")}
                      </div>
                      <div className="flex gap-1">
                        {document.status === 'draft' && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Draft</Badge>
                        )}
                        {document.status === 'review' && (
                          <Badge className="bg-amber-100 text-amber-800 text-xs">In Review</Badge>
                        )}
                        {document.status === 'approved' && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
                        )}
                        {document.status === 'published' && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">Published</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {document.status !== 'published' && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredDocuments.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No documents found matching your criteria</p>
                <Button variant="link" onClick={() => {
                  setDocumentFilter('all');
                  setSearchQuery('');
                }}>
                  Reset filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Task Detail Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle>{selectedTask.title}</DialogTitle>
                    <DialogDescription>
                      {getStatusBadge(selectedTask.status)}
                      {' '}•{' '}
                      {getPriorityBadge(selectedTask.priority)}
                      {' '}•{' '}
                      <span className="text-neutral-500">Stage: {getStageDisplay(selectedTask.stage)}</span>
                    </DialogDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-neutral-600 mt-1 text-sm">{selectedTask.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Assignee</h4>
                    {selectedTask.assignee ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={selectedTask.assignee.avatarColor + " text-xs"}>
                            {selectedTask.assignee.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{selectedTask.assignee.name}</div>
                          <div className="text-xs text-neutral-500">{selectedTask.assignee.role}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-neutral-500 text-sm mt-1">Unassigned</div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Created</h4>
                      <div className="text-neutral-600 text-sm mt-1">
                        {formatDate(selectedTask.createdAt)}
                      </div>
                      <div className="text-xs text-neutral-500">
                        by {selectedTask.assignedBy.name}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Due Date</h4>
                      <div className={`text-sm mt-1 ${selectedTask.dueDate && selectedTask.dueDate < new Date() && selectedTask.status !== 'completed' ? 'text-red-600 font-medium' : 'text-neutral-600'}`}>
                        {formatDate(selectedTask.dueDate)}
                      </div>
                    </div>
                  </div>
                  
                  {selectedTask.subtasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Subtasks</h4>
                      <div className="space-y-1.5">
                        {selectedTask.subtasks.map(subtask => (
                          <div key={subtask.id} className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={subtask.completed} 
                              className="h-4 w-4 rounded"
                              readOnly
                            />
                            <span className={`text-sm ${subtask.completed ? 'text-neutral-500 line-through' : ''}`}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedTask.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTask.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-neutral-50">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Comments</h4>
                      <span className="text-xs text-neutral-500">
                        {selectedTask.comments.length} comments
                      </span>
                    </div>
                    
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="space-y-3">
                        {selectedTask.comments.map(comment => (
                          <div key={comment.id} className="border rounded-lg p-3 bg-neutral-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className={comment.user.avatarColor + " text-xs"}>
                                    {comment.user.avatarInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{comment.user.name}</span>
                              </div>
                              <span className="text-xs text-neutral-500">
                                {format(comment.timestamp, "MMM d, h:mm a")}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">{comment.text}</p>
                          </div>
                        ))}
                        
                        {selectedTask.comments.length === 0 && (
                          <div className="text-center py-6 text-neutral-500">
                            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No comments yet</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <Textarea 
                          placeholder="Add a comment..." 
                          className="resize-none min-h-[80px]"
                          id="new-comment"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button 
                          size="sm"
                          onClick={() => {
                            const textarea = document.getElementById('new-comment') as HTMLTextAreaElement;
                            if (textarea && textarea.value.trim()) {
                              addComment(selectedTask.id, textarea.value);
                              textarea.value = '';
                            }
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {selectedTask.status !== 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateTaskStatus(selectedTask.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
                <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskManagement;