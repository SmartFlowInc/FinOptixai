import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';

const metricIconVariants = cva(
  "flex items-center justify-center rounded-full p-2 w-8 h-8 flex-shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        accent: "bg-accent/10 text-accent",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-rose-100 text-rose-700",
        info: "bg-sky-100 text-sky-700",
      },
      size: {
        sm: "w-7 h-7 p-1.5 text-sm",
        md: "w-9 h-9 p-2 text-base",
        lg: "w-11 h-11 p-2.5 text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface MetricCardProps extends VariantProps<typeof metricIconVariants> {
  title: string;
  value: string | number;
  icon?: React.ReactNode | LucideIcon;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  isLoading?: boolean;
  subtitle?: string;
  tooltipContent?: React.ReactNode;
  onClick?: () => void;
  highlightValue?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  className,
  variant = "default",
  size = "md",
  isLoading = false,
  subtitle,
  tooltipContent,
  onClick,
  highlightValue = false,
}) => {
  // If trend is not provided, infer it from change
  if (change !== undefined && trend === undefined) {
    trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  }

  const trendStyles = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    neutral: 'text-neutral-600 bg-neutral-50'
  };

  const trendIcons = {
    up: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
      </svg>
    ),
    neutral: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M8 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
        <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0015.5 2h-11zM4.5 4h11v12h-11V4z" clipRule="evenodd" />
      </svg>
    )
  };

  const cardContent = (
    <div 
      className={cn(
        "bg-white rounded-lg border p-4 transition-all duration-150",
        onClick && "hover:border-primary/50 cursor-pointer hover:shadow-sm",
        isLoading && "animate-pulse",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">{title}</span>
        {icon && <div className={cn(metricIconVariants({ variant, size }))}>{icon}</div>}
      </div>

      <div className="mt-2 space-y-1">
        {isLoading ? (
          <Skeleton className="h-9 w-28" />
        ) : (
          <div className={cn(
            "text-2xl font-semibold tracking-tight text-neutral-900",
            highlightValue && "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          )}>
            {value}
          </div>
        )}
        
        {subtitle && (
          <div className="text-sm text-neutral-500">
            {subtitle}
          </div>
        )}
      </div>
      
      {(change !== undefined || trend !== undefined) && !isLoading && (
        <div className="mt-3 flex items-center">
          <div className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
            trendStyles[trend || 'neutral']
          )}>
            {trendIcons[trend || 'neutral']}
            {change !== undefined && (
              <span>{Math.abs(change).toFixed(1)}%</span>
            )}
          </div>
          <span className="text-xs text-neutral-500 ml-1.5">
            vs previous period
          </span>
        </div>
      )}
    </div>
  );

  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
};

export default MetricCard;