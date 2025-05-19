import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  Database,
  ExternalLink,
  FileText,
  Key,
  KeyRound,
  Lock,
  RefreshCw,
  Shield,
  Upload,
  Zap,
} from 'lucide-react';

export type DataSourceType = 
  | 'quickbooks' 
  | 'xero' 
  | 'sage' 
  | 'freshbooks' 
  | 'banking' 
  | 'csv' 
  | 'excel' 
  | 'api' 
  | 'custom';

export type DataConnectionStatus = 
  | 'connected' 
  | 'disconnected' 
  | 'connecting' 
  | 'error' 
  | 'needs_authentication' 
  | 'configured';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  description: string;
  iconUrl: string;
  status: DataConnectionStatus;
  lastSyncedAt?: Date;
  setupSteps?: string[];
  features?: string[];
  credentials?: Record<string, string>;
  connectionDetails?: Record<string, string>;
  syncFrequency?: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'manual';
  error?: string;
}

export interface DataSourceConnectorProps {
  availableSources?: DataSource[];
  connectedSources?: DataSource[];
  onConnect?: (source: DataSource, credentials: Record<string, string>) => Promise<boolean>;
  onDisconnect?: (sourceId: string) => Promise<boolean>;
  onTestConnection?: (sourceId: string) => Promise<boolean>;
  onSyncNow?: (sourceId: string) => Promise<boolean>;
}

// Default data sources
const defaultDataSources: DataSource[] = [
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    type: 'quickbooks',
    description: 'Connect to QuickBooks Online to import transactions, invoices, expenses, and more.',
    iconUrl: '/logos/quickbooks.png',
    status: 'disconnected',
    setupSteps: [
      'Create an app in QuickBooks Developer portal',
      'Configure redirect URLs',
      'Get your Client ID and Client Secret',
      'Authorize connection'
    ],
    features: [
      'Transactions', 'Invoices', 'Expenses', 'Financial Reports', 'Customers', 'Vendors'
    ],
    syncFrequency: 'daily'
  },
  {
    id: 'xero',
    name: 'Xero',
    type: 'xero',
    description: 'Import financial data from Xero accounting software.',
    iconUrl: '/logos/xero.png',
    status: 'disconnected',
    setupSteps: [
      'Create an app in Xero Developer portal',
      'Configure redirect URLs',
      'Get your Client ID and Client Secret',
      'Authorize connection'
    ],
    features: [
      'Transactions', 'Invoices', 'Expenses', 'Balance Sheet', 'Profit & Loss', 'Contacts'
    ],
    syncFrequency: 'daily'
  },
  {
    id: 'banking-api',
    name: 'Banking API',
    type: 'banking',
    description: 'Connect directly to banking APIs using Open Banking standards.',
    iconUrl: '/logos/banking.png',
    status: 'disconnected',
    setupSteps: [
      'Select your banking provider',
      'Register with their developer portal',
      'Configure OAuth credentials',
      'Authorize connection'
    ],
    features: [
      'Account Balances', 'Transactions', 'Funds Transfer', 'Payment Initiation', 'Standing Orders'
    ],
    syncFrequency: 'hourly'
  },
  {
    id: 'excel-csv',
    name: 'Excel & CSV Upload',
    type: 'excel',
    description: 'Upload and map Excel spreadsheets or CSV files into the platform.',
    iconUrl: '/logos/excel.png',
    status: 'configured',
    features: [
      'Manual File Upload', 'Template Mapping', 'Data Validation', 'Historical Data Import'
    ],
    syncFrequency: 'manual'
  },
  {
    id: 'custom-api',
    name: 'Custom API Integration',
    type: 'api',
    description: 'Connect to custom APIs with flexible configuration options.',
    iconUrl: '/logos/api.png',
    status: 'disconnected',
    setupSteps: [
      'Configure API endpoint details',
      'Set up authentication method',
      'Define data mapping',
      'Test and validate'
    ],
    features: [
      'REST API Support', 'GraphQL Support', 'Custom Headers', 'OAuth', 'API Key Auth', 'JSON Transformation'
    ],
    syncFrequency: 'hourly'
  },
  {
    id: 'sage',
    name: 'Sage',
    type: 'sage',
    description: 'Import financial and accounting data from Sage software.',
    iconUrl: '/logos/sage.png',
    status: 'disconnected',
    setupSteps: [
      'Register on Sage Developer Portal',
      'Configure OAuth settings',
      'Generate API credentials',
      'Authorize access'
    ],
    features: [
      'General Ledger', 'Accounts Payable', 'Accounts Receivable', 'Financial Reports'
    ],
    syncFrequency: 'daily'
  },
  {
    id: 'freshbooks',
    name: 'FreshBooks',
    type: 'freshbooks',
    description: 'Connect to FreshBooks accounting software.',
    iconUrl: '/logos/freshbooks.png',
    status: 'disconnected',
    setupSteps: [
      'Create an app in FreshBooks Developer portal',
      'Set up OAuth credentials',
      'Configure callback URLs',
      'Authorize connection'
    ],
    features: [
      'Invoices', 'Expenses', 'Time Tracking', 'Projects', 'Clients'
    ],
    syncFrequency: 'daily'
  }
];

