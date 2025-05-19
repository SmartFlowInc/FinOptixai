import { pgTable, text, serial, integer, numeric, timestamp, boolean, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  jobTitle: text("job_title"),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial KPIs table
export const kpis = pgTable("kpis", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // revenue, profitMargin, opex, cashFlow
  value: numeric("value").notNull(),
  previousValue: numeric("previous_value"),
  changePercentage: numeric("change_percentage"),
  period: text("period").notNull(), // Q1_2023, Q2_2023, etc.
  department: text("department"), // optional department filter
  region: text("region"), // optional region filter
});

// Budget Items table
export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // personnel, software, travel, marketing, etc.
  actualAmount: numeric("actual_amount").notNull(),
  budgetedAmount: numeric("budgeted_amount").notNull(),
  department: text("department").notNull(),
  period: text("period").notNull(), // Q1_2023, Q2_2023, etc.
});

// Financial Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // financial_statement, revenue_forecast, budget_analysis, cash_flow
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  fileUrl: text("file_url"),
  iconType: text("icon_type").notNull(), // primary, secondary, accent, warning
});

// Activity table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(), // updated_forecast, commented, created_model
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  hasAttachment: boolean("has_attachment").default(false),
  attachmentType: text("attachment_type"), // image, document, etc.
  additionalText: text("additional_text"),
});

// Revenue data points for the chart
export const revenueData = pgTable("revenue_data", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(), // Jan, Feb, Mar, etc.
  actualRevenue: numeric("actual_revenue"),
  projectedRevenue: numeric("projected_revenue"),
  previousYearRevenue: numeric("previous_year_revenue"),
  department: text("department"),
  region: text("region"),
});

// Expense breakdown data for pie chart
export const expenseData = pgTable("expense_data", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // salaries, marketing, operations, other
  percentage: numeric("percentage").notNull(),
  amount: numeric("amount").notNull(),
  period: text("period").notNull(),
  department: text("department"),
  region: text("region"),
});

// Financial forecast data
export const forecastData = pgTable("forecast_data", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(), // Q4_2023, etc.
  projectedRevenue: numeric("projected_revenue").notNull(),
  projectedExpenses: numeric("projected_expenses").notNull(),
  projectedProfitMargin: numeric("projected_profit_margin").notNull(),
  confidenceLevel: numeric("confidence_level").notNull(),
  timeframe: text("timeframe").notNull(), // 6_months, 1_year
});

// Cash flow forecast data
export const cashFlowData = pgTable("cash_flow_data", {
  id: serial("id").primaryKey(),
  currentCash: numeric("current_cash").notNull(),
  projectedCash: numeric("projected_cash").notNull(),
  burnRate: numeric("burn_rate").notNull(),
  runway: numeric("runway").notNull(),
  period: text("period").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const upsertUserSchema = createInsertSchema(users);
export const insertKpiSchema = createInsertSchema(kpis);
export const insertBudgetItemSchema = createInsertSchema(budgetItems);
export const insertReportSchema = createInsertSchema(reports);
export const insertActivitySchema = createInsertSchema(activities);
export const insertRevenueDataSchema = createInsertSchema(revenueData);
export const insertExpenseDataSchema = createInsertSchema(expenseData);
export const insertForecastDataSchema = createInsertSchema(forecastData);
export const insertCashFlowDataSchema = createInsertSchema(cashFlowData);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type Kpi = typeof kpis.$inferSelect;

export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertRevenueData = z.infer<typeof insertRevenueDataSchema>;
export type RevenueData = typeof revenueData.$inferSelect;

export type InsertExpenseData = z.infer<typeof insertExpenseDataSchema>;
export type ExpenseData = typeof expenseData.$inferSelect;

export type InsertForecastData = z.infer<typeof insertForecastDataSchema>;
export type ForecastData = typeof forecastData.$inferSelect;

export type InsertCashFlowData = z.infer<typeof insertCashFlowDataSchema>;
export type CashFlowData = typeof cashFlowData.$inferSelect;

// Period and filter types
export const periodEnum = z.enum([
  "Q1_2023", "Q2_2023", "Q3_2023", "Q4_2023",
  "Q1_2024", "Q2_2024", "Q3_2024", "Q4_2024"
]);

export const departmentEnum = z.enum([
  "All Departments", "Marketing", "Sales", "Operations", "R&D"
]);

export const regionEnum = z.enum([
  "All Regions", "North America", "Europe", "Asia Pacific", "Latin America"
]);

export type Period = z.infer<typeof periodEnum>;
export type Department = z.infer<typeof departmentEnum>;
export type Region = z.infer<typeof regionEnum>;

// Dashboard filter schema
export const dashboardFilterSchema = z.object({
  period: periodEnum,
  department: departmentEnum,
  region: regionEnum
});

export type DashboardFilter = z.infer<typeof dashboardFilterSchema>;
