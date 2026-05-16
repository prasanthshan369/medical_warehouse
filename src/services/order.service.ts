import { orderApi } from '../api/order.api';
import { useOrderStore } from '../store/useOrderStore';
import { OrderStatus } from '../types/order.types';

export const orderService = {
    fetchOrders: async () => {
        const data = await orderApi.getOrders();
        // Optional: Sync with store if needed elsewhere
        useOrderStore.getState().setOrders(data);
        return data;
    },

    getOrderDetails: async (id: string) => {
        return await orderApi.getOrderDetails(id);
    },

    setActiveTab: (tab: OrderStatus) => {
        useOrderStore.getState().setActiveTab(tab);
    },

    clearOrders: () => {
        useOrderStore.getState().clearOrders();
    }
};
