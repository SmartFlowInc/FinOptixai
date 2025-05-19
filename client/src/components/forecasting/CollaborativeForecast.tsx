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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart4,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  GanttChart,
  GitBranch,
  GitCommit,
  GitMerge,
  GripVertical,
  History,
  LineChart,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  PenSquare,
  PieChart,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Slash,
  ThumbsUp,
  Trash,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

// Define types for collaborative forecasting
type ForecastType = 'revenue' | 'expense' | 'headcount' | 'cash_flow' | 'capex';
type ForecastTimeframe = 'monthly' | 'quarterly' | 'annual';
type ForecastStatus = 'draft' | 'in_review' | 'approved' | 'finalized';
type ForecastInputMethod = 'manual' | 'imported' | 'calculated' | 'collaborated';
type ForecastMode = 'pessimistic' | 'realistic' | 'optimistic';

interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  avatarInitials: string;
  avatarColor: string;
}

interface ForecastValue {
  period: string;
  amount: number;
  comment?: string;
  lastModified?: Date;
  modifiedBy?: User;
  inputMethod: ForecastInputMethod;
}

interface ForecastScenario {
  id: number;
  name: string;
  description: string;
  mode: ForecastMode;
  isPrimary: boolean;
  createdBy: User;
  createdAt: Date;
  values: Record<string, ForecastValue[]>;
}

interface ForecastCategory {
  id: number;
  name: string;
  code: string;
  parent?: string;
  type: ForecastType;
  owner?: User;
  description?: string;
  growthAssumptions?: string;
  isExpandable: boolean;
  children?: ForecastCategory[];
}

interface ForecastRevision {
  id: number;
  version: string;
  createdAt: Date;
  createdBy: User;
  comment: string;
  changeType: 'major' | 'minor';
  changes: ForecastChange[];
}

interface ForecastChange {
  category: string;
  period: string;
  oldValue: number;
  newValue: number;
  percentChange: number;
}

interface ForecastComment {
  id: number;
  user: User;
  text: string;
  timestamp: Date;
  category: string;
  period?: string;
  resolved: boolean;
  replyTo?: number;
  replies?: ForecastComment[];
}

interface ForecastDashboardItem {
  id: number;
  title: string;
  type: 'chart' | 'table' | 'kpi';
  chartType?: 'line' | 'bar' | 'pie' | 'area';
  description: string;
  size: 'small' | 'medium' | 'large';
  data: any;
  config: any;
}

// Sample users
const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Financial Analyst",
    department: "Finance",
    avatarInitials: "JD",
    avatarColor: "bg-primary/10 text-primary"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Finance Director",
    department: "Finance",
    avatarInitials: "JS",
    avatarColor: "bg-green-100 text-green-800"
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Sales Director",
    department: "Sales",
    avatarInitials: "MB",
    avatarColor: "bg-purple-100 text-purple-800"
  },
  {
    id: 4,
    name: "Alicia Kim",
    role: "Marketing Director",
    department: "Marketing",
    avatarInitials: "AK",
    avatarColor: "bg-amber-100 text-amber-800"
  },
  {
    id: 5,
    name: "David Chen",
    role: "Operations Manager",
    department: "Operations",
    avatarInitials: "DC",
    avatarColor: "bg-blue-100 text-blue-800"
  }
];

