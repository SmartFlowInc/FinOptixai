import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { dashboardFilterSchema, periodEnum, departmentEnum, regionEnum } from "@shared/schema";
import { ZodError } from "zod";
import { registerAIRoutes } from "./ai-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed the database with initial demo data if needed
  try {
    if (storage.seedDemoData) {
      await storage.seedDemoData();
      console.log('Database seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
  
  // Register AI routes
  registerAIRoutes(app);
  
  // API routes with /api prefix
  
  // Dashboard data endpoint
  app.get("/api/dashboard", async (req, res) => {
    try {
      // Parse and validate query params
      const period = req.query.period as string || "Q3_2023";
      const department = req.query.department as string || "Marketing";
      const region = req.query.region as string || "Europe";
      
      const filter = dashboardFilterSchema.parse({
        period,
        department,
        region
      });
      
      // Get all the data for the dashboard
      const kpis = await storage.getKpis(filter.period, filter.department, filter.region);
      const budgetItems = await storage.getBudgetItems(filter.period, filter.department);
      const reports = await storage.getReports();
      const activities = await storage.getActivities(5);
      const revenueData = await storage.getRevenueData(filter.period, filter.department, filter.region);
      const expenseData = await storage.getExpenseData(filter.period, filter.department, filter.region);
      const forecastData = await storage.getForecastData("6_months", filter.period);
      const cashFlowData = await storage.getCashFlowData(filter.period);
      
      res.json({
        kpis,
        budgetItems,
        reports,
        activities,
        revenueData,
        expenseData,
        forecastData,
        cashFlowData
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Get KPIs
  app.get("/api/kpis", async (req, res) => {
    try {
      const period = periodEnum.parse(req.query.period || "Q3_2023");
      const department = departmentEnum.parse(req.query.department || "All Departments");
      const region = regionEnum.parse(req.query.region || "All Regions");
      
      const kpis = await storage.getKpis(period, department, region);
      res.json(kpis);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Get budget items
  app.get("/api/budget", async (req, res) => {
    try {
      const period = periodEnum.parse(req.query.period || "Q3_2023");
      const department = departmentEnum.parse(req.query.department || "Sales");
      
      const budgetItems = await storage.getBudgetItems(period, department);
      res.json(budgetItems);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Get reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get activities
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get revenue data
  app.get("/api/revenue", async (req, res) => {
    try {
      const period = periodEnum.parse(req.query.period || "Q3_2023");
      const department = departmentEnum.parse(req.query.department || "Marketing");
      const region = regionEnum.parse(req.query.region || "Europe");
      
      const revenueData = await storage.getRevenueData(period, department, region);
      res.json(revenueData);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Get expense data
  app.get("/api/expenses", async (req, res) => {
    try {
      const period = periodEnum.parse(req.query.period || "Q3_2023");
      const department = departmentEnum.parse(req.query.department || "Marketing");
      const region = regionEnum.parse(req.query.region || "Europe");
      
      const expenseData = await storage.getExpenseData(period, department, region);
      res.json(expenseData);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Get forecast data
  app.get("/api/forecast", async (req, res) => {
    try {
      const period = periodEnum.parse(req.query.period || "Q3_2023");
      const timeframe = req.query.timeframe?.toString() || "6_months";
      
      const forecastData = await storage.getForecastData(timeframe, period);
      res.json(forecastData);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Get cash flow data
  app.get("/api/cashflow", async (req, res) => {
    try {
      const period = periodEnum.parse(req.query.period || "Q3_2023");
      
      const cashFlowData = await storage.getCashFlowData(period);
      res.json(cashFlowData);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Mock API for user data
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("john.doe");
      
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Generate new report endpoint (mock)
  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { title, type } = req.body;
      
      if (!title || !type) {
        res.status(400).json({ message: "Title and type are required" });
        return;
      }
      
      // Determine icon type based on report type
      let iconType = "primary";
      if (type === "revenue_forecast") iconType = "secondary";
      else if (type === "budget_analysis") iconType = "accent";
      else if (type === "cash_flow") iconType = "warning";
      
      const report = await storage.createReport({
        title,
        type,
        generatedAt: new Date(),
        fileUrl: `/reports/${title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        iconType
      });
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
