import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Database,
  Edit,
  Eye,
  Filter,
  FolderInput,
  FolderOutput,
  GitCompare,
  History,
  MessageSquare,
  MoreHorizontal,
  MoveHorizontal,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash2,
  Workflow,
  Zap,
  Clock,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// ETL Pipeline Types
export type PipelineStatus = 'active' | 'paused' | 'failed' | 'draft' | 'completed';
export type PipelineSchedule = 'manual' | 'hourly' | 'daily' | 'weekly' | 'monthly';
export type StepType = 
  | 'data_source' 
  | 'transform' 
  | 'filter' 
  | 'join' 
  | 'aggregate' 
  | 'map_fields' 
  | 'calculate' 
  | 'destination';

export interface PipelineStep {
  id: string;
  name: string;
  type: StepType;
  description?: string;
  config: Record<string, any>;
  order: number;
  dependsOn?: string[];
  status?: 'success' | 'warning' | 'error' | 'pending';
  stats?: {
    recordsProcessed?: number;
    timeElapsed?: number;
    errors?: number;
  };
}

export interface ETLPipeline {
  id: string;
  name: string;
  description?: string;
  status: PipelineStatus;
  schedule: PipelineSchedule;
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  nextRun?: Date;
  steps: PipelineStep[];
  owner: string;
  tags?: string[];
  errorHandling?: 'stop' | 'continue' | 'retry';
  retryLimit?: number;
  timeout?: number;
  stats?: {
    runsTotal: number;
    successRate: number;
    avgDuration: number;
    lastRunDuration?: number;
    dataProcessed?: {
      records: number;
      bytes: number;
    };
  };
}

export interface ETLPipelineProps {
  pipelines?: ETLPipeline[];
  onCreatePipeline?: (pipeline: Omit<ETLPipeline, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ETLPipeline>;
  onUpdatePipeline?: (pipelineId: string, updates: Partial<ETLPipeline>) => Promise<ETLPipeline>;
  onDeletePipeline?: (pipelineId: string) => Promise<boolean>;
  onRunPipeline?: (pipelineId: string) => Promise<boolean>;
  onPausePipeline?: (pipelineId: string) => Promise<boolean>;
  onResumePipeline?: (pipelineId: string) => Promise<boolean>;
}

// Mock data
const mockPipelines: ETLPipeline[] = [
  {
    id: 'pipeline-1',
    name: 'QuickBooks to Financial Database',
    description: 'Import QuickBooks data, transform it, and load into our financial database.',
    status: 'active',
    schedule: 'daily',
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date('2023-09-15'),
    lastRun: new Date('2023-09-16T04:30:00'),
    nextRun: new Date('2023-09-17T04:30:00'),
    owner: 'John Doe',
    tags: ['finance', 'quickbooks', 'critical'],
    errorHandling: 'retry',
    retryLimit: 3,
    timeout: 3600,
    steps: [
      {
        id: 'step-1',
        name: 'Extract from QuickBooks',
        type: 'data_source',
        description: 'Extract transactions, invoices, and expenses from QuickBooks.',
        config: {
          source: 'quickbooks',
          entities: ['Transactions', 'Invoices', 'Expenses'],
          timeframe: 'last_7_days'
        },
        order: 1,
        status: 'success',
        stats: {
          recordsProcessed: 2543,
          timeElapsed: 45,
          errors: 0
        }
      },
      {
        id: 'step-2',
        name: 'Map Fields',
        type: 'map_fields',
        description: 'Map QuickBooks fields to our database schema.',
        config: {
          mappings: {
            'Date': 'transaction_date',
            'Amount': 'transaction_amount',
            'Description': 'transaction_description',
            'Customer': 'customer_name'
          }
        },
        order: 2,
        dependsOn: ['step-1'],
        status: 'success',
        stats: {
          recordsProcessed: 2543,
          timeElapsed: 12,
          errors: 0
        }
      },
      {
        id: 'step-3',
        name: 'Transform Data',
        type: 'transform',
        description: 'Clean and transform data for our system.',
        config: {
          operations: [
            { type: 'format_date', field: 'transaction_date', format: 'YYYY-MM-DD' },
            { type: 'normalize_text', field: 'transaction_description' },
            { type: 'convert_currency', field: 'transaction_amount', to: 'USD' }
          ]
        },
        order: 3,
        dependsOn: ['step-2'],
        status: 'success',
        stats: {
          recordsProcessed: 2543,
          timeElapsed: 28,
          errors: 0
        }
      },
      {
        id: 'step-4',
        name: 'Load to Database',
        type: 'destination',
        description: 'Load transformed data into our financial database.',
        config: {
          destination: 'postgres',
          schema: 'finance',
          table: 'transactions',
          mode: 'upsert',
          key_fields: ['transaction_id']
        },
        order: 4,
        dependsOn: ['step-3'],
        status: 'success',
        stats: {
          recordsProcessed: 2543,
          timeElapsed: 35,
          errors: 0
        }
      }
    ],
    stats: {
      runsTotal: 47,
      successRate: 98.2,
      avgDuration: 120,
      lastRunDuration: 118,
      dataProcessed: {
        records: 2543,
        bytes: 5243000
      }
    }
  },
  {
    id: 'pipeline-2',
    name: 'Banking API to Cash Flow Reports',
    description: 'Pull banking data and generate cash flow reports.',
    status: 'active',
    schedule: 'daily',
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2023-09-10'),
    lastRun: new Date('2023-09-16T06:00:00'),
    nextRun: new Date('2023-09-17T06:00:00'),
    owner: 'Jane Smith',
    tags: ['banking', 'cash-flow', 'automation'],
    errorHandling: 'stop',
    steps: [
      {
        id: 'step-1',
        name: 'Extract from Banking API',
        type: 'data_source',
        config: {
          source: 'banking-api',
          authentication: 'oauth',
          endpoints: ['accounts', 'transactions']
        },
        order: 1,
        status: 'success',
        stats: {
          recordsProcessed: 1253,
          timeElapsed: 32,
          errors: 0
        }
      },
      {
        id: 'step-2',
        name: 'Filter Transactions',
        type: 'filter',
        config: {
          conditions: [
            { field: 'amount', operator: '>', value: 0 },
            { field: 'date', operator: '>=', value: '{{last_30_days}}' }
          ],
          combine: 'AND'
        },
        order: 2,
        dependsOn: ['step-1'],
        status: 'success',
        stats: {
          recordsProcessed: 842,
          timeElapsed: 8,
          errors: 0
        }
      },
      {
        id: 'step-3',
        name: 'Categorize Transactions',
        type: 'transform',
        config: {
          operations: [
            { type: 'categorize', field: 'description', target: 'category', using: 'rules_engine' }
          ],
          rules: [
            { pattern: '.*SALARY.*', category: 'Income' },
            { pattern: '.*RENT.*', category: 'Housing' },
            { pattern: '.*GROCERY.*', category: 'Food' }
          ]
        },
        order: 3,
        dependsOn: ['step-2'],
        status: 'success',
        stats: {
          recordsProcessed: 842,
          timeElapsed: 15,
          errors: 0
        }
      },
      {
        id: 'step-4',
        name: 'Aggregate by Category',
        type: 'aggregate',
        config: {
          groupBy: ['category', 'month'],
          measures: [
            { field: 'amount', function: 'sum', as: 'total_amount' },
            { field: 'amount', function: 'count', as: 'transaction_count' }
          ]
        },
        order: 4,
        dependsOn: ['step-3'],
        status: 'success',
        stats: {
          recordsProcessed: 24,
          timeElapsed: 5,
          errors: 0
        }
      },
      {
        id: 'step-5',
        name: 'Generate Cash Flow Reports',
        type: 'destination',
        config: {
          destination: 'postgres',
          schema: 'finance',
          table: 'cash_flow_summary',
          mode: 'replace'
        },
        order: 5,
        dependsOn: ['step-4'],
        status: 'success',
        stats: {
          recordsProcessed: 24,
          timeElapsed: 7,
          errors: 0
        }
      }
    ],
    stats: {
      runsTotal: 63,
      successRate: 100,
      avgDuration: 67,
      lastRunDuration: 65,
      dataProcessed: {
        records: 842,
        bytes: 1240000
      }
    }
  },
  {
    id: 'pipeline-3',
    name: 'Excel Import to Financial Models',
    description: 'Process Excel reports for financial modeling.',
    status: 'failed',
    schedule: 'weekly',
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2023-09-12'),
    lastRun: new Date('2023-09-15T10:00:00'),
    nextRun: new Date('2023-09-22T10:00:00'),
    owner: 'David Johnson',
    tags: ['excel', 'financial-models', 'reports'],
    errorHandling: 'continue',
    steps: [
      {
        id: 'step-1',
        name: 'Import Excel Files',
        type: 'data_source',
        config: {
          source: 'excel',
          location: 'sftp://reports.example.com/financial/',
          filePattern: 'financial_report_*.xlsx'
        },
        order: 1,
        status: 'success',
        stats: {
          recordsProcessed: 5230,
          timeElapsed: 28,
          errors: 0
        }
      },
      {
        id: 'step-2',
        name: 'Clean Data',
        type: 'transform',
        config: {
          operations: [
            { type: 'remove_duplicates', fields: ['report_id', 'line_item'] },
            { type: 'fill_nulls', field: 'value', with: 0 },
            { type: 'trim_whitespace', fields: ['description', 'category'] }
          ]
        },
        order: 2,
        dependsOn: ['step-1'],
        status: 'success',
        stats: {
          recordsProcessed: 5227,
          timeElapsed: 15,
          errors: 0
        }
      },
      {
        id: 'step-3',
        name: 'Calculate Metrics',
        type: 'calculate',
        config: {
          calculations: [
            { formula: '[revenue] - [expenses]', as: 'profit' },
            { formula: '[profit] / [revenue] * 100', as: 'profit_margin' },
            { formula: '[current_assets] / [current_liabilities]', as: 'current_ratio' }
          ]
        },
        order: 3,
        dependsOn: ['step-2'],
        status: 'error',
        stats: {
          recordsProcessed: 1230,
          timeElapsed: 22,
          errors: 3
        }
      },
      {
        id: 'step-4',
        name: 'Load to Models',
        type: 'destination',
        config: {
          destination: 'postgres',
          schema: 'finance',
          table: 'financial_models',
          mode: 'append'
        },
        order: 4,
        dependsOn: ['step-3'],
        status: 'pending'
      }
    ],
    stats: {
      runsTotal: 15,
      successRate: 86.7,
      avgDuration: 95,
      lastRunDuration: 65,
      dataProcessed: {
        records: 1230,
        bytes: 2500000
      }
    }
  }
];

// Step type configs - field definitions for each step type
const stepTypeConfigs = {
  data_source: [
    {
      name: 'source',
      label: 'Data Source',
      type: 'select',
      options: [
        { label: 'QuickBooks', value: 'quickbooks' },
        { label: 'Xero', value: 'xero' },
        { label: 'Banking API', value: 'banking-api' },
        { label: 'Excel', value: 'excel' },
        { label: 'CSV', value: 'csv' },
        { label: 'SQL Database', value: 'sql-db' },
        { label: 'REST API', value: 'rest-api' },
        { label: 'SFTP', value: 'sftp' }
      ],
      required: true
    },
    {
      name: 'entities',
      label: 'Data Entities',
      type: 'multiselect',
      options: [
        { label: 'Transactions', value: 'Transactions' },
        { label: 'Invoices', value: 'Invoices' },
        { label: 'Expenses', value: 'Expenses' },
        { label: 'Customers', value: 'Customers' },
        { label: 'Vendors', value: 'Vendors' },
        { label: 'Products', value: 'Products' },
        { label: 'Accounts', value: 'Accounts' },
        { label: 'Bills', value: 'Bills' }
      ],
      required: true,
      dependsOn: { field: 'source', values: ['quickbooks', 'xero'] }
    },
    {
      name: 'timeframe',
      label: 'Time Frame',
      type: 'select',
      options: [
        { label: 'All Data', value: 'all' },
        { label: 'Last 7 Days', value: 'last_7_days' },
        { label: 'Last 30 Days', value: 'last_30_days' },
        { label: 'Last 90 Days', value: 'last_90_days' },
        { label: 'Last 12 Months', value: 'last_12_months' },
        { label: 'Year to Date', value: 'ytd' },
        { label: 'Custom Period', value: 'custom' }
      ],
      required: false
    },
    {
      name: 'filePattern',
      label: 'File Pattern',
      type: 'text',
      required: false,
      dependsOn: { field: 'source', values: ['excel', 'csv', 'sftp'] }
    },
    {
      name: 'apiEndpoint',
      label: 'API Endpoint',
      type: 'text',
      required: false,
      dependsOn: { field: 'source', values: ['rest-api'] }
    }
  ],
  transform: [
    {
      name: 'operationType',
      label: 'Operation Type',
      type: 'select',
      options: [
        { label: 'Format Date', value: 'format_date' },
        { label: 'Normalize Text', value: 'normalize_text' },
        { label: 'Convert Currency', value: 'convert_currency' },
        { label: 'Remove Duplicates', value: 'remove_duplicates' },
        { label: 'Fill Null Values', value: 'fill_nulls' },
        { label: 'String Operations', value: 'string_ops' },
        { label: 'Custom Formula', value: 'custom_formula' }
      ],
      required: true
    },
    {
      name: 'field',
      label: 'Field',
      type: 'text',
      required: true
    },
    {
      name: 'format',
      label: 'Date Format',
      type: 'select',
      options: [
        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
        { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' }
      ],
      required: false,
      dependsOn: { field: 'operationType', values: ['format_date'] }
    },
    {
      name: 'targetCurrency',
      label: 'Target Currency',
      type: 'select',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'JPY', value: 'JPY' },
        { label: 'CAD', value: 'CAD' },
        { label: 'AUD', value: 'AUD' }
      ],
      required: false,
      dependsOn: { field: 'operationType', values: ['convert_currency'] }
    },
    {
      name: 'formula',
      label: 'Custom Formula',
      type: 'textarea',
      required: false,
      dependsOn: { field: 'operationType', values: ['custom_formula'] }
    }
  ],
  filter: [
    {
      name: 'field',
      label: 'Field',
      type: 'text',
      required: true
    },
    {
      name: 'operator',
      label: 'Operator',
      type: 'select',
      options: [
        { label: 'Equals', value: '=' },
        { label: 'Not Equals', value: '!=' },
        { label: 'Greater Than', value: '>' },
        { label: 'Less Than', value: '<' },
        { label: 'Greater Than or Equal', value: '>=' },
        { label: 'Less Than or Equal', value: '<=' },
        { label: 'Contains', value: 'contains' },
        { label: 'Starts With', value: 'starts_with' },
        { label: 'Ends With', value: 'ends_with' },
        { label: 'In List', value: 'in' },
        { label: 'Not In List', value: 'not_in' }
      ],
      required: true
    },
    {
      name: 'value',
      label: 'Value',
      type: 'text',
      required: true
    },
    {
      name: 'combineMethod',
      label: 'Combine Method',
      type: 'select',
      options: [
        { label: 'AND', value: 'AND' },
        { label: 'OR', value: 'OR' }
      ],
      required: false
    }
  ],
  join: [
    {
      name: 'leftSource',
      label: 'Left Data Source',
      type: 'text',
      required: true
    },
    {
      name: 'rightSource',
      label: 'Right Data Source',
      type: 'text',
      required: true
    },
    {
      name: 'joinType',
      label: 'Join Type',
      type: 'select',
      options: [
        { label: 'Inner Join', value: 'inner' },
        { label: 'Left Join', value: 'left' },
        { label: 'Right Join', value: 'right' },
        { label: 'Full Join', value: 'full' }
      ],
      required: true
    },
    {
      name: 'leftKey',
      label: 'Left Key Field',
      type: 'text',
      required: true
    },
    {
      name: 'rightKey',
      label: 'Right Key Field',
      type: 'text',
      required: true
    }
  ],
  aggregate: [
    {
      name: 'groupByFields',
      label: 'Group By Fields',
      type: 'text',
      required: true
    },
    {
      name: 'aggregateFunction',
      label: 'Aggregate Function',
      type: 'select',
      options: [
        { label: 'Sum', value: 'sum' },
        { label: 'Average', value: 'avg' },
        { label: 'Minimum', value: 'min' },
        { label: 'Maximum', value: 'max' },
        { label: 'Count', value: 'count' },
        { label: 'Count Distinct', value: 'count_distinct' }
      ],
      required: true
    },
    {
      name: 'sourceField',
      label: 'Source Field',
      type: 'text',
      required: true
    },
    {
      name: 'outputField',
      label: 'Output Field',
      type: 'text',
      required: true
    }
  ],
  map_fields: [
    {
      name: 'sourceField',
      label: 'Source Field',
      type: 'text',
      required: true
    },
    {
      name: 'targetField',
      label: 'Target Field',
      type: 'text',
      required: true
    },
    {
      name: 'defaultValue',
      label: 'Default Value',
      type: 'text',
      required: false
    }
  ],
  calculate: [
    {
      name: 'formula',
      label: 'Formula',
      type: 'textarea',
      required: true
    },
    {
      name: 'outputField',
      label: 'Output Field',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: false
    }
  ],
  destination: [
    {
      name: 'destination',
      label: 'Destination',
      type: 'select',
      options: [
        { label: 'PostgreSQL', value: 'postgres' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'SQL Server', value: 'sqlserver' },
        { label: 'Excel File', value: 'excel' },
        { label: 'CSV File', value: 'csv' },
        { label: 'REST API', value: 'rest-api' },
        { label: 'SFTP', value: 'sftp' }
      ],
      required: true
    },
    {
      name: 'schema',
      label: 'Schema',
      type: 'text',
      required: false,
      dependsOn: { field: 'destination', values: ['postgres', 'mysql', 'sqlserver'] }
    },
    {
      name: 'table',
      label: 'Table',
      type: 'text',
      required: true,
      dependsOn: { field: 'destination', values: ['postgres', 'mysql', 'sqlserver'] }
    },
    {
      name: 'mode',
      label: 'Write Mode',
      type: 'select',
      options: [
        { label: 'Append', value: 'append' },
        { label: 'Replace', value: 'replace' },
        { label: 'Upsert', value: 'upsert' }
      ],
      required: true
    },
    {
      name: 'keyFields',
      label: 'Key Fields (for upsert)',
      type: 'text',
      required: false,
      dependsOn: { field: 'mode', values: ['upsert'] }
    },
    {
      name: 'fileName',
      label: 'File Name',
      type: 'text',
      required: false,
      dependsOn: { field: 'destination', values: ['excel', 'csv', 'sftp'] }
    }
  ]
};

