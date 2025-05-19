import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

// Define the data type for driver analysis
interface DriverAnalysisData {
  id: number;
  category: string;
  impact: number;
  trend: number;
  correlation: number;
  children?: { name: string; value: number }[];
}

// Sample data - in a real app, this would come from your API
const sampleDriverData: DriverAnalysisData[] = [
  {
    id: 1,
    category: "Labor Costs",
    impact: 85,
    trend: 5,
    correlation: 0.92,
    children: [
      { name: "Direct Labor", value: 45 },
      { name: "Indirect Labor", value: 25 },
      { name: "Benefits", value: 15 },
    ]
  },
  {
    id: 2,
    category: "Raw Materials",
    impact: 75,
    trend: -2,
    correlation: 0.88,
    children: [
      { name: "Primary Materials", value: 40 },
      { name: "Secondary Materials", value: 20 },
      { name: "Packaging", value: 15 },
    ]
  },
  {
    id: 3,
    category: "Energy",
    impact: 62,
    trend: 8,
    correlation: 0.76,
    children: [
      { name: "Electricity", value: 35 },
      { name: "Gas", value: 20 },
      { name: "Other Utilities", value: 7 },
    ]
  },
  {
    id: 4,
    category: "Logistics",
    impact: 58,
    trend: 3,
    correlation: 0.71,
    children: [
      { name: "Inbound Freight", value: 25 },
      { name: "Outbound Freight", value: 20 },
      { name: "Warehousing", value: 13 },
    ]
  },
  {
    id: 5,
    category: "Marketing",
    impact: 45,
    trend: 1,
    correlation: 0.65,
    children: [
      { name: "Digital", value: 20 },
      { name: "Traditional", value: 15 },
      { name: "Events", value: 10 },
    ]
  },
];

// Correlation data for scatter plot
const correlationData = sampleDriverData.map(item => ({
  name: item.category,
  impact: item.impact,
  correlation: item.correlation * 100,
  z: 10,
}));

// Data for trend analysis
const trendData = [
  { month: "Jan", laborCosts: 40, rawMaterials: 35, energy: 20, logistics: 25, marketing: 15 },
  { month: "Feb", laborCosts: 42, rawMaterials: 33, energy: 22, logistics: 26, marketing: 16 },
  { month: "Mar", laborCosts: 45, rawMaterials: 32, energy: 24, logistics: 27, marketing: 17 },
  { month: "Apr", laborCosts: 48, rawMaterials: 31, energy: 26, logistics: 28, marketing: 17 },
  { month: "May", laborCosts: 51, rawMaterials: 30, energy: 28, logistics: 29, marketing: 18 },
  { month: "Jun", laborCosts: 53, rawMaterials: 29, energy: 30, logistics: 30, marketing: 18 },
];

interface DriverAnalysisProps {
  isLoading?: boolean;
}

const DriverAnalysis: React.FC<DriverAnalysisProps> = ({ isLoading = false }) => {
  const [activeTab, setActiveTab] = useState("impact");
  const [metricType, setMetricType] = useState("profitability");
  const [viewType, setViewType] = useState("chart");
  const [timeframe, setTimeframe] = useState("6_months");
  
  // For loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-neutral-200 h-6 w-48 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-neutral-200 h-4 w-64 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-neutral-200 h-64 w-full rounded"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Advanced Driver Analysis</CardTitle>
            <CardDescription>
              Identify key factors influencing financial performance
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={metricType} onValueChange={setMetricType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profitability">Profitability</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="costs">Costs</SelectItem>
                <SelectItem value="cashflow">Cash Flow</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3_months">Last 3 Months</SelectItem>
                <SelectItem value="6_months">Last 6 Months</SelectItem>
                <SelectItem value="12_months">Last 12 Months</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
              <TabsTrigger value="correlation">Correlation</TabsTrigger>
              <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewType === "chart" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("chart")}
              >
                Chart
              </Button>
              <Button
                variant={viewType === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("table")}
              >
                Table
              </Button>
            </div>
          </div>
          
          <TabsContent value="impact">
            {viewType === "chart" ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={sampleDriverData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis label={{ value: 'Impact Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value) => [`${value} points`, 'Impact']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="impact" 
                    fill="#8884d8" 
                    name="Impact Score"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-y">
                      <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Impact Score</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Trend</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Correlation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sampleDriverData.map((driver) => (
                      <tr key={driver.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4 font-medium">{driver.category}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end">
                            <div className="w-16 bg-neutral-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${driver.impact}%` }}
                              ></div>
                            </div>
                            <span>{driver.impact}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={driver.trend >= 0 ? "text-green-600" : "text-red-600"}>
                            {driver.trend >= 0 ? `+${driver.trend}%` : `${driver.trend}%`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">{driver.correlation.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-sm text-neutral-500">
              <p>* Impact scores indicate the relative influence of each factor on {metricType} for the selected period</p>
            </div>
          </TabsContent>
          
          <TabsContent value="correlation">
            {viewType === "chart" ? (
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="impact" 
                    name="Impact Score" 
                    label={{ value: 'Impact Score', position: 'bottom' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="correlation" 
                    name="Correlation" 
                    label={{ value: 'Correlation (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name, props) => {
                      if (name === 'Correlation') return [`${typeof value === 'number' ? value.toFixed(0) : value}%`, name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Scatter 
                    name="Drivers" 
                    data={correlationData} 
                    fill="#8884d8"
                    isAnimationActive={true}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-y">
                      <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Impact Score</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Correlation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {correlationData.map((item, index) => (
                      <tr key={index} className="hover:bg-neutral-50">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-right">{item.impact}</td>
                        <td className="py-3 px-4 text-right">{item.correlation.toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-sm text-neutral-500">
              <p>* Correlation indicates statistical relationship between the driver and overall {metricType}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="trend">
            {viewType === "chart" ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Value Index (Base 100)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="laborCosts" stroke="#8884d8" name="Labor Costs" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="rawMaterials" stroke="#82ca9d" name="Raw Materials" />
                  <Line type="monotone" dataKey="energy" stroke="#ffc658" name="Energy" />
                  <Line type="monotone" dataKey="logistics" stroke="#ff8042" name="Logistics" />
                  <Line type="monotone" dataKey="marketing" stroke="#0088fe" name="Marketing" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-y">
                      <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">Month</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Labor Costs</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Raw Materials</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Energy</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Logistics</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500">Marketing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {trendData.map((item, index) => (
                      <tr key={index} className="hover:bg-neutral-50">
                        <td className="py-3 px-4 font-medium">{item.month}</td>
                        <td className="py-3 px-4 text-right">{item.laborCosts}</td>
                        <td className="py-3 px-4 text-right">{item.rawMaterials}</td>
                        <td className="py-3 px-4 text-right">{item.energy}</td>
                        <td className="py-3 px-4 text-right">{item.logistics}</td>
                        <td className="py-3 px-4 text-right">{item.marketing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-sm text-neutral-500">
              <p>* Trend shows how each cost driver has changed over time (indexed values)</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {sampleDriverData.map((driver) => (
              <div key={driver.id} className="border rounded-lg p-3">
                <div className="text-sm font-medium mb-1">{driver.category}</div>
                <div className="flex flex-col">
                  {driver.children?.map((child, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                      <span className="text-neutral-500">{child.name}</span>
                      <span>{child.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverAnalysis;