import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  X, 
  Info, 
  AlertTriangle, 
  AlertOctagon, 
  Check, 
  Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount,
    toggleNotificationCenter, 
    markAsRead, 
    markAllAsRead,
    clearNotifications 
  } = useNotifications();

  // Get icon by notification type
  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertOctagon className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 border-l bg-background shadow-lg">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          <span className="text-lg font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {unreadCount}
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleNotificationCenter}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-between border-b p-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={markAllAsRead} 
          disabled={unreadCount === 0}
          className="text-xs"
        >
          <Check className="mr-1 h-3 w-3" />
          Mark all as read
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearNotifications}
          disabled={notifications.length === 0}
          className="text-xs text-red-500 hover:text-red-600"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Clear all
        </Button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <Bell className="mb-2 h-8 w-8 opacity-20" />
          <p>No notifications</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col p-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "relative mb-2 rounded-lg border p-3 transition-colors",
                  notification.read 
                    ? "bg-background" 
                    : "bg-muted/30"
                )}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium line-clamp-1",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default NotificationCenter;