// Mock connected sources with sample data
const mockConnectedSources: DataSource[] = [
  {
    id: 'quickbooks-connected',
    name: 'QuickBooks Online',
    type: 'quickbooks',
    description: 'Company: Acme Corporation',
    iconUrl: '/logos/quickbooks.png',
    status: 'connected',
    lastSyncedAt: new Date('2023-09-15T08:30:00'),
    syncFrequency: 'daily',
    connectionDetails: {
      company: 'Acme Corporation',
      account: 'finance@acmecorp.com',
      plan: 'Business Premium'
    }
  },
  {
    id: 'excel-csv-connected',
    name: 'Excel Import',
    type: 'excel',
    description: 'Monthly financial reports',
    iconUrl: '/logos/excel.png',
    status: 'connected',
    lastSyncedAt: new Date('2023-09-14T15:45:00'),
    syncFrequency: 'manual',
    connectionDetails: {
      templates: '3 templates configured',
      lastFile: 'Q3_financial_report.xlsx',
      mappedColumns: '24 columns mapped'
    }
  }
];

const DataSourceConnector: React.FC<DataSourceConnectorProps> = ({
  availableSources = defaultDataSources,
  connectedSources = mockConnectedSources,
  onConnect,
  onDisconnect,
  onTestConnection,
  onSyncNow
}) => {
  const [activeTab, setActiveTab] = useState('connected');
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [configStep, setConfigStep] = useState<number>(0);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get source type specific inputs
  const getSourceTypeInputs = (source: DataSource) => {
    switch (source.type) {
      case 'quickbooks':
      case 'xero':
      case 'sage':
      case 'freshbooks':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Client ID</Label>
                <Input 
                  id="client_id" 
                  placeholder="Your QuickBooks Client ID" 
                  value={credentials.client_id || ''}
                  onChange={(e) => setCredentials({...credentials, client_id: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_secret">Client Secret</Label>
                <Input 
                  id="client_secret" 
                  type="password"
                  placeholder="Your QuickBooks Client Secret" 
                  value={credentials.client_secret || ''}
                  onChange={(e) => setCredentials({...credentials, client_secret: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="redirect_url">Redirect URL (Set this in your developer portal)</Label>
                <div className="flex">
                  <Input 
                    id="redirect_url" 
                    value={`${window.location.origin}/api/auth/callback/${source.type}`} 
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button
                    variant="secondary"
                    className="rounded-l-none"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/api/auth/callback/${source.type}`);
                      toast({
                        title: "Copied to clipboard",
                        description: "The redirect URL has been copied to your clipboard."
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </>
        );
        
      case 'banking':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank_provider">Banking Provider</Label>
                <Select 
                  onValueChange={(value) => setCredentials({...credentials, bank_provider: value})}
                  value={credentials.bank_provider || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select banking provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plaid">Plaid</SelectItem>
                    <SelectItem value="teller">Teller</SelectItem>
                    <SelectItem value="nordigen">Nordigen (GoCardless)</SelectItem>
                    <SelectItem value="truelayer">TrueLayer</SelectItem>
                    <SelectItem value="yodlee">Yodlee</SelectItem>
                    <SelectItem value="custom">Custom Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {credentials.bank_provider && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input 
                      id="api_key" 
                      type="password"
                      placeholder="Your API Key" 
                      value={credentials.api_key || ''}
                      onChange={(e) => setCredentials({...credentials, api_key: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api_secret">API Secret</Label>
                    <Input 
                      id="api_secret" 
                      type="password"
                      placeholder="Your API Secret" 
                      value={credentials.api_secret || ''}
                      onChange={(e) => setCredentials({...credentials, api_secret: e.target.value})}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        );
        
      case 'api':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api_url">API Base URL</Label>
                <Input 
                  id="api_url" 
                  placeholder="https://api.example.com/v1" 
                  value={credentials.api_url || ''}
                  onChange={(e) => setCredentials({...credentials, api_url: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="auth_method">Authentication Method</Label>
                <Select 
                  onValueChange={(value) => setCredentials({...credentials, auth_method: value})}
                  value={credentials.auth_method || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select authentication method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="none">No Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {credentials.auth_method === 'api_key' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api_key_name">API Key Header Name</Label>
                    <Input 
                      id="api_key_name" 
                      placeholder="X-API-Key" 
                      value={credentials.api_key_name || ''}
                      onChange={(e) => setCredentials({...credentials, api_key_name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api_key_value">API Key Value</Label>
                    <Input 
                      id="api_key_value" 
                      type="password"
                      placeholder="Your API key" 
                      value={credentials.api_key_value || ''}
                      onChange={(e) => setCredentials({...credentials, api_key_value: e.target.value})}
                    />
                  </div>
                </>
              )}
              
              {credentials.auth_method === 'basic' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="Username" 
                      value={credentials.username || ''}
                      onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="Password" 
                      value={credentials.password || ''}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                  </div>
                </>
              )}
              
              {credentials.auth_method === 'bearer' && (
                <div className="space-y-2">
                  <Label htmlFor="token">Bearer Token</Label>
                  <Input 
                    id="token" 
                    type="password"
                    placeholder="Your Bearer Token" 
                    value={credentials.token || ''}
                    onChange={(e) => setCredentials({...credentials, token: e.target.value})}
                  />
                </div>
              )}
              
              {credentials.auth_method === 'oauth2' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="oauth_client_id">Client ID</Label>
                    <Input 
                      id="oauth_client_id" 
                      placeholder="OAuth Client ID" 
                      value={credentials.oauth_client_id || ''}
                      onChange={(e) => setCredentials({...credentials, oauth_client_id: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oauth_client_secret">Client Secret</Label>
                    <Input 
                      id="oauth_client_secret" 
                      type="password"
                      placeholder="OAuth Client Secret" 
                      value={credentials.oauth_client_secret || ''}
                      onChange={(e) => setCredentials({...credentials, oauth_client_secret: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oauth_auth_url">Authorization URL</Label>
                    <Input 
                      id="oauth_auth_url" 
                      placeholder="https://auth.example.com/oauth/authorize" 
                      value={credentials.oauth_auth_url || ''}
                      onChange={(e) => setCredentials({...credentials, oauth_auth_url: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oauth_token_url">Token URL</Label>
                    <Input 
                      id="oauth_token_url" 
                      placeholder="https://auth.example.com/oauth/token" 
                      value={credentials.oauth_token_url || ''}
                      onChange={(e) => setCredentials({...credentials, oauth_token_url: e.target.value})}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        );
        
      case 'excel':
      case 'csv':
        return (
          <>
            <div className="space-y-4">
              <div className="p-4 border-2 border-dashed rounded-md border-gray-300 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop files here or click to browse</p>
                <Button variant="secondary" className="mt-2">
                  Select Files
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>File Format Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_format" className="text-xs">Date Format</Label>
                    <Select defaultValue="mm/dd/yyyy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="delimiter" className="text-xs">CSV Delimiter</Label>
                    <Select defaultValue="comma">
                      <SelectTrigger>
                        <SelectValue placeholder="Select delimiter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comma">Comma (,)</SelectItem>
                        <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                        <SelectItem value="tab">Tab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="has_headers">File has header row</Label>
                  <Switch id="has_headers" defaultChecked />
                </div>
              </div>
            </div>
          </>
        );
        
      default:
        return (
          <div className="py-8 text-center text-muted-foreground">
            <p>Select a data source to view configuration options</p>
          </div>
        );
    }
  };
  
  // Handle connection
  const handleConnect = async () => {
    if (!selectedSource) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      if (onConnect) {
        const success = await onConnect(selectedSource, credentials);
        
        if (success) {
          toast({
            title: "Connection successful",
            description: `Successfully connected to ${selectedSource.name}.`,
          });
          
          setActiveTab('connected');
          setSelectedSource(null);
          setConfigStep(0);
          setCredentials({});
        } else {
          setConnectionError("Failed to connect. Please check your credentials and try again.");
        }
      } else {
        // Mock successful connection
        setTimeout(() => {
          toast({
            title: "Connection successful",
            description: `Successfully connected to ${selectedSource.name}.`,
          });
          
          setActiveTab('connected');
          setSelectedSource(null);
          setConfigStep(0);
          setCredentials({});
        }, 1500);
      }
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle disconnect
  const handleDisconnect = async (sourceId: string) => {
    try {
      if (onDisconnect) {
        const success = await onDisconnect(sourceId);
        
        if (success) {
          toast({
            title: "Disconnected",
            description: "The data source has been disconnected.",
          });
        }
      } else {
        // Mock successful disconnection
        toast({
          title: "Disconnected",
          description: "The data source has been disconnected.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect the data source.",
        variant: "destructive"
      });
    }
  };
  
  // Handle testing connection
  const handleTestConnection = async (sourceId: string) => {
    try {
      if (onTestConnection) {
        const success = await onTestConnection(sourceId);
        
        if (success) {
          toast({
            title: "Connection test successful",
            description: "The connection is working correctly.",
          });
        } else {
          toast({
            title: "Connection test failed",
            description: "Failed to connect to the data source.",
            variant: "destructive"
          });
        }
      } else {
        // Mock successful test
        toast({
          title: "Connection test successful",
          description: "The connection is working correctly.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test the connection.",
        variant: "destructive"
      });
    }
  };
  
  // Handle sync now
  const handleSyncNow = async (sourceId: string) => {
    try {
      if (onSyncNow) {
        const success = await onSyncNow(sourceId);
        
        if (success) {
          toast({
            title: "Sync started",
            description: "Data synchronization has started successfully.",
          });
        } else {
          toast({
            title: "Sync failed",
            description: "Failed to start data synchronization.",
            variant: "destructive"
          });
        }
      } else {
        // Mock successful sync
        toast({
          title: "Sync started",
          description: "Data synchronization has started successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync data.",
        variant: "destructive"
      });
    }
  };
  
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
  
  // Get status icon/badge
  const getStatusIcon = (status: DataConnectionStatus) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'configured':
        return <Badge className="bg-blue-100 text-blue-800">Configured</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800">Connecting</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'needs_authentication':
        return <Badge className="bg-purple-100 text-purple-800">Needs Authentication</Badge>;
      case 'disconnected':
      default:
        return <Badge variant="outline">Not Connected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {selectedSource ? (
        /* Configuration Form */
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Connect to {selectedSource.name}</CardTitle>
                <CardDescription className="mt-1">
                  {selectedSource.description}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSource(null);
                  setConfigStep(0);
                  setCredentials({});
                }}
              >
                Back to List
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {selectedSource.setupSteps && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 text-sm font-medium">
                      <span>Step {configStep + 1} of {selectedSource.setupSteps.length}</span>
                      <span className="text-muted-foreground">:</span>
                      <span>{selectedSource.setupSteps[configStep]}</span>
                    </div>
                    <div className="w-full h-2 bg-muted mt-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${((configStep + 1) / selectedSource.setupSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {connectionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}
            
            {getSourceTypeInputs(selectedSource)}
            
            {selectedSource.type !== 'excel' && selectedSource.type !== 'csv' && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sync_frequency">Sync Frequency</Label>
                  <Select 
                    defaultValue={selectedSource.syncFrequency || 'daily'}
                    onValueChange={(value) => setCredentials({...credentials, sync_frequency: value})}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedSource(null);
                setConfigStep(0);
                setCredentials({});
              }}
            >
              Cancel
            </Button>
            
            <div className="flex space-x-2">
              {selectedSource.setupSteps && configStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setConfigStep(step => Math.max(0, step - 1))}
                >
                  Previous
                </Button>
              )}
              
              {selectedSource.setupSteps && configStep < selectedSource.setupSteps.length - 1 ? (
                <Button
                  onClick={() => setConfigStep(step => step + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Connect
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        /* Data Source List */
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connected">
              Connected Sources
            </TabsTrigger>
            <TabsTrigger value="available">
              Available Sources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connected" className="mt-6">
            {connectedSources.length === 0 ? (
              <Card>
                <CardContent className="pt-6 pb-6 text-center">
                  <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Connected Data Sources</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't connected any data sources yet. Connect a data source to start importing financial data.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('available')}
                    className="mx-auto"
                  >
                    Browse Available Sources
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {connectedSources.map(source => (
                  <Card key={source.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 mr-4 bg-slate-100 rounded flex items-center justify-center">
                          <Database className="h-6 w-6 text-slate-600" />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{source.name}</h3>
                              <p className="text-sm text-muted-foreground">{source.description}</p>
                            </div>
                            <div>
                              {getStatusIcon(source.status)}
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {source.connectionDetails && Object.entries(source.connectionDetails).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{' '}
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 text-sm">
                            <span className="text-muted-foreground">Last synced:</span>{' '}
                            <span>{source.lastSyncedAt ? formatDate(source.lastSyncedAt) : 'Never'}</span>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSyncNow(source.id)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync Now
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestConnection(source.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Test Connection
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnect(source.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableSources.map(source => (
                <Card key={source.id} className="hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 mr-4 bg-slate-100 rounded flex items-center justify-center">
                        <Database className="h-6 w-6 text-slate-600" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium">{source.name}</h3>
                          {getStatusIcon(source.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1">{source.description}</p>
                        
                        {source.features && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {source.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {source.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{source.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <Button
                          className="mt-4"
                          onClick={() => {
                            setSelectedSource(source);
                            setConfigStep(0);
                            setCredentials({});
                          }}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DataSourceConnector;