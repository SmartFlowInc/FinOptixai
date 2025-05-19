import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  CheckCircle,
  Settings,
  Eye,
  Download,
  ExternalLink,
  Bell,
  BarChart3,
  FileText,
  BellOff
} from "lucide-react";

// Define types for insights data
type InsightSeverity = 'critical' | 'warning' | 'info' | 'success';
type InsightCategory = 'variance' | 'trend' | 'anomaly' | 'forecast' | 'budget' | 'reconciliation';
type InsightStatus = 'new' | 'read' | 'dismissed' | 'actioned';

interface Insight {
  id: number;
  title: string;
  description: string;
  category: InsightCategory;
  severity: InsightSeverity;
  status: InsightStatus;
  timestamp: Date;
  relatedMetric?: string;
  relatedValue?: string;
  changePercentage?: number;
  relatedEntities?: string[];
  actions?: string[];
}

// Sample data
const sampleInsights: Insight[] = [
  {
    id: 1,
    title: "Revenue variance exceeds threshold",
    description: "Q3 2023 revenue is 12.4% above forecast, indicating stronger than expected performance in the North American region.",
    category: "variance",
    severity: "info",
    status: "new",
    timestamp: new Date(2025, 4, 15, 9, 30, 0),
    relatedMetric: "Revenue",
    relatedValue: "$2.45M",
    changePercentage: 12.4,
    relatedEntities: ["Sales", "North America"],
    actions: ["Review forecast assumptions", "Adjust Q4 projections"]
  },
  {
    id: 2,
    title: "Marketing expenses significantly over budget",
    description: "Current marketing expenses are 23.5% over allocated budget for the quarter, primarily driven by digital advertising costs.",
    category: "budget",
    severity: "warning",
    status: "new",
    timestamp: new Date(2025, 4, 14, 15, 45, 0),
    relatedMetric: "Marketing Expenses",
    relatedValue: "$345K",
    changePercentage: 23.5,
    relatedEntities: ["Marketing", "Advertising"],
    actions: ["Review digital ad spending", "Adjust budget allocation"]
  },
  {
    id: 3,
    title: "Profit margin trend improvement",
    description: "Profit margins have shown consistent improvement over the last 3 months, reaching 18.2% this month.",
    category: "trend",
    severity: "success",
    status: "read",
    timestamp: new Date(2025, 4, 13, 11, 15, 0),
    relatedMetric: "Profit Margin",
    relatedValue: "18.2%",
    changePercentage: 2.7,
    relatedEntities: ["Operations", "COGS"],
    actions: ["Document efficiency improvements", "Analyze cost reduction factors"]
  },
  {
    id: 4,
    title: "Cash conversion cycle anomaly detected",
    description: "The cash conversion cycle has unexpectedly increased to 45 days, up from the historical average of 32 days.",
    category: "anomaly",
    severity: "critical",
    status: "new",
    timestamp: new Date(2025, 4, 12, 8, 20, 0),
    relatedMetric: "Cash Conversion Cycle",
    relatedValue: "45 days",
    changePercentage: 40.6,
    relatedEntities: ["Accounts Receivable", "Cash Flow"],
    actions: ["Review collection processes", "Analyze accounts receivable aging"]
  },
  {
    id: 5,
    title: "Q4 forecast accuracy improved",
    description: "Recent forecast adjustments have improved accuracy by 8.3% compared to previous quarter forecasts.",
    category: "forecast",
    severity: "success",
    status: "read",
    timestamp: new Date(2025, 4, 10, 13, 45, 0),
    relatedMetric: "Forecast Accuracy",
    relatedValue: "93.2%",
    changePercentage: 8.3,
    relatedEntities: ["FP&A", "Sales Forecast"],
    actions: ["Document methodology improvements", "Share learnings with team"]
  },
  {
    id: 6,
    title: "GL to sub-ledger reconciliation issues",
    description: "7 unreconciled items found between General Ledger and Accounts Payable sub-ledger totaling $42,350.",
    category: "reconciliation",
    severity: "warning",
    status: "actioned",
    timestamp: new Date(2025, 4, 9, 16, 30, 0),
    relatedMetric: "Reconciliation Variance",
    relatedValue: "$42,350",
    relatedEntities: ["Accounting", "Accounts Payable"],
    actions: ["Review unreconciled items", "Update reconciliation process"]
  },
  {
    id: 7,
    title: "New expense category growth detected",
    description: "Cloud infrastructure expenses have grown by 34.8% this quarter, becoming a significant cost category.",
    category: "trend",
    severity: "info",
    status: "new",
    timestamp: new Date(2025, 4, 8, 10, 15, 0),
    relatedMetric: "Cloud Infrastructure Expenses",
    relatedValue: "$178K",
    changePercentage: 34.8,
    relatedEntities: ["IT", "Infrastructure"],
    actions: ["Add to regular budget review", "Develop cost optimization plan"]
  },
  {
    id: 8,
    title: "Budget approval bottleneck identified",
    description: "Marketing budget approvals are taking 2.3x longer than other departments, creating planning delays.",
    category: "anomaly",
    severity: "warning",
    status: "dismissed",
    timestamp: new Date(2025, 4, 7, 14, 20, 0),
    relatedMetric: "Approval Cycle Time",
    relatedValue: "9.6 days",
    changePercentage: 130,
    relatedEntities: ["Approvals", "Marketing"],
    actions: ["Review approval workflow", "Identify process improvements"]
  }
];

