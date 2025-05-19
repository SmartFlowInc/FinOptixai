import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BrainCircuit,
  ChartLine,
  Check,
  Clock,
  Copy,
  Edit,
  InfoIcon,
  Lightbulb,
  ListChecks,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Star,
  StarHalf,
  ThumbsUp,
  Trash,
  Trending,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

// Types for feedback system
type FeedbackCategory = 'process' | 'accuracy' | 'usability' | 'feature' | 'bug';
type FeedbackStatus = 'new' | 'under_review' | 'planned' | 'in_progress' | 'implemented' | 'declined';
type FeedbackPriority = 'critical' | 'high' | 'medium' | 'low';
type MeetingType = 'review' | 'planning' | 'retrospective' | 'stakeholder';
type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
type KpiTrend = 'improving' | 'stable' | 'declining';

// User interface for FeedbackSystem
interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
}

// Feedback interface
interface Feedback {
  id: number;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  submittedBy: User;
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
  votes: number;
  tags: string[];
  comments: FeedbackComment[];
}

interface FeedbackComment {
  id: number;
  feedbackId: number;
  content: string;
  user: User;
  createdAt: Date;
}

// Meeting interface
interface Meeting {
  id: number;
  title: string;
  type: MeetingType;
  date: Date;
  attendees: User[];
  summary: string;
  actionItems: ActionItem[];
  decisions: string[];
  tags: string[];
}

// Action item interface
interface ActionItem {
  id: number;
  title: string;
  description: string;
  status: ActionItemStatus;
  assignedTo: User;
  createdAt: Date;
  dueDate: Date;
  priority: FeedbackPriority;
  relatedFeedback?: number;
  parentMeeting?: number;
}

// KPI interface for tracking
interface Kpi {
  id: number;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  trend: KpiTrend;
  historyData: { date: Date; value: number }[];
  category: string;
  importance: 'primary' | 'secondary';
}

// Recommendation interface
interface Recommendation {
  id: number;
  title: string;
  description: string;
  implementationSteps: string[];
  benefits: string[];
  priority: FeedbackPriority;
  estimatedImpact: {
    category: string;
    description: string;
    value: number;
  }[];
  status: 'active' | 'implemented' | 'dismissed';
  generatedAt: Date;
  relatedKpis: number[];
  relatedFeedback: number[];
}

// Sample users
const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Financial Analyst",
    department: "Finance",
    email: "john.doe@company.com",
    avatarInitials: "JD",
    avatarColor: "bg-primary/10 text-primary"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Data Integration Specialist",
    department: "IT",
    email: "jane.smith@company.com",
    avatarInitials: "JS",
    avatarColor: "bg-green-100 text-green-800"
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Finance Director",
    department: "Finance",
    email: "michael.brown@company.com",
    avatarInitials: "MB",
    avatarColor: "bg-purple-100 text-purple-800"
  },
  {
    id: 4,
    name: "Alicia Kim",
    role: "Data Analyst",
    department: "Finance",
    email: "alicia.kim@company.com",
    avatarInitials: "AK",
    avatarColor: "bg-amber-100 text-amber-800"
  }
];

