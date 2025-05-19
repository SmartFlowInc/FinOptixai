import {
  users, User, InsertUser, kpis, Kpi, InsertKpi, 
  budgetItems, BudgetItem, InsertBudgetItem, 
  reports, Report, InsertReport, 
  activities, Activity, InsertActivity, 
  revenueData, RevenueData, InsertRevenueData,
  expenseData, ExpenseData, InsertExpenseData, 
  forecastData, ForecastData, InsertForecastData,
  cashFlowData, CashFlowData, InsertCashFlowData, 
  Department, Region, Period
} from "@shared/schema";

import { db } from './db';
import { eq, desc, sql } from 'drizzle-orm';
import { IStorage } from './storage';

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // KPI methods
  async getKpis(period: Period, department?: Department, region?: Region): Promise<Kpi[]> {
    let query = db.select().from(kpis).where(eq(kpis.period, period));
    
    if (department && department !== "All Departments") {
      query = query.where(eq(kpis.department, department));
    }
    
    if (region && region !== "All Regions") {
      query = query.where(eq(kpis.region, region));
    }
    
    return await query;
  }
  
  async getKpiByType(type: string, period: Period, department?: Department, region?: Region): Promise<Kpi | undefined> {
    let query = db.select().from(kpis)
      .where(eq(kpis.type, type))
      .where(eq(kpis.period, period));
    
    if (department && department !== "All Departments") {
      query = query.where(eq(kpis.department, department));
    }
    
    if (region && region !== "All Regions") {
      query = query.where(eq(kpis.region, region));
    }
    
    const [kpi] = await query;
    return kpi || undefined;
  }
  
  async createKpi(insertKpi: InsertKpi): Promise<Kpi> {
    const [kpi] = await db
      .insert(kpis)
      .values(insertKpi)
      .returning();
    return kpi;
  }
  
  // Budget methods
  async getBudgetItems(period: Period, department: Department): Promise<BudgetItem[]> {
    let query = db.select().from(budgetItems)
      .where(eq(budgetItems.period, period));
      
    if (department !== "All Departments") {
      query = query.where(eq(budgetItems.department, department));
    }
    
    return await query;
  }
  
  async createBudgetItem(insertBudgetItem: InsertBudgetItem): Promise<BudgetItem> {
    const [budgetItem] = await db
      .insert(budgetItems)
      .values(insertBudgetItem)
      .returning();
    return budgetItem;
  }
  
  // Report methods
  async getReports(): Promise<Report[]> {
    // Sort reports with newest first
    return await db.select().from(reports)
      .orderBy(desc(reports.generatedAt));
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values(insertReport)
      .returning();
    return report;
  }
  
  // Activity methods
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return await db.select().from(activities)
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }
  
  // Revenue data methods
  async getRevenueData(period: Period, department?: Department, region?: Region): Promise<RevenueData[]> {
    // For revenue data, we filter by quarter but return monthly data points
    const periodPrefix = period.split('_')[0]; // e.g., Q3
    
    let query = db.select().from(revenueData)
      .where(sql`${revenueData.period} like ${periodPrefix + '%'}`);
    
    if (department && department !== "All Departments") {
      query = query.where(eq(revenueData.department, department));
    }
    
    if (region && region !== "All Regions") {
      query = query.where(eq(revenueData.region, region));
    }
    
    return await query;
  }
  
  async createRevenueData(insertRevenueData: InsertRevenueData): Promise<RevenueData> {
    const [revenue] = await db
      .insert(revenueData)
      .values(insertRevenueData)
      .returning();
    return revenue;
  }
  
  // Expense data methods
  async getExpenseData(period: Period, department?: Department, region?: Region): Promise<ExpenseData[]> {
    let query = db.select().from(expenseData)
      .where(eq(expenseData.period, period));
    
    if (department && department !== "All Departments") {
      query = query.where(eq(expenseData.department, department));
    }
    
    if (region && region !== "All Regions") {
      query = query.where(eq(expenseData.region, region));
    }
    
    return await query;
  }
  
  async createExpenseData(insertExpenseData: InsertExpenseData): Promise<ExpenseData> {
    const [expense] = await db
      .insert(expenseData)
      .values(insertExpenseData)
      .returning();
    return expense;
  }
  
  // Forecast data methods
  async getForecastData(timeframe: string, period: Period): Promise<ForecastData | undefined> {
    const [forecast] = await db.select().from(forecastData)
      .where(eq(forecastData.timeframe, timeframe))
      .where(eq(forecastData.period, period));
    return forecast || undefined;
  }
  
  async createForecastData(insertForecastData: InsertForecastData): Promise<ForecastData> {
    const [forecast] = await db
      .insert(forecastData)
      .values(insertForecastData)
      .returning();
    return forecast;
  }
  
  // Cash flow data methods
  async getCashFlowData(period: Period): Promise<CashFlowData | undefined> {
    const [cashFlow] = await db.select().from(cashFlowData)
      .where(eq(cashFlowData.period, period));
    return cashFlow || undefined;
  }
  
  async createCashFlowData(insertCashFlowData: InsertCashFlowData): Promise<CashFlowData> {
    const [cashFlow] = await db
      .insert(cashFlowData)
      .values(insertCashFlowData)
      .returning();
    return cashFlow;
  }
  
  // Seed demo data for initial testing - can be called after database setup
  async seedDemoData() {
    // Create default user if none exists
    const userExists = await this.getUserByUsername("john.doe");
    if (!userExists) {
      await this.createUser({
        username: "john.doe",
        password: "password123",
        fullName: "John Doe",
        jobTitle: "Financial Director",
        avatarInitials: "JD"
      });
    }
    
    // Check if we have any KPIs before seeding
    const existingKpis = await this.getKpis("Q3_2023");
    if (existingKpis.length === 0) {
      // Create KPIs for Q3 2023
      await this.createKpi({
        type: "revenue",
        value: "1248590",
        previousValue: "1109858",
        changePercentage: "12.5",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
      
      await this.createKpi({
        type: "profitMargin",
        value: "24.8",
        previousValue: "21.6",
        changePercentage: "3.2",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
      
      await this.createKpi({
        type: "opex",
        value: "458230",
        previousValue: "433110",
        changePercentage: "5.8",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
      
      await this.createKpi({
        type: "cashFlow",
        value: "385450",
        previousValue: "354600",
        changePercentage: "8.7",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
    }
    
    // Check if we have any budget items before seeding
    const existingBudgetItems = await this.getBudgetItems("Q3_2023", "Sales");
    if (existingBudgetItems.length === 0) {
      // Create budget items for Q3 2023
      await this.createBudgetItem({
        category: "Personnel",
        actualAmount: "245000",
        budgetedAmount: "230000",
        department: "Sales",
        period: "Q3_2023"
      });
      
      await this.createBudgetItem({
        category: "Software",
        actualAmount: "42000",
        budgetedAmount: "50000",
        department: "Sales",
        period: "Q3_2023"
      });
      
      await this.createBudgetItem({
        category: "Travel",
        actualAmount: "18000",
        budgetedAmount: "25000",
        department: "Sales",
        period: "Q3_2023"
      });
      
      await this.createBudgetItem({
        category: "Marketing",
        actualAmount: "105000",
        budgetedAmount: "90000",
        department: "Sales",
        period: "Q3_2023"
      });
    }
    
    // Check if we have any reports before seeding
    const existingReports = await this.getReports();
    if (existingReports.length === 0) {
      // Create reports
      await this.createReport({
        title: "Q3 2023 Financial Statement",
        type: "financial_statement",
        generatedAt: new Date("2023-10-15"),
        fileUrl: "/reports/q3-2023-financial-statement.pdf",
        iconType: "primary"
      });
      
      await this.createReport({
        title: "Annual Revenue Forecast",
        type: "revenue_forecast",
        generatedAt: new Date("2023-10-10"),
        fileUrl: "/reports/annual-revenue-forecast.pdf",
        iconType: "secondary"
      });
      
      await this.createReport({
        title: "Marketing Budget Analysis",
        type: "budget_analysis",
        generatedAt: new Date("2023-10-05"),
        fileUrl: "/reports/marketing-budget-analysis.pdf",
        iconType: "accent"
      });
      
      await this.createReport({
        title: "Cash Flow Statement",
        type: "cash_flow",
        generatedAt: new Date("2023-10-01"),
        fileUrl: "/reports/cash-flow-statement.pdf",
        iconType: "warning"
      });
    }
    
    // Check if we have any activities before seeding
    const existingActivities = await this.getActivities(1);
    if (existingActivities.length === 0) {
      // Create activities
      await this.createActivity({
        userId: 1,
        action: "updated_forecast",
        description: "updated the Q4 sales forecast",
        timestamp: new Date("2023-10-16T10:32:00"),
        hasAttachment: true,
        attachmentType: "image",
        additionalText: "Updated the Q4 sales forecast based on the latest market analysis. We're expecting a 12% increase over Q3 numbers."
      });
      
      await this.createActivity({
        userId: 1,
        action: "commented",
        description: "added a comment to the budget report",
        timestamp: new Date("2023-10-15T16:15:00"),
        hasAttachment: false,
        additionalText: "I think we should revisit the marketing budget allocation. The current split doesn't align with our Q4 growth strategy."
      });
      
      await this.createActivity({
        userId: 1,
        action: "created_model",
        description: "created a new financial model",
        timestamp: new Date("2023-10-14T09:28:00"),
        hasAttachment: true,
        attachmentType: "image",
        additionalText: "I've created a new financial model for our expansion into the European market. This includes localized pricing strategy and market-specific expense projections."
      });
    }
    
    // Check if we have any revenue data before seeding
    const existingRevenueData = await this.getRevenueData("Q3_2023");
    if (existingRevenueData.length === 0) {
      // Create revenue data for Q3 2023
      const months = ["Jul", "Aug", "Sep"];
      for (let i = 0; i < months.length; i++) {
        await this.createRevenueData({
          period: `Q3_${months[i]}`,
          actualRevenue: String(390000 + (i * 40000)),
          projectedRevenue: String(380000 + (i * 35000)),
          previousYearRevenue: String(350000 + (i * 30000)),
          department: "Marketing",
          region: "Europe"
        });
      }
    }
    
    // Check if we have any expense data before seeding
    const existingExpenseData = await this.getExpenseData("Q3_2023");
    if (existingExpenseData.length === 0) {
      // Create expense data for Q3 2023
      await this.createExpenseData({
        category: "Salaries",
        percentage: "42",
        amount: "192500",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
      
      await this.createExpenseData({
        category: "Marketing",
        percentage: "18",
        amount: "82481",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
      
      await this.createExpenseData({
        category: "Operations",
        percentage: "24",
        amount: "109975",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
      
      await this.createExpenseData({
        category: "Other",
        percentage: "16",
        amount: "73317",
        period: "Q3_2023",
        department: "Marketing",
        region: "Europe"
      });
    }
    
    // Check if we have any forecast data before seeding
    const existingForecastData = await this.getForecastData("6_months", "Q3_2023");
    if (!existingForecastData) {
      // Create forecast data
      await this.createForecastData({
        period: "Q3_2023",
        projectedRevenue: "5800000",
        projectedExpenses: "4200000",
        projectedProfitMargin: "27.6",
        confidenceLevel: "85",
        timeframe: "6_months"
      });
      
      await this.createForecastData({
        period: "Q3_2023",
        projectedRevenue: "12500000",
        projectedExpenses: "9000000",
        projectedProfitMargin: "28.0", 
        confidenceLevel: "75",
        timeframe: "1_year"
      });
    }
    
    // Check if we have any cash flow data before seeding
    const existingCashFlowData = await this.getCashFlowData("Q3_2023");
    if (!existingCashFlowData) {
      // Create cash flow data
      await this.createCashFlowData({
        currentCash: "1850000",
        projectedCash: "2120000",
        burnRate: "320000",
        runway: "5.8",
        period: "Q3_2023"
      });
    }
  }
}