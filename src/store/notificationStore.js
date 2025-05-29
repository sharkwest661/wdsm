// src/store/notificationStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useNotificationStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // NOTIFICATIONS SYSTEM
      // ==========================================
      notifications: {
        queue: [],
        history: [],
      },

      // ==========================================
      // NOTIFICATION ACTIONS
      // ==========================================
      addNotification: (type, message) => {
        const notification = {
          id: Date.now() + Math.random(), // Ensure uniqueness
          type,
          message,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          notifications: {
            ...state.notifications,
            queue: [...state.notifications.queue, notification],
            history: [...state.notifications.history, notification],
          },
        }));

        return notification.id;
      },

      removeNotification: (notificationId) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            queue: state.notifications.queue.filter(
              (n) => n.id !== notificationId
            ),
          },
        }));
      },

      clearAllNotifications: () => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            queue: [],
          },
        }));
      },

      getNotificationQueue: () => {
        const state = get();
        return state.notifications.queue;
      },

      getNotificationHistory: () => {
        const state = get();
        return state.notifications.history;
      },

      // ==========================================
      // CONVENIENCE METHODS
      // ==========================================
      notifySuccess: (message) => {
        return get().addNotification("success", message);
      },

      notifyInfo: (message) => {
        return get().addNotification("info", message);
      },

      notifyWarning: (message) => {
        return get().addNotification("warning", message);
      },

      notifyError: (message) => {
        return get().addNotification("error", message);
      },

      // ==========================================
      // RESET NOTIFICATIONS
      // ==========================================
      resetNotifications: () =>
        set(() => ({
          notifications: {
            queue: [],
            history: [],
          },
        })),
    }),
    {
      name: "web-dev-sim-notifications",
      partialize: (state) => ({
        notifications: {
          history: state.notifications.history, // Only persist history, not queue
        },
      }),
    }
  )
);

export default useNotificationStore;
