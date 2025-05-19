import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BarChart, 
  DollarSign, 
  LineChart, 
  FileText, 
  Users, 
  AlertCircle, 
  Database, 
  Settings
} from 'lucide-react';

interface MobileNavigationItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const MobileNavigationItem: React.FC<MobileNavigationItemProps> = ({
  href,
  icon,
  label,
  isActive = false
}) => {
  return (
    <Link href={href}>
      <div 
        className={cn(
          "flex flex-col items-center justify-center space-y-1 w-full px-2 py-2",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="relative">
          {icon}
        </div>
        <span className="text-xs">{label}</span>
      </div>
    </Link>
  );
};

export interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const [location] = useLocation();
  
  const navigationItems = [
    {
      href: "/mobile-dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard"
    },
    {
      href: "/anomaly-detection",
      icon: <AlertCircle className="h-5 w-5" />,
      label: "Anomalies"
    },
    {
      href: "/budgeting",
      icon: <DollarSign className="h-5 w-5" />,
      label: "Budget"
    },
    {
      href: "/forecasting",
      icon: <LineChart className="h-5 w-5" />,
      label: "Forecast"
    },
    {
      href: "/enhanced-collaboration",
      icon: <Users className="h-5 w-5" />,
      label: "Team"
    }
  ];
  
  return (
    <div className={cn(
      "fixed bottom-0 w-full bg-background border-t border-border z-50 flex items-center justify-around",
      className
    )}>
      {navigationItems.map((item) => (
        <MobileNavigationItem 
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={location === item.href}
        />
      ))}
    </div>
  );
};

export default MobileNavigation;