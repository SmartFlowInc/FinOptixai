import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PremiumTabItem {
  value: string;
  label: string;
  description?: string;
  icon: ReactNode;
  content: ReactNode;
}

interface PremiumTabsProps {
  items: PremiumTabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
}

export const PremiumTabs: React.FC<PremiumTabsProps> = ({
  items,
  defaultValue,
  onChange,
  value,
  className = '',
}) => {
  const initialValue = value || defaultValue || (items.length > 0 ? items[0].value : '');
  
  return (
    <Tabs 
      value={value} 
      defaultValue={defaultValue} 
      onValueChange={onChange} 
      className={`space-y-6 animate-in opacity-0 translate-y-4 transition-all duration-500 ${className}`} 
      style={{ transitionDelay: '300ms' }}
    >
      <TabsList className="bg-white rounded-xl shadow-md p-1 grid grid-cols-1 md:grid-cols-4 h-auto gap-2 border border-slate-100">
        {items.map((item) => (
          <TabsTrigger 
            key={item.value}
            value={item.value} 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D71A8]/10 data-[state=active]:to-blue-50 data-[state=active]:shadow-md rounded-lg flex items-center gap-3 h-16 p-4 transition-all"
          >
            <div className="bg-gradient-to-br from-[#2D71A8] to-[#4D8EC3] rounded-lg p-2 flex-shrink-0 shadow-sm text-white">
              {item.icon}
            </div>
            <div className="text-left">
              <div className="font-medium text-[#0F1829]">{item.label}</div>
              {item.description && (
                <div className="text-xs text-[#4D8EC3]">{item.description}</div>
              )}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value} className="animate-in opacity-0 translate-y-4 transition-all duration-500">
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PremiumTabs;