import { useLocation, Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const EnhancedSidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const [location] = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("dashboard");
  
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
    
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside 
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg z-30 transition-transform duration-300 ease-in-out ${sidebarClass}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-500 p-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-5 h-5">
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-white">FinOptix</span>
                <div className="text-xs text-blue-300 mt-0.5">Financial Analytics Platform</div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* User */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-medium">{user?.avatarInitials || "JD"}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.fullName || "John Doe"}</p>
              <p className="text-xs text-slate-400">{user?.jobTitle || "Financial Analyst"}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Dashboard Section */}
          <div className="mb-2">
            <button 
              onClick={() => toggleSection('dashboard')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded"
            >
              <span>Dashboards</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${expandedSection === 'dashboard' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {expandedSection === 'dashboard' && (
              <div className="mt-1 pl-3 space-y-1">
                <Link href="/">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    <span>Main Dashboard</span>
                  </div>
                </Link>
                <Link href="/advanced-dashboard">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/advanced-dashboard') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="M3 3v18h18" />
                      <path d="M18 9l-6-6" />
                      <path d="M18 9H9" />
                    </svg>
                    <span>Advanced Analytics</span>
                  </div>
                </Link>
                <Link href="/mobile-dashboard">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/mobile-dashboard') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <rect width="7" height="12" x="8" y="7" rx="1" />
                      <path d="M12 3v4" />
                      <path d="M10 19H8" />
                      <path d="M16 19h-2" />
                    </svg>
                    <span>Mobile View</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          {/* Financial Planning Section */}
          <div className="mb-2">
            <button 
              onClick={() => toggleSection('planning')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded"
            >
              <span>Financial Planning</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${expandedSection === 'planning' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {expandedSection === 'planning' && (
              <div className="mt-1 pl-3 space-y-1">
                <Link href="/budgeting">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/budgeting') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                    <span>Budgeting</span>
                  </div>
                </Link>
                <Link href="/forecasting">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/forecasting') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="m2 12 5.25 5 2.625-5L14.5 17l2.625-5 4.875 5" />
                      <path d="M3 7h6l2-4h4l2 4h6" />
                    </svg>
                    <span>Forecasting</span>
                  </div>
                </Link>
                <Link href="/workflow-approval">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/workflow-approval') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>Workflow Approval</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          {/* Data & AI Section */}
          <div className="mb-2">
            <button 
              onClick={() => toggleSection('data')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded"
            >
              <span>Data & AI</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${expandedSection === 'data' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {expandedSection === 'data' && (
              <div className="mt-1 pl-3 space-y-1">
                <Link href="/data-sources">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/data-sources') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="M20 17v-4c0-5-4-9-9-9h-4" />
                      <path d="M7 10a5 5 0 0 0-5 5v4h20" />
                      <path d="M17 13a5 5 0 0 0-10 0v4h10Z" />
                    </svg>
                    <span>Data Sources</span>
                  </div>
                </Link>
                <Link href="/data-integration">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/data-integration') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                      <path d="M14 2v6h6" />
                      <path d="m9 18 3-3-3-3" />
                      <path d="m5 12-3 3 3 3" />
                    </svg>
                    <span>Data Integration</span>
                  </div>
                </Link>
                <Link href="/anomaly-detection">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/anomaly-detection') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span>Anomaly Detection</span>
                  </div>
                </Link>
                <Link href="/insights">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/insights') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span>AI Insights</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          {/* Collaboration Section */}
          <div className="mb-2">
            <button 
              onClick={() => toggleSection('collab')}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded"
            >
              <span>Collaboration</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${expandedSection === 'collab' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {expandedSection === 'collab' && (
              <div className="mt-1 pl-3 space-y-1">
                <Link href="/reports">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/reports') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span>Reports</span>
                  </div>
                </Link>
                <Link href="/collaboration">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/collaboration') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>Collaboration</span>
                  </div>
                </Link>
                <Link href="/calendar">
                  <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/calendar') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>Calendar</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
          
          <div className="mt-6 px-3">
            <Link href="/settings">
              <div className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/settings') ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-3">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Settings</span>
              </div>
            </Link>
          </div>
        </nav>
        
        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-xs font-medium text-slate-300 mb-2">Enterprise Plan</div>
            <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-2">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full" style={{ width: "75%" }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">75% of storage used</p>
            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default EnhancedSidebar;