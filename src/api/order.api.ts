import { API_ENDPOINTS } from '../utils/urls';
import { apiClient } from './client';
import { ApiOrder, ApiPickerQueueResponse, ListOrdersParams } from '../types/order.types';

export const orderApi = {
    list: async (params?: ListOrdersParams): Promise<ApiOrder[]> => {
        const response = await apiClient.get<ApiPickerQueueResponse>(API_ENDPOINTS.GET_PICKER_QUEUE, { params });
        return response.data.data;
    },

    listDetailed: async (params?: ListOrdersParams): Promise<ApiOrder[]> => {
        const response = await apiClient.get<ApiPickerQueueResponse>(API_ENDPOINTS.GET_PICKER_QUEUE_DETAILED, { params });
        return response.data.data;
    },

    getById: async (id: string): Promise<ApiOrder> => {
        const response = await apiClient.get<{ success: boolean; data: ApiOrder }>(API_ENDPOINTS.GET_ORDER_BY_ID(id));
        return response.data.data;
    },

    updateStatus: async (id: string, status: number, reason?: string): Promise<void> => {
        await apiClient.patch(API_ENDPOINTS.UPDATE_ORDER_STATUS(id), { status, reason });
    },
};
