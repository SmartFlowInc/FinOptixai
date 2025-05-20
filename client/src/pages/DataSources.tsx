import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { 
  Link, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  Settings, 
  Database, 
  Key, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Cloud, 
  FileSpreadsheet,
  LucideIcon,
  Shield,
  BarChart,
  ArrowRight,
  Zap,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const DataSources = () => {
  const [syncStatus, setSyncStatus] = useState<Record<string, boolean>>({
    "erp": true,
    "crm": true,
    "accounting": false,
    "banking": true,
    "spreadsheets": true
  });
  
  const { toast } = useToast();
  
  const handleSyncToggle = (source: string) => {
    setSyncStatus(prev => {
      const newStatus = { ...prev, [source]: !prev[source] };
      
      if (newStatus[source]) {
        toast({
          title: "Sync Enabled",
          description: `Data synchronization for ${source.toUpperCase()} has been enabled.`,
        });
      } else {
        toast({
          title: "Sync Disabled",
          description: `Data synchronization for ${source.toUpperCase()} has been paused.`,
        });
      }
      
      return newStatus;
    });
  };
  
  const handleRefreshData = (source: string) => {
    toast({
      title: "Sync Started",
      description: `Manually syncing data from ${source.toUpperCase()}. This may take a few minutes.`,
    });
  };
  
  // Stats for the overview cards
  const [stats, setStats] = useState({
    activeSources: 4,
    totalSources: 5,
    dataSynced: '4.17 GB',
    lastSync: '30 min ago',
    syncRate: 95
  });
  
  // Add animation effect when page loads
  useEffect(() => {
    const cards = document.querySelectorAll('.datasource-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('card-visible');
      }, 100 * index);
    });
  }, []);
  
  return (
    <>
      {/* Header section with premium styling */}
      <div className="relative mb-10">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0F1829]">Data Sources</h2>
            <p className="text-[#4D8EC3] mt-1">Centralize and manage your financial data connections</p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
              <Cloud className="mr-2 h-4 w-4" />
              View Data Catalog
            </Button>
            <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Connect New Source
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 -mt-4 mb-8">
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active Sources</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-[#0F1829]">{stats.activeSources}</h3>
                    <p className="text-sm text-slate-400">of {stats.totalSources}</p>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Database className="h-5 w-5 text-[#2D71A8]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Data Synced</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-[#0F1829]">{stats.dataSynced}</h3>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Last Sync</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-[#0F1829]">{stats.lastSync}</h3>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#2D71A8]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Sync Success Rate</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-[#0F1829]">{stats.syncRate}%</h3>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="integrations" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="integrations" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Database className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="imports" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <ArrowRight className="h-4 w-4 mr-2" />
            Data Imports
          </TabsTrigger>
          <TabsTrigger value="exports" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Data Exports
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Key className="h-4 w-4 mr-2" />
            API Access
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ERP System - Enhanced Card */}
            <Card className="datasource-card border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden opacity-0 transition-opacity duration-300 ease-in-out">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3]"></div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-md">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0F1829]">ERP System</CardTitle>
                      <CardDescription className="text-[#4D8EC3]">SAP Integration</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${
                    syncStatus["erp"]
                      ? "bg-green-50 text-green-700 hover:bg-green-50"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                  }`}>
                    {syncStatus["erp"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-2">
                <div className="flex flex-col gap-3">
                  {/* Stats with enhanced styling */}
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-600">Last sync</span>
                      <span className="text-sm text-slate-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-[#2D71A8]" />
                        30 min ago
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-600">Status</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-slate-600">Healthy</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Data size</span>
                      <span className="text-sm text-slate-600">1.2 GB</span>
                    </div>
                  </div>
                  
                  {/* Sync Progress with enhanced styling */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Sync Progress</span>
                      <span className="text-xs text-green-600 font-medium">Complete</span>
                    </div>
                    <Progress value={100} className="h-1.5 bg-slate-100" 
                      style={{ 
                        backgroundImage: 'linear-gradient(to right, #2D71A8, #4D8EC3)'
                      }} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={syncStatus["erp"]} 
                    onCheckedChange={() => handleSyncToggle("erp")} 
                    className="data-[state=checked]:bg-[#2D71A8]"
                  />
                  <span className="text-sm font-medium text-slate-600">Auto-sync</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshData("erp")}
                    className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconWrapper variant="secondary">
                      <i className="ri-customer-service-2-line"></i>
                    </IconWrapper>
                    <div>
                      <CardTitle>CRM</CardTitle>
                      <CardDescription>Salesforce Integration</CardDescription>
                    </div>
                  </div>
                  <Badge variant={syncStatus["crm"] ? "default" : "outline"}>
                    {syncStatus["crm"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-2">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Last sync</span>
                      <span className="text-sm text-neutral-400">1 hour ago</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Status</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                        <span className="text-sm text-neutral-400">Healthy</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Data size</span>
                      <span className="text-sm text-neutral-400">850 MB</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-500">Sync Progress</span>
                      <span className="text-xs text-neutral-400">100%</span>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={syncStatus["crm"]} 
                    onCheckedChange={() => handleSyncToggle("crm")} 
                  />
                  <span className="text-sm">Auto-sync</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRefreshData("crm")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconWrapper variant="accent">
                      <i className="ri-book-read-line"></i>
                    </IconWrapper>
                    <div>
                      <CardTitle>Accounting</CardTitle>
                      <CardDescription>QuickBooks Integration</CardDescription>
                    </div>
                  </div>
                  <Badge variant={syncStatus["accounting"] ? "default" : "outline"}>
                    {syncStatus["accounting"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-2">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Last sync</span>
                      <span className="text-sm text-neutral-400">2 days ago</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Status</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-warning"></div>
                        <span className="text-sm text-neutral-400">Auth needed</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Data size</span>
                      <span className="text-sm text-neutral-400">1.5 GB</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-500">Sync Progress</span>
                      <span className="text-xs text-neutral-400">0%</span>
                    </div>
                    <Progress value={0} className="h-1" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={syncStatus["accounting"]} 
                    onCheckedChange={() => handleSyncToggle("accounting")} 
                  />
                  <span className="text-sm">Auto-sync</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRefreshData("accounting")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconWrapper variant="warning">
                      <i className="ri-bank-line"></i>
                    </IconWrapper>
                    <div>
                      <CardTitle>Banking</CardTitle>
                      <CardDescription>Plaid Integration</CardDescription>
                    </div>
                  </div>
                  <Badge variant={syncStatus["banking"] ? "default" : "outline"}>
                    {syncStatus["banking"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-2">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Last sync</span>
                      <span className="text-sm text-neutral-400">12 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Status</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                        <span className="text-sm text-neutral-400">Healthy</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Data size</span>
                      <span className="text-sm text-neutral-400">620 MB</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-500">Sync Progress</span>
                      <span className="text-xs text-neutral-400">100%</span>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={syncStatus["banking"]} 
                    onCheckedChange={() => handleSyncToggle("banking")} 
                  />
                  <span className="text-sm">Auto-sync</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRefreshData("banking")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconWrapper variant="primary">
                      <i className="ri-file-excel-2-line"></i>
                    </IconWrapper>
                    <div>
                      <CardTitle>Spreadsheets</CardTitle>
                      <CardDescription>Google Sheets Integration</CardDescription>
                    </div>
                  </div>
                  <Badge variant={syncStatus["spreadsheets"] ? "default" : "outline"}>
                    {syncStatus["spreadsheets"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-2">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Last sync</span>
                      <span className="text-sm text-neutral-400">3 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-500">Status</span>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                        <span className="text-sm text-neutral-400">Healthy</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500">Data size</span>
                      <span className="text-sm text-neutral-400">320 MB</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-500">Sync Progress</span>
                      <span className="text-xs text-neutral-400">100%</span>
                    </div>
                    <Progress value={100} className="h-1" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={syncStatus["spreadsheets"]} 
                    onCheckedChange={() => handleSyncToggle("spreadsheets")} 
                  />
                  <span className="text-sm">Auto-sync</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRefreshData("spreadsheets")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center p-10 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="text-base font-medium text-neutral-500">Connect New Data Source</p>
              <p className="text-sm text-neutral-400 mt-1">Add another integration</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="imports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Imports</CardTitle>
              <CardDescription>
                Import data from external sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-neutral-200 rounded-lg">
                  <Database className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Import financial data</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Drag and drop files here or click to browse and select files to import.
                    Supported formats: CSV, XLSX, JSON.
                  </p>
                  <Button>
                    Select Files to Import
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">Recent Imports</h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex gap-3 items-center">
                        <i className="ri-file-excel-2-line text-xl text-accent"></i>
                        <div>
                          <p className="text-sm font-medium">Sales_data_Q3_2023.xlsx</p>
                          <p className="text-xs text-neutral-400">Imported Oct 15, 2023 • 5.2 MB</p>
                        </div>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex gap-3 items-center">
                        <i className="ri-file-text-line text-xl text-primary"></i>
                        <div>
                          <p className="text-sm font-medium">expense_data_2023.csv</p>
                          <p className="text-xs text-neutral-400">Imported Oct 10, 2023 • 3.1 MB</p>
                        </div>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex gap-3 items-center">
                        <i className="ri-file-text-line text-xl text-warning"></i>
                        <div>
                          <p className="text-sm font-medium">budget_projections.csv</p>
                          <p className="text-xs text-neutral-400">Imported Oct 5, 2023 • 2.8 MB</p>
                        </div>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Exports</CardTitle>
              <CardDescription>
                Export your financial data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Financial Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-400 mb-4">
                        Export all financial data including budgets, forecasts, and actuals.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-file-excel-2-line mr-2"></i>
                          Excel (.xlsx)
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-file-text-line mr-2"></i>
                          CSV (.csv)
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-file-pdf-line mr-2"></i>
                          PDF (.pdf)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-400 mb-4">
                        Export generated financial reports and analyses.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-file-pdf-line mr-2"></i>
                          PDF (.pdf)
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-file-excel-2-line mr-2"></i>
                          Excel (.xlsx)
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-image-line mr-2"></i>
                          PNG (.png)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Dashboards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-400 mb-4">
                        Export dashboards and visualizations.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-file-pdf-line mr-2"></i>
                          PDF (.pdf)
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-image-line mr-2"></i>
                          PNG (.png)
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <i className="ri-file-ppt-2-line mr-2"></i>
                          PPT (.pptx)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Scheduled Exports</CardTitle>
                    <CardDescription>Automate your data exports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No scheduled exports</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-4">
                          Set up automated exports to regularly send financial data to your team.
                        </p>
                        <Button>
                          Schedule New Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys and access for integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">API Access is in Beta</h4>
                    <p className="text-sm text-neutral-500">
                      The API access feature is currently in beta. Documentation and additional
                      features will be added soon. For urgent integrations, please contact support.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">API Keys</h3>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">Production Key</CardTitle>
                          <CardDescription>Use for production environments</CardDescription>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg">
                        <Key className="h-4 w-4 text-neutral-400" />
                        <div className="flex-1 font-mono text-sm bg-neutral-100 p-2 rounded">
                          ••••••••••••••••••••••••••••••
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <i className="ri-eye-line"></i>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <i className="ri-clipboard-line"></i>
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-neutral-400">
                          Created: Oct 1, 2023
                        </div>
                        <Button variant="outline" size="sm">
                          Regenerate Key
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">Development Key</CardTitle>
                          <CardDescription>Use for testing purposes only</CardDescription>
                        </div>
                        <Badge variant="outline">Inactive</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Development Key
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">Documentation</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="flex flex-col justify-between">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">API Guides</CardTitle>
                        <CardDescription>Getting started with our API</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-neutral-400 mb-4">
                          Learn how to authenticate and use our API endpoints.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Documentation
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="flex flex-col justify-between">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">API Reference</CardTitle>
                        <CardDescription>Complete endpoint reference</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-neutral-400 mb-4">
                          Detailed documentation of all available API endpoints.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Reference
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="flex flex-col justify-between">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Code Samples</CardTitle>
                        <CardDescription>Implementation examples</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-neutral-400 mb-4">
                          Sample code for common API use cases in various languages.
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Code Samples
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DataSources;
