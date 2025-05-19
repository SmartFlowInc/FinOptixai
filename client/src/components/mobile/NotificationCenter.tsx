import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  ChevronRight, 
  AlertCircle, 
  BellRing, 
  Clock, 
  BarChart, 
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getStoredNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification, 
  deleteAllNotifications,
  type Notification
} from '@/services/notification-service';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // Load notifications from storage
  useEffect(() => {
    const loadNotifications = () => {
      const storedNotifications = getStoredNotifications();
      setNotifications(storedNotifications);
    };
    
    // Load initially
    loadNotifications();
    
    // Set up interval to check for new notifications
    const interval = setInterval(loadNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle mark as read
  const handleMarkAsRead = (id: string) => {
    const updatedNotifications = markNotificationAsRead(id);
    setNotifications(updatedNotifications);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    const updatedNotifications = markAllNotificationsAsRead();
    setNotifications(updatedNotifications);
    
    toast({
      title: "All notifications marked as read",
      description: "Your notification center has been cleared."
    });
  };
  
  // Handle delete notification
  const handleDeleteNotification = (id: string) => {
    const updatedNotifications = deleteNotification(id);
    setNotifications(updatedNotifications);
    
    toast({
      title: "Notification deleted",
      description: "The notification has been removed."
    });
  };
  
  // Handle clear all notifications
  const handleClearAll = () => {
    deleteAllNotifications();
    setNotifications([]);
    
    toast({
      title: "All notifications cleared",
      description: "Your notification center is now empty."
    });
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'financial') return notification.type === 'financial_alert' || notification.type === 'budget_alert';
    if (activeTab === 'approvals') return notification.type === 'approval_request';
    return true;
  });
  
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'financial_alert':
        return <BarChart className="h-5 w-5 text-blue-500" />;
      case 'budget_alert':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'approval_request':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get color class for notification priority
  const getPriorityColorClass = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };
  
  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-1">{unreadCount} new</Badge>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="h-8 px-2 text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              <span>Mark all read</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="h-8 px-2 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>Clear all</span>
            </Button>
          </div>
        </div>
        
        <CardDescription>
          Stay updated on your financial alerts and tasks
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4">
            <TabsList className="grid grid-cols-4 mb-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 text-xs rounded-full bg-primary/20 px-1.5">{unreadCount}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[400px]">
              {filteredNotifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <h3 className="text-sm font-medium text-muted-foreground">No notifications</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    You don't have any {activeTab !== 'all' ? activeTab + ' ' : ''}notifications yet
                  </p>
                </div>
              ) : (
                <div className="space-y-1 px-1">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`
                        relative flex items-start p-3 rounded-md border mb-1
                        ${getPriorityColorClass(notification.priority)}
                        ${notification.isRead ? 'opacity-80' : ''}
                      `}
                    >
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium truncate pr-8">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-7 text-xs px-2"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              <span>Mark as read</span>
                            </Button>
                          )}
                          
                          {notification.data?.url && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs px-2 ml-auto"
                              onClick={() => {
                                window.location.href = notification.data?.url;
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              <span>View details</span>
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="h-7 w-7 p-0 ml-auto"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;