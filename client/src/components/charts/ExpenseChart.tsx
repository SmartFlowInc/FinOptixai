import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseData {
  id: string;
  label: string;
  value: number;
  color?: string;
}

interface ExpenseChartProps {
  data?: ExpenseData[];
  isLoading?: boolean;
  title?: string;
  description?: string;
  height?: number;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({
  data,
  isLoading = false,
  title = 'Expense Breakdown',
  description = 'By category',
  height = 300
}) => {
  // Default FinOptix-themed expense data
  const defaultData: ExpenseData[] = [
    { id: 'salaries', label: 'Salaries', value: 425000, color: '#3498db' },
    { id: 'marketing', label: 'Marketing', value: 170000, color: '#2ecc71' },
    { id: 'operations', label: 'Operations', value: 150000, color: '#f39c12' },
    { id: 'technology', label: 'Technology', value: 85000, color: '#9b59b6' },
    { id: 'other', label: 'Other', value: 20000, color: '#95a5a6' }
  ];
  
  // Use provided data or fallback to default
  const chartData = data || defaultData;
  
  // Format dollar values
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Return loading state if needed
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsivePie
            data={chartData}
            margin={{ top: 30, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'paired' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            valueFormat={formatValue}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 20,
                itemWidth: 80,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000'
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

export default ExpenseChart;