// Sample forecast categories
const sampleCategories: ForecastCategory[] = [
  {
    id: 1,
    name: "Revenue",
    code: "REV",
    type: "revenue",
    description: "All revenue sources",
    isExpandable: true,
    children: [
      {
        id: 11,
        name: "Product Revenue",
        code: "REV-PROD",
        parent: "REV",
        type: "revenue",
        owner: sampleUsers[2],
        description: "Revenue from product sales",
        growthAssumptions: "5% MoM growth based on sales team forecast",
        isExpandable: true,
        children: [
          {
            id: 111,
            name: "Hardware",
            code: "REV-PROD-HW",
            parent: "REV-PROD",
            type: "revenue",
            owner: sampleUsers[2],
            isExpandable: false
          },
          {
            id: 112,
            name: "Software",
            code: "REV-PROD-SW",
            parent: "REV-PROD",
            type: "revenue",
            owner: sampleUsers[2],
            isExpandable: false
          }
        ]
      },
      {
        id: 12,
        name: "Service Revenue",
        code: "REV-SERV",
        parent: "REV",
        type: "revenue",
        owner: sampleUsers[2],
        description: "Revenue from services",
        growthAssumptions: "3% MoM growth based on historical data",
        isExpandable: true,
        children: [
          {
            id: 121,
            name: "Consulting",
            code: "REV-SERV-CON",
            parent: "REV-SERV",
            type: "revenue",
            owner: sampleUsers[2],
            isExpandable: false
          },
          {
            id: 122,
            name: "Support",
            code: "REV-SERV-SUP",
            parent: "REV-SERV",
            type: "revenue",
            owner: sampleUsers[2],
            isExpandable: false
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Expenses",
    code: "EXP",
    type: "expense",
    description: "All expense categories",
    isExpandable: true,
    children: [
      {
        id: 21,
        name: "Operating Expenses",
        code: "EXP-OPEX",
        parent: "EXP",
        type: "expense",
        owner: sampleUsers[4],
        description: "All operational expenses",
        isExpandable: true,
        children: [
          {
            id: 211,
            name: "Salaries",
            code: "EXP-OPEX-SAL",
            parent: "EXP-OPEX",
            type: "expense",
            owner: sampleUsers[4],
            isExpandable: false
          },
          {
            id: 212,
            name: "Rent",
            code: "EXP-OPEX-RENT",
            parent: "EXP-OPEX",
            type: "expense",
            owner: sampleUsers[4],
            isExpandable: false
          },
          {
            id: 213,
            name: "Utilities",
            code: "EXP-OPEX-UTIL",
            parent: "EXP-OPEX",
            type: "expense",
            owner: sampleUsers[4],
            isExpandable: false
          }
        ]
      },
      {
        id: 22,
        name: "Marketing Expenses",
        code: "EXP-MKT",
        parent: "EXP",
        type: "expense",
        owner: sampleUsers[3],
        description: "All marketing and advertising expenses",
        isExpandable: true,
        children: [
          {
            id: 221,
            name: "Advertising",
            code: "EXP-MKT-ADV",
            parent: "EXP-MKT",
            type: "expense",
            owner: sampleUsers[3],
            isExpandable: false
          },
          {
            id: 222,
            name: "Events",
            code: "EXP-MKT-EVT",
            parent: "EXP-MKT",
            type: "expense",
            owner: sampleUsers[3],
            isExpandable: false
          }
        ]
      }
    ]
  }
];

// Sample forecast scenarios
const createSampleScenarios = (): ForecastScenario[] => {
  // Helper to create sample values for a category
  const createSampleValues = (
    baseAmount: number, 
    growth: number, 
    inputMethod: ForecastInputMethod = 'manual'
  ) => {
    const periods = ['Jan 2023', 'Feb 2023', 'Mar 2023', 'Apr 2023', 'May 2023', 'Jun 2023'];
    return periods.map((period, index) => ({
      period,
      amount: Math.round(baseAmount * Math.pow(1 + growth, index)),
      inputMethod,
      lastModified: new Date(2023, index, 15),
      modifiedBy: sampleUsers[Math.floor(Math.random() * sampleUsers.length)]
    }));
  };

  // Create scenarios with values for each category
  return [
    {
      id: 1,
      name: "Base Case",
      description: "Our most likely forecast scenario for FY2023",
      mode: "realistic",
      isPrimary: true,
      createdBy: sampleUsers[0],
      createdAt: new Date(2023, 0, 5),
      values: {
        "REV-PROD-HW": createSampleValues(500000, 0.05, 'collaborated'),
        "REV-PROD-SW": createSampleValues(300000, 0.08, 'collaborated'),
        "REV-SERV-CON": createSampleValues(200000, 0.03, 'manual'),
        "REV-SERV-SUP": createSampleValues(150000, 0.04, 'manual'),
        "EXP-OPEX-SAL": createSampleValues(400000, 0.02, 'imported'),
        "EXP-OPEX-RENT": createSampleValues(50000, 0, 'manual'),
        "EXP-OPEX-UTIL": createSampleValues(20000, 0.01, 'manual'),
        "EXP-MKT-ADV": createSampleValues(80000, 0.05, 'collaborated'),
        "EXP-MKT-EVT": createSampleValues(40000, 0.02, 'manual')
      }
    },
    {
      id: 2,
      name: "Aggressive Growth",
      description: "High growth scenario with expanded marketing and sales",
      mode: "optimistic",
      isPrimary: false,
      createdBy: sampleUsers[1],
      createdAt: new Date(2023, 0, 10),
      values: {
        "REV-PROD-HW": createSampleValues(500000, 0.08, 'collaborated'),
        "REV-PROD-SW": createSampleValues(300000, 0.12, 'collaborated'),
        "REV-SERV-CON": createSampleValues(200000, 0.05, 'manual'),
        "REV-SERV-SUP": createSampleValues(150000, 0.06, 'manual'),
        "EXP-OPEX-SAL": createSampleValues(450000, 0.03, 'imported'),
        "EXP-OPEX-RENT": createSampleValues(50000, 0, 'manual'),
        "EXP-OPEX-UTIL": createSampleValues(22000, 0.015, 'manual'),
        "EXP-MKT-ADV": createSampleValues(100000, 0.08, 'collaborated'),
        "EXP-MKT-EVT": createSampleValues(60000, 0.05, 'manual')
      }
    },
    {
      id: 3,
      name: "Conservative",
      description: "Lower growth scenario with cost control focus",
      mode: "pessimistic",
      isPrimary: false,
      createdBy: sampleUsers[0],
      createdAt: new Date(2023, 0, 12),
      values: {
        "REV-PROD-HW": createSampleValues(480000, 0.03, 'collaborated'),
        "REV-PROD-SW": createSampleValues(280000, 0.04, 'collaborated'),
        "REV-SERV-CON": createSampleValues(190000, 0.02, 'manual'),
        "REV-SERV-SUP": createSampleValues(140000, 0.02, 'manual'),
        "EXP-OPEX-SAL": createSampleValues(390000, 0.01, 'imported'),
        "EXP-OPEX-RENT": createSampleValues(48000, 0, 'manual'),
        "EXP-OPEX-UTIL": createSampleValues(19000, 0.005, 'manual'),
        "EXP-MKT-ADV": createSampleValues(70000, 0.02, 'collaborated'),
        "EXP-MKT-EVT": createSampleValues(30000, 0.01, 'manual')
      }
    }
  ];
};

const sampleScenarios = createSampleScenarios();

// Sample forecast revisions
const sampleRevisions: ForecastRevision[] = [
  {
    id: 1,
    version: "1.0",
    createdAt: new Date(2023, 0, 5),
    createdBy: sampleUsers[0],
    comment: "Initial forecast created",
    changeType: "major",
    changes: []
  },
  {
    id: 2,
    version: "1.1",
    createdAt: new Date(2023, 0, 15),
    createdBy: sampleUsers[2],
    comment: "Updated sales projections based on Q4 results",
    changeType: "minor",
    changes: [
      {
        category: "REV-PROD-HW",
        period: "Feb 2023",
        oldValue: 525000,
        newValue: 550000,
        percentChange: 4.76
      },
      {
        category: "REV-PROD-SW",
        period: "Feb 2023",
        oldValue: 324000,
        newValue: 340000,
        percentChange: 4.94
      }
    ]
  },
  {
    id: 3,
    version: "1.2",
    createdAt: new Date(2023, 1, 5),
    createdBy: sampleUsers[3],
    comment: "Adjusted marketing expenses for new campaign",
    changeType: "minor",
    changes: [
      {
        category: "EXP-MKT-ADV",
        period: "Mar 2023",
        oldValue: 88200,
        newValue: 95000,
        percentChange: 7.71
      }
    ]
  },
  {
    id: 4,
    version: "2.0",
    createdAt: new Date(2023, 2, 1),
    createdBy: sampleUsers[1],
    comment: "Quarterly update with revised growth projections",
    changeType: "major",
    changes: [
      {
        category: "REV-PROD-HW",
        period: "Apr 2023",
        oldValue: 578813,
        newValue: 600000,
        percentChange: 3.66
      },
      {
        category: "REV-PROD-SW",
        period: "Apr 2023",
        oldValue: 367794,
        newValue: 380000,
        percentChange: 3.32
      },
      {
        category: "EXP-OPEX-SAL",
        period: "Apr 2023",
        oldValue: 416324,
        newValue: 425000,
        percentChange: 2.08
      }
    ]
  }
];

// Sample forecast comments
const sampleComments: ForecastComment[] = [
  {
    id: 1,
    user: sampleUsers[2],
    text: "I'm seeing stronger than expected demand for our hardware products. We should consider increasing our revenue projections for Q2.",
    timestamp: new Date(2023, 0, 15, 10, 30),
    category: "REV-PROD-HW",
    period: "Apr 2023",
    resolved: false,
    replies: [
      {
        id: 11,
        user: sampleUsers[0],
        text: "Good point, Michael. I'll review the sales pipeline data and update projections accordingly.",
        timestamp: new Date(2023, 0, 15, 11, 45),
        category: "REV-PROD-HW",
        period: "Apr 2023",
        resolved: false,
        replyTo: 1
      }
    ]
  },
  {
    id: 2,
    user: sampleUsers[3],
    text: "We're planning to launch a new marketing campaign in March. I've increased the advertising budget to reflect this initiative.",
    timestamp: new Date(2023, 1, 5, 9, 15),
    category: "EXP-MKT-ADV",
    period: "Mar 2023",
    resolved: true
  },
  {
    id: 3,
    user: sampleUsers[1],
    text: "The revenue growth assumptions seem optimistic given the current economic conditions. We should consider a more conservative approach.",
    timestamp: new Date(2023, 1, 8, 14, 20),
    category: "REV",
    resolved: false,
    replies: [
      {
        id: 31,
        user: sampleUsers[2],
        text: "I disagree, Jane. Our sales pipeline is very strong, and we're seeing increased demand across all product lines.",
        timestamp: new Date(2023, 1, 8, 15, 10),
        category: "REV",
        resolved: false,
        replyTo: 3
      },
      {
        id: 32,
        user: sampleUsers[0],
        text: "Let's look at both scenarios. I'll create a more conservative case for comparison.",
        timestamp: new Date(2023, 1, 8, 16, 5),
        category: "REV",
        resolved: false,
        replyTo: 3
      }
    ]
  }
];

// Sample forecast dashboard items
const sampleDashboardItems: ForecastDashboardItem[] = [
  {
    id: 1,
    title: "Revenue Forecast by Category",
    type: "chart",
    chartType: "bar",
    description: "Revenue forecast broken down by product and service categories",
    size: "large",
    data: {},
    config: {}
  },
  {
    id: 2,
    title: "Expense Trend",
    type: "chart",
    chartType: "line",
    description: "Monthly expense forecast with historical comparison",
    size: "medium",
    data: {},
    config: {}
  },
  {
    id: 3,
    title: "Profit Margin",
    type: "chart",
    chartType: "area",
    description: "Projected profit margin over the forecast period",
    size: "medium",
    data: {},
    config: {}
  },
  {
    id: 4,
    title: "Key Metrics",
    type: "kpi",
    description: "Summary of key financial metrics",
    size: "small",
    data: {},
    config: {}
  },
  {
    id: 5,
    title: "Scenario Comparison",
    type: "table",
    description: "Comparison of different forecast scenarios",
    size: "large",
    data: {},
    config: {}
  }
];

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (date: Date) => {
  return format(date, "MMM d, yyyy");
};

// Get category display name with proper indentation
const getCategoryDisplayName = (category: ForecastCategory, depth: number = 0) => {
  return (
    <div className="flex items-center">
      <div style={{ width: `${depth * 20}px` }} />
      {category.isExpandable && (
        <div className="mr-1">
          <ChevronRight className="h-4 w-4 text-neutral-500" />
        </div>
      )}
      <span>{category.name}</span>
    </div>
  );
};

// Get input method badge
const getInputMethodBadge = (method: ForecastInputMethod) => {
  switch (method) {
    case 'manual':
      return <Badge variant="outline">Manual</Badge>;
    case 'imported':
      return <Badge className="bg-blue-100 text-blue-800">Imported</Badge>;
    case 'calculated':
      return <Badge className="bg-purple-100 text-purple-800">Calculated</Badge>;
    case 'collaborated':
      return <Badge className="bg-green-100 text-green-800">Collaborated</Badge>;
    default:
      return <Badge variant="outline">{method}</Badge>;
  }
};

// Render the scenario badge
const getScenarioBadge = (mode: ForecastMode, isPrimary: boolean = false) => {
  let badgeClass = '';
  
  switch (mode) {
    case 'pessimistic':
      badgeClass = 'bg-amber-100 text-amber-800';
      break;
    case 'realistic':
      badgeClass = 'bg-blue-100 text-blue-800';
      break;
    case 'optimistic':
      badgeClass = 'bg-green-100 text-green-800';
      break;
  }
  
  return (
    <div className="flex items-center gap-1">
      <Badge className={badgeClass}>
        {mode.charAt(0).toUpperCase() + mode.slice(1)}
      </Badge>
      {isPrimary && (
        <Badge className="bg-primary/10 text-primary">Primary</Badge>
      )}
    </div>
  );
};

interface CollaborativeForecastProps {
  isLoading?: boolean;
}

const CollaborativeForecast: React.FC<CollaborativeForecastProps> = ({ 
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState<string>("forecast-grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ForecastScenario>(sampleScenarios[0]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'REV': true,
    'EXP': true
  });
  const [editingCell, setEditingCell] = useState<{
    code: string;
    period: string;
    value: number;
  } | null>(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<ForecastComment | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [inputMode, setInputMode] = useState<"single" | "bulk">("single");
  const [bulkEditParams, setBulkEditParams] = useState({
    startValue: 0,
    growthRate: 0,
    applyFrom: '',
    applyTo: ''
  });
  
  // Flatten categories for the grid view
  const getFlattenedCategories = (
    categories: ForecastCategory[],
    depth: number = 0,
    result: {category: ForecastCategory, depth: number}[] = []
  ) => {
    categories.forEach(category => {
      result.push({ category, depth });
      
      if (category.children && expandedCategories[category.code]) {
        getFlattenedCategories(category.children, depth + 1, result);
      }
    });
    
    return result;
  };
  
  const flattenedCategories = getFlattenedCategories(sampleCategories);
  
  // Get periods for the forecast
  const getPeriods = () => {
    // Use the first category with values to determine the periods
    const firstCategoryCode = Object.keys(selectedScenario.values)[0];
    if (firstCategoryCode) {
      return selectedScenario.values[firstCategoryCode].map(v => v.period);
    }
    return [];
  };
  
  const periods = getPeriods();
  
  // Toggle category expansion
  const toggleCategoryExpansion = (code: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };
  
  // Change scenario
  const handleScenarioChange = (scenarioId: string) => {
    const scenario = sampleScenarios.find(s => s.id === parseInt(scenarioId));
    if (scenario) {
      setSelectedScenario(scenario);
    }
  };
  
  // Get forecast value
  const getForecastValue = (code: string, period: string) => {
    if (selectedScenario.values[code]) {
      const value = selectedScenario.values[code].find(v => v.period === period);
      return value;
    }
    return null;
  };
  
  // Handle cell edit
  const handleCellEdit = (code: string, period: string, value: number) => {
    setEditingCell({ code, period, value });
  };
  
  // Save cell edit
  const saveCellEdit = () => {
    if (!editingCell) return;
    
    // In a real app, this would update the data and send to the server
    console.log('Saving cell edit:', editingCell);
    
    setEditingCell(null);
  };
  
  // Cancel cell edit
  const cancelCellEdit = () => {
    setEditingCell(null);
  };
  
  // Open comment dialog
  const openCommentDialog = (comment: ForecastComment) => {
    setSelectedComment(comment);
    setCommentDialogOpen(true);
  };
  
  // Add new comment
  const addNewComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would add the comment and send to the server
    console.log('Adding new comment:', newComment);
    
    setNewComment('');
    setCommentDialogOpen(false);
  };
  
  // Apply bulk edit
  const applyBulkEdit = () => {
    // In a real app, this would update multiple cells based on the bulk edit parameters
    console.log('Applying bulk edit:', bulkEditParams);
    
    // Reset bulk edit params
    setBulkEditParams({
      startValue: 0,
      growthRate: 0,
      applyFrom: '',
      applyTo: ''
    });
    
    setInputMode("single");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Collaborative Forecast</CardTitle>
              <CardDescription>
                Collaboratively create and manage financial forecasts
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select 
                value={selectedScenario.id.toString()} 
                onValueChange={handleScenarioChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  {sampleScenarios.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id.toString()}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="gap-1">
                <BarChart4 className="h-4 w-4" />
                Compare
              </Button>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Scenario
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="border-b">
            <div className="flex items-center gap-4 p-4">
              <div>
                <div className="text-sm font-medium">Scenario:</div>
                <div className="text-xl font-semibold">{selectedScenario.name}</div>
              </div>
              
              <div className="border-l pl-4">
                <div className="text-sm font-medium">Type:</div>
                <div>{getScenarioBadge(selectedScenario.mode, selectedScenario.isPrimary)}</div>
              </div>
              
              <div className="border-l pl-4">
                <div className="text-sm font-medium">Created By:</div>
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className={selectedScenario.createdBy.avatarColor + " text-xs"}>
                      {selectedScenario.createdBy.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedScenario.createdBy.name}</span>
                </div>
              </div>
              
              <div className="border-l pl-4">
                <div className="text-sm font-medium">Date:</div>
                <div>{formatDate(selectedScenario.createdAt)}</div>
              </div>
              
              <div className="border-l pl-4 flex-1">
                <div className="text-sm font-medium">Description:</div>
                <div className="text-neutral-600">{selectedScenario.description}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="forecast-grid" className="flex gap-1">
              <GanttChart className="h-4 w-4" />
              Forecast Grid
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex gap-1">
              <MessageSquare className="h-4 w-4" />
              Comments & Collaboration
            </TabsTrigger>
            <TabsTrigger value="revisions" className="flex gap-1">
              <History className="h-4 w-4" />
              Revision History
            </TabsTrigger>
            <TabsTrigger value="presentation" className="flex gap-1">
              <LineChart className="h-4 w-4" />
              Presentation View
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        {/* Forecast Grid Tab */}
        <TabsContent value="forecast-grid">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-4">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle>Forecast Data</CardTitle>
                    <div className="flex gap-2">
                      <Select 
                        value={inputMode} 
                        onValueChange={(value) => setInputMode(value as "single" | "bulk")}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Input mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Cell Edit</SelectItem>
                          <SelectItem value="bulk">Bulk Input</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {inputMode === "bulk" && (
                    <div className="bg-neutral-50 border rounded-md p-4 mb-4">
                      <h3 className="text-sm font-medium mb-3">Bulk Edit Settings</h3>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="text-sm text-neutral-600">Starting Value</label>
                          <Input 
                            type="number" 
                            value={bulkEditParams.startValue} 
                            onChange={(e) => setBulkEditParams({
                              ...bulkEditParams,
                              startValue: parseInt(e.target.value) || 0
                            })}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-neutral-600">Growth Rate (%)</label>
                          <Input 
                            type="number" 
                            value={bulkEditParams.growthRate} 
                            onChange={(e) => setBulkEditParams({
                              ...bulkEditParams,
                              growthRate: parseFloat(e.target.value) || 0
                            })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="text-sm text-neutral-600">Apply From</label>
                          <Select 
                            value={bulkEditParams.applyFrom} 
                            onValueChange={(value) => setBulkEditParams({
                              ...bulkEditParams,
                              applyFrom: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              {periods.map(period => (
                                <SelectItem key={period} value={period}>
                                  {period}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-600">Apply To</label>
                          <Select 
                            value={bulkEditParams.applyTo} 
                            onValueChange={(value) => setBulkEditParams({
                              ...bulkEditParams,
                              applyTo: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              {periods.map(period => (
                                <SelectItem key={period} value={period}>
                                  {period}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setInputMode("single")}>
                          Cancel
                        </Button>
                        <Button onClick={applyBulkEdit}>
                          Apply Changes
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500 min-w-[200px] sticky left-0 bg-neutral-50">
                            Category
                          </th>
                          {periods.map(period => (
                            <th key={period} className="py-3 px-4 text-center text-sm font-medium text-neutral-500 min-w-[120px]">
                              {period}
                            </th>
                          ))}
                          <th className="py-3 px-4 text-center text-sm font-medium text-neutral-500 min-w-[100px]">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {flattenedCategories.map(({ category, depth }) => {
                          // Skip categories that don't have direct values
                          const hasDirectValues = Boolean(selectedScenario.values[category.code]);
                          
                          return (
                            <tr 
                              key={category.code} 
                              className={`
                                hover:bg-neutral-50 
                                ${category.isExpandable ? 'font-medium' : ''}
                                ${depth === 0 ? 'bg-neutral-50/50' : ''}
                              `}
                            >
                              <td 
                                className="py-3 px-4 text-left sticky left-0 bg-white hover:bg-neutral-50"
                                onClick={() => {
                                  if (category.isExpandable) {
                                    toggleCategoryExpansion(category.code);
                                  }
                                }}
                              >
                                {getCategoryDisplayName(category, depth)}
                              </td>
                              
                              {periods.map(period => {
                                const value = getForecastValue(category.code, period);
                                
                                // If category has no direct values, calculate from children
                                if (!hasDirectValues) {
                                  return (
                                    <td key={`${category.code}-${period}`} className="py-3 px-4 text-right text-neutral-500">
                                      {category.isExpandable ? 'Calculated' : '-'}
                                    </td>
                                  );
                                }
                                
                                // If editing this cell
                                if (
                                  editingCell && 
                                  editingCell.code === category.code && 
                                  editingCell.period === period
                                ) {
                                  return (
                                    <td key={`${category.code}-${period}`} className="py-1 px-2">
                                      <div className="flex items-center gap-1">
                                        <Input 
                                          type="number"
                                          className="h-8"
                                          value={editingCell.value}
                                          onChange={(e) => setEditingCell({
                                            ...editingCell,
                                            value: parseInt(e.target.value) || 0
                                          })}
                                        />
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 w-8 p-0"
                                          onClick={saveCellEdit}
                                        >
                                          <Check className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-8 w-8 p-0"
                                          onClick={cancelCellEdit}
                                        >
                                          <X className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </td>
                                  );
                                }
                                
                                return (
                                  <td 
                                    key={`${category.code}-${period}`} 
                                    className={`
                                      py-3 px-4 text-right
                                      ${value && value.inputMethod === 'collaborated' ? 'bg-green-50/50' : ''}
                                      ${value && value.comment ? 'border-b-2 border-amber-400' : ''}
                                    `}
                                    onClick={() => handleCellEdit(category.code, period, value?.amount || 0)}
                                  >
                                    {value ? formatCurrency(value.amount) : '-'}
                                  </td>
                                );
                              })}
                              
                              {/* Total column */}
                              <td className="py-3 px-4 text-right font-medium">
                                {hasDirectValues && 
                                  formatCurrency(
                                    Object.values(selectedScenario.values[category.code])
                                      .reduce((sum, v) => sum + v.amount, 0)
                                  )
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCategory ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Category Information</h3>
                        <p className="text-neutral-600 text-sm mt-1">
                          Details about the selected forecast category
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-neutral-500">
                      <GanttChart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>Select a category to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Assumptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="font-medium mb-1">Revenue Growth</div>
                      <p className="text-sm text-neutral-600">
                        5-8% MoM growth for product revenue based on sales pipeline and historical trends.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="font-medium mb-1">New Product Launch</div>
                      <p className="text-sm text-neutral-600">
                        New software product launch expected in Q2, adding approximately $200K in revenue.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="font-medium mb-1">Marketing Budget</div>
                      <p className="text-sm text-neutral-600">
                        Increased marketing spend in March for new campaign launch.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="font-medium mb-1">Headcount</div>
                      <p className="text-sm text-neutral-600">
                        Planned 3 new hires in Q2 to support product development and sales.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Comments Tab */}
        <TabsContent value="comments">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Discussion & Comments</CardTitle>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter comments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Comments</SelectItem>
                          <SelectItem value="unresolved">Unresolved Only</SelectItem>
                          <SelectItem value="revenue">Revenue Categories</SelectItem>
                          <SelectItem value="expense">Expense Categories</SelectItem>
                          <SelectItem value="my">My Comments</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Comment
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {sampleComments.map(comment => (
                        <div key={comment.id} className="border rounded-lg">
                          <div className="p-4 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className={comment.user.avatarColor + " text-xs"}>
                                  {comment.user.avatarInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{comment.user.name}</span>
                                  <span className="text-xs text-neutral-500">
                                    {format(comment.timestamp, "MMM d, yyyy h:mm a")}
                                  </span>
                                </div>
                                <div className="text-sm text-neutral-600 mt-1">
                                  {comment.text}
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="outline">
                                    {comment.category}
                                  </Badge>
                                  {comment.period && (
                                    <Badge variant="outline" className="bg-neutral-100">
                                      {comment.period}
                                    </Badge>
                                  )}
                                  <div className="text-xs text-neutral-500 flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {comment.replies ? comment.replies.length : 0} Replies
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => openCommentDialog(comment)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="bg-neutral-50 p-4 border-t">
                              <div className="space-y-4">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="flex items-start gap-3">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className={reply.user.avatarColor + " text-xs"}>
                                        {reply.user.avatarInitials}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{reply.user.name}</span>
                                        <span className="text-xs text-neutral-500">
                                          {format(reply.timestamp, "MMM d, yyyy h:mm a")}
                                        </span>
                                      </div>
                                      <div className="text-sm text-neutral-600 mt-1">
                                        {reply.text}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                
                                <div className="flex items-start gap-3 pt-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      JD
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <Textarea 
                                      placeholder="Add a reply..." 
                                      className="resize-none min-h-[80px] text-sm"
                                    />
                                    <div className="flex justify-end mt-2">
                                      <Button size="sm">Reply</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">{sampleComments.length}</div>
                      <div className="text-sm text-neutral-500">Total Comments</div>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">
                        {sampleComments.reduce((count, comment) => 
                          count + (comment.replies?.length || 0), 0)}
                      </div>
                      <div className="text-sm text-neutral-500">Replies</div>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-neutral-500">Contributors</div>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">
                        {sampleComments.filter(c => !c.resolved).length}
                      </div>
                      <div className="text-sm text-neutral-500">Unresolved</div>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium mb-3">Top Contributors</h3>
                  <div className="space-y-3">
                    {sampleUsers.slice(0, 3).map(user => (
                      <div key={user.id} className="flex items-center justify-between">
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
                        <Badge variant="outline">
                          {Math.floor(Math.random() * 5) + 1} Comments
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-sm font-medium mt-6 mb-3">Most Discussed Categories</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Revenue</div>
                        <Badge variant="outline">5 Comments</Badge>
                      </div>
                      <div className="mt-2 text-xs text-neutral-500">
                        Most discussions around growth projections
                      </div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Marketing Expenses</div>
                        <Badge variant="outline">3 Comments</Badge>
                      </div>
                      <div className="mt-2 text-xs text-neutral-500">
                        Discussions about campaign budgets
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Revision History Tab */}
        <TabsContent value="revisions">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Version History</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <GitBranch className="h-4 w-4 mr-2" />
                        Create Branch
                      </Button>
                      <Button>
                        <Clock className="h-4 w-4 mr-2" />
                        Restore Version
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-neutral-200 ml-3 pl-6 space-y-6">
                    {sampleRevisions.map((revision, index) => (
                      <div key={revision.id} className="relative">
                        <div className="absolute -left-[32px] top-0 h-6 w-6 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center">
                          {revision.changeType === 'major' ? (
                            <GitCommit className="h-3 w-3 text-primary" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
                          )}
                        </div>
                        
                        <div className="rounded-lg border">
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  className={
                                    revision.changeType === 'major' 
                                      ? 'bg-primary/10 text-primary' 
                                      : 'bg-neutral-100'
                                  }
                                >
                                  v{revision.version}
                                </Badge>
                                <span className="font-medium">{revision.comment}</span>
                              </div>
                              <div className="flex items-center gap-2 text-neutral-500 text-sm">
                                <span>{formatDate(revision.createdAt)}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarFallback className={revision.createdBy.avatarColor + " text-xs"}>
                                      {revision.createdBy.avatarInitials}
                                    </AvatarFallback>
                                  </Avatar>
                                  {revision.createdBy.name}
                                </span>
                              </div>
                            </div>
                            
                            {revision.changes.length > 0 && (
                              <div className="mt-4 rounded-md border overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-neutral-50">
                                    <tr className="border-b">
                                      <th className="py-2 px-3 text-left font-medium text-neutral-500">Category</th>
                                      <th className="py-2 px-3 text-left font-medium text-neutral-500">Period</th>
                                      <th className="py-2 px-3 text-right font-medium text-neutral-500">Old Value</th>
                                      <th className="py-2 px-3 text-right font-medium text-neutral-500">New Value</th>
                                      <th className="py-2 px-3 text-right font-medium text-neutral-500">Change</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    {revision.changes.map((change, idx) => (
                                      <tr key={idx} className="hover:bg-neutral-50">
                                        <td className="py-2 px-3">{change.category}</td>
                                        <td className="py-2 px-3">{change.period}</td>
                                        <td className="py-2 px-3 text-right">{formatCurrency(change.oldValue)}</td>
                                        <td className="py-2 px-3 text-right">{formatCurrency(change.newValue)}</td>
                                        <td className="py-2 px-3 text-right">
                                          <Badge 
                                            className={`
                                              ${change.percentChange > 0 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'}
                                            `}
                                          >
                                            {change.percentChange > 0 ? '+' : ''}{change.percentChange.toFixed(1)}%
                                          </Badge>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            
                            <div className="flex justify-end mt-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <GitMerge className="h-4 w-4 mr-1" />
                                  Compare
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Version Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-neutral-500">Current Version</div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary">v2.0</Badge>
                        <span className="text-sm">May 1, 2023</span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-2">
                        Quarterly update with revised growth projections based on Q1 results.
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium">Versions</div>
                      <div className="space-y-3 mt-2">
                        {sampleRevisions.map(revision => (
                          <div 
                            key={revision.id} 
                            className={`
                              flex items-center justify-between p-2 rounded
                              ${revision.version === '2.0' ? 'bg-primary/5' : 'hover:bg-neutral-50'}
                            `}
                          >
                            <div className="flex items-center gap-2">
                              {revision.changeType === 'major' ? (
                                <GitCommit className="h-4 w-4 text-primary" />
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-neutral-400 ml-1"></div>
                              )}
                              <span className={revision.version === '2.0' ? 'font-medium' : ''}>
                                v{revision.version}
                              </span>
                            </div>
                            <span className="text-xs text-neutral-500">
                              {formatDate(revision.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium">Contributors</div>
                      <div className="space-y-2 mt-2">
                        {sampleUsers.slice(0, 3).map(user => (
                          <div key={user.id} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={user.avatarColor + " text-xs"}>
                                {user.avatarInitials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Presentation View Tab */}
        <TabsContent value="presentation">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Leadership Presentation</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <PenSquare className="h-4 w-4 mr-2" />
                    Edit Layout
                  </Button>
                  <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export to PowerPoint
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Revenue Growth</div>
                          <div className="text-sm text-neutral-600">
                            Projecting 15% YoY revenue growth, driven primarily by new product launches and expansion into new markets.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                          <PieChart className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Margin Improvement</div>
                          <div className="text-sm text-neutral-600">
                            Expecting margin improvement from 32% to 35% through operational efficiencies and improved product mix.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-amber-100 p-1 mt-0.5">
                          <BarChart4 className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium">Investment Focus</div>
                          <div className="text-sm text-neutral-600">
                            Increasing R&D investment by 10% to accelerate new product development while maintaining marketing spend ratio.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-500">Revenue</div>
                        <div className="text-2xl font-bold">$12.4M</div>
                        <div className="text-sm text-green-600">+15% YoY</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-500">Gross Margin</div>
                        <div className="text-2xl font-bold">35%</div>
                        <div className="text-sm text-green-600">+3pts YoY</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-500">EBITDA</div>
                        <div className="text-2xl font-bold">$3.2M</div>
                        <div className="text-sm text-green-600">+21% YoY</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-neutral-500">Cash Flow</div>
                        <div className="text-2xl font-bold">$2.8M</div>
                        <div className="text-sm text-green-600">+18% YoY</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-4">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Revenue Forecast by Category</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0 h-[300px] flex items-center justify-center bg-neutral-50">
                  <div className="text-center">
                    <BarChart4 className="h-10 w-10 mx-auto mb-3 text-neutral-300" />
                    <p className="text-neutral-500">Revenue chart visualization</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Expense Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0 h-[250px] flex items-center justify-center bg-neutral-50">
                    <div className="text-center">
                      <LineChart className="h-10 w-10 mx-auto mb-3 text-neutral-300" />
                      <p className="text-neutral-500">Expense trend visualization</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Scenario Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-neutral-50">
                          <tr className="border-b">
                            <th className="py-2 px-3 text-left text-sm font-medium text-neutral-500">Metric</th>
                            <th className="py-2 px-3 text-right text-sm font-medium text-neutral-500">Base Case</th>
                            <th className="py-2 px-3 text-right text-sm font-medium text-neutral-500">Optimistic</th>
                            <th className="py-2 px-3 text-right text-sm font-medium text-neutral-500">Conservative</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                          <tr>
                            <td className="py-2 px-3 font-medium">Revenue</td>
                            <td className="py-2 px-3 text-right">$12.4M</td>
                            <td className="py-2 px-3 text-right">$13.8M</td>
                            <td className="py-2 px-3 text-right">$11.2M</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">EBITDA</td>
                            <td className="py-2 px-3 text-right">$3.2M</td>
                            <td className="py-2 px-3 text-right">$3.9M</td>
                            <td className="py-2 px-3 text-right">$2.8M</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">Margin</td>
                            <td className="py-2 px-3 text-right">35%</td>
                            <td className="py-2 px-3 text-right">38%</td>
                            <td className="py-2 px-3 text-right">33%</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-medium">Cash Flow</td>
                            <td className="py-2 px-3 text-right">$2.8M</td>
                            <td className="py-2 px-3 text-right">$3.4M</td>
                            <td className="py-2 px-3 text-right">$2.5M</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedComment && (
            <>
              <DialogHeader>
                <DialogTitle>Comment Details</DialogTitle>
                <DialogDescription>
                  View and reply to this comment
                </DialogDescription>
              </DialogHeader>
              
              <div className="border rounded-lg p-4 mt-2">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={selectedComment.user.avatarColor + " text-xs"}>
                      {selectedComment.user.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedComment.user.name}</span>
                      <span className="text-xs text-neutral-500">
                        {format(selectedComment.timestamp, "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    <div className="text-neutral-600 mt-1">
                      {selectedComment.text}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline">
                        {selectedComment.category}
                      </Badge>
                      {selectedComment.period && (
                        <Badge variant="outline" className="bg-neutral-100">
                          {selectedComment.period}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Add Reply</div>
                <Textarea 
                  placeholder="Type your reply here..." 
                  className="resize-none min-h-[100px]"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCommentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addNewComment}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Post Reply
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollaborativeForecast;