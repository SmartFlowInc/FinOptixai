import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  ArrowUpDown, 
  BarChart4, 
  Brain, 
  LineChart, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp 
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Anomaly types
type AnomalyType = 'variance' | 'trend' | 'outlier' | 'pattern' | 'seasonal';
type AnomalySeverity = 'critical' | 'high' | 'medium' | 'low';
type AnomalyStatus = 'detected' | 'investigating' | 'resolved' | 'ignored';
type FinancialMetric = 'revenue' | 'expenses' | 'cashflow' | 'margin' | 'growth' | 'operation';

interface AnomalyItem {
  id: number;
  title: string;
  description: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  metric: FinancialMetric;
  detectedAt: Date;
  updatedAt: Date;
  impact: {
    description: string;
    value: number; // Percentage or monetary value
    isMonetary: boolean;
  };
  affectedPeriods: string[];
  historicalContext?: string;
  potentialCauses?: string[];
  recommendedActions?: string[];
}

// Fetch anomalies from OpenAI API
const fetchAnomaliesWithAI = async (financialData: any): Promise<AnomalyItem[]> => {
  try {
    const response = await fetch('/api/ai/anomalies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        financialData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch anomalies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in anomaly detection:', error);
    return [];
  }
};

// Mock anomalies for development purposes
const mockAnomalies: AnomalyItem[] = [
  {
    id: 1,
    title: 'Unusual Revenue Spike in Marketing Department',
    description: 'Detected an unusual 27% increase in marketing revenue compared to forecast for May 2025',
    type: 'outlier',
    severity: 'medium',
    status: 'detected',
    metric: 'revenue',
    detectedAt: new Date(2025, 4, 19, 8, 30),
    updatedAt: new Date(2025, 4, 19, 8, 30),
    impact: {
      description: 'Additional revenue above forecast',
      value: 145000,
      isMonetary: true
    },
    affectedPeriods: ['May 2025'],
    historicalContext: 'Revenue has consistently been within 5% of forecast for the past 12 months',
    potentialCauses: [
      'New marketing campaign launched in April',
      'Seasonal product demand',
      'Possible data entry error'
    ],
    recommendedActions: [
      'Verify data accuracy with Marketing team',
      'Analyze campaign performance metrics',
      'Update forecast if confirmed accurate'
    ]
  },
  {
    id: 2,
    title: 'Declining Profit Margin Trend',
    description: 'Detected a consistent decline in profit margins over the past 3 months',
    type: 'trend',
    severity: 'high',
    status: 'investigating',
    metric: 'margin',
    detectedAt: new Date(2025, 4, 15, 14, 25),
    updatedAt: new Date(2025, 4, 18, 9, 15),
    impact: {
      description: 'Margin reduction',
      value: 3.5,
      isMonetary: false
    },
    affectedPeriods: ['March 2025', 'April 2025', 'May 2025'],
    historicalContext: 'Profit margins were stable at 22-23% until February 2025',
    potentialCauses: [
      'Increased raw material costs',
      'Pricing pressure from competitors',
      'Higher logistics costs not reflected in pricing'
    ],
    recommendedActions: [
      'Review cost structure for all product lines',
      'Analyze pricing strategy against competitors',
      'Evaluate supplier contracts'
    ]
  },
  {
    id: 3,
    title: 'Cash Flow Variance in Operations',
    description: 'Operating cash flow was 18% below projection for Q1 2025',
    type: 'variance',
    severity: 'critical',
    status: 'detected',
    metric: 'cashflow',
    detectedAt: new Date(2025, 4, 18, 16, 45),
    updatedAt: new Date(2025, 4, 18, 16, 45),
    impact: {
      description: 'Reduced operational cash flow',
      value: 320000,
      isMonetary: true
    },
    affectedPeriods: ['Q1 2025'],
    potentialCauses: [
      'Extended payment terms with key customers',
      'Delayed collections process',
      'Unexpected operational expenses'
    ],
    recommendedActions: [
      'Review accounts receivable aging',
      'Analyze customer payment patterns',
      'Implement cash conservation measures'
    ]
  },
  {
    id: 4,
    title: 'Expense Pattern Anomaly in R&D',
    description: 'Detected unusual spending pattern in R&D expenses with mid-month spikes',
    type: 'pattern',
    severity: 'medium',
    status: 'detected',
    metric: 'expenses',
    detectedAt: new Date(2025, 4, 17, 11, 20),
    updatedAt: new Date(2025, 4, 17, 11, 20),
    impact: {
      description: 'Irregular expense timing',
      value: 85000,
      isMonetary: true
    },
    affectedPeriods: ['March 2025', 'April 2025', 'May 2025'],
    historicalContext: 'R&D expenses typically follow end-of-month payment patterns',
    potentialCauses: [
      'New project launches mid-month',
      'Change in vendor payment schedules',
      'Special R&D investments'
    ],
    recommendedActions: [
      'Consult with R&D department on spending patterns',
      'Review project timelines and associated expenses',
      'Update cash flow projections to account for pattern'
    ]
  },
  {
    id: 5,
    title: 'Seasonal Revenue Pattern Disruption',
    description: 'Traditional seasonal revenue pattern in Q2 not materializing as expected',
    type: 'seasonal',
    severity: 'high',
    status: 'investigating',
    metric: 'revenue',
    detectedAt: new Date(2025, 4, 16, 9, 10),
    updatedAt: new Date(2025, 4, 18, 14, 30),
    impact: {
      description: 'Potential revenue shortfall',
      value: 11,
      isMonetary: false
    },
    affectedPeriods: ['Q2 2025'],
    historicalContext: 'Q2 typically shows 15-18% growth in the North America region',
    potentialCauses: [
      'Market conditions changing seasonal patterns',
      'Competitive pressure in key markets',
      'Product launch delays affecting seasonal sales'
    ],
    recommendedActions: [
      'Perform detailed regional sales analysis',
      'Update sales forecast models',
      'Engage with sales leadership on market conditions'
    ]
  }
];

