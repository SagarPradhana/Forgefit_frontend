import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [
    {
      id: "1",
      title: "New User Registered",
      message: "A new user named Sagar has joined ForgeFit.",
      timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Payment Received",
      message: "Payment for membership 'Elite' was successfully processed.",
      timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
      read: true,
      type: "success",
    },
    {
       id: "3",
       title: "Subscription Expiring",
       message: "Trainer John's subscription will expire in 3 days.",
       timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
       read: false,
       type: "warning",
    }
  ],
  addNotification: (notif) => set((state) => ({
    notifications: [
      {
        ...notif,
        id: Math.random().toString(36).substring(7),
        read: false,
        timestamp: Date.now(),
      },
      ...state.notifications
    ]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  clearAll: () => set({ notifications: [] }),
}));
