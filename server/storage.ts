import {
  User, InsertUser, Kpi, InsertKpi,
  BudgetItem, InsertBudgetItem, Report, InsertReport,
  Activity, InsertActivity, RevenueData, InsertRevenueData,
  ExpenseData, InsertExpenseData, ForecastData, InsertForecastData,
  CashFlowData, InsertCashFlowData, Department, Region, Period
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private kpis: Map<number, Kpi>;
  private budgetItems: Map<number, BudgetItem>;
  private reports: Map<number, Report>;
  private activities: Map<number, Activity>;
  private revenueData: Map<number, RevenueData>;
  private expenseData: Map<number, ExpenseData>;
  private forecastData: Map<number, ForecastData>;
  private cashFlowData: Map<number, CashFlowData>;
  
  private userIdCounter: number;
  private kpiIdCounter: number;
  private budgetItemIdCounter: number;
  private reportIdCounter: number;
  private activityIdCounter: number;
  private revenueDataIdCounter: number;
  private expenseDataIdCounter: number;
  private forecastDataIdCounter: number;
  private cashFlowDataIdCounter: number;

  constructor() {
    this.users = new Map();
    this.kpis = new Map();
    this.budgetItems = new Map();
    this.reports = new Map();
    this.activities = new Map();
    this.revenueData = new Map();
    this.expenseData = new Map();
    this.forecastData = new Map();
    this.cashFlowData = new Map();
    
    this.userIdCounter = 1;
    this.kpiIdCounter = 1;
    this.budgetItemIdCounter = 1;
    this.reportIdCounter = 1;
    this.activityIdCounter = 1;
    this.revenueDataIdCounter = 1;
    this.expenseDataIdCounter = 1;
    this.forecastDataIdCounter = 1;
    this.cashFlowDataIdCounter = 1;
    
    this.seedDemoData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure all fields have proper values
    const user: User = { 
      ...insertUser, 
      id,
      jobTitle: insertUser.jobTitle || null,
      avatarInitials: insertUser.avatarInitials || null
    };
    this.users.set(id, user);
    return user;
  }
  
  // KPI methods
  async getKpis(period: Period, department?: Department, region?: Region): Promise<Kpi[]> {
    return Array.from(this.kpis.values()).filter(kpi => {
      if (kpi.period !== period) return false;
      if (department && department !== "All Departments" && kpi.department !== department) return false;
      if (region && region !== "All Regions" && kpi.region !== region) return false;
      return true;
    });
  }
  
  async getKpiByType(type: string, period: Period, department?: Department, region?: Region): Promise<Kpi | undefined> {
    return Array.from(this.kpis.values()).find(kpi => {
      if (kpi.type !== type || kpi.period !== period) return false;
      if (department && department !== "All Departments" && kpi.department !== department) return false;
      if (region && region !== "All Regions" && kpi.region !== region) return false;
      return true;
    });
  }
  
  async createKpi(insertKpi: InsertKpi): Promise<Kpi> {
    const id = this.kpiIdCounter++;
    const kpi: Kpi = { 
      ...insertKpi, 
      id,
      department: insertKpi.department || null,
      region: insertKpi.region || null,
      previousValue: insertKpi.previousValue || null,
      changePercentage: insertKpi.changePercentage || null
    };
    this.kpis.set(id, kpi);
    return kpi;
  }
  
  // Budget methods
  async getBudgetItems(period: Period, department: Department): Promise<BudgetItem[]> {
    return Array.from(this.budgetItems.values()).filter(item => {
      if (item.period !== period) return false;
      if (department !== "All Departments" && item.department !== department) return false;
      return true;
    });
  }
  
  async createBudgetItem(insertBudgetItem: InsertBudgetItem): Promise<BudgetItem> {
    const id = this.budgetItemIdCounter++;
    const budgetItem: BudgetItem = { ...insertBudgetItem, id };
    this.budgetItems.set(id, budgetItem);
    return budgetItem;
  }
  
  // Report methods
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const report: Report = { 
      ...insertReport, 
      id,
      generatedAt: insertReport.generatedAt || new Date(),
      fileUrl: insertReport.fileUrl || null
    };
    this.reports.set(id, report);
    return report;
  }
  
  // Activity methods
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Revenue data methods
  async getRevenueData(period: Period, department?: Department, region?: Region): Promise<RevenueData[]> {
    return Array.from(this.revenueData.values()).filter(data => {
      // For revenue data, we filter by quarter but return monthly data points
      const periodPrefix = period.split('_')[0]; // e.g., Q3
      if (!data.period.startsWith(periodPrefix)) return false;
      if (department && department !== "All Departments" && data.department !== department) return false;
      if (region && region !== "All Regions" && data.region !== region) return false;
      return true;
    });
  }
  
  async createRevenueData(insertRevenueData: InsertRevenueData): Promise<RevenueData> {
    const id = this.revenueDataIdCounter++;
    const revenueData: RevenueData = { ...insertRevenueData, id };
    this.revenueData.set(id, revenueData);
    return revenueData;
  }
  
  // Expense data methods
  async getExpenseData(period: Period, department?: Department, region?: Region): Promise<ExpenseData[]> {
    return Array.from(this.expenseData.values()).filter(data => {
      if (data.period !== period) return false;
      if (department && department !== "All Departments" && data.department !== department) return false;
      if (region && region !== "All Regions" && data.region !== region) return false;
      return true;
    });
  }
  
  async createExpenseData(insertExpenseData: InsertExpenseData): Promise<ExpenseData> {
    const id = this.expenseDataIdCounter++;
    const expenseData: ExpenseData = { ...insertExpenseData, id };
    this.expenseData.set(id, expenseData);
    return expenseData;
  }
  
  // Forecast data methods
  async getForecastData(timeframe: string, period: Period): Promise<ForecastData | undefined> {
    return Array.from(this.forecastData.values()).find(data => 
      data.timeframe === timeframe && data.period === period
    );
  }
  
  async createForecastData(insertForecastData: InsertForecastData): Promise<ForecastData> {
    const id = this.forecastDataIdCounter++;
    const forecastData: ForecastData = { ...insertForecastData, id };
    this.forecastData.set(id, forecastData);
    return forecastData;
  }
  
  // Cash flow data methods
  async getCashFlowData(period: Period): Promise<CashFlowData | undefined> {
    return Array.from(this.cashFlowData.values()).find(data => data.period === period);
  }
  
  async createCashFlowData(insertCashFlowData: InsertCashFlowData): Promise<CashFlowData> {
    const id = this.cashFlowDataIdCounter++;
    const cashFlowData: CashFlowData = { ...insertCashFlowData, id };
    this.cashFlowData.set(id, cashFlowData);
    return cashFlowData;
  }
  
  // Seed some initial data
  private seedDemoData() {
    // Create default user
    this.createUser({
      username: "john.doe",
      password: "password123",
      fullName: "John Doe",
      jobTitle: "Financial Director",
      avatarInitials: "JD"
    });
    
    // Create KPIs for Q3 2023
    this.createKpi({
      type: "revenue",
      value: 1248590,
      previousValue: 1109858,
      changePercentage: 12.5,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    this.createKpi({
      type: "profitMargin",
      value: 24.8,
      previousValue: 21.6,
      changePercentage: 3.2,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    this.createKpi({
      type: "opex",
      value: 458230,
      previousValue: 433110,
      changePercentage: 5.8,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    this.createKpi({
      type: "cashFlow",
      value: 385450,
      previousValue: 354600,
      changePercentage: 8.7,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    // Create budget items for Q3 2023
    this.createBudgetItem({
      category: "Personnel",
      actualAmount: 245000,
      budgetedAmount: 230000,
      department: "Sales",
      period: "Q3_2023"
    });
    
    this.createBudgetItem({
      category: "Software",
      actualAmount: 42000,
      budgetedAmount: 50000,
      department: "Sales",
      period: "Q3_2023"
    });
    
    this.createBudgetItem({
      category: "Travel",
      actualAmount: 18000,
      budgetedAmount: 25000,
      department: "Sales",
      period: "Q3_2023"
    });
    
    this.createBudgetItem({
      category: "Marketing",
      actualAmount: 105000,
      budgetedAmount: 90000,
      department: "Sales",
      period: "Q3_2023"
    });
    
    // Create reports
    this.createReport({
      title: "Q3 2023 Financial Statement",
      type: "financial_statement",
      generatedAt: new Date("2023-10-15"),
      fileUrl: "/reports/q3-2023-financial-statement.pdf",
      iconType: "primary"
    });
    
    this.createReport({
      title: "Annual Revenue Forecast",
      type: "revenue_forecast",
      generatedAt: new Date("2023-10-10"),
      fileUrl: "/reports/annual-revenue-forecast.pdf",
      iconType: "secondary"
    });
    
    this.createReport({
      title: "Marketing Budget Analysis",
      type: "budget_analysis",
      generatedAt: new Date("2023-10-05"),
      fileUrl: "/reports/marketing-budget-analysis.pdf",
      iconType: "accent"
    });
    
    this.createReport({
      title: "Cash Flow Statement",
      type: "cash_flow",
      generatedAt: new Date("2023-10-01"),
      fileUrl: "/reports/cash-flow-statement.pdf",
      iconType: "warning"
    });
    
    // Create activities
    this.createActivity({
      userId: 1,
      action: "updated_forecast",
      description: "updated the Q4 sales forecast",
      timestamp: new Date("2023-10-16T10:32:00"),
      hasAttachment: true,
      attachmentType: "image",
      additionalText: "Updated the Q4 sales forecast based on the latest market analysis. We're expecting a 12% increase over Q3 numbers."
    });
    
    this.createActivity({
      userId: 1,
      action: "commented",
      description: "added a comment to the budget report",
      timestamp: new Date("2023-10-15T16:15:00"),
      hasAttachment: false,
      additionalText: "I think we should revisit the marketing budget allocation. The current split doesn't align with our Q4 growth strategy."
    });
    
    this.createActivity({
      userId: 1,
      action: "created_model",
      description: "created a new financial model",
      timestamp: new Date("2023-10-14T09:28:00"),
      hasAttachment: true,
      attachmentType: "image",
      additionalText: "I've created a new financial model for our expansion into the European market. This includes localized pricing strategy and market-specific expense projections."
    });
    
    // Create revenue data for Q3 2023
    const months = ["Jul", "Aug", "Sep"];
    months.forEach((month, index) => {
      this.createRevenueData({
        period: `Q3_${month}`,
        actualRevenue: 390000 + (index * 40000),
        projectedRevenue: 380000 + (index * 35000),
        previousYearRevenue: 350000 + (index * 30000),
        department: "Marketing",
        region: "Europe"
      });
    });
    
    // Create expense data for Q3 2023
    this.createExpenseData({
      category: "Salaries",
      percentage: 42,
      amount: 192500,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    this.createExpenseData({
      category: "Marketing",
      percentage: 18,
      amount: 82481,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    this.createExpenseData({
      category: "Operations",
      percentage: 24,
      amount: 109975,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    this.createExpenseData({
      category: "Other",
      percentage: 16,
      amount: 73317,
      period: "Q3_2023",
      department: "Marketing",
      region: "Europe"
    });
    
    // Create forecast data
    this.createForecastData({
      period: "Q3_2023",
      projectedRevenue: 5800000,
      projectedExpenses: 4200000,
      projectedProfitMargin: 27.6,
      confidenceLevel: 85,
      timeframe: "6_months"
    });
    
    this.createForecastData({
      period: "Q3_2023",
      projectedRevenue: 12500000,
      projectedExpenses: 9000000,
      projectedProfitMargin: 28.0,
      confidenceLevel: 75,
      timeframe: "1_year"
    });
    
    // Create cash flow data
    this.createCashFlowData({
      currentCash: 1850000,
      projectedCash: 2120000,
      burnRate: 320000,
      runway: 5.8,
      period: "Q3_2023"
    });
  }
}

// Import our existing DatabaseStorage implementation
import { DatabaseStorage } from './db-storage';

// Export an instance of the storage implementation
export const storage = new DatabaseStorage();
