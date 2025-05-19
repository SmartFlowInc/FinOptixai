import React from 'react';
import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Bell, 
  Settings 
} from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const [location, navigate] = useLocation();
  
  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
      path: '/mobile'
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Reports',
      path: '/reports'
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: 'Forecast',
      path: '/forecasting'
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      label: 'Budget',
      path: '/budgeting'
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: 'Alerts',
      path: '/notifications'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      path: '/settings'
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-lg">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`flex flex-1 flex-col items-center justify-center h-full ${
              location === item.path 
                ? 'text-blue-600' 
                : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="mt-1 text-xs font-medium">{item.label}</span>
            {location === item.path && (
              <div className="absolute bottom-0 h-1 w-6 rounded-t-full bg-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;