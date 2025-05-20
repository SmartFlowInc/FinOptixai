import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Users,
  ArrowRight,
  BarChart,
  FileCheck,
  LayoutDashboard,
  PieChart,
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react";
import CollaborativeForecast from "@/components/forecasting/CollaborativeForecast";

const Forecasting = () => {
  const [activeTab, setActiveTab] = useState<string>("collaborative");

  // Stats for overview
  const [forecastStats, setForecastStats] = useState({
    activeForecasts: 3,
    accuracy: '94.2%',
    lastUpdate: '2 hours ago',
    collaborators: 8
  });
  
  // Animation effect for page elements
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('opacity-100', 'translate-y-0');
      }, 100 * index);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Premium header section with gradient background */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1829]/5 to-transparent -z-10"></div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 animate-in opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '100ms' }}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] text-white p-2 rounded-lg shadow-lg">
                  <LineChart className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold text-[#0F1829]">Financial Forecasting</h1>
              </div>
              <p className="text-[#4D8EC3]">
                Develop precise financial forecasts with AI-powered insights and collaborative planning
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                New Forecast
              </Button>
            </div>
          </div>
          
          {/* Stats overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '200ms' }}>
            <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Active Forecasts</p>
                    <h3 className="text-2xl font-bold text-[#0F1829]">{forecastStats.activeForecasts}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-[#2D71A8]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Forecast Accuracy</p>
                    <h3 className="text-2xl font-bold text-[#0F1829]">{forecastStats.accuracy}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Last Updated</p>
                    <h3 className="text-2xl font-bold text-[#0F1829]">{forecastStats.lastUpdate}</h3>
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
                    <p className="text-sm text-slate-500">Collaborators</p>
                    <h3 className="text-2xl font-bold text-[#0F1829]">{forecastStats.collaborators}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#2D71A8]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 animate-in opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: '300ms' }}>
        <TabsList className="bg-white rounded-xl shadow-md p-1 grid grid-cols-1 md:grid-cols-4 h-auto gap-2 border border-slate-100">
          <TabsTrigger value="collaborative" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D71A8]/10 data-[state=active]:to-blue-50 data-[state=active]:shadow-md rounded-lg flex items-center gap-3 h-16 p-4 transition-all">
            <div className="bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] rounded-lg p-2 flex-shrink-0 shadow-sm text-white">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-medium text-[#0F1829]">Collaborative Forecast</div>
              <div className="text-xs text-[#4D8EC3]">Multi-stakeholder input</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="driver-analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D71A8]/10 data-[state=active]:to-blue-50 data-[state=active]:shadow-md rounded-lg flex items-center gap-3 h-16 p-4 transition-all">
            <div className="bg-gradient-to-br from-[#256191] to-[#3A7AB5] rounded-lg p-2 flex-shrink-0 shadow-sm text-white">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-medium text-[#0F1829]">Driver Analysis</div>
              <div className="text-xs text-[#4D8EC3]">Growth drivers & impact</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="scenarios" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D71A8]/10 data-[state=active]:to-blue-50 data-[state=active]:shadow-md rounded-lg flex items-center gap-3 h-16 p-4 transition-all">
            <div className="bg-gradient-to-br from-[#1D5A8A] to-[#2D71A8] rounded-lg p-2 flex-shrink-0 shadow-sm text-white">
              <BarChart4 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-medium text-[#0F1829]">Scenario Analysis</div>
              <div className="text-xs text-[#4D8EC3]">What-if scenarios</div>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D71A8]/10 data-[state=active]:to-blue-50 data-[state=active]:shadow-md rounded-lg flex items-center gap-3 h-16 p-4 transition-all">
            <div className="bg-gradient-to-br from-[#4D8EC3] to-[#2D71A8] rounded-lg p-2 flex-shrink-0 shadow-sm text-white">
              <Settings className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="font-medium text-[#0F1829]">Settings</div>
              <div className="text-xs text-[#4D8EC3]">Forecast preferences</div>
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
        <TabsContent value="scenarios" className="animate-in opacity-0 translate-y-4 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-slate-100 shadow-md overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-[#1D5A8A] to-[#2D71A8]"></div>
                <CardHeader className="bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-[#0F1829] text-xl">Scenario Analysis</CardTitle>
                      <CardDescription className="text-[#4D8EC3]">
                        Create and compare multiple forecast scenarios
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Scenario
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-b from-slate-50 to-white p-8 rounded-lg text-center border border-slate-100">
                    <div className="mb-6 h-16 w-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                      <LineChart className="h-8 w-8 text-[#2D71A8]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-[#0F1829]">Advanced Scenario Analysis</h3>
                    <p className="text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                      Our advanced scenario analysis module is under development. It will allow you to create and
                      compare multiple what-if scenarios to inform strategic decisions with AI-powered forecasts.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50">
                        Learn More
                      </Button>
                      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                        Schedule Demo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="border border-slate-100 shadow-md h-full">
                <CardHeader>
                  <CardTitle className="text-[#0F1829] text-lg">Benefits</CardTitle>
                  <CardDescription className="text-[#4D8EC3]">
                    Why use scenario analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-[#2D71A8]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0F1829]">Risk Management</h4>
                        <p className="text-sm text-slate-500">Identify potential risks and prepare mitigation strategies</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-[#2D71A8]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0F1829]">Strategic Planning</h4>
                        <p className="text-sm text-slate-500">Make better-informed strategic decisions based on multiple futures</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-[#2D71A8]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0F1829]">Budget Optimization</h4>
                        <p className="text-sm text-slate-500">Allocate resources more effectively based on potential outcomes</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-[#2D71A8]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0F1829]">Stakeholder Alignment</h4>
                        <p className="text-sm text-slate-500">Achieve consensus by evaluating various perspectives</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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