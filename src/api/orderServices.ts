import axiosInstance from './client';
import { API_ENDPOINTS } from '../utils/urls';
import { ORDERS, PACKED_ORDERS } from '../constants/data';
import { Order, ApiOrder, ApiPickerQueueResponse } from './types';

// Helper to map API orders to our UI format
const mapApiOrderToOrder = (apiOrder: ApiOrder): Order => {
    // Basic timeAgo calculation
    const createdDate = new Date(apiOrder.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const timeAgo = diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ago`;

    return {
        id: apiOrder.orderNumber, // Use orderNumber as ID for display
        customerName: `${apiOrder.customer.firstName} ${apiOrder.customer.lastName}`,
        timeAgo: timeAgo,
        status: 'new', // Assuming picker-queue only returns new items for now
        totalItems: 0, // Placeholder as list API doesn't provide item count yet
        items: [], // Placeholder
        date: apiOrder.createdAt,
    };
};

export const orderService = {
    /**
     * LIVE API: Fetch orders for the Picker tab
     */
    getOrders: async (): Promise<Order[]> => {
        try {
            // const response = await axiosInstance.get<ApiPickerQueueResponse>(API_ENDPOINTS.GET_PICKER_QUEUE);
            // if (response.data.success) {
            //     return response.data.data.map(mapApiOrderToOrder);
            // }
            return ORDERS as Order[];
        } catch (error) {
            console.error('Error fetching live orders:', error);
            // Fallback to mock data if API fails during transition
            return ORDERS as Order[];
        }
    },

    /**
     * MOCK API: Fetch detailed order information for picking and completion
     */
    getOrderDetails: async (id: string): Promise<Order | null> => {
        try {
            // Check both standard orders and packed dummy orders
            const allMockData = [...(ORDERS || []), ...(PACKED_ORDERS || [])];

            const normalize = (s: string) => s.replace('Order ', '').replace('#', '').trim();
            const normalizedId = normalize(id);
            
            console.log('Fetching order details for ID:', id, 'Normalized:', normalizedId);

            const order = allMockData.find(o => {
                const normalizedMockId = normalize(o.id);
                return normalizedMockId === normalizedId;
            });
            
            console.log('Order found:', order ? order.id : 'NOT FOUND');

            return order || null;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw new Error('Could not load order details');
        }
    }
};
