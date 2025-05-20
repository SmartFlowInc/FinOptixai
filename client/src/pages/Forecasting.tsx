import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart4,
  Clock,
  Download,
  Pencil,
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
  ChevronRight,
  Repeat,
  Share2,
  RefreshCw,
  Save,
  CheckCircle,
  Gear,
  HelpCircle,
  BookMarked
} from "lucide-react";
import CollaborativeForecast from "@/components/forecasting/CollaborativeForecast";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";

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

  // Define header stats for the premium header
  const headerStats = [
    {
      title: "Active Forecasts",
      value: forecastStats.activeForecasts.toString(),
      icon: <LineChart className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Forecast Accuracy",
      value: forecastStats.accuracy,
      icon: <CheckCircle className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Last Update",
      value: forecastStats.lastUpdate,
      icon: <Clock className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Collaborators",
      value: forecastStats.collaborators.toString(),
      icon: <Users className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Settings className="mr-2 h-4 w-4" />
        Configure
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        New Forecast
      </Button>
    </>
  );

  const summaryData = [
    {
      title: "Revenue Growth",
      type: "growth",
      current: "$1.2M",
      predicted: "$1.45M",
      change: "+20.8%",
      accuracy: "96%",
      trend: "upward",
      timeframe: "Q3 2024"
    },
    {
      title: "Operating Expenses",
      type: "expense",
      current: "$820K",
      predicted: "$875K",
      change: "+6.7%",
      accuracy: "92%",
      trend: "stable",
      timeframe: "Q3 2024"
    },
    {
      title: "Profit Margin",
      type: "margin",
      current: "24.5%",
      predicted: "26.2%",
      change: "+1.7%",
      accuracy: "89%",
      trend: "upward",
      timeframe: "Q3 2024"
    }
  ];

  const models = [
    {
      id: 1,
      name: "Predictive Revenue Model",
      type: "Time Series",
      accuracy: "96.2%",
      lastRun: "Today at 09:15 AM",
      status: "active"
    },
    {
      id: 2,
      name: "Expense Forecast Model",
      type: "Regression",
      accuracy: "93.8%",
      lastRun: "Yesterday at 4:30 PM",
      status: "active"
    },
    {
      id: 3,
      name: "Cash Flow Prediction",
      type: "Time Series + ML",
      accuracy: "91.5%",
      lastRun: "Today at 08:00 AM",
      status: "active"
    },
    {
      id: 4,
      name: "Market Share Model",
      type: "Bayesian",
      accuracy: "87.3%",
      lastRun: "2 days ago",
      status: "inactive"
    }
  ];

  const scenarios = [
    {
      id: 1,
      name: "Conservative Growth",
      description: "Assumes slower market adoption and increased competition",
      probability: "35%",
      impact: "medium",
      variables: ["Market Growth -2%", "Churn +1.5%", "COGS +5%"]
    },
    {
      id: 2,
      name: "Expected Case",
      description: "Business as usual with current growth trajectory",
      probability: "50%",
      impact: "baseline",
      variables: ["Market Growth +5%", "Churn stable", "COGS stable"]
    },
    {
      id: 3,
      name: "Accelerated Expansion",
      description: "Assumes successful product launch and market penetration",
      probability: "15%",
      impact: "high",
      variables: ["Market Growth +12%", "Churn -1%", "COGS -3%"]
    }
  ];

  return (
    <>
      <PremiumPageHeader
        title="Financial Forecasting"
        description="Predict financial trends with AI-powered models"
        icon={<LineChart className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />

      <Tabs defaultValue="dashboard" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="collaborative" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" />
            Collaborative
          </TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <BarChart className="h-4 w-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <Lightbulb className="h-4 w-4 mr-2" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {summaryData.map((item, index) => (
              <PremiumCard
                key={index}
                className="hover-lift"
                showAccent={true}
                accentColor={
                  item.trend === "upward" ? "from-green-500 to-green-600" :
                  item.trend === "downward" ? "from-red-500 to-red-600" :
                  "from-blue-500 to-blue-600"
                }
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${
                        item.type === "growth" ? "bg-gradient-to-br from-green-500 to-green-600" :
                        item.type === "expense" ? "bg-gradient-to-br from-red-500 to-red-600" :
                        "bg-gradient-to-br from-blue-500 to-blue-600"
                      } flex items-center justify-center text-white shadow-md`}>
                        {item.type === "growth" ? <TrendingUp className="h-5 w-5" /> :
                         item.type === "expense" ? <BarChart className="h-5 w-5" /> :
                         <PieChart className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-slate-500">{item.timeframe} Forecast</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700">
                      {item.accuracy} Accurate
                    </Badge>
                  </div>
                }
              >
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-500">Current</div>
                      <div className="text-2xl font-bold">{item.current}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-sm text-slate-500">Predicted</div>
                      <div className="text-2xl font-bold">{item.predicted}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                        item.change.startsWith('+') ? 'bg-green-50 text-green-700' : 
                        item.change.startsWith('-') ? 'bg-red-50 text-red-700' : 
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {item.change.startsWith('+') ? <TrendingUp className="h-3 w-3 inline mr-1" /> : 
                         item.change.startsWith('-') ? <TrendingDown className="h-3 w-3 inline mr-1" /> : 
                         null}
                        {item.change}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="text-xs">Details</span>
                    </Button>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <PremiumCard
                className="hover-lift"
                showAccent={true}
                accentColor="from-[#2D71A8] to-[#4D8EC3]"
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">Revenue Forecast</h3>
                      <p className="text-sm text-slate-500">Next 12 months projection</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Export</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className="p-6 pt-0">
                  <div className="h-72 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <LineChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Revenue Forecast Chart</p>
                      <p className="text-xs">Showing actual vs. predicted revenue</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 bg-[#2D71A8] rounded-full"></div>
                        <span className="text-xs text-slate-500">Actual</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 bg-[#4D8EC3] rounded-full"></div>
                        <span className="text-xs text-slate-500">Predicted</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 bg-slate-300 rounded-full"></div>
                        <span className="text-xs text-slate-500">Confidence Interval</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      Last updated: {forecastStats.lastUpdate}
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </div>
            
            <PremiumCard
              className="hover-lift"
              showAccent={true}
              accentColor="from-purple-500 to-purple-600"
              headerContent={
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h3 className="text-lg font-semibold">AI Insights</h3>
                    <p className="text-sm text-slate-500">Based on forecast data</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              }
            >
              <div className="p-4">
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg bg-purple-50/30">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Revenue Growth Acceleration</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Q3 2024 revenue is predicted to grow 20.8% YoY, compared to 15.2% in Q2 2024. This acceleration suggests strong market performance.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-blue-50/30">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Expense Optimization</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Expenses are growing at a slower rate (6.7%) than revenue (20.8%), indicating improved operational efficiency.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-green-50/30">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                        <PieChart className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Margin Improvement</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Profit margin is forecasted to increase by 1.7 percentage points, primarily driven by higher sales volume and stable COGS.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate More Insights
                </Button>
              </div>
            </PremiumCard>
          </div>
        </TabsContent>
        
        {/* Collaborative Tab */}
        <TabsContent value="collaborative" className="mt-6">
          <CollaborativeForecast />
        </TabsContent>
        
        {/* Models Tab */}
        <TabsContent value="models" className="mt-6">
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Forecast Models</h3>
                  <p className="text-sm text-slate-500">AI-powered prediction models</p>
                </div>
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Model
                </Button>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Model Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Accuracy</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Last Run</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((model) => (
                      <tr key={model.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#0F1829]">{model.name}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{model.type}</td>
                        <td className="py-3 px-4">
                          <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {model.accuracy}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                            {model.lastRun}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                            model.status === 'active' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {model.status === 'active' ? (
                              <>
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                Active
                              </>
                            ) : (
                              <>
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5"></div>
                                Inactive
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Pencil className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <RefreshCw className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4 text-slate-500" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PremiumCard className="hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Model Performance</CardTitle>
                  <Badge className="bg-green-50 text-green-700">93% Average</Badge>
                </div>
                <CardDescription>Historical accuracy rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 bg-slate-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <BarChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Accuracy Chart</p>
                  </div>
                </div>
              </CardContent>
            </PremiumCard>
            
            <PremiumCard className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle>Data Sources</CardTitle>
                <CardDescription>Connected to 6 sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <BarChart className="h-4 w-4 text-blue-700" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">ERP System</div>
                        <div className="text-xs text-slate-500">Financial Data</div>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">Connected</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-700" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">CRM System</div>
                        <div className="text-xs text-slate-500">Customer Data</div>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">Connected</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-700" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Financial Reporting</div>
                        <div className="text-xs text-slate-500">Historical Data</div>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">Connected</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Data Source
                  </Button>
                </div>
              </CardContent>
            </PremiumCard>
            
            <PremiumCard className="hover-lift">
              <CardHeader className="pb-3">
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>Configuration options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Automated Forecasting</div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Confidence Intervals</div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Anomaly Detection</div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-green-500">
                      <span className="absolute h-3 w-3 translate-x-4 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Email Notifications</div>
                    <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-slate-200">
                      <span className="absolute h-3 w-3 translate-x-1 rounded-full bg-white transition"></span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-2 bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </PremiumCard>
          </div>
        </TabsContent>
        
        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {scenarios.map((scenario) => (
              <PremiumCard
                key={scenario.id}
                className="hover-lift"
                showAccent={true}
                accentColor={
                  scenario.impact === "high" ? "from-purple-500 to-purple-600" :
                  scenario.impact === "medium" ? "from-amber-500 to-amber-600" :
                  "from-[#2D71A8] to-[#4D8EC3]"
                }
                headerContent={
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <h3 className="text-lg font-semibold">{scenario.name}</h3>
                      <p className="text-sm text-slate-500">{scenario.probability} probability</p>
                    </div>
                    <Badge className={`${
                      scenario.impact === "high" ? "bg-purple-50 text-purple-700" :
                      scenario.impact === "medium" ? "bg-amber-50 text-amber-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {scenario.impact.charAt(0).toUpperCase() + scenario.impact.slice(1)} Impact
                    </Badge>
                  </div>
                }
              >
                <div className="p-6 pt-0">
                  <p className="text-slate-600 mb-4">{scenario.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium mb-2">Key Variables:</h4>
                    <div className="flex flex-wrap gap-2">
                      {scenario.variables.map((variable, idx) => (
                        <Badge key={idx} variant="outline" className="bg-slate-50">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                      <BarChart className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">View Projections</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
          
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
            headerContent={
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-lg font-semibold">Scenario Comparison</h3>
                  <p className="text-sm text-slate-500">Impact analysis across scenarios</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs">Export</span>
                </Button>
              </div>
            }
          >
            <div className="p-6 pt-0">
              <div className="h-72 bg-slate-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <BarChart className="h-12 w-12 mx-auto mb-2" />
                  <p>Scenario Comparison Chart</p>
                  <p className="text-xs">Comparing key financial metrics across scenarios</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Conservative Growth</div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Revenue</div>
                    <div className="text-sm font-medium">$1.32M</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Profit</div>
                    <div className="text-sm font-medium">$285K</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Margin</div>
                    <div className="text-sm font-medium">21.6%</div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="text-sm font-medium mb-1">Expected Case</div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Revenue</div>
                    <div className="text-sm font-medium">$1.45M</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Profit</div>
                    <div className="text-sm font-medium">$380K</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Margin</div>
                    <div className="text-sm font-medium">26.2%</div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium mb-1">Accelerated Expansion</div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Revenue</div>
                    <div className="text-sm font-medium">$1.68M</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Profit</div>
                    <div className="text-sm font-medium">$470K</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-slate-500">Margin</div>
                    <div className="text-sm font-medium">28.0%</div>
                  </div>
                </div>
              </div>
            </div>
          </PremiumCard>
          
          <Button className="w-full bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Create New Scenario
          </Button>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <PremiumCard
            className="hover-lift mb-6"
            showAccent={true}
            accentColor="from-[#2D71A8] to-[#4D8EC3]"
          >
            <div className="grid lg:grid-cols-2 gap-6 p-6">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Forecast Reports</h3>
                    <p className="text-slate-500">Generate and access forecast reports</p>
                  </div>
                  <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    New Report
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-md mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Q3 2024 Financial Forecast</h3>
                    <p className="text-xs text-slate-500">Generated on May 18, 2024</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Comprehensive forecast for Q3 2024 financial performance, including revenue predictions, expense projections, and profit margins.</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">16 pages • PDF</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Annual Forecast 2024-2025</h3>
                    <p className="text-xs text-slate-500">Generated on May 10, 2024</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Long-term financial projections for the next fiscal year, with quarterly breakdowns and scenario analysis.</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">24 pages • PDF</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md mr-3">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Market Expansion Analysis</h3>
                    <p className="text-xs text-slate-500">Generated on May 5, 2024</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Detailed projections for market expansion opportunities, including revenue potential and resource requirements.</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">18 pages • PDF</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md mr-3">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Cash Flow Projection</h3>
                    <p className="text-xs text-slate-500">Generated on April 28, 2024</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">Month-by-month cash flow projections for the next 12 months, with seasonality analysis and liquidity forecasts.</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">14 pages • PDF</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 border-[#2D71A8] text-[#2D71A8]">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </PremiumCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumCard className="hover-lift">
              <CardHeader>
                <CardTitle>Schedule Reports</CardTitle>
                <CardDescription>Automate report generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="font-medium text-sm">Monthly Financial Forecast</div>
                        <div className="text-xs text-slate-500">First day of each month</div>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="font-medium text-sm">Quarterly Forecast Review</div>
                        <div className="text-xs text-slate-500">Last day of each quarter</div>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="font-medium text-sm">Weekly Sales Forecast</div>
                        <div className="text-xs text-slate-500">Every Monday at 8:00 AM</div>
                      </div>
                    </div>
                    <Badge className="bg-slate-100 text-slate-700">Inactive</Badge>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule New Report
                  </Button>
                </div>
              </CardContent>
            </PremiumCard>
            
            <PremiumCard className="hover-lift">
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Standardized report formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Executive Summary</div>
                      <Badge className="bg-blue-50 text-blue-700">Default</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      High-level overview of key forecasts for executive leadership.
                    </p>
                    <Button variant="outline" size="sm" className="w-full border-[#2D71A8] text-[#2D71A8]">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Use Template</span>
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Detailed Forecast</div>
                      <Badge className="bg-slate-100 text-slate-700">Custom</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      Comprehensive forecast with detailed breakdowns and analysis.
                    </p>
                    <Button variant="outline" size="sm" className="w-full border-[#2D71A8] text-[#2D71A8]">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Use Template</span>
                    </Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Scenario Analysis</div>
                      <Badge className="bg-slate-100 text-slate-700">Custom</Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      Multi-scenario comparison with variance analysis.
                    </p>
                    <Button variant="outline" size="sm" className="w-full border-[#2D71A8] text-[#2D71A8]">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Use Template</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </PremiumCard>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

function TrendingDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 17 13 8l-4 4-6-6" />
      <path d="M16 17h6v-6" />
    </svg>
  );
}

export default Forecasting;