// Get severity color class
const getSeverityColorClass = (severity: AnomalySeverity): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-amber-100 text-amber-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

// Get status color class
const getStatusColorClass = (status: AnomalyStatus): string => {
  switch (status) {
    case 'detected':
      return 'bg-red-100 text-red-800';
    case 'investigating':
      return 'bg-amber-100 text-amber-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'ignored':
      return 'bg-neutral-100 text-neutral-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

// Get metric icon
const getMetricIcon = (metric: FinancialMetric) => {
  switch (metric) {
    case 'revenue':
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    case 'expenses':
      return <TrendingDown className="h-5 w-5 text-red-600" />;
    case 'cashflow':
      return <ArrowUpDown className="h-5 w-5 text-blue-600" />;
    case 'margin':
      return <BarChart4 className="h-5 w-5 text-purple-600" />;
    case 'growth':
      return <LineChart className="h-5 w-5 text-amber-600" />;
    case 'operation':
      return <BarChart4 className="h-5 w-5 text-neutral-600" />;
    default:
      return <LineChart className="h-5 w-5 text-neutral-600" />;
  }
};

interface AnomalyDetectionProps {
  financialData?: any;
  isLoading?: boolean;
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ 
  financialData, 
  isLoading = false 
}) => {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>(mockAnomalies);
  const [filteredAnomalies, setFilteredAnomalies] = useState<AnomalyItem[]>(mockAnomalies);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [metricFilter, setMetricFilter] = useState<string>('all');
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { toast } = useToast();
  
  // Filter anomalies based on criteria
  useEffect(() => {
    let filtered = [...anomalies];
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(a => a.severity === severityFilter);
    }
    
    if (metricFilter !== 'all') {
      filtered = filtered.filter(a => a.metric === metricFilter);
    }
    
    setFilteredAnomalies(filtered);
  }, [anomalies, severityFilter, metricFilter]);
  
  // Refresh anomalies with AI analysis
  const handleRefreshAnomalies = async () => {
    setRefreshing(true);
    
    try {
      // In a real implementation, this would call the API with real data
      const freshAnomalies = await fetchAnomaliesWithAI(financialData);
      
      // For demo purposes, we're just adding a small delay and using mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If API failed, use mock data
      if (freshAnomalies.length === 0) {
        setAnomalies([...mockAnomalies]);
      } else {
        setAnomalies(freshAnomalies);
      }
      
      toast({
        title: "Anomaly Detection Complete",
        description: "Financial data has been analyzed for anomalies.",
      });
    } catch (error) {
      console.error("Error refreshing anomalies:", error);
      toast({
        title: "Anomaly Detection Failed",
        description: "Unable to analyze financial data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  // Calculate anomaly stats
  const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
  const highCount = anomalies.filter(a => a.severity === 'high').length;
  const mediumCount = anomalies.filter(a => a.severity === 'medium').length;
  const lowCount = anomalies.filter(a => a.severity === 'low').length;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">AI Anomaly Detection</CardTitle>
              <CardDescription>
                AI-powered analysis of financial patterns and anomalies
              </CardDescription>
            </div>
            <Button 
              onClick={handleRefreshAnomalies} 
              disabled={refreshing}
              variant="outline"
            >
              {refreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Data
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Anomaly Overview</h3>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={severityFilter === 'all' ? 'bg-primary/10' : ''}
                    onClick={() => setSeverityFilter('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={metricFilter === 'all' ? 'bg-primary/10' : ''}
                    onClick={() => setMetricFilter('all')}
                  >
                    All Metrics
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Critical Anomalies</div>
                      <div className="text-xs text-neutral-500">Require immediate attention</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800" onClick={() => setSeverityFilter('critical')}>
                      {criticalCount}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">High Priority Anomalies</div>
                      <div className="text-xs text-neutral-500">Significant financial impact</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-800" onClick={() => setSeverityFilter('high')}>
                      {highCount}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Medium Priority Anomalies</div>
                      <div className="text-xs text-neutral-500">Trends to monitor</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800" onClick={() => setSeverityFilter('medium')}>
                      {mediumCount}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Low Priority Anomalies</div>
                      <div className="text-xs text-neutral-500">Minor deviations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800" onClick={() => setSeverityFilter('low')}>
                      {lowCount}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium">Metrics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-neutral-50 ${metricFilter === 'revenue' ? 'bg-primary/5 border-primary/20' : ''}`}
                  onClick={() => setMetricFilter(metricFilter === 'revenue' ? 'all' : 'revenue')}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="font-medium text-sm">Revenue</div>
                  </div>
                  <div className="mt-2 text-xs text-neutral-500">
                    Sales and revenue-related anomalies
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-neutral-50 ${metricFilter === 'expenses' ? 'bg-primary/5 border-primary/20' : ''}`}
                  onClick={() => setMetricFilter(metricFilter === 'expenses' ? 'all' : 'expenses')}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="font-medium text-sm">Expenses</div>
                  </div>
                  <div className="mt-2 text-xs text-neutral-500">
                    Cost and expense pattern anomalies
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-neutral-50 ${metricFilter === 'margin' ? 'bg-primary/5 border-primary/20' : ''}`}
                  onClick={() => setMetricFilter(metricFilter === 'margin' ? 'all' : 'margin')}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center">
                      <BarChart4 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="font-medium text-sm">Margins</div>
                  </div>
                  <div className="mt-2 text-xs text-neutral-500">
                    Profit margin variations and trends
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-neutral-50 ${metricFilter === 'cashflow' ? 'bg-primary/5 border-primary/20' : ''}`}
                  onClick={() => setMetricFilter(metricFilter === 'cashflow' ? 'all' : 'cashflow')}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <ArrowUpDown className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="font-medium text-sm">Cash Flow</div>
                  </div>
                  <div className="mt-2 text-xs text-neutral-500">
                    Cash flow and liquidity anomalies
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Anomalies List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Detected Anomalies {filteredAnomalies.length > 0 && `(${filteredAnomalies.length})`}
          </h3>
          <div className="text-sm text-neutral-500">
            Last analyzed: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        {filteredAnomalies.length === 0 ? (
          <div className="bg-neutral-50 border rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <LineChart className="h-6 w-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Anomalies Found</h3>
            <p className="text-neutral-500 max-w-md mx-auto mb-4">
              {severityFilter !== 'all' || metricFilter !== 'all' ? 
                'No anomalies match your current filters. Try changing your filter criteria.' :
                'No anomalies have been detected in your financial data based on current analysis.'
              }
            </p>
            <Button variant="outline" onClick={() => {
              setSeverityFilter('all');
              setMetricFilter('all');
            }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnomalies.map(anomaly => (
              <Card key={anomaly.id} className="border hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                        {getMetricIcon(anomaly.metric)}
                      </div>
                      <div>
                        <div className="font-medium">{anomaly.title}</div>
                        <div className="text-sm text-neutral-500">
                          Detected {new Date(anomaly.detectedAt).toLocaleDateString()} at {new Date(anomaly.detectedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColorClass(anomaly.severity)}>
                        {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)}
                      </Badge>
                      <Badge className={getStatusColorClass(anomaly.status)}>
                        {anomaly.status.charAt(0).toUpperCase() + anomaly.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {anomaly.metric.charAt(0).toUpperCase() + anomaly.metric.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3">{anomaly.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-neutral-500 mb-1">Impact</div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div>Financial Impact</div>
                        <div className="font-medium">
                          {anomaly.impact.isMonetary 
                            ? `$${anomaly.impact.value.toLocaleString()}` 
                            : `${anomaly.impact.value}%`}
                        </div>
                      </div>
                      <Progress value={
                        anomaly.impact.isMonetary
                          ? Math.min(100, (anomaly.impact.value / 1000000) * 100)
                          : Math.min(100, anomaly.impact.value * 5)
                      } className="h-1" />
                    </div>
                    
                    {anomaly.affectedPeriods.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <div>Affected periods:</div>
                        <div className="flex gap-1">
                          {anomaly.affectedPeriods.map((period, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {period}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div className="text-xs text-neutral-500">
                      {anomaly.status === 'investigating' ? 'Under investigation' : anomaly.status === 'resolved' ? 'Resolved' : ''}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedAnomaly(anomaly)}
                      >
                        View Details
                      </Button>
                      {(anomaly.status === 'detected' || anomaly.status === 'investigating') && (
                        <Button variant="default" size="sm">
                          Investigate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyDetection;