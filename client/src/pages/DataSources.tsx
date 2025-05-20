import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
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
  BarChart,
  ArrowRight,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";

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
    // Add animation to elements with the animate-in class
    const animateElements = document.querySelectorAll('.animate-in');
    animateElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('show');
      }, 100 * index);
    });

    // Add animation to card elements
    const cards = document.querySelectorAll('.datasource-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('card-visible');
      }, 100 * index);
    });
  }, []);
  
  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Cloud className="mr-2 h-4 w-4" />
        View Data Catalog
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        Connect New Source
      </Button>
    </>
  );
  
  // Define stats for the premium header
  const headerStats = [
    {
      title: "Active Sources",
      value: stats.activeSources + " of " + stats.totalSources,
      icon: <Database className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Total Data Synced",
      value: stats.dataSynced,
      icon: <BarChart className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Last Sync",
      value: stats.lastSync,
      icon: <Clock className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Sync Success Rate",
      value: stats.syncRate + "%",
      icon: <CheckCircle className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-green-500"
    }
  ];

  return (
    <>
      {/* Use our reusable premium header component */}
      <PremiumPageHeader
        title="Data Sources"
        description="Centralize and manage your financial data connections"
        icon={<Database className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />
      
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
            <PremiumCard
              className="datasource-card hover-lift overflow-hidden"
              showAccent={true}
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              headerContent={
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
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                    {syncStatus["erp"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              }
              footer={
                <div className="flex justify-between w-full pt-4">
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
                </div>
              }
            >
              <div className="flex flex-col gap-3">
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
                      <div className="status-indicator status-healthy"></div>
                      <span className="text-sm text-slate-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Data size</span>
                    <span className="text-sm text-slate-600">1.2 GB</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Sync Progress</span>
                    <span className="text-xs text-green-600 font-medium">Complete</span>
                  </div>
                  <Progress value={100} className="h-1.5 bg-slate-100" />
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard
              className="datasource-card hover-lift overflow-hidden"
              showAccent={true}
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              headerContent={
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#3E7EAF] to-[#5996C9] flex items-center justify-center text-white shadow-md">
                      <BarChart className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0F1829]">CRM</CardTitle>
                      <CardDescription className="text-[#4D8EC3]">Salesforce Integration</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                    {syncStatus["crm"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              }
              footer={
                <div className="flex justify-between w-full pt-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={syncStatus["crm"]} 
                      onCheckedChange={() => handleSyncToggle("crm")} 
                      className="data-[state=checked]:bg-[#2D71A8]"
                    />
                    <span className="text-sm font-medium text-slate-600">Auto-sync</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefreshData("crm")}
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
                </div>
              }
            >
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-600">Last sync</span>
                    <span className="text-sm text-slate-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-[#2D71A8]" />
                      1 hour ago
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-600">Status</span>
                    <div className="flex items-center gap-1">
                      <div className="status-indicator status-healthy"></div>
                      <span className="text-sm text-slate-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Data size</span>
                    <span className="text-sm text-slate-600">850 MB</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Sync Progress</span>
                    <span className="text-xs text-green-600 font-medium">Complete</span>
                  </div>
                  <Progress value={100} className="h-1.5 bg-slate-100" />
                </div>
              </div>
            </PremiumCard>
            
            <PremiumCard
              className="datasource-card hover-lift overflow-hidden"
              showAccent={true}
              accentColor="from-[#F59E0B] to-[#FBBF24]"
              headerContent={
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-white shadow-md">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0F1829]">Accounting</CardTitle>
                      <CardDescription className="text-[#F59E0B]">QuickBooks Integration</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">
                    {syncStatus["accounting"] ? "Active" : "Inactive"}
                  </Badge>
                </div>
              }
              footer={
                <div className="flex justify-between w-full pt-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={syncStatus["accounting"]} 
                      onCheckedChange={() => handleSyncToggle("accounting")} 
                      className="data-[state=checked]:bg-[#F59E0B]"
                    />
                    <span className="text-sm font-medium text-slate-600">Auto-sync</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefreshData("accounting")}
                      className="border-[#F59E0B] text-[#F59E0B] hover:bg-amber-50"
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
                </div>
              }
            >
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-600">Last sync</span>
                    <span className="text-sm text-slate-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-[#F59E0B]" />
                      2 days ago
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-600">Status</span>
                    <div className="flex items-center gap-1">
                      <div className="status-indicator status-warning"></div>
                      <span className="text-sm text-slate-600">Auth needed</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Data size</span>
                    <span className="text-sm text-slate-600">1.5 GB</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Sync Progress</span>
                    <span className="text-xs text-amber-600 font-medium">Paused</span>
                  </div>
                  <Progress value={0} className="h-1.5 bg-slate-100" />
                </div>
              </div>
            </PremiumCard>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-10 hover:border-blue-400 transition-colors cursor-pointer hover-lift">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-[#2D71A8]" />
              </div>
              <p className="text-base font-medium text-slate-700">Connect New Data Source</p>
              <p className="text-sm text-slate-500 mt-1">Add another integration</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="imports" className="mt-4">
          <PremiumCard
            title="Data Imports"
            description="Import data from external sources"
            showAccent={true}
          >
            <div className="p-6 text-center">
              <div className="mb-6 h-16 w-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-[#2D71A8]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#0F1829]">Set Up Your First Import</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                Import data from spreadsheets, CSV files, or other financial systems to keep your financial records up-to-date.
              </p>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Start Import
              </Button>
            </div>
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="exports" className="mt-4">
          <PremiumCard
            title="Data Exports"
            description="Export data to external formats"
            showAccent={true}
          >
            <div className="p-6 text-center">
              <div className="mb-6 h-16 w-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                <FileSpreadsheet className="h-8 w-8 text-[#2D71A8]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#0F1829]">Export Your Financial Data</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                Export your financial data to various formats including Excel, CSV, and PDF for reporting and analysis.
              </p>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                <ArrowRight className="h-4 w-4 mr-2" />
                Configure Export
              </Button>
            </div>
          </PremiumCard>
        </TabsContent>
        
        <TabsContent value="api" className="mt-4">
          <PremiumCard
            title="API Access"
            description="Integrate with our platform"
            showAccent={true}
          >
            <div className="p-6 text-center">
              <div className="mb-6 h-16 w-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                <Key className="h-8 w-8 text-[#2D71A8]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#0F1829]">API Documentation</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                Access our comprehensive API documentation to integrate your applications with our financial platform.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
                  Generate API Key
                </Button>
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                  View Documentation
                </Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DataSources;