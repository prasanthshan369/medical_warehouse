import { create } from 'zustand';

interface NetworkState {
  isConnected: boolean | null;
  setIsConnected: (connected: boolean | null) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true, // Default to true assuming connection during startup
  setIsConnected: (connected) => set({ isConnected: connected }),
}));
