import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

/**
 * Hook to fetch the list of orders for the picker queue.
 * Handles caching and automatic background refetching.
 */
export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.fetchOrders(),
  });
};

/**
 * Hook to fetch the details of a specific order.
 * @param orderId - The unique ID of the order to fetch.
 */
export const useOrderDetailQuery = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderDetails(orderId),
    enabled: !!orderId, // Only fetch if orderId is provided
  });
};
