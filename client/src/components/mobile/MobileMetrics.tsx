import React from 'react';
import { ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface MobileMetricsProps {
  periodFilter: string;
  onRefresh: () => void;
  isLoading?: boolean;
}

interface MetricItemProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  isLoading?: boolean;
  isCurrency?: boolean;
}

const MetricItem: React.FC<MetricItemProps> = ({
  title,
  value,
  change,
  isPositive,
  isLoading = false,
  isCurrency = true
}) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground font-medium">{title}</span>
      {isLoading ? (
        <>
          <Skeleton className="h-5 w-20 mt-1" />
          <Skeleton className="h-4 w-12 mt-1" />
        </>
      ) : (
        <>
          <span className="text-md font-bold">
            {isCurrency ? '$' : ''}{value}
          </span>
          <div className={`flex items-center text-xs mt-1 ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ChevronUp className="h-3 w-3 mr-1" />
            ) : (
              <ChevronDown className="h-3 w-3 mr-1" />
            )}
            {change}
          </div>
        </>
      )}
    </div>
  );
};

const MobileMetrics: React.FC<MobileMetricsProps> = ({
  periodFilter,
  onRefresh,
  isLoading = false
}) => {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Badge variant="outline" className="bg-muted/50">
              {periodFilter}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs">Refresh</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-2">
          <MetricItem
            title="Revenue"
            value="1,250,000"
            change="8.7%"
            isPositive={true}
            isLoading={isLoading}
          />
          <MetricItem
            title="Expenses"
            value="850,000"
            change="6.2%"
            isPositive={false}
            isLoading={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <MetricItem
            title="Profit"
            value="400,000"
            change="14.3%"
            isPositive={true}
            isLoading={isLoading}
          />
          <MetricItem
            title="Cash Flow"
            value="325,000"
            change="8.3%"
            isPositive={true}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileMetrics;