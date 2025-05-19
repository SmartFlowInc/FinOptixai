import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowRight, BarChart, Clock, DollarSign, Filter, LineChart, Loader2, Percent, PieChart, RefreshCw, Skull, TrendingDown, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types
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

interface AnomalyDetectionProps {
  financialData?: any;
  isLoading?: boolean;
}

// Helper functions for styling and icons
const getSeverityColorClass = (severity: AnomalySeverity): string => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-300';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusColorClass = (status: AnomalyStatus): string => {
  switch (status) {
    case 'detected': return 'bg-blue-100 text-blue-800';
    case 'investigating': return 'bg-purple-100 text-purple-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'ignored': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMetricIcon = (metric: FinancialMetric) => {
  switch (metric) {
    case 'revenue': return <TrendingUp className="h-5 w-5 text-green-600" />;
    case 'expenses': return <TrendingDown className="h-5 w-5 text-red-600" />;
    case 'cashflow': return <DollarSign className="h-5 w-5 text-blue-600" />;
    case 'margin': return <Percent className="h-5 w-5 text-purple-600" />;
    case 'growth': return <BarChart className="h-5 w-5 text-indigo-600" />;
    case 'operation': return <PieChart className="h-5 w-5 text-orange-600" />;
    default: return <LineChart className="h-5 w-5 text-gray-600" />;
  }
};

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ financialData: initialData, isLoading: initialLoading }) => {
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [currentSeverity, setCurrentSeverity] = useState<string>('all');
  const [currentMetric, setCurrentMetric] = useState<string>('all');
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(null);
  
  // Get financial data from dashboard to analyze
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: !initialData,
  });

  // Combine data from props or query
  const financialData = initialData || dashboardData;
  const isLoadingData = initialLoading || isDashboardLoading;

  // Detect anomalies using AI
  const { data: anomalyResponse, isLoading: isAnomaliesLoading, refetch: refetchAnomalies } = useQuery({
    queryKey: ['/api/ai/anomalies'],
    enabled: !!financialData,
    queryFn: async () => {
      if (!financialData) return { anomalies: [] };
      
      try {
        const res = await fetch('/api/ai/anomalies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ financialData })
        });
        
        if (!res.ok) {
          throw new Error('API request failed');
        }
        
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Failed to detect anomalies:', error);
        return { anomalies: [] };
      }
    },
  });
  
  // Process anomalies data
  const anomalies = React.useMemo(() => {
    if (!anomalyResponse) return [];
    
    // Format dates if we have data
    if (Array.isArray(anomalyResponse)) {
      return anomalyResponse.map((anomaly: any) => ({
        ...anomaly,
        detectedAt: new Date(anomaly.detectedAt),
        updatedAt: new Date(anomaly.updatedAt),
      }));
    }
    
    return [];
  }, [anomalyResponse]);

  // Update anomaly status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: AnomalyStatus }) => {
      // This would call an API endpoint to update the anomaly status in a real app
      // For now, we'll just simulate the change locally
      return { id, status };
    },
    onSuccess: () => {
      // In a real app, we would invalidate the anomaly cache to refetch
      // queryClient.invalidateQueries({ queryKey: ['/api/ai/anomalies'] });
    },
  });

  // Filter anomalies based on current filters
  const filteredAnomalies = anomalies?.filter((anomaly: AnomalyItem) => {
    if (currentFilter !== 'all' && anomaly.status !== currentFilter) return false;
    if (currentSeverity !== 'all' && anomaly.severity !== currentSeverity) return false;
    if (currentMetric !== 'all' && anomaly.metric !== currentMetric) return false;
    return true;
  });

  // Handler for changing anomaly status
  const handleStatusChange = (id: number, status: AnomalyStatus) => {
    updateStatusMutation.mutate({ id, status });
    
    if (selectedAnomaly && selectedAnomaly.id === id) {
      setSelectedAnomaly({ ...selectedAnomaly, status });
    }
  };

  const isLoading = isLoadingData || isAnomaliesLoading;

  // If no API key is configured
  const checkApiKey = useQuery({
    queryKey: ['/api/ai/health'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/ai/health');
        if (!res.ok) throw new Error('Health check failed');
        return res.json();
      } catch (error) {
        console.error('Failed to check API health:', error);
        throw error;
      }
    }
  });

  if (checkApiKey.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Checking AI service availability...</p>
      </div>
    );
  }

  if (checkApiKey.isError || (checkApiKey.data && checkApiKey.data.status === 'unavailable')) {
    return (
      <Alert className="mb-6 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">OpenAI API Key Required</AlertTitle>
        <AlertDescription className="text-amber-700">
          To use AI-powered anomaly detection, please configure your OpenAI API key in the environment variables.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Mock anomalies for testing the UI when real API calls fail
  const mockAnomalies: AnomalyItem[] = [
    {
      id: 1,
      title: "Q3 Marketing Budget Overspend",
      description: "Marketing expenses exceeded budgeted amount by 28% in Q3 2023",
      type: "variance",
      severity: "high",
      status: "detected",
      metric: "expenses",
      detectedAt: new Date("2023-10-01"),
      updatedAt: new Date("2023-10-01"),
      impact: {
        description: "Significant impact on quarterly profits due to unplanned marketing costs",
        value: 82500,
        isMonetary: true
      },
      affectedPeriods: ["Q3 2023"],
      historicalContext: "Marketing spend has historically been within 5% of budget over the past 8 quarters",
      potentialCauses: [
        "New product launch campaign costs were underestimated",
        "Additional digital advertising was approved without proper budget amendment",
        "Agency fees increased mid-quarter without budget adjustment"
      ],
      recommendedActions: [
        "Review marketing approval process for ad-hoc campaigns",
        "Implement budget threshold alerts for department heads",
        "Reallocate Q4 budget to accommodate Q3 overspend"
      ]
    },
    {
      id: 2,
      title: "Declining Sales in European Region",
      description: "European region showing consistent downward trend in revenue for past 3 quarters",
      type: "trend",
      severity: "critical",
      status: "investigating",
      metric: "revenue",
      detectedAt: new Date("2023-09-15"),
      updatedAt: new Date("2023-09-20"),
      impact: {
        description: "Consistent decline representing significant revenue loss to the organization",
        value: 18.5,
        isMonetary: false
      },
      affectedPeriods: ["Q1 2023", "Q2 2023", "Q3 2023"],
      historicalContext: "European market was previously the second strongest region with reliable growth",
      potentialCauses: [
        "Increased regional competition",
        "Economic factors affecting consumer spending in EU countries",
        "Possible product-market fit issues with latest offerings"
      ],
      recommendedActions: [
        "Conduct market analysis focused on European competitors",
        "Review pricing strategy for European markets",
        "Allocate additional resources to European sales team"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Control panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Financial Anomaly Detection</CardTitle>
              <CardDescription>
                AI-powered detection of unusual patterns in your financial data
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchAnomalies()}
              disabled={isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Analyzing...' : 'Analyze Data'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-sm font-medium mr-2">Filters:</span>
            </div>
            
            <Select value={currentFilter} onValueChange={setCurrentFilter}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="detected">Detected</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={currentSeverity} onValueChange={setCurrentSeverity}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={currentMetric} onValueChange={setCurrentMetric}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="expenses">Expenses</SelectItem>
                <SelectItem value="cashflow">Cash Flow</SelectItem>
                <SelectItem value="margin">Margin</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="operation">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium">Analyzing financial data...</h3>
          <p className="text-neutral-500 mt-2">
            Our AI is scanning your data for anomalies and patterns
          </p>
        </div>
      )}

      {/* Empty state - no anomalies found */}
      {!isLoading && anomalies && anomalies.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-neutral-50">
          <div className="p-4 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium">No Anomalies Detected</h3>
          <p className="text-neutral-500 mt-2 text-center max-w-md">
            Your financial data appears to be consistent with expected patterns.
            Continue monitoring or adjust sensitivity settings to detect more subtle anomalies.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => refetchAnomalies()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Analyze Again
          </Button>
        </div>
      )}

      {/* Results - grid of anomalies */}
      {!isLoading && filteredAnomalies && filteredAnomalies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* List of anomalies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Detected Anomalies ({filteredAnomalies.length})
            </h3>
            
            {filteredAnomalies.map((anomaly: AnomalyItem) => (
              <Card 
                key={anomaly.id} 
                className={`border-l-4 hover:bg-neutral-50 cursor-pointer transition-colors ${
                  selectedAnomaly?.id === anomaly.id ? 'bg-neutral-50 ring-1 ring-primary/20' : ''
                } ${
                  anomaly.severity === 'critical' ? 'border-l-red-500' : 
                  anomaly.severity === 'high' ? 'border-l-orange-500' : 
                  anomaly.severity === 'medium' ? 'border-l-yellow-500' : 
                  'border-l-green-500'
                }`}
                onClick={() => setSelectedAnomaly(anomaly)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {getMetricIcon(anomaly.metric)}
                      <CardTitle className="text-base ml-2">{anomaly.title}</CardTitle>
                    </div>
                    <Badge className={getStatusColorClass(anomaly.status)}>
                      {anomaly.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {anomaly.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {anomaly.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {anomaly.metric}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        anomaly.severity === 'critical' ? 'text-red-600 border-red-200' : 
                        anomaly.severity === 'high' ? 'text-orange-600 border-orange-200' : 
                        anomaly.severity === 'medium' ? 'text-yellow-600 border-yellow-200' : 
                        'text-green-600 border-green-200'
                      }`}
                    >
                      {anomaly.severity} severity
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-neutral-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Detected {new Date(anomaly.detectedAt).toLocaleDateString()}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Detail view of selected anomaly */}
          <div className="space-y-4">
            {selectedAnomaly ? (
              <Card className="border-t-4 border-t-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        {getMetricIcon(selectedAnomaly.metric)}
                        <CardTitle className="ml-2">{selectedAnomaly.title}</CardTitle>
                      </div>
                      <CardDescription>
                        Detected on {new Date(selectedAnomaly.detectedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Select 
                      value={selectedAnomaly.status}
                      onValueChange={(value: string) => 
                        handleStatusChange(selectedAnomaly.id, value as AnomalyStatus)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detected">Detected</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="ignored">Ignored</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getSeverityColorClass(selectedAnomaly.severity)}>
                        {selectedAnomaly.severity} severity
                      </Badge>
                      <Badge variant="outline">
                        {selectedAnomaly.type} anomaly
                      </Badge>
                      <Badge variant="outline">
                        {selectedAnomaly.metric}
                      </Badge>
                    </div>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Impact Assessment</AlertTitle>
                      <AlertDescription>
                        {selectedAnomaly.impact.description}
                        <div className="mt-2 font-medium">
                          {selectedAnomaly.impact.isMonetary 
                            ? `$${selectedAnomaly.impact.value.toLocaleString()}`
                            : `${selectedAnomaly.impact.value}%`
                          }
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="causes">Causes</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                      <TabsTrigger value="context">Context</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4 pt-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Description</h4>
                        <p className="text-sm text-neutral-700">{selectedAnomaly.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Affected Periods</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAnomaly.affectedPeriods.map((period, index) => (
                            <Badge key={index} variant="outline">{period}</Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="causes" className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Potential Causes</h4>
                      {selectedAnomaly.potentialCauses && selectedAnomaly.potentialCauses.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedAnomaly.potentialCauses.map((cause, index) => (
                            <li key={index} className="text-sm text-neutral-700">{cause}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-neutral-500">No potential causes identified.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="actions" className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                      {selectedAnomaly.recommendedActions && selectedAnomaly.recommendedActions.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {selectedAnomaly.recommendedActions.map((action, index) => (
                            <li key={index} className="text-sm text-neutral-700">{action}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-neutral-500">No recommended actions available.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="context" className="pt-4">
                      <h4 className="text-sm font-medium mb-2">Historical Context</h4>
                      {selectedAnomaly.historicalContext ? (
                        <p className="text-sm text-neutral-700">{selectedAnomaly.historicalContext}</p>
                      ) : (
                        <p className="text-sm text-neutral-500">No historical context available.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 h-full border rounded-lg bg-neutral-50">
                <ArrowLeft className="h-8 w-8 text-neutral-400 mb-3" />
                <h3 className="text-lg font-medium">Select an Anomaly</h3>
                <p className="text-neutral-500 mt-2 text-center">
                  Click on an anomaly from the list to view detailed information
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// A fallback component to display if there's an error loading the CheckCircle icon
const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// A fallback component to display if there's an error loading the ArrowLeft icon
const ArrowLeft = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default AnomalyDetection;