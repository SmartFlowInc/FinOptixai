import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumCard } from "@/components/ui/premium-card";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp,
  Lightbulb, 
  LineChart, 
  TrendingUp,
  Sparkles,
  AlertTriangle,
  EyeIcon,
  RefreshCw,
  LayoutDashboard,
  CreditCard,
  Target,
  Zap,
  DollarSign,
  CircleDot,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';

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

interface AIInsightsPanelProps {
  financialData?: any;
  userPreferences?: any;
  variant?: 'sidebar' | 'dashboard' | 'standalone';
  className?: string;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  financialData,
  userPreferences,
  variant = 'standalone',
  className = ''
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch AI insights
  const { 
    data: insightsData, 
    isLoading: isLoadingInsights, 
    isError: isInsightsError,
    refetch: refetchInsights
  } = useQuery({
    queryKey: ['/api/ai/insights'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ financialData, userPreferences })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch AI insights');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching insights:', error);
        throw error;
      }
    },
    enabled: !!financialData,
    retry: false
  });

  // Generate a personalized suggestion based on insights
  const generateSuggestion = () => {
    if (!insightsData || !insightsData.insights || insightsData.insights.length === 0) {
      return "AI-powered insights will appear here once data is available.";
    }
    
    // Find the highest importance insight
    const criticalInsights = insightsData.insights.filter(i => i.importance === 'critical');
    const highInsights = insightsData.insights.filter(i => i.importance === 'high');
    
    if (criticalInsights.length > 0) {
      return `Critical attention needed: ${criticalInsights[0].title}`;
    }
    
    if (highInsights.length > 0) {
      return `Important insight: ${highInsights[0].title}`;
    }
    
    return "No critical issues detected in your financial data.";
  };

  // Get category icon
  const getCategoryIcon = (category: string, className: string = "h-4 w-4") => {
    switch (category) {
      case 'strategic':
        return <Target className={className} />;
      case 'operational':
        return <LayoutDashboard className={className} />;
      case 'financial':
        return <DollarSign className={className} />;
      case 'market':
        return <TrendingUp className={className} />;
      case 'customer':
        return <CreditCard className={className} />;
      default:
        return <Info className={className} />;
    }
  };

  // Get importance badge
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <Badge className="bg-red-50 text-red-700">Critical</Badge>;
      case 'high':
        return <Badge className="bg-amber-50 text-amber-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-50 text-blue-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-slate-100 text-slate-700">Low</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{importance}</Badge>;
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetchInsights();
    toast({
      title: "Refreshing AI insights",
      description: "Analyzing your latest financial data for insights.",
    });
  };

  // Check health of AI service
  const { data: aiHealth } = useQuery({
    queryKey: ['/api/ai/health'],
    queryFn: async () => {
      const response = await fetch('/api/ai/health');
      if (!response.ok) {
        throw new Error('AI service is not available');
      }
      return response.json();
    },
    refetchInterval: 60000 * 10 // Check every 10 minutes
  });

  // Render loading state
  if (isLoadingInsights) {
    return (
      <PremiumCard 
        className={`hover-lift ${className}`}
        showAccent={true}
        accentColor="from-blue-500 to-purple-600"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">AI Insights</h3>
                <p className="text-xs text-slate-500">Analyzing your data...</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mb-3" />
            <p className="text-sm text-slate-600">Generating personalized financial insights</p>
          </div>
        </div>
      </PremiumCard>
    );
  }

  // Render error state
  if (isInsightsError || !aiHealth?.status) {
    return (
      <PremiumCard 
        className={`hover-lift ${className}`}
        showAccent={true}
        accentColor="from-amber-500 to-red-500"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center text-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">AI Insights</h3>
                <p className="text-xs text-slate-500">Service unavailable</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Retry</span>
            </Button>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            <p>Unable to generate AI insights at this time. This may be due to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>No financial data available for analysis</li>
              <li>AI service is temporarily unavailable</li>
              <li>API rate limits have been reached</li>
            </ul>
            <p className="mt-2">Please try again later or contact support if the issue persists.</p>
          </div>
        </div>
      </PremiumCard>
    );
  }

  // If no insights available yet
  if (!insightsData?.insights || insightsData.insights.length === 0) {
    return (
      <PremiumCard 
        className={`hover-lift ${className}`}
        showAccent={true}
        accentColor="from-blue-500 to-purple-600"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">AI Insights</h3>
                <p className="text-xs text-slate-500">Financial intelligence</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-start gap-3 border border-blue-100">
            <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-slate-700">No insights available yet. Please upload or connect to your financial data sources to enable AI-powered insights.</p>
              <Button className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:from-blue-600 hover:to-purple-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Connect Data Sources
              </Button>
            </div>
          </div>
        </div>
      </PremiumCard>
    );
  }

  const { insights } = insightsData;

  return (
    <PremiumCard 
      className={`hover-lift ${className}`}
      showAccent={true}
      accentColor="from-blue-500 to-purple-600"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">AI Insights</h3>
              <p className="text-xs text-slate-500">Financial intelligence</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">Refresh</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)}>
              {expanded ? 
                <ChevronUp className="h-3.5 w-3.5" /> : 
                <ChevronDown className="h-3.5 w-3.5" />
              }
            </Button>
          </div>
        </div>
        
        {expanded && (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 flex items-start gap-3 border border-blue-100">
              <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700">{generateSuggestion()}</p>
                <div className="mt-2 text-xs text-slate-500 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                  <span>Powered by OpenAI's GPT-4o model</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {insights.map((insight: Insight) => (
                <div 
                  key={insight.id} 
                  className={`rounded-lg border transition-all ${
                    selectedInsight === insight.id 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <div 
                    className="p-3 cursor-pointer flex justify-between items-start"
                    onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                        insight.importance === 'critical' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        insight.importance === 'high' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                        insight.importance === 'medium' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        'bg-gradient-to-br from-slate-400 to-slate-500'
                      }`}>
                        {getCategoryIcon(insight.category, "h-4 w-4")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{insight.title}</h4>
                          {getImportanceBadge(insight.importance)}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <div>
                      {selectedInsight === insight.id ? 
                        <ChevronUp className="h-4 w-4 text-slate-400" /> : 
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      }
                    </div>
                  </div>
                  
                  {selectedInsight === insight.id && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="pl-11">
                        <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                        
                        {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs font-medium text-slate-700 mb-1">Related Metrics:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {insight.relatedMetrics.map((metric, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline" 
                                  className="bg-slate-50 text-xs"
                                >
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {insight.actionItems && insight.actionItems.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs font-medium text-slate-700 mb-1">Recommended Actions:</div>
                            <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                              {insight.actionItems.map((action, idx) => (
                                <li key={idx}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500 flex items-center">
                          <div className="flex items-center mr-3">
                            <CircleDot className="h-3 w-3 mr-1 text-blue-500" />
                            <span>
                              Confidence: {Math.round(insight.confidenceScore * 100)}%
                            </span>
                          </div>
                          <Button variant="link" size="sm" className="h-6 p-0 text-blue-600">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            <span className="text-xs">View Details</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PremiumCard>
  );
};

export default AIInsightsPanel;