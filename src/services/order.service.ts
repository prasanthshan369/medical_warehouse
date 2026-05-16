import { orderApi } from '../api/order.api';
import { useOrderStore } from '../store/useOrderStore';
import { ApiOrder, Order, OrderItem, OrderStatus, ListOrdersParams } from '../types/order.types';
import { formatTimeAgo, formatOrderDate, formatExpiryDate } from '../utils/dateUtils';
import { ORDER_STATUS } from '../constants/order.constants';

const mapOrder = (apiOrder: ApiOrder): Order => {
    const medicineNames = apiOrder.items?.map(it => it.medicineSnapshot.name) || [];
    const uniqueNames = Array.from(new Set(medicineNames));
    const displayedNames = uniqueNames.slice(0, 2).join(', ');
    const extraCount = uniqueNames.length - 2;
    const medicineSlug = extraCount > 0
        ? `${displayedNames}... +${extraCount} items`
        : displayedNames || 'No items';

    const pickingItems: OrderItem[] = apiOrder.items?.map(it => ({
        id: it.id,
        name: it.medicineSnapshot.name,
        manufacturer: 'Generic',
        requiredQty: it.quantity,
        pickedQty: 0,
        status: it.status.toLowerCase() as any,
        image: it.medicineSnapshot.thumbnailUrl,
        batchNo: it.batchNumber,
        expiryDate: it.expiryDate ? formatExpiryDate(it.expiryDate) : undefined,
    })) || [];

    const orderImages = apiOrder.items
        ?.map(it => it.medicineSnapshot.thumbnailUrl)
        .filter(Boolean) as string[] || [];

    return {
        id: apiOrder.id,
        orderId: apiOrder.orderId,
        customerName: apiOrder.customer
            ? `${apiOrder.customer.firstName} ${apiOrder.customer.lastName}`
            : 'N/A',
        orderDate: formatOrderDate(apiOrder.createdAt),
        timeAgo: formatTimeAgo(apiOrder.createdAt),
        medicineSlug,
        status: apiOrder.status === ORDER_STATUS.PACKED ? 'completed'
            : apiOrder.status === ORDER_STATUS.PICKED ? 'partial'
            : 'new',
        totalItems: apiOrder.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        items: medicineNames,
        images: orderImages.slice(0, 4),
        pickingItems,
        date: apiOrder.createdAt,
    };
};

export const orderService = {
    list: async (params?: ListOrdersParams): Promise<Order[]> => {
        const data = await orderApi.list(params);
        const orders = data.map(mapOrder);
        useOrderStore.getState().setOrders(orders);
        return orders;
    },

    listDetailed: async (params?: ListOrdersParams): Promise<Order[]> => {
        const data = await orderApi.listDetailed(params);
        return data.map(mapOrder);
    },

    getById: async (id: string): Promise<Order> => {
        const data = await orderApi.getById(id);
        return mapOrder(data);
    },

    updateStatus: (id: string, status: number, reason?: string) =>
        orderApi.updateStatus(id, status, reason),

    setActiveTab: (tab: OrderStatus) =>
        useOrderStore.getState().setActiveTab(tab),

    clearOrders: () =>
        useOrderStore.getState().clearOrders(),
};
