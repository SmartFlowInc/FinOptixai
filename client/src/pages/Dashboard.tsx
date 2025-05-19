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

import QuickFilters from "@/components/filters/QuickFilters";
import KpiCard from "@/components/dashboard/KpiCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ExpenseBreakdownChart from "@/components/dashboard/ExpenseBreakdownChart";
import BudgetVsActual from "@/components/dashboard/BudgetVsActual";
import FinancialForecast from "@/components/dashboard/FinancialForecast";
import CashFlowForecast from "@/components/dashboard/CashFlowForecast";
import FinancialReports from "@/components/dashboard/FinancialReports";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DriverAnalysis from "@/components/dashboard/DriverAnalysis";

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
      
      {/* Advanced Driver Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DriverAnalysis 
          isLoading={isLoading}
        />
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>
                Automatically generated insights based on driver analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Rising Labor Costs</div>
                    <div className="text-sm text-neutral-500">Labor costs increased by 5% this quarter, significantly impacting overall profitability.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Decreasing Material Costs</div>
                    <div className="text-sm text-neutral-500">Raw material costs are trending down by 2%, creating a positive impact on margins.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Marketing Efficiency</div>
                    <div className="text-sm text-neutral-500">Digital marketing channels show 15% higher ROI than traditional channels.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Strong Logistics Correlation</div>
                    <div className="text-sm text-neutral-500">Logistics costs have a 0.71 correlation with overall profitability.</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Generate Full Analysis Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
