import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';

// Dashboard layout types
export type DashboardLayout = 'default' | 'compact' | 'expanded' | 'custom';

// Dashboard view types
export type DashboardView = 'standard' | 'advanced' | 'mobile';

// Dashboard context interface
interface DashboardContextType {
  // Layout state
  layout: DashboardLayout;
  setLayout: (layout: DashboardLayout) => void;
  
  // View state (standard, advanced, mobile)
  view: DashboardView;
  setView: (view: DashboardView) => void;
  
  // Dashboard data and loading state
  dashboardData: any; // Replace with proper type
  isLoading: boolean;
  refetch: () => Promise<any>;
  
  // Panel visibility states
  isInsightsPanelExpanded: boolean;
  toggleInsightsPanel: () => void;
  
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  
  // Layout configuration based on current layout
  layoutConfig: {
    mainChartHeight: number;
    secondaryChartHeight: number;
    mainColSpan: string;
    secondaryColSpan: string;
    contentPadding: string;
    chartGap: string;
  };
}

// Create Dashboard Context with default values
const DashboardContext = createContext<DashboardContextType>({
  layout: 'default',
  setLayout: () => {},
  view: 'standard',
  setView: () => {},
  dashboardData: null,
  isLoading: false,
  refetch: async () => ({}),
  isInsightsPanelExpanded: true,
  toggleInsightsPanel: () => {},
  isSidebarExpanded: true,
  toggleSidebar: () => {},
  layoutConfig: {
    mainChartHeight: 400,
    secondaryChartHeight: 300,
    mainColSpan: 'col-span-12',
    secondaryColSpan: 'col-span-6',
    contentPadding: 'p-4',
    chartGap: 'gap-4'
  }
});

// Custom hook to use dashboard context
export const useDashboard = () => useContext(DashboardContext);

// Dashboard Provider component
export const DashboardProvider: React.FC<{
  children: React.ReactNode;
  initialLayout?: DashboardLayout;
  initialView?: DashboardView;
}> = ({ 
  children, 
  initialLayout = 'default',
  initialView = 'standard'
}) => {
  // Get device type
  const isMobile = useIsMobile();
  
  // Get filter state
  const { period, department, region } = useFilters();
  
  // Internal state
  const [layout, setLayout] = useState<DashboardLayout>(initialLayout);
  const [view, setView] = useState<DashboardView>(isMobile ? 'mobile' : initialView);
  const [isInsightsPanelExpanded, setIsInsightsPanelExpanded] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isMobile);
  
  // Set mobile view automatically when on a mobile device
  useEffect(() => {
    if (isMobile && view !== 'mobile') {
      setView('mobile');
    }
  }, [isMobile, view]);
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['/api/dashboard', { period, department, region }],
  });
  
  // Toggle insights panel
  const toggleInsightsPanel = () => {
    setIsInsightsPanelExpanded(!isInsightsPanelExpanded);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  
  // Layout configuration based on current layout
  const getLayoutConfig = () => {
    switch (layout) {
      case 'compact':
        return {
          mainChartHeight: 300,
          secondaryChartHeight: 200,
          mainColSpan: 'col-span-12',
          secondaryColSpan: 'col-span-6',
          contentPadding: 'p-3',
          chartGap: 'gap-3'
        };
      case 'expanded':
        return {
          mainChartHeight: 500,
          secondaryChartHeight: 400,
          mainColSpan: 'col-span-12',
          secondaryColSpan: 'col-span-12',
          contentPadding: 'p-6',
          chartGap: 'gap-6'
        };
      case 'custom':
        return {
          mainChartHeight: 350,
          secondaryChartHeight: 300,
          mainColSpan: 'col-span-8',
          secondaryColSpan: 'col-span-6',
          contentPadding: 'p-4',
          chartGap: 'gap-4'
        };
      default:
        return {
          mainChartHeight: 400,
          secondaryChartHeight: 300,
          mainColSpan: 'col-span-12',
          secondaryColSpan: 'col-span-6',
          contentPadding: 'p-4',
          chartGap: 'gap-4'
        };
    }
  };
  
  // Create context value
  const value: DashboardContextType = {
    layout,
    setLayout,
    view,
    setView,
    dashboardData,
    isLoading,
    refetch,
    isInsightsPanelExpanded,
    toggleInsightsPanel,
    isSidebarExpanded,
    toggleSidebar,
    layoutConfig: getLayoutConfig()
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};