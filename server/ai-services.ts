import OpenAI from 'openai';
import { log } from './vite';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Types for AI service responses
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
    log('Detecting anomalies with AI', 'ai-service');

    // Construct the prompt for anomaly detection
    const systemPrompt = `
      You are an expert financial analyst specializing in anomaly detection.
      Analyze the provided financial data to identify anomalies, unusual patterns, or significant deviations.
      Focus on detecting outliers, unexpected trends, variances from forecasts, seasonal pattern disruptions, and any other notable irregularities.
      
      For each anomaly, provide:
      1. A clear title and description
      2. The type (variance, trend, outlier, pattern, seasonal)
      3. Severity level (critical, high, medium, low) based on financial impact
      4. The affected financial metric (revenue, expenses, cashflow, margin, growth, operation)
      5. Quantified impact (monetary value or percentage)
      6. Affected time periods
      7. Historical context when relevant
      8. Potential causes
      9. Recommended actions
      
      Ensure your analysis is data-driven, focusing on statistically significant anomalies rather than minor fluctuations.
    `;

    // Prepare financial data for the prompt
    const userPrompt = `
      Please analyze the following financial data for anomalies:
      ${JSON.stringify(financialData, null, 2)}
      
      The current date is ${new Date().toISOString().split('T')[0]}.
      
      Return your response as a JSON object with the following structure:
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
            "historicalContext": string (optional),
            "potentialCauses": string[] (optional),
            "recommendedActions": string[] (optional)
          }
        ],
        "analysis": string,
        "confidence": number
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1 // Low temperature for more deterministic responses
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    const result = JSON.parse(content) as AnomalyDetectionResponse;
    
    // Convert string dates to Date objects
    result.anomalies = result.anomalies.map(anomaly => ({
      ...anomaly,
      detectedAt: new Date(anomaly.detectedAt),
      updatedAt: new Date(anomaly.updatedAt)
    }));

    return result;
  } catch (error) {
    log(`Error in anomaly detection: ${error}`, 'ai-service');
    throw error;
  }
}

/**
 * Generate personalized financial insights using AI
 */
export async function generateInsights(financialData: any, userPreferences?: any): Promise<InsightGenerationResponse> {
  try {
    log('Generating insights with AI', 'ai-service');

    // Construct the prompt for insight generation
    const systemPrompt = `
      You are an expert financial advisor specializing in generating actionable insights from financial data.
      Analyze the provided financial data to identify key trends, opportunities, and risks.
      Tailor your insights to the user's preferences and business context when provided.
      
      For each insight, provide:
      1. A clear title and description
      2. The category (strategic, operational, financial, market, customer)
      3. Importance level (critical, high, medium, low)
      4. Related metrics
      5. Specific, actionable recommendations
      6. A confidence score (0-100)
      
      Focus on insights that are:
      - Actionable with clear next steps
      - Data-driven rather than generic
      - Relevant to the business context
      - Forward-looking rather than just historical
    `;

    // Prepare financial data and user preferences for the prompt
    const userPrompt = `
      Please analyze the following financial data to generate insights:
      ${JSON.stringify(financialData, null, 2)}
      
      ${userPreferences ? `Consider these user preferences: ${JSON.stringify(userPreferences, null, 2)}` : ''}
      
      The current date is ${new Date().toISOString().split('T')[0]}.
      
      Return your response as a JSON object with the following structure:
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
            "confidenceScore": number
          }
        ],
        "analysis": string
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2 // Low temperature for more deterministic responses
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    return JSON.parse(content) as InsightGenerationResponse;
  } catch (error) {
    log(`Error in insight generation: ${error}`, 'ai-service');
    throw error;
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
    log('Explaining financial trends with AI', 'ai-service');

    // Construct the prompt
    const prompt = `
      Please explain the following ${metric} trend over the ${timeframe} timeframe in clear, natural language:
      
      ${JSON.stringify(data, null, 2)}
      
      Focus on:
      1. Key patterns and trends
      2. Notable changes compared to previous periods
      3. Potential factors influencing these trends
      4. What this might mean for the business
      
      Keep your explanation clear, concise, and accessible to business users without technical financial expertise.
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: "system", 
          content: "You are a financial analyst who explains complex financial trends in clear, concise language." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    return response.choices[0].message.content || 'Unable to generate explanation';
  } catch (error) {
    log(`Error explaining financial trends: ${error}`, 'ai-service');
    return 'Unable to generate explanation due to an error.';
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
    log('Generating forecast with AI', 'ai-service');

    // Construct the prompt
    const systemPrompt = `
      You are an expert in financial forecasting.
      Analyze the provided historical data and generate a forecast for the specified period.
      Consider seasonality, trends, growth patterns, and any additional factors provided.
      
      Your forecast should include:
      1. Projected values for each period in the forecast timeframe
      2. Confidence intervals or range estimates
      3. Key assumptions made in the forecast
      4. Potential risks or variables that could significantly impact the forecast
      
      Base your projections on the historical patterns, but incorporate reasonable adjustments based on
      additional factors when provided.
    `;

    const userPrompt = `
      Please generate a ${forecastPeriod} forecast based on this historical data:
      ${JSON.stringify(historicalData, null, 2)}
      
      ${additionalFactors ? `Consider these additional factors: ${JSON.stringify(additionalFactors, null, 2)}` : ''}
      
      Return your response as a JSON object with the following structure:
      {
        "forecast": {
          "periods": [
            {
              "period": string,
              "value": number,
              "lowerBound": number,
              "upperBound": number
            }
          ],
          "assumptions": string[],
          "risks": string[],
          "methodology": string,
          "confidenceScore": number
        }
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    return JSON.parse(content);
  } catch (error) {
    log(`Error in forecast generation: ${error}`, 'ai-service');
    throw error;
  }
}