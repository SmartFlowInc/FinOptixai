import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart4,
  Clock,
  Download,
  Edit,
  FileText,
  Lightbulb,
  LineChart,
  ListChecks,
  Plus,
  Settings,
  TrendingUp,
  Users
} from "lucide-react";
import CollaborativeForecast from "@/components/forecasting/CollaborativeForecast";

const Forecasting = () => {
  const [activeTab, setActiveTab] = useState<string>("collaborative");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financial Forecasting</h1>
          <p className="text-neutral-600">
            Create and analyze financial forecasts with collaborative input
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Forecast
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto gap-4">
          <TabsTrigger value="collaborative" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Collaborative Forecast</div>
              <div className="text-xs text-neutral-500">Multi-stakeholder input</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="driver-analysis" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Driver Analysis</div>
              <div className="text-xs text-neutral-500">Growth drivers & impact</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="scenarios" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <BarChart4 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Scenario Analysis</div>
              <div className="text-xs text-neutral-500">What-if scenarios</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary/5 flex items-center gap-2 h-14">
            <div className="bg-primary/10 rounded-full p-1.5 flex-shrink-0">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Settings</div>
              <div className="text-xs text-neutral-500">Forecast preferences</div>
            </div>
          </TabsTrigger>
        </TabsList>
        
        {/* Collaborative Forecast Tab */}
        <TabsContent value="collaborative">
          <CollaborativeForecast />
        </TabsContent>
        
        {/* Driver Analysis Tab */}
        <TabsContent value="driver-analysis">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Driver Analysis</CardTitle>
                  <CardDescription>
                    Analyze growth drivers and their impact on financial projections
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-50 p-8 rounded-lg text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
                <h3 className="text-lg font-medium mb-2">Driver Analysis Coming Soon</h3>
                <p className="text-neutral-500 max-w-md mx-auto mb-4">
                  Our advanced driver analysis module is under development. It will help identify key growth 
                  drivers and quantify their impact on your forecasts.
                </p>
                <Button>
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Scenario Analysis Tab */}
        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Scenario Analysis</CardTitle>
                  <CardDescription>
                    Create and compare multiple forecast scenarios
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-50 p-8 rounded-lg text-center">
                <LineChart className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
                <h3 className="text-lg font-medium mb-2">Scenario Analysis Coming Soon</h3>
                <p className="text-neutral-500 max-w-md mx-auto mb-4">
                  Our advanced scenario analysis module is under development. It will allow you to create and
                  compare multiple what-if scenarios to inform strategic decisions.
                </p>
                <Button>
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Settings</CardTitle>
                  <CardDescription>Configure forecasting preferences and parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">General Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Default Forecast Period</div>
                            <div className="text-sm text-neutral-500">Choose default timeframe for new forecasts</div>
                          </div>
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button className="px-3 py-1 bg-primary text-white">Monthly</button>
                            <button className="px-3 py-1 hover:bg-neutral-100">Quarterly</button>
                            <button className="px-3 py-1 hover:bg-neutral-100">Annual</button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Default View</div>
                            <div className="text-sm text-neutral-500">Choose default view for forecast data</div>
                          </div>
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button className="px-3 py-1 bg-primary text-white">Grid</button>
                            <button className="px-3 py-1 hover:bg-neutral-100">Chart</button>
                            <button className="px-3 py-1 hover:bg-neutral-100">Summary</button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Automatic Calculations</div>
                            <div className="text-sm text-neutral-500">Auto-calculate totals and growth rates</div>
                          </div>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                            <div className="absolute h-4 w-4 rounded-full bg-white right-1"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Currency Display</div>
                            <div className="text-sm text-neutral-500">Choose default currency format</div>
                          </div>
                          <select className="border rounded px-2 py-1">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                            <option>JPY (¥)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Collaboration Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Comment Notifications</div>
                            <div className="text-sm text-neutral-500">Receive notifications for new comments</div>
                          </div>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                            <div className="absolute h-4 w-4 rounded-full bg-white right-1"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Change Notifications</div>
                            <div className="text-sm text-neutral-500">Receive notifications for forecast changes</div>
                          </div>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                            <div className="absolute h-4 w-4 rounded-full bg-white right-1"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Default Visibility</div>
                            <div className="text-sm text-neutral-500">Default visibility for new forecasts</div>
                          </div>
                          <select className="border rounded px-2 py-1">
                            <option>Team Only</option>
                            <option>Department</option>
                            <option>Company-wide</option>
                            <option>Private</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Advanced Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">AI-Powered Suggestions</div>
                            <div className="text-sm text-neutral-500">Enable AI assistance for forecasting</div>
                          </div>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                            <div className="absolute h-4 w-4 rounded-full bg-white right-1"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border p-3 rounded-lg">
                          <div>
                            <div className="font-medium">Forecast Version Control</div>
                            <div className="text-sm text-neutral-500">Enable detailed version history</div>
                          </div>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary">
                            <div className="absolute h-4 w-4 rounded-full bg-white right-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Category Management</CardTitle>
                  <CardDescription>Manage financial categories for forecasting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Active Categories</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Revenue</div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        10 subcategories
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Expenses</div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        15 subcategories
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Capital Expenditures</div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        5 subcategories
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Headcount</div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-neutral-500">
                        8 subcategories
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Forecast Accuracy</CardTitle>
                  <CardDescription>Track and improve forecast accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-center mb-4">
                    <Lightbulb className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-blue-700">
                      Track the accuracy of your forecasts against actuals to improve future forecasting.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Revenue Accuracy</div>
                        <div className="text-sm font-medium">92%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Expense Accuracy</div>
                        <div className="text-sm font-medium">89%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Headcount Accuracy</div>
                        <div className="text-sm font-medium">96%</div>
                      </div>
                      <div className="h-2 w-full bg-neutral-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forecasting;