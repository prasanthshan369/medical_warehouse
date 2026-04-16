import { WAREHOUSE_STATS } from '../constants/data';
import { WarehouseStat } from './types';

const MOCK_DELAY = 800;

export const homeService = {
    /**
     * MOCK API: Fetch warehouse statistics for the dashboard
     */
    getWarehouseStats: async (): Promise<WarehouseStat[]> => {
        try {
            // Simulating API latency
            await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
            return WAREHOUSE_STATS as WarehouseStat[];
        } catch (error) {
            console.error('Error fetching warehouse stats:', error);
            throw new Error('Could not load statistics');
        }
    }
};
