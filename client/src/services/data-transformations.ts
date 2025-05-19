import { Period, Department, Region } from '@shared/schema';
import { formatCurrency, formatPercentage } from '@/data/finance';

/**
 * Unified Data Transformation Service
 * 
 * This service centralizes all data transformation logic to reduce duplication
 * and ensure consistent data processing across the application.
 */
export const transformations = {
  // KPI Transformations
  kpis: {
    /**
     * Format a KPI for display
     */
    formatKpiValue: (kpi: any) => {
      if (!kpi) return { value: '0', formattedValue: '0', trend: '0%' };
      
      // Format value based on KPI type
      let formattedValue = kpi.value;
      if (['revenue', 'expenses', 'profit', 'cashflow'].includes(kpi.type)) {
        formattedValue = formatCurrency(kpi.value);
      } else if (kpi.type.includes('percentage') || kpi.type.includes('margin')) {
        formattedValue = formatPercentage(kpi.value);
      }
      
      // Format trend
      const trend = kpi.changePercentage 
        ? formatPercentage(kpi.changePercentage) 
        : '0%';
        
      return {
        value: kpi.value,
        formattedValue,
        trend,
        isPositive: parseFloat(kpi.changePercentage || '0') > 0,
        isNegative: parseFloat(kpi.changePercentage || '0') < 0,
        isGood: determineIfTrendIsGood(kpi)
      };
    },
    
    /**
     * Find a specific KPI by type
     */
    findByType: (kpis: any[], type: string) => {
      return kpis.find((kpi: any) => kpi.type === type);
    },
    
    /**
     * Group KPIs by category
     */
    groupByCategory: (kpis: any[]) => {
      const categories: Record<string, any[]> = {
        financial: [],
        operational: [],
        growth: [],
        other: []
      };
      
      kpis.forEach((kpi: any) => {
        if (['revenue', 'expenses', 'profit', 'cashflow', 'margin'].some(k => kpi.type.includes(k))) {
          categories.financial.push(kpi);
        } else if (['inventory', 'production', 'utilization'].some(k => kpi.type.includes(k))) {
          categories.operational.push(kpi);
        } else if (['growth', 'acquisition', 'retention'].some(k => kpi.type.includes(k))) {
          categories.growth.push(kpi);
        } else {
          categories.other.push(kpi);
        }
      });
      
      return categories;
    }
  },
  
  // Revenue Transformations
  revenue: {
    /**
     * Process revenue data for trend chart
     */
    formatForTrendChart: (revenueData: any[]) => {
      if (!revenueData || !revenueData.length) return [];
      
      return revenueData.map((item: any) => ({
        x: item.period, // Month or period label
        y: parseFloat(item.actualRevenue || '0'),
        yPrev: parseFloat(item.previousYearRevenue || '0'),
        yProj: parseFloat(item.projectedRevenue || '0')
      }));
    },
    
    /**
     * Calculate year-over-year growth
     */
    calculateYoYGrowth: (revenueData: any[]) => {
      if (!revenueData || !revenueData.length) return { value: 0, formatted: '0%' };
      
      // Sum current and previous year revenue
      const totalCurrent = revenueData.reduce(
        (sum, item) => sum + parseFloat(item.actualRevenue || '0'), 
        0
      );
      
      const totalPrevious = revenueData.reduce(
        (sum, item) => sum + parseFloat(item.previousYearRevenue || '0'), 
        0
      );
      
      // Calculate growth percentage
      const growth = totalPrevious > 0 
        ? ((totalCurrent - totalPrevious) / totalPrevious) * 100 
        : 0;
        
      return {
        value: growth,
        formatted: formatPercentage(growth)
      };
    },
    
    /**
     * Group revenue by department
     */
    groupByDepartment: (revenueData: any[]) => {
      if (!revenueData || !revenueData.length) return [];
      
      const departmentTotals: Record<string, number> = {};
      
      // Sum revenue by department
      revenueData.forEach((item: any) => {
        const dept = item.department || 'Other';
        if (!departmentTotals[dept]) {
          departmentTotals[dept] = 0;
        }
        departmentTotals[dept] += parseFloat(item.actualRevenue || '0');
      });
      
      // Convert to array format for charts
      return Object.entries(departmentTotals).map(([department, value]) => ({
        id: department,
        label: department,
        value
      }));
    },
    
    /**
     * Group revenue by region
     */
    groupByRegion: (revenueData: any[]) => {
      if (!revenueData || !revenueData.length) return [];
      
      const regionTotals: Record<string, number> = {};
      
      // Sum revenue by region
      revenueData.forEach((item: any) => {
        const region = item.region || 'Other';
        if (!regionTotals[region]) {
          regionTotals[region] = 0;
        }
        regionTotals[region] += parseFloat(item.actualRevenue || '0');
      });
      
      // Convert to array format for charts
      return Object.entries(regionTotals).map(([region, value]) => ({
        id: region,
        label: region,
        value
      }));
    }
  },
  
  // Expense Transformations
  expenses: {
    /**
     * Format expense data for pie chart
     */
    formatForPieChart: (expenseData: any[]) => {
      if (!expenseData || !expenseData.length) return [];
      
      // Group expenses by category
      const categoryTotals: Record<string, number> = {};
      
      expenseData.forEach((item: any) => {
        const category = item.category || 'Other';
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += parseFloat(item.amount || '0');
      });
      
      // Convert to array format for pie chart
      return Object.entries(categoryTotals).map(([category, value]) => ({
        id: category,
        label: category,
        value
      }));
    },
    
    /**
     * Calculate expense vs budget variance
     */
    calculateBudgetVariance: (expenseData: any[], budgetItems: any[]) => {
      if (!expenseData || !expenseData.length || !budgetItems || !budgetItems.length) {
        return [];
      }
      
      // Create lookup for budget amounts by category
      const budgetByCategory: Record<string, number> = {};
      budgetItems.forEach((item: any) => {
        budgetByCategory[item.category] = parseFloat(item.budgetedAmount || '0');
      });
      
      // Group expenses by category
      const expensesByCategory: Record<string, number> = {};
      expenseData.forEach((item: any) => {
        const category = item.category || 'Other';
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += parseFloat(item.amount || '0');
      });
      
      // Calculate variance for each category
      return Object.entries(expensesByCategory).map(([category, actual]) => {
        const budgeted = budgetByCategory[category] || 0;
        const variance = actual - budgeted;
        const variancePercentage = budgeted > 0 ? (variance / budgeted) * 100 : 0;
        
        return {
          category,
          actual,
          budgeted,
          variance,
          variancePercentage,
          isOverBudget: variance > 0,
          formattedActual: formatCurrency(actual),
          formattedBudgeted: formatCurrency(budgeted),
          formattedVariance: formatCurrency(Math.abs(variance)),
          formattedVariancePercentage: formatPercentage(Math.abs(variancePercentage))
        };
      });
    },
    
    /**
     * Group expenses for visualization by time period
     */
    groupByTimePeriod: (expenseData: any[]) => {
      if (!expenseData || !expenseData.length) return [];
      
      // Group expenses by period and category
      const periodData: Record<string, Record<string, number>> = {};
      
      expenseData.forEach((item: any) => {
        const period = item.period || 'Unknown';
        const category = item.category || 'Other';
        
        if (!periodData[period]) {
          periodData[period] = {};
        }
        
        if (!periodData[period][category]) {
          periodData[period][category] = 0;
        }
        
        periodData[period][category] += parseFloat(item.amount || '0');
      });
      
      // Convert to array format for stacked charts
      return Object.entries(periodData).map(([period, categories]) => {
        return {
          period,
          ...categories
        };
      });
    }
  },
  
  // Budget Transformations
  budget: {
    /**
     * Calculate overall budget utilization
     */
    calculateUtilization: (budgetItems: any[]) => {
      if (!budgetItems || !budgetItems.length) {
        return { percentage: 0, formatted: '0%' };
      }
      
      // Sum all actual and budgeted amounts
      const totalActual = budgetItems.reduce(
        (sum, item) => sum + parseFloat(item.actualAmount || '0'), 
        0
      );
      
      const totalBudgeted = budgetItems.reduce(
        (sum, item) => sum + parseFloat(item.budgetedAmount || '0'), 
        0
      );
      
      // Calculate utilization percentage
      const utilization = totalBudgeted > 0 
        ? (totalActual / totalBudgeted) * 100 
        : 0;
        
      return {
        percentage: utilization,
        formatted: formatPercentage(utilization),
        totalActual,
        totalBudgeted,
        formattedActual: formatCurrency(totalActual),
        formattedBudgeted: formatCurrency(totalBudgeted)
      };
    },
    
    /**
     * Identify budget items needing attention
     */
    findItemsNeedingAttention: (budgetItems: any[], threshold: number = 10) => {
      if (!budgetItems || !budgetItems.length) return [];
      
      return budgetItems.filter((item: any) => {
        const actual = parseFloat(item.actualAmount || '0');
        const budgeted = parseFloat(item.budgetedAmount || '0');
        
        if (budgeted === 0) return false;
        
        const variance = ((actual - budgeted) / budgeted) * 100;
        return Math.abs(variance) > threshold;
      }).map((item: any) => {
        const actual = parseFloat(item.actualAmount || '0');
        const budgeted = parseFloat(item.budgetedAmount || '0');
        const variance = ((actual - budgeted) / budgeted) * 100;
        
        return {
          ...item,
          variance,
          varianceFormatted: formatPercentage(Math.abs(variance)),
          isOverBudget: actual > budgeted,
          needsAttention: true,
          severity: Math.abs(variance) > 20 ? 'high' : 'medium'
        };
      });
    }
  },
  
  // Cash Flow Transformations
  cashFlow: {
    /**
     * Format cash flow data for projection chart
     */
    formatForProjectionChart: (cashFlowData: any) => {
      if (!cashFlowData) return [];
      
      // Generate 90-day projection
      const today = new Date();
      const projectionData = [];
      
      const currentCash = parseFloat(cashFlowData.currentCash || '0');
      const burnRate = parseFloat(cashFlowData.burnRate || '0');
      
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const cashAmount = currentCash - (burnRate * (i / 30));
        
        projectionData.push({
          date: date.toISOString().split('T')[0],
          cash: Math.max(0, cashAmount)
        });
      }
      
      return projectionData;
    },
    
    /**
     * Calculate runway metrics
     */
    calculateRunway: (cashFlowData: any) => {
      if (!cashFlowData) {
        return { months: 0, formatted: '0 months' };
      }
      
      const currentCash = parseFloat(cashFlowData.currentCash || '0');
      const burnRate = parseFloat(cashFlowData.burnRate || '0');
      
      // Calculate runway in months
      const runwayMonths = burnRate > 0 ? currentCash / burnRate : 0;
      
      // Format runway for display
      let formatted;
      if (runwayMonths < 1) {
        formatted = `${Math.round(runwayMonths * 30)} days`;
      } else if (runwayMonths > 24) {
        formatted = `${Math.floor(runwayMonths / 12)} years ${Math.round(runwayMonths % 12)} months`;
      } else {
        formatted = `${Math.round(runwayMonths)} months`;
      }
      
      return {
        months: runwayMonths,
        formatted,
        criticality: runwayMonths < 3 ? 'critical' : runwayMonths < 6 ? 'warning' : 'healthy'
      };
    }
  },
  
  // Forecast Transformations
  forecasts: {
    /**
     * Format forecast data for visualization
     */
    formatForChart: (forecastData: any) => {
      if (!forecastData) return [];
      
      // Extract forecast scenarios
      const baseScenario = forecastData.projectedRevenue;
      
      // Generate forecast data points
      const startDate = new Date();
      const monthlyData = [];
      
      for (let i = 0; i < 12; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const period = `${month} ${year}`;
        
        // Calculate scenario values
        // Base scenario grows at the projected rate
        const baseGrowthRate = parseFloat(forecastData.projectedRevenue) / 100;
        const baseValue = parseFloat(forecastData.projectedRevenue) * (1 + (baseGrowthRate * i / 12));
        
        // Optimistic scenario grows 20% faster
        const optimisticValue = baseValue * 1.2;
        
        // Pessimistic scenario grows 20% slower
        const pessimisticValue = baseValue * 0.8;
        
        monthlyData.push({
          period,
          base: baseValue,
          optimistic: optimisticValue,
          pessimistic: pessimisticValue
        });
      }
      
      return monthlyData;
    }
  }
};

/**
 * Helper function to determine if a trend is good for a specific KPI type
 */
function determineIfTrendIsGood(kpi: any): boolean {
  if (!kpi || !kpi.changePercentage) return true;
  
  const changeValue = parseFloat(kpi.changePercentage);
  const isPositive = changeValue > 0;
  
  // For these metrics, an increase is good
  if (['revenue', 'profit', 'margin', 'cashflow', 'growth'].some(type => kpi.type.includes(type))) {
    return isPositive;
  }
  
  // For these metrics, a decrease is good
  if (['expenses', 'cost', 'burn_rate'].some(type => kpi.type.includes(type))) {
    return !isPositive;
  }
  
  // Default to positive being good
  return isPositive;
}