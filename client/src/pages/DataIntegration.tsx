import React, { useState } from "react";
import DataSourceManager from "@/components/data-integration/DataSourceManager";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Database,
  CloudIcon, 
  GitMergeIcon, 
  Import, 
  LineChart, 
  Plus, 
  ServerIcon, 
  Share, 
  UploadCloud,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Download,
  Search,
  Filter,
  Clock,
  Calendar,
  FileText,
  Link,
  Layers,
  Zap,
  HelpCircle,
  Save,
  PlayCircle,
  PauseCircle,
  File,
  ArrowUpDown,
  ArrowRight,
  BarChart
} from "lucide-react";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const DataIntegration = () => {
  const [activeTab, setActiveTab] = useState<string>("data-sources");
  
  // Sample stats for the premium header
  const headerStats = [
    {
      title: "Active Connections",
      value: "8",
      icon: <Database className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Data Sync Status",
      value: "Healthy",
      icon: <CheckCircle className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Last Sync",
      value: "10 mins ago",
      icon: <Clock className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      title: "Records Processed",
      value: "2.8M",
      icon: <FileText className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Share className="mr-2 h-4 w-4" />
        Integrations
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Import className="mr-2 h-4 w-4" />
        Import Data
      </Button>
    </>
  );

  // Sample connectors data
  const connectors = [
    {
      id: 1,
      name: "ERP System",
      type: "SQL Database",
      status: "connected",
      lastSync: "10 mins ago",
      nextSync: "50 mins",
      dataVolume: "1.2M records",
      syncFrequency: "hourly",
      health: 100
    },
    {
      id: 2,
      name: "CRM Platform",
      type: "API",
      status: "connected",
      lastSync: "35 mins ago",
      nextSync: "25 mins",
      dataVolume: "450K records",
      syncFrequency: "hourly",
      health: 100
    },
    {
      id: 3,
      name: "Banking System",
      type: "Direct Connection",
      status: "connected",
      lastSync: "2 hours ago",
      nextSync: "4 hours",
      dataVolume: "820K records",
      syncFrequency: "6 hours",
      health: 100
    },
    {
      id: 4,
      name: "Expense Management",
      type: "API",
      status: "issue",
      lastSync: "Failed (3 hrs ago)",
      nextSync: "Retry in 15 mins",
      dataVolume: "230K records",
      syncFrequency: "4 hours",
      health: 40,
      error: "API Rate Limit Exceeded"
    }
  ];

  // Sample data flows
  const dataFlows = [
    {
      id: 1,
      name: "Financial Statement ETL",
      description: "Extract, transform and load financial statement data",
      status: "active",
      lastRun: "15 mins ago",
      nextRun: "45 mins",
      sourceSystem: "ERP System",
      destination: "Financial Data Warehouse",
      recordsProcessed: "124,560",
      transformations: 12,
      schedule: "Hourly"
    },
    {
      id: 2,
      name: "Customer Revenue Analysis",
      description: "Sync and analyze customer revenue data from CRM",
      status: "active",
      lastRun: "35 mins ago",
      nextRun: "25 mins",
      sourceSystem: "CRM Platform",
      destination: "Analytics Database",
      recordsProcessed: "85,230",
      transformations: 8,
      schedule: "Hourly"
    },
    {
      id: 3,
      name: "Banking Transaction Import",
      description: "Import and categorize banking transactions",
      status: "active",
      lastRun: "2 hours ago",
      nextRun: "4 hours",
      sourceSystem: "Banking System",
      destination: "Financial Database",
      recordsProcessed: "45,120",
      transformations: 6,
      schedule: "6 Hours"
    },
    {
      id: 4,
      name: "Expense Report Processing",
      description: "Process and categorize expense reports",
      status: "paused",
      lastRun: "2 days ago",
      nextRun: "Manual activation required",
      sourceSystem: "Expense Management",
      destination: "Financial Database",
      recordsProcessed: "0",
      transformations: 9,
      schedule: "Manual"
    }
  ];

  // Sample APIs
  const apis = [
    {
      id: 1,
      name: "ERP System API",
      provider: "Internal",
      status: "active",
      endpoints: 28,
      usageLimit: "10,000 requests/hour",
      currentUsage: "2,450 requests",
      lastUpdated: "2 days ago",
      apiKey: "Yes (Secure)"
    },
    {
      id: 2,
      name: "CRM Platform API",
      provider: "SalesForce",
      status: "active",
      endpoints: 42,
      usageLimit: "100,000 requests/day",
      currentUsage: "24,680 requests",
      lastUpdated: "1 day ago",
      apiKey: "Yes (Secure)"
    },
    {
      id: 3,
      name: "Banking API",
      provider: "Financial Data Corp",
      status: "active",
      endpoints: 16,
      usageLimit: "5,000 requests/hour",
      currentUsage: "1,250 requests",
      lastUpdated: "3 days ago",
      apiKey: "Yes (Secure)"
    },
    {
      id: 4,
      name: "Expense Management API",
      provider: "ExpenseTrack",
      status: "issue",
      endpoints: 12,
      usageLimit: "20,000 requests/day",
      currentUsage: "20,000 requests (Limit reached)",
      lastUpdated: "3 hours ago",
      apiKey: "Yes (Secure)",
      error: "Rate limit exceeded"
    }
  ];

  // Sample data transformations
  const transformations = [
    {
      id: 1,
      name: "Currency Conversion",
      type: "mathematical",
      appliedTo: ["Financial Statement ETL", "Banking Transaction Import"],
      status: "active",
      complexity: "medium",
      lastModified: "5 days ago"
    },
    {
      id: 2,
      name: "Account Reconciliation",
      type: "matching",
      appliedTo: ["Banking Transaction Import"],
      status: "active",
      complexity: "high",
      lastModified: "3 days ago"
    },
    {
      id: 3,
      name: "Revenue Classification",
      type: "categorization",
      appliedTo: ["Customer Revenue Analysis", "Financial Statement ETL"],
      status: "active",
      complexity: "medium",
      lastModified: "7 days ago"
    },
    {
      id: 4,
      name: "Expense Categorization",
      type: "categorization",
      appliedTo: ["Expense Report Processing"],
      status: "active",
      complexity: "medium",
      lastModified: "10 days ago"
    }
  ];

  // Helper function to render status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <Badge className="bg-green-50 text-green-700">Active</Badge>;
      case 'issue':
        return <Badge className="bg-red-50 text-red-700">Issue</Badge>;
      case 'paused':
        return <Badge className="bg-amber-50 text-amber-700">Paused</Badge>;
      case 'pending':
        return <Badge className="bg-blue-50 text-blue-700">Pending</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  return (
    <>
      <PremiumPageHeader
        title="Data Integration"
        description="Connect, import, and validate your financial data sources"
        icon={<Database className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="data-sources" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <ServerIcon className="h-4 w-4 mr-2" />
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="data-flows" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <GitMergeIcon className="h-4 w-4 mr-2" />
            Data Flows
          </TabsTrigger>
          <TabsTrigger value="api-integration" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <CloudIcon className="h-4 w-4 mr-2" />
            API Integration
          </TabsTrigger>
          <TabsTrigger value="transformations" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Transformations
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>
        
        {/* Data Sources Tab */}
        <TabsContent value="data-sources" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search data sources..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Connection
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            {connectors.map((connector) => (
              <PremiumCard
                key={connector.id}
                className="hover-lift"
                showAccent={true}
                accentColor={
                  connector.status === 'connected' ? 'from-green-500 to-green-600' :
                  connector.status === 'issue' ? 'from-red-500 to-red-600' :
                  'from-blue-500 to-blue-600'
                }
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                        connector.type === 'SQL Database' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        connector.type === 'API' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                        'bg-gradient-to-br from-amber-500 to-amber-600'
                      } shadow-md`}>
                        {connector.type === 'SQL Database' ? <Database className="h-5 w-5" /> :
                         connector.type === 'API' ? <CloudIcon className="h-5 w-5" /> :
                         <Link className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{connector.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-slate-50">{connector.type}</Badge>
                          {getStatusBadge(connector.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                        <Settings className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs">Configure</span>
                      </Button>
                      {connector.status === 'connected' ? (
                        <Button variant="outline" size="sm" className="h-8">
                          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Sync Now</span>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600">
                          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Fix Issue</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Last Sync</div>
                      <div className="font-medium text-sm">
                        {connector.lastSync}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Next Sync</div>
                      <div className="font-medium text-sm">
                        {connector.nextSync}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Data Volume</div>
                      <div className="font-medium text-sm">
                        {connector.dataVolume}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Sync Frequency</div>
                      <div className="font-medium text-sm capitalize">
                        {connector.syncFrequency}
                      </div>
                    </div>
                  </div>
                  
                  {connector.status === 'issue' && (
                    <div className="p-3 bg-red-50 rounded-lg mb-4 border border-red-100">
                      <div className="text-sm font-medium text-red-700 mb-1">Error</div>
                      <div className="text-sm text-red-600">{connector.error}</div>
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-500">Connection Health</span>
                      <span className={`text-xs font-medium ${
                        connector.health === 100 ? 'text-green-600' : 
                        connector.health > 60 ? 'text-amber-600' : 
                        'text-red-600'
                      }`}>{connector.health}%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full ${
                      connector.health === 100 ? 'bg-green-100' : 
                      connector.health > 60 ? 'bg-amber-100' : 
                      'bg-red-100'
                    }`}>
                      <div 
                        className={`h-full rounded-full ${
                          connector.health === 100 ? 'bg-green-500' : 
                          connector.health > 60 ? 'bg-amber-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${connector.health}%` }}
                      />
                    </div>
                  </div>
                </div>
              </PremiumCard>
            ))}
            
            <PremiumCard className="hover-lift border-dashed border-2 border-slate-200 bg-slate-50/50 flex items-center justify-center h-[326px]">
              <div className="text-center p-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-[#2D71A8]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Add Data Source</h3>
                <p className="text-slate-500 mb-4">Connect a new financial data source to import data</p>
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  New Connection
                </Button>
              </div>
            </PremiumCard>
          </div>
          
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Connection Settings</h3>
                  <p className="text-sm text-slate-500">Default configuration for all data sources</p>
                </div>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="font-medium text-sm pb-2 border-b">Sync Settings</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Auto-Sync</div>
                      <div className="text-xs text-slate-500">Automatically sync data on schedule</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Default Frequency</div>
                      <div className="text-xs text-slate-500">How often to sync by default</div>
                    </div>
                    <Select defaultValue="hourly">
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15min">15 minutes</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Retry on Failure</div>
                      <div className="text-xs text-slate-500">Retry failed syncs automatically</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="font-medium text-sm pb-2 border-b">Alert Settings</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Email Alerts</div>
                      <div className="text-xs text-slate-500">Send email when sync fails</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">In-App Alerts</div>
                      <div className="text-xs text-slate-500">Show alerts in the app</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Alert Recipients</div>
                      <div className="text-xs text-slate-500">Who receives alerts</div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                      <span className="text-xs">Configure</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="font-medium text-sm pb-2 border-b">Data Settings</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Data Validation</div>
                      <div className="text-xs text-slate-500">Validate data before import</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Historical Data</div>
                      <div className="text-xs text-slate-500">Initial sync time range</div>
                    </div>
                    <Select defaultValue="12months">
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1 month</SelectItem>
                        <SelectItem value="3months">3 months</SelectItem>
                        <SelectItem value="6months">6 months</SelectItem>
                        <SelectItem value="12months">12 months</SelectItem>
                        <SelectItem value="all">All data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">Data Cleanup</div>
                      <div className="text-xs text-slate-500">Clean data during import</div>
                    </div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
        
        {/* Data Flows Tab */}
        <TabsContent value="data-flows" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search data flows..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Data Flow
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Flow Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Source → Destination</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Schedule</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Last Run</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Records</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataFlows.map((flow) => (
                      <tr key={flow.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{flow.name}</div>
                          <div className="text-xs text-slate-500">{flow.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <div className="text-sm">{flow.sourceSystem}</div>
                            <ArrowRight className="h-3 w-3 text-slate-400 mx-1" />
                            <div className="text-sm">{flow.destination}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" /> 
                            <span>{flow.schedule}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {flow.lastRun}
                          <div className="text-xs text-slate-500">Next: {flow.nextRun}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{flow.recordsProcessed}</td>
                        <td className="py-3 px-4">{getStatusBadge(flow.status)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {flow.status === 'active' ? (
                              <Button variant="outline" size="sm" className="h-8">
                                <PauseCircle className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs">Pause</span>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="h-8">
                                <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs">Resume</span>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                              <span className="text-xs">Run Now</span>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PremiumCard
              className="hover-lift"
              showAccent={true}
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              headerContent={
                <div>
                  <h3 className="text-lg font-semibold">Records Processed</h3>
                  <p className="text-sm text-slate-500">Last 7 days data flow volume</p>
                </div>
              }
            >
              <div className="p-6 pt-0">
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <BarChart className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-xs">Records Processed Chart</p>
                  </div>
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard
              className="hover-lift"
              showAccent={true}
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              headerContent={
                <div>
                  <h3 className="text-lg font-semibold">Flow Performance</h3>
                  <p className="text-sm text-slate-500">Processing time and success rate</p>
                </div>
              }
            >
              <div className="p-6 pt-0">
                <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <LineChart className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-xs">Flow Performance Chart</p>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </div>
        </TabsContent>
        
        {/* API Integration Tab */}
        <TabsContent value="api-integration" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search APIs..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Add API Connection
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {apis.map((api) => (
              <PremiumCard
                key={api.id}
                className="hover-lift"
                showAccent={true}
                accentColor={
                  api.status === 'active' ? 'from-green-500 to-green-600' :
                  api.status === 'issue' ? 'from-red-500 to-red-600' :
                  'from-blue-500 to-blue-600'
                }
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        <CloudIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{api.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-slate-50">{api.provider}</Badge>
                          {getStatusBadge(api.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                        <Settings className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs">Configure</span>
                      </Button>
                      {api.status === 'issue' && (
                        <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600">
                          <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Fix Issue</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Endpoints</div>
                      <div className="font-medium text-sm">
                        {api.endpoints} Available
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Authentication</div>
                      <div className="font-medium text-sm">
                        {api.apiKey}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Usage Limit</div>
                      <div className="font-medium text-sm">
                        {api.usageLimit}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Current Usage</div>
                      <div className={`font-medium text-sm ${
                        api.status === 'issue' ? 'text-red-600' : ''
                      }`}>
                        {api.currentUsage}
                      </div>
                    </div>
                  </div>
                  
                  {api.status === 'issue' && (
                    <div className="p-3 bg-red-50 rounded-lg mb-4 border border-red-100">
                      <div className="text-sm font-medium text-red-700 mb-1">Error</div>
                      <div className="text-sm text-red-600">{api.error}</div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-slate-500">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      Last updated: {api.lastUpdated}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[#2D71A8]">
                      <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Documentation</span>
                    </Button>
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
                <h3 className="text-lg font-semibold">API Usage</h3>
                <p className="text-sm text-slate-500">API requests over time</p>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <LineChart className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-xs">API Usage Chart</p>
                </div>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
        
        {/* Transformations Tab */}
        <TabsContent value="transformations" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search transformations..." className="pl-9 pr-4" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Transformation
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {transformations.map((transform) => (
              <PremiumCard
                key={transform.id}
                className="hover-lift"
                showAccent={false}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{transform.name}</h3>
                      <Badge 
                        variant="outline" 
                        className="bg-slate-50 mt-1 capitalize"
                      >
                        {transform.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Applied To</div>
                      <div className="space-y-1">
                        {transform.appliedTo.map((flow, idx) => (
                          <div key={idx} className="text-sm font-medium flex items-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></div>
                            {flow}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">Status</div>
                      <Badge className="bg-green-50 text-green-700">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">Complexity</div>
                      <Badge className={`
                        ${transform.complexity === 'high' ? 'bg-red-50 text-red-700' : 
                          transform.complexity === 'medium' ? 'bg-amber-50 text-amber-700' : 
                          'bg-green-50 text-green-700'}
                      `}>
                        {transform.complexity.charAt(0).toUpperCase() + transform.complexity.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">Last Modified</div>
                      <div className="text-sm">{transform.lastModified}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="h-8">
                      <Settings className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Configure</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                      <Zap className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Test</span>
                    </Button>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
          
          <PremiumCard className="hover-lift">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create Transformation</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Transformation Name</label>
                  <Input placeholder="Enter transformation name" />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transformation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematical">Mathematical</SelectItem>
                      <SelectItem value="matching">Matching</SelectItem>
                      <SelectItem value="categorization">Categorization</SelectItem>
                      <SelectItem value="aggregation">Aggregation</SelectItem>
                      <SelectItem value="formatting">Formatting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Apply To</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data flow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial-etl">Financial Statement ETL</SelectItem>
                      <SelectItem value="customer-revenue">Customer Revenue Analysis</SelectItem>
                      <SelectItem value="banking-import">Banking Transaction Import</SelectItem>
                      <SelectItem value="expense-processing">Expense Report Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Transformation Logic</label>
                  <Textarea placeholder="Enter transformation logic or formula" rows={5} />
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                    <Save className="mr-2 h-4 w-4" />
                    Create Transformation
                  </Button>
                </div>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
        
        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Integration Logs</h3>
                  <p className="text-sm text-slate-500">Recent activity and errors</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Log Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Refresh</span>
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Export</span>
                  </Button>
                </div>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-red-100 bg-red-50">
                  <div className="flex items-start">
                    <Badge className="bg-red-100 text-red-700 mr-3 mt-0.5">ERROR</Badge>
                    <div className="flex-1">
                      <div className="font-medium">API Rate Limit Exceeded - Expense Management</div>
                      <div className="text-sm text-slate-600 mt-1">
                        The API rate limit for the Expense Management system has been exceeded. Retry scheduled in 15 minutes.
                      </div>
                      <div className="text-xs text-slate-500 mt-2">Today at 2:15 PM</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-amber-100 bg-amber-50">
                  <div className="flex items-start">
                    <Badge className="bg-amber-100 text-amber-700 mr-3 mt-0.5">WARNING</Badge>
                    <div className="flex-1">
                      <div className="font-medium">Slow Performance Detected - ERP System</div>
                      <div className="text-sm text-slate-600 mt-1">
                        The ERP System data sync completed successfully but took longer than expected (45 seconds vs 25 second average).
                      </div>
                      <div className="text-xs text-slate-500 mt-2">Today at 1:30 PM</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-start">
                    <Badge className="bg-slate-200 text-slate-700 mr-3 mt-0.5">INFO</Badge>
                    <div className="flex-1">
                      <div className="font-medium">Data Sync Completed - CRM Platform</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Successfully synced 32,645 records from CRM Platform. Processing took 28 seconds.
                      </div>
                      <div className="text-xs text-slate-500 mt-2">Today at 12:45 PM</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div className="flex items-start">
                    <Badge className="bg-slate-200 text-slate-700 mr-3 mt-0.5">INFO</Badge>
                    <div className="flex-1">
                      <div className="font-medium">Data Flow Executed - Financial Statement ETL</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Successfully processed Financial Statement ETL data flow. 124,560 records processed with 0 errors.
                      </div>
                      <div className="text-xs text-slate-500 mt-2">Today at 12:15 PM</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-green-100 bg-green-50">
                  <div className="flex items-start">
                    <Badge className="bg-green-100 text-green-700 mr-3 mt-0.5">SUCCESS</Badge>
                    <div className="flex-1">
                      <div className="font-medium">New Connection Added - Banking System</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Successfully established new connection to Banking System. Initial data sync completed with 820K records.
                      </div>
                      <div className="text-xs text-slate-500 mt-2">Today at 10:30 AM</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Logs
              </Button>
            </div>
          </PremiumCard>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PremiumCard className="hover-lift">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Log Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">Success</div>
                      <div className="text-sm font-medium">82%</div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '82%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">Warnings</div>
                      <div className="text-sm font-medium">12%</div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: '12%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">Errors</div>
                      <div className="text-sm font-medium">6%</div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '6%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard className="hover-lift lg:col-span-2">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Log Settings</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">Log Retention</div>
                        <div className="text-xs text-slate-500">How long to keep logs</div>
                      </div>
                      <Select defaultValue="30days">
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7days">7 days</SelectItem>
                          <SelectItem value="30days">30 days</SelectItem>
                          <SelectItem value="90days">90 days</SelectItem>
                          <SelectItem value="1year">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">Detail Level</div>
                        <div className="text-xs text-slate-500">Level of log detail</div>
                      </div>
                      <Select defaultValue="standard">
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="verbose">Verbose</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">Error Alerts</div>
                        <div className="text-xs text-slate-500">Send alerts for errors</div>
                      </div>
                      <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                        <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">Auto-Export</div>
                        <div className="text-xs text-slate-500">Auto-export logs daily</div>
                      </div>
                      <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-slate-200">
                        <span className="absolute h-3 w-3 translate-x-1 rounded-full bg-white transition"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </PremiumCard>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Original component, hidden for now */}
      <div className="hidden">
        <DataSourceManager />
      </div>
    </>
  );
};

export default DataIntegration;