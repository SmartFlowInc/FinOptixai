import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  minHeight?: number | string;
  headerAction?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  footer,
  className,
  isLoading = false,
  minHeight,
  headerAction
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all", 
      isLoading ? "opacity-70" : "opacity-100",
      className
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-neutral-900">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-neutral-500 mt-0.5">
              {description}
            </CardDescription>
          )}
        </div>
        {headerAction && (
          <div className="ml-auto flex items-center">
            {headerAction}
          </div>
        )}
      </CardHeader>
      <CardContent 
        className={cn(
          "px-6 relative",
          minHeight ? "min-h-[var(--min-height)]" : "",
          isLoading ? "pointer-events-none" : ""
        )}
        style={{ "--min-height": typeof minHeight === "number" ? `${minHeight}px` : minHeight } as React.CSSProperties}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
              <span className="text-xs font-medium text-neutral-500">Loading data...</span>
            </div>
          </div>
        ) : null}
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="border-t bg-neutral-50/50 px-6 py-3">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;