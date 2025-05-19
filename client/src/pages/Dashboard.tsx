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
import InsightsPanel from "@/components/insights/InsightsPanel";

import { DashboardData, defaultFilters, getKpiByType, formatCurrency } from "@/data/finance";

const Dashboard = () => {
  const [filters, setFilters] = useState<{
    period: Period;
    department: Department;
    region: Region;
  }>(defaultFilters);
  
  const [forecastTimeframe, setForecastTimeframe] = useState<string>("6_months");
  const [insightsPanelExpanded, setInsightsPanelExpanded] = useState<boolean>(false);
  const [dashboardLayout, setDashboardLayout] = useState<"default" | "compact" | "expanded" | "custom">("default");
  
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
  
  const handleLayoutChange = (layout: "default" | "compact" | "expanded" | "custom") => {
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

  return (
    <>
      {/* Quick Filters and Layout Options */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <QuickFilters
          period={filters.period}
          department={filters.department}
          region={filters.region}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
        />
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={() => handleLayoutChange("default")} className={dashboardLayout === "default" ? "bg-primary/10" : ""}>
            <i className="ri-layout-grid-line mr-1"></i>
            Default
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLayoutChange("compact")} className={dashboardLayout === "compact" ? "bg-primary/10" : ""}>
            <i className="ri-layout-row-line mr-1"></i>
            Compact
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLayoutChange("expanded")} className={dashboardLayout === "expanded" ? "bg-primary/10" : ""}>
            <i className="ri-layout-column-line mr-1"></i>
            Expanded
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleLayoutChange("custom")} className={dashboardLayout === "custom" ? "bg-primary/10" : ""}>
            <i className="ri-drag-move-line mr-1"></i>
            Custom
          </Button>
        </div>
      </div>
      
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
          <RevenueChart
            data={data?.revenueData || []}
            isLoading={isLoading}
          />
          
          <ExpenseBreakdownChart
            data={data?.expenseData || []}
            isLoading={isLoading}
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
      
      {/* Advanced Driver Analysis */}
      <div className={`grid grid-cols-1 ${
        dashboardLayout === "compact" ? "lg:grid-cols-1" : 
        dashboardLayout === "expanded" ? "lg:grid-cols-1" : 
        "lg:grid-cols-3"
      } gap-6 mb-6`}>
        <div className={dashboardLayout === "default" || dashboardLayout === "custom" ? "lg:col-span-2" : ""}>
          <DriverAnalysis 
            isLoading={isLoading}
          />
        </div>
        
        {(dashboardLayout !== "compact" || dashboardLayout === "custom") && (
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
        )}
      </div>

      {/* Financial Reports and Recent Activity */}
      <div className={`grid grid-cols-1 ${
        dashboardLayout === "compact" ? "lg:grid-cols-1" : 
        dashboardLayout === "expanded" ? "lg:grid-cols-1" : 
        "lg:grid-cols-3"
      } gap-6`}>
        <div className={dashboardLayout === "default" || dashboardLayout === "custom" ? "lg:col-span-2" : ""}>
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
        
        {dashboardLayout === "custom" && (
          <div className="col-span-full mt-4 p-4 border border-dashed rounded-lg bg-neutral-50 text-center">
            <div className="flex flex-col items-center gap-2">
              <i className="ri-drag-move-line text-2xl text-neutral-400"></i>
              <p className="text-sm text-neutral-600">In custom mode, you can drag and drop dashboard widgets to create your own layout.</p>
              <Button variant="outline" size="sm" className="mt-2">
                Save Custom Layout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