// Sample feedback items
const sampleFeedback: Feedback[] = [
  {
    id: 1,
    title: "Improve forecast accuracy calculation",
    description: "The current method for calculating forecast accuracy doesn't account for timing differences. We should enhance this to better reflect true forecasting performance.",
    category: "accuracy",
    status: "in_progress",
    priority: "high",
    submittedBy: sampleUsers[0],
    assignedTo: sampleUsers[2],
    createdAt: new Date(2023, 4, 10),
    updatedAt: new Date(2023, 4, 15),
    votes: 8,
    tags: ["Forecasting", "Accuracy", "Calculation"],
    comments: [
      {
        id: 1,
        feedbackId: 1,
        content: "We should also consider adding weighted accuracy based on financial impact.",
        user: sampleUsers[3],
        createdAt: new Date(2023, 4, 12)
      },
      {
        id: 2,
        feedbackId: 1,
        content: "I'll prepare a proposal for the new calculation method by next week.",
        user: sampleUsers[2],
        createdAt: new Date(2023, 4, 14)
      }
    ]
  },
  {
    id: 2,
    title: "Add data validation rules for ERP imports",
    description: "We need additional validation rules for data imported from the ERP system to ensure consistency and prevent errors in financial reports.",
    category: "process",
    status: "planned",
    priority: "medium",
    submittedBy: sampleUsers[1],
    createdAt: new Date(2023, 4, 8),
    updatedAt: new Date(2023, 4, 13),
    votes: 5,
    tags: ["Data Integration", "Validation", "Data Quality"],
    comments: [
      {
        id: 3,
        feedbackId: 2,
        content: "I can help define the validation rules based on our reporting requirements.",
        user: sampleUsers[0],
        createdAt: new Date(2023, 4, 9)
      }
    ]
  },
  {
    id: 3,
    title: "Streamline month-end close process",
    description: "The current month-end close process has too many manual steps. We should automate more of the reconciliation and review process.",
    category: "process",
    status: "under_review",
    priority: "high",
    submittedBy: sampleUsers[2],
    assignedTo: sampleUsers[2],
    createdAt: new Date(2023, 4, 5),
    updatedAt: new Date(2023, 4, 12),
    votes: 12,
    tags: ["Month-End Close", "Automation", "Process Improvement"],
    comments: [
      {
        id: 4,
        feedbackId: 3,
        content: "This should be our top priority. The manual reconciliations are taking too much time.",
        user: sampleUsers[0],
        createdAt: new Date(2023, 4, 6)
      },
      {
        id: 5,
        feedbackId: 3,
        content: "I've started documenting the current process to identify automation opportunities.",
        user: sampleUsers[2],
        createdAt: new Date(2023, 4, 11)
      }
    ]
  },
  {
    id: 4,
    title: "Add collaborative commenting to forecasts",
    description: "We need the ability to add comments directly to forecast numbers to document assumptions and reasoning.",
    category: "feature",
    status: "implemented",
    priority: "medium",
    submittedBy: sampleUsers[3],
    assignedTo: sampleUsers[1],
    createdAt: new Date(2023, 3, 20),
    updatedAt: new Date(2023, 4, 8),
    votes: 7,
    tags: ["Forecasting", "Collaboration", "Documentation"],
    comments: [
      {
        id: 6,
        feedbackId: 4,
        content: "This feature has been implemented and is now available in the latest release.",
        user: sampleUsers[1],
        createdAt: new Date(2023, 4, 8)
      }
    ]
  },
  {
    id: 5,
    title: "Fix calculation error in variance reports",
    description: "There appears to be a calculation error in the variance reports when filtering by department.",
    category: "bug",
    status: "new",
    priority: "critical",
    submittedBy: sampleUsers[0],
    createdAt: new Date(2023, 4, 16),
    updatedAt: new Date(2023, 4, 16),
    votes: 2,
    tags: ["Bug", "Variance Reports", "Calculation"],
    comments: []
  }
];

// Sample meetings
const sampleMeetings: Meeting[] = [
  {
    id: 1,
    title: "April 2023 Forecast Review",
    type: "review",
    date: new Date(2023, 3, 28),
    attendees: [sampleUsers[0], sampleUsers[2], sampleUsers[3]],
    summary: "Reviewed the Q2 forecasts and discussed key assumptions. Overall, the forecast looks solid with some concerns about the supply chain impact on COGS.",
    actionItems: [],
    decisions: [
      "Approved the Q2 forecast with noted concerns",
      "Will re-evaluate COGS assumptions in May",
      "Need to improve documentation of forecast assumptions"
    ],
    tags: ["Forecast Review", "Q2 2023"]
  },
  {
    id: 2,
    title: "System Improvement Planning Session",
    type: "planning",
    date: new Date(2023, 4, 5),
    attendees: [sampleUsers[1], sampleUsers[2], sampleUsers[3]],
    summary: "Planning session for system improvements in Q2 and Q3. Prioritized items include data validation, process automation, and reporting enhancements.",
    actionItems: [],
    decisions: [
      "Data validation improvements are the top priority",
      "Will allocate 20% of IT resources to automation initiatives",
      "Need to establish better KPIs for system performance"
    ],
    tags: ["Planning", "System Improvements"]
  },
  {
    id: 3,
    title: "Q1 2023 Process Retrospective",
    type: "retrospective",
    date: new Date(2023, 4, 12),
    attendees: [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]],
    summary: "Retrospective on Q1 processes. Identified several pain points in the month-end close process and data integration from new systems.",
    actionItems: [],
    decisions: [
      "Need to streamline the month-end close process",
      "Documentation for new system integrations must be improved",
      "Will implement weekly check-ins on process improvements"
    ],
    tags: ["Retrospective", "Process Improvement", "Q1 2023"]
  }
];

