import { Period, Department, Region } from '@shared/schema';

// Helper function for API requests since we need consistent handling
async function makeApiRequest<T>(url: string, options?: { 
  method?: string;
  params?: Record<string, any>;
  data?: any;
}): Promise<T> {
  try {
    const baseUrl = url;
    const method = options?.method || 'GET';
    
    // Build URL with query parameters if provided
    let fullUrl = baseUrl;
    if (options?.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        fullUrl = `${baseUrl}?${queryString}`;
      }
    }
    
    // Configure fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && options?.data) {
      fetchOptions.body = JSON.stringify(options.data);
    }
    
    // Make the request
    const response = await fetch(fullUrl, fetchOptions);
    
    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse and return the response
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Unified API Service
 * 
 * This service centralizes all API interactions with consistent error handling
 * and standardized request formats to reduce duplication across components.
 */
export const api = {
  // Dashboard APIs
  dashboard: {
    /**
     * Get dashboard data with optional filters
     */
    getData: (filters?: { 
      period?: Period;
      department?: Department;
      region?: Region;
    }) => {
      return makeApiRequest('/api/dashboard', { params: filters });
    },
    
    /**
     * Save dashboard layout
     */
    saveLayout: (layout: {
      name: string;
      config: any;
    }) => {
      return makeApiRequest('/api/dashboard/layout', { 
        method: 'POST', 
        data: layout 
      });
    }
  },
  
  // Budget APIs
  budget: {
    /**
     * Get budget items
     */
    getItems: (filters?: { 
      period?: Period;
      department?: Department;
    }) => {
      return makeApiRequest('/api/budget-items', { params: filters });
    },
    
    /**
     * Create a new budget item
     */
    createItem: (budgetItem: {
      category: string;
      actualAmount: string;
      budgetedAmount: string;
      department: string;
      period: string;
    }) => {
      return makeApiRequest('/api/budget-items', { 
        method: 'POST', 
        data: budgetItem 
      });
    },
    
    /**
     * Update an existing budget item
     */
    updateItem: (id: number, updates: {
      actualAmount?: string;
      budgetedAmount?: string;
    }) => {
      return makeApiRequest(`/api/budget-items/${id}`, { 
        method: 'PUT', 
        data: updates 
      });
    }
  },
  
  // Report APIs
  reports: {
    /**
     * Get all reports
     */
    getAll: () => {
      return makeApiRequest('/api/reports');
    },
    
    /**
     * Generate a new report
     */
    generate: (report: {
      title: string;
      type: string;
      parameters: any;
    }) => {
      return makeApiRequest('/api/reports', { 
        method: 'POST', 
        data: report 
      });
    }
  },
  
  // Activity APIs
  activities: {
    /**
     * Get recent activities
     */
    getRecent: (limit: number = 10) => {
      return makeApiRequest('/api/activities', { 
        params: { limit } 
      });
    }
  },
  
  // AI Feature APIs
  ai: {
    /**
     * Detect anomalies in financial data
     */
    detectAnomalies: (params: {
      financialData: {
        timeframe: string;
        includeCategories: string[];
        comparisonType: string;
      }
    }) => {
      return makeApiRequest('/api/ai/anomalies', { 
        method: 'POST', 
        data: params 
      });
    },
    
    /**
     * Generate financial insights
     */
    generateInsights: (params: {
      financialData: {
        timeframe: string;
        includeCategories: string[];
        specificMetrics?: string[];
      };
      userPreferences?: {
        focusAreas?: string[];
        insightDepth?: string;
      };
    }) => {
      return makeApiRequest('/api/ai/insights', { 
        method: 'POST', 
        data: params 
      });
    },
    
    /**
     * Explain financial trends
     */
    explainTrend: (params: {
      metric: string;
      timeframe: string;
      contextData?: any;
    }) => {
      return makeApiRequest('/api/ai/explain-trend', { 
        method: 'POST', 
        data: params 
      });
    },
    
    /**
     * Generate forecasts
     */
    forecast: (params: {
      metric: string;
      timeframe: string;
      scenarios?: string[];
      includeFundamentals?: boolean;
      includeFactors?: boolean;
    }) => {
      return makeApiRequest('/api/ai/forecast', { 
        method: 'POST', 
        data: params 
      });
    },
    
    /**
     * Check AI service health
     */
    checkHealth: () => {
      return makeApiRequest('/api/ai/health');
    }
  },
  
  // Data Integration APIs
  integration: {
    /**
     * Get all data sources
     */
    getDataSources: () => {
      return makeApiRequest('/api/data-sources');
    },
    
    /**
     * Create a new data source connection
     */
    createDataSource: (source: {
      name: string;
      type: string;
      connectionParameters: any;
      entities: string[];
    }) => {
      return makeApiRequest('/api/data-sources', { 
        method: 'POST', 
        data: source 
      });
    },
    
    /**
     * Get sync status for a data source
     */
    getSyncStatus: (sourceId: string) => {
      return makeApiRequest(`/api/data-sources/${sourceId}/sync-status`);
    },
    
    /**
     * Trigger data sync for a source
     */
    syncDataSource: (sourceId: string, options: {
      entities?: string[];
      syncOptions?: {
        forceFullSync?: boolean;
        dateRange?: {
          start: string;
          end: string;
        };
      };
    }) => {
      return makeApiRequest(`/api/data-sources/${sourceId}/sync`, { 
        method: 'POST', 
        data: options 
      });
    },
    
    /**
     * Get all ETL pipelines
     */
    getPipelines: () => {
      return makeApiRequest('/api/pipelines');
    },
    
    /**
     * Create a new ETL pipeline
     */
    createPipeline: (pipeline: {
      name: string;
      description: string;
      status: string;
      schedule: string;
      steps: any[];
    }) => {
      return makeApiRequest('/api/pipelines', { 
        method: 'POST', 
        data: pipeline 
      });
    },
    
    /**
     * Execute a pipeline manually
     */
    executePipeline: (pipelineId: string) => {
      return makeApiRequest(`/api/pipelines/${pipelineId}/execute`, { 
        method: 'POST' 
      });
    }
  },
  
  // Notification APIs
  notifications: {
    /**
     * Get user notifications
     */
    getAll: (params?: {
      limit?: number;
      unreadOnly?: boolean;
    }) => {
      return makeApiRequest('/api/notifications', { 
        params 
      });
    },
    
    /**
     * Mark a notification as read
     */
    markAsRead: (notificationId: string) => {
      return makeApiRequest(`/api/notifications/read/${notificationId}`, { 
        method: 'POST' 
      });
    },
    
    /**
     * Mark all notifications as read
     */
    markAllAsRead: () => {
      return makeApiRequest('/api/notifications/read-all', { 
        method: 'POST' 
      });
    }
  },
  
  // Auth APIs
  auth: {
    /**
     * Get current user
     */
    getCurrentUser: () => {
      return makeApiRequest('/api/auth/user');
    },
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated: async () => {
      try {
        const response = await makeApiRequest('/api/auth/user');
        return !!response;
      } catch (error) {
        return false;
      }
    }
  }
};