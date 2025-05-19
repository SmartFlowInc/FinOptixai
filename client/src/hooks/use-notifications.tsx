import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPermissionState {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
}

export function useNotifications() {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    permission: 'default',
    isSupported: false,
    isSubscribed: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    const isSupported = 'Notification' in window;
    
    if (isSupported) {
      // Update permission state
      setPermissionState(prev => ({
        ...prev,
        permission: Notification.permission,
        isSupported: true,
        isSubscribed: Notification.permission === 'granted'
      }));
    }
  }, []);

  // Function to request notification permission
  const requestPermission = async () => {
    if (!permissionState.isSupported) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
      return false;
    }

    if (permissionState.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      
      setPermissionState(prev => ({
        ...prev,
        permission,
        isSubscribed: permission === 'granted'
      }));
      
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive notifications for important events."
        });
        return true;
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive notifications for important events.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission request failed",
        description: "Could not request notification permission.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Function to show a test notification
  const showTestNotification = async (title: string, options: NotificationOptions = {}) => {
    if (!permissionState.isSupported || permissionState.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      // Default options
      const defaultOptions: NotificationOptions = {
        body: 'This is a test notification',
        icon: '/assets/notification-icon.png',
        badge: '/assets/notification-badge.png',
        vibrate: [100, 50, 100],
        ...options
      };

      // Show notification
      const notification = new Notification(title, defaultOptions);
      
      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
      toast({
        title: "Notification failed",
        description: "Could not display the notification.",
        variant: "destructive"
      });
    }
  };

  // Function to send a financial alert notification
  const sendFinancialAlert = async (
    title: string, 
    message: string, 
    type: 'info' | 'warning' | 'critical' = 'info',
    data: Record<string, any> = {}
  ) => {
    if (!permissionState.isSupported || permissionState.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    let icon = '/assets/notification-info.png';
    
    // Set icon based on type
    if (type === 'warning') {
      icon = '/assets/notification-warning.png';
    } else if (type === 'critical') {
      icon = '/assets/notification-critical.png';
    }

    try {
      const notification = new Notification(title, {
        body: message,
        icon,
        vibrate: type === 'critical' ? [100, 50, 100, 50, 100] : [100, 50, 100],
        data: {
          timestamp: new Date().toISOString(),
          type,
          ...data
        }
      });

      notification.onclick = () => {
        window.focus();
        // Navigate to the appropriate page based on data
        if (data.url) {
          window.location.href = data.url;
        }
        notification.close();
      };
    } catch (error) {
      console.error('Error sending financial alert:', error);
    }
  };

  return {
    ...permissionState,
    requestPermission,
    showTestNotification,
    sendFinancialAlert
  };
}