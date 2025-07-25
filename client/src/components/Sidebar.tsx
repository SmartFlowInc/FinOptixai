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
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#172437] via-[#1A2A40] to-[#0F1829] shadow-lg z-30 transition-transform duration-300 ease-in-out ${sidebarClass}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-5 border-b border-[#2A3646]/50">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-gradient-to-br from-[#2D71A8] to-[#1D5A8A] p-2 shadow-sm">
                <i className="ri-bar-chart-box-line text-xl text-white"></i>
              </div>
              <div>
                <span className="text-xl font-semibold text-white">FinOptix</span>
                <div className="text-[9px] text-[#4D8EC3] uppercase tracking-wider font-medium">Financial Intelligence</div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* User */}
        <div className="p-4 border-b border-[#2A3646]/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D71A8]/20 to-[#1D5A8A]/20 flex items-center justify-center border border-[#2D71A8]/30">
              <span className="text-[#4D8EC3] font-medium">{user?.avatarInitials || "..."}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.fullName || "Loading..."}</p>
              <p className="text-xs text-[#8AA7C5]">{user?.jobTitle || ""}</p>
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
              className="sidebar-section-header"
              onClick={() => toggleSection('financialPlanning')}
            >
              <h3 className="sidebar-section-title">Financial Planning</h3>
              <i className={`ri-arrow-${expandedSections.financialPlanning ? 'down' : 'right'}-s-line text-blue-300 text-xs`}></i>
            </div>
            
            {expandedSections.financialPlanning && (
              <ul className="space-y-1">
                <li>
                  <Link href="/budgeting">
                    <div className={`sidebar-nav-item ${location === "/budgeting" ? "active" : ""}`}>
                      <i className="ri-money-dollar-circle-line text-lg"></i>
                      <span>Budgeting</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/forecasting">
                    <div className={`sidebar-nav-item ${location === "/forecasting" ? "active" : ""}`}>
                      <i className="ri-line-chart-line text-lg"></i>
                      <span>Forecasting</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/reports">
                    <div className={`sidebar-nav-item ${location === "/reports" ? "active" : ""}`}>
                      <i className="ri-file-chart-line text-lg"></i>
                      <span>Reports</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="px-3 mb-4">
            <div 
              className="sidebar-section-header"
              onClick={() => toggleSection('aiInsights')}
            >
              <h3 className="sidebar-section-title">AI Insights</h3>
              <i className={`ri-arrow-${expandedSections.aiInsights ? 'down' : 'right'}-s-line text-blue-300 text-xs`}></i>
            </div>
            
            {expandedSections.aiInsights && (
              <ul className="space-y-1">
                <li>
                  <Link href="/insights">
                    <div className={`sidebar-nav-item ${location === "/insights" ? "active" : ""}`}>
                      <i className="ri-lightbulb-line text-lg"></i>
                      <span>Insights</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/anomaly-detection">
                    <div className={`sidebar-nav-item ${location === "/anomaly-detection" ? "active" : ""}`}>
                      <i className="ri-radar-line text-lg"></i>
                      <span>Anomaly Detection</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/continuous-improvement">
                    <div className={`sidebar-nav-item ${location === "/continuous-improvement" ? "active" : ""}`}>
                      <i className="ri-loop-line text-lg"></i>
                      <span>Continuous Improvement</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="px-3 mb-4">
            <div 
              className="sidebar-section-header"
              onClick={() => toggleSection('teamCollaboration')}
            >
              <h3 className="sidebar-section-title">Team Collaboration</h3>
              <i className={`ri-arrow-${expandedSections.teamCollaboration ? 'down' : 'right'}-s-line text-blue-300 text-xs`}></i>
            </div>
            
            {expandedSections.teamCollaboration && (
              <ul className="space-y-1">
                <li>
                  <Link href="/collaboration">
                    <div className={`sidebar-nav-item ${location === "/collaboration" ? "active" : ""}`}>
                      <i className="ri-team-line text-lg"></i>
                      <span>Team Workspace</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/enhanced-collaboration">
                    <div className={`sidebar-nav-item ${location === "/enhanced-collaboration" ? "active" : ""}`}>
                      <i className="ri-chat-4-line text-lg"></i>
                      <span>Enhanced Collaboration</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/workflow-approval">
                    <div className={`sidebar-nav-item ${location === "/workflow-approval" ? "active" : ""}`}>
                      <i className="ri-flow-chart text-lg"></i>
                      <span>Approval Workflows</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/calendar">
                    <div className={`sidebar-nav-item ${location === "/calendar" ? "active" : ""}`}>
                      <i className="ri-calendar-line text-lg"></i>
                      <span>Calendar</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="px-3 mb-4">
            <div 
              className="sidebar-section-header"
              onClick={() => toggleSection('dataManagement')}
            >
              <h3 className="sidebar-section-title">Data Management</h3>
              <i className={`ri-arrow-${expandedSections.dataManagement ? 'down' : 'right'}-s-line text-blue-300 text-xs`}></i>
            </div>
            
            {expandedSections.dataManagement && (
              <ul className="space-y-1">
                <li>
                  <Link href="/data-sources">
                    <div className={`sidebar-nav-item ${location === "/data-sources" ? "active" : ""}`}>
                      <i className="ri-database-2-line text-lg"></i>
                      <span>Data Sources</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/data-integration">
                    <div className={`sidebar-nav-item ${location === "/data-integration" ? "active" : ""}`}>
                      <i className="ri-exchange-line text-lg"></i>
                      <span>Data Integration</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/enhanced-data-integration">
                    <div className={`sidebar-nav-item ${location === "/enhanced-data-integration" ? "active" : ""}`}>
                      <i className="ri-cloud-line text-lg"></i>
                      <span>Advanced Integrations</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="px-3">
            <div 
              className="sidebar-section-header"
              onClick={() => toggleSection('system')}
            >
              <h3 className="sidebar-section-title">System</h3>
              <i className={`ri-arrow-${expandedSections.system ? 'down' : 'right'}-s-line text-blue-300 text-xs`}></i>
            </div>
            
            {expandedSections.system && (
              <ul className="space-y-1">
                <li>
                  <Link href="/settings">
                    <div className={`sidebar-nav-item ${location === "/settings" ? "active" : ""}`}>
                      <i className="ri-settings-3-line text-lg"></i>
                      <span>Settings</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-[#2A3646]/50">
          <div className="bg-[#1E2B3E] rounded-lg p-3 shadow-inner">
            <p className="text-xs font-medium text-[#4D8EC3] mb-2">Enterprise Plan</p>
            <div className="w-full bg-[#121B29] rounded-full h-1.5">
              <div className="bg-gradient-to-r from-[#2D71A8] to-[#4D8EC3] h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-[#8AA7C5]">75% of storage used</p>
              <p className="text-xs text-white/70 font-medium">Upgrade</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
