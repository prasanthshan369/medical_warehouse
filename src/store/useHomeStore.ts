import { create } from 'zustand';
import { WarehouseStat } from '../types/stat.types';
import { WAREHOUSE_STATS as STATIC_STATS } from '../constants/data';

interface HomeState {
    warehouseStats: WarehouseStat[];
    statsLoading: boolean;
    statsError: string | null;

    // Setters
    setStats: (stats: WarehouseStat[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearStats: () => void;
}

export const useHomeStore = create<HomeState>((set) => ({
    warehouseStats: STATIC_STATS as WarehouseStat[],
    statsLoading: false,
    statsError: null,

    setStats: (warehouseStats) => set({ warehouseStats }),
    setLoading: (statsLoading) => set({ statsLoading }),
    setError: (statsError) => set({ statsError }),
    clearStats: () => set({ 
        warehouseStats: STATIC_STATS as WarehouseStat[], 
        statsError: null, 
    })
}));
