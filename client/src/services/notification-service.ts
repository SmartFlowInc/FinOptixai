import { useNotifications } from '@/hooks/use-notifications';

type NotificationType = 'financial_alert' | 'budget_alert' | 'approval_request' | 'comment' | 'system';
type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: Date;
  isRead: boolean;
  data?: Record<string, any>;
}

// Local storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = 'finoptix_notifications';

// Function to get notifications from local storage
export const getStoredNotifications = (): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return storedNotifications 
      ? JSON.parse(storedNotifications, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        }) 
      : [];
  } catch (error) {
    console.error('Error getting stored notifications:', error);
    return [];
  }
};

// Function to save notifications to local storage
export const saveNotificationsToStorage = (notifications: Notification[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications to storage:', error);
  }
};

// Function to add a new notification
export const addNotification = (
  title: string,
  message: string,
  type: NotificationType,
  priority: NotificationPriority = 'medium',
  data?: Record<string, any>
): Notification => {
  const newNotification: Notification = {
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    message,
    type,
    priority,
    timestamp: new Date(),
    isRead: false,
    data
  };
  
  // Get existing notifications
  const notifications = getStoredNotifications();
  
  // Add new notification
  const updatedNotifications = [newNotification, ...notifications];
  
  // Save to storage
  saveNotificationsToStorage(updatedNotifications);
  
  // Try to show push notification if possible
  try {
    const { sendFinancialAlert } = useNotifications();
    
    const notificationPriorityMap: Record<NotificationPriority, 'info' | 'warning' | 'critical'> = {
      low: 'info',
      medium: 'info',
      high: 'warning'
    };
    
    sendFinancialAlert(
      title,
      message,
      notificationPriorityMap[priority],
      data
    );
  } catch (error) {
    console.error('Error showing push notification:', error);
  }
  
  return newNotification;
};

// Function to mark a notification as read
export const markNotificationAsRead = (notificationId: string): Notification[] => {
  const notifications = getStoredNotifications();
  
  const updatedNotifications = notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, isRead: true } 
      : notification
  );
  
  saveNotificationsToStorage(updatedNotifications);
  
  return updatedNotifications;
};

// Function to mark all notifications as read
export const markAllNotificationsAsRead = (): Notification[] => {
  const notifications = getStoredNotifications();
  
  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    isRead: true
  }));
  
  saveNotificationsToStorage(updatedNotifications);
  
  return updatedNotifications;
};

// Function to delete a notification
export const deleteNotification = (notificationId: string): Notification[] => {
  const notifications = getStoredNotifications();
  
  const updatedNotifications = notifications.filter(
    notification => notification.id !== notificationId
  );
  
  saveNotificationsToStorage(updatedNotifications);
  
  return updatedNotifications;
};

// Function to delete all notifications
export const deleteAllNotifications = (): void => {
  saveNotificationsToStorage([]);
};

// Function to check if a notification should trigger a push notification
export const shouldShowPushNotification = (
  type: NotificationType, 
  priority: NotificationPriority,
  userSettings?: Record<string, boolean>
): boolean => {
  // Default settings if not provided
  const defaultSettings = {
    financial_alert: true,
    budget_alert: true,
    approval_request: true,
    comment: false,
    system: true
  };
  
  const settings = userSettings || defaultSettings;
  
  // Check if notification type is enabled
  if (!settings[type]) {
    return false;
  }
  
  // Always show high priority notifications
  if (priority === 'high') {
    return true;
  }
  
  // Show medium priority based on type
  if (priority === 'medium') {
    return type !== 'comment';
  }
  
  // Show low priority notifications only if they are financial alerts
  return type === 'financial_alert';
};