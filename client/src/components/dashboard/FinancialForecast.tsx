import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ForecastData } from "@shared/schema";

interface FinancialForecastProps {
  forecastData: ForecastData;
  isLoading?: boolean;
  onTimeframeChange: (timeframe: string) => void;
}

// Sample data for the chart
const sixMonthsData = [
  { month: "Jan", revenue: 4.8, expenses: 3.5 },
  { month: "Feb", revenue: 5.0, expenses: 3.6 },
  { month: "Mar", revenue: 5.2, expenses: 3.7 },
  { month: "Apr", revenue: 5.4, expenses: 3.9 },
  { month: "May", revenue: 5.6, expenses: 4.0 },
  { month: "Jun", revenue: 5.8, expenses: 4.2 },
];

const oneYearData = [
  { month: "Jan", revenue: 4.8, expenses: 3.5 },
  { month: "Feb", revenue: 5.0, expenses: 3.6 },
  { month: "Mar", revenue: 5.2, expenses: 3.7 },
  { month: "Apr", revenue: 5.4, expenses: 3.9 },
  { month: "May", revenue: 5.6, expenses: 4.0 },
  { month: "Jun", revenue: 5.8, expenses: 4.2 },
  { month: "Jul", revenue: 6.0, expenses: 4.3 },
  { month: "Aug", revenue: 6.3, expenses: 4.5 },
  { month: "Sep", revenue: 6.5, expenses: 4.6 },
  { month: "Oct", revenue: 6.8, expenses: 4.8 },
  { month: "Nov", revenue: 7.0, expenses: 5.0 },
  { month: "Dec", revenue: 7.2, expenses: 5.2 },
];

const FinancialForecast: React.FC<FinancialForecastProps> = ({ 
  forecastData, 
  isLoading = false,
  onTimeframeChange 
}) => {
  const [timeframe, setTimeframe] = useState<"6_months" | "1_year">("6_months");
  
  const handleTimeframeChange = (newTimeframe: "6_months" | "1_year") => {
    setTimeframe(newTimeframe);
    onTimeframeChange(newTimeframe);
  };
  
  const chartData = timeframe === "6_months" ? sixMonthsData : oneYearData;
  
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toFixed(1)}M`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-neutral-500">Financial Forecast</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant={timeframe === "6_months" ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => handleTimeframeChange("6_months")}
            className="px-2 py-1 rounded text-xs font-medium h-auto"
          >
            6 Months
          </Button>
          <Button 
            variant={timeframe === "1_year" ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => handleTimeframeChange("1_year")}
            className="px-2 py-1 rounded text-xs font-medium h-auto"
          >
            1 Year
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-neutral-400">Loading forecast data...</p>
          </div>
        ) : (
          <>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}M`} />
                  <Tooltip formatter={(value) => `$${value}M`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="hsl(var(--primary))" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="Expenses" 
                    stroke="hsl(var(--accent))" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">Projected Revenue (EOY)</span>
                <span className="text-sm text-neutral-500 font-mono">
                  {formatAmount(Number(forecastData?.projectedRevenue) / 1000000)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">Projected Expenses (EOY)</span>
                <span className="text-sm text-neutral-500 font-mono">
                  {formatAmount(Number(forecastData?.projectedExpenses) / 1000000)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">Projected Profit Margin</span>
                <span className="text-sm text-[#2ECC71] font-mono">{forecastData?.projectedProfitMargin}%</span>
              </div>
              <div className="h-px bg-neutral-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500 font-medium">Confidence Level</span>
                <span className="text-sm text-primary font-medium">
                  High ({forecastData?.confidenceLevel}%)
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialForecast;
