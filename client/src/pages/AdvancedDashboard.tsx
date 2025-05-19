import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Grid2X2, Layout, LayoutGrid, ListFilter, PanelRight, RefreshCw, Save } from 'lucide-react';
import AdvancedChart from '@/components/visualization/AdvancedCharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types
type DashboardLayout = 'default' | 'compact' | 'expanded' | 'custom';

interface DashboardFilter {
  period: string;
  department: string;
  region: string;
}

const AdvancedDashboard = () => {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>('default');
  const [filters, setFilters] = useState<DashboardFilter>({
    period: 'Q3_2023',
    department: 'All Departments',
    region: 'All Regions'
  });
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, refetch } = useQuery({
    queryKey: ['/api/dashboard', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        period: filters.period,
        department: filters.department,
        region: filters.region
      });
      
      const response = await fetch(`/api/dashboard?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }
      
      return response.json();
    }
  });
  
  // Handle filter changes
  const handleFilterChange = (filter: Partial<DashboardFilter>) => {
    setFilters(prev => ({ ...prev, ...filter }));
  };
  
  // Generate revenue data for line chart
  const getRevenueData = () => {
    if (!dashboardData?.revenueData) return null;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return [
      {
        id: 'Revenue',
        color: '#3b82f6',
        data: dashboardData.revenueData.map((item: any) => ({
          x: months[new Date(item.date).getMonth()],
          y: parseFloat(item.amount)
        }))
      }
    ];
  };
  
  // Generate expense data for bar chart
  const getExpenseData = () => {
    if (!dashboardData?.expenseData) return null;
    
    // Group expenses by category
    const categories: any = {};
    
    dashboardData.expenseData.forEach((item: any) => {
      const month = new Date(item.date).getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const quarterKey = `Q${quarter}`;
      
      if (!categories[quarterKey]) {
        categories[quarterKey] = {
          category: quarterKey,
          Marketing: 0,
          Sales: 0,
          Operations: 0,
          'Research & Development': 0,
          Administration: 0
        };
      }
      
      // Add to the appropriate category
      if (categories[quarterKey][item.category]) {
        categories[quarterKey][item.category] += parseFloat(item.amount);
      }
    });
    
    return Object.values(categories);
  };
  
  // Generate department allocation data for pie chart
  const getDepartmentData = () => {
    if (!dashboardData?.expenseData) return null;
    
    // Sum expenses by department
    const departments: Record<string, number> = {};
    
    dashboardData.expenseData.forEach((item: any) => {
      if (!departments[item.category]) {
        departments[item.category] = 0;
      }
      
      departments[item.category] += parseFloat(item.amount);
    });
    
    // Convert to pie chart format
    return Object.entries(departments).map(([id, value]) => ({
      id,
      label: id,
      value
    }));
  };
  
  // Layout configurations for different display modes
  const getLayoutConfig = () => {
    switch (currentLayout) {
      case 'compact':
        return {
          mainChartHeight: 300,
          secondaryChartHeight: 200,
          mainColSpan: 'col-span-12',
          secondaryColSpan: 'col-span-6'
        };
      case 'expanded':
        return {
          mainChartHeight: 500,
          secondaryChartHeight: 400,
          mainColSpan: 'col-span-12',
          secondaryColSpan: 'col-span-12'
        };
      case 'custom':
        return {
          mainChartHeight: 350,
          secondaryChartHeight: 300,
          mainColSpan: 'col-span-8',
          secondaryColSpan: 'col-span-6'
        };
      default:
        return {
          mainChartHeight: 400,
          secondaryChartHeight: 300,
          mainColSpan: 'col-span-12',
          secondaryColSpan: 'col-span-6'
        };
    }
  };
  
  const layoutConfig = getLayoutConfig();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Advanced Financial Dashboard</h1>
          <p className="text-neutral-600">
            Interactive data visualization with drill-down capabilities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={currentLayout} onValueChange={(value: string) => setCurrentLayout(value as DashboardLayout)}>
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
          
          <Button variant="outline" onClick={() => refetch()} disabled={isDashboardLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Filters & Controls</CardTitle>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select 
              value={filters.period} 
              onValueChange={(value) => handleFilterChange({ period: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1_2023">Q1 2023</SelectItem>
                <SelectItem value="Q2_2023">Q2 2023</SelectItem>
                <SelectItem value="Q3_2023">Q3 2023</SelectItem>
                <SelectItem value="Q4_2023">Q4 2023</SelectItem>
                <SelectItem value="Q1_2024">Q1 2024</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.department} 
              onValueChange={(value) => handleFilterChange({ department: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Research & Development">Research & Development</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.region} 
              onValueChange={(value) => handleFilterChange({ region: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Regions">All Regions</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Latin America">Latin America</SelectItem>
                <SelectItem value="Oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {dashboardData && (
            <div className="mt-4 flex flex-wrap gap-6">
              {dashboardData.kpis.slice(0, 4).map((kpi: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className={`px-2 py-1 ${
                    kpi.type === 'revenue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    kpi.type === 'expense' ? 'bg-red-50 text-red-700 border-red-200' :
                    kpi.type === 'profit' ? 'bg-green-50 text-green-700 border-green-200' :
                    'bg-purple-50 text-purple-700 border-purple-200'
                  }`}>
                    {kpi.type}
                  </Badge>
                  <span className="font-medium">{kpi.value}</span>
                  {kpi.change && (
                    <span className={`text-xs ${
                      parseFloat(kpi.change) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main chart */}
        <div className={layoutConfig.mainColSpan}>
          <AdvancedChart
            title="Revenue Performance"
            description="Monthly revenue with trend analysis and projections"
            data={getRevenueData()}
            type="line"
            height={layoutConfig.mainChartHeight}
            isLoading={isDashboardLoading}
            showControls={true}
            enableDrilldown={true}
            allowComparison={true}
          />
        </div>
        
        {/* Secondary charts */}
        <div className={layoutConfig.secondaryColSpan}>
          <AdvancedChart
            title="Quarterly Expenses"
            description="Expense breakdown by category and quarter"
            data={getExpenseData()}
            type="bar"
            height={layoutConfig.secondaryChartHeight}
            isLoading={isDashboardLoading}
            enableDrilldown={true}
          />
        </div>
        
        <div className={layoutConfig.secondaryColSpan}>
          <AdvancedChart
            title="Department Allocation"
            description="Budget allocation by department"
            data={getDepartmentData()}
            type="pie"
            height={layoutConfig.secondaryChartHeight}
            isLoading={isDashboardLoading}
            enableDrilldown={true}
          />
        </div>
        
        {/* Custom widget area - shows only in custom layout */}
        {currentLayout === 'custom' && (
          <div className="col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Custom Analysis</CardTitle>
                <CardDescription>
                  Personalized metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Add your own widgets here</p>
                    <Button variant="outline" size="sm">
                      <PanelRight className="h-4 w-4 mr-2" />
                      Add Widget
                    </Button>
                  </div>
                  
                  {dashboardData?.activities && (
                    <div>
                      <h4 className="font-medium mb-2">Recent Activities</h4>
                      <ul className="space-y-3">
                        {dashboardData.activities.slice(0, 3).map((activity: any, index: number) => (
                          <li key={index} className="text-sm">
                            <div className="flex items-center text-muted-foreground mb-1">
                              <span>{new Date(activity.date).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <Badge variant="outline" className="text-xs font-normal">{activity.type}</Badge>
                            </div>
                            <div>{activity.description}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedDashboard;