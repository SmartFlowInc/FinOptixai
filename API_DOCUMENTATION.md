# Financial Hub API Documentation

This document provides detailed specifications for all API endpoints in the Financial Hub platform.

## API Overview

The Financial Hub API follows RESTful principles with JSON as the primary data exchange format. All endpoints are prefixed with `/api`.

### Base URL

```
https://financial-hub.repl.app/api
```

### Authentication

All API requests (except authentication endpoints) require authentication using session cookies. Authentication is handled through Replit's OpenID Connect service.

### Response Format

All responses follow a consistent format:

```json
{
  "data": { /* Response data */ },
  "meta": {
    "timestamp": "2025-05-19T12:34:56Z",
    "requestId": "req-123456"
  },
  "error": null
}
```

For errors:

```json
{
  "data": null,
  "meta": {
    "timestamp": "2025-05-19T12:34:56Z",
    "requestId": "req-123456"
  },
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": { /* Additional error details */ }
  }
}
```

## API Endpoints

### Authentication

#### GET /api/auth/user

Get the currently authenticated user.

**Response:**

```json
{
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": "https://example.com/profile.jpg"
  }
}
```

#### GET /api/login

Initiates the authentication flow with Replit. Redirects to Replit for authentication.

#### GET /api/callback

Callback endpoint for Replit authentication. Redirects to the application after successful authentication.

#### GET /api/logout

Logs out the current user and clears the session.

### Dashboard Data

#### GET /api/dashboard

Get dashboard data with optional filters.

**Query Parameters:**

| Parameter   | Type     | Description                       | Example     |
|-------------|----------|-----------------------------------|-------------|
| period      | string   | Financial period                  | Q2_2024     |
| department  | string   | Department filter                 | Marketing   |
| region      | string   | Region filter                     | North America |

**Response:**

```json
{
  "data": {
    "kpis": [
      {
        "id": 1,
        "type": "revenue",
        "value": "1250000",
        "previousValue": "1100000",
        "changePercentage": "13.64",
        "period": "Q2_2024",
        "department": "All Departments",
        "region": "All Regions"
      },
      {
        "id": 2,
        "type": "expenses",
        "value": "850000",
        "previousValue": "900000",
        "changePercentage": "-5.56",
        "period": "Q2_2024",
        "department": "All Departments",
        "region": "All Regions"
      }
      // Additional KPIs...
    ],
    "revenueData": [
      {
        "id": 1,
        "period": "Jan",
        "actualRevenue": "320000",
        "projectedRevenue": "300000",
        "previousYearRevenue": "280000",
        "department": "All Departments",
        "region": "All Regions"
      }
      // Additional revenue data points...
    ],
    "expenseData": [
      {
        "id": 1,
        "category": "salaries",
        "percentage": "45",
        "amount": "382500",
        "period": "Q2_2024",
        "department": "All Departments",
        "region": "All Regions"
      }
      // Additional expense data points...
    ],
    "budgetItems": [
      {
        "id": 1,
        "category": "marketing",
        "actualAmount": "85000",
        "budgetedAmount": "100000",
        "department": "Marketing",
        "period": "Q2_2024"
      }
      // Additional budget items...
    ],
    "reports": [
      {
        "id": 1,
        "title": "Q2 Financial Review",
        "type": "financial_statement",
        "generatedAt": "2025-05-01T10:30:00Z",
        "fileUrl": "/reports/q2-financial-review.pdf",
        "iconType": "primary"
      }
      // Additional reports...
    ],
    "activities": [
      {
        "id": 1,
        "userId": 1,
        "action": "updated_forecast",
        "description": "Updated Q3 revenue forecast",
        "timestamp": "2025-05-15T14:30:00Z",
        "hasAttachment": false,
        "additionalText": "Increased projections by 5%"
      }
      // Additional activities...
    ],
    "forecastData": {
      "id": 1,
      "period": "Q3_2024",
      "projectedRevenue": "1350000",
      "projectedExpenses": "870000",
      "projectedProfitMargin": "35.56",
      "confidenceLevel": "85",
      "timeframe": "6_months"
    },
    "cashFlowData": {
      "id": 1,
      "currentCash": "2500000",
      "projectedCash": "2750000",
      "burnRate": "180000",
      "runway": "15.28",
      "period": "Q2_2024"
    }
  }
}
```

### Budget Management

#### GET /api/budget-items

Get budget items with optional filters.

**Query Parameters:**

| Parameter   | Type     | Description                       | Example     |
|-------------|----------|-----------------------------------|-------------|
| period      | string   | Financial period                  | Q2_2024     |
| department  | string   | Department filter                 | Marketing   |

**Response:**

```json
{
  "data": {
    "budgetItems": [
      {
        "id": 1,
        "category": "marketing",
        "actualAmount": "85000",
        "budgetedAmount": "100000",
        "department": "Marketing",
        "period": "Q2_2024"
      }
      // Additional budget items...
    ]
  }
}
```

#### POST /api/budget-items

Create a new budget item.

**Request Body:**

```json
{
  "category": "software_licenses",
  "actualAmount": "25000",
  "budgetedAmount": "30000",
  "department": "IT",
  "period": "Q2_2024"
}
```

**Response:**

```json
{
  "data": {
    "id": 5,
    "category": "software_licenses",
    "actualAmount": "25000",
    "budgetedAmount": "30000",
    "department": "IT",
    "period": "Q2_2024"
  }
}
```

#### PUT /api/budget-items/:id

Update an existing budget item.

**Request Body:**

```json
{
  "actualAmount": "27500",
  "budgetedAmount": "30000"
}
```

**Response:**

```json
{
  "data": {
    "id": 5,
    "category": "software_licenses",
    "actualAmount": "27500",
    "budgetedAmount": "30000",
    "department": "IT",
    "period": "Q2_2024"
  }
}
```

### Reports

#### GET /api/reports

Get financial reports.

**Response:**

```json
{
  "data": {
    "reports": [
      {
        "id": 1,
        "title": "Q2 Financial Review",
        "type": "financial_statement",
        "generatedAt": "2025-05-01T10:30:00Z",
        "fileUrl": "/reports/q2-financial-review.pdf",
        "iconType": "primary"
      }
      // Additional reports...
    ]
  }
}
```

#### POST /api/reports

Generate a new report.

**Request Body:**

```json
{
  "title": "Marketing Expense Analysis",
  "type": "budget_analysis",
  "parameters": {
    "period": "Q2_2024",
    "department": "Marketing",
    "includeBreakdown": true
  }
}
```

**Response:**

```json
{
  "data": {
    "id": 5,
    "title": "Marketing Expense Analysis",
    "type": "budget_analysis",
    "generatedAt": "2025-05-19T14:30:00Z",
    "fileUrl": "/reports/marketing-expense-analysis.pdf",
    "iconType": "primary"
  }
}
```

### Activities

#### GET /api/activities

Get recent activities.

**Query Parameters:**

| Parameter   | Type     | Description                       | Example     |
|-------------|----------|-----------------------------------|-------------|
| limit       | number   | Maximum number of activities      | 10          |

**Response:**

```json
{
  "data": {
    "activities": [
      {
        "id": 1,
        "userId": 1,
        "action": "updated_forecast",
        "description": "Updated Q3 revenue forecast",
        "timestamp": "2025-05-15T14:30:00Z",
        "hasAttachment": false,
        "additionalText": "Increased projections by 5%"
      }
      // Additional activities...
    ]
  }
}
```

### AI Features

#### POST /api/ai/anomalies

Detect anomalies in financial data.

**Request Body:**

```json
{
  "financialData": {
    "timeframe": "last_6_months",
    "includeCategories": ["revenue", "expenses", "cashflow"],
    "comparisonType": "budget_vs_actual"
  }
}
```

**Response:**

```json
{
  "data": {
    "anomalies": [
      {
        "id": 1,
        "title": "Unusual increase in marketing expenses",
        "description": "Marketing expenses exceeded budget by 25% in April, significantly higher than historical variances of 5-10%.",
        "type": "variance",
        "severity": "high",
        "status": "detected",
        "metric": "expenses",
        "detectedAt": "2025-05-19T14:30:00Z",
        "updatedAt": "2025-05-19T14:30:00Z",
        "impact": {
          "description": "Increased expenses will reduce Q2 profit by approximately 8%",
          "value": 42000,
          "isMonetary": true
        },
        "affectedPeriods": ["Apr 2025"],
        "historicalContext": "Marketing expenses typically stay within 5-10% of budget",
        "potentialCauses": [
          "New marketing campaign launch",
          "Pricing changes from marketing vendors",
          "Duplicate expense entries"
        ],
        "recommendedActions": [
          "Review marketing campaign ROI",
          "Audit expense entries for duplicates",
          "Adjust Q2 budget forecast"
        ]
      }
      // Additional anomalies...
    ],
    "analysis": "Analysis reveals a significant deviation in marketing expenses that warrants investigation. Other financial metrics appear to be within normal ranges.",
    "confidence": 0.89
  }
}
```

#### POST /api/ai/insights

Generate financial insights.

**Request Body:**

```json
{
  "financialData": {
    "timeframe": "last_12_months",
    "includeCategories": ["revenue", "expenses", "profitability"],
    "specificMetrics": ["gross_margin", "operating_expenses_ratio"]
  },
  "userPreferences": {
    "focusAreas": ["cost_optimization", "growth_opportunities"],
    "insightDepth": "detailed"
  }
}
```

**Response:**

```json
{
  "data": {
    "insights": [
      {
        "id": 1,
        "title": "Operating expenses growing faster than revenue",
        "description": "Operating expenses have increased by 18% over the past 12 months, while revenue has grown by only 12%. This trend is putting pressure on profit margins, which have declined from 24% to 20%.",
        "category": "financial",
        "importance": "high",
        "relatedMetrics": ["operating_expenses_ratio", "profit_margin", "revenue_growth"],
        "actionItems": [
          "Review departmental budgets for potential cost-saving opportunities",
          "Implement stricter approval process for non-essential expenses",
          "Explore revenue enhancement opportunities in high-margin product lines"
        ],
        "confidenceScore": 0.92
      }
      // Additional insights...
    ],
    "analysis": "Analysis of your financial performance indicates opportunities for operational efficiency improvements and targeted growth initiatives. Cost management should be a priority in the next quarter."
  }
}
```

#### POST /api/ai/explain-trend

Explain financial trends in natural language.

**Request Body:**

```json
{
  "metric": "gross_margin",
  "timeframe": "last_4_quarters",
  "contextData": {
    "industry": "technology",
    "companySize": "mid_market",
    "includeMarketComparison": true
  }
}
```

**Response:**

```json
{
  "data": {
    "explanation": "Your gross margin has shown a steady improvement over the last 4 quarters, increasing from 62% to 68%. This 6 percentage point improvement is significantly better than the industry average increase of 1.5 percentage points during the same period.\n\nThe primary drivers appear to be:\n\n1. Improved pricing strategy implemented in Q4 2024, which added approximately 2.5 percentage points\n2. More favorable supplier contracts negotiated in Q1 2025, contributing roughly 2 percentage points\n3. Shift in product mix toward higher-margin offerings, adding about 1.5 percentage points\n\nIf this trend continues, you could expect to reach a gross margin of 70-72% by the end of 2025, placing you in the top quartile for your industry segment.",
    "confidenceScore": 0.88,
    "keyFactors": [
      "Pricing strategy adjustments",
      "Supplier contract renegotiation",
      "Product mix optimization"
    ],
    "recommendations": [
      "Continue emphasizing higher-margin product lines",
      "Consider additional supplier consolidation for better terms",
      "Monitor competitive pricing to ensure sustainability"
    ]
  }
}
```

#### POST /api/ai/forecast

Generate AI-powered forecasts.

**Request Body:**

```json
{
  "metric": "revenue",
  "timeframe": "next_4_quarters",
  "scenarios": ["base", "optimistic", "pessimistic"],
  "includeFundamentals": true,
  "includeFactors": true
}
```

**Response:**

```json
{
  "data": {
    "forecasts": {
      "base": {
        "values": [
          { "period": "Q3_2025", "value": 1450000 },
          { "period": "Q4_2025", "value": 1580000 },
          { "period": "Q1_2026", "value": 1420000 },
          { "period": "Q2_2026", "value": 1650000 }
        ],
        "growthRate": 5.8,
        "confidenceInterval": [0.92, 1.08]
      },
      "optimistic": {
        "values": [
          { "period": "Q3_2025", "value": 1520000 },
          { "period": "Q4_2025", "value": 1680000 },
          { "period": "Q1_2026", "value": 1550000 },
          { "period": "Q2_2026", "value": 1820000 }
        ],
        "growthRate": 8.2,
        "confidenceInterval": [0.85, 1.15]
      },
      "pessimistic": {
        "values": [
          { "period": "Q3_2025", "value": 1380000 },
          { "period": "Q4_2025", "value": 1460000 },
          { "period": "Q1_2026", "value": 1320000 },
          { "period": "Q2_2026", "value": 1480000 }
        ],
        "growthRate": 2.4,
        "confidenceInterval": [0.88, 1.12]
      }
    },
    "keyFactors": [
      {
        "name": "Market growth",
        "impact": "high",
        "direction": "positive",
        "contribution": 0.45
      },
      {
        "name": "Product launches",
        "impact": "medium",
        "direction": "positive",
        "contribution": 0.25
      },
      {
        "name": "Competitive pressure",
        "impact": "medium",
        "direction": "negative",
        "contribution": -0.15
      }
    ],
    "recommendedActions": [
      "Accelerate planned product launches to capitalize on market growth",
      "Develop contingency plans for possible competitive pricing pressure",
      "Consider expanding into adjacent markets to diversify revenue streams"
    ],
    "confidenceScore": 0.85
  }
}
```

### Data Integration

#### GET /api/data-sources

Get configured data sources.

**Response:**

```json
{
  "data": {
    "dataSources": [
      {
        "id": "qbo-1",
        "name": "QuickBooks Online - Main",
        "type": "quickbooks",
        "status": "connected",
        "lastSyncedAt": "2025-05-18T14:30:00Z",
        "entities": ["Invoice", "Bill", "Journal"],
        "supportedEntities": ["Invoice", "Bill", "Journal", "Customer", "Vendor"]
      },
      {
        "id": "xero-1",
        "name": "Xero - Subsidiaries",
        "type": "xero",
        "status": "connected",
        "lastSyncedAt": "2025-05-19T10:15:00Z",
        "entities": ["Invoice", "Contact", "Account"],
        "supportedEntities": ["Invoice", "Contact", "Account", "BankTransaction", "CreditNote"]
      }
      // Additional data sources...
    ]
  }
}
```

#### POST /api/data-sources

Create a new data source connection.

**Request Body:**

```json
{
  "name": "Stripe - Payment Processing",
  "type": "stripe",
  "connectionParameters": {
    "apiKey": "SECURE_PLACEHOLDER" // Actual API key handled securely
  },
  "entities": ["Charge", "Customer", "Subscription"]
}
```

**Response:**

```json
{
  "data": {
    "id": "stripe-1",
    "name": "Stripe - Payment Processing",
    "type": "stripe",
    "status": "connected",
    "lastSyncedAt": null,
    "entities": ["Charge", "Customer", "Subscription"],
    "supportedEntities": ["Charge", "Customer", "Subscription", "Invoice", "Product"]
  }
}
```

#### GET /api/data-sources/:id/sync-status

Get the sync status of a data source.

**Response:**

```json
{
  "data": {
    "sourceId": "qbo-1",
    "status": "completed",
    "startedAt": "2025-05-19T14:30:00Z",
    "completedAt": "2025-05-19T14:35:22Z",
    "entityStatus": [
      {
        "entity": "Invoice",
        "status": "completed",
        "recordsProcessed": 156,
        "recordsCreated": 12,
        "recordsUpdated": 3,
        "recordsFailed": 0
      },
      {
        "entity": "Bill",
        "status": "completed",
        "recordsProcessed": 98,
        "recordsCreated": 8,
        "recordsUpdated": 2,
        "recordsFailed": 0
      },
      {
        "entity": "Journal",
        "status": "completed",
        "recordsProcessed": 45,
        "recordsCreated": 5,
        "recordsUpdated": 0,
        "recordsFailed": 0
      }
    ],
    "errorDetails": []
  }
}
```

#### POST /api/data-sources/:id/sync

Trigger a data sync for a specific data source.

**Request Body:**

```json
{
  "entities": ["Invoice", "Bill"],
  "syncOptions": {
    "forceFullSync": false,
    "dateRange": {
      "start": "2025-04-01T00:00:00Z",
      "end": "2025-04-30T23:59:59Z"
    }
  }
}
```

**Response:**

```json
{
  "data": {
    "syncId": "sync-123456",
    "sourceId": "qbo-1",
    "status": "initiated",
    "startedAt": "2025-05-19T15:30:00Z",
    "estimatedCompletion": "2025-05-19T15:35:00Z",
    "entities": ["Invoice", "Bill"]
  }
}
```

### ETL Pipelines

#### GET /api/pipelines

Get configured ETL pipelines.

**Response:**

```json
{
  "data": {
    "pipelines": [
      {
        "id": "pipeline-1",
        "name": "QuickBooks to Financial Data",
        "description": "Imports invoices and transforms them to the financial data model",
        "status": "active",
        "schedule": "0 2 * * *",
        "steps": [
          {
            "id": "step-1",
            "name": "Extract QuickBooks Invoices",
            "type": "data_source",
            "order": 1,
            "config": {
              "sourceId": "qbo-1",
              "entity": "Invoice"
            }
          },
          {
            "id": "step-2",
            "name": "Transform Invoice Data",
            "type": "transform",
            "order": 2,
            "config": {
              "mappings": {
                "TxnDate": "transaction_date",
                "TotalAmt": "amount",
                "CustomerRef.Name": "customer_name"
              }
            }
          },
          {
            "id": "step-3",
            "name": "Filter Completed Invoices",
            "type": "filter",
            "order": 3,
            "config": {
              "condition": "status === 'PAID'"
            }
          },
          {
            "id": "step-4",
            "name": "Load to Revenue Data",
            "type": "destination",
            "order": 4,
            "config": {
              "table": "revenue_data",
              "updateStrategy": "merge"
            }
          }
        ],
        "lastRun": {
          "status": "completed",
          "startedAt": "2025-05-19T02:00:00Z",
          "completedAt": "2025-05-19T02:03:22Z",
          "recordsProcessed": 156
        }
      }
      // Additional pipelines...
    ]
  }
}
```

#### POST /api/pipelines

Create a new ETL pipeline.

**Request Body:**

```json
{
  "name": "Xero Expenses Pipeline",
  "description": "Imports Xero bills and transforms them to expense data",
  "status": "draft",
  "schedule": "0 3 * * *",
  "steps": [
    {
      "name": "Extract Xero Bills",
      "type": "data_source",
      "order": 1,
      "config": {
        "sourceId": "xero-1",
        "entity": "Bill"
      }
    },
    {
      "name": "Transform Bill Data",
      "type": "transform",
      "order": 2,
      "config": {
        "mappings": {
          "Date": "transaction_date",
          "Total": "amount",
          "Contact.Name": "vendor_name"
        }
      }
    },
    {
      "name": "Load to Expense Data",
      "type": "destination",
      "order": 3,
      "config": {
        "table": "expense_data",
        "updateStrategy": "merge"
      }
    }
  ]
}
```

**Response:**

