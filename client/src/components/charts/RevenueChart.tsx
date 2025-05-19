import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface RevenueChartData {
  id: string;
  data: Array<{
    x: string | number;
    y: number;
  }>;
}

interface RevenueChartProps {
  data?: RevenueChartData[];
  isLoading?: boolean;
  title?: string;
  height?: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  isLoading = false,
  title = 'Revenue Trend',
  height = 300
}) => {
  const [view, setView] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  // Default mock data if none provided (following FinOptix styling)
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
        { x: 'Jun', y: 1200000 },
        { x: 'Jul', y: 1300000 },
        { x: 'Aug', y: 1350000 }
      ]
    }
  ];
  
  // Use provided data or fallback to default
  const chartData = data || defaultData;
  
  // Return loading state if needed
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Tabs value={view} onValueChange={(v) => setView(v as any)}>
          <TabsList className="grid w-[270px] grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            yFormat=" >-$.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Revenue',
              legendOffset: -60,
              legendPosition: 'middle',
              format: (value) => 
                `$${Math.abs(value) >= 1000000 
                  ? `${(value / 1000000).toFixed(1)}M` 
                  : `${(value / 1000).toFixed(0)}K`}`
            }}
            colors={['#3498db', '#D4E5F5', '#9CA3AF']}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 30,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;