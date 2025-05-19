import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bell, Menu, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/ui/logo';

interface AppBarProps {
  toggleSidebar: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ toggleSidebar }) => {
  const { user, isAuthenticated } = useAuth();
  const { totalUnread, toggleNotificationCenter } = useNotifications();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Logo & title */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold">
          FO
        </div>
        <span className="text-lg font-bold md:block">FinOptix</span>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleNotificationCenter}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {totalUnread > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalUnread}
            </Badge>
          )}
        </Button>
        
        {/* User Menu */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="User" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Login button if not authenticated */}
        {!isAuthenticated && (
          <Button onClick={() => window.location.href = '/api/login'}>
            Log in
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppBar;