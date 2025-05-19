import React, { useState } from "react";
import DataSourceManager from "@/components/data-integration/DataSourceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, CloudIcon, GitMergeIcon, Import, LineChart, PlusIcon, ServerIcon, Share, UploadCloud } from "lucide-react";

const DataIntegration = () => {
  const [activeTab, setActiveTab] = useState<string>("data-sources");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Integration</h1>
          <p className="text-neutral-600">
            Connect, import, and validate your financial data sources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Integrations
          </Button>
          <Button>
            <Import className="h-4 w-4 mr-2" />
            Import Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 h-auto gap-4">
          <TabsTrigger value="data-sources" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <ServerIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Data Sources</div>
              <div className="text-xs text-neutral-500">Manage connections and imports</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="api-integration" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <CloudIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">API Integration</div>
              <div className="text-xs text-neutral-500">Third-party connectors</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="workflow-automation" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <GitMergeIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Workflow Automation</div>
              <div className="text-xs text-neutral-500">Automate data processing</div>
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Data Sources Tab */}
        <TabsContent value="data-sources">
          <DataSourceManager />
        </TabsContent>
        
        {/* API Integration Tab */}
        <TabsContent value="api-integration">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>API Integration</CardTitle>
                  <CardDescription>
                    Connect to third-party services and APIs
                  </CardDescription>
                </div>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Connection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* API Integration partners */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Financial APIs</CardTitle>
                    <CardDescription>
                      Connect to financial data services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <LineChart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Bloomberg API</div>
                          <div className="text-xs text-neutral-500">Market data & analytics</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                          <LineChart className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Refinitiv API</div>
                          <div className="text-xs text-neutral-500">Financial market data</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                          <LineChart className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">S&P Capital IQ</div>
                          <div className="text-xs text-neutral-500">Company & industry data</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">ERP Connectors</CardTitle>
                    <CardDescription>
                      Connect to enterprise systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <ServerIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">SAP Connector</div>
                          <div className="text-xs text-neutral-500">SAP ERP integration</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                          <ServerIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">Oracle ERP</div>
                          <div className="text-xs text-neutral-500">Oracle Cloud ERP</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
                          <ServerIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium">Microsoft Dynamics</div>
                          <div className="text-xs text-neutral-500">Dynamics 365 F&O</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cloud Storage</CardTitle>
                    <CardDescription>
                      Connect to cloud storage services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <CloudIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Google Drive</div>
                          <div className="text-xs text-neutral-500">Files & spreadsheets</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-sky-100 flex items-center justify-center">
                          <CloudIcon className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                          <div className="font-medium">Dropbox</div>
                          <div className="text-xs text-neutral-500">File storage</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center">
                          <CloudIcon className="h-5 w-5 text-neutral-600" />
                        </div>
                        <div>
                          <div className="font-medium">OneDrive</div>
                          <div className="text-xs text-neutral-500">Microsoft 365 files</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Connect
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Workflow Automation Tab */}
        <TabsContent value="workflow-automation">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Workflow Automation</CardTitle>
                  <CardDescription>
                    Create automated data processing workflows
                  </CardDescription>
                </div>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle>Month-End Process</CardTitle>
                    <CardDescription>
                      Automated month-end financial data processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Status</div>
                        <div className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Active</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Frequency</div>
                        <div>Monthly</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Next Run</div>
                        <div>May 31, 2025</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Steps</div>
                        <div>8 steps</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle>Daily Reconciliation</CardTitle>
                    <CardDescription>
                      Daily financial data reconciliation workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Status</div>
                        <div className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Active</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Frequency</div>
                        <div>Daily</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Next Run</div>
                        <div>May 20, 2025</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Steps</div>
                        <div>5 steps</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border">
                  <CardHeader className="pb-3">
                    <CardTitle>Forecast Preparation</CardTitle>
                    <CardDescription>
                      Weekly forecast data preparation workflow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Status</div>
                        <div className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Active</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Frequency</div>
                        <div>Weekly</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Next Run</div>
                        <div>May 23, 2025</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">Steps</div>
                        <div>6 steps</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card className="border">
                  <CardHeader>
                    <CardTitle>Ready-to-Use Templates</CardTitle>
                    <CardDescription>
                      Start with pre-built workflow templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <UploadCloud className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="font-medium">Data Import</div>
                        </div>
                        <div className="text-sm text-neutral-500">
                          Import, validate, and process data from external sources
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <GitMergeIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="font-medium">Data Transformation</div>
                        </div>
                        <div className="text-sm text-neutral-500">
                          Transform and enrich data for analysis and reporting
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 hover:bg-neutral-50 cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Share className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="font-medium">Data Distribution</div>
                        </div>
                        <div className="text-sm text-neutral-500">
                          Package and distribute data to downstream systems
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataIntegration;