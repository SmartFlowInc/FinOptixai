# FinOptix - Financial Planning & Analysis Platform

## Overview

FinOptix is an enterprise-grade financial planning and analysis platform that provides comprehensive dashboards, forecasting tools, and AI-powered insights for finance professionals. The platform combines real-time financial data visualization with collaborative workflow management and intelligent anomaly detection to streamline financial operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Landing Page as Default Route (January 2025):** Updated routing structure to make LandingPage the default route at `/` instead of Dashboard, providing better user onboarding experience
- **Platform-Agnostic Branding (January 2025):** Removed all platform-specific references and branding to make FinOptix platform-independent, updated authentication to use generic OAuth 2.0/OpenID Connect terminology
- **Complete Branding Update (January 2025):** Changed all references from "Financial Hub" to "FinOptix" throughout documentation, updated database names and repository references for consistency
- **System Architecture Documentation (January 2025):** Added comprehensive enterprise-grade system architecture section to README.md with detailed diagrams, performance specs, security architecture, scalability strategy, technology stack details, data flow diagrams, monitoring setup, and disaster recovery procedures

## System Architecture

### Frontend Architecture
The frontend is built using a modern React-based stack with TypeScript for type safety:
- **React 18.2.0** with TypeScript for component development
- **Tailwind CSS 3.3.0** for utility-first styling with shadcn/ui components
- **Wouter** for lightweight client-side routing
- **TanStack Query 5.0.0** for data fetching, caching, and synchronization
- **Nivo** for interactive data visualizations and charts
- **Framer Motion** for smooth animations and transitions

The frontend follows a component-based architecture with dedicated contexts for state management (FilterContext, DashboardContext, ThemeContext, NotificationContext) and custom hooks for common functionality.

### Backend Architecture
The backend uses a Node.js Express server with the following key components:
- **Express 4.18.0** web framework for API endpoints
- **Drizzle ORM** for type-safe database operations with PostgreSQL
- **Passport.js** with OpenID Connect for authentication
- **OpenAI GPT-4o integration** for AI-powered insights and anomaly detection
- **Session-based authentication** with PostgreSQL session storage

The API follows RESTful principles with consistent JSON response formatting and comprehensive error handling.

### Data Storage Solutions
- **PostgreSQL** as the primary relational database
- **Drizzle ORM** for schema management and migrations
- **Connection pooling** via Neon serverless for efficient database connections
- **Session storage** in PostgreSQL for authentication persistence

## Key Components

### Dashboard System
The platform features multiple dashboard views:
- **Standard Dashboard**: Default view with KPI cards, revenue trends, and expense breakdowns
- **Advanced Dashboard**: Enhanced with customizable layouts and drill-down capabilities
- **Mobile Dashboard**: Optimized interface for mobile devices with touch-friendly controls

### Financial Data Management
Core financial entities managed through the platform:
- **KPIs**: Revenue, profit margin, operational expenses, and cash flow metrics
- **Budget Items**: Actual vs. budgeted amounts by category and department
- **Revenue/Expense Data**: Time-series financial data with departmental breakdowns
- **Forecast Data**: Predictive financial modeling with configurable timeframes
- **Cash Flow Data**: Liquidity analysis and cash position tracking

### AI-Powered Features
The platform integrates OpenAI's GPT-4o for intelligent financial analysis:
- **Anomaly Detection**: Automated identification of unusual patterns in financial data
- **Insight Generation**: Personalized financial insights based on user preferences and data patterns
- **Trend Explanation**: Natural language explanations of financial trends and variances
- **Predictive Forecasting**: AI-enhanced financial forecasting with confidence intervals

### Collaboration Tools
Team collaboration features include:
- **Threaded Comments**: Discussion threads on financial reports and budgets
- **Role-Based Access Control**: Granular permissions for different user types
- **Workflow Approval**: Multi-stage approval processes for budget changes
- **Real-time Activity Feeds**: Live updates on team activities and changes

## Data Flow

1. **Data Ingestion**: Financial data enters through API endpoints or data integration connectors
2. **Processing**: Drizzle ORM handles data validation and storage in PostgreSQL
3. **Caching**: TanStack Query caches frequently accessed data on the frontend
4. **AI Analysis**: OpenAI services process data for anomalies and insights
5. **Visualization**: Nivo charts render processed data with interactive features
6. **Real-time Updates**: WebSocket connections (planned) for live data synchronization

## External Dependencies

### Authentication
- **OAuth 2.0 / OpenID Connect**: Primary authentication provider
- **Passport.js**: Authentication middleware and session management

### AI Services
- **OpenAI API**: GPT-4o for natural language processing and financial analysis
- **Custom AI Services**: Anomaly detection, insight generation, and trend explanation

### Data Visualization
- **Nivo Charts**: Interactive charts for financial data visualization
- **Recharts**: Alternative charting library for specific use cases

### UI Framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Hosting Platform
- **Cloud Platform**: Primary hosting platform for development and production
- **Automatic Deployments**: Git-based deployment workflow
- **Environment Management**: Separate development and production environments

### Database Management
- **Neon PostgreSQL**: Serverless PostgreSQL with automatic scaling
- **Migration Strategy**: Drizzle Kit for schema migrations and versioning
- **Backup Strategy**: Automated database backups through Neon

### Build Process
- **Vite**: Fast bundling and development server
- **ESBuild**: JavaScript bundler for production builds
- **TypeScript Compilation**: Type checking and compilation pipeline

### Performance Optimization
- **Code Splitting**: Automatic route-based code splitting via Vite
- **Asset Optimization**: PostCSS with Tailwind CSS purging
- **Caching Strategy**: TanStack Query for client-side caching
- **CDN Integration**: Static asset delivery optimization

The platform is designed for scalability with a microservices-ready architecture, comprehensive error handling, and monitoring capabilities. The modular design allows for easy feature additions and maintenance while maintaining high performance and reliability.