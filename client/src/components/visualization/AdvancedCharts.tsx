import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Download, ExternalLink, Filter, Info, RefreshCw, TrendingDown, TrendingUp, ZoomIn } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types
type ChartType = 'line' | 'bar' | 'pie';
type TimeRange = 'monthly' | 'quarterly' | 'yearly';
type ComparisonType = 'previous_period' | 'budget' | 'forecast' | 'none';

interface DataPoint {
  x: string | number;
  y: number;
  [key: string]: any;
}

interface AdvancedChartProps {
  title: string;
  description?: string;
  data: any;
  type?: ChartType;
  height?: number;
  isLoading?: boolean;
  showControls?: boolean;
  enableDrilldown?: boolean;
  metric?: string;
  currency?: string;
  allowComparison?: boolean;
  showDownload?: boolean;
  onFilterChange?: (filter: any) => void;
}

// Utility functions
const formatCurrency = (value: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

// Colors for charts
const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Mock data for drill down example
const generateDrilldownData = (category: string, month: string) => {
  const subcategories = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  
  return {
    subcategories: subcategories.map(subcategory => ({
      id: subcategory,
      value: Math.round(Math.random() * 100000),
      description: `${subcategory} performance for ${month}`
    })),
    trends: Array.from({ length: 30 }, (_, i) => ({
      x: i + 1,
      y: Math.round(Math.random() * 10000 + 5000)
    })),
    summary: {
      total: Math.round(Math.random() * 500000 + 100000),
      change: (Math.random() * 20 - 10).toFixed(2),
      performance: Math.random() > 0.5 ? 'above_target' : 'below_target'
    }
  };
};

// Default chart settings
const defaultLineChartSettings = {
  margin: { top: 20, right: 20, bottom: 50, left: 60 },
  pointSize: 6,
  pointBorderWidth: 1,
  pointBorderColor: { from: 'serieColor' },
  pointLabelYOffset: -12,
  enableSlices: 'x',
  enableArea: true,
  areaOpacity: 0.1,
  useMesh: true,
  enableCrosshair: true,
  crosshairType: 'x',
  legends: [
    {
      anchor: 'bottom',
      direction: 'row',
      justify: false,
      translateX: 0,
      translateY: 50,
      itemsSpacing: 0,
      itemDirection: 'left-to-right',
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: 'circle',
      symbolBorderColor: 'rgba(0, 0, 0, .5)',
    }
  ]
};

const defaultBarChartSettings = {
  margin: { top: 20, right: 20, bottom: 50, left: 60 },
  padding: 0.3,
  valueScale: { type: 'linear' },
  indexScale: { type: 'band', round: true },
  colors: chartColors,
  borderColor: { from: 'color', modifiers: [['darker', 1.6]] },
  axisTop: null,
  axisRight: null,
  axisBottom: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'category',
    legendPosition: 'middle',
    legendOffset: 32,
  },
  axisLeft: {
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'value',
    legendPosition: 'middle',
    legendOffset: -40,
  },
  labelSkipWidth: 12,
  labelSkipHeight: 12,
  labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] },
  legends: [
    {
      dataFrom: 'keys',
      anchor: 'bottom',
      direction: 'row',
      justify: false,
      translateX: 0,
      translateY: 50,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: 'left-to-right',
      itemOpacity: 0.85,
      symbolSize: 20,
      effects: [
        {
          on: 'hover',
          style: {
            itemOpacity: 1,
          },
        },
      ],
    },
  ],
};

const defaultPieChartSettings = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  innerRadius: 0.5,
  padAngle: 0.7,
  cornerRadius: 3,
  activeOuterRadiusOffset: 8,
  colors: chartColors,
  borderWidth: 1,
  borderColor: { from: 'color', modifiers: [['darker', 0.2]] },
  arcLinkLabelsSkipAngle: 10,
  arcLinkLabelsTextColor: '#333333',
  arcLinkLabelsThickness: 2,
  arcLinkLabelsColor: { from: 'color' },
  arcLabelsSkipAngle: 10,
  arcLabelsTextColor: { from: 'color', modifiers: [['darker', 2]] },
  legends: [
    {
      anchor: 'right',
      direction: 'column',
      justify: false,
      translateX: 0,
      translateY: 0,
      itemsSpacing: 0,
      itemWidth: 100,
      itemHeight: 20,
      itemTextColor: '#999',
      itemDirection: 'left-to-right',
      itemOpacity: 1,
      symbolSize: 18,
      symbolShape: 'circle',
    },
  ],
};

// Main component
const AdvancedChart: React.FC<AdvancedChartProps> = ({
  title,
  description,
  data,
  type = 'line',
  height = 400,
  isLoading = false,
  showControls = true,
  enableDrilldown = true,
  metric = 'value',
  currency = 'USD',
  allowComparison = true,
  showDownload = true,
  onFilterChange
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [comparison, setComparison] = useState<ComparisonType>('none');
  const [drilldownData, setDrilldownData] = useState<any>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  
  // Mock data for example (replace with real data from props)
  const mockLineData = [
    {
      id: 'Revenue',
      color: chartColors[0],
      data: [
        { x: 'Jan', y: 120000 },
        { x: 'Feb', y: 150000 },
        { x: 'Mar', y: 180000 },
        { x: 'Apr', y: 220000 },
        { x: 'May', y: 200000 },
        { x: 'Jun', y: 240000 },
        { x: 'Jul', y: 280000 },
        { x: 'Aug', y: 260000 },
        { x: 'Sep', y: 300000 },
        { x: 'Oct', y: 320000 },
        { x: 'Nov', y: 360000 },
        { x: 'Dec', y: 400000 }
      ]
    },
    {
      id: 'Expenses',
      color: chartColors[1],
      data: [
        { x: 'Jan', y: 80000 },
        { x: 'Feb', y: 100000 },
        { x: 'Mar', y: 90000 },
        { x: 'Apr', y: 110000 },
        { x: 'May', y: 120000 },
        { x: 'Jun', y: 130000 },
        { x: 'Jul', y: 140000 },
        { x: 'Aug', y: 150000 },
        { x: 'Sep', y: 170000 },
        { x: 'Oct', y: 180000 },
        { x: 'Nov', y: 190000 },
        { x: 'Dec', y: 210000 }
      ]
    }
  ];
  
  const mockBarData = [
    { category: 'Q1', Revenue: 450000, Expenses: 270000, Profit: 180000 },
    { category: 'Q2', Revenue: 660000, Expenses: 360000, Profit: 300000 },
    { category: 'Q3', Revenue: 840000, Expenses: 460000, Profit: 380000 },
    { category: 'Q4', Revenue: 1080000, Expenses: 580000, Profit: 500000 }
  ];
  
  const mockPieData = [
    { id: 'Marketing', value: 35 },
    { id: 'Sales', value: 25 },
    { id: 'Operations', value: 20 },
    { id: 'R&D', value: 15 },
    { id: 'Administration', value: 5 }
  ];
  
  // Get data based on chart type
  const chartData = data || (
    type === 'line' ? mockLineData : 
    type === 'bar' ? mockBarData : 
    mockPieData
  );
  
  // Handle drill down interaction
  const handleDrilldown = (point: any) => {
    if (!enableDrilldown) return;
    
    let category, value, month;
    
    if (type === 'line') {
      category = point.serieId;
      month = point.data.x;
      value = point.data.y;
    } else if (type === 'bar') {
      category = Object.keys(point.data).find(key => key !== 'category' && key !== 'index');
      month = point.data.category;
      value = point.data[category as string];
    } else {
      category = point.id;
      month = 'Current Period';
      value = point.value;
    }
    
    // Generate drill down data
    const drillData = generateDrilldownData(category, month);
    
    setDrilldownData({
      category,
      month,
      value,
      ...drillData
    });
    
    setIsDrilldownOpen(true);
  };
  
  // Render different chart types
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveLine
            data={chartData}
            {...defaultLineChartSettings}
            onClick={handleDrilldown}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
          />
        );
      case 'bar':
        return (
          <ResponsiveBar
            data={chartData}
            keys={['Revenue', 'Expenses', 'Profit']}
            indexBy="category"
            {...defaultBarChartSettings}
            onClick={handleDrilldown}
          />
        );
      case 'pie':
        return (
          <ResponsivePie
            data={chartData}
            {...defaultPieChartSettings}
            onClick={handleDrilldown}
          />
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
    if (onFilterChange) {
      onFilterChange({ timeRange: value });
    }
  };
  
  const handleComparisonChange = (value: string) => {
    setComparison(value as ComparisonType);
    if (onFilterChange) {
      onFilterChange({ comparison: value });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          
          {showControls && (
            <div className="flex space-x-2">
              {allowComparison && (
                <Select value={comparison} onValueChange={handleComparisonChange}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue placeholder="Compare to" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Comparison</SelectItem>
                    <SelectItem value="previous_period">Previous Period</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="forecast">Forecast</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Chart Options</h4>
                      <p className="text-sm text-muted-foreground">
                        Customize the visualization
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {/* Chart customization options */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="showLegend">Show Legend</label>
                        <input
                          id="showLegend"
                          type="checkbox"
                          className="col-span-2 h-4 w-4"
                          defaultChecked
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="showGridLines">Grid Lines</label>
                        <input
                          id="showGridLines"
                          type="checkbox"
                          className="col-span-2 h-4 w-4"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {showDownload && (
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <RefreshCw className="animate-spin h-8 w-8 text-primary/70" />
          </div>
        ) : (
          <div style={{ height: `${height}px` }}>
            {renderChart()}
          </div>
        )}
        
        {/* Comparison summary */}
        {comparison !== 'none' && !isLoading && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Comparison Summary:</span>
              <Badge variant="outline" className="ml-2">
                {comparison === 'previous_period' ? 'vs Previous Period' : 
                 comparison === 'budget' ? 'vs Budget' : 'vs Forecast'}
              </Badge>
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-sm mr-2">Performance:</span>
              {Math.random() > 0.5 ? (
                <span className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.5% {comparison === 'budget' ? 'above budget' : comparison === 'forecast' ? 'above forecast' : 'improvement'}</span>
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>-8.3% {comparison === 'budget' ? 'below budget' : comparison === 'forecast' ? 'below forecast' : 'decline'}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Drill down dialog */}
      <Dialog open={isDrilldownOpen} onOpenChange={setIsDrilldownOpen}>
        <DialogContent className="max-w-3xl">
          {drilldownData && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {drilldownData.category} Details - {drilldownData.month}
                </DialogTitle>
                <DialogDescription>
                  Detailed analysis and breakdown of {drilldownData.category.toLowerCase()} data
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-semibold text-primary">{formatCurrency(drilldownData.summary.total, currency)}</div>
                </div>
                
                <div className={`p-4 rounded-lg text-center ${parseInt(drilldownData.summary.change) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="text-sm text-muted-foreground">Change</div>
                  <div className={`text-2xl font-semibold flex items-center justify-center ${parseInt(drilldownData.summary.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseInt(drilldownData.summary.change) >= 0 ? (
                      <TrendingUp className="h-5 w-5 mr-1" />
                    ) : (
                      <TrendingDown className="h-5 w-5 mr-1" />
                    )}
                    {drilldownData.summary.change}%
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg text-center ${drilldownData.summary.performance === 'above_target' ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <div className="text-sm text-muted-foreground">Performance</div>
                  <div className={`text-2xl font-semibold ${drilldownData.summary.performance === 'above_target' ? 'text-green-600' : 'text-amber-600'}`}>
                    {drilldownData.summary.performance === 'above_target' ? 'Above Target' : 'Below Target'}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Tabs defaultValue="breakdown">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  <TabsTrigger value="trend">Daily Trend</TabsTrigger>
                  <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="breakdown" className="pt-4">
                  <div className="h-[250px]">
                    <ResponsivePie
                      data={drilldownData.subcategories.map((item: any) => ({
                        id: item.id,
                        label: item.id,
                        value: item.value
                      }))}
                      {...defaultPieChartSettings}
                      innerRadius={0.4}
                      legends={[]}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {drilldownData.subcategories.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">{item.id}</span>
                        <span>{formatCurrency(item.value, currency)}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="trend" className="pt-4">
                  <div className="h-[300px]">
                    <ResponsiveLine
                      data={[
                        {
                          id: 'Daily Trend',
                          color: chartColors[0],
                          data: drilldownData.trends
                        }
                      ]}
                      {...defaultLineChartSettings}
                      margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                      xScale={{ type: 'point' }}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Day',
                        legendOffset: 36,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Value',
                        legendOffset: -60,
                        legendPosition: 'middle'
                      }}
                    />
                  </div>
                  <Alert className="mt-4">
                    <AlertDescription>
                      <span className="font-medium">Analysis:</span> Daily trend shows {Math.random() > 0.5 ? 'consistent growth' : 'fluctuating performance'} 
                      with {Math.random() > 0.5 ? 'peak performance mid-month' : 'strong finish at month end'}.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
                
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Performance Factors</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Market conditions showing {Math.random() > 0.5 ? 'favorable' : 'challenging'} environment</li>
                        <li>{Math.random() > 0.5 ? 'Increased' : 'Decreased'} competition in primary market segments</li>
                        <li>Operational efficiency {Math.random() > 0.5 ? 'improvements' : 'challenges'} affecting margins</li>
                        <li>Pricing strategy {Math.random() > 0.5 ? 'effectively positioned' : 'requires adjustment'} against competitors</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Consider {Math.random() > 0.5 ? 'expanding' : 'optimizing'} resource allocation</li>
                        <li>Review {Math.random() > 0.5 ? 'pricing strategy' : 'operational processes'} to improve performance</li>
                        <li>Explore opportunities in {Math.random() > 0.5 ? 'emerging' : 'adjacent'} market segments</li>
                        <li>Implement {Math.random() > 0.5 ? 'performance tracking' : 'regular reviews'} to monitor progress</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Related Metrics</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Conversion Rate</Badge>
                        <Badge variant="outline">Customer Acquisition Cost</Badge>
                        <Badge variant="outline">Operational Efficiency</Badge>
                        <Badge variant="outline">Market Share</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="gap-2" size="sm">
                  <ExternalLink className="h-4 w-4" />
                  Export Analysis
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdvancedChart;