import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import { useNotifications } from '@/hooks/use-notifications';
import NotificationCenter from '@/components/mobile/NotificationCenter';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: React.ReactNode;
}

// Map of page paths to their titles and descriptions
const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { 
    title: 'FinOptix Dashboard', 
    description: 'Overview of key financial metrics and insights' 
  },
  '/advanced': { 
    title: 'Advanced Analytics', 
    description: 'In-depth financial analysis and visualizations' 
  },
  '/forecasting': { 
    title: 'Financial Forecasting', 
    description: 'Predictive modeling for financial planning' 
  },
  '/budgeting': { 
    title: 'Budget Management', 
    description: 'Track and manage budget allocations and actuals' 
  },
  '/insights': { 
    title: 'AI-Powered Insights', 
    description: 'Intelligent financial recommendations' 
  },
  '/reports': { 
    title: 'Financial Reports', 
    description: 'Customizable and shareable financial reports' 
  },
  '/data-sources': { 
    title: 'Data Sources', 
    description: 'Manage connections to financial data sources' 
  },
  '/settings': { 
    title: 'Settings', 
    description: 'Configure account and application preferences' 
  },
  '/mobile': { 
    title: 'Mobile Dashboard', 
    description: 'Optimized view for mobile devices' 
  },
};

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isNotificationCenterOpen } = useNotifications();
  const isMobile = useIsMobile();
  
  // Get current page info
  const currentPage = pageTitles[location] || { 
    title: 'FinOptix', 
    description: 'Enterprise Financial Planning & Analysis' 
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto p-4 sm:p-6">
            {/* Only show page header if not on mobile view */}
            {!isMobile && (
              <div className="mb-6">
                <h1 className="text-2xl font-semibold">{currentPage.title}</h1>
                <p className="text-muted-foreground">{currentPage.description}</p>
              </div>
            )}
            
            {children}
          </div>
        </main>
        
        {/* Notification center - conditional render */}
        {isNotificationCenterOpen && (
          <NotificationCenter />
        )}
      </div>
    </div>
  );
};

export default PageLayout;