// Sample action items
const sampleActionItems: ActionItem[] = [
  {
    id: 1,
    title: "Document current month-end close process",
    description: "Create detailed documentation of the current month-end close process, identifying all manual steps and potential automation opportunities.",
    status: "completed",
    assignedTo: sampleUsers[0],
    createdAt: new Date(2023, 4, 12),
    dueDate: new Date(2023, 4, 19),
    priority: "high",
    relatedFeedback: 3,
    parentMeeting: 3
  },
  {
    id: 2,
    title: "Define new forecast accuracy calculation method",
    description: "Develop and document a new method for calculating forecast accuracy that accounts for timing differences and weighted impact.",
    status: "in_progress",
    assignedTo: sampleUsers[2],
    createdAt: new Date(2023, 4, 15),
    dueDate: new Date(2023, 4, 22),
    priority: "high",
    relatedFeedback: 1
  },
  {
    id: 3,
    title: "Create data validation rules for ERP imports",
    description: "Define comprehensive validation rules for data imported from the ERP system, focusing on account codes, amounts, and dates.",
    status: "pending",
    assignedTo: sampleUsers[1],
    createdAt: new Date(2023, 4, 13),
    dueDate: new Date(2023, 4, 27),
    priority: "medium",
    relatedFeedback: 2,
    parentMeeting: 2
  },
  {
    id: 4,
    title: "Analyze current system performance metrics",
    description: "Analyze current system performance metrics and propose new KPIs to better track system effectiveness.",
    status: "in_progress",
    assignedTo: sampleUsers[3],
    createdAt: new Date(2023, 4, 5),
    dueDate: new Date(2023, 4, 20),
    priority: "medium",
    parentMeeting: 2
  },
  {
    id: 5,
    title: "Investigate calculation error in variance reports",
    description: "Investigate and fix the calculation error in variance reports when filtering by department.",
    status: "in_progress",
    assignedTo: sampleUsers[1],
    createdAt: new Date(2023, 4, 16),
    dueDate: new Date(2023, 4, 18),
    priority: "critical",
    relatedFeedback: 5
  }
];

// Add action items to meetings
sampleMeetings[0].actionItems = []; // No action items for this meeting
sampleMeetings[1].actionItems = [sampleActionItems[3]]; // System planning meeting
sampleMeetings[2].actionItems = [sampleActionItems[0]]; // Retrospective meeting

// Sample KPIs
const sampleKpis: Kpi[] = [
  {
    id: 1,
    name: "Forecast Accuracy",
    description: "Measures the accuracy of financial forecasts compared to actual results",
    target: 95,
    current: 89,
    unit: "%",
    trend: "improving",
    historyData: [
      { date: new Date(2023, 0, 31), value: 84 },
      { date: new Date(2023, 1, 28), value: 86 },
      { date: new Date(2023, 2, 31), value: 87 },
      { date: new Date(2023, 3, 30), value: 89 }
    ],
    category: "Forecasting",
    importance: "primary"
  },
  {
    id: 2,
    name: "Month-End Close Duration",
    description: "Number of business days to complete the month-end close process",
    target: 3,
    current: 5,
    unit: "days",
    trend: "stable",
    historyData: [
      { date: new Date(2023, 0, 31), value: 5 },
      { date: new Date(2023, 1, 28), value: 5 },
      { date: new Date(2023, 2, 31), value: 5 },
      { date: new Date(2023, 3, 30), value: 5 }
    ],
    category: "Process Efficiency",
    importance: "primary"
  },
  {
    id: 3,
    name: "Data Integration Success Rate",
    description: "Percentage of data integration jobs that complete successfully without errors",
    target: 99,
    current: 97,
    unit: "%",
    trend: "improving",
    historyData: [
      { date: new Date(2023, 0, 31), value: 94 },
      { date: new Date(2023, 1, 28), value: 95 },
      { date: new Date(2023, 2, 31), value: 96 },
      { date: new Date(2023, 3, 30), value: 97 }
    ],
    category: "Data Quality",
    importance: "primary"
  },
  {
    id: 4,
    name: "Variance Analysis Time",
    description: "Average time spent on variance analysis per month",
    target: 8,
    current: 12,
    unit: "hours",
    trend: "declining",
    historyData: [
      { date: new Date(2023, 0, 31), value: 10 },
      { date: new Date(2023, 1, 28), value: 11 },
      { date: new Date(2023, 2, 31), value: 11 },
      { date: new Date(2023, 3, 30), value: 12 }
    ],
    category: "Process Efficiency",
    importance: "secondary"
  },
  {
    id: 5,
    name: "System Availability",
    description: "Percentage of time the financial planning system is available during business hours",
    target: 99.9,
    current: 99.7,
    unit: "%",
    trend: "stable",
    historyData: [
      { date: new Date(2023, 0, 31), value: 99.8 },
      { date: new Date(2023, 1, 28), value: 99.6 },
      { date: new Date(2023, 2, 31), value: 99.8 },
      { date: new Date(2023, 3, 30), value: 99.7 }
    ],
    category: "System Performance",
    importance: "secondary"
  },
  {
    id: 6,
    name: "User Satisfaction",
    description: "Average user satisfaction score based on quarterly surveys",
    target: 4.5,
    current: 4.1,
    unit: "out of 5",
    trend: "improving",
    historyData: [
      { date: new Date(2022, 9, 30), value: 3.8 },
      { date: new Date(2022, 12, 31), value: 3.9 },
      { date: new Date(2023, 3, 30), value: 4.1 }
    ],
    category: "User Experience",
    importance: "primary"
  }
];

// Sample recommendations
const sampleRecommendations: Recommendation[] = [
  {
    id: 1,
    title: "Implement Automated Reconciliation",
    description: "Implement automated reconciliation processes for key accounts to reduce manual effort and improve accuracy in the month-end close process.",
    implementationSteps: [
      "Identify accounts suitable for automated reconciliation",
      "Define matching rules and tolerance levels",
      "Develop reconciliation algorithms",
      "Test with historical data",
      "Roll out in phases, starting with high-volume, low-complexity accounts"
    ],
    benefits: [
      "Reduce month-end close time by approximately 30%",
      "Improve accuracy by eliminating manual matching errors",
      "Free up analyst time for value-added analysis",
      "Create audit trail of reconciliation process"
    ],
    priority: "high",
    estimatedImpact: [
      {
        category: "Time Savings",
        description: "Reduction in manual reconciliation time",
        value: 40
      },
      {
        category: "Error Reduction",
        description: "Reduction in reconciliation errors",
        value: 60
      }
    ],
    status: "active",
    generatedAt: new Date(2023, 4, 10),
    relatedKpis: [2, 4],
    relatedFeedback: [3]
  },
  {
    id: 2,
    title: "Enhance Forecast Accuracy Calculation",
    description: "Implement a more sophisticated forecast accuracy calculation that accounts for timing differences, materiality, and business impact.",
    implementationSteps: [
      "Define new forecast accuracy methodology",
      "Create weighting factors based on account materiality",
      "Implement adjustments for timing differences",
      "Develop visualization of accuracy trends",
      "Create documentation and training for users"
    ],
    benefits: [
      "More accurate representation of forecast performance",
      "Better insights into areas needing improvement",
      "Ability to track accuracy by business unit, product, etc.",
      "Improved decision-making based on more reliable metrics"
    ],
    priority: "medium",
    estimatedImpact: [
      {
        category: "Metric Improvement",
        description: "Improvement in accuracy of the KPI itself",
        value: 30
      },
      {
        category: "Decision Quality",
        description: "Improvement in decision-making quality",
        value: 25
      }
    ],
    status: "active",
    generatedAt: new Date(2023, 4, 12),
    relatedKpis: [1],
    relatedFeedback: [1]
  },
  {
    id: 3,
    title: "Implement Data Quality Scoring",
    description: "Develop a comprehensive data quality scoring system for all imported data to proactively identify and address data issues.",
    implementationSteps: [
      "Define data quality dimensions (completeness, accuracy, consistency, etc.)",
      "Develop scoring algorithms for each dimension",
      "Implement real-time data quality monitoring",
      "Create dashboards for data quality metrics",
      "Establish thresholds for alerts and intervention"
    ],
    benefits: [
      "Early detection of data quality issues",
      "Reduced time spent on data cleaning and correction",
      "Improved trust in data and analysis",
      "Better understanding of data quality trends"
    ],
    priority: "medium",
    estimatedImpact: [
      {
        category: "Data Quality",
        description: "Improvement in overall data quality",
        value: 35
      },
      {
        category: "Time Savings",
        description: "Reduction in data cleaning time",
        value: 25
      }
    ],
    status: "active",
    generatedAt: new Date(2023, 4, 14),
    relatedKpis: [3],
    relatedFeedback: [2]
  }
];

