// Client-side types for dashboard data
import { 
  Kpi, BudgetItem, Report, Activity, 
  RevenueData, ExpenseData, ForecastData, CashFlowData,
  Period, Department, Region
} from "@shared/schema";

export interface DashboardData {
  kpis: Kpi[];
  budgetItems: BudgetItem[];
  reports: Report[];
  activities: Activity[];
  revenueData: RevenueData[];
  expenseData: ExpenseData[];
  forecastData: ForecastData;
  cashFlowData: CashFlowData;
}

export interface DashboardFilters {
  period: Period;
  department: Department;
  region: Region;
}

export const defaultFilters: DashboardFilters = {
  period: "Q3_2023",
  department: "Marketing",
  region: "Europe"
};

// Helper functions for KPI data
export const getKpiByType = (kpis: Kpi[], type: string): Kpi | undefined => {
  return kpis.find(kpi => kpi.type === type);
};

export const formatCurrency = (value: number | string | undefined): string => {
  if (value === undefined) return "$0";
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numValue >= 1000000) {
    return `$${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `$${(numValue / 1000).toFixed(0)}K`;
  } else {
    return `$${numValue.toFixed(2)}`;
  }
};

export const formatPercentage = (value: number | string | undefined): string => {
  if (value === undefined) return "0%";
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue.toFixed(1)}%`;
};
