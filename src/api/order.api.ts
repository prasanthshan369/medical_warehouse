import { apiClient } from './client';
import { API_ENDPOINTS } from '../utils/urls';
import { Order, ApiOrder, ApiPickerQueueResponse, OrderItem } from '../types/order.types';
import { formatTimeAgo, formatOrderDate } from '../utils/dateUtils';
import { ORDER_STATUS } from '../constants/order.constants';

// Helper to map API orders to our UI format
const mapApiOrderToOrder = (apiOrder: ApiOrder): Order => {
    const timeAgo = formatTimeAgo(apiOrder.createdAt);
    const orderDate = formatOrderDate(apiOrder.createdAt);

    const medicineNames = apiOrder.items?.map(it => it.medicineSnapshot.name) || [];
    const uniqueNames = Array.from(new Set(medicineNames));
    const displayedNames = uniqueNames.slice(0, 2).join(', ');
    const extraCount = uniqueNames.length - 2;
    const medicineSlug = extraCount > 0
        ? `${displayedNames}... +${extraCount} items`
        : displayedNames || 'No items';
    const totalItems = apiOrder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Map items to the picking list format required by the UI
    const pickingItems: OrderItem[] = apiOrder.items?.map(it => ({
        id: it.id,
        name: it.medicineSnapshot.name,
        manufacturer: 'Generic', // Fallback if manufacturer is missing
        requiredQty: it.quantity,
        pickedQty: 0, // In picker-queue, everything is start at 0
        status: it.status.toLowerCase() as any, // e.g. 'pending'
        image: it.medicineSnapshot.thumbnailUrl,
        batchNo: 'N/A',
        expiryDate: 'N/A'
    })) || [];

    const orderImages = apiOrder.items?.map(it => it.medicineSnapshot.thumbnailUrl).filter(Boolean) as string[] || [];

    const customerName = apiOrder.customer ? `${apiOrder.customer.firstName} ${apiOrder.customer.lastName}` : 'N/A';

    return {
        id: apiOrder.id, // THE GUID needed for fetching particulars
        orderId: apiOrder.orderId, // Human readable for UI
        customerName: customerName,
        orderDate: orderDate,
        medicineSlug: medicineSlug,
        timeAgo: timeAgo,
        status: apiOrder.status === ORDER_STATUS.PACKED ? 'completed' 
              : apiOrder.status === ORDER_STATUS.PICKED ? 'partial' 
              : 'new',
        totalItems: totalItems,
        items: medicineNames,
        images: orderImages.slice(0, 4), // Take up to 4 images for the summary
        pickingItems: pickingItems, // For Detail screen
        date: apiOrder.createdAt,
    };
};

export const orderApi = {
    /**
     * LIVE API: Fetch orders for the Picker tab
     */
    getOrders: async (): Promise<Order[]> => {
        try {
            const response = await apiClient.get<ApiPickerQueueResponse>(API_ENDPOINTS.GET_PICKER_QUEUE);

            if (response.data.success) {
                return response.data.data.map(mapApiOrderToOrder);
            }
            return [];
        } catch (error) {
            console.error('Error fetching live orders:', error);
            return [];
        }
    },

    /**
     * LIVE API: Fetch detailed order information
     */
    getOrderDetails: async (id: string): Promise<Order | null> => {
        try {
            const response = await apiClient.get<{ success: boolean; data: ApiOrder }>(`${API_ENDPOINTS.GET_ORDER_DETAILS}/${id}`);

            if (response.data.success) {
                return mapApiOrderToOrder(response.data.data);
            }
            return null;
        } catch (error) {
            console.error('Error fetching order details:', error);
            return null;
        }
    }
};
