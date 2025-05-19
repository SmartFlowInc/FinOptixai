import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  DollarSign, 
  BarChart, 
  Activity, 
  RefreshCw, 
  AlertCircle, 
  Bell,
  Calendar 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/data/finance';
import { Kpi } from '@shared/schema';

// Define mobile specific KPI visualization
export const MobileKpiCard: React.FC<{ 
  kpi: Kpi; 
  isLoading?: boolean;
}> = ({ 
  kpi, 
  isLoading = false 
}) => {
  // Format the trend indicator
  const getTrendIndicator = () => {
    if (!kpi.trend) return null;
    
    const isPositive = kpi.trend > 0;
    const isNegative = kpi.trend < 0;
    const isTrendGood = 
      (kpi.type === 'revenue' && isPositive) || 
      (kpi.type === 'expenses' && isNegative) ||
      (kpi.type === 'profit' && isPositive) ||
      (kpi.type === 'cashflow' && isPositive);
    
    return (
      <div 
        className={cn(
          "flex items-center text-xs font-medium",
          isTrendGood ? "text-green-600" : "text-red-600"
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-1" />
        )}
        <span>{formatPercentage(Math.abs(kpi.trend))}</span>
      </div>
    );
  };

  // Get the appropriate icon based on KPI type
  const getKpiIcon = () => {
    switch (kpi.type) {
      case 'revenue':
        return <DollarSign className="h-5 w-5 text-emerald-600" />;
      case 'expenses':
        return <DollarSign className="h-5 w-5 text-red-600" />;
      case 'profit':
        return <BarChart className="h-5 w-5 text-blue-600" />;
      case 'cashflow':
        return <Activity className="h-5 w-5 text-purple-600" />;
      default:
        return <Zap className="h-5 w-5 text-amber-600" />;
    }
  };

  // Format the KPI title
  const getKpiTitle = () => {
    switch (kpi.type) {
      case 'revenue':
        return 'Revenue';
      case 'expenses':
        return 'Expenses';
      case 'profit':
        return 'Profit';
      case 'cashflow':
        return 'Cash Flow';
      default:
        return kpi.name || 'KPI';
    }
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-8 w-28 mt-2" />
          <Skeleton className="h-3 w-16 mt-1" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-muted-foreground">{getKpiTitle()}</h3>
          <div className="flex-shrink-0">
            {getKpiIcon()}
          </div>
        </div>
        <div className="mt-2 flex justify-between items-end">
          <div className="text-2xl font-bold">
            {kpi.type === 'revenue' || kpi.type === 'expenses' || kpi.type === 'profit' 
              ? formatCurrency(kpi.value) 
              : kpi.value}
          </div>
          {getTrendIndicator()}
        </div>
        {kpi.progress !== undefined && (
          <div className="mt-2">
            <Progress value={kpi.progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Mobile metrics grid component
export interface MobileMetricsProps {
  periodFilter?: string;
  onRefresh?: () => void;
}

const MobileMetrics: React.FC<MobileMetricsProps> = ({
  periodFilter = 'This Month',
  onRefresh
}) => {
  const { toast } = useToast();
  
  // Fetch KPIs data
  const { data: kpis, isLoading, refetch } = useQuery({
    queryKey: ['/api/dashboard'],
    select: (data) => data.kpis,
  });

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refetch();
      if (onRefresh) onRefresh();
      
      toast({
        title: "Metrics refreshed",
        description: "Financial metrics have been updated with the latest data."
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh metrics. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Key Metrics</h2>
          <p className="text-sm text-muted-foreground">{periodFilter}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="h-8 gap-1"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="sr-only md:not-sr-only">Refresh</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          // Skeleton loaders for 4 KPIs
          Array(4).fill(0).map((_, i) => (
            <MobileKpiCard key={i} kpi={{} as Kpi} isLoading />
          ))
        ) : kpis?.length ? (
          // Actual KPIs
          kpis.slice(0, 4).map((kpi) => (
            <MobileKpiCard key={kpi.id} kpi={kpi} />
          ))
        ) : (
          // Error state
          <div className="col-span-2 rounded-lg border border-dashed p-4 text-center">
            <AlertCircle className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No metrics available. Please check your data sources.
            </p>
          </div>
        )}
      </div>
      
      {/* Alerts and Notifications */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Recent Alerts</CardTitle>
            <Badge variant="outline" className="ml-2">3 New</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <div className="space-y-2">
            <div className="flex items-start p-2 rounded-md bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Cash flow anomaly detected</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-2 rounded-md bg-blue-50">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Marketing budget approval needed</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-2 rounded-md bg-amber-50">
              <Calendar className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Monthly report due in 2 days</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileMetrics;