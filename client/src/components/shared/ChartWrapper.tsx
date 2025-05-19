import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface ChartWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  isLoading?: boolean;
  loadingHeight?: number;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}

/**
 * ChartWrapper - A consistent container for charts and visualizations
 * 
 * This component provides a standardized way to display charts with
 * consistent loading states, headers, and styling across the application.
 */
const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  description,
  children,
  className,
  contentClassName,
  isLoading = false,
  loadingHeight = 200,
  footer,
  headerAction
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Optional header with title and description */}
      {(title || description) && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              {title && <CardTitle className="text-base">{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </CardHeader>
      )}
      
      {/* Chart content */}
      <CardContent className={cn("px-2 pb-2", contentClassName)}>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Skeleton className={cn("w-full rounded-lg", `h-[${loadingHeight}px]`)} />
          </div>
        ) : (
          children
        )}
        
        {/* Optional footer content */}
        {footer && !isLoading && (
          <div className="mt-3">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartWrapper;