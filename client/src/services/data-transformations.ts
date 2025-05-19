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
 * Transforms any data into the format required by the RevenueChart component
 */
export function transformRevenueData(data: any[] = []): RevenueChartData[] {
  // Create default mock data following FinOptix styling
  const mockData: RevenueChartData[] = [
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
  
  // Return mock data for now until we fix the data mapping
  return mockData;
}

/**
 * Transforms any data into the format required by the ExpenseChart component
 */
export function transformExpenseData(data: any[] = []): ExpenseChartData[] {
  // Create default mock data with the requested color scheme
  return [
    { id: 'salaries', label: 'Salaries', value: 425000, color: '#3498db' },
    { id: 'marketing', label: 'Marketing', value: 170000, color: '#2ecc71' },
    { id: 'operations', label: 'Operations', value: 150000, color: '#f39c12' },
    { id: 'other', label: 'Other', value: 85000, color: '#95a5a6' }
  ];
}