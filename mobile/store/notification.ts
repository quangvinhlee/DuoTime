import { create } from "zustand";
import { Notification } from "@/generated/graphql";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: any;
  newNotification: Notification | null;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  setNewNotification: (notification: Notification | null) => void;

  // Business logic
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  clearBadge: () => void;
  updateBadge: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  newNotification: null,

  // Basic setters
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setNewNotification: (notification) => set({ newNotification: notification }),

  // Business logic
  addNotification: (notification) => {
    const { notifications, unreadCount } = get();

    // For reminder notifications, don't persist them in the store
    // They should only exist for the current session
    if (notification.type === "REMINDER") {
      // Just update the newNotification for immediate display
      set({
        newNotification: notification,
      });
      return;
    }

    // Check if notification already exists to prevent duplicates
    const existingNotification = notifications.find(
      (n) => n.id === notification.id
    );
    if (existingNotification) {
      return;
    }

    set({
      notifications: [notification, ...notifications],
      unreadCount: unreadCount + 1,
      newNotification: notification,
    });
  },

  markAsRead: (notificationId) => {
    const { notifications, unreadCount } = get();
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    );

    const wasUnread =
      notifications.find((n) => n.id === notificationId)?.isRead === false;
    const newUnreadCount = wasUnread
      ? Math.max(0, unreadCount - 1)
      : unreadCount;

    set({
      notifications: updatedNotifications,
      unreadCount: newUnreadCount,
    });
  },

  deleteNotification: (notificationId) => {
    const { notifications, unreadCount } = get();
    const deletedNotification = notifications.find(
      (n) => n.id === notificationId
    );
    const wasUnread = deletedNotification?.isRead === false;

    set({
      notifications: notifications.filter((n) => n.id !== notificationId),
      unreadCount: wasUnread ? Math.max(0, unreadCount - 1) : unreadCount,
    });
  },

  clearBadge: () => set({ unreadCount: 0 }),
  updateBadge: (count) => set({ unreadCount: count }),
}));
