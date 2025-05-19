import { useLocation, Link } from "wouter";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const [location] = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  useEffect(() => {
    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) && 
        isOpen
      ) {
        closeSidebar();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  const sidebarClass = isOpen 
    ? "transform-none" 
    : "transform -translate-x-full md:transform-none";

  return (
    <aside 
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out ${sidebarClass}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-5 border-b border-neutral-200">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-primary p-2">
                <i className="ri-bar-chart-box-line text-xl text-white"></i>
              </div>
              <span className="text-xl font-semibold text-neutral-500">Abacum</span>
            </div>
          </Link>
        </div>
        
        {/* User */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">{user?.avatarInitials || "..."}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">{user?.fullName || "Loading..."}</p>
              <p className="text-xs text-neutral-400">{user?.jobTitle || ""}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-3 space-y-1">
            <li>
              <Link href="/">
                <div className={`sidebar-link ${location === "/" ? "active" : ""}`}>
                  <i className="ri-dashboard-line sidebar-icon"></i>
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/advanced-dashboard">
                <div className={`sidebar-link ${location === "/advanced-dashboard" ? "active" : ""}`}>
                  <i className="ri-bar-chart-2-line sidebar-icon"></i>
                  <span>Advanced Analytics</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/budgeting">
                <div className={`sidebar-link ${location === "/budgeting" ? "active" : ""}`}>
                  <i className="ri-money-dollar-circle-line sidebar-icon"></i>
                  <span>Budgeting</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/forecasting">
                <div className={`sidebar-link ${location === "/forecasting" ? "active" : ""}`}>
                  <i className="ri-line-chart-line sidebar-icon"></i>
                  <span>Forecasting</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/reports">
                <div className={`sidebar-link ${location === "/reports" ? "active" : ""}`}>
                  <i className="ri-file-chart-line sidebar-icon"></i>
                  <span>Reports</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/collaboration">
                <div className={`sidebar-link ${location === "/collaboration" ? "active" : ""}`}>
                  <i className="ri-team-line sidebar-icon"></i>
                  <span>Collaboration</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/data-sources">
                <div className={`sidebar-link ${location === "/data-sources" ? "active" : ""}`}>
                  <i className="ri-database-2-line sidebar-icon"></i>
                  <span>Data Sources</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/data-integration">
                <div className={`sidebar-link ${location === "/data-integration" ? "active" : ""}`}>
                  <i className="ri-exchange-line sidebar-icon"></i>
                  <span>Data Integration</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/continuous-improvement">
                <div className={`sidebar-link ${location === "/continuous-improvement" ? "active" : ""}`}>
                  <i className="ri-loop-line sidebar-icon"></i>
                  <span>Continuous Improvement</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/anomaly-detection">
                <div className={`sidebar-link ${location === "/anomaly-detection" ? "active" : ""}`}>
                  <i className="ri-radar-line sidebar-icon"></i>
                  <span>Anomaly Detection</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/insights">
                <div className={`sidebar-link ${location === "/insights" ? "active" : ""}`}>
                  <i className="ri-lightbulb-line sidebar-icon"></i>
                  <span>Insights</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/calendar">
                <div className={`sidebar-link ${location === "/calendar" ? "active" : ""}`}>
                  <i className="ri-calendar-line sidebar-icon"></i>
                  <span>Calendar</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <div className={`sidebar-link ${location === "/settings" ? "active" : ""}`}>
                  <i className="ri-settings-3-line sidebar-icon"></i>
                  <span>Settings</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-neutral-200">
          <div className="bg-[#F8F9FA] rounded-lg p-3">
            <p className="text-xs font-medium text-neutral-500 mb-2">Enterprise Plan</p>
            <div className="w-full bg-neutral-200 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <p className="text-xs text-neutral-400 mt-2">75% of storage used</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