// This component will need to be enhanced with drag-and-drop capabilities for a production version
const ETLPipeline: React.FC<ETLPipelineProps> = ({
  pipelines = mockPipelines,
  onCreatePipeline,
  onUpdatePipeline,
  onDeletePipeline,
  onRunPipeline,
  onPausePipeline,
  onResumePipeline
}) => {
  const [activeTab, setActiveTab] = useState('pipelines');
  const [selectedPipeline, setSelectedPipeline] = useState<ETLPipeline | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<PipelineStep | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get status badge
  const getStatusBadge = (status: PipelineStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'draft':
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };
  
  // Get step status icon
  const getStepStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };
  
  // Handle running a pipeline
  const handleRunPipeline = async (pipelineId: string) => {
    try {
      if (onRunPipeline) {
        const success = await onRunPipeline(pipelineId);
        
        if (success) {
          toast({
            title: "Pipeline started",
            description: "The pipeline is now running."
          });
        } else {
          toast({
            title: "Failed to start pipeline",
            description: "There was an error starting the pipeline.",
            variant: "destructive"
          });
        }
      } else {
        // Mock success
        toast({
          title: "Pipeline started",
          description: "The pipeline is now running."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };
  
  // Handle pausing a pipeline
  const handlePausePipeline = async (pipelineId: string) => {
    try {
      if (onPausePipeline) {
        const success = await onPausePipeline(pipelineId);
        
        if (success) {
          toast({
            title: "Pipeline paused",
            description: "The pipeline has been paused."
          });
        } else {
          toast({
            title: "Failed to pause pipeline",
            description: "There was an error pausing the pipeline.",
            variant: "destructive"
          });
        }
      } else {
        // Mock success
        toast({
          title: "Pipeline paused",
          description: "The pipeline has been paused."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };
  
  // Handle resuming a pipeline
  const handleResumePipeline = async (pipelineId: string) => {
    try {
      if (onResumePipeline) {
        const success = await onResumePipeline(pipelineId);
        
        if (success) {
          toast({
            title: "Pipeline resumed",
            description: "The pipeline is now active."
          });
        } else {
          toast({
            title: "Failed to resume pipeline",
            description: "There was an error resuming the pipeline.",
            variant: "destructive"
          });
        }
      } else {
        // Mock success
        toast({
          title: "Pipeline resumed",
          description: "The pipeline is now active."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };
  
  // Handle creating a new pipeline
  const handleCreatePipeline = () => {
    const newPipeline: Omit<ETLPipeline, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'New Pipeline',
      description: 'New data pipeline',
      status: 'draft',
      schedule: 'manual',
      steps: [],
      owner: 'Current User'
    };
    
    if (onCreatePipeline) {
      onCreatePipeline(newPipeline)
        .then(pipeline => {
          setSelectedPipeline(pipeline);
          setIsEditMode(true);
          setActiveTab('editor');
          toast({
            title: "Pipeline created",
            description: "New pipeline has been created successfully."
          });
        })
        .catch(() => {
          toast({
            title: "Failed to create pipeline",
            description: "There was an error creating the pipeline.",
            variant: "destructive"
          });
        });
    } else {
      // Mock creation
      const mockPipeline: ETLPipeline = {
        ...newPipeline,
        id: `pipeline-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: []
      };
      
      setSelectedPipeline(mockPipeline);
      setIsEditMode(true);
      setActiveTab('editor');
      toast({
        title: "Pipeline created",
        description: "New pipeline has been created successfully."
      });
    }
  };
  
  // Handle deleting a pipeline
  const handleDeletePipeline = async (pipelineId: string) => {
    if (confirm("Are you sure you want to delete this pipeline? This action cannot be undone.")) {
      try {
        if (onDeletePipeline) {
          const success = await onDeletePipeline(pipelineId);
          
          if (success) {
            toast({
              title: "Pipeline deleted",
              description: "The pipeline has been deleted successfully."
            });
            
            if (selectedPipeline?.id === pipelineId) {
              setSelectedPipeline(null);
              setActiveTab('pipelines');
            }
          } else {
            toast({
              title: "Failed to delete pipeline",
              description: "There was an error deleting the pipeline.",
              variant: "destructive"
            });
          }
        } else {
          // Mock deletion
          toast({
            title: "Pipeline deleted",
            description: "The pipeline has been deleted successfully."
          });
          
          if (selectedPipeline?.id === pipelineId) {
            setSelectedPipeline(null);
            setActiveTab('pipelines');
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle adding a step to the pipeline
  const handleAddStep = (stepType: StepType) => {
    if (!selectedPipeline) return;
    
    const newStep: PipelineStep = {
      id: `step-${Date.now()}`,
      name: `New ${stepType.replace('_', ' ')} step`,
      type: stepType,
      description: '',
      config: {},
      order: selectedPipeline.steps.length + 1
    };
    
    const updatedPipeline = {
      ...selectedPipeline,
      steps: [...selectedPipeline.steps, newStep],
      updatedAt: new Date()
    };
    
    if (onUpdatePipeline) {
      onUpdatePipeline(selectedPipeline.id, { steps: updatedPipeline.steps })
        .then(pipeline => {
          setSelectedPipeline(pipeline);
          setCurrentStep(newStep);
          setExpandedSteps({ ...expandedSteps, [newStep.id]: true });
          toast({
            title: "Step added",
            description: "New step has been added to the pipeline."
          });
        })
        .catch(() => {
          toast({
            title: "Failed to add step",
            description: "There was an error adding the step.",
            variant: "destructive"
          });
        });
    } else {
      // Mock update
      setSelectedPipeline(updatedPipeline);
      setCurrentStep(newStep);
      setExpandedSteps({ ...expandedSteps, [newStep.id]: true });
      toast({
        title: "Step added",
        description: "New step has been added to the pipeline."
      });
    }
  };
  
  // Handle saving the pipeline
  const handleSavePipeline = () => {
    if (!selectedPipeline) return;
    
    if (onUpdatePipeline) {
      onUpdatePipeline(selectedPipeline.id, selectedPipeline)
        .then(pipeline => {
          setSelectedPipeline(pipeline);
          setIsEditMode(false);
          toast({
            title: "Pipeline saved",
            description: "Pipeline has been saved successfully."
          });
        })
        .catch(() => {
          toast({
            title: "Failed to save pipeline",
            description: "There was an error saving the pipeline.",
            variant: "destructive"
          });
        });
    } else {
      // Mock save
      setIsEditMode(false);
      toast({
        title: "Pipeline saved",
        description: "Pipeline has been saved successfully."
      });
    }
  };
  

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pipelines" 
            onClick={() => {
              if (isEditMode && selectedPipeline && confirm("Discard unsaved changes?")) {
                setSelectedPipeline(null);
                setIsEditMode(false);
              } else if (!isEditMode) {
                setSelectedPipeline(null);
              }
            }}
          >
            Pipelines
          </TabsTrigger>
          {selectedPipeline && (
            <TabsTrigger value="editor">
              {isEditMode ? "Edit Pipeline" : "Pipeline Details"}
            </TabsTrigger>
          )}
          <TabsTrigger value="monitor">
            Monitoring
          </TabsTrigger>
        </TabsList>
        
        {/* Pipelines List Tab */}
        <TabsContent value="pipelines">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Data Integration Pipelines</h2>
            <Button onClick={handleCreatePipeline}>
              <Plus className="mr-2 h-4 w-4" />
              Create Pipeline
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {pipelines.length === 0 ? (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <Workflow className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Pipelines Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have any data integration pipelines yet. Create a pipeline to start automating your data workflows.
                  </p>
                  <Button onClick={handleCreatePipeline}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Pipeline
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {pipelines.map(pipeline => (
                  <Card key={pipeline.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{pipeline.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{pipeline.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div>
                                {getStatusBadge(pipeline.status)}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedPipeline(pipeline);
                                    setIsEditMode(false);
                                    setActiveTab('editor');
                                  }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedPipeline(pipeline);
                                    setIsEditMode(true);
                                    setActiveTab('editor');
                                  }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {pipeline.status === 'active' ? (
                                    <DropdownMenuItem onClick={() => handlePausePipeline(pipeline.id)}>
                                      <Pause className="mr-2 h-4 w-4" />
                                      Pause Pipeline
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleResumePipeline(pipeline.id)}>
                                      <Play className="mr-2 h-4 w-4" />
                                      Resume Pipeline
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleRunPipeline(pipeline.id)}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Run Now
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePipeline(pipeline.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Schedule:</span>{' '}
                              <span className="font-medium">{pipeline.schedule.charAt(0).toUpperCase() + pipeline.schedule.slice(1)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Last Run:</span>{' '}
                              <span className="font-medium">{pipeline.lastRun ? formatDate(pipeline.lastRun) : 'Never'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Next Run:</span>{' '}
                              <span className="font-medium">{pipeline.nextRun ? formatDate(pipeline.nextRun) : 'Not scheduled'}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Steps:</span>{' '}
                              <span className="font-medium">{pipeline.steps.length}</span>
                            </div>
                          </div>
                          
                          {pipeline.stats && (
                            <div className="mt-4">
                              <div className="flex items-center">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span>Success Rate</span>
                                    <span className="font-medium">{pipeline.stats.successRate}%</span>
                                  </div>
                                  <Progress value={pipeline.stats.successRate} className="h-1" />
                                </div>
                                
                                <div className="ml-8 text-sm">
                                  <span className="text-muted-foreground">Avg. Duration:</span>{' '}
                                  <span className="font-medium">{pipeline.stats.avgDuration}s</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="flex space-x-1">
                              {pipeline.tags?.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRunPipeline(pipeline.id)}
                              >
                                <Play className="mr-2 h-3 w-3" />
                                Run Now
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPipeline(pipeline);
                                  setIsEditMode(false);
                                  setActiveTab('editor');
                                }}
                              >
                                <ArrowRight className="mr-2 h-3 w-3" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </TabsContent>
        
        {/* Pipeline Editor/Viewer Tab */}
        {selectedPipeline && (
          <TabsContent value="editor">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">
                  {isEditMode ? `Editing: ${selectedPipeline.name}` : selectedPipeline.name}
                </h2>
                <div className="ml-4">
                  {getStatusBadge(selectedPipeline.status)}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSavePipeline}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Pipeline
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button onClick={() => handleRunPipeline(selectedPipeline.id)}>
                      <Play className="mr-2 h-4 w-4" />
                      Run Pipeline
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pipeline Details */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Pipeline Information</CardTitle>
                    <CardDescription>
                      Configure the pipeline settings and steps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pipeline-name">Pipeline Name</Label>
                          <Input 
                            id="pipeline-name" 
                            value={selectedPipeline.name}
                            onChange={(e) => setSelectedPipeline({
                              ...selectedPipeline,
                              name: e.target.value
                            })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pipeline-description">Description</Label>
                          <Textarea 
                            id="pipeline-description" 
                            value={selectedPipeline.description || ''}
                            onChange={(e) => setSelectedPipeline({
                              ...selectedPipeline,
                              description: e.target.value
                            })}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="pipeline-schedule">Schedule</Label>
                            <Select 
                              value={selectedPipeline.schedule}
                              onValueChange={(value) => setSelectedPipeline({
                                ...selectedPipeline,
                                schedule: value as PipelineSchedule
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select schedule" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="pipeline-error-handling">Error Handling</Label>
                            <Select 
                              value={selectedPipeline.errorHandling || 'stop'}
                              onValueChange={(value) => setSelectedPipeline({
                                ...selectedPipeline,
                                errorHandling: value as 'stop' | 'continue' | 'retry'
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select error handling" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="stop">Stop on Error</SelectItem>
                                <SelectItem value="continue">Continue on Error</SelectItem>
                                <SelectItem value="retry">Retry on Error</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="pipeline-tags">Tags (comma separated)</Label>
                          <Input 
                            id="pipeline-tags" 
                            value={selectedPipeline.tags?.join(', ') || ''}
                            onChange={(e) => setSelectedPipeline({
                              ...selectedPipeline,
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                            })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                            <p>{selectedPipeline.description || 'No description provided'}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Owner</h4>
                            <p>{selectedPipeline.owner}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Schedule</h4>
                            <p>{selectedPipeline.schedule.charAt(0).toUpperCase() + selectedPipeline.schedule.slice(1)}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Error Handling</h4>
                            <p>{selectedPipeline.errorHandling ? selectedPipeline.errorHandling.charAt(0).toUpperCase() + selectedPipeline.errorHandling.slice(1) : 'Stop on Error'}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                            <p>{formatDate(selectedPipeline.createdAt)}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                            <p>{formatDate(selectedPipeline.updatedAt)}</p>
                          </div>
                          
                          {selectedPipeline.lastRun && (
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Last Run</h4>
                              <p>{formatDate(selectedPipeline.lastRun)}</p>
                            </div>
                          )}
                          
                          {selectedPipeline.nextRun && (
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Next Run</h4>
                              <p>{formatDate(selectedPipeline.nextRun)}</p>
                            </div>
                          )}
                        </div>
                        
                        {selectedPipeline.tags && selectedPipeline.tags.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedPipeline.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedPipeline.stats && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Pipeline Statistics</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Success Rate</div>
                                <div className="font-medium">{selectedPipeline.stats.successRate}%</div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground">Average Duration</div>
                                <div className="font-medium">{selectedPipeline.stats.avgDuration} seconds</div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-muted-foreground">Total Runs</div>
                                <div className="font-medium">{selectedPipeline.stats.runsTotal}</div>
                              </div>
                              
                              {selectedPipeline.stats.dataProcessed && (
                                <div>
                                  <div className="text-sm text-muted-foreground">Records Processed</div>
                                  <div className="font-medium">{selectedPipeline.stats.dataProcessed.records.toLocaleString()}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Pipeline Steps */}
                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Pipeline Steps</CardTitle>
                      <CardDescription>
                        Data processing steps in this pipeline
                      </CardDescription>
                    </div>
                    
                    {isEditMode && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Step
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Step Type</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => handleAddStep('data_source')}>
                            <FolderInput className="mr-2 h-4 w-4" />
                            Data Source
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddStep('transform')}>
                            <MoveHorizontal className="mr-2 h-4 w-4" />
                            Transform
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddStep('filter')}>
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddStep('join')}>
                            <GitCompare className="mr-2 h-4 w-4" />
                            Join
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddStep('aggregate')}>
                            <ArrowDown className="mr-2 h-4 w-4" />
                            Aggregate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddStep('map_fields')}>
                            <MoveHorizontal className="mr-2 h-4 w-4" />
                            Map Fields
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddStep('calculate')}>
                            <Code className="mr-2 h-4 w-4" />
                            Calculate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddStep('destination')}>
                            <FolderOutput className="mr-2 h-4 w-4" />
                            Destination
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedPipeline.steps.length === 0 ? (
                      <div className="text-center py-8">
                        <Workflow className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No Steps Defined</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add steps to build your data pipeline workflow.
                        </p>
                        
                        {isEditMode && (
                          <Button
                            onClick={() => handleAddStep('data_source')}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Step
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Accordion
                        type="multiple"
                        value={Object.keys(expandedSteps).filter(id => expandedSteps[id])}
                        onValueChange={(values) => {
                          const expanded: Record<string, boolean> = {};
                          values.forEach(value => {
                            expanded[value] = true;
                          });
                          setExpandedSteps(expanded);
                        }}
                      >
                        {selectedPipeline.steps
                          .sort((a, b) => a.order - b.order)
                          .map((step) => (
                          <AccordionItem key={step.id} value={step.id} className="border rounded-md mb-2 last:mb-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {getStepStatusIcon(step.status)}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">{step.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {step.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 py-2">
                              {isEditMode ? (
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`step-${step.id}-name`}>Step Name</Label>
                                    <Input 
                                      id={`step-${step.id}-name`} 
                                      value={step.name}
                                      onChange={(e) => {
                                        const updatedSteps = selectedPipeline.steps.map(s => 
                                          s.id === step.id ? { ...s, name: e.target.value } : s
                                        );
                                        setSelectedPipeline({
                                          ...selectedPipeline,
                                          steps: updatedSteps
                                        });
                                      }}
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor={`step-${step.id}-description`}>Description</Label>
                                    <Textarea 
                                      id={`step-${step.id}-description`} 
                                      value={step.description || ''}
                                      onChange={(e) => {
                                        const updatedSteps = selectedPipeline.steps.map(s => 
                                          s.id === step.id ? { ...s, description: e.target.value } : s
                                        );
                                        setSelectedPipeline({
                                          ...selectedPipeline,
                                          steps: updatedSteps
                                        });
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Step-specific configuration fields */}
                                  <div className="space-y-2">
                                    <Label>Step Configuration</Label>
                                    <div className="border rounded-md p-4 space-y-4">
                                      <Textarea 
                                        placeholder="Step configuration in JSON format"
                                        value={JSON.stringify(step.config, null, 2)}
                                        className="font-mono text-sm"
                                        rows={8}
                                        onChange={(e) => {
                                          try {
                                            const config = JSON.parse(e.target.value);
                                            const updatedSteps = selectedPipeline.steps.map(s => 
                                              s.id === step.id ? { ...s, config } : s
                                            );
                                            setSelectedPipeline({
                                              ...selectedPipeline,
                                              steps: updatedSteps
                                            });
                                          } catch (error) {
                                            // Invalid JSON, don't update
                                          }
                                        }}
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Enter the step configuration in JSON format
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const updatedSteps = selectedPipeline.steps.filter(s => s.id !== step.id);
                                        setSelectedPipeline({
                                          ...selectedPipeline,
                                          steps: updatedSteps
                                        });
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="mr-2 h-3 w-3" />
                                      Remove Step
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {step.description && (
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                                      <p className="text-sm">{step.description}</p>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Configuration</h4>
                                    <div className="bg-muted/30 p-3 rounded-md">
                                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                                        {JSON.stringify(step.config, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                  
                                  {step.stats && (
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Step Statistics</h4>
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <div className="text-xs text-muted-foreground">Records Processed</div>
                                          <div className="font-medium">{step.stats.recordsProcessed?.toLocaleString() || 0}</div>
                                        </div>
                                        
                                        <div>
                                          <div className="text-xs text-muted-foreground">Time Elapsed</div>
                                          <div className="font-medium">{step.stats.timeElapsed || 0}s</div>
                                        </div>
                                        
                                        <div>
                                          <div className="text-xs text-muted-foreground">Errors</div>
                                          <div className="font-medium">{step.stats.errors || 0}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {step.dependsOn && step.dependsOn.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Dependencies</h4>
                                      <div className="flex flex-wrap gap-2">
                                        {step.dependsOn.map((depId) => {
                                          const depStep = selectedPipeline.steps.find(s => s.id === depId);
                                          return depStep ? (
                                            <Badge key={depId} variant="outline" className="text-xs">
                                              {depStep.name}
                                            </Badge>
                                          ) : null;
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Pipeline History and Info */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full justify-start" onClick={() => handleRunPipeline(selectedPipeline.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Run Pipeline Now
                      </Button>
                      
                      {selectedPipeline.status === 'active' ? (
                        <Button variant="outline" className="w-full justify-start" onClick={() => handlePausePipeline(selectedPipeline.id)}>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause Pipeline
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full justify-start" onClick={() => handleResumePipeline(selectedPipeline.id)}>
                          <Play className="mr-2 h-4 w-4" />
                          Resume Pipeline
                        </Button>
                      )}
                      
                      <Button variant="outline" className="w-full justify-start">
                        <History className="mr-2 h-4 w-4" />
                        View Run History
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        View Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Pipeline Runs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md divide-y">
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{formatDate(new Date('2023-09-16T04:30:00'))}</div>
                            <div className="text-xs text-muted-foreground">Duration: 2m 32s</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </div>
                        
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{formatDate(new Date('2023-09-15T04:30:00'))}</div>
                            <div className="text-xs text-muted-foreground">Duration: 2m 28s</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </div>
                        
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{formatDate(new Date('2023-09-14T04:30:00'))}</div>
                            <div className="text-xs text-muted-foreground">Duration: 3m 12s</div>
                          </div>
                          <Badge className="bg-red-100 text-red-800">Failed</Badge>
                        </div>
                        
                        <div className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{formatDate(new Date('2023-09-13T04:30:00'))}</div>
                            <div className="text-xs text-muted-foreground">Duration: 2m 45s</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        View All Runs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
        
        {/* Monitoring Tab */}
        <TabsContent value="monitor">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Pipeline Monitoring</h2>
            <div className="flex space-x-2">
              <Select defaultValue="1h">
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Pipeline Executions</h3>
                    <p className="text-3xl font-bold mt-2">243</p>
                  </div>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-2 text-sm text-green-600">
                  <span>↑ 12% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Success Rate</h3>
                    <p className="text-3xl font-bold mt-2">98.2%</p>
                  </div>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-2 text-sm text-green-600">
                  <span>↑ 2.5% from previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">Avg. Duration</h3>
                    <p className="text-3xl font-bold mt-2">87s</p>
                  </div>
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-2 text-sm text-red-600">
                  <span>↑ 8% from previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Performance</CardTitle>
                <CardDescription>
                  Key metrics by pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pipelines.map(pipeline => (
                    <div key={pipeline.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="font-medium">{pipeline.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {pipeline.schedule.charAt(0).toUpperCase() + pipeline.schedule.slice(1)} | Last run: {pipeline.lastRun ? formatDate(pipeline.lastRun) : 'Never'}
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-24 text-right">
                        <div className="font-medium">
                          {pipeline.stats?.successRate || 0}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {pipeline.stats?.avgDuration || 0}s avg
                        </div>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(pipeline.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Issues</CardTitle>
                <CardDescription>
                  Errors and warnings from pipeline runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-red-50">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Excel Import to Financial Models</h4>
                        <p className="text-sm mt-1">
                          Error in Calculate Metrics step: Division by zero in profit margin calculation
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(new Date('2023-09-15T10:23:45'))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md bg-yellow-50">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">QuickBooks to Financial Database</h4>
                        <p className="text-sm mt-1">
                          Warning: 3 records had null values in required fields and were skipped
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(new Date('2023-09-16T04:35:12'))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-md bg-red-50">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                      <div>
                        <h4 className="font-medium">Banking API to Cash Flow Reports</h4>
                        <p className="text-sm mt-1">
                          Error: API rate limit exceeded when fetching transaction data
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(new Date('2023-09-13T06:12:33'))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ETLPipeline;