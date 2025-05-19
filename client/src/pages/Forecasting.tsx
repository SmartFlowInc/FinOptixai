import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Labor Costs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="font-medium">85</div>
                      <div className="text-xs text-neutral-500">impact</div>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2 items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Raw Materials</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="font-medium">75</div>
                      <div className="text-xs text-neutral-500">impact</div>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2 items-center">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Energy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="font-medium">62</div>
                      <div className="text-xs text-neutral-500">impact</div>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2 items-center">
                      <div className="h-3 w-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-medium">Logistics</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="font-medium">58</div>
                      <div className="text-xs text-neutral-500">impact</div>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "58%" }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2 items-center">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Marketing</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="font-medium">45</div>
                      <div className="text-xs text-neutral-500">impact</div>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Full Driver Analysis
                    </Button>
                  </div>
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
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-100">
                      <div className="text-sm text-neutral-500 mb-1">Cash Conversion Cycle</div>
                      <div className="text-2xl font-semibold">38 days</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <i className="ri-arrow-down-line mr-1"></i>
                        <span>↓ 5 days vs previous quarter</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-100">
                      <div className="text-sm text-neutral-500 mb-1">Working Capital Ratio</div>
                      <div className="text-2xl font-semibold">1.8</div>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <i className="ri-arrow-up-line mr-1"></i>
                        <span>↑ 0.2 vs previous quarter</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-3">Cash Conversion Components</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-600">Days Inventory Outstanding</span>
                          <span className="text-neutral-800">25 days</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '62.5%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-600">Days Sales Outstanding</span>
                          <span className="text-neutral-800">32 days</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full">
                          <div className="h-2 bg-orange-500 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-600">Days Payable Outstanding</span>
                          <span className="text-neutral-800">19 days</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '47.5%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-3">Working Capital Forecast (6 months)</div>
                    <div className="h-[150px] w-full bg-neutral-50 border rounded-md p-3 relative">
                      {/* This would be replaced with a real chart in production */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[100px] border-b border-l relative">
                          {/* Simplified line chart representation */}
                          <svg width="100%" height="100%" viewBox="0 0 300 100">
                            <path 
                              d="M0,70 C20,65 40,40 60,35 C80,30 100,45 120,40 C140,35 160,20 180,25 C200,30 220,55 240,50 C260,45 280,30 300,20" 
                              fill="none" 
                              stroke="#3b82f6" 
                              strokeWidth="2" 
                            />
                          </svg>
                          
                          {/* X axis labels */}
                          <div className="absolute -bottom-6 left-0 w-full flex justify-between text-xs text-neutral-500">
                            <span>Nov</span>
                            <span>Dec</span>
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="scenarios" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Scenario Comparison</CardTitle>
                    <CardDescription>Compare different financial scenarios</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Tabs defaultValue="chart" className="w-[200px]">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="chart">Chart</TabsTrigger>
                        <TabsTrigger value="table">Table</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="h-[350px] flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <div className="flex items-end h-64 border-b border-l relative">
                        {/* Base Case */}
                        <div className="absolute bottom-0 left-[20%] w-16 -ml-8">
                          <div className="h-40 w-12 mx-auto bg-primary rounded-t"></div>
                          <p className="text-xs text-center mt-2">Base</p>
                          <p className="text-xs text-center text-neutral-500">$5.8M</p>
                        </div>
                        
                        {/* Optimistic Case */}
                        <div className="absolute bottom-0 left-[50%] w-16 -ml-8">
                          <div className="h-60 w-12 mx-auto bg-green-500 rounded-t"></div>
                          <p className="text-xs text-center mt-2">Optimistic</p>
                          <p className="text-xs text-center text-neutral-500">$8.7M</p>
                        </div>
                        
                        {/* Conservative Case */}
                        <div className="absolute bottom-0 left-[80%] w-16 -ml-8">
                          <div className="h-32 w-12 mx-auto bg-amber-500 rounded-t"></div>
                          <p className="text-xs text-center mt-2">Conservative</p>
                          <p className="text-xs text-center text-neutral-500">$4.6M</p>
                        </div>
                        
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between -translate-x-6">
                          <span className="text-xs text-neutral-500">$10M</span>
                          <span className="text-xs text-neutral-500">$7.5M</span>
                          <span className="text-xs text-neutral-500">$5M</span>
                          <span className="text-xs text-neutral-500">$2.5M</span>
                          <span className="text-xs text-neutral-500">$0</span>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-center">
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-sm"></div>
                            <span className="text-sm">Base</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                            <span className="text-sm">Optimistic</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                            <span className="text-sm">Conservative</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Scenario</CardTitle>
                  <CardDescription>Model different business outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Scenario Name</label>
                      <Input placeholder="Enter scenario name" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Revenue Growth</label>
                      <div className="flex items-center gap-4">
                        <Input type="number" defaultValue="12.5" className="w-20" />
                        <div className="flex-1">
                          <div className="w-full bg-neutral-100 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cost Reduction</label>
                      <div className="flex items-center gap-4">
                        <Input type="number" defaultValue="5.0" className="w-20" />
                        <div className="flex-1">
                          <div className="w-full bg-neutral-100 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Profit Margin</label>
                      <div className="flex items-center gap-4">
                        <Input type="number" defaultValue="24.8" className="w-20" />
                        <div className="flex-1">
                          <div className="w-full bg-neutral-100 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full">
                        Run Scenario
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Scenario Parameters</CardTitle>
                  <CardDescription>Active scenario variables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Timeframe</span>
                      <span className="text-sm">12 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Confidence Level</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Market Growth</span>
                      <span className="text-sm">8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Interest Rate</span>
                      <span className="text-sm">4.25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Inflation Rate</span>
                      <span className="text-sm">2.8%</span>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <Button variant="link" className="text-primary text-sm w-full">
                        Edit Default Parameters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Forecasting;
