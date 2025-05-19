import { useQuery } from '@tanstack/react-query';
import { Period, Department, Region } from '@shared/schema';

/**
 * Custom hook to fetch dashboard data with optional filters
 */
export function useDashboardData(
  period?: Period, 
  department?: Department, 
  region?: Region
) {
  const queryKey = [
    '/api/dashboard', 
    { period, department, region }
  ];

  return useQuery({
    queryKey,
    // Data will be cached for 5 minutes (300000ms)
    staleTime: 300000
  });
}

/**
 * Custom hook to fetch only KPIs with optional filters
 */
export function useKpis(
  period?: Period, 
  department?: Department, 
  region?: Region
) {
  const { data, isLoading, error, refetch } = useDashboardData(period, department, region);
  
  return {
    kpis: data?.kpis || [],
    isLoading,
    error,
    refetch
  };
}

/**
 * Custom hook to fetch revenue data with optional filters
 */
export function useRevenueData(
  period?: Period, 
  department?: Department, 
  region?: Region
) {
  const { data, isLoading, error, refetch } = useDashboardData(period, department, region);
  
  return {
    revenueData: data?.revenueData || [],
    isLoading,
    error,
    refetch
  };
}

/**
 * Custom hook to fetch expense data with optional filters
 */
export function useExpenseData(
  period?: Period, 
  department?: Department, 
  region?: Region
) {
  const { data, isLoading, error, refetch } = useDashboardData(period, department, region);
  
  return {
    expenseData: data?.expenseData || [],
    isLoading,
    error,
    refetch
  };
}

/**
 * Custom hook to fetch budget items with optional filters
 */
export function useBudgetItems(
  period?: Period, 
  department?: Department
) {
  const { data, isLoading, error, refetch } = useDashboardData(period, department);
  
  return {
    budgetItems: data?.budgetItems || [],
    isLoading,
    error,
    refetch
  };
}

/**
 * Custom hook to fetch forecast data with optional timeframe and period
 */
export function useForecastData(
  timeframe?: string,
  period?: Period
) {
  const queryKey = [
    '/api/forecast', 
    { timeframe, period }
  ];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    staleTime: 300000
  });
  
  return {
    forecastData: data?.forecastData || null,
    isLoading,
    error,
    refetch
  };
}

/**
 * Custom hook to fetch cash flow data with optional period
 */
export function useCashFlowData(period?: Period) {
  const { data, isLoading, error, refetch } = useDashboardData(period);
  
  return {
    cashFlowData: data?.cashFlowData || null,
    isLoading,
    error,
    refetch
  };
}

/**
 * Custom hook to fetch most recent activities
 */
export function useRecentActivities(limit: number = 5) {
  const queryKey = ['/api/activities', { limit }];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    staleTime: 60000 // 1 minute cache
  });
  
  return {
    activities: data?.activities || [],
    isLoading,
    error,
    refetch
  };
}

/**
 * Custom hook to fetch reports
 */
export function useReports() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/reports'],
    staleTime: 300000
  });
  
  return {
    reports: data?.reports || [],
    isLoading,
    error,
    refetch
  };
}