import { useState, useEffect, useCallback } from 'react';
import { notificationManager } from '@/services/notification-manager';
import { Notification } from '@/services/notification-service';
import { useNotifications } from '@/hooks/use-notifications';

/**
 * Hook for using the notification system with React components
 */
export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { 
    isSupported, 
    isSubscribed, 
    sendFinancialAlert, 
    requestPermission 
  } = useNotifications();

  // Update local state when notifications change
  useEffect(() => {
    // Initial load
    setNotifications(notificationManager.getNotifications());
    setUnreadCount(notificationManager.getUnreadCount());
    
    // Subscribe to notification changes
    const unsubscribe = notificationManager.subscribe((event) => {
      setNotifications(notificationManager.getNotifications());
      setUnreadCount(notificationManager.getUnreadCount());
      
      // Show browser notification for new notifications if enabled
      if (event.type === 'add' && event.notification && isSupported && isSubscribed) {
        sendFinancialAlert(
          event.notification.title,
          event.notification.message,
          event.notification.priority === 'high' ? 'critical' : 
            event.notification.priority === 'medium' ? 'warning' : 'info',
          event.notification.data
        );
      }
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [isSupported, isSubscribed, sendFinancialAlert]);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false,
      ...notification
    };
    
    return notificationManager.addNotification(newNotification);
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback((notificationId: string) => {
    return notificationManager.markAsRead(notificationId);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    notificationManager.markAllAsRead();
  }, []);

  // Delete a notification
  const deleteNotification = useCallback((notificationId: string) => {
    return notificationManager.deleteNotification(notificationId);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    notificationManager.clearAll();
  }, []);

  // Request permission for browser notifications
  const enableNotifications = useCallback(async () => {
    if (!isSupported) return false;
    
    return await requestPermission();
  }, [isSupported, requestPermission]);

  return {
    notifications,
    unreadCount,
    isNotificationsSupported: isSupported,
    isNotificationsEnabled: isSubscribed,
    enableNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
}