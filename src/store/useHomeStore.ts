import { create } from 'zustand';
import { homeService } from '../api/homeServices';
import { WarehouseStat } from '../api/types';
import { WAREHOUSE_STATS as STATIC_STATS } from '../constants/data';

interface HomeState {
    warehouseStats: WarehouseStat[];
    statsLoading: boolean;
    statsError: string | null;
    
    fetchWarehouseStats: () => Promise<void>;
    clearStats: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
    // Initial Warehouse State - Start with static metrics for immediate visual feedback
    warehouseStats: STATIC_STATS as WarehouseStat[],
    statsLoading: false,
    statsError: null,

    fetchWarehouseStats: async () => {
        set({ statsLoading: true, statsError: null });
        try {
            const data = await homeService.getWarehouseStats();
            set({ warehouseStats: data, statsLoading: false });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to fetch warehouse stats';
            set({ 
                statsError: message, 
                statsLoading: false,
            });
        }
    },

    clearStats: () => set({ 
        warehouseStats: STATIC_STATS as WarehouseStat[], 
        statsError: null, 
    })
}));
