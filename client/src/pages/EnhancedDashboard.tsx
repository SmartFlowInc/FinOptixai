import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Period,
  Department,
  Region,
  DashboardFilter
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  DownloadCloud, 
  RefreshCw, 
  PieChart, 
  LineChart,
  BarChart,
  DollarSign,
  Percent,
  TrendingUp,
  Wallet
} from "lucide-react";

// Import our enhanced components
import DashboardHeader from "@/components/ui/dashboard-header";
import MetricCard from "@/components/ui/metric-card";
import EnhancedRevenueChart from "@/components/charts/EnhancedRevenueChart";
import EnhancedExpenseChart from "@/components/charts/EnhancedExpenseChart";

// Reuse existing components
import QuickFilters from "@/components/filters/QuickFilters";
import BudgetVsActual from "@/components/dashboard/BudgetVsActual";
import FinancialForecast from "@/components/dashboard/FinancialForecast";
import CashFlowForecast from "@/components/dashboard/CashFlowForecast";
import FinancialReports from "@/components/dashboard/FinancialReports";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DriverAnalysis from "@/components/dashboard/DriverAnalysis";
import InsightsPanel from "@/components/insights/InsightsPanel";

import { DashboardData, defaultFilters, getKpiByType, formatCurrency } from "@/data/finance";
import { transformRevenueData, transformExpenseData } from "@/services/data-transformations";

const EnhancedDashboard = () => {
  const [filters, setFilters] = useState<{
    period: Period;
    department: Department;
    region: Region;
  }>(defaultFilters);
  
  const [forecastTimeframe, setForecastTimeframe] = useState<string>("6_months");
  const [insightsPanelExpanded, setInsightsPanelExpanded] = useState<boolean>(false);
  const [dashboardLayout, setDashboardLayout] = useState<'default' | 'compact' | 'expanded' | 'custom'>('default');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch dashboard data with filters
  const { data, isLoading, error, refetch } = useQuery<DashboardData>({
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
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing Data",
      description: "Dashboard data is being updated.",
    });
  };
  
  const handleForecastTimeframeChange = (timeframe: string) => {
    setForecastTimeframe(timeframe);
  };
  
  const handleLayoutChange = (layout: 'default' | 'compact' | 'expanded' | 'custom') => {
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
      setDashboardLayout(savedLayout as 'default' | 'compact' | 'expanded' | 'custom');
    }
  }, []);
  
  // Get KPI data
  const revenueKpi = data ? getKpiByType(data.kpis, "revenue") : undefined;
  const profitMarginKpi = data ? getKpiByType(data.kpis, "profitMargin") : undefined;
  const opexKpi = data ? getKpiByType(data.kpis, "opex") : undefined;
  const cashFlowKpi = data ? getKpiByType(data.kpis, "cashFlow") : undefined;
  
  // Dashboard header tabs for different views
  const dashboardTabs = [
    { value: 'default', label: 'Standard' },
    { value: 'compact', label: 'Compact' },
    { value: 'expanded', label: 'Expanded' },
    { value: 'custom', label: 'Custom' }
  ];
  
  // Dashboard actions
  const dashboardActions = (
    <>
      <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-1">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
        <DownloadCloud className="h-4 w-4" />
        Export
      </Button>
    </>
  );
  
  // Dashboard filters
  const dashboardFilters = (
    <QuickFilters
      period={filters.period}
      department={filters.department}
      region={filters.region}
      onFilterChange={handleFilterChange}
      onExport={handleExport}
    />
  );

  return (
    <div className="w-full">
      <DashboardHeader
        title="Financial Dashboard"
        subtitle="View and analyze your financial performance"
        actions={dashboardActions}
        tabs={dashboardTabs}
        selectedTab={dashboardLayout}
        onTabChange={(value) => handleLayoutChange(value as 'default' | 'compact' | 'expanded' | 'custom')}
        filters={dashboardFilters}
      />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <MetricCard
          title="Revenue"
          value={formatCurrency(revenueKpi?.value)}
          icon={<DollarSign className="h-4 w-4" />}
          change={Number(revenueKpi?.changePercentage) || 0}
          isLoading={isLoading}
          variant="default"
          highlightValue={true}
        />
        
        <MetricCard
          title="Profit Margin"
          value={`${profitMarginKpi?.value || 0}%`}
          icon={<Percent className="h-4 w-4" />}
          change={Number(profitMarginKpi?.changePercentage) || 0}
          isLoading={isLoading}
          variant="secondary"
        />
        
        <MetricCard
          title="Operating Expenses"
          value={formatCurrency(opexKpi?.value)}
          icon={<BarChart className="h-4 w-4" />}
          change={Number(opexKpi?.changePercentage) || 0}
          isLoading={isLoading}
          variant="accent"
        />
        
        <MetricCard
          title="Cash Flow"
          value={formatCurrency(cashFlowKpi?.value)}
          icon={<Wallet className="h-4 w-4" />}
          change={Number(cashFlowKpi?.changePercentage) || 0}
          isLoading={isLoading}
          variant="warning"
        />
      </div>
      
      {/* Charts Section */}
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
          <EnhancedRevenueChart
            data={transformRevenueData()}
            isLoading={isLoading}
            title="Revenue Trend"
            description="Performance over time"
          />
          
          <EnhancedExpenseChart
            data={transformExpenseData()}
            isLoading={isLoading}
            title="Expense Breakdown"
            description="By category"
          />
        </div>
      </div>
      
      {/* Financial Planning and Budget Section */}
      <div className={`grid grid-cols-1 ${
        dashboardLayout === "compact" ? "lg:grid-cols-1" : 
        dashboardLayout === "expanded" ? "lg:grid-cols-1" : 
        "lg:grid-cols-3"
      } gap-6 mb-6`}>
        <BudgetVsActual
          budgetItems={data?.budgetItems || []}
          department={filters.department}
          onDepartmentChange={(dept) => handleFilterChange('department', dept)}
          isLoading={isLoading}
        />
        
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
      
      {/* Reports and Activity */}
      <div className={`grid grid-cols-1 ${
        dashboardLayout === "compact" ? "lg:grid-cols-1" : 
        dashboardLayout === "expanded" ? "lg:grid-cols-1" : 
        "lg:grid-cols-3"
      } gap-6`}>
        <div className={dashboardLayout === "default" || dashboardLayout === "custom" ? "lg:col-span-2" : ""}>
          <FinancialReports
            reports={data?.reports || []}
            onGenerateReport={() => {}}
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
    </div>
  );
};

export default EnhancedDashboard;