import { Request, Response } from 'express';
import { detectAnomalies, generateInsights, explainFinancialTrends, generateForecast } from './ai-services';
import { log } from './vite';

/**
 * Register AI-related routes
 */
export function registerAIRoutes(app: any) {
  // Detect anomalies in financial data
  app.post('/api/ai/anomalies', async (req: Request, res: Response) => {
    try {
      const { financialData } = req.body;
      
      if (!financialData) {
        return res.status(400).json({ error: 'Financial data is required' });
      }
      
      const result = await detectAnomalies(financialData);
      return res.json(result.anomalies);
    } catch (error) {
      log(`Error in /api/ai/anomalies endpoint: ${error}`, 'ai-routes');
      return res.status(500).json({ error: 'Failed to analyze anomalies' });
    }
  });
  
  // Generate personalized insights
  app.post('/api/ai/insights', async (req: Request, res: Response) => {
    try {
      const { financialData, userPreferences } = req.body;
      
      if (!financialData) {
        return res.status(400).json({ error: 'Financial data is required' });
      }
      
      const result = await generateInsights(financialData, userPreferences);
      return res.json(result);
    } catch (error) {
      log(`Error in /api/ai/insights endpoint: ${error}`, 'ai-routes');
      return res.status(500).json({ error: 'Failed to generate insights' });
    }
  });
  
  // Explain financial trends in natural language
  app.post('/api/ai/explain-trend', async (req: Request, res: Response) => {
    try {
      const { metric, data, timeframe } = req.body;
      
      if (!metric || !data || !timeframe) {
        return res.status(400).json({ error: 'Metric, data, and timeframe are required' });
      }
      
      const explanation = await explainFinancialTrends(metric, data, timeframe);
      return res.json({ explanation });
    } catch (error) {
      log(`Error in /api/ai/explain-trend endpoint: ${error}`, 'ai-routes');
      return res.status(500).json({ error: 'Failed to explain trend' });
    }
  });
  
  // Generate AI-powered forecast
  app.post('/api/ai/forecast', async (req: Request, res: Response) => {
    try {
      const { historicalData, forecastPeriod, additionalFactors } = req.body;
      
      if (!historicalData || !forecastPeriod) {
        return res.status(400).json({ error: 'Historical data and forecast period are required' });
      }
      
      const forecast = await generateForecast(historicalData, forecastPeriod, additionalFactors);
      return res.json(forecast);
    } catch (error) {
      log(`Error in /api/ai/forecast endpoint: ${error}`, 'ai-routes');
      return res.status(500).json({ error: 'Failed to generate forecast' });
    }
  });
  
  // Check AI service health
  app.get('/api/ai/health', (req: Request, res: Response) => {
    try {
      // Check if the OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ 
          status: 'unavailable',
          message: 'OpenAI API key is not configured'
        });
      }
      
      return res.json({ 
        status: 'available',
        model: 'gpt-4o',
        services: ['anomalies', 'insights', 'explanations', 'forecasts']
      });
    } catch (error) {
      log(`Error in /api/ai/health endpoint: ${error}`, 'ai-routes');
      return res.status(500).json({ 
        status: 'error',
        message: 'Failed to check AI service health'
      });
    }
  });
}