```json
{
  "data": {
    "id": "pipeline-2",
    "name": "Xero Expenses Pipeline",
    "description": "Imports Xero bills and transforms them to expense data",
    "status": "draft",
    "schedule": "0 3 * * *",
    "steps": [
      {
        "id": "step-1",
        "name": "Extract Xero Bills",
        "type": "data_source",
        "order": 1,
        "config": {
          "sourceId": "xero-1",
          "entity": "Bill"
        }
      },
      {
        "id": "step-2",
        "name": "Transform Bill Data",
        "type": "transform",
        "order": 2,
        "config": {
          "mappings": {
            "Date": "transaction_date",
            "Total": "amount",
            "Contact.Name": "vendor_name"
          }
        }
      },
      {
        "id": "step-3",
        "name": "Load to Expense Data",
        "type": "destination",
        "order": 3,
        "config": {
          "table": "expense_data",
          "updateStrategy": "merge"
        }
      }
    ],
    "lastRun": null
  }
}
```

#### POST /api/pipelines/:id/execute

Execute a pipeline manually.

**Response:**

```json
{
  "data": {
    "executionId": "exec-123456",
    "pipelineId": "pipeline-2",
    "status": "initiated",
    "startedAt": "2025-05-19T15:45:00Z",
    "estimatedCompletion": "2025-05-19T15:48:00Z"
  }
}
```

### Notifications

#### GET /api/notifications

Get user notifications.

**Query Parameters:**

| Parameter   | Type     | Description                       | Example     |
|-------------|----------|-----------------------------------|-------------|
| limit       | number   | Maximum number of notifications   | 20          |
| unreadOnly  | boolean  | Filter to unread notifications    | true        |

**Response:**

```json
{
  "data": {
    "notifications": [
      {
        "id": "notification-1",
        "title": "Budget Alert: Marketing",
        "message": "Marketing expenses have exceeded budget by 15%",
        "type": "budget_alert",
        "priority": "high",
        "timestamp": "2025-05-19T10:30:00Z",
        "isRead": false,
        "data": {
          "url": "/budgeting?department=Marketing"
        }
      },
      {
        "id": "notification-2",
        "title": "Report Ready: Q2 Financial Review",
        "message": "The Q2 Financial Review report has been generated",
        "type": "system",
        "priority": "medium",
        "timestamp": "2025-05-18T14:45:00Z",
        "isRead": true,
        "data": {
          "url": "/reports/5"
        }
      }
      // Additional notifications...
    ],
    "unreadCount": 1,
    "totalCount": 12
  }
}
```

#### POST /api/notifications/read/:id

Mark a notification as read.

**Response:**

```json
{
  "data": {
    "id": "notification-1",
    "isRead": true
  }
}
```

#### POST /api/notifications/read-all

Mark all notifications as read.

**Response:**

```json
{
  "data": {
    "markedAsRead": 5
  }
}
```

## Data Models

### User

```typescript
interface User {
  id: string;          // Unique identifier
  email: string;       // User email address
  firstName: string;   // First name
  lastName: string;    // Last name
  profileImageUrl: string; // URL to profile image
  createdAt: Date;     // Account creation date
  updatedAt: Date;     // Last update date
}
```

### KPI

```typescript
interface Kpi {
  id: number;          // Unique identifier
  type: string;        // KPI type (revenue, expenses, profit, cashflow, etc.)
  value: string;       // Current value
  previousValue: string | null; // Previous period value
  changePercentage: string | null; // Percentage change
  period: string;      // Financial period (Q1_2023, Q2_2023, etc.)
  department: string | null; // Department (if applicable)
  region: string | null; // Region (if applicable)
}
```

### Budget Item

```typescript
interface BudgetItem {
  id: number;          // Unique identifier
  category: string;    // Budget category
  actualAmount: string; // Actual amount spent
  budgetedAmount: string; // Budgeted amount
  department: string;  // Department
  period: string;      // Financial period
}
```

### Report

```typescript
interface Report {
  id: number;          // Unique identifier
  title: string;       // Report title
  type: string;        // Report type (financial_statement, revenue_forecast, etc.)
  generatedAt: Date;   // Generation timestamp
  fileUrl: string;     // URL to the report file
  iconType: string;    // Icon type for UI display
}
```

### Activity

```typescript
interface Activity {
  id: number;          // Unique identifier
  userId: number;      // User who performed the activity
  action: string;      // Activity type
  description: string; // Activity description
  timestamp: Date;     // When the activity occurred
  hasAttachment: boolean; // Whether there's an attachment
  attachmentType: string | null; // Type of attachment (if any)
  additionalText: string | null; // Additional context
}
```

### Revenue Data

```typescript
interface RevenueData {
  id: number;          // Unique identifier
  period: string;      // Period label (Jan, Feb, etc.)
  actualRevenue: string; // Actual revenue
  projectedRevenue: string | null; // Projected revenue
  previousYearRevenue: string | null; // Previous year's revenue
  department: string | null; // Department (if applicable)
  region: string | null; // Region (if applicable)
}
```

### Expense Data

```typescript
interface ExpenseData {
  id: number;          // Unique identifier
  category: string;    // Expense category
  percentage: string;  // Percentage of total expenses
  amount: string;      // Expense amount
  period: string;      // Financial period
  department: string | null; // Department (if applicable)
  region: string | null; // Region (if applicable)
}
```

### Forecast Data

```typescript
interface ForecastData {
  id: number;          // Unique identifier
  period: string;      // Financial period
  projectedRevenue: string; // Projected revenue
  projectedExpenses: string; // Projected expenses
  projectedProfitMargin: string; // Projected profit margin
  confidenceLevel: string; // Confidence level (0-100)
  timeframe: string;   // Forecast timeframe
}
```

### Cash Flow Data

```typescript
interface CashFlowData {
  id: number;          // Unique identifier
  currentCash: string; // Current cash balance
  projectedCash: string; // Projected cash balance
  burnRate: string;    // Monthly burn rate
  runway: string;      // Runway in months
  period: string;      // Financial period
}
```

### Notification

```typescript
interface Notification {
  id: string;          // Unique identifier
  title: string;       // Notification title
  message: string;     // Notification message
  type: string;        // Notification type
  priority: string;    // Priority level
  timestamp: Date;     // Creation timestamp
  isRead: boolean;     // Read status
  data?: {             // Additional data
    url?: string;      // URL to relevant page
    [key: string]: any;
  };
}
```

### Data Source

```typescript
interface DataSource {
  id: string;          // Unique identifier
  name: string;        // Display name
  type: string;        // Source type (quickbooks, xero, etc.)
  status: string;      // Connection status
  lastSyncedAt: Date | null; // Last sync timestamp
  entities: string[];  // Active entities to sync
  supportedEntities: string[]; // Available entities
}
```

### Pipeline

```typescript
interface Pipeline {
  id: string;          // Unique identifier
  name: string;        // Pipeline name
  description: string; // Description
  status: string;      // Status (active, draft, paused)
  schedule: string;    // Cron expression for scheduling
  steps: PipelineStep[]; // Processing steps
  lastRun: {           // Last execution info
    status: string;    
    startedAt: Date;
    completedAt: Date | null;
    recordsProcessed: number;
  } | null;
}

interface PipelineStep {
  id: string;          // Step identifier
  name: string;        // Step name
  type: string;        // Step type
  order: number;       // Execution order
  config: any;         // Step configuration
}
```

## Error Codes

| Code                  | Description                                           |
|-----------------------|-------------------------------------------------------|
| UNAUTHORIZED          | Authentication required or failed                     |
| FORBIDDEN             | User does not have permission                         |
| RESOURCE_NOT_FOUND    | Requested resource not found                          |
| VALIDATION_ERROR      | Request validation failed                             |
| INTEGRATION_ERROR     | Error with external integration                       |
| DATABASE_ERROR        | Database operation failed                             |
| RATE_LIMIT_EXCEEDED   | Too many requests                                     |
| INTERNAL_SERVER_ERROR | Unexpected server error                               |

## Pagination

For endpoints that return lists, pagination is supported through the following query parameters:

| Parameter | Type    | Description              | Default | Example |
|-----------|---------|--------------------------|---------|---------|
| page      | number  | Page number              | 1       | 3       |
| limit     | number  | Items per page           | 20      | 50      |

Paginated responses include the following metadata:

```json
{
  "data": { /* Response data */ },
  "meta": {
    "pagination": {
      "total": 152,
      "pages": 8,
      "current": 3,
      "limit": 20
    }
  }
}
```