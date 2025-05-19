import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart2,
  TrendingUp,
  Wallet,
  Lightbulb,
  FileText,
  Database,
  Settings,
  X,
  ArrowRightLeft,
  Users,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  children,
  isActive,
  onClick
}) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )}
        onClick={onClick}
      >
        {icon}
        <span>{children}</span>
      </a>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Close sidebar on location change for mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      closeSidebar();
    }
  }, [location, isMobile, isOpen, closeSidebar]);

  // Handle click outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobile && isOpen && sidebar && !sidebar.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isOpen, closeSidebar]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-300 ease-in-out",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0 relative"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold">
              FO
            </div>
            <span className="text-lg font-bold">FinOptix</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeSidebar}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div className="py-2">
              <h3 className="text-xs font-medium text-muted-foreground">OVERVIEW</h3>
              <div className="mt-3 space-y-1">
                <SidebarLink
                  href="/"
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  isActive={location === '/'}
                  onClick={closeSidebar}
                >
                  Dashboard
                </SidebarLink>
                <SidebarLink
                  href="/advanced"
                  icon={<BarChart2 className="h-4 w-4" />}
                  isActive={location === '/advanced'}
                  onClick={closeSidebar}
                >
                  Advanced Analytics
                </SidebarLink>
                <SidebarLink
                  href="/forecasting"
                  icon={<TrendingUp className="h-4 w-4" />}
                  isActive={location === '/forecasting'}
                  onClick={closeSidebar}
                >
                  Forecasting
                </SidebarLink>
                <SidebarLink
                  href="/budgeting"
                  icon={<Wallet className="h-4 w-4" />}
                  isActive={location === '/budgeting'}
                  onClick={closeSidebar}
                >
                  Budgeting
                </SidebarLink>
              </div>
            </div>

            <div className="py-2">
              <h3 className="text-xs font-medium text-muted-foreground">INSIGHTS & REPORTS</h3>
              <div className="mt-3 space-y-1">
                <SidebarLink
                  href="/insights"
                  icon={<Lightbulb className="h-4 w-4" />}
                  isActive={location === '/insights'}
                  onClick={closeSidebar}
                >
                  AI Insights
                </SidebarLink>
                <SidebarLink
                  href="/reports"
                  icon={<FileText className="h-4 w-4" />}
                  isActive={location === '/reports'}
                  onClick={closeSidebar}
                >
                  Reports
                </SidebarLink>
              </div>
            </div>

            <div className="py-2">
              <h3 className="text-xs font-medium text-muted-foreground">DATA & COLLABORATION</h3>
              <div className="mt-3 space-y-1">
                <SidebarLink
                  href="/data-sources"
                  icon={<Database className="h-4 w-4" />}
                  isActive={location === '/data-sources'}
                  onClick={closeSidebar}
                >
                  Data Sources
                </SidebarLink>
                <SidebarLink
                  href="/collaboration"
                  icon={<Users className="h-4 w-4" />}
                  isActive={location === '/collaboration'}
                  onClick={closeSidebar}
                >
                  Collaboration
                </SidebarLink>
                <SidebarLink
                  href="/workflows"
                  icon={<ArrowRightLeft className="h-4 w-4" />}
                  isActive={location === '/workflows'}
                  onClick={closeSidebar}
                >
                  Workflows
                </SidebarLink>
                <SidebarLink
                  href="/activity"
                  icon={<Clock className="h-4 w-4" />}
                  isActive={location === '/activity'}
                  onClick={closeSidebar}
                >
                  Activity
                </SidebarLink>
              </div>
            </div>

            <div className="py-2">
              <h3 className="text-xs font-medium text-muted-foreground">PREFERENCES</h3>
              <div className="mt-3 space-y-1">
                <SidebarLink
                  href="/settings"
                  icon={<Settings className="h-4 w-4" />}
                  isActive={location === '/settings'}
                  onClick={closeSidebar}
                >
                  Settings
                </SidebarLink>
                <SidebarLink
                  href="/help"
                  icon={<HelpCircle className="h-4 w-4" />}
                  isActive={location === '/help'}
                  onClick={closeSidebar}
                >
                  Help & Support
                </SidebarLink>
                <SidebarLink
                  href="/mobile"
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  isActive={location === '/mobile'}
                  onClick={closeSidebar}
                >
                  Mobile View
                </SidebarLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;