// Utility functions
const formatDate = (date: Date): string => {
  return format(date, "MMM d, yyyy");
};

const formatDateTime = (date: Date): string => {
  return format(date, "MMM d, yyyy h:mm a");
};

const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toFixed(decimals);
};

const getCategoryBadgeColor = (category: FeedbackCategory): string => {
  switch (category) {
    case 'process':
      return "bg-blue-100 text-blue-800";
    case 'accuracy':
      return "bg-green-100 text-green-800";
    case 'usability':
      return "bg-purple-100 text-purple-800";
    case 'feature':
      return "bg-amber-100 text-amber-800";
    case 'bug':
      return "bg-red-100 text-red-800";
    default:
      return "bg-neutral-100 text-neutral-800";
  }
};

const getStatusBadgeColor = (status: FeedbackStatus): string => {
  switch (status) {
    case 'new':
      return "bg-blue-100 text-blue-800";
    case 'under_review':
      return "bg-purple-100 text-purple-800";
    case 'planned':
      return "bg-amber-100 text-amber-800";
    case 'in_progress':
      return "bg-green-100 text-green-800";
    case 'implemented':
      return "bg-green-100 text-green-800";
    case 'declined':
      return "bg-neutral-100 text-neutral-800";
    default:
      return "bg-neutral-100 text-neutral-800";
  }
};

const getPriorityBadgeColor = (priority: FeedbackPriority): string => {
  switch (priority) {
    case 'critical':
      return "bg-red-100 text-red-800";
    case 'high':
      return "bg-amber-100 text-amber-800";
    case 'medium':
      return "bg-blue-100 text-blue-800";
    case 'low':
      return "bg-green-100 text-green-800";
    default:
      return "bg-neutral-100 text-neutral-800";
  }
};

const getActionStatusBadgeColor = (status: ActionItemStatus): string => {
  switch (status) {
    case 'pending':
      return "bg-blue-100 text-blue-800";
    case 'in_progress':
      return "bg-amber-100 text-amber-800";
    case 'completed':
      return "bg-green-100 text-green-800";
    case 'blocked':
      return "bg-red-100 text-red-800";
    default:
      return "bg-neutral-100 text-neutral-800";
  }
};

const getTrendBadgeColor = (trend: KpiTrend): string => {
  switch (trend) {
    case 'improving':
      return "bg-green-100 text-green-800";
    case 'stable':
      return "bg-blue-100 text-blue-800";
    case 'declining':
      return "bg-red-100 text-red-800";
    default:
      return "bg-neutral-100 text-neutral-800";
  }
};

const getTrendIcon = (trend: KpiTrend) => {
  switch (trend) {
    case 'improving':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'stable':
      return <ChartLine className="h-4 w-4 text-blue-600" />;
    case 'declining':
      return <Trending className="h-4 w-4 text-red-600" />;
    default:
      return <ChartLine className="h-4 w-4 text-neutral-600" />;
  }
};

// Calculate progress percentage for a KPI
const calculateKpiProgress = (kpi: Kpi): number => {
  if (kpi.target === kpi.current) return 100;
  
  // For metrics where lower is better (like days to close)
  if (kpi.name.includes("Duration") || kpi.name.includes("Time")) {
    const range = kpi.current > kpi.target ? kpi.current - 0 : kpi.target - 0;
    return Math.max(0, Math.min(100, ((kpi.target - kpi.current) / range + 1) * 100));
  }
  
  // For metrics where higher is better
  return Math.max(0, Math.min(100, (kpi.current / kpi.target) * 100));
};

// Calculate weighted KPI score
const calculateOverallScore = (kpis: Kpi[]): number => {
  const primaryWeight = 0.7;
  const secondaryWeight = 0.3;
  
  const primaryKpis = kpis.filter(kpi => kpi.importance === 'primary');
  const secondaryKpis = kpis.filter(kpi => kpi.importance === 'secondary');
  
  const primaryScore = primaryKpis.reduce((sum, kpi) => sum + calculateKpiProgress(kpi), 0) / (primaryKpis.length || 1);
  const secondaryScore = secondaryKpis.reduce((sum, kpi) => sum + calculateKpiProgress(kpi), 0) / (secondaryKpis.length || 1);
  
  return (primaryScore * primaryWeight) + (secondaryScore * secondaryWeight);
};

interface FeedbackSystemProps {
  isLoading?: boolean;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ isLoading = false }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("feedback-loop");
  
  // State for KPIs and recommendations
  const [kpis, setKpis] = useState<Kpi[]>(sampleKpis);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(sampleRecommendations);
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>(sampleFeedback);
  const [actionItems, setActionItems] = useState<ActionItem[]>(sampleActionItems);
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings);
  
  // States for dialogs
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState<boolean>(false);
  const [newActionDialogOpen, setNewActionDialogOpen] = useState<boolean>(false);
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  
  // Filter states
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string>("all");
  const [actionStatusFilter, setActionStatusFilter] = useState<string>("all");
  
  // Calculate overall score
  const overallScore = calculateOverallScore(kpis);
  
  // Handle feedback selection
  const handleFeedbackSelect = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackDialogOpen(true);
  };
  
  // Filter feedback based on status
  const filteredFeedback = feedbackStatusFilter === "all" 
    ? feedbackItems 
    : feedbackItems.filter(item => item.status === feedbackStatusFilter);
  
  // Filter action items based on status
  const filteredActions = actionStatusFilter === "all"
    ? actionItems
    : actionItems.filter(item => item.status === actionStatusFilter);
  
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Continuous Improvement System</CardTitle>
              <CardDescription>
                Track feedback, manage action items, and monitor improvement KPIs
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Feedback
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* KPI Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Improvement KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {kpis.filter(kpi => kpi.importance === 'primary').map(kpi => (
                <Card key={kpi.id} className="border shadow-none">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{kpi.name}</div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(kpi.trend)}
                        <Badge className={getTrendBadgeColor(kpi.trend)}>
                          {kpi.trend.charAt(0).toUpperCase() + kpi.trend.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-neutral-500 mb-3">{kpi.description}</div>
                    
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <div>Current: <span className="font-medium">{kpi.current} {kpi.unit}</span></div>
                      <div>Target: <span className="font-medium">{kpi.target} {kpi.unit}</span></div>
                    </div>
                    
                    <Progress 
                      value={calculateKpiProgress(kpi)} 
                      className="h-2 mb-2" 
                    />
                    
                    <div className="text-xs text-neutral-500">
                      Last updated: {formatDate(kpi.historyData[kpi.historyData.length - 1].date)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.filter(kpi => kpi.importance === 'secondary').map(kpi => (
                <div key={kpi.id} className="flex justify-between items-center border rounded-lg p-3">
                  <div>
                    <div className="font-medium">{kpi.name}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{kpi.current} {kpi.unit}</span>
                      <span className="text-neutral-400">of {kpi.target} {kpi.unit}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={getTrendBadgeColor(kpi.trend)} variant="outline">
                      {kpi.trend.charAt(0).toUpperCase() + kpi.trend.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-0">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold">{Math.round(overallScore)}%</div>
              </div>
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={
                    overallScore >= 90
                      ? "#22c55e"
                      : overallScore >= 70
                      ? "#0ea5e9"
                      : overallScore >= 50
                      ? "#f59e0b"
                      : "#ef4444"
                  }
                  strokeWidth="12"
                  strokeDasharray={`${(overallScore / 100) * 251.2} 251.2`}
                />
              </svg>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-sm text-neutral-500">Improvement Score</div>
              <div className="flex justify-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs">Primary KPIs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs">Secondary KPIs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback-loop" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Feedback Loop
          </TabsTrigger>
          <TabsTrigger value="action-items" className="flex items-center gap-1">
            <ListChecks className="h-4 w-4" />
            Action Items
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>
        
        {/* Feedback Loop Tab */}
        <TabsContent value="feedback-loop">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Select 
                value={feedbackStatusFilter}
                onValueChange={setFeedbackStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="implemented">Implemented</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input placeholder="Search feedback..." className="pl-8 w-[250px]" />
              </div>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
          </div>
          
          <div className="space-y-4">
            {filteredFeedback.map(feedback => (
              <Card 
                key={feedback.id} 
                className="border cursor-pointer hover:shadow-sm transition-all"
                onClick={() => handleFeedbackSelect(feedback)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-2">
                    <div className="font-medium text-lg">{feedback.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadgeColor(feedback.status)}>
                        {feedback.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                      <Badge className={getPriorityBadgeColor(feedback.priority)}>
                        {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                      </Badge>
                      <Badge className={getCategoryBadgeColor(feedback.category)}>
                        {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-neutral-600 mb-3 line-clamp-2">{feedback.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className={feedback.submittedBy.avatarColor + " text-xs"}>
                          {feedback.submittedBy.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-neutral-500">
                        Submitted by {feedback.submittedBy.name} on {formatDate(feedback.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-neutral-500">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span className="text-xs">{feedback.votes}</span>
                      </div>
                      <div className="flex items-center text-neutral-500">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="text-xs">{feedback.comments.length}</span>
                      </div>
                      {feedback.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {feedback.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {feedback.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{feedback.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Action Items Tab */}
        <TabsContent value="action-items">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Select 
                value={actionStatusFilter}
                onValueChange={setActionStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input placeholder="Search action items..." className="pl-8 w-[250px]" />
              </div>
            </div>
            
            <Button onClick={() => setNewActionDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Action Item
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActions.map(action => (
                    <TableRow key={action.id} className="hover:bg-neutral-50">
                      <TableCell>
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-neutral-500 max-w-[300px] truncate">
                          {action.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={action.assignedTo.avatarColor + " text-xs"}>
                              {action.assignedTo.avatarInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{action.assignedTo.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionStatusBadgeColor(action.status)}>
                          {action.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityBadgeColor(action.priority)}>
                          {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(action.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {action.status !== 'completed' && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Meetings Tab */}
        <TabsContent value="meetings">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Meeting Types</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="retrospective">Retrospective</SelectItem>
                  <SelectItem value="stakeholder">Stakeholder</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input placeholder="Search meetings..." className="pl-8 w-[250px]" />
              </div>
            </div>
            
            <Button onClick={() => setNewMeetingDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Meeting
            </Button>
          </div>
          
          <div className="space-y-4">
            {meetings.map(meeting => (
              <Card key={meeting.id} className="border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{meeting.title}</CardTitle>
                      <CardDescription>
                        {meeting.type.charAt(0).toUpperCase() + meeting.type.slice(1)} • {formatDate(meeting.date)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Summary</div>
                      <div className="text-sm text-neutral-600">{meeting.summary}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Decisions</div>
                      <ul className="text-sm text-neutral-600 list-disc pl-5 space-y-1">
                        {meeting.decisions.map((decision, index) => (
                          <li key={index}>{decision}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {meeting.actionItems.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-1">Action Items</div>
                        <div className="space-y-2">
                          {meeting.actionItems.map(action => {
                            const actionDetails = actionItems.find(a => a.id === action.id);
                            if (!actionDetails) return null;
                            
                            return (
                              <div key={action.id} className="flex justify-between items-center border rounded-md p-2">
                                <div>
                                  <div className="font-medium text-sm">{actionDetails.title}</div>
                                  <div className="text-xs text-neutral-500">
                                    Assigned to {actionDetails.assignedTo.name}
                                  </div>
                                </div>
                                <Badge className={getActionStatusBadgeColor(actionDetails.status)}>
                                  {actionDetails.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Attendees</div>
                      <div className="flex flex-wrap gap-2">
                        {meeting.attendees.map(attendee => (
                          <div key={attendee.id} className="flex items-center gap-1 border rounded-full px-2 py-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className={attendee.avatarColor + " text-xs"}>
                                {attendee.avatarInitials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{attendee.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {meeting.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {meeting.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="space-y-4">
                {recommendations.map(recommendation => (
                  <Card key={recommendation.id} className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        <Badge className={getPriorityBadgeColor(recommendation.priority)}>
                          {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                        </Badge>
                      </div>
                      <CardDescription>{recommendation.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Implementation Steps</div>
                            <ul className="text-sm text-neutral-600 list-decimal pl-5 space-y-1">
                              {recommendation.implementationSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium mb-1">Expected Benefits</div>
                            <ul className="text-sm text-neutral-600 list-disc pl-5 space-y-1">
                              {recommendation.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-2">Estimated Impact</div>
                          <div className="space-y-2">
                            {recommendation.estimatedImpact.map((impact, index) => (
                              <div key={index}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                  <div>{impact.category}: {impact.description}</div>
                                  <div className="font-medium">{impact.value}%</div>
                                </div>
                                <Progress value={impact.value} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-neutral-500">
                          <div>Generated on {formatDate(recommendation.generatedAt)}</div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Check className="h-4 w-4 mr-1" />
                              Implement
                            </Button>
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                  <CardDescription>
                    Powered by machine learning and process analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Continuous Learning System</div>
                      <div className="text-xs text-neutral-500">Analyzes patterns and suggests improvements</div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-start gap-2">
                      <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-blue-800">System Analyzing</div>
                        <div className="text-xs text-blue-700">
                          Based on recent improvements, the system is analyzing opportunities in the month-end close process.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Insights based on:</div>
                    <div className="text-xs text-neutral-500">
                      <ul className="list-disc pl-5 space-y-0.5">
                        <li>User feedback and ratings</li>
                        <li>Process metrics and KPIs</li>
                        <li>Meeting outcomes and action items</li>
                        <li>Historical improvements</li>
                        <li>Industry benchmarks</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-2">Generate Recommendations</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
                        <div className="text-sm">Forecast Accuracy Improvement</div>
                        <Button variant="ghost" size="sm">Generate</Button>
                      </div>
                      <div className="flex items-center justify-between border p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
                        <div className="text-sm">Month-End Process Optimization</div>
                        <Button variant="ghost" size="sm">Generate</Button>
                      </div>
                      <div className="flex items-center justify-between border p-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
                        <div className="text-sm">Data Quality Enhancement</div>
                        <Button variant="ghost" size="sm">Generate</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Recommendations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Feedback Details Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <DialogTitle>{selectedFeedback.title}</DialogTitle>
                  <div className="flex gap-1">
                    <Badge className={getStatusBadgeColor(selectedFeedback.status)}>
                      {selectedFeedback.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                    <Badge className={getPriorityBadgeColor(selectedFeedback.priority)}>
                      {selectedFeedback.priority.charAt(0).toUpperCase() + selectedFeedback.priority.slice(1)}
                    </Badge>
                    <Badge className={getCategoryBadgeColor(selectedFeedback.category)}>
                      {selectedFeedback.category.charAt(0).toUpperCase() + selectedFeedback.category.slice(1)}
                    </Badge>
                  </div>
                </div>
                <DialogDescription>
                  Submitted by {selectedFeedback.submittedBy.name} on {formatDate(selectedFeedback.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Description</div>
                  <div className="text-sm text-neutral-600 border rounded-lg p-3 bg-neutral-50">
                    {selectedFeedback.description}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Comments ({selectedFeedback.comments.length})</div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {selectedFeedback.comments.map(comment => (
                      <div key={comment.id} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={comment.user.avatarColor + " text-xs"}>
                              {comment.user.avatarInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{comment.user.name}</span>
                            <span className="text-xs text-neutral-500">{formatDateTime(comment.createdAt)}</span>
                          </div>
                        </div>
                        <div className="text-sm">{comment.content}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                    <div className="flex justify-end mt-2">
                      <Button>
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
                
                {selectedFeedback.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedFeedback.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <DialogFooter className="gap-2">
                {selectedFeedback.status !== 'implemented' && selectedFeedback.status !== 'declined' && (
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Action Item
                  </Button>
                )}
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button>
                  <Check className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* New Action Item Dialog */}
      <Dialog open={newActionDialogOpen} onOpenChange={setNewActionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Action Item</DialogTitle>
            <DialogDescription>
              Create a new action item to track progress on improvements
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Enter action item title" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Enter description" className="min-h-[80px]" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned To</label>
                <Select defaultValue="1">
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
                <label className="text-sm font-medium">Priority</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Related Feedback (Optional)</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select related feedback" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {feedbackItems.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setNewActionDialogOpen(false)}>
              Create Action Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Meeting Dialog */}
      <Dialog open={newMeetingDialogOpen} onOpenChange={setNewMeetingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Meeting</DialogTitle>
            <DialogDescription>
              Document a meeting and its outcomes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Title</label>
              <Input placeholder="Enter meeting title" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Meeting Type</label>
                <Select defaultValue="review">
                  <SelectTrigger>
                    <SelectValue placeholder="Select meeting type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="retrospective">Retrospective</SelectItem>
                    <SelectItem value="stakeholder">Stakeholder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Attendees</label>
              <div className="border rounded-lg p-3 flex flex-wrap gap-2">
                {sampleUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-1 border rounded-full px-2 py-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className={user.avatarColor + " text-xs"}>
                        {user.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{user.name}</span>
                    <X className="h-3 w-3 cursor-pointer" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Summary</label>
              <Textarea placeholder="Enter meeting summary" className="min-h-[80px]" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Key Decisions</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Enter a decision" className="flex-1" />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input placeholder="Enter comma-separated tags" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMeetingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setNewMeetingDialogOpen(false)}>
              Save Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackSystem;