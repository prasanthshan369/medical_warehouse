import { homeApi } from '../api/home.api';
import { useHomeStore } from '../store/useHomeStore';

export const homeService = {
    fetchStats: async () => {
        try {
            const data = await homeApi.getWarehouseStats();
            useHomeStore.getState().setStats(data);
            return data;
        } catch (error) {
            console.error('homeService.fetchStats failed:', error);
            throw error;
        }
    }
};
