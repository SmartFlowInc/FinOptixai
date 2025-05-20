import React, { useState, useCallback } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardCard from '@/components/ui/dashboard-card';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';

import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  MoreHorizontal, 
  Maximize2, 
  Info, 
  Calendar 
} from 'lucide-react';

interface RevenueChartData {
  id: string;
  data: Array<{
    x: string | number;
    y: number;
  }>;
}

interface EnhancedRevenueChartProps {
  data?: RevenueChartData[];
  isLoading?: boolean;
  title?: string;
  description?: string;
  height?: number;
  onTimeframeChange?: (timeframe: string) => void;
  className?: string;
}

const EnhancedRevenueChart: React.FC<EnhancedRevenueChartProps> = ({
  data,
  isLoading = false,
  title = 'Revenue Trend',
  description = 'Performance over time',
  height = 360,
  onTimeframeChange,
  className
}) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Default data if none provided
  const defaultData: RevenueChartData[] = [
    {
      id: 'Actual Revenue',
      data: [
        { x: 'Jan', y: 1200000 },
        { x: 'Feb', y: 950000 },
        { x: 'Mar', y: 1300000 },
        { x: 'Apr', y: 1450000 },
        { x: 'May', y: 1250000 },
        { x: 'Jun', y: 1650000 }
      ]
    },
    {
      id: 'Projected Revenue',
      data: [
        { x: 'Jan', y: 1150000 },
        { x: 'Feb', y: 1000000 },
        { x: 'Mar', y: 1250000 },
        { x: 'Apr', y: 1400000 },
        { x: 'May', y: 1300000 },
        { x: 'Jun', y: 1600000 },
        { x: 'Jul', y: 1700000 },
        { x: 'Aug', y: 1800000 }
      ]
    },
    {
      id: 'Previous Year',
      data: [
        { x: 'Jan', y: 950000 },
        { x: 'Feb', y: 850000 },
        { x: 'Mar', y: 1000000 },
        { x: 'Apr', y: 1100000 },
        { x: 'May', y: 1050000 },
        { x: 'Jun', y: 1200000 }
      ]
    }
  ];
  
  // Use provided data or fallback to default
  const chartData = data || defaultData;
  
  // Handle timeframe changes
  const handleTimeframeChange = useCallback((value: string) => {
    setTimeframe(value as 'monthly' | 'quarterly' | 'yearly');
    if (onTimeframeChange) {
      onTimeframeChange(value);
    }
  }, [onTimeframeChange]);
  
  // Custom formatter for financial values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: value >= 1000000 ? 'compact' : 'standard'
    }).format(value);
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ point }: any) => {
    const data = point.data;
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border border-neutral-200 max-w-xs">
        <div className="text-sm font-semibold text-neutral-900 mb-1">
          {data.x}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: point.serieColor }}
          />
          <div className="text-xs text-neutral-500">{point.serieId}</div>
        </div>
        <div className="text-base font-bold text-neutral-900">
          {formatCurrency(data.y)}
        </div>
        
        {/* Only show comparison if it's not the first point */}
        {point.index > 0 && point.data.y !== 0 && (
          <div className="text-xs text-neutral-500 mt-1">
            {((point.data.y / point.serie.data[point.index - 1].y - 1) * 100).toFixed(1)}% vs previous
          </div>
        )}
      </div>
    );
  };
  
  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: isDark ? '#e5e5e5' : '#737373',
          fontSize: 11
        }
      },
      legend: {
        text: {
          fill: isDark ? '#e5e5e5' : '#737373',
          fontSize: 12,
          fontWeight: 500
        }
      }
    },
    grid: {
      line: {
        stroke: isDark ? '#262626' : '#f5f5f5',
        strokeWidth: 1
      }
    },
    crosshair: {
      line: {
        stroke: isDark ? '#525252' : '#a3a3a3',
        strokeWidth: 1,
        strokeOpacity: 0.5
      }
    },
    tooltip: {
      container: {
        backgroundColor: isDark ? '#262626' : '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 6
      }
    }
  };
  
  // Additional options based on timeframe
  const headerAction = (
    <div className="flex items-center gap-2">
      <Tabs value={timeframe} onValueChange={handleTimeframeChange}>
        <TabsList className="grid w-[270px] grid-cols-3">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Maximize2 className="h-4 w-4 mr-2" />
            View full screen
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="h-4 w-4 mr-2" />
            Custom date range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Revenue data with projections and comparison to previous year.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
  
  const formatTick = (tick: string | number) => {
    if (timeframe === 'monthly') {
      return String(tick).substring(0, 3);
    }
    if (timeframe === 'quarterly') {
      return `Q${tick}`;
    }
    return tick;
  };
  
  return (
    <DashboardCard
      title={title}
      description={description}
      className={className}
      isLoading={isLoading}
      minHeight={height}
      headerAction={headerAction}
    >
      <div style={{ height }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 40, right: 40, bottom: 60, left: 70 }}
          xScale={{ 
            type: 'point',
            padding: 0.5
          }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          yFormat={value => formatCurrency(Number(value))}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: formatTick,
            legend: '',
            legendOffset: 36,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Revenue',
            legendOffset: -50,
            legendPosition: 'middle',
            format: value => 
              `${Math.abs(value) >= 1000000 
                ? `$${(value / 1000000).toFixed(1)}M` 
                : `$${(value / 1000).toFixed(0)}K`}`
          }}
          theme={chartTheme}
          colors={['#3B82F6', '#93C5FD', '#9CA3AF']}
          lineWidth={3}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={true}
          areaOpacity={0.1}
          useMesh={true}
          enableSlices="x"
          sliceTooltip={CustomTooltip}
          enableGridX={false}
          gridYValues={5}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 50,
              itemsSpacing: 20,
              itemDirection: 'left-to-right',
              itemWidth: 100,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 10,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .3)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </DashboardCard>
  );
};

export default EnhancedRevenueChart;