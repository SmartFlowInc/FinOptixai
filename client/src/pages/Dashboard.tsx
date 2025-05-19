import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Period,
  Department,
  Region,
  DashboardFilter
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import QuickFilters from "@/components/filters/QuickFilters";
import KpiCard from "@/components/dashboard/KpiCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ExpenseBreakdownChart from "@/components/dashboard/ExpenseBreakdownChart";
import BudgetVsActual from "@/components/dashboard/BudgetVsActual";
import FinancialForecast from "@/components/dashboard/FinancialForecast";
import CashFlowForecast from "@/components/dashboard/CashFlowForecast";
import FinancialReports from "@/components/dashboard/FinancialReports";
import RecentActivity from "@/components/dashboard/RecentActivity";

import { DashboardData, defaultFilters, getKpiByType, formatCurrency } from "@/data/finance";

const Dashboard = () => {
  const [filters, setFilters] = useState<{
    period: Period;
    department: Department;
    region: Region;
  }>(defaultFilters);
  
  const [forecastTimeframe, setForecastTimeframe] = useState<string>("6_months");
  
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
  
  // Get KPI data
  const revenueKpi = data ? getKpiByType(data.kpis, "revenue") : undefined;
  const profitMarginKpi = data ? getKpiByType(data.kpis, "profitMargin") : undefined;
  const opexKpi = data ? getKpiByType(data.kpis, "opex") : undefined;
  const cashFlowKpi = data ? getKpiByType(data.kpis, "cashFlow") : undefined;

  return (
    <>
      {/* Quick Filters */}
      <QuickFilters
        period={filters.period}
        department={filters.department}
        region={filters.region}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
      />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <KpiCard
          title="Revenue"
          value={formatCurrency(revenueKpi?.value)}
          change={Number(revenueKpi?.changePercentage) || 0}
          icon="ri-line-chart-line"
          iconVariant="primary"
        />
        
        <KpiCard
          title="Profit Margin"
          value={`${profitMarginKpi?.value || 0}%`}
          change={Number(profitMarginKpi?.changePercentage) || 0}
          icon="ri-percent-line"
          iconVariant="secondary"
        />
        
        <KpiCard
          title="Operating Expenses"
          value={formatCurrency(opexKpi?.value)}
          change={Number(opexKpi?.changePercentage) || 0}
          icon="ri-money-dollar-circle-line"
          iconVariant="accent"
        />
        
        <KpiCard
          title="Cash Flow"
          value={formatCurrency(cashFlowKpi?.value)}
          change={Number(cashFlowKpi?.changePercentage) || 0}
          icon="ri-funds-line"
          iconVariant="warning"
        />
      </div>
      
      {/* Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RevenueChart
          data={data?.revenueData || []}
          isLoading={isLoading}
        />
        
        <ExpenseBreakdownChart
          data={data?.expenseData || []}
          isLoading={isLoading}
        />
      </div>
      
      {/* Financial Planning and Budget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
      
      {/* Financial Reports and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinancialReports
          reports={data?.reports || []}
          onGenerateReport={handleReportGenerated}
          isLoading={isLoading}
        />
        
        <RecentActivity
          activities={data?.activities || []}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Dashboard;
