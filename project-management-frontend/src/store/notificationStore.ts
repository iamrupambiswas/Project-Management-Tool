import { create } from "zustand";
import api from "../services/api";

type Notification = {
  id: number;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  relatedEntityId: number;
};

type NotificationStore = {
  notifications: Notification[];
  fetchNotifications: (token: string) => Promise<void>;
  addNotification: (n: Notification) => void;
  markAsRead: (id: number, token: string) => Promise<void>;
  markAllAsRead: (userId: number, token: string) => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  fetchNotifications: async (token) => {
    try {
      const res = await api.get(`/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ notifications: res.data });
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  },

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
    })),

  // ✅ Mark single notification as read + remove locally
  markAsRead: async (id, token) => {
    try {
      await api.put(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // remove from local list
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  },

  // ✅ Mark all as read + delete locally (for local dev)
  markAllAsRead: async (userId, token) => {
    try {
      await api.put(`/notifications/read-all/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // clear all notifications locally
      set({ notifications: [] });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  },
}));
