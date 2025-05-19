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
  Table,
  TableBody,
  TableCaption,
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
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Database,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileUp,
  Filter,
  History,
  Info,
  LineChart,
  Link as LinkIcon,
  Loader,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Shield,
  Terminal,
  Trash,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { format } from "date-fns";

// Define types for data integration
type DataSourceType = 'erp' | 'epm' | 'crm' | 'accounting' | 'banking' | 'hr' | 'custom';
type DataCategory = 'actuals' | 'budget' | 'forecast' | 'metadata' | 'reference';
type ImportStatus = 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'canceled';
type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'warning' | 'expired';
type ImportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'manual';
type ValidationLevel = 'none' | 'basic' | 'strict';
type DataAccuracy = 'high' | 'medium' | 'low' | 'unknown';

interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
}

interface DataSource {
  id: number;
  name: string;
  type: DataSourceType;
  category: DataCategory;
  connectionDetails: ConnectionDetails;
  connectionStatus: ConnectionStatus;
  lastSync: Date | null;
  nextSync: Date | null;
  frequency: ImportFrequency;
  owner: User;
  description?: string;
  validationLevel: ValidationLevel;
  importJobs: ImportJob[];
  schema: SchemaMapping[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConnectionDetails {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  apiKey?: boolean;
  authType: 'basic' | 'oauth' | 'apikey' | 'file';
  connectionString?: string;
  filePath?: string;
}

interface ImportJob {
  id: number;
  dataSourceId: number;
  dataSourceName: string;
  startTime: Date;
  endTime: Date | null;
  status: ImportStatus;
  recordsTotal: number;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  triggerType: 'scheduled' | 'manual' | 'api';
  triggeredBy?: User;
  affectedSystems: string[];
  notes?: string;
}

interface ImportError {
  id: number;
  code: string;
  message: string;
  severity: 'critical' | 'major' | 'minor';
  recordId?: string;
  fieldName?: string;
}

interface ImportWarning {
  id: number;
  code: string;
  message: string;
  recordId?: string;
  fieldName?: string;
}

interface SchemaMapping {
  id: number;
  sourceField: string;
  targetField: string;
  dataType: string;
  required: boolean;
  defaultValue?: string;
  transformation?: string;
  validationRules?: string[];
}

interface DataLineage {
  id: number;
  sourceSystemId: number;
  sourceSystemName: string;
  targetSystemId: number;
  targetSystemName: string;
  dataFlowName: string;
  description?: string;
  lastUpdated: Date;
  dataElements: DataElement[];
  dataAccuracy: DataAccuracy;
  dataTrustScore: number;
  reconciliationStatus: 'matched' | 'unmatched' | 'partially_matched' | 'not_reconciled';
}

interface DataElement {
  id: number;
  name: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  description?: string;
}

interface ReconciliationReport {
  id: number;
  name: string;
  sourceSystemId: number;
  sourceSystemName: string;
  targetSystemId: number;
  targetSystemName: string;
  runDate: Date;
  status: 'matched' | 'unmatched' | 'partially_matched';
  matchedRecords: number;
  unmatchedRecords: number;
  totalRecords: number;
  matchPercentage: number;
  discrepancies: Discrepancy[];
  notes?: string;
}

interface Discrepancy {
  id: number;
  sourceValue: string;
  targetValue: string;
  field: string;
  recordId: string;
  discrepancyType: 'missing' | 'different' | 'extra';
  impact: 'high' | 'medium' | 'low';
  resolved: boolean;
  resolution?: string;
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

// Sample data sources
const sampleDataSources: DataSource[] = [
  {
    id: 1,
    name: "SAP ERP",
    type: "erp",
    category: "actuals",
    connectionDetails: {
      host: "sap.internal.company.com",
      port: 1521,
      database: "FINPROD",
      username: "fin_integration",
      apiKey: false,
      authType: "basic",
      connectionString: "sap://sap.internal.company.com:1521/FINPROD"
    },
    connectionStatus: "connected",
    lastSync: new Date(2023, 4, 15, 2, 30),
    nextSync: new Date(2023, 4, 16, 2, 30),
    frequency: "daily",
    owner: sampleUsers[1],
    description: "Main ERP system for financial data",
    validationLevel: "strict",
    importJobs: [],
    schema: [
      {
        id: 1,
        sourceField: "GL_ACCOUNT",
        targetField: "account_code",
        dataType: "string",
        required: true,
        validationRules: ["length <= 10", "pattern: [A-Z0-9]+"]
      },
      {
        id: 2,
        sourceField: "AMOUNT",
        targetField: "amount",
        dataType: "decimal",
        required: true,
        validationRules: ["value >= 0"]
      },
      {
        id: 3,
        sourceField: "POSTING_DATE",
        targetField: "transaction_date",
        dataType: "date",
        required: true,
        validationRules: ["date format: YYYY-MM-DD"]
      }
    ],
    tags: ["ERP", "Financial Data", "Core System"],
    createdAt: new Date(2023, 0, 15),
    updatedAt: new Date(2023, 4, 10)
  },
  {
    id: 2,
    name: "Oracle EPM",
    type: "epm",
    category: "forecast",
    connectionDetails: {
      host: "epm.company.cloud",
      port: 443,
      username: "epm_user",
      apiKey: true,
      authType: "oauth",
      connectionString: "https://epm.company.cloud/api/v2/"
    },
    connectionStatus: "connected",
    lastSync: new Date(2023, 4, 14, 14, 15),
    nextSync: new Date(2023, 4, 21, 14, 0),
    frequency: "weekly",
    owner: sampleUsers[1],
    description: "Enterprise Performance Management system for forecasting and planning",
    validationLevel: "basic",
    importJobs: [],
    schema: [
      {
        id: 4,
        sourceField: "ACCOUNT",
        targetField: "account_code",
        dataType: "string",
        required: true
      },
      {
        id: 5,
        sourceField: "FORECAST_VALUE",
        targetField: "amount",
        dataType: "decimal",
        required: true
      },
      {
        id: 6,
        sourceField: "PERIOD",
        targetField: "period",
        dataType: "string",
        required: true
      }
    ],
    tags: ["EPM", "Forecasting", "Planning"],
    createdAt: new Date(2023, 1, 10),
    updatedAt: new Date(2023, 4, 14)
  },
  {
    id: 3,
    name: "Salesforce CRM",
    type: "crm",
    category: "actuals",
    connectionDetails: {
      authType: "oauth",
      connectionString: "https://company.salesforce.com/services/api/",
      apiKey: true
    },
    connectionStatus: "warning",
    lastSync: new Date(2023, 4, 12, 8, 0),
    nextSync: new Date(2023, 4, 19, 8, 0),
    frequency: "weekly",
    owner: sampleUsers[3],
    description: "CRM system for sales pipeline and customer data",
    validationLevel: "basic",
    importJobs: [],
    schema: [
      {
        id: 7,
        sourceField: "OPPORTUNITY_ID",
        targetField: "opportunity_id",
        dataType: "string",
        required: true
      },
      {
        id: 8,
        sourceField: "AMOUNT",
        targetField: "potential_revenue",
        dataType: "decimal",
        required: true
      },
      {
        id: 9,
        sourceField: "CLOSE_DATE",
        targetField: "expected_close_date",
        dataType: "date",
        required: true
      }
    ],
    tags: ["CRM", "Sales Data", "Revenue Pipeline"],
    createdAt: new Date(2023, 2, 5),
    updatedAt: new Date(2023, 4, 12)
  },
  {
    id: 4,
    name: "Budget Spreadsheets",
    type: "custom",
    category: "budget",
    connectionDetails: {
      authType: "file",
      filePath: "/data/budgets/",
    },
    connectionStatus: "connected",
    lastSync: new Date(2023, 4, 1, 10, 30),
    nextSync: new Date(2023, 5, 1, 10, 30),
    frequency: "monthly",
    owner: sampleUsers[0],
    description: "Budget data from department spreadsheets",
    validationLevel: "basic",
    importJobs: [],
    schema: [
      {
        id: 10,
        sourceField: "DEPT_CODE",
        targetField: "department_code",
        dataType: "string",
        required: true
      },
      {
        id: 11,
        sourceField: "BUDGET_AMOUNT",
        targetField: "budget_amount",
        dataType: "decimal",
        required: true
      },
      {
        id: 12,
        sourceField: "MONTH",
        targetField: "period",
        dataType: "string",
        required: true,
        transformation: "concat(YEAR, '-', MONTH)"
      }
    ],
    tags: ["Budget", "Spreadsheets", "Manual Import"],
    createdAt: new Date(2023, 3, 15),
    updatedAt: new Date(2023, 4, 1)
  },
  {
    id: 5,
    name: "HR System",
    type: "hr",
    category: "actuals",
    connectionDetails: {
      host: "hr.internal.company.com",
      port: 8080,
      username: "hr_api_user",
      authType: "basic",
      connectionString: "http://hr.internal.company.com:8080/api/"
    },
    connectionStatus: "error",
    lastSync: new Date(2023, 4, 10, 3, 0),
    nextSync: new Date(2023, 4, 17, 3, 0),
    frequency: "weekly",
    owner: sampleUsers[2],
    description: "HR system for headcount and personnel costs",
    validationLevel: "strict",
    importJobs: [],
    schema: [
      {
        id: 13,
        sourceField: "EMPLOYEE_ID",
        targetField: "employee_id",
        dataType: "string",
        required: true
      },
      {
        id: 14,
        sourceField: "DEPARTMENT",
        targetField: "department_code",
        dataType: "string",
        required: true
      },
      {
        id: 15,
        sourceField: "SALARY",
        targetField: "salary_amount",
        dataType: "decimal",
        required: true
      }
    ],
    tags: ["HR", "Headcount", "Personnel Costs"],
    createdAt: new Date(2023, 2, 20),
    updatedAt: new Date(2023, 4, 10)
  }
];

// Create sample import jobs for each data source
const createSampleImportJobs = (): ImportJob[] => {
  const jobs: ImportJob[] = [];
  
  // SAP ERP jobs
  jobs.push(
    {
      id: 1,
      dataSourceId: 1,
      dataSourceName: "SAP ERP",
      startTime: new Date(2023, 4, 15, 2, 30),
      endTime: new Date(2023, 4, 15, 2, 45),
      status: "completed",
      recordsTotal: 5000,
      recordsProcessed: 5000,
      recordsSuccessful: 4995,
      recordsFailed: 5,
      errors: [
        {
          id: 1,
          code: "E1001",
          message: "Invalid account code format",
          severity: "minor",
          recordId: "GL123456",
          fieldName: "GL_ACCOUNT"
        }
      ],
      warnings: [
        {
          id: 1,
          code: "W2001",
          message: "Unusually large transaction amount",
          recordId: "TR789012",
          fieldName: "AMOUNT"
        }
      ],
      triggerType: "scheduled",
      affectedSystems: ["Data Warehouse", "Financial Reporting"]
    },
    {
      id: 2,
      dataSourceId: 1,
      dataSourceName: "SAP ERP",
      startTime: new Date(2023, 4, 14, 2, 30),
      endTime: new Date(2023, 4, 14, 2, 50),
      status: "completed",
      recordsTotal: 4800,
      recordsProcessed: 4800,
      recordsSuccessful: 4800,
      recordsFailed: 0,
      errors: [],
      warnings: [],
      triggerType: "scheduled",
      affectedSystems: ["Data Warehouse", "Financial Reporting"]
    }
  );
  
  // Oracle EPM jobs
  jobs.push(
    {
      id: 3,
      dataSourceId: 2,
      dataSourceName: "Oracle EPM",
      startTime: new Date(2023, 4, 14, 14, 15),
      endTime: new Date(2023, 4, 14, 14, 25),
      status: "completed",
      recordsTotal: 1200,
      recordsProcessed: 1200,
      recordsSuccessful: 1180,
      recordsFailed: 20,
      errors: [
        {
          id: 2,
          code: "E2001",
          message: "Missing required field",
          severity: "major",
          recordId: "FP456789",
          fieldName: "PERIOD"
        }
      ],
      warnings: [],
      triggerType: "scheduled",
      affectedSystems: ["Forecasting System"]
    }
  );
  
  // Salesforce CRM jobs
  jobs.push(
    {
      id: 4,
      dataSourceId: 3,
      dataSourceName: "Salesforce CRM",
      startTime: new Date(2023, 4, 12, 8, 0),
      endTime: new Date(2023, 4, 12, 8, 10),
      status: "completed",
      recordsTotal: 950,
      recordsProcessed: 950,
      recordsSuccessful: 940,
      recordsFailed: 10,
      errors: [
        {
          id: 3,
          code: "E3001",
          message: "API rate limit exceeded",
          severity: "major"
        }
      ],
      warnings: [
        {
          id: 2,
          code: "W3001",
          message: "Possible duplicate opportunity",
          recordId: "OPP123456"
        }
      ],
      triggerType: "scheduled",
      affectedSystems: ["Revenue Forecast"]
    }
  );
  
  // Budget Spreadsheets jobs
  jobs.push(
    {
      id: 5,
      dataSourceId: 4,
      dataSourceName: "Budget Spreadsheets",
      startTime: new Date(2023, 4, 1, 10, 30),
      endTime: new Date(2023, 4, 1, 10, 40),
      status: "completed",
      recordsTotal: 200,
      recordsProcessed: 200,
      recordsSuccessful: 195,
      recordsFailed: 5,
      errors: [
        {
          id: 4,
          code: "E4001",
          message: "Format error in spreadsheet",
          severity: "minor",
          recordId: "ROW45",
          fieldName: "BUDGET_AMOUNT"
        }
      ],
      warnings: [],
      triggerType: "manual",
      triggeredBy: sampleUsers[0],
      affectedSystems: ["Budget System"]
    }
  );
  
  // HR System jobs
  jobs.push(
    {
      id: 6,
      dataSourceId: 5,
      dataSourceName: "HR System",
      startTime: new Date(2023, 4, 10, 3, 0),
      endTime: null,
      status: "failed",
      recordsTotal: 850,
      recordsProcessed: 200,
      recordsSuccessful: 180,
      recordsFailed: 20,
      errors: [
        {
          id: 5,
          code: "E5001",
          message: "Connection timeout",
          severity: "critical"
        }
      ],
      warnings: [],
      triggerType: "scheduled",
      affectedSystems: ["Headcount Planning"],
      notes: "Job failed due to connection timeout. IT has been notified."
    }
  );
  
  // Add scheduled job
  jobs.push(
    {
      id: 7,
      dataSourceId: 1,
      dataSourceName: "SAP ERP",
      startTime: new Date(2023, 4, 16, 2, 30),
      endTime: null,
      status: "scheduled",
      recordsTotal: 0,
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      errors: [],
      warnings: [],
      triggerType: "scheduled",
      affectedSystems: ["Data Warehouse", "Financial Reporting"]
    }
  );
  
  return jobs;
};

const sampleImportJobs = createSampleImportJobs();

// Update data sources with import jobs
sampleDataSources.forEach(dataSource => {
  dataSource.importJobs = sampleImportJobs.filter(job => job.dataSourceId === dataSource.id);
});

// Sample data lineage
const sampleDataLineage: DataLineage[] = [
  {
    id: 1,
    sourceSystemId: 1,
    sourceSystemName: "SAP ERP",
    targetSystemId: 0,
    targetSystemName: "Data Warehouse",
    dataFlowName: "GL Account Data Flow",
    description: "General ledger account data from SAP to Data Warehouse",
    lastUpdated: new Date(2023, 4, 15),
    dataElements: [
      {
        id: 1,
        name: "Account Code",
        sourceField: "GL_ACCOUNT",
        targetField: "account_code",
        description: "General ledger account code"
      },
      {
        id: 2,
        name: "Transaction Amount",
        sourceField: "AMOUNT",
        targetField: "transaction_amount",
        description: "Transaction amount in base currency"
      }
    ],
    dataAccuracy: "high",
    dataTrustScore: 95,
    reconciliationStatus: "matched"
  },
  {
    id: 2,
    sourceSystemId: 2,
    sourceSystemName: "Oracle EPM",
    targetSystemId: 0,
    targetSystemName: "Forecasting System",
    dataFlowName: "Forecast Data Flow",
    description: "Forecast data from EPM to Forecasting System",
    lastUpdated: new Date(2023, 4, 14),
    dataElements: [
      {
        id: 3,
        name: "Account",
        sourceField: "ACCOUNT",
        targetField: "account_code",
        description: "Account code"
      },
      {
        id: 4,
        name: "Forecast Amount",
        sourceField: "FORECAST_VALUE",
        targetField: "forecast_amount",
        description: "Forecasted amount for the period"
      }
    ],
    dataAccuracy: "medium",
    dataTrustScore: 87,
    reconciliationStatus: "partially_matched"
  },
  {
    id: 3,
    sourceSystemId: 3,
    sourceSystemName: "Salesforce CRM",
    targetSystemId: 0,
    targetSystemName: "Revenue Forecast",
    dataFlowName: "Sales Pipeline Flow",
    description: "Sales pipeline data from CRM to Revenue Forecast",
    lastUpdated: new Date(2023, 4, 12),
    dataElements: [
      {
        id: 5,
        name: "Opportunity ID",
        sourceField: "OPPORTUNITY_ID",
        targetField: "opportunity_id",
        description: "Unique identifier for the sales opportunity"
      },
      {
        id: 6,
        name: "Potential Revenue",
        sourceField: "AMOUNT",
        targetField: "potential_revenue",
        transformation: "AMOUNT * probability",
        description: "Expected revenue from the opportunity"
      }
    ],
    dataAccuracy: "medium",
    dataTrustScore: 82,
    reconciliationStatus: "partially_matched"
  }
];

// Sample reconciliation reports
const sampleReconciliationReports: ReconciliationReport[] = [
  {
    id: 1,
    name: "SAP ERP to Data Warehouse Reconciliation",
    sourceSystemId: 1,
    sourceSystemName: "SAP ERP",
    targetSystemId: 0,
    targetSystemName: "Data Warehouse",
    runDate: new Date(2023, 4, 15, 8, 0),
    status: "partially_matched",
    matchedRecords: 4995,
    unmatchedRecords: 5,
    totalRecords: 5000,
    matchPercentage: 99.9,
    discrepancies: [
      {
        id: 1,
        sourceValue: "A12345",
        targetValue: "A-12345",
        field: "account_code",
        recordId: "GL123456",
        discrepancyType: "different",
        impact: "low",
        resolved: true,
        resolution: "Updated mapping to standardize format"
      },
      {
        id: 2,
        sourceValue: "1000.00",
        targetValue: "",
        field: "amount",
        recordId: "GL789012",
        discrepancyType: "missing",
        impact: "medium",
        resolved: false
      }
    ],
    notes: "Overall good reconciliation with a few minor discrepancies"
  },
  {
    id: 2,
    name: "EPM to Forecasting System Reconciliation",
    sourceSystemId: 2,
    sourceSystemName: "Oracle EPM",
    targetSystemId: 0,
    targetSystemName: "Forecasting System",
    runDate: new Date(2023, 4, 14, 15, 0),
    status: "partially_matched",
    matchedRecords: 1180,
    unmatchedRecords: 20,
    totalRecords: 1200,
    matchPercentage: 98.3,
    discrepancies: [
      {
        id: 3,
        sourceValue: "",
        targetValue: "",
        field: "period",
        recordId: "FP456789",
        discrepancyType: "missing",
        impact: "high",
        resolved: false
      }
    ],
    notes: "Missing period information in some records"
  }
];

// Utility functions
const formatStatus = (status: ImportStatus) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    case 'scheduled':
      return <Badge className="bg-purple-100 text-purple-800">Scheduled</Badge>;
    case 'failed':
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    case 'canceled':
      return <Badge className="bg-neutral-100 text-neutral-800">Canceled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const formatConnectionStatus = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
    case 'disconnected':
      return <Badge className="bg-neutral-100 text-neutral-800">Disconnected</Badge>;
    case 'error':
      return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    case 'warning':
      return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
    case 'expired':
      return <Badge className="bg-amber-100 text-amber-800">Expired</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const formatDataSourceType = (type: DataSourceType) => {
  switch (type) {
    case 'erp':
      return "ERP System";
    case 'epm':
      return "EPM System";
    case 'crm':
      return "CRM System";
    case 'accounting':
      return "Accounting System";
    case 'banking':
      return "Banking System";
    case 'hr':
      return "HR System";
    case 'custom':
      return "Custom Source";
    default:
      return type;
  }
};

const formatFrequency = (frequency: ImportFrequency) => {
  switch (frequency) {
    case 'daily':
      return "Daily";
    case 'weekly':
      return "Weekly";
    case 'monthly':
      return "Monthly";
    case 'quarterly':
      return "Quarterly";
    case 'manual':
      return "Manual";
    default:
      return frequency;
  }
};

const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return format(date, "MMM d, yyyy h:mm a");
};

const formatShortDate = (date: Date | null) => {
  if (!date) return "-";
  return format(date, "MMM d, yyyy");
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const getSourceTypeIcon = (type: DataSourceType) => {
  switch (type) {
    case 'erp':
      return <Database className="h-5 w-5 text-blue-600" />;
    case 'epm':
      return <LineChart className="h-5 w-5 text-green-600" />;
    case 'crm':
      return <Users className="h-5 w-5 text-purple-600" />;
    case 'accounting':
      return <Database className="h-5 w-5 text-amber-600" />;
    case 'banking':
      return <ArrowRightLeft className="h-5 w-5 text-blue-600" />;
    case 'hr':
      return <Users className="h-5 w-5 text-red-600" />;
    case 'custom':
      return <FileUp className="h-5 w-5 text-neutral-600" />;
    default:
      return <Database className="h-5 w-5 text-neutral-600" />;
  }
};

interface DataSourceManagerProps {
  isLoading?: boolean;
}

const DataSourceManager: React.FC<DataSourceManagerProps> = ({ 
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState<string>("data-sources");
  const [dataSources, setDataSources] = useState<DataSource[]>(sampleDataSources);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [importJobs, setImportJobs] = useState<ImportJob[]>(sampleImportJobs);
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newConnectionDialogOpen, setNewConnectionDialogOpen] = useState<boolean>(false);
  const [dataSourceDialogOpen, setDataSourceDialogOpen] = useState<boolean>(false);
  const [runImportDialogOpen, setRunImportDialogOpen] = useState<boolean>(false);
  const [newImportParams, setNewImportParams] = useState({
    dataSourceId: '',
    includeHistorical: false,
    validateOnly: false
  });
  
  // Filter data sources
  const filteredDataSources = dataSources.filter(source => {
    return (
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  // Filter import jobs
  const filteredImportJobs = importJobs.filter(job => {
    return jobFilter === 'all' || job.status === jobFilter;
  }).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  
  // View data source details
  const viewDataSourceDetails = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setDataSourceDialogOpen(true);
  };
  
  // Open run import dialog
  const openRunImportDialog = (dataSourceId: number) => {
    setNewImportParams({
      ...newImportParams,
      dataSourceId: dataSourceId.toString()
    });
    setRunImportDialogOpen(true);
  };
  
  // Handle run import
  const handleRunImport = () => {
    // In a real app, this would call an API to start an import
    console.log('Starting import with params:', newImportParams);
    
    const dataSourceId = parseInt(newImportParams.dataSourceId);
    const dataSource = dataSources.find(ds => ds.id === dataSourceId);
    
    if (dataSource) {
      const newJob: ImportJob = {
        id: Math.max(...importJobs.map(job => job.id)) + 1,
        dataSourceId,
        dataSourceName: dataSource.name,
        startTime: new Date(),
        endTime: null,
        status: 'in_progress',
        recordsTotal: 0,
        recordsProcessed: 0,
        recordsSuccessful: 0,
        recordsFailed: 0,
        errors: [],
        warnings: [],
        triggerType: 'manual',
        triggeredBy: sampleUsers[0], // Current user
        affectedSystems: [],
        notes: newImportParams.validateOnly ? 'Validation only run' : undefined
      };
      
      setImportJobs([newJob, ...importJobs]);
      
      // Update data source last sync
      setDataSources(dataSources.map(ds => {
        if (ds.id === dataSourceId) {
          return {
            ...ds,
            lastSync: new Date(),
            importJobs: [newJob, ...ds.importJobs]
          };
        }
        return ds;
      }));
    }
    
    setRunImportDialogOpen(false);
    setNewImportParams({
      dataSourceId: '',
      includeHistorical: false,
      validateOnly: false
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Data Integration Hub</CardTitle>
              <CardDescription>
                Manage data sources, imports, and data lineage
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                View Lineage
              </Button>
              <Button 
                onClick={() => setNewConnectionDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Connection
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative w-[250px]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input 
              placeholder="Search data sources..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select 
            value={jobFilter}
            onValueChange={setJobFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Manual Upload
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-sources" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="import-jobs" className="flex items-center gap-1">
            <ArrowRightLeft className="h-4 w-4" />
            Import Jobs
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Reconciliation
          </TabsTrigger>
          <TabsTrigger value="lineage" className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            Data Lineage
          </TabsTrigger>
        </TabsList>
        
        {/* Data Sources Tab */}
        <TabsContent value="data-sources">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Next Sync</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDataSources.map(source => (
                  <TableRow key={source.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center">
                          {getSourceTypeIcon(source.type)}
                        </div>
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-xs text-neutral-500 max-w-[200px] truncate">
                            {source.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDataSourceType(source.type)}</TableCell>
                    <TableCell>{formatConnectionStatus(source.connectionStatus)}</TableCell>
                    <TableCell>
                      {source.lastSync ? formatDate(source.lastSync) : 'Never'}
                    </TableCell>
                    <TableCell>
                      {source.nextSync ? formatDate(source.nextSync) : '-'}
                    </TableCell>
                    <TableCell>{formatFrequency(source.frequency)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={source.owner.avatarColor + " text-xs"}>
                            {source.owner.avatarInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{source.owner.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => viewDataSourceDetails(source)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => openRunImportDialog(source.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Import Jobs Tab */}
        <TabsContent value="import-jobs">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Source</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImportJobs.map(job => (
                  <TableRow key={job.id} className="hover:bg-neutral-50">
                    <TableCell>
                      <div className="font-medium">{job.dataSourceName}</div>
                    </TableCell>
                    <TableCell>{formatDate(job.startTime)}</TableCell>
                    <TableCell>{formatStatus(job.status)}</TableCell>
                    <TableCell>
                      {job.status === 'scheduled' ? '-' : (
                        <div className="flex items-center gap-1">
                          <span>{formatNumber(job.recordsProcessed)}</span>
                          <span className="text-neutral-400">/</span>
                          <span>{formatNumber(job.recordsTotal)}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {job.status === 'scheduled' || job.recordsProcessed === 0 ? '-' : (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ 
                                width: `${(job.recordsSuccessful / job.recordsProcessed) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span>
                            {formatPercentage((job.recordsSuccessful / job.recordsProcessed) * 100)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {job.errors.length > 0 ? (
                        <Badge className="bg-red-100 text-red-800">
                          {job.errors.length} {job.errors.length === 1 ? 'error' : 'errors'}
                        </Badge>
                      ) : job.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-800">None</Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {job.triggerType === 'scheduled' ? (
                          <Clock className="h-4 w-4 text-neutral-500" />
                        ) : job.triggerType === 'manual' ? (
                          <User className="h-4 w-4 text-neutral-500" />
                        ) : (
                          <Terminal className="h-4 w-4 text-neutral-500" />
                        )}
                        <span className="capitalize">{job.triggerType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {job.status === 'in_progress' && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === 'failed' && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        {/* Reconciliation Tab */}
        <TabsContent value="reconciliation">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Reconciliation Reports</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Reconciliation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleReconciliationReports.map(report => (
                      <Card key={report.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-neutral-500">
                                {report.sourceSystemName} → {report.targetSystemName}
                              </div>
                            </div>
                            <Badge 
                              className={
                                report.status === 'matched' 
                                  ? 'bg-green-100 text-green-800' 
                                  : report.status === 'unmatched' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-amber-100 text-amber-800'
                              }
                            >
                              {report.status === 'matched' 
                                ? 'Matched' 
                                : report.status === 'unmatched' 
                                  ? 'Unmatched' 
                                  : 'Partially Matched'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-sm text-neutral-500">Match Rate</div>
                              <div className="text-lg font-medium text-green-600">
                                {formatPercentage(report.matchPercentage)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-neutral-500">Records</div>
                              <div className="text-lg font-medium">
                                {formatNumber(report.totalRecords)}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-neutral-500">Discrepancies</div>
                              <div className={`text-lg font-medium ${report.discrepancies.length > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                                {report.discrepancies.length}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-neutral-500">
                              Run Date: {formatShortDate(report.runDate)}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Re-run
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Data Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleDataLineage.map(lineage => (
                      <div key={lineage.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{lineage.sourceSystemName}</div>
                          <Badge 
                            className={
                              lineage.dataAccuracy === 'high' 
                                ? 'bg-green-100 text-green-800' 
                                : lineage.dataAccuracy === 'medium' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-red-100 text-red-800'
                            }
                          >
                            {lineage.dataAccuracy.charAt(0).toUpperCase() + lineage.dataAccuracy.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-neutral-500">Trust Score</div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  lineage.dataTrustScore >= 90 
                                    ? 'bg-green-500' 
                                    : lineage.dataTrustScore >= 70 
                                      ? 'bg-amber-500' 
                                      : 'bg-red-500'
                                }`} 
                                style={{ width: `${lineage.dataTrustScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {lineage.dataTrustScore}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-neutral-500">
                          Last Updated: {formatShortDate(lineage.lastUpdated)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Data Validation Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <div className="text-sm font-medium">Account Format</div>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <div className="text-sm font-medium">Required Fields</div>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-amber-600" />
                        <div className="text-sm font-medium">Amount Range</div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-neutral-400" />
                        <div className="text-sm font-medium">Date Format</div>
                      </div>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Validation Rule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Data Lineage Tab */}
        <TabsContent value="lineage">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Data Lineage</CardTitle>
                  <CardDescription>Visualize data flow between systems</CardDescription>
                </div>
                <Select defaultValue="detailed">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-level">High-level View</SelectItem>
                    <SelectItem value="detailed">Detailed View</SelectItem>
                    <SelectItem value="field-level">Field-level View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-50 rounded-lg p-8 text-center h-[500px] flex flex-col items-center justify-center">
                <ArrowRightLeft className="h-12 w-12 text-neutral-300 mb-3" />
                <h3 className="text-lg font-medium mb-2">Data Lineage Visualization</h3>
                <p className="text-neutral-500 max-w-md mb-4">
                  This visualization shows how data flows between different systems in your organization.
                  Track data from source to target for complete visibility.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Full Screen
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export Diagram
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* New Connection Dialog */}
      <Dialog open={newConnectionDialogOpen} onOpenChange={setNewConnectionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Data Source</DialogTitle>
            <DialogDescription>
              Connect to a new data source to import financial data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Source Name</label>
              <Input placeholder="Enter data source name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select defaultValue="erp">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erp">ERP System</SelectItem>
                    <SelectItem value="epm">EPM System</SelectItem>
                    <SelectItem value="crm">CRM System</SelectItem>
                    <SelectItem value="accounting">Accounting System</SelectItem>
                    <SelectItem value="banking">Banking System</SelectItem>
                    <SelectItem value="hr">HR System</SelectItem>
                    <SelectItem value="custom">Custom Source</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Category</label>
                <Select defaultValue="actuals">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actuals">Actuals</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="forecast">Forecast</SelectItem>
                    <SelectItem value="metadata">Metadata</SelectItem>
                    <SelectItem value="reference">Reference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Enter description" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Connection Details</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">Authentication Type</label>
                  <Select defaultValue="basic">
                    <SelectTrigger>
                      <SelectValue placeholder="Select auth type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="oauth">OAuth</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                      <SelectItem value="file">File Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">Import Frequency</label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <label className="text-xs text-neutral-500">Connection String / URL</label>
                <Input placeholder="Enter connection string or URL" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">Username</label>
                  <Input placeholder="Enter username" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">Password</label>
                  <Input type="password" placeholder="Enter password" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Validation Level</label>
              <Select defaultValue="basic">
                <SelectTrigger>
                  <SelectValue placeholder="Select validation level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input placeholder="Enter comma-separated tags" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewConnectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setNewConnectionDialogOpen(false)}>
              Test Connection
            </Button>
            <Button onClick={() => setNewConnectionDialogOpen(false)}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Data Source Details Dialog */}
      <Dialog open={dataSourceDialogOpen} onOpenChange={setDataSourceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedDataSource && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle>{selectedDataSource.name}</DialogTitle>
                    <DialogDescription>
                      {formatDataSourceType(selectedDataSource.type)} • {selectedDataSource.description}
                    </DialogDescription>
                  </div>
                  <div>
                    {formatConnectionStatus(selectedDataSource.connectionStatus)}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Connection Details</h3>
                    <div className="rounded-md border divide-y">
                      <div className="px-3 py-2 flex justify-between items-center">
                        <div className="text-sm font-medium">Connection Type</div>
                        <div className="text-sm">{selectedDataSource.connectionDetails.authType}</div>
                      </div>
                      <div className="px-3 py-2 flex justify-between items-center">
                        <div className="text-sm font-medium">Connection String</div>
                        <div className="text-sm">{selectedDataSource.connectionDetails.connectionString}</div>
                      </div>
                      <div className="px-3 py-2 flex justify-between items-center">
                        <div className="text-sm font-medium">Import Frequency</div>
                        <div className="text-sm">{formatFrequency(selectedDataSource.frequency)}</div>
                      </div>
                      <div className="px-3 py-2 flex justify-between items-center">
                        <div className="text-sm font-medium">Last Sync</div>
                        <div className="text-sm">{formatDate(selectedDataSource.lastSync)}</div>
                      </div>
                      <div className="px-3 py-2 flex justify-between items-center">
                        <div className="text-sm font-medium">Next Sync</div>
                        <div className="text-sm">{formatDate(selectedDataSource.nextSync)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Owner</h3>
                    <div className="flex items-center gap-2 border rounded-md p-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={selectedDataSource.owner.avatarColor + " text-xs"}>
                          {selectedDataSource.owner.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedDataSource.owner.name}</div>
                        <div className="text-xs text-neutral-500">{selectedDataSource.owner.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Schema Mapping</h3>
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                          <tr className="border-b">
                            <th className="py-2 px-3 text-left font-medium text-neutral-500">Source</th>
                            <th className="py-2 px-3 text-left font-medium text-neutral-500">Target</th>
                            <th className="py-2 px-3 text-left font-medium text-neutral-500">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedDataSource.schema.map(mapping => (
                            <tr key={mapping.id} className="hover:bg-neutral-50">
                              <td className="py-2 px-3">{mapping.sourceField}</td>
                              <td className="py-2 px-3">{mapping.targetField}</td>
                              <td className="py-2 px-3">{mapping.dataType}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Import Jobs</h3>
                    <div className="space-y-2">
                      {selectedDataSource.importJobs.slice(0, 3).map(job => (
                        <div key={job.id} className="border rounded-md p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">
                              {formatDate(job.startTime)}
                            </div>
                            {formatStatus(job.status)}
                          </div>
                          <div className="flex items-center justify-between text-xs text-neutral-500">
                            <div>Records: {formatNumber(job.recordsProcessed)} / {formatNumber(job.recordsTotal)}</div>
                            {job.errors.length > 0 && (
                              <div className="text-red-600">
                                {job.errors.length} {job.errors.length === 1 ? 'error' : 'errors'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedDataSource.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <DialogFooter className="mt-4 gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Connection
                </Button>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Validation Rules
                </Button>
                <Button size="sm" onClick={() => {
                  setDataSourceDialogOpen(false);
                  openRunImportDialog(selectedDataSource.id);
                }}>
                  <Play className="h-4 w-4 mr-2" />
                  Run Import
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Run Import Dialog */}
      <Dialog open={runImportDialogOpen} onOpenChange={setRunImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Run Data Import</DialogTitle>
            <DialogDescription>
              Configure and start a data import job
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Source</label>
              <Select 
                value={newImportParams.dataSourceId}
                onValueChange={(value) => setNewImportParams({
                  ...newImportParams,
                  dataSourceId: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map(source => (
                    <SelectItem key={source.id} value={source.id.toString()}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Import Options</label>
              <div className="border rounded-md p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Include Historical Data</div>
                    <div className="text-xs text-neutral-500">
                      Import all historical data instead of just new data
                    </div>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-200">
                    <div 
                      className={`absolute h-4 w-4 rounded-full bg-white ${
                        newImportParams.includeHistorical ? 'right-1' : 'left-1'
                      }`}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Validation Only</div>
                    <div className="text-xs text-neutral-500">
                      Only validate data without importing
                    </div>
                  </div>
                  <div 
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      newImportParams.validateOnly ? 'bg-primary' : 'bg-neutral-200'
                    }`}
                    onClick={() => setNewImportParams({
                      ...newImportParams,
                      validateOnly: !newImportParams.validateOnly
                    })}
                  >
                    <div 
                      className={`absolute h-4 w-4 rounded-full bg-white ${
                        newImportParams.validateOnly ? 'right-1' : 'left-1'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-3 bg-amber-50">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Import Information</p>
                  <p>This import will process data based on the configured schema mapping. 
                  Make sure the data source is properly connected before starting the import.</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRunImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRunImport}>
              <Play className="h-4 w-4 mr-2" />
              Start Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataSourceManager;