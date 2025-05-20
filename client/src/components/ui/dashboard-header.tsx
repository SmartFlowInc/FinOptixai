import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: {
    value: string;
    label: string;
    onClick?: () => void;
  }[];
  selectedTab?: string;
  onTabChange?: (value: string) => void;
  filters?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  children,
  actions,
  tabs,
  selectedTab,
  onTabChange,
  filters,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
          {subtitle && <p className="text-neutral-500 mt-1">{subtitle}</p>}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2 self-end md:self-auto">
            {actions}
          </div>
        )}
      </div>
      
      {(tabs || filters) && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b">
          {tabs && tabs.length > 0 && (
            <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full md:w-auto">
              <TabsList className="bg-neutral-100">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={tab.onClick}
                    className="data-[state=active]:bg-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          
          {filters && (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {filters}
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default DashboardHeader;