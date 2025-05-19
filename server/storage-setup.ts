import {
  User, InsertUser, Kpi, InsertKpi,
  BudgetItem, InsertBudgetItem, Report, InsertReport,
  Activity, InsertActivity, RevenueData, InsertRevenueData,
  ExpenseData, InsertExpenseData, ForecastData, InsertForecastData,
  CashFlowData, InsertCashFlowData, Department, Region, Period
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // KPI methods
  getKpis(period: Period, department?: Department, region?: Region): Promise<Kpi[]>;
  getKpiByType(type: string, period: Period, department?: Department, region?: Region): Promise<Kpi | undefined>;
  createKpi(kpi: InsertKpi): Promise<Kpi>;
  
  // Budget methods
  getBudgetItems(period: Period, department: Department): Promise<BudgetItem[]>;
  createBudgetItem(budgetItem: InsertBudgetItem): Promise<BudgetItem>;
  
  // Report methods
  getReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Activity methods
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Revenue data methods
  getRevenueData(period: Period, department?: Department, region?: Region): Promise<RevenueData[]>;
  createRevenueData(revenueData: InsertRevenueData): Promise<RevenueData>;
  
  // Expense data methods
  getExpenseData(period: Period, department?: Department, region?: Region): Promise<ExpenseData[]>;
  createExpenseData(expenseData: InsertExpenseData): Promise<ExpenseData>;
  
  // Forecast data methods
  getForecastData(timeframe: string, period: Period): Promise<ForecastData | undefined>;
  createForecastData(forecastData: InsertForecastData): Promise<ForecastData>;
  
  // Cash flow data methods
  getCashFlowData(period: Period): Promise<CashFlowData | undefined>;
  createCashFlowData(cashFlowData: InsertCashFlowData): Promise<CashFlowData>;
  
  // Optional method for seeding initial data
  seedDemoData?(): Promise<void>;
}