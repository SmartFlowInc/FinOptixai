import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RefreshCw } from "lucide-react";
import { CashFlowData } from "@shared/schema";

interface CashFlowForecastProps {
  cashFlowData: CashFlowData;
  isLoading?: boolean;
}

// Sample data for the chart
const cashFlowChartData = [
  { month: "Jan", cash: 1.70 },
  { month: "Feb", cash: 1.75 },
  { month: "Mar", cash: 1.85 },
  { month: "Apr", cash: 1.90 },
  { month: "May", cash: 2.00 },
  { month: "Jun", cash: 2.12 },
];

const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ cashFlowData, isLoading = false }) => {
  const formatAmount = (amount: number) => {
    return `$${(amount / 1000000).toFixed(2)}M`;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-neutral-500">Cash Flow Forecast</CardTitle>
        <button className="text-neutral-400 hover:text-neutral-500">
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-neutral-400">Loading cash flow data...</p>
          </div>
        ) : (
          <>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}M`} />
                  <Tooltip formatter={(value) => [`$${value}M`, "Cash"]} />
                  <Area 
                    type="monotone" 
                    dataKey="cash" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorCash)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-neutral-100 p-3 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">Current Cash</p>
                <p className="text-base font-semibold text-neutral-500 font-mono">
                  {formatAmount(Number(cashFlowData?.currentCash))}
                </p>
              </div>
              <div className="bg-neutral-100 p-3 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">Q4 Projection</p>
                <p className="text-base font-semibold text-[#2ECC71] font-mono">
                  {formatAmount(Number(cashFlowData?.projectedCash))}
                </p>
              </div>
              <div className="bg-neutral-100 p-3 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">Burn Rate</p>
                <p className="text-base font-semibold text-neutral-500 font-mono">
                  ${(Number(cashFlowData?.burnRate) / 1000).toFixed(0)}K/mo
                </p>
              </div>
              <div className="bg-neutral-100 p-3 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">Runway</p>
                <p className="text-base font-semibold text-[#F39C12] font-mono">
                  {cashFlowData?.runway} months
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowForecast;
