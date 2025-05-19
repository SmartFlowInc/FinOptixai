import { RevenueData, ExpenseData } from "@shared/schema";

// Types matching our chart components
export interface RevenueChartData {
  id: string;
  data: Array<{
    x: string | number;
    y: number;
  }>;
}

export interface ExpenseChartData {
  id: string;
  label: string;
  value: number;
  color?: string;
}

/**
 * Transforms the raw revenue data from the API into the format required by the RevenueChart component
 */
export function transformRevenueData(revenueData: RevenueData[]): RevenueChartData[] {
  // First, organize data by period
  const periodMap: { [period: string]: {
    actualRevenue: number | null;
    projectedRevenue: number | null;
    previousYearRevenue: number | null;
  }} = {};
  
  revenueData.forEach(item => {
    // Extract month or period label from period string
    const periodLabel = item.period.split('_')[0]; // e.g., "Jan_2025" -> "Jan"
    
    if (!periodMap[periodLabel]) {
      periodMap[periodLabel] = {
        actualRevenue: null,
        projectedRevenue: null,
        previousYearRevenue: null
      };
    }
    
    periodMap[periodLabel] = {
      actualRevenue: item.actualRevenue ? parseFloat(item.actualRevenue) : periodMap[periodLabel].actualRevenue,
      projectedRevenue: item.projectedRevenue ? parseFloat(item.projectedRevenue) : periodMap[periodLabel].projectedRevenue,
      previousYearRevenue: item.previousYearRevenue ? parseFloat(item.previousYearRevenue) : periodMap[periodLabel].previousYearRevenue
    };
  });
  
  // Convert to the chart data format
  const actualRevenueData: RevenueChartData = {
    id: 'Actual Revenue',
    data: []
  };
  
  const projectedRevenueData: RevenueChartData = {
    id: 'Projected Revenue',
    data: []
  };
  
  const previousYearRevenueData: RevenueChartData = {
    id: 'Previous Year',
    data: []
  };
  
  // Sort periods chronologically (basic months sorting)
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sortedPeriods = Object.keys(periodMap).sort((a, b) => {
    return monthOrder.indexOf(a) - monthOrder.indexOf(b);
  });
  
  sortedPeriods.forEach(period => {
    const data = periodMap[period];
    
    if (data.actualRevenue !== null) {
      actualRevenueData.data.push({
        x: period,
        y: data.actualRevenue
      });
    }
    
    if (data.projectedRevenue !== null) {
      projectedRevenueData.data.push({
        x: period,
        y: data.projectedRevenue
      });
    }
    
    if (data.previousYearRevenue !== null) {
      previousYearRevenueData.data.push({
        x: period,
        y: data.previousYearRevenue
      });
    }
  });
  
  const result: RevenueChartData[] = [];
  
  // Only add data sets that have data
  if (actualRevenueData.data.length > 0) {
    result.push(actualRevenueData);
  }
  
  if (projectedRevenueData.data.length > 0) {
    result.push(projectedRevenueData);
  }
  
  if (previousYearRevenueData.data.length > 0) {
    result.push(previousYearRevenueData);
  }
  
  return result;
}

/**
 * Transforms the raw expense data from the API into the format required by the ExpenseChart component
 */
export function transformExpenseData(expenseData: ExpenseData[]): ExpenseChartData[] {
  // Color palette for expense categories
  const colorMap: { [category: string]: string } = {
    'salaries': '#3498db',
    'marketing': '#2ecc71',
    'operations': '#f39c12',
    'technology': '#9b59b6',
    'rent': '#e74c3c',
    'utilities': '#1abc9c',
    'insurance': '#34495e',
    'travel': '#d35400',
    'supplies': '#27ae60',
    'maintenance': '#8e44ad',
    'consulting': '#c0392b',
    'legal': '#16a085',
    'other': '#95a5a6'
  };
  
  // Group by category
  const categoryMap: { [category: string]: number } = {};
  
  expenseData.forEach(item => {
    const category = item.category || 'other';
    const amount = item.amount ? parseFloat(item.amount) : 0;
    
    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }
    
    categoryMap[category] += amount;
  });
  
  // Convert to the chart data format
  return Object.entries(categoryMap).map(([category, value]) => ({
    id: category,
    label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
    value,
    color: colorMap[category.toLowerCase()] || '#95a5a6' // Default to gray if no color is defined
  }));
}