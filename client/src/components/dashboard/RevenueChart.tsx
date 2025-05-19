import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RevenueData } from "@shared/schema";

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading = false }) => {
  const [viewMode, setViewMode] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  
  // Format the data for the chart
  const chartData = data.map(item => ({
    name: item.period.split('_')[1], // Extract month from period (e.g., "Jul" from "Q3_Jul")
    "Actual Revenue": Number(item.actualRevenue) / 1000, // Convert to K (thousands)
    "Projected Revenue": Number(item.projectedRevenue) / 1000,
    "Previous Year": Number(item.previousYearRevenue) / 1000
  }));

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-neutral-500">Revenue Trend</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'Monthly' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setViewMode('Monthly')}
            className="px-3 py-1 rounded text-xs font-medium h-auto"
          >
            Monthly
          </Button>
          <Button 
            variant={viewMode === 'Quarterly' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setViewMode('Quarterly')}
            className="px-3 py-1 rounded text-xs font-medium h-auto"
          >
            Quarterly
          </Button>
          <Button 
            variant={viewMode === 'Yearly' ? "secondary" : "ghost"} 
            size="sm"
            onClick={() => setViewMode('Yearly')}
            className="px-3 py-1 rounded text-xs font-medium h-auto"
          >
            Yearly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-neutral-400">Loading chart data...</p>
          </div>
        ) : (
          <>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}K`} />
                  <Tooltip formatter={(value) => `$${value}K`} />
                  <Legend />
                  <Bar dataKey="Actual Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Projected Revenue" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Previous Year" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs text-neutral-400">Actual Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/30"></div>
                <span className="text-xs text-neutral-400">Projected Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neutral-300"></div>
                <span className="text-xs text-neutral-400">Previous Year</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
