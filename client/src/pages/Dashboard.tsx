import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Period,
  Department,
  Region,
  DashboardFilter
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import QuickFilters from "@/components/filters/QuickFilters";
import KpiCard from "@/components/dashboard/KpiCard";
import RevenueChart from "@/components/charts/RevenueChart";
import ExpenseChart from "@/components/charts/ExpenseChart";
import BudgetVsActual from "@/components/dashboard/BudgetVsActual";
import FinancialForecast from "@/components/dashboard/FinancialForecast";
import CashFlowForecast from "@/components/dashboard/CashFlowForecast";
import FinancialReports from "@/components/dashboard/FinancialReports";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DriverAnalysis from "@/components/dashboard/DriverAnalysis";
import InsightsPanel from "@/components/insights/InsightsPanel";
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";

import { DashboardData, defaultFilters, getKpiByType, formatCurrency } from "@/data/finance";
import { transformRevenueData, transformExpenseData } from "@/services/data-transformations";
import { 
  LayoutGrid, 
  LayoutList as LayoutRows, 
  LayoutPanelTop as LayoutColumns, 
  MoveHorizontal, 
  Save, 
  Plus, 
  Download, 
  LineChart, 
  Percent, 
  DollarSign, 
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  BarChart,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Users,
  TrendingUp,
  ShoppingCart
} from "lucide-react";

const Dashboard = () => {
  const [filters, setFilters] = useState<{
    period: Period;
    department: Department;
    region: Region;
  }>(defaultFilters);
  
  const [forecastTimeframe, setForecastTimeframe] = useState<string>("6_months");
  const [insightsPanelExpanded, setInsightsPanelExpanded] = useState<boolean>(false);
  const [dashboardLayout, setDashboardLayout] = useState<string>("default");
  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch dashboard data with filters
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        period: filters.period,
        department: filters.department,
        region: filters.region
      });
      
      const response = await fetch(`/api/dashboard?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      return response.json();
    }
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  const handleFilterChange = (type: 'period' | 'department' | 'region', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported. It will be available shortly.",
    });
  };
  
  const handleReportGenerated = () => {
    // Invalidate reports query to refresh the list
    queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
  };
  
  const handleForecastTimeframeChange = (timeframe: string) => {
    setForecastTimeframe(timeframe);
  };
  
  const handleLayoutChange = (layout: string) => {
    setDashboardLayout(layout);
    
    // Save user preference
    localStorage.setItem("dashboard_layout", layout);
    
    toast({
      title: "Layout Updated",
      description: `Dashboard layout changed to ${layout} view.`,
    });
  };
  
  // Load saved layout preference on initial load
  useEffect(() => {
    const savedLayout = localStorage.getItem("dashboard_layout");
    if (savedLayout && ["default", "compact", "expanded", "custom"].includes(savedLayout)) {
      setDashboardLayout(savedLayout as "default" | "compact" | "expanded" | "custom");
    }
  }, []);
  
  // Get KPI data
  const revenueKpi = data ? getKpiByType(data.kpis, "revenue") : undefined;
  const profitMarginKpi = data ? getKpiByType(data.kpis, "profitMargin") : undefined;
  const opexKpi = data ? getKpiByType(data.kpis, "opex") : undefined;
  const cashFlowKpi = data ? getKpiByType(data.kpis, "cashFlow") : undefined;

  // Define stats for the premium header
  const headerStats = [
    {
      title: "Revenue",
      value: formatCurrency(revenueKpi?.value) || "$0",
      icon: <LineChart className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    },
    {
      title: "Profit Margin",
      value: `${profitMarginKpi?.value || 0}%`,
      icon: <Percent className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Operating Expenses",
      value: formatCurrency(opexKpi?.value) || "$0",
      icon: <DollarSign className="h-5 w-5" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-500"
    },
    {
      title: "Cash Flow",
      value: formatCurrency(cashFlowKpi?.value) || "$0",
      icon: <Landmark className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Plus className="mr-2 h-4 w-4" />
        Add Widget
      </Button>
    </>
  );

  return (
    <>
      <PremiumPageHeader
        title="Financial Dashboard"
        description="Get a complete overview of your financial performance"
        icon={<BarChart className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />
      
      {/* Quick Filters and Layout Options */}
      <div className="mb-6 space-y-4">
        <QuickFilters
          period={filters.period}
          department={filters.department}
          region={filters.region}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />
        
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Dashboard Layout:</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleLayoutChange("default")} 
              className={dashboardLayout === "default" ? "bg-white text-[#2D71A8] border-[#2D71A8] shadow-sm" : ""}
            >
              <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
              Default
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleLayoutChange("compact")} 
              className={dashboardLayout === "compact" ? "bg-white text-[#2D71A8] border-[#2D71A8] shadow-sm" : ""}
            >
              <LayoutRows className="mr-1.5 h-3.5 w-3.5" />
              Compact
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleLayoutChange("expanded")} 
              className={dashboardLayout === "expanded" ? "bg-white text-[#2D71A8] border-[#2D71A8] shadow-sm" : ""}
            >
              <LayoutColumns className="mr-1.5 h-3.5 w-3.5" />
              Expanded
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleLayoutChange("custom")} 
              className={dashboardLayout === "custom" ? "bg-white text-[#2D71A8] border-[#2D71A8] shadow-sm" : ""}
            >
              <MoveHorizontal className="mr-1.5 h-3.5 w-3.5" />
              Custom
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-600">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Layout
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddWidgetDialog(true)}
              className="border-[#2D71A8] text-[#2D71A8]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Widget
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards with premium styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <PremiumCard 
          className="overflow-hidden hover-lift"
          showAccent={true}
          accentColor="from-[#2D71A8] to-[#4D8EC3]"
          headerContent={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] flex items-center justify-center text-white shadow-sm">
                  <LineChart className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Revenue</div>
                  <div className="text-2xl font-semibold text-slate-800">{formatCurrency(revenueKpi?.value) || "$0"}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                Number(revenueKpi?.changePercentage) >= 0 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
              }`}>
                {Number(revenueKpi?.changePercentage) >= 0 
                  ? <ArrowUpRight className="h-3 w-3" /> 
                  : <ArrowDownRight className="h-3 w-3" />
                }
                {Math.abs(Number(revenueKpi?.changePercentage) || 0)}%
              </div>
            </div>
          }
        >
          <div className="h-[70px] flex items-end mt-2 pt-2 px-2">
            {/* Mini chart would go here */}
            <div className="w-full h-full bg-gradient-to-t from-transparent to-blue-50 rounded-md">
              <div className="h-full w-full relative overflow-hidden">
                {/* Simulated chart line */}
                <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path 
                      d="M0 20 L5 15 L10 18 L15 10 L20 13 L25 11 L30 14 L35 8 L40 10 L45 5 L50 8 L55 6 L60 11 L65 13 L70 8 L75 7 L80 12 L85 9 L90 14 L95 6 L100 10 L100 20 Z" 
                      fill="rgba(45, 113, 168, 0.1)"
                    />
                    <path 
                      d="M0 20 L5 15 L10 18 L15 10 L20 13 L25 11 L30 14 L35 8 L40 10 L45 5 L50 8 L55 6 L60 11 L65 13 L70 8 L75 7 L80 12 L85 9 L90 14 L95 6 L100 10" 
                      fill="none" 
                      stroke="#2D71A8" 
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </PremiumCard>
        
        <PremiumCard 
          className="overflow-hidden hover-lift"
          showAccent={true}
          accentColor="from-green-500 to-green-600"
          headerContent={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-sm">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Profit Margin</div>
                  <div className="text-2xl font-semibold text-slate-800">{profitMarginKpi?.value || 0}%</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                Number(profitMarginKpi?.changePercentage) >= 0 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
              }`}>
                {Number(profitMarginKpi?.changePercentage) >= 0 
                  ? <ArrowUpRight className="h-3 w-3" /> 
                  : <ArrowDownRight className="h-3 w-3" />
                }
                {Math.abs(Number(profitMarginKpi?.changePercentage) || 0)}%
              </div>
            </div>
          }
        >
          <div className="h-[70px] flex items-end mt-2 pt-2 px-2">
            <div className="w-full h-full bg-gradient-to-t from-transparent to-green-50 rounded-md">
              <div className="h-full w-full relative overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path 
                    d="M0 15 L10 17 L20 14 L30 13 L40 15 L50 10 L60 8 L70 5 L80 8 L90 7 L100 4 L100 20 L0 20 Z" 
                    fill="rgba(34, 197, 94, 0.1)"
                  />
                  <path 
                    d="M0 15 L10 17 L20 14 L30 13 L40 15 L50 10 L60 8 L70 5 L80 8 L90 7 L100 4" 
                    fill="none" 
                    stroke="#22c55e" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </PremiumCard>
        
        <PremiumCard 
          className="overflow-hidden hover-lift"
          showAccent={true}
          accentColor="from-amber-500 to-amber-600"
          headerContent={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Operating Expenses</div>
                  <div className="text-2xl font-semibold text-slate-800">{formatCurrency(opexKpi?.value) || "$0"}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                Number(opexKpi?.changePercentage) <= 0 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
              }`}>
                {Number(opexKpi?.changePercentage) <= 0 
                  ? <ArrowDownRight className="h-3 w-3" /> 
                  : <ArrowUpRight className="h-3 w-3" />
                }
                {Math.abs(Number(opexKpi?.changePercentage) || 0)}%
              </div>
            </div>
          }
        >
          <div className="h-[70px] flex items-end mt-2 pt-2 px-2">
            <div className="w-full h-full bg-gradient-to-t from-transparent to-amber-50 rounded-md">
              <div className="h-full w-full relative overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path 
                    d="M0 8 L10 10 L20 7 L30 12 L40 13 L50 10 L60 14 L70 15 L80 13 L90 15 L100 12 L100 20 L0 20 Z" 
                    fill="rgba(245, 158, 11, 0.1)"
                  />
                  <path 
                    d="M0 8 L10 10 L20 7 L30 12 L40 13 L50 10 L60 14 L70 15 L80 13 L90 15 L100 12" 
                    fill="none" 
                    stroke="#F59E0B" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </PremiumCard>
        
        <PremiumCard 
          className="overflow-hidden hover-lift"
          showAccent={true}
          accentColor="from-purple-500 to-purple-600"
          headerContent={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">Cash Flow</div>
                  <div className="text-2xl font-semibold text-slate-800">{formatCurrency(cashFlowKpi?.value) || "$0"}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                Number(cashFlowKpi?.changePercentage) >= 0 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
              }`}>
                {Number(cashFlowKpi?.changePercentage) >= 0 
                  ? <ArrowUpRight className="h-3 w-3" /> 
                  : <ArrowDownRight className="h-3 w-3" />
                }
                {Math.abs(Number(cashFlowKpi?.changePercentage) || 0)}%
              </div>
            </div>
          }
        >
          <div className="h-[70px] flex items-end mt-2 pt-2 px-2">
            <div className="w-full h-full bg-gradient-to-t from-transparent to-purple-50 rounded-md">
              <div className="h-full w-full relative overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path 
                    d="M0 12 L10 14 L20 10 L30 15 L40 12 L50 7 L60 11 L70 6 L80 9 L90 5 L100 7 L100 20 L0 20 Z" 
                    fill="rgba(168, 85, 247, 0.1)"
                  />
                  <path 
                    d="M0 12 L10 14 L20 10 L30 15 L40 12 L50 7 L60 11 L70 6 L80 9 L90 5 L100 7" 
                    fill="none" 
                    stroke="#A855F7" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="forecasts" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <LineChart className="h-4 w-4 mr-2" />
            Forecasts
          </TabsTrigger>
          <TabsTrigger value="budgets" className="data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Budgets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          {/* Insights and Chart Sections */}
          <div className={`grid grid-cols-1 ${
            dashboardLayout === "compact" ? "lg:grid-cols-1" : 
            dashboardLayout === "expanded" ? "lg:grid-cols-1" : 
            "lg:grid-cols-3"
          } gap-6 mb-6`}>
            {/* In compact mode, make insights panel collapsible */}
            {(dashboardLayout === "default" || dashboardLayout === "compact" || dashboardLayout === "custom") && (
              <div className={`${insightsPanelExpanded && dashboardLayout === "default" ? 'lg:col-span-2' : ''}`}>
                <InsightsPanel 
                  isExpanded={insightsPanelExpanded} 
                  onToggleExpand={() => setInsightsPanelExpanded(!insightsPanelExpanded)} 
                />
              </div>
            )}
            
            <div className={`${
              dashboardLayout === "compact" ? "lg:col-span-1" : 
              dashboardLayout === "expanded" ? "lg:col-span-1" : 
              insightsPanelExpanded ? "lg:col-span-1" : "lg:col-span-2"
            } grid grid-cols-1 ${dashboardLayout === "expanded" ? "lg:grid-cols-1" : "lg:grid-cols-2"} gap-6`}>
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                accentColor="from-[#2D71A8] to-[#4D8EC3]"
                title="Revenue Trend"
                description="Monthly revenue analysis"
                headerRightContent={
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 gap-1 text-slate-500 hover:text-[#2D71A8] hover:bg-blue-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Refresh</span>
                  </Button>
                }
              >
                <RevenueChart
                  data={transformRevenueData()}
                  isLoading={isLoading}
                  title=""
                />
              </PremiumCard>
              
              <PremiumCard
                className="hover-lift" 
                showAccent={true}
                accentColor="from-amber-500 to-amber-600"
                title="Expense Breakdown"
                description="By category"
                headerRightContent={
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 gap-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Details</span>
                  </Button>
                }
              >
                <ExpenseChart
                  data={transformExpenseData()}
                  isLoading={isLoading}
                  title=""
                  description=""
                />
              </PremiumCard>
            </div>
          </div>
          
          {/* Financial Planning and Budget Section */}
          <div className={`grid grid-cols-1 ${
            dashboardLayout === "compact" ? "lg:grid-cols-1" : 
            dashboardLayout === "expanded" ? "lg:grid-cols-1" : 
            "lg:grid-cols-3"
          } gap-6 mb-6`}>
            <div className="lg:col-span-3">
              <BudgetVsActual
                budgetItems={data?.budgetItems || []}
                department={filters.department}
                onDepartmentChange={(dept) => handleFilterChange('department', dept)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          {/* Key financial insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <PremiumCard
              className="lg:col-span-2 hover-lift" 
              showAccent={true}
              accentColor="from-[#2D71A8] to-[#4D8EC3]"
              title="AI-Powered Financial Insights"
              description="Automatically generated insights from your financial data"
            >
              <div className="space-y-5 p-1">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-lg mb-0.5">Rising Labor Costs</div>
                    <div className="text-slate-600">Labor costs increased by 5% this quarter, significantly impacting overall profitability. This trend requires immediate attention as it represents the largest variance from budget in the current period.</div>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">High Priority</Badge>
                      <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">Expenses</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-lg mb-0.5">Decreasing Material Costs</div>
                    <div className="text-slate-600">Raw material costs are trending down by 2%, creating a positive impact on margins. This appears to be driven by new supplier agreements and bulk purchasing strategies implemented last quarter.</div>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Positive Trend</Badge>
                      <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">Cost Reduction</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-lg mb-0.5">Marketing Efficiency</div>
                    <div className="text-slate-600">Digital marketing channels show 15% higher ROI than traditional channels. Your social media campaigns are particularly effective with a conversion rate 23% above industry average.</div>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50">Marketing</Badge>
                      <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">ROI</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-lg mb-0.5">Strong Logistics Correlation</div>
                    <div className="text-slate-600">Logistics costs have a 0.71 correlation with overall profitability. Improvements in supply chain efficiency directly impact your bottom line more than most other operational factors.</div>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">Supply Chain</Badge>
                      <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">Correlation</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
                  Generate Full Analysis Report
                </Button>
              </div>
            </PremiumCard>
            
            <div>
              <DriverAnalysis isLoading={isLoading} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FinancialReports
                reports={data?.reports || []}
                onGenerateReport={handleReportGenerated}
                isLoading={isLoading}
              />
            </div>
            
            <div>
              <RecentActivity
                activities={data?.activities || []}
                isLoading={isLoading}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="forecasts" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialForecast
              forecastData={data?.forecastData!}
              isLoading={isLoading}
              onTimeframeChange={handleForecastTimeframeChange}
            />
            
            <CashFlowForecast
              cashFlowData={data?.cashFlowData!}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="budgets" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <BudgetVsActual
              budgetItems={data?.budgetItems || []}
              department={filters.department}
              onDepartmentChange={(dept) => handleFilterChange('department', dept)}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Widget Dialog */}
      <Dialog open={showAddWidgetDialog} onOpenChange={setShowAddWidgetDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Dashboard Widget</DialogTitle>
            <DialogDescription>
              Select widgets to add to your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                <Checkbox id="chart" />
                <Label htmlFor="chart" className="flex-grow cursor-pointer">
                  <div className="font-medium">Revenue Chart</div>
                  <div className="text-xs text-slate-500">Monthly revenue visualization</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                <Checkbox id="expense" />
                <Label htmlFor="expense" className="flex-grow cursor-pointer">
                  <div className="font-medium">Expense Breakdown</div>
                  <div className="text-xs text-slate-500">Categorized expenses</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                <Checkbox id="budget" />
                <Label htmlFor="budget" className="flex-grow cursor-pointer">
                  <div className="font-medium">Budget vs. Actual</div>
                  <div className="text-xs text-slate-500">Variance analysis</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                <Checkbox id="forecast" />
                <Label htmlFor="forecast" className="flex-grow cursor-pointer">
                  <div className="font-medium">Financial Forecast</div>
                  <div className="text-xs text-slate-500">Predictive analysis</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                <Checkbox id="cashflow" />
                <Label htmlFor="cashflow" className="flex-grow cursor-pointer">
                  <div className="font-medium">Cash Flow</div>
                  <div className="text-xs text-slate-500">Liquidity tracking</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-50">
                <Checkbox id="kpi" />
                <Label htmlFor="kpi" className="flex-grow cursor-pointer">
                  <div className="font-medium">KPI Cards</div>
                  <div className="text-xs text-slate-500">Key performance indicators</div>
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A]">Add Selected Widgets</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {dashboardLayout === "custom" && (
        <div className="col-span-full mt-4 p-4 border border-dashed rounded-lg bg-slate-50 text-center">
          <div className="flex flex-col items-center gap-2">
            <MoveHorizontal className="h-8 w-8 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-700">Custom Layout Mode</h3>
            <p className="text-sm text-slate-500 max-w-md">
              In custom layout mode, you can drag and resize widgets to create your perfect dashboard. Click and drag widgets to rearrange them.
            </p>
            <Button variant="outline" className="mt-2" onClick={() => handleLayoutChange("default")}>
              Return to Default Layout
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;