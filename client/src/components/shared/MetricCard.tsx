import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  changePercentage: string;
  icon?: ReactNode;
  isLoading?: boolean;
  format?: 'currency' | 'percentage' | 'number';
  trendIsGood?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  changePercentage,
  icon,
  isLoading = false,
  format = 'currency',
  trendIsGood = true,
  size = 'md'
}) => {
  // Parse change percentage as a number
  const changeValue = parseFloat(changePercentage);
  const isPositive = changeValue > 0;
  const isGood = trendIsGood ? isPositive : !isPositive;
  
  // Format the value based on the format prop
  const formatValue = (val: string): string => {
    const numValue = parseFloat(val.replace(/,/g, ''));
    if (isNaN(numValue)) return val;
    
    if (format === 'currency') {
      // Format as currency with dollar sign and commas
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(numValue);
    } else if (format === 'percentage') {
      // Format as percentage
      return `${numValue.toFixed(1)}%`;
    } else {
      // Format as number with commas
      return new Intl.NumberFormat('en-US').format(numValue);
    }
  };
  
  // Size-based classes
  const sizeClasses = {
    sm: {
      card: 'p-3',
      title: 'text-xs',
      value: 'text-lg font-bold',
      change: 'text-xs',
      iconSize: 'h-4 w-4'
    },
    md: {
      card: 'p-4',
      title: 'text-sm',
      value: 'text-xl font-bold',
      change: 'text-sm',
      iconSize: 'h-5 w-5'
    },
    lg: {
      card: 'p-5',
      title: 'text-base',
      value: 'text-2xl font-bold',
      change: 'text-sm',
      iconSize: 'h-6 w-6'
    }
  };
  
  // Get classes for current size
  const classes = sizeClasses[size];
  
  return (
    <Card>
      <CardContent className={cn('flex flex-col gap-3', classes.card)}>
        <div className="flex justify-between items-start">
          <span className={cn('text-muted-foreground', classes.title)}>{title}</span>
          {icon && <div className="mt-0.5">{icon}</div>}
        </div>
        
        {isLoading ? (
          <>
            <Skeleton className={cn('h-7 w-24', size === 'lg' ? 'h-8 w-32' : '')} />
            <Skeleton className="h-4 w-16" />
          </>
        ) : (
          <>
            <div className={classes.value}>{formatValue(value)}</div>
            <div className="flex items-center">
              <div className={cn(
                'flex items-center',
                classes.change,
                isGood ? 'text-emerald-600' : 'text-red-600'
              )}>
                {isPositive ? (
                  <ChevronUp className="mr-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="mr-1 h-3 w-3" />
                )}
                {changeValue.toFixed(1)}%
              </div>
              <span className={cn('text-xs text-muted-foreground ml-1')}>vs prev.</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;