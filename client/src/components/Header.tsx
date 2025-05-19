import { useState } from "react";

interface HeaderProps {
  title: string;
  description: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, description, toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="sticky top-0 bg-white shadow-sm z-20">
      <div className="flex justify-between items-center px-4 md:px-6 py-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-500">{title}</h1>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 md:w-64 pl-10 pr-4 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <i className="ri-search-line absolute left-3 top-2.5 text-neutral-400"></i>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <button className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500 relative">
              <i className="ri-notification-3-line text-lg"></i>
              <span className="absolute top-1 right-1.5 h-2 w-2 bg-primary rounded-full"></span>
            </button>
            
            <button className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500">
              <i className="ri-question-line text-lg"></i>
            </button>
            
            <div className="h-8 w-px bg-neutral-200 mx-1 hidden md:block"></div>
            
            <button 
              className="md:hidden p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-500" 
              onClick={toggleSidebar}
            >
              <i className="ri-menu-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
