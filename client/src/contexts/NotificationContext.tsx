import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NotificationType = 'info' | 'warning' | 'critical';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: NotificationType;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isNotificationCenterOpen: boolean;
  toggleNotificationCenter: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('finoptix_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const withDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(withDates);
      } catch (error) {
        console.error('Failed to parse saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage when changed
  useEffect(() => {
    localStorage.setItem('finoptix_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleNotificationCenter = () => {
    setIsNotificationCenterOpen(prev => !prev);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isNotificationCenterOpen,
        toggleNotificationCenter,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Demo notifications for FinOptix
export const getDemoNotifications = (): Omit<Notification, 'id' | 'timestamp' | 'read'>[] => [
  {
    title: 'Budget Alert',
    message: 'Marketing department is 15% over budget for Q3 2023',
    type: 'warning',
    data: {
      department: 'Marketing',
      overage: '15%',
      period: 'Q3 2023'
    }
  },
  {
    title: 'Cash Flow Forecast',
    message: 'Your latest cash flow forecast is ready for review',
    type: 'info',
    data: {
      reportId: '12345',
      reportType: 'Cash Flow Forecast'
    }
  },
  {
    title: 'Revenue Target',
    message: 'Congratulations! Sales team exceeded Q3 revenue target by 8%',
    type: 'info',
    data: {
      team: 'Sales',
      period: 'Q3 2023',
      percentage: '8%'
    }
  },
  {
    title: 'Critical Expense Alert',
    message: 'Unexpected increase in cloud infrastructure costs detected',
    type: 'critical',
    data: {
      category: 'Cloud Infrastructure',
      increase: '32%',
      impact: 'High'
    }
  }
];