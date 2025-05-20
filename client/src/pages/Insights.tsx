import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
  ThumbsUp,
  ArrowRight,
  Check,
  Clock,
  Filter,
  BarChart,
  LineChart,
  Sparkles,
  TrendingUp,
  Calendar,
  Pin,
  Bookmark,
  PieChart,
  Zap,
  Brain,
  Gauge
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PremiumPageHeader from "@/components/ui/premium-page-header";
import { PremiumCard } from "@/components/ui/premium-card";

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
    showRelatedMetrics: true,
    showActionItems: true,
    autoRefresh: true,
    insightDensity: 'detailed'
  });
  
  // Fetch insights from API
  const { data: insights, isLoading, refetch } = useQuery<Insight[]>({
    queryKey: ['/api/ai/insights', currentCategory, currentImportance, userPreferences],
    queryFn: async () => {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: currentCategory !== 'all' ? currentCategory : undefined,
          importance: currentImportance !== 'all' ? currentImportance : undefined,
          preferences: userPreferences
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }
      
      const data = await response.json();
      return data.insights || [];
    }
  });
  
  const handleToggleInsight = (id: number) => {
    setExpandedInsight(expandedInsight === id ? null : id);
  };
  
  const handleRateInsight = (id: number, rating: 'helpful' | 'not-helpful') => {
    // Would implement API call to save rating
    console.log(`Rating insight ${id} as ${rating}`);
  };
  
  const handleFilterChange = (type: 'category' | 'importance', value: string) => {
    if (type === 'category') {
      setCurrentCategory(value);
    } else {
      setCurrentImportance(value);
    }
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const getCategoryBadgeStyles = (category: InsightCategory) => {
    switch (category) {
      case 'strategic':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'operational':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'financial':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'market':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'customer':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  
  const getImportanceBadgeStyles = (importance: InsightImportance) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'low':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  
  const getCategoryIcon = (category: InsightCategory) => {
    switch (category) {
      case 'strategic':
        return <TrendingUp className="h-4 w-4" />;
      case 'operational':
        return <Gauge className="h-4 w-4" />;
      case 'financial':
        return <LineChart className="h-4 w-4" />;
      case 'market':
        return <PieChart className="h-4 w-4" />;
      case 'customer':
        return <Users className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  const getImportanceIcon = (importance: InsightImportance) => {
    switch (importance) {
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      case 'high':
        return <Star className="h-4 w-4" />;
      case 'medium':
        return <Check className="h-4 w-4" />;
      case 'low':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };
  
  const renderInsightsList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      );
    }
    
    if (!insights || insights.length === 0) {
      return (
        <Alert className="bg-slate-50 border-slate-200">
          <AlertCircle className="h-5 w-5 text-slate-400" />
          <AlertTitle>No insights found</AlertTitle>
          <AlertDescription>
            Try adjusting your filters or preferences to see more insights.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4">
        {insights.map((insight) => (
          <PremiumCard
            key={insight.id}
            className="hover-lift group"
            showAccent={true}
            accentColor={
              insight.importance === 'critical' ? 'from-red-500 to-red-600' :
              insight.importance === 'high' ? 'from-amber-500 to-amber-600' :
              insight.importance === 'medium' ? 'from-blue-500 to-blue-600' :
              'from-slate-400 to-slate-500'
            }
          >
            <Collapsible
              open={expandedInsight === insight.id}
              onOpenChange={() => handleToggleInsight(insight.id)}
            >
              <div className="p-6 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${
                      insight.category === 'strategic' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                      insight.category === 'operational' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      insight.category === 'financial' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      insight.category === 'market' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                      'bg-gradient-to-br from-red-500 to-red-600'
                    } shadow-md`}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-[#2D71A8] transition-colors">
                        {insight.title}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Badge className={`${getCategoryBadgeStyles(insight.category)} gap-1 px-2`}>
                          {getCategoryIcon(insight.category)}
                          {insight.category}
                        </Badge>
                        <Badge className={`${getImportanceBadgeStyles(insight.importance)} gap-1 px-2`}>
                          {insight.importance === 'critical' && <AlertCircle className="h-3 w-3" />}
                          {insight.importance === 'high' && <ArrowUp className="h-3 w-3" />}
                          {insight.importance === 'medium' && <Minus className="h-3 w-3" />}
                          {insight.importance === 'low' && <ArrowDown className="h-3 w-3" />}
                          {insight.importance}
                        </Badge>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 gap-1 px-2">
                          <Brain className="h-3 w-3" />
                          {Math.round(insight.confidenceScore * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-500 flex items-center">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDate(insight.createdAt)}
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {expandedInsight === insight.id ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-slate-600 line-clamp-2 group-hover:text-slate-700 transition-colors">
                    {insight.description}
                  </p>
                </div>
              </div>
              
              <CollapsibleContent>
                <div className="px-6 py-3 border-t border-slate-100">
                  <div className="text-slate-700">
                    <p className="mb-4">{insight.description}</p>
                    
                    {userPreferences.showRelatedMetrics && insight.relatedMetrics && insight.relatedMetrics.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Related Metrics</h4>
                        <div className="flex flex-wrap gap-2">
                          {insight.relatedMetrics.map((metric, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="bg-slate-50 border-slate-200 text-slate-700"
                            >
                              <LineChart className="h-3 w-3 mr-1" />
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {userPreferences.showActionItems && insight.actionItems && insight.actionItems.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                        <ul className="space-y-2 pl-6 list-disc">
                          {insight.actionItems.map((action, index) => (
                            <li key={index} className="text-sm">{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-[#2D71A8] text-[#2D71A8] hover:bg-blue-50"
                      >
                        <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        <Pin className="h-3.5 w-3.5 mr-1.5" />
                        Pin
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-500 mr-2">Was this insight helpful?</div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleRateInsight(insight.id, 'helpful')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleRateInsight(insight.id, 'not-helpful')}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </PremiumCard>
        ))}
      </div>
    );
  };
  
  // Define stats for the premium header
  const headerStats = [
    {
      title: "Total Insights",
      value: insights ? insights.length.toString() : "0",
      icon: <Brain className="h-5 w-5" />,
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    },
    {
      title: "Critical Insights",
      value: insights ? insights.filter(i => i.importance === 'critical').length.toString() : "0",
      icon: <AlertCircle className="h-5 w-5" />,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-500"
    },
    {
      title: "Financial Insights",
      value: insights ? insights.filter(i => i.category === 'financial').length.toString() : "0",
      icon: <LineChart className="h-5 w-5" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Confidence",
      value: insights ? `${Math.round(insights.reduce((acc, insight) => acc + insight.confidenceScore, 0) / (insights.length || 1) * 100)}%` : "0%",
      icon: <Gauge className="h-5 w-5" />,
      iconBgColor: "bg-blue-50",
      iconColor: "text-[#2D71A8]"
    }
  ];

  const headerActions = (
    <>
      <Button variant="outline" className="border-[#2D71A8] text-[#2D71A8]" onClick={handleRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Insights
      </Button>
      <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] hover:from-[#256191] hover:to-[#174B7F] text-white shadow-md">
        <Brain className="mr-2 h-4 w-4" />
        Generate Custom Insight
      </Button>
    </>
  );
  
  return (
    <>
      <PremiumPageHeader
        title="AI-Powered Insights"
        description="Discover actionable intelligence from your financial data"
        icon={<Sparkles className="h-6 w-6" />}
        actions={headerActions}
        stats={headerStats}
      />
      
      <div className="mb-6">
        <Tabs defaultValue="all-insights" className="w-full">
          <TabsList className="bg-slate-100/50 p-1 rounded-lg w-full">
            <TabsTrigger value="all-insights" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              All Insights
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved Insights
            </TabsTrigger>
            <TabsTrigger value="by-category" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              By Category
            </TabsTrigger>
            <TabsTrigger value="automated" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#2D71A8] data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4 mr-2" />
              Automated Insights
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-slate-700 whitespace-nowrap">Category</div>
                <Select value={currentCategory} onValueChange={(val) => handleFilterChange('category', val)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
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
              
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-slate-700 whitespace-nowrap">Importance</div>
                <Select value={currentImportance} onValueChange={(val) => handleFilterChange('importance', val)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-slate-700 whitespace-nowrap">Time Period</div>
                <Select defaultValue="last-30-days">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="year-to-date">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-[#2D71A8] text-[#2D71A8]">
                    <Filter className="h-4 w-4 mr-2" />
                    Display Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setUserPreferences({...userPreferences, showRelatedMetrics: !userPreferences.showRelatedMetrics})}>
                    <div className="flex items-center">
                      <div className="h-4 w-4 mr-2">
                        {userPreferences.showRelatedMetrics && <Check className="h-4 w-4" />}
                      </div>
                      Show Related Metrics
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUserPreferences({...userPreferences, showActionItems: !userPreferences.showActionItems})}>
                    <div className="flex items-center">
                      <div className="h-4 w-4 mr-2">
                        {userPreferences.showActionItems && <Check className="h-4 w-4" />}
                      </div>
                      Show Action Items
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUserPreferences({...userPreferences, autoRefresh: !userPreferences.autoRefresh})}>
                    <div className="flex items-center">
                      <div className="h-4 w-4 mr-2">
                        {userPreferences.autoRefresh && <Check className="h-4 w-4" />}
                      </div>
                      Auto-refresh Insights
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <TabsContent value="all-insights" className="mt-0">
            {renderInsightsList()}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <PremiumCard className="hover-lift" showAccent={true}>
              <div className="p-8 text-center">
                <Bookmark className="h-12 w-12 mx-auto text-[#2D71A8] mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Saved Insights</h3>
                <p className="text-slate-600 mb-4">You haven't saved any insights yet. Save insights to access them quickly later.</p>
                <Button className="bg-gradient-to-r from-[#2D71A8] to-[#1D5A8A] text-white shadow-md">
                  Browse All Insights
                </Button>
              </div>
            </PremiumCard>
          </TabsContent>
          
          <TabsContent value="by-category" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PremiumCard className="hover-lift" showAccent={true} accentColor="from-purple-500 to-purple-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Strategic Insights</CardTitle>
                        <CardDescription>Long-term planning and direction</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-purple-50 text-purple-700">3 Insights</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Insights about your company's strategic direction, market position, and long-term goals.</p>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white">View Strategic Insights</Button>
                </CardContent>
              </PremiumCard>
              
              <PremiumCard className="hover-lift" showAccent={true} accentColor="from-blue-500 to-blue-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                        <Gauge className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Operational Insights</CardTitle>
                        <CardDescription>Day-to-day business efficiency</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700">5 Insights</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Insights about operational efficiency, process optimization, and resource utilization.</p>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">View Operational Insights</Button>
                </CardContent>
              </PremiumCard>
              
              <PremiumCard className="hover-lift" showAccent={true} accentColor="from-green-500 to-green-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
                        <LineChart className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Financial Insights</CardTitle>
                        <CardDescription>Revenue, expenses, and profitability</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">8 Insights</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Insights about financial performance, cash flow, profitability, and investment opportunities.</p>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white">View Financial Insights</Button>
                </CardContent>
              </PremiumCard>
              
              <PremiumCard className="hover-lift" showAccent={true} accentColor="from-amber-500 to-amber-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                        <PieChart className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Market Insights</CardTitle>
                        <CardDescription>Industry trends and competition</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-amber-50 text-amber-700">4 Insights</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Insights about market trends, competitive positioning, and industry developments.</p>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white">View Market Insights</Button>
                </CardContent>
              </PremiumCard>
            </div>
          </TabsContent>
          
          <TabsContent value="automated" className="mt-0">
            <PremiumCard className="hover-lift" showAccent={true}>
              <div className="p-8 text-center">
                <Zap className="h-12 w-12 mx-auto text-[#2D71A8] mb-4" />
                <h3 className="text-xl font-semibold mb-2">Automated Insights</h3>
                <p className="text-slate-600 mb-6">Set up automated insights to get notified when important changes are detected in your data.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <h4 className="font-medium mb-1 flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      Anomaly Detection
                    </h4>
                    <p className="text-sm text-slate-600">Get insights when unusual patterns are detected.</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <h4 className="font-medium mb-1 flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      Performance Alerts
                    </h4>
                    <p className="text-sm text-slate-600">Be notified of significant changes in key metrics.</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <h4 className="font-medium mb-1 flex items-center">
                      <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                      Scheduled Reports
                    </h4>
                    <p className="text-sm text-slate-600">Receive regular insights on a schedule you define.</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <h4 className="font-medium mb-1 flex items-center">
                      <Users className="h-4 w-4 text-purple-500 mr-2" />
                      Team Insights
                    </h4>
                    <p className="text-sm text-slate-600">Share insights with your team automatically.</p>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Insights;

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ArrowUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

function Minus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function Info({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}