// Sample user preferences
const userPreferences = {
  notificationCategories: ["variance", "trend", "anomaly", "forecast", "budget", "reconciliation"],
  thresholds: {
    revenue: 10,
    expenses: 15,
    margin: 5
  },
  digestFrequency: "daily"
};

interface InsightsPanelProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  isExpanded = false, 
  onToggleExpand = () => {} 
}) => {
  const [insights, setInsights] = useState<Insight[]>(sampleInsights);
  const [filterStatus, setFilterStatus] = useState<InsightStatus | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<InsightSeverity | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<InsightCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'insights' | 'notifications'>('insights');
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  
  // Get severity badge
  const getSeverityBadge = (severity: InsightSeverity) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: InsightCategory) => {
    switch (category) {
      case 'variance':
        return <AlertTriangle className="h-4 w-4" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'anomaly':
        return <Activity className="h-4 w-4" />;
      case 'forecast':
        return <BarChart3 className="h-4 w-4" />;
      case 'budget':
        return <FileText className="h-4 w-4" />;
      case 'reconciliation':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  // Filter insights
  const filteredInsights = insights.filter(insight => {
    const statusMatch = filterStatus === 'all' || insight.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || insight.severity === filterSeverity;
    const categoryMatch = filterCategory === 'all' || insight.category === filterCategory;
    return statusMatch && severityMatch && categoryMatch;
  });
  
  // Get unread count
  const unreadCount = insights.filter(insight => insight.status === 'new').length;
  
  // Mark as read
  const markAsRead = (id: number) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, status: 'read' } : insight
    ));
  };
  
  // Mark as actioned
  const markAsActioned = (id: number) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, status: 'actioned' } : insight
    ));
    setInsightDialogOpen(false);
  };
  
  // Dismiss insight
  const dismissInsight = (id: number) => {
    setInsights(insights.map(insight => 
      insight.id === id ? { ...insight, status: 'dismissed' } : insight
    ));
    setInsightDialogOpen(false);
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const insightDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (insightDate.getTime() === today.getTime()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (insightDate.getTime() === today.getTime() - 86400000) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
        ` at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
  };
  
  // View insight details
  const viewInsightDetails = (insight: Insight) => {
    setSelectedInsight(insight);
    markAsRead(insight.id);
    setInsightDialogOpen(true);
  };
  
  // Get change indicator
  const getChangeIndicator = (percentage: number | undefined) => {
    if (percentage === undefined) return null;
    
    return percentage >= 0 ? (
      <div className="flex items-center text-green-600">
        <ArrowUpRight className="h-4 w-4 mr-1" />
        <span>+{percentage}%</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <ArrowDownRight className="h-4 w-4 mr-1" />
        <span>{percentage}%</span>
      </div>
    );
  };

  return (
    <>
      <Card className={`${isExpanded ? 'col-span-2' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle>AI Insights</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSettingsDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onToggleExpand}>
                {isExpanded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                )}
              </Button>
            </div>
          </div>
          <CardDescription>
            AI-generated insights based on your financial data
          </CardDescription>
        </CardHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(tab) => setActiveTab(tab as 'insights' | 'notifications')}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="insights">
                <Lightbulb className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notification Center
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="insights" className="pt-2">
            <div className="px-6 pb-2 flex gap-2 overflow-x-auto">
              <Select 
                value={filterSeverity} 
                onValueChange={(value) => setFilterSeverity(value as InsightSeverity | 'all')}
              >
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filterCategory} 
                onValueChange={(value) => setFilterCategory(value as InsightCategory | 'all')}
              >
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="variance">Variance</SelectItem>
                  <SelectItem value="trend">Trend</SelectItem>
                  <SelectItem value="anomaly">Anomaly</SelectItem>
                  <SelectItem value="forecast">Forecast</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="reconciliation">Reconciliation</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filterStatus} 
                onValueChange={(value) => setFilterStatus(value as InsightStatus | 'all')}
              >
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="actioned">Actioned</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <CardContent className="p-0">
              <ScrollArea className={`${isExpanded ? 'h-[500px]' : 'h-[350px]'}`}>
                <div className="px-6 py-2 space-y-2">
                  {filteredInsights.length > 0 ? (
                    filteredInsights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors ${insight.status === 'new' ? 'border-primary/30 bg-primary/5' : 'border-neutral-200'} ${insight.status === 'dismissed' ? 'opacity-60' : ''}`}
                        onClick={() => viewInsightDetails(insight)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-full ${
                              insight.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              insight.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                              insight.severity === 'success' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {getCategoryIcon(insight.category)}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {insight.title}
                                {insight.status === 'new' && (
                                  <Badge className="bg-primary text-white text-xs py-0 px-1.5">New</Badge>
                                )}
                              </div>
                              <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                                {insight.description}
                              </p>
                              {insight.relatedMetric && (
                                <div className="flex items-center gap-4 mt-2">
                                  <div className="text-sm">
                                    <span className="text-neutral-500">{insight.relatedMetric}:</span>
                                    <span className="ml-1 font-medium">{insight.relatedValue}</span>
                                  </div>
                                  {insight.changePercentage !== undefined && getChangeIndicator(insight.changePercentage)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {getSeverityBadge(insight.severity)}
                            <div className="text-xs text-neutral-400 mt-1.5">
                              {formatDate(insight.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-neutral-400">
                      <Lightbulb className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p>No insights match your filters</p>
                      <Button variant="link" onClick={() => {
                        setFilterStatus('all');
                        setFilterSeverity('all');
                        setFilterCategory('all');
                      }}>
                        Reset filters
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="notifications" className="pt-2">
            <CardContent className="p-0">
              <ScrollArea className={`${isExpanded ? 'h-[500px]' : 'h-[350px]'}`}>
                <div className="px-6 py-2">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b">
                    <h3 className="font-medium">Notification Preferences</h3>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Variances & Anomalies</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <BellOff className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Trend Insights</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <BellOff className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Forecast Updates</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <BellOff className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Monthly Digest</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3 pb-2 border-b">
                    <h3 className="font-medium">Recent Notifications</h3>
                    <Button variant="link" size="sm" className="h-7">
                      Mark all as read
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {insights
                      .filter(insight => insight.status === 'new')
                      .slice(0, 5)
                      .map(insight => (
                        <div 
                          key={insight.id}
                          className="p-3 rounded-lg border border-primary/30 bg-primary/5 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => viewInsightDetails(insight)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-full ${
                              insight.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              insight.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                              insight.severity === 'success' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {getCategoryIcon(insight.category)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{insight.title}</p>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {formatDate(insight.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    
                    {insights.filter(insight => insight.status === 'new').length === 0 && (
                      <div className="text-center py-8 text-neutral-400">
                        <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p>You're all caught up!</p>
                        <p className="text-sm mt-1">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="px-6 py-4 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-neutral-500">
              {filteredInsights.length} insights available
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                View All
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Insight Detail Dialog */}
      <Dialog open={insightDialogOpen} onOpenChange={setInsightDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedInsight && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selectedInsight.title}</DialogTitle>
                  {getSeverityBadge(selectedInsight.severity)}
                </div>
                <DialogDescription>
                  {formatDate(selectedInsight.timestamp)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <p>{selectedInsight.description}</p>
                
                {(selectedInsight.relatedMetric || selectedInsight.changePercentage) && (
                  <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg">
                    <div>
                      <span className="text-sm text-neutral-500">Metric:</span>
                      <span className="ml-2 font-medium">{selectedInsight.relatedMetric}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedInsight.relatedValue}</span>
                      {selectedInsight.changePercentage !== undefined && getChangeIndicator(selectedInsight.changePercentage)}
                    </div>
                  </div>
                )}
                
                {selectedInsight.relatedEntities && selectedInsight.relatedEntities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Related Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedInsight.relatedEntities.map((entity, idx) => (
                        <Badge key={idx} variant="outline">{entity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedInsight.actions && selectedInsight.actions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedInsight.actions.map((action, idx) => (
                        <li key={idx} className="text-sm">{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex justify-between">
                <div>
                  <Button variant="ghost" size="sm" onClick={() => dismissInsight(selectedInsight.id)}>
                    Dismiss
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setInsightDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => markAsActioned(selectedInsight.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Take Action
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Insight Preferences</DialogTitle>
            <DialogDescription>
              Customize which insights and notifications you receive
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Insight Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="variance" 
                    className="rounded border-gray-300"
                    defaultChecked={userPreferences.notificationCategories.includes("variance")} 
                  />
                  <label htmlFor="variance" className="text-sm">Variances</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="trend" 
                    className="rounded border-gray-300"
                    defaultChecked={userPreferences.notificationCategories.includes("trend")} 
                  />
                  <label htmlFor="trend" className="text-sm">Trends</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="anomaly" 
                    className="rounded border-gray-300"
                    defaultChecked={userPreferences.notificationCategories.includes("anomaly")} 
                  />
                  <label htmlFor="anomaly" className="text-sm">Anomalies</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="forecast" 
                    className="rounded border-gray-300"
                    defaultChecked={userPreferences.notificationCategories.includes("forecast")} 
                  />
                  <label htmlFor="forecast" className="text-sm">Forecasts</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="budget" 
                    className="rounded border-gray-300"
                    defaultChecked={userPreferences.notificationCategories.includes("budget")} 
                  />
                  <label htmlFor="budget" className="text-sm">Budget</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="reconciliation" 
                    className="rounded border-gray-300"
                    defaultChecked={userPreferences.notificationCategories.includes("reconciliation")} 
                  />
                  <label htmlFor="reconciliation" className="text-sm">Reconciliation</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Alert Thresholds</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <label htmlFor="revenue-threshold" className="text-sm">Revenue Variance</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      id="revenue-threshold" 
                      className="w-16 h-8 rounded border text-right"
                      defaultValue={userPreferences.thresholds.revenue} 
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <label htmlFor="expenses-threshold" className="text-sm">Expense Variance</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      id="expenses-threshold" 
                      className="w-16 h-8 rounded border text-right"
                      defaultValue={userPreferences.thresholds.expenses} 
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <label htmlFor="margin-threshold" className="text-sm">Margin Variance</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      id="margin-threshold" 
                      className="w-16 h-8 rounded border text-right"
                      defaultValue={userPreferences.thresholds.margin} 
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notification Preferences</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="digest-frequency" className="text-sm">Digest Frequency</label>
                  <Select defaultValue={userPreferences.digestFrequency}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="email-notification" 
                    className="rounded border-gray-300"
                    defaultChecked={true} 
                  />
                  <label htmlFor="email-notification" className="text-sm">Email Notifications</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="in-app-notification" 
                    className="rounded border-gray-300"
                    defaultChecked={true} 
                  />
                  <label htmlFor="in-app-notification" className="text-sm">In-App Notifications</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setSettingsDialogOpen(false)}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InsightsPanel;