import { create } from 'zustand';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type?: NotificationType;
    orderId?: string; // Optional specific metadata for this app
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],

    addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7);
        
        set((state) => {
            // Prevent duplicates if the same orderId is already in the queue
            if (notification.orderId && state.notifications.some(n => n.orderId === notification.orderId)) {
                return state;
            }
            
            return {
                notifications: [...state.notifications, { ...notification, id }]
            };
        });
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
        }));
    }
}));
