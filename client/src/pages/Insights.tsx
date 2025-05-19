import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  BarChart4, 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Lightbulb, 
  Loader2, 
  MoreHorizontal, 
  RefreshCw, 
  Star,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Types for insights
type InsightCategory = 'strategic' | 'operational' | 'financial' | 'market' | 'customer';
type InsightImportance = 'critical' | 'high' | 'medium' | 'low';

interface Insight {
  id: number;
  title: string;
  description: string;
  category: InsightCategory;
  importance: InsightImportance;
  relatedMetrics: string[];
  actionItems?: string[];
  confidenceScore: number;
  createdAt: Date;
  lastViewed?: Date;
  timesViewed?: number;
  userRating?: 'helpful' | 'not-helpful';
}

const Insights = () => {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [currentImportance, setCurrentImportance] = useState<string>('all');
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  const [userPreferences, setUserPreferences] = useState({
    focusAreas: ['revenue', 'expenses', 'growth'],
    preferredTimeframe: 'quarterly'
  });

  // Fetch dashboard data to provide context for insights
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  // Fetch AI-generated insights based on financial data
  const { 
    data: insightsResponse, 
    isLoading: isInsightsLoading, 
    refetch: refetchInsights 
  } = useQuery({
    queryKey: ['/api/ai/insights'],
    enabled: !!dashboardData,
    queryFn: async () => {
      if (!dashboardData) return { insights: [] };
      
      try {
        const res = await fetch('/api/ai/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            financialData: dashboardData,
            userPreferences: userPreferences
          })
        });
        
        if (!res.ok) {
          throw new Error('API request failed');
        }
        
        return await res.json();
      } catch (error) {
        console.error('Failed to generate insights:', error);
        return { insights: [] };
      }
    }
  });

  // Mock insights for UI development
  const mockInsights: Insight[] = [
    {
      id: 1,
      title: "Revenue growth outpacing expenses indicates improving operational efficiency",
      description: "Your organization's revenue is growing at 18% while expenses grow at only 11%, suggesting improving operational efficiency. This positive trend indicates effective cost management while scaling operations.",
      category: "operational",
      importance: "high",
      relatedMetrics: ["Revenue Growth", "Expense Ratio", "Profit Margin"],
      actionItems: [
        "Document current operational processes that are driving efficiency",
        "Identify which departments are contributing most to efficiency gains",
        "Consider implementing similar strategies across other business units"
      ],
      confidenceScore: 0.92,
      createdAt: new Date("2023-10-15"),
      timesViewed: 4,
      userRating: "helpful"
    },
    {
      id: 2,
      title: "Marketing ROI decreased by 23% in Q3 compared to previous quarters",
      description: "Marketing spending has increased while conversion rates and customer acquisition metrics have declined, leading to a significant 23% drop in marketing ROI during Q3 2023.",
      category: "financial",
      importance: "critical",
      relatedMetrics: ["Marketing ROI", "Customer Acquisition Cost", "Conversion Rate"],
      actionItems: [
        "Review performance of individual marketing channels",
        "Analyze changes in campaign strategy during the period",
        "Consider reallocating budget to better performing channels",
        "Hold marketing review meeting to address declining performance"
      ],
      confidenceScore: 0.89,
      createdAt: new Date("2023-10-05")
    },
    {
      id: 3,
      title: "European market showing signs of saturation with declining growth rates",
      description: "Sales data indicates the European market growth rate has declined for three consecutive quarters, potentially indicating market saturation in your primary product categories.",
      category: "market",
      importance: "high",
      relatedMetrics: ["Regional Sales Growth", "Market Penetration", "Competitive Position"],
      actionItems: [
        "Conduct market research to validate saturation hypothesis",
        "Explore adjacent product categories for expansion",
        "Evaluate pricing strategy for the region",
        "Consider new marketing positioning to differentiate from competitors"
      ],
      confidenceScore: 0.84,
      createdAt: new Date("2023-09-28"),
      userRating: "not-helpful"
    },
    {
      id: 4,
      title: "Customer retention improved 15% following service enhancement initiative",
      description: "The customer service enhancement initiative launched in Q2 has shown significant positive impact, with customer retention rates improving by 15% and customer satisfaction scores up by 22 points.",
      category: "customer",
      importance: "medium",
      relatedMetrics: ["Customer Retention Rate", "NPS Score", "Customer Lifetime Value"],
      actionItems: [
        "Document successful elements of the initiative for standardization",
        "Expand training program to other customer-facing teams",
        "Consider implementing additional service enhancements",
        "Leverage improved retention in marketing materials"
      ],
      confidenceScore: 0.91,
      createdAt: new Date("2023-10-10"),
      timesViewed: 2
    },
    {
      id: 5,
      title: "Opportunity to reduce inventory carrying costs by 18% through optimization",
      description: "Analysis of inventory turnover rates and holding patterns suggests that optimizing reorder points and quantities could reduce inventory carrying costs by approximately 18% without impacting fulfillment rates.",
      category: "operational",
      importance: "medium",
      relatedMetrics: ["Inventory Turnover", "Carrying Costs", "Order Fulfillment Rate"],
      actionItems: [
        "Review stock levels for slow-moving inventory",
        "Implement revised reorder points for top 20% of SKUs",
        "Negotiate with suppliers for more flexible delivery schedules",
        "Consider just-in-time inventory approach for high-volume items"
      ],
      confidenceScore: 0.87,
      createdAt: new Date("2023-09-22")
    }
  ];

  // Process insights data
  const insights = insightsResponse?.insights || mockInsights;

  // Filter insights based on current filters
  const filteredInsights = insights.filter((insight: Insight) => {
    if (currentCategory !== 'all' && insight.category !== currentCategory) return false;
    if (currentImportance !== 'all' && insight.importance !== currentImportance) return false;
    return true;
  });

  // Handler for rating insights
  const handleRateInsight = (id: number, rating: 'helpful' | 'not-helpful') => {
    // This would call an API endpoint to update the rating in a real app
    console.log(`Rating insight ${id} as ${rating}`);
    
    // Update locally for UI feedback
    const updatedInsights = insights.map((insight: Insight) => {
      if (insight.id === id) {
        return {
          ...insight,
          userRating: rating
        };
      }
      return insight;
    });
    
    // In a real app, this would be persisted to the database and used to improve future insights
  };

  // Helper for getting category color
  const getCategoryColorClass = (category: InsightCategory): string => {
    switch (category) {
      case 'strategic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'operational': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'financial': return 'bg-green-100 text-green-800 border-green-300';
      case 'market': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'customer': return 'bg-pink-100 text-pink-800 border-pink-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Helper for getting importance color
  const getImportanceColorClass = (importance: InsightImportance): string => {
    switch (importance) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Helper for getting confidence score color
  const getConfidenceColor = (score: number): string => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-blue-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isLoading = isDashboardLoading || isInsightsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">AI-Powered Insights</h1>
          <p className="text-neutral-600">
            Discover personalized financial insights that help you make better decisions
          </p>
        </div>
        <Button 
          className="self-start"
          onClick={() => refetchInsights()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Generate New Insights'}
        </Button>
      </div>
      
      {/* Filters and user preferences */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Filters & Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <Select value={currentCategory} onValueChange={setCurrentCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={currentImportance} onValueChange={setCurrentImportance}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Importance Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center ml-auto">
              <span className="text-sm font-medium mr-2">Insights tuned to your preferences</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ChevronsUpDown className="h-4 w-4 mr-1" />
                    Preferences
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="px-3 py-2">
                    <h4 className="font-medium text-sm">Focus Areas</h4>
                    <p className="text-xs text-neutral-500 mb-2">
                      Insights will prioritize these metrics
                    </p>
                    {userPreferences.focusAreas.map((area, i) => (
                      <Badge key={i} variant="outline" className="mr-1 mb-1 capitalize">
                        {area}
                      </Badge>
                    ))}
                    <Separator className="my-2" />
                    <h4 className="font-medium text-sm">Time Preference</h4>
                    <p className="text-xs text-neutral-500">
                      Preferred analysis timeframe: <span className="font-medium capitalize">{userPreferences.preferredTimeframe}</span>
                    </p>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium">Analyzing financial data...</h3>
          <p className="text-neutral-500 mt-2">
            Our AI is generating personalized insights for your business
          </p>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && filteredInsights.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-neutral-50">
          <div className="p-4 rounded-full bg-primary-50 mb-4">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium">No Insights Available</h3>
          <p className="text-neutral-500 mt-2 text-center max-w-md">
            {currentCategory !== 'all' || currentImportance !== 'all' 
              ? "Try adjusting your filters to see more insights."
              : "Generate new insights based on your latest financial data."}
          </p>
          <Button 
            className="mt-4"
            onClick={() => {
              if (currentCategory !== 'all' || currentImportance !== 'all') {
                setCurrentCategory('all');
                setCurrentImportance('all');
              } else {
                refetchInsights();
              }
            }}
          >
            {currentCategory !== 'all' || currentImportance !== 'all' 
              ? "Clear Filters" 
              : "Generate Insights"}
          </Button>
        </div>
      )}
      
      {/* Insights list */}
      {!isLoading && filteredInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {filteredInsights.length} {filteredInsights.length === 1 ? 'Insight' : 'Insights'} {currentCategory !== 'all' && `(${currentCategory})`}
          </h2>
          
          {filteredInsights.map((insight: Insight) => (
            <Collapsible 
              key={insight.id}
              open={expandedInsight === insight.id}
              onOpenChange={(open) => {
                setExpandedInsight(open ? insight.id : null);
                // In a real app, we would track that this insight was viewed
              }}
            >
              <Card className={expandedInsight === insight.id ? 'border-primary' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Lightbulb className={`h-5 w-5 mr-2 ${
                        insight.importance === 'critical' ? 'text-red-500' : 
                        insight.importance === 'high' ? 'text-orange-500' : 
                        'text-primary'
                      }`} />
                      <div>
                        <CollapsibleTrigger asChild>
                          <CardTitle className="text-base hover:underline cursor-pointer flex items-center">
                            {insight.title}
                            {expandedInsight === insight.id ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            )}
                          </CardTitle>
                        </CollapsibleTrigger>
                        <CardDescription className="text-xs mt-1">
                          Generated {new Date(insight.createdAt).toLocaleDateString()} • 
                          Confidence: <span className={getConfidenceColor(insight.confidenceScore)}>
                            {Math.round(insight.confidenceScore * 100)}%
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={getCategoryColorClass(insight.category)}>
                        {insight.category}
                      </Badge>
                      <Badge className={getImportanceColorClass(insight.importance)}>
                        {insight.importance}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-2">
                    <p className="text-neutral-700 mb-4">{insight.description}</p>
                    
                    {insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Related Metrics</h4>
                        <div className="flex flex-wrap gap-1">
                          {insight.relatedMetrics.map((metric, index) => (
                            <Badge key={index} variant="outline" className="bg-neutral-50">
                              <BarChart4 className="h-3 w-3 mr-1" />
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {insight.actionItems && insight.actionItems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Recommended Actions</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {insight.actionItems.map((action, index) => (
                            <li key={index} className="text-sm text-neutral-700">{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  
                  <div className="px-6 py-2 bg-neutral-50 flex items-center justify-between rounded-b-lg">
                    <div className="text-xs text-neutral-500">
                      {insight.timesViewed 
                        ? `Viewed ${insight.timesViewed} ${insight.timesViewed === 1 ? 'time' : 'times'}`
                        : 'First view'
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500 mr-1">Was this helpful?</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${insight.userRating === 'helpful' ? 'bg-green-100 text-green-700' : ''}`}
                        onClick={() => handleRateInsight(insight.id, 'helpful')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${insight.userRating === 'not-helpful' ? 'bg-red-100 text-red-700' : ''}`}
                        onClick={() => handleRateInsight(insight.id, 'not-helpful')}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
};

export default Insights;