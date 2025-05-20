import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  iconBgColor = 'bg-blue-50', 
  iconColor = 'text-[#2D71A8]'
}) => {
  return (
    <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-[#0F1829]">{value}</h3>
          </div>
          <div className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PremiumPageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  actions?: ReactNode;
  stats?: StatCardProps[];
  className?: string;
}

export const PremiumPageHeader: React.FC<PremiumPageHeaderProps> = ({
  title,
  description,
  icon,
  actions,
  stats,
  className = '',
}) => {
  return (
    <div className={`relative mb-8 ${className}`}>
      {/* Background decorations - softer and contained within the header */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl -z-10"></div>
      
      <div className="px-4 py-6 bg-white rounded-xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] text-white p-2 rounded-lg shadow-md">
                {icon}
              </div>
              <h1 className="text-2xl font-bold text-[#0F1829]">{title}</h1>
            </div>
            <p className="text-[#4D8EC3]">{description}</p>
          </div>
          
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
        
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard 
                key={index} 
                title={stat.title} 
                value={stat.value} 
                icon={stat.icon}
                iconBgColor={stat.iconBgColor}
                iconColor={stat.iconColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumPageHeader;