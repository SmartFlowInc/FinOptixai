import React from 'react';
import { useDashboard, DashboardView, DashboardLayout } from '@/contexts/DashboardContext';
import { useFilters } from '@/contexts/FilterContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMetrics from '@/components/mobile/MobileMetrics';
import MobileNavigation from '@/components/mobile/MobileNavigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPeriod } from '@/contexts/FilterContext';
import DashboardFilters from '@/components/shared/DashboardFilters';
import MetricCard from '@/components/shared/MetricCard';
import ChartWrapper from '@/components/shared/ChartWrapper';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Layout,
  Grid2X2, 
  RefreshCw, 
  ListFilter, 
  Save 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// UnifiedDashboard component
const UnifiedDashboard: React.FC = () => {
  const { 
    view, 
    setView,
    layout, 
    setLayout,
    dashboardData,
    isLoading,
    refetch,
    layoutConfig,
    isInsightsPanelExpanded,
    toggleInsightsPanel
  } = useDashboard();
  
  const isMobile = useIsMobile();
  const { period } = useFilters();
  
  // Render appropriate dashboard based on view type
  const renderDashboardView = () => {
    switch (view) {
      case 'mobile':
        return <MobileDashboardView />;
      case 'advanced':
        return <AdvancedDashboardView />;
      default:
        return <StandardDashboardView />;
    }
  };

  // Layout switcher component - used in both standard and advanced views
  const LayoutSwitcher = () => (
    <Select value={layout} onValueChange={(value) => setLayout(value as DashboardLayout)}>
      <SelectTrigger className="w-[130px]">
        <Layout className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Layout" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="compact">Compact</SelectItem>
        <SelectItem value="expanded">Expanded</SelectItem>
        <SelectItem value="custom">Custom</SelectItem>
      </SelectContent>
    </Select>
  );

  // View switcher component
  const ViewSwitcher = () => (
    <Select 
      value={view} 
      onValueChange={(value) => setView(value as DashboardView)}
      disabled={isMobile} // Don't allow changing view on mobile
    >
      <SelectTrigger className="w-[130px]">
        <Grid2X2 className="h-4 w-4 mr-2" />
        <SelectValue placeholder="View" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="standard">Standard</SelectItem>
        <SelectItem value="advanced">Advanced</SelectItem>
      </SelectContent>
    </Select>
  );

  // Shared refresh button
  const RefreshButton = () => (
    <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
  );

  return (
    <div className={cn("space-y-6", layoutConfig.contentPadding)}>
      {/* Only show the header if not in mobile view */}
      {view !== 'mobile' && (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {view === 'advanced' ? 'Advanced Financial Dashboard' : 'Financial Dashboard'}
            </h1>
            <p className="text-neutral-600">
              {view === 'advanced' 
                ? 'Interactive data visualization with drill-down capabilities' 
                : `Financial overview for ${formatPeriod(period)}`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <ViewSwitcher />
            <LayoutSwitcher />
            <RefreshButton />
          </div>
        </div>
      )}
      
      {renderDashboardView()}
    </div>
  );
};

// Mobile Dashboard View Component
const MobileDashboardView: React.FC = () => {
  const { period } = useFilters();
  const { dashboardData, refetch, isLoading } = useDashboard();
  const [activeTab, setActiveTab] = React.useState('overview');
  
  return (
    <div className="pb-20">
      {/* Mobile metrics display */}
      <MobileMetrics 
        periodFilter={formatPeriod(period)}
        onRefresh={() => refetch()}
      />
        
      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
          
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Revenue Overview Card */}
          <ChartWrapper 
            title="Revenue Overview" 
            description="YTD performance vs target"
            isLoading={isLoading}
          >
            <div className="p-1">
              {/* Chart content would go here */}
              <div className="h-[150px] flex items-center justify-center text-muted-foreground">
                Revenue chart visualization
              </div>
            </div>
          </ChartWrapper>
        </TabsContent>
          
        <TabsContent value="cashflow" className="mt-4 space-y-4">
          {/* Cash Flow Forecast Card */}
          <ChartWrapper 
            title="Cash Flow Forecast" 
            description="Next 90 days projection"
            isLoading={isLoading}
          >
            <div className="p-1">
              {/* Chart content would go here */}
              <div className="h-[150px] flex items-center justify-center text-muted-foreground">
                Cash flow chart visualization
              </div>
            </div>
          </ChartWrapper>
        </TabsContent>
          
        <TabsContent value="budget" className="mt-4 space-y-4">
          {/* Budget Performance Card */}
          <ChartWrapper 
            title="Budget Performance" 
            description={`Actual vs Budget for ${formatPeriod(period)}`}
            isLoading={isLoading}
          >
            <div className="p-1">
              {/* Chart content would go here */}
              <div className="h-[150px] flex items-center justify-center text-muted-foreground">
                Budget performance visualization
              </div>
            </div>
          </ChartWrapper>
        </TabsContent>
      </Tabs>
        
      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

// Standard Dashboard View Component
const StandardDashboardView: React.FC = () => {
  const { 
    dashboardData, 
    isLoading, 
    layout,
    layoutConfig,
    isInsightsPanelExpanded,
    toggleInsightsPanel 
  } = useDashboard();
  const { period } = useFilters();
  
  // Extract KPIs from data
  const kpis = dashboardData?.kpis || [];
  
  // Find specific KPIs by type
  const revenueKpi = kpis.find((kpi: any) => kpi.type === 'revenue');
  const expensesKpi = kpis.find((kpi: any) => kpi.type === 'expenses');
  const profitKpi = kpis.find((kpi: any) => kpi.type === 'profit');
  const cashFlowKpi = kpis.find((kpi: any) => kpi.type === 'cashflow');
  
  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Dashboard Filters</CardTitle>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DashboardFilters showReset={true} />
        </CardContent>
      </Card>
      
      {/* KPI Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${layoutConfig.chartGap}`}>
        <MetricCard 
          title="Revenue" 
          value={revenueKpi?.value || "0"} 
          changePercentage={revenueKpi?.changePercentage || "0"} 
          icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
          isLoading={isLoading}
          format="currency"
        />
        
        <MetricCard 
          title="Expenses" 
          value={expensesKpi?.value || "0"} 
          changePercentage={expensesKpi?.changePercentage || "0"} 
          icon={<BarChart3 className="h-5 w-5 text-red-600" />}
          isLoading={isLoading}
          format="currency"
          trendIsGood={false}
        />
        
        <MetricCard 
          title="Profit" 
          value={profitKpi?.value || "0"} 
          changePercentage={profitKpi?.changePercentage || "0"} 
          icon={<LineChart className="h-5 w-5 text-blue-600" />}
          isLoading={isLoading}
          format="currency"
        />
        
        <MetricCard 
          title="Cash Flow" 
          value={cashFlowKpi?.value || "0"} 
          changePercentage={cashFlowKpi?.changePercentage || "0"} 
          icon={<LineChart className="h-5 w-5 text-purple-600" />}
          isLoading={isLoading}
          format="currency"
        />
      </div>
      
      {/* Charts Grid - Layout changes based on layout config */}
      <div className={`grid grid-cols-12 ${layoutConfig.chartGap}`}>
        {/* Revenue Chart */}
        <div className={layoutConfig.mainColSpan}>
          <ChartWrapper 
            title="Revenue Trend" 
            description={`Monthly revenue for ${formatPeriod(period)}`}
            isLoading={isLoading}
          >
            <div style={{ height: layoutConfig.mainChartHeight }}>
              {/* Chart content would go here */}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Revenue trend visualization
              </div>
            </div>
          </ChartWrapper>
        </div>
        
        {/* Expense Chart */}
        <div className={layoutConfig.secondaryColSpan}>
          <ChartWrapper 
            title="Expense Breakdown" 
            description="By category"
            isLoading={isLoading}
          >
            <div style={{ height: layoutConfig.secondaryChartHeight }}>
              {/* Chart content would go here */}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Expense breakdown visualization
              </div>
            </div>
          </ChartWrapper>
        </div>
        
        {/* Cash Flow Chart */}
        <div className={layoutConfig.secondaryColSpan}>
          <ChartWrapper 
            title="Cash Flow Projection" 
            description="Next 3 months"
            isLoading={isLoading}
          >
            <div style={{ height: layoutConfig.secondaryChartHeight }}>
              {/* Chart content would go here */}
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Cash flow projection visualization
              </div>
            </div>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};

// Advanced Dashboard View Component
const AdvancedDashboardView: React.FC = () => {
  const { 
    dashboardData, 
    isLoading, 
    layoutConfig 
  } = useDashboard();
  const { period } = useFilters();
  
  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Advanced Filters & Controls</CardTitle>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DashboardFilters showReset={true} showDepartment={true} showRegion={true} />
        </CardContent>
      </Card>
      
      {/* Advanced visualization tabs */}
      <Tabs defaultValue="revenue">
        <TabsList className="mb-4">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MetricCard 
              title="Total Revenue" 
              value="1,250,000" 
              changePercentage="8.5" 
              icon={<BarChart3 className="h-5 w-5 text-emerald-600" />}
              isLoading={isLoading}
              format="currency"
              size="lg"
            />
            
            <MetricCard 
              title="Average Order Value" 
              value="2,850" 
              changePercentage="3.2" 
              icon={<LineChart className="h-5 w-5 text-blue-600" />}
              isLoading={isLoading}
              format="currency"
              size="lg"
            />
            
            <MetricCard 
              title="Conversion Rate" 
              value="3.8" 
              changePercentage="0.5" 
              icon={<PieChart className="h-5 w-5 text-purple-600" />}
              isLoading={isLoading}
              format="percentage"
              size="lg"
            />
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Main revenue chart */}
            <div className={layoutConfig.mainColSpan}>
              <ChartWrapper 
                title="Revenue Performance" 
                description="By region and product category"
                isLoading={isLoading}
                headerAction={
                  <Badge variant="outline" className="ml-2">
                    Interactive
                  </Badge>
                }
              >
                <div style={{ height: layoutConfig.mainChartHeight }}>
                  {/* Interactive chart would go here */}
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Advanced revenue visualization with drill-down
                  </div>
                </div>
              </ChartWrapper>
            </div>
            
            {/* Revenue by region */}
            <div className={layoutConfig.secondaryColSpan}>
              <ChartWrapper 
                title="Revenue by Region" 
                description="Geographic distribution"
                isLoading={isLoading}
              >
                <div style={{ height: layoutConfig.secondaryChartHeight }}>
                  {/* Chart content would go here */}
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Regional revenue breakdown
                  </div>
                </div>
              </ChartWrapper>
            </div>
            
            {/* Revenue by product */}
            <div className={layoutConfig.secondaryColSpan}>
              <ChartWrapper 
                title="Revenue by Product" 
                description="Top contributing products"
                isLoading={isLoading}
              >
                <div style={{ height: layoutConfig.secondaryChartHeight }}>
                  {/* Chart content would go here */}
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Product revenue breakdown
                  </div>
                </div>
              </ChartWrapper>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-6">
          {/* Expense analysis content would go here */}
          <div className="flex items-center justify-center h-[400px] text-muted-foreground border rounded-lg">
            Expense analysis visualization
          </div>
        </TabsContent>
        
        <TabsContent value="profitability" className="space-y-6">
          {/* Profitability analysis content would go here */}
          <div className="flex items-center justify-center h-[400px] text-muted-foreground border rounded-lg">
            Profitability analysis visualization
          </div>
        </TabsContent>
        
        <TabsContent value="forecasts" className="space-y-6">
          {/* Forecasts content would go here */}
          <div className="flex items-center justify-center h-[400px] text-muted-foreground border rounded-lg">
            Financial forecasts visualization
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedDashboard;