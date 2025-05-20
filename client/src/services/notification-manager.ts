import { Notification } from './notification-service';

// Notification event types
type NotificationEventType = 'add' | 'read' | 'delete' | 'clear' | 'update';

// Notification event interface
interface NotificationEvent {
  type: NotificationEventType;
  notification?: Notification;
  notificationId?: string;
}

// Notification subscriber function type
type NotificationSubscriber = (event: NotificationEvent) => void;

/**
 * Notification Manager - A central pub/sub system for notification events
 * 
 * This manager handles notification events across the application using
 * a publish-subscribe pattern, allowing components to subscribe to
 * notification events without direct coupling.
 */
class NotificationManager {
  private subscribers: NotificationSubscriber[] = [];
  private notificationStorage: Notification[] = [];
  private storageKey = 'finoptix_notifications';
  
  constructor() {
    this.loadFromStorage();
    
    // Listen for storage events (if another tab updates notifications)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.storageKey) {
          this.loadFromStorage();
          this.publish({ type: 'update' });
        }
      });
    }
  }
  
  /**
   * Subscribe to notification events
   * @param subscriber Callback function that receives notification events
   * @returns Unsubscribe function
   */
  subscribe(subscriber: NotificationSubscriber): () => void {
    this.subscribers.push(subscriber);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
    };
  }
  
  /**
   * Publish a notification event to all subscribers
   * @param event The notification event
   */
  private publish(event: NotificationEvent): void {
    this.subscribers.forEach(subscriber => subscriber(event));
  }
  
  /**
   * Load notifications from local storage
   */
  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const storedData = localStorage.getItem(this.storageKey);
        if (storedData) {
          this.notificationStorage = JSON.parse(storedData, (key, value) => {
            if (key === 'timestamp') return new Date(value);
            return value;
          });
        }
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      this.notificationStorage = [];
    }
  }
  
  /**
   * Save notifications to local storage
   */
  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.notificationStorage));
      }
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }
  
  /**
   * Get all notifications
   * @returns Array of notifications
   */
  getNotifications(): Notification[] {
    return [...this.notificationStorage];
  }
  
  /**
   * Get unread notifications count
   * @returns Number of unread notifications
   */
  getUnreadCount(): number {
    return this.notificationStorage.filter(n => !n.isRead).length;
  }
  
  /**
   * Add a new notification
   * @param notification The notification to add
   * @returns The added notification
   */
  addNotification(notification: Notification): Notification {
    // Add notification to storage
    this.notificationStorage = [notification, ...this.notificationStorage];
    this.saveToStorage();
    
    // Publish the event
    this.publish({
      type: 'add',
      notification
    });
    
    return notification;
  }
  
  /**
   * Mark a notification as read
   * @param notificationId ID of the notification to mark as read
   * @returns Whether the operation was successful
   */
  markAsRead(notificationId: string): boolean {
    const index = this.notificationStorage.findIndex(n => n.id === notificationId);
    
    if (index === -1) return false;
    
    // Update notification
    const updatedNotification = {
      ...this.notificationStorage[index],
      isRead: true
    };
    
    // Update storage
    this.notificationStorage[index] = updatedNotification;
    this.saveToStorage();
    
    // Publish the event
    this.publish({
      type: 'read',
      notification: updatedNotification,
      notificationId
    });
    
    return true;
  }
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    // Update all notifications
    this.notificationStorage = this.notificationStorage.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    this.saveToStorage();
    
    // Publish the event
    this.publish({ type: 'update' });
  }
  
  /**
   * Delete a notification
   * @param notificationId ID of the notification to delete
   * @returns Whether the operation was successful
   */
  deleteNotification(notificationId: string): boolean {
    const index = this.notificationStorage.findIndex(n => n.id === notificationId);
    
    if (index === -1) return false;
    
    // Remove notification
    const removedNotification = this.notificationStorage[index];
    this.notificationStorage = this.notificationStorage.filter(n => n.id !== notificationId);
    this.saveToStorage();
    
    // Publish the event
    this.publish({
      type: 'delete',
      notification: removedNotification,
      notificationId
    });
    
    return true;
  }
  
  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationStorage = [];
    this.saveToStorage();
    
    // Publish the event
    this.publish({ type: 'clear' });
  }
}

// Create a singleton instance
export const notificationManager = new NotificationManager();

// Export a hook for React components to use the notification manager
export function useNotificationManager() {
  return notificationManager;
}