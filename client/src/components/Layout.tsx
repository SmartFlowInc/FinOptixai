import React, { useState } from "react";
import Sidebar from "./Sidebar";
import EnhancedSidebar from "./EnhancedSidebar";
import Header from "./Header";
import { useLocation } from "wouter";

type PageTitleMap = {
  [key: string]: { title: string; description: string };
};

const pageTitles: PageTitleMap = {
  "/": { 
    title: "Financial Dashboard", 
    description: "Overview of your financial metrics" 
  },
  "/budgeting": { 
    title: "Budgeting", 
    description: "Plan and manage your organization's budget" 
  },
  "/forecasting": { 
    title: "Forecasting", 
    description: "Predict future financial performance" 
  },
  "/reports": { 
    title: "Reports", 
    description: "View and generate financial reports" 
  },
  "/collaboration": { 
    title: "Collaboration", 
    description: "Work with your team on financial planning" 
  },
  "/data-sources": { 
    title: "Data Sources", 
    description: "Manage your financial data integrations" 
  },
  "/settings": { 
    title: "Settings", 
    description: "Configure your account and preferences" 
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentPage = pageTitles[location] || { 
    title: "Page Not Found", 
    description: "The requested page could not be found" 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <EnhancedSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <Header 
          title={currentPage.title} 
          description={currentPage.description} 
          toggleSidebar={toggleSidebar} 
        />
        
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
