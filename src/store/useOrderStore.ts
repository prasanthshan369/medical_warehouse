import { create } from 'zustand';
import { orderService } from '../api/orderServices';
import { Order, OrderStatus } from '../api/types';
import { ORDERS as STATIC_ORDERS } from '../constants/data';

interface OrderState {
    orders: Order[];
    ordersLoading: boolean;
    ordersError: string | null;
    activeTab: OrderStatus;

    fetchOrders: () => Promise<void>;
    setActiveTab: (tab: OrderStatus) => void;
    clearOrders: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
    // Initial Orders State
    orders: STATIC_ORDERS as Order[],
    ordersLoading: false,
    ordersError: null,
    activeTab: 'new',

    fetchOrders: async () => {
        set({ ordersLoading: true, ordersError: null });
        try {
            const data = await orderService.getOrders();
            set({ orders: data, ordersLoading: false });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to fetch orders';
            set({
                ordersError: message,
                ordersLoading: false
            });
        }
    },

    setActiveTab: (tab) => set({ activeTab: tab }),

    clearOrders: () => set({
        orders: STATIC_ORDERS as Order[],
        ordersError: null,
        activeTab: 'new'
    })
}));
