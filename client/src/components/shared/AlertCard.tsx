import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type AlertType = 'info' | 'warning' | 'error' | 'success';

export interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface AlertCardProps {
  title: string;
  message: string;
  type?: AlertType;
  icon?: React.ReactNode;
  actions?: AlertAction[];
  timestamp?: Date | string;
  className?: string;
  compact?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  badgeText?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({
  title,
  message,
  type = 'info',
  icon,
  actions = [],
  timestamp,
  className,
  compact = false,
  dismissible = false,
  onDismiss,
  badgeText
}) => {
  // Get background and text colors based on alert type
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default: // info
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Get badge styles based on alert type
  const getBadgeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default: // info
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Format date 
  const formatTimestamp = (date: Date | string) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // If less than 24 hours ago, show relative time
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      if (hours < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 0 ? 'just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    
    // Otherwise show date
    return dateObj.toLocaleDateString();
  };

  return (
    <Card className={cn('border overflow-hidden', getAlertStyles(), className)}>
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h4 className={cn("font-medium", compact ? 'text-sm' : 'text-base')}>
                  {title}
                </h4>
                {badgeText && (
                  <Badge className={cn('text-xs', getBadgeStyles())}>
                    {badgeText}
                  </Badge>
                )}
              </div>
              
              {timestamp && (
                <span className="text-xs text-muted-foreground ml-2">
                  {formatTimestamp(timestamp)}
                </span>
              )}
            </div>
            
            <p className={cn("text-muted-foreground", compact ? 'text-xs' : 'text-sm')}>
              {message}
            </p>
            
            {/* Action buttons */}
            {(actions.length > 0 || dismissible) && (
              <div className={cn(
                "flex gap-2 items-center", 
                compact ? 'mt-2' : 'mt-3',
                actions.length > 1 ? 'justify-between' : 'justify-end'
              )}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size={compact ? 'sm' : 'default'}
                    onClick={action.onClick}
                    className={compact ? 'h-7 text-xs px-2' : ''}
                  >
                    {action.label}
                  </Button>
                ))}
                
                {dismissible && (
                  <Button
                    variant="ghost"
                    size={compact ? 'sm' : 'default'}
                    onClick={onDismiss}
                    className={compact ? 'h-7 text-xs px-2' : ''}
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;