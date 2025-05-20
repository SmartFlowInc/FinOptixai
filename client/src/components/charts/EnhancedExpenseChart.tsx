import React, { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
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
  Info, 
  PieChart,
  BarChart
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import DashboardCard from '@/components/ui/dashboard-card';
import { useTheme } from 'next-themes';

interface ExpenseData {
  id: string;
  label: string;
  value: number;
  color?: string;
}

interface EnhancedExpenseChartProps {
  data?: ExpenseData[];
  isLoading?: boolean;
  title?: string;
  description?: string;
  height?: number;
  className?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

const EnhancedExpenseChart: React.FC<EnhancedExpenseChartProps> = ({
  data,
  isLoading = false,
  title = 'Expense Breakdown',
  description = 'By category',
  height = 360,
  className,
  onTimeframeChange
}) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Default FinOptix-themed expense data
  const defaultData: ExpenseData[] = [
    { id: 'salaries', label: 'Salaries', value: 425000, color: '#3498db' },
    { id: 'marketing', label: 'Marketing', value: 170000, color: '#2ecc71' },
    { id: 'operations', label: 'Operations', value: 150000, color: '#f39c12' },
    { id: 'other', label: 'Other', value: 85000, color: '#95a5a6' }
  ];
  
  // Use provided data or fallback to default
  const chartData = data || defaultData;
  
  // Format dollar values
  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: value >= 1000000 ? 'compact' : 'standard'
    }).format(value);
  };
  
  // Calculate total expenses
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Custom tooltip component
  const CustomTooltip = ({ datum }: any) => (
    <div className="bg-white shadow-lg rounded-lg p-3 border border-neutral-200">
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: datum.color }}
        />
        <div className="text-sm font-semibold">{datum.label}</div>
      </div>
      <div className="text-base font-bold text-neutral-900 mt-1">
        {formatValue(datum.value)}
      </div>
      <div className="text-xs text-neutral-500 mt-1">
        {((datum.value / totalExpenses) * 100).toFixed(1)}% of total
      </div>
    </div>
  );
  
  // Chart theme
  const chartTheme = {
    tooltip: {
      container: {
        backgroundColor: isDark ? '#262626' : '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: 6
      }
    },
    labels: {
      text: {
        fill: isDark ? '#e5e5e5' : '#262626',
        fontSize: 12,
        fontWeight: 500
      }
    }
  };
  
  // Header actions
  const headerAction = (
    <div className="flex items-center gap-2">
      <div className="flex rounded-md border overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 rounded-none ${chartType === 'pie' ? 'bg-neutral-100' : ''}`}
          onClick={() => setChartType('pie')}
        >
          <PieChart className="h-4 w-4 mr-1" />
          Pie
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 rounded-none ${chartType === 'bar' ? 'bg-neutral-100' : ''}`}
          onClick={() => setChartType('bar')}
        >
          <BarChart className="h-4 w-4 mr-1" />
          Bar
        </Button>
      </div>
      
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
            <p className="text-sm">Expense breakdown by category.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
  
  // Card footer content
  const footer = (
    <div className="flex flex-wrap gap-2 text-sm">
      <Badge variant="outline" className="font-normal">Total: {formatValue(totalExpenses)}</Badge>
      <Badge variant="outline" className="font-normal bg-[#3498db]/10">
        Salaries: {((chartData.find(item => item.id === 'salaries')?.value || 0) / totalExpenses * 100).toFixed(0)}%
      </Badge>
      <Badge variant="outline" className="font-normal bg-[#2ecc71]/10">
        Marketing: {((chartData.find(item => item.id === 'marketing')?.value || 0) / totalExpenses * 100).toFixed(0)}%
      </Badge>
    </div>
  );
  
  return (
    <DashboardCard
      title={title}
      description={description}
      className={className}
      isLoading={isLoading}
      minHeight={height}
      headerAction={headerAction}
      footer={footer}
    >
      <div style={{ height }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 30, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.6}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ datum: 'data.color' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={isDark ? '#e5e5e5' : '#333333'}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          theme={chartTheme}
          valueFormat={formatValue}
          tooltip={CustomTooltip}
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
              itemTextColor: isDark ? '#e5e5e5' : '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: isDark ? '#ffffff' : '#000'
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

export default EnhancedExpenseChart;