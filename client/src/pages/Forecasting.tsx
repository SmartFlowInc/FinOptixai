import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialForecast from "@/components/dashboard/FinancialForecast";
import CashFlowForecast from "@/components/dashboard/CashFlowForecast";
import { useQuery } from "@tanstack/react-query";
import { ForecastData, CashFlowData } from "@shared/schema";
import QuickFilters from "@/components/filters/QuickFilters";
import { defaultFilters } from "@/data/finance";

const Forecasting = () => {
  const [filters, setFilters] = useState({
    period: defaultFilters.period,
    department: defaultFilters.department,
    region: defaultFilters.region
  });
  
  const [forecastTimeframe, setForecastTimeframe] = useState<string>("6_months");
  
  const { data: forecastData, isLoading: forecastLoading } = useQuery<ForecastData>({
    queryKey: ["/api/forecast", filters.period, forecastTimeframe],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        period: filters.period,
        timeframe: forecastTimeframe
      });
      
      const response = await fetch(`/api/forecast?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      
      return response.json();
    }
  });
  
  const { data: cashFlowData, isLoading: cashFlowLoading } = useQuery<CashFlowData>({
    queryKey: ["/api/cashflow", filters.period],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        period: filters.period
      });
      
      const response = await fetch(`/api/cashflow?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cash flow data');
      }
      
      return response.json();
    }
  });
  
  const handleFilterChange = (type: 'period' | 'department' | 'region', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleTimeframeChange = (timeframe: string) => {
    setForecastTimeframe(timeframe);
  };

  return (
    <>
      <QuickFilters 
        period={filters.period}
        department={filters.department}
        region={filters.region}
        onFilterChange={handleFilterChange}
      />
      
      <Tabs defaultValue="financials" className="mb-6">
        <TabsList>
          <TabsTrigger value="financials">Financial Forecasts</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow Analysis</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financials" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Financial Projection</CardTitle>
                <CardDescription>Projected revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {forecastData && (
                  <FinancialForecast 
                    forecastData={forecastData} 
                    isLoading={forecastLoading}
                    onTimeframeChange={handleTimeframeChange}
                  />
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Key Drivers</CardTitle>
                <CardDescription>Factors influencing your financial forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <p className="text-muted-foreground mb-4">Advanced driver analysis coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cashflow" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Cash Flow Projection</CardTitle>
                <CardDescription>Projected cash position and runway</CardDescription>
              </CardHeader>
              <CardContent>
                {cashFlowData && (
                  <CashFlowForecast 
                    cashFlowData={cashFlowData} 
                    isLoading={cashFlowLoading}
                  />
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Working Capital Analysis</CardTitle>
                <CardDescription>Cash conversion cycle and working capital requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <p className="text-muted-foreground mb-4">Working capital analysis coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="scenarios" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Planning</CardTitle>
              <CardDescription>Create and compare different financial scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <p className="text-muted-foreground mb-4">Scenario planning tools coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Forecasting;
