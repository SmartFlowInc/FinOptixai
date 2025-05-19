import { 
  users, 
  kpis, 
  budgetItems, 
  reports, 
  activities, 
  revenueData, 
  expenseData, 
  forecastData, 
  cashFlowData, 
  type User, 
  type UpsertUser,
  type Kpi,
  type BudgetItem,
  type Report,
  type Activity,
  type RevenueData,
  type ExpenseData,
  type ForecastData,
  type CashFlowData,
  type Period,
  type Department,
  type Region
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // KPI methods
  getKpis(period: Period, department?: Department, region?: Region): Promise<Kpi[]>;
  getKpiByType(type: string, period: Period, department?: Department, region?: Region): Promise<Kpi | undefined>;
  createKpi(kpi: any): Promise<Kpi>;
  
  // Budget methods
  getBudgetItems(period: Period, department: Department): Promise<BudgetItem[]>;
  createBudgetItem(budgetItem: any): Promise<BudgetItem>;
  
  // Report methods
  getReports(): Promise<Report[]>;
  createReport(report: any): Promise<Report>;
  
  // Activity methods
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: any): Promise<Activity>;
  
  // Revenue data methods
  getRevenueData(period: Period, department?: Department, region?: Region): Promise<RevenueData[]>;
  createRevenueData(revenueData: any): Promise<RevenueData>;
  
  // Expense data methods
  getExpenseData(period: Period, department?: Department, region?: Region): Promise<ExpenseData[]>;
  createExpenseData(expenseData: any): Promise<ExpenseData>;
  
  // Forecast data methods
  getForecastData(timeframe: string, period: Period): Promise<ForecastData | undefined>;
  createForecastData(forecastData: any): Promise<ForecastData>;
  
  // Cash flow data methods
  getCashFlowData(period: Period): Promise<CashFlowData | undefined>;
  createCashFlowData(cashFlowData: any): Promise<CashFlowData>;
  
  // Optional method for seeding initial data
  seedDemoData?(): Promise<void>;
}

