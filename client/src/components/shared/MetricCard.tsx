import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/data/finance';

export interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  changePercentage?: string | number;
  description?: string;
  icon?: React.ReactNode;
  progressValue?: number;
  progressTarget?: number;
  format?: 'currency' | 'percentage' | 'number';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  trendIsGood?: boolean;
  iconPosition?: 'left' | 'top';
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  previousValue,
  changePercentage,
  description,
  icon,
  progressValue,
  progressTarget,
  format = 'currency',
  className,
  size = 'md',
  isLoading = false,
  trendIsGood,
  iconPosition = 'left',
  onClick
}) => {
  // Format the displayed value
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return formatCurrency(val);
    } else if (format === 'percentage') {
      return formatPercentage(val);
    }
    return val;
  };

  // Calculate if trend is positive
  const trendValue = typeof changePercentage === 'string' 
    ? parseFloat(changePercentage) 
    : Number(changePercentage || 0);
  
  const isTrendPositive = trendValue > 0;
  
  // Determine if trend is good (if not explicitly provided)
  const isTrendGood = trendIsGood !== undefined 
    ? trendIsGood 
    : true; // Default to true if not specified

  // Calculate progress percentage if target is provided
  const progressPercentage = progressValue && progressTarget 
    ? (Number(progressValue) / Number(progressTarget)) * 100
    : progressValue;

  // Card size classes
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5'
  };

  const valueSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className={sizeClasses[size]}>
          <div className="bg-muted h-4 w-1/3 rounded mb-3"></div>
          <div className="bg-muted h-8 w-1/2 rounded mb-2"></div>
          {description && <div className="bg-muted h-3 w-3/4 rounded"></div>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn("overflow-hidden", className, onClick && "cursor-pointer hover:shadow-md transition-shadow")}
      onClick={onClick}
    >
      <CardContent className={sizeClasses[size]}>
        {/* Card header with icon and title */}
        <div className={cn(
          "flex items-center",
          iconPosition === 'left' ? 'flex-row gap-3 mb-2' : 'flex-col items-start gap-1 mb-2'
        )}>
          {icon && (
            <div className={cn(
              "flex-shrink-0",
              iconPosition === 'top' && "mb-1"
            )}>
              {icon}
            </div>
          )}
          <div>
            <h3 className={cn("font-medium text-muted-foreground", titleSizeClasses[size])}>
              {title}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* Metric value and trend */}
        <div className="flex items-end justify-between mt-1">
          <div className={cn("font-bold", valueSizeClasses[size])}>
            {formatValue(value)}
          </div>

          {changePercentage && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              (isTrendPositive && isTrendGood) || (!isTrendPositive && !isTrendGood) 
                ? "text-green-600" 
                : "text-red-600"
            )}>
              {isTrendPositive ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
              )}
              <span>{formatPercentage(Math.abs(trendValue))}</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progressPercentage !== undefined && (
          <div className="mt-2">
            <Progress value={progressPercentage} className="h-1.5" />
            {progressValue !== undefined && progressTarget !== undefined && (
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{formatValue(progressValue)}</span>
                <span>{formatValue(progressTarget)}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;