import OpenAI from 'openai';
import { log } from './vite';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define types
interface AnomalyDetectionResponse {
  anomalies: Anomaly[];
  analysis: string;
  confidence: number;
}

interface Anomaly {
  id: number;
  title: string;
  description: string;
  type: 'variance' | 'trend' | 'outlier' | 'pattern' | 'seasonal';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'detected' | 'investigating' | 'resolved' | 'ignored';
  metric: 'revenue' | 'expenses' | 'cashflow' | 'margin' | 'growth' | 'operation';
  detectedAt: Date;
  updatedAt: Date;
  impact: {
    description: string;
    value: number;
    isMonetary: boolean;
  };
  affectedPeriods: string[];
  historicalContext?: string;
  potentialCauses?: string[];
  recommendedActions?: string[];
}

interface InsightGenerationResponse {
  insights: Insight[];
  analysis: string;
}

interface Insight {
  id: number;
  title: string;
  description: string;
  category: 'strategic' | 'operational' | 'financial' | 'market' | 'customer';
  importance: 'critical' | 'high' | 'medium' | 'low';
  relatedMetrics: string[];
  actionItems?: string[];
  confidenceScore: number;
}

/**
 * Detect anomalies in financial data using AI
 */
export async function detectAnomalies(financialData: any): Promise<AnomalyDetectionResponse> {
  try {
    log('Detecting anomalies with financial data', 'ai-services');

    const prompt = `
      Analyze the following financial data for anomalies:
      ${JSON.stringify(financialData, null, 2)}
      
      Identify any unusual patterns, outliers, unexpected variances, or concerning trends.
      For each anomaly detected, provide:
      1. A descriptive title
      2. Detailed description of what makes this an anomaly
      3. Type (variance, trend, outlier, pattern, seasonal)
      4. Severity (critical, high, medium, low)
      5. Which financial metric is affected
      6. Impact estimation (description and numeric value)
      7. Affected time periods
      8. Historical context
      9. Potential causes
      10. Recommended actions
      
      Format your response as a JSON object with the structure:
      {
        "anomalies": [
          {
            "id": number,
            "title": string,
            "description": string,
            "type": "variance" | "trend" | "outlier" | "pattern" | "seasonal",
            "severity": "critical" | "high" | "medium" | "low",
            "status": "detected",
            "metric": "revenue" | "expenses" | "cashflow" | "margin" | "growth" | "operation",
            "detectedAt": ISO date string,
            "updatedAt": ISO date string,
            "impact": {
              "description": string,
              "value": number,
              "isMonetary": boolean
            },
            "affectedPeriods": string[],
            "historicalContext": string,
            "potentialCauses": string[],
            "recommendedActions": string[]
          }
        ],
        "analysis": string summarizing overall findings,
        "confidence": number between 0 and 1
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are a financial analyst AI specialized in detecting anomalies in financial data. Provide detailed, accurate analysis with actionable insights."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Ensure dates are properly formatted as Date objects
    if (result.anomalies && Array.isArray(result.anomalies)) {
      result.anomalies = result.anomalies.map((anomaly: any) => ({
        ...anomaly,
        detectedAt: new Date(anomaly.detectedAt || new Date()),
        updatedAt: new Date(anomaly.updatedAt || new Date())
      }));
    }

    return result;
  } catch (error) {
    log(`Error detecting anomalies: ${error}`, 'ai-services');
    
    // Return a default empty response on error
    return {
      anomalies: [],
      analysis: "Error analyzing financial data. Please try again later.",
      confidence: 0
    };
  }
}

/**
 * Generate personalized financial insights using AI
 */
export async function generateInsights(financialData: any, userPreferences?: any): Promise<InsightGenerationResponse> {
  try {
    log('Generating insights with financial data', 'ai-services');

    const prompt = `
      Generate personalized financial insights based on the following data:
      ${JSON.stringify(financialData, null, 2)}
      
      ${userPreferences ? `Consider these user preferences: ${JSON.stringify(userPreferences, null, 2)}` : ''}
      
      For each insight detected, provide:
      1. A concise title
      2. Detailed description of the insight
      3. Category (strategic, operational, financial, market, customer)
      4. Importance (critical, high, medium, low)
      5. Related metrics
      6. Actionable recommendations
      7. Confidence score (0-1)
      
      Format your response as a JSON object with the structure:
      {
        "insights": [
          {
            "id": number,
            "title": string,
            "description": string,
            "category": "strategic" | "operational" | "financial" | "market" | "customer",
            "importance": "critical" | "high" | "medium" | "low",
            "relatedMetrics": string[],
            "actionItems": string[],
            "confidenceScore": number between 0 and 1
          }
        ],
        "analysis": string summarizing overall findings
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are a financial strategy AI specialized in discovering actionable insights from financial data. Provide strategic, helpful recommendations."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    log(`Error generating insights: ${error}`, 'ai-services');
    
    // Return a default empty response on error
    return {
      insights: [],
      analysis: "Error generating insights from financial data. Please try again later."
    };
  }
}

/**
 * Generate natural language explanation of financial trends
 */
export async function explainFinancialTrends(
  metric: string, 
  data: any, 
  timeframe: string
): Promise<string> {
  try {
    log(`Explaining ${metric} trend for ${timeframe}`, 'ai-services');

    const prompt = `
      Explain the trends in the following financial data:
      
      Metric: ${metric}
      Timeframe: ${timeframe}
      Data: ${JSON.stringify(data, null, 2)}
      
      Provide a clear, concise explanation that a finance professional would understand. 
      Focus on notable patterns, potential causes, and possible implications. 
      Keep the explanation to 2-3 paragraphs.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are a financial analyst specializing in explaining trends in financial data clearly and accurately."
        },
        { role: "user", content: prompt }
      ]
    });

    return completion.choices[0].message.content || 'Unable to explain the trend.';
  } catch (error) {
    log(`Error explaining trend: ${error}`, 'ai-services');
    return "Error generating explanation. Please try again later.";
  }
}

/**
 * Generate forecasts based on historical data
 */
export async function generateForecast(
  historicalData: any,
  forecastPeriod: string,
  additionalFactors?: any
): Promise<any> {
  try {
    log(`Generating forecast for ${forecastPeriod}`, 'ai-services');

    const prompt = `
      Generate a financial forecast based on the following historical data:
      ${JSON.stringify(historicalData, null, 2)}
      
      Forecast period: ${forecastPeriod}
      
      ${additionalFactors ? `Consider these additional factors: ${JSON.stringify(additionalFactors, null, 2)}` : ''}
      
      Provide a detailed forecast with reasoning and confidence levels. Include:
      1. Projected values for each period
      2. Growth/decline rates
      3. Key inflection points
      4. Potential scenarios (optimistic, pessimistic, most likely)
      5. Influential factors
      
      Format your response as a JSON object with appropriate structure.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { 
          role: "system", 
          content: "You are a financial forecasting specialist that uses historical data to make accurate projections with clear reasoning."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    log(`Error generating forecast: ${error}`, 'ai-services');
    return {
      error: "Failed to generate forecast. Please try again later.",
      status: "error"
    };
  }
}