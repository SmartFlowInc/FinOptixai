import { useLocation, Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const [location] = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // State to track expanded/collapsed sections
  const [expandedSections, setExpandedSections] = useState({
    dashboards: true,
    financialPlanning: true,
    aiInsights: true,
    teamCollaboration: true,
    dataManagement: true,
    system: true
  });
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });
  
  // Toggle a section's expanded state
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#1E293B] to-[#0F172A] shadow-lg z-30 transition-transform duration-300 ease-in-out ${sidebarClass}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/50">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-500 p-2">
                <i className="ri-bar-chart-box-line text-xl text-white"></i>
              </div>
              <span className="text-xl font-semibold text-white">FinOptix</span>
            </div>
          </Link>
        </div>
        
        {/* User */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-medium">{user?.avatarInitials || "..."}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.fullName || "Loading..."}</p>
              <p className="text-xs text-slate-400">{user?.jobTitle || ""}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-4">
            <div 
              className="sidebar-section-header"
              onClick={() => toggleSection('dashboards')}
            >
              <h3 className="sidebar-section-title">Dashboards</h3>
              <i className={`ri-arrow-${expandedSections.dashboards ? 'down' : 'right'}-s-line text-blue-300 text-xs`}></i>
            </div>
            
            {expandedSections.dashboards && (
              <ul className="space-y-1">
                <li>
                  <Link href="/">
                    <div className={`sidebar-nav-item ${location === "/" ? "active" : ""}`}>
                      <i className="ri-dashboard-line text-lg"></i>
                      <span>Main Dashboard</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/advanced-dashboard">
                    <div className={`sidebar-nav-item ${location === "/advanced-dashboard" ? "active" : ""}`}>
                      <i className="ri-bar-chart-2-line text-lg"></i>
                      <span>Advanced Analytics</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/mobile-dashboard">
                    <div className={`sidebar-nav-item ${location === "/mobile-dashboard" ? "active" : ""}`}>
                      <i className="ri-smartphone-line text-lg"></i>
                      <span>Mobile View</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="px-3 mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer px-2 py-1 mb-1 hover:bg-neutral-100 rounded-md"
              onClick={() => toggleSection('financialPlanning')}
            >
              <h3 className="uppercase text-xs font-semibold text-neutral-400">Financial Planning</h3>
              <i className={`ri-arrow-${expandedSections.financialPlanning ? 'down' : 'right'}-s-line text-neutral-400 text-xs`}></i>
            </div>
            
            {expandedSections.financialPlanning && (
              <ul className="space-y-1">
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
              </ul>
            )}
          </div>

          <div className="px-3 mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer px-2 py-1 mb-1 hover:bg-neutral-100 rounded-md"
              onClick={() => toggleSection('aiInsights')}
            >
              <h3 className="uppercase text-xs font-semibold text-neutral-400">AI Insights</h3>
              <i className={`ri-arrow-${expandedSections.aiInsights ? 'down' : 'right'}-s-line text-neutral-400 text-xs`}></i>
            </div>
            
            {expandedSections.aiInsights && (
              <ul className="space-y-1">
                <li>
                  <Link href="/insights">
                    <div className={`sidebar-link ${location === "/insights" ? "active" : ""}`}>
                      <i className="ri-lightbulb-line sidebar-icon"></i>
                      <span>Insights</span>
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
                  <Link href="/continuous-improvement">
                    <div className={`sidebar-link ${location === "/continuous-improvement" ? "active" : ""}`}>
                      <i className="ri-loop-line sidebar-icon"></i>
                      <span>Continuous Improvement</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="px-3 mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer px-2 py-1 mb-1 hover:bg-neutral-100 rounded-md"
              onClick={() => toggleSection('teamCollaboration')}
            >
              <h3 className="uppercase text-xs font-semibold text-neutral-400">Team Collaboration</h3>
              <i className={`ri-arrow-${expandedSections.teamCollaboration ? 'down' : 'right'}-s-line text-neutral-400 text-xs`}></i>
            </div>
            
            {expandedSections.teamCollaboration && (
              <ul className="space-y-1">
                <li>
                  <Link href="/collaboration">
                    <div className={`sidebar-link ${location === "/collaboration" ? "active" : ""}`}>
                      <i className="ri-team-line sidebar-icon"></i>
                      <span>Team Workspace</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/enhanced-collaboration">
                    <div className={`sidebar-link ${location === "/enhanced-collaboration" ? "active" : ""}`}>
                      <i className="ri-chat-4-line sidebar-icon"></i>
                      <span>Enhanced Collaboration</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/workflow-approval">
                    <div className={`sidebar-link ${location === "/workflow-approval" ? "active" : ""}`}>
                      <i className="ri-flow-chart sidebar-icon"></i>
                      <span>Approval Workflows</span>
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
              </ul>
            )}
          </div>

          <div className="px-3 mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer px-2 py-1 mb-1 hover:bg-neutral-100 rounded-md"
              onClick={() => toggleSection('dataManagement')}
            >
              <h3 className="uppercase text-xs font-semibold text-neutral-400">Data Management</h3>
              <i className={`ri-arrow-${expandedSections.dataManagement ? 'down' : 'right'}-s-line text-neutral-400 text-xs`}></i>
            </div>
            
            {expandedSections.dataManagement && (
              <ul className="space-y-1">
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
                  <Link href="/enhanced-data-integration">
                    <div className={`sidebar-link ${location === "/enhanced-data-integration" ? "active" : ""}`}>
                      <i className="ri-cloud-line sidebar-icon"></i>
                      <span>Advanced Integrations</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="px-3">
            <div 
              className="flex justify-between items-center cursor-pointer px-2 py-1 mb-1 hover:bg-neutral-100 rounded-md"
              onClick={() => toggleSection('system')}
            >
              <h3 className="uppercase text-xs font-semibold text-neutral-400">System</h3>
              <i className={`ri-arrow-${expandedSections.system ? 'down' : 'right'}-s-line text-neutral-400 text-xs`}></i>
            </div>
            
            {expandedSections.system && (
              <ul className="space-y-1">
                <li>
                  <Link href="/settings">
                    <div className={`sidebar-link ${location === "/settings" ? "active" : ""}`}>
                      <i className="ri-settings-3-line sidebar-icon"></i>
                      <span>Settings</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>
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
