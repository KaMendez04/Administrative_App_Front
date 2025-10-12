export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'solicitud' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export type AddNotificationType = {
  title: string;
  message: string;
  type: 'solicitud' | 'warning' | 'info';
};