// Implement the database storage class
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // For compatibility with the old schema, we'll try to find a user by email
    // since we no longer have a username field
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // KPI methods
  async getKpis(period: Period, department?: Department, region?: Region): Promise<Kpi[]> {
    let conditions = [eq(kpis.period, period)];
    
    if (department && department !== 'All Departments') {
      conditions.push(eq(kpis.department, department));
    }
    
    if (region && region !== 'All Regions') {
      conditions.push(eq(kpis.region, region));
    }
    
    return db.select().from(kpis).where(and(...conditions));
  }
  
  async getKpiByType(type: string, period: Period, department?: Department, region?: Region): Promise<Kpi | undefined> {
    let conditions = [eq(kpis.type, type), eq(kpis.period, period)];
    
    if (department && department !== 'All Departments') {
      conditions.push(eq(kpis.department, department));
    }
    
    if (region && region !== 'All Regions') {
      conditions.push(eq(kpis.region, region));
    }
    
    const [kpi] = await db.select().from(kpis).where(and(...conditions));
    return kpi;
  }
  
  async createKpi(kpiData: any): Promise<Kpi> {
    const [kpi] = await db.insert(kpis).values(kpiData).returning();
    return kpi;
  }
  
  // Budget methods
  async getBudgetItems(period: Period, department: Department): Promise<BudgetItem[]> {
    let conditions = [eq(budgetItems.period, period)];
    
    if (department !== 'All Departments') {
      conditions.push(eq(budgetItems.department, department));
    }
    
    return db.select().from(budgetItems).where(and(...conditions));
  }
  
  async createBudgetItem(budgetItemData: any): Promise<BudgetItem> {
    const [budgetItem] = await db.insert(budgetItems).values(budgetItemData).returning();
    return budgetItem;
  }
  
  // Report methods
  async getReports(): Promise<Report[]> {
    return db.select().from(reports);
  }
  
  async createReport(reportData: any): Promise<Report> {
    const [report] = await db.insert(reports).values(reportData).returning();
    return report;
  }
  
  // Activity methods
  async getActivities(limit: number = 10): Promise<Activity[]> {
    return db.select().from(activities).limit(limit);
  }
  
  async createActivity(activityData: any): Promise<Activity> {
    const [activity] = await db.insert(activities).values(activityData).returning();
    return activity;
  }
  
  // Revenue data methods
  async getRevenueData(period: Period, department?: Department, region?: Region): Promise<RevenueData[]> {
    let conditions = [eq(revenueData.period, period)];
    
    if (department && department !== 'All Departments') {
      conditions.push(eq(revenueData.department, department));
    }
    
    if (region && region !== 'All Regions') {
      conditions.push(eq(revenueData.region, region));
    }
    
    return db.select().from(revenueData).where(and(...conditions));
  }
  
  async createRevenueData(revenueDataInput: any): Promise<RevenueData> {
    const [data] = await db.insert(revenueData).values(revenueDataInput).returning();
    return data;
  }
  
  // Expense data methods
  async getExpenseData(period: Period, department?: Department, region?: Region): Promise<ExpenseData[]> {
    let conditions = [eq(expenseData.period, period)];
    
    if (department && department !== 'All Departments') {
      conditions.push(eq(expenseData.department, department));
    }
    
    if (region && region !== 'All Regions') {
      conditions.push(eq(expenseData.region, region));
    }
    
    return db.select().from(expenseData).where(and(...conditions));
  }
  
  async createExpenseData(expenseDataInput: any): Promise<ExpenseData> {
    const [data] = await db.insert(expenseData).values(expenseDataInput).returning();
    return data;
  }
  
  // Forecast data methods
  async getForecastData(timeframe: string, period: Period): Promise<ForecastData | undefined> {
    const [data] = await db
      .select()
      .from(forecastData)
      .where(and(
        eq(forecastData.timeframe, timeframe),
        eq(forecastData.period, period)
      ));
    
    return data;
  }
  
  async createForecastData(forecastDataInput: any): Promise<ForecastData> {
    const [data] = await db.insert(forecastData).values(forecastDataInput).returning();
    return data;
  }
  
  // Cash flow data methods
  async getCashFlowData(period: Period): Promise<CashFlowData | undefined> {
    const [data] = await db
      .select()
      .from(cashFlowData)
      .where(eq(cashFlowData.period, period));
    
    return data;
  }
  
  async createCashFlowData(cashFlowDataInput: any): Promise<CashFlowData> {
    const [data] = await db.insert(cashFlowData).values(cashFlowDataInput).returning();
    return data;
  }
  
  // Seed demo data
  async seedDemoData(): Promise<void> {
    try {
      // First check if we already have data
      const existingKpis = await db.select().from(kpis).limit(1);
      
      if (existingKpis.length > 0) {
        console.log('Database already seeded with initial demo data');
        return;
      }
      
      // Insert a sample user
      await this.upsertUser({
        id: "1",
        email: "john.doe@finoptix.com",
        firstName: "John",
        lastName: "Doe",
        profileImageUrl: null,
        jobTitle: "Financial Analyst",
        department: "Finance",
      });

      // KPIs seed data
      const kpiData = [
        {
          type: "revenue",
          value: "1250000",
          previousValue: "1150000",
          changePercentage: "8.70",
          period: "Q3_2023",
          department: "Marketing",
          region: "Europe"
        },
        {
          type: "expenses",
          value: "850000",
          previousValue: "800000",
          changePercentage: "6.25",
          period: "Q3_2023",
          department: "Marketing",
          region: "Europe"
        },
        {
          type: "profit",
          value: "400000",
          previousValue: "350000",
          changePercentage: "14.29",
          period: "Q3_2023",
          department: "Marketing",
          region: "Europe"
        },
        {
          type: "cashflow",
          value: "325000",
          previousValue: "300000",
          changePercentage: "8.33",
          period: "Q3_2023",
          department: "Marketing",
          region: "Europe"
        }
      ];
      
      for (const kpi of kpiData) {
        await this.createKpi(kpi);
      }
      
      console.log('Database successfully seeded with initial demo data');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}

// Create and export an instance of the storage
export const storage = new DatabaseStorage();