import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { useNetworkStore } from '../store/useNetworkStore';
import { requestQueue } from './requestQueue';

/**
 * Initializes the network listener to track connection status.
 */
export const initNetworkListener = (axiosInstance: any) => {
  return NetInfo.addEventListener((state) => {
    const wasConnected = useNetworkStore.getState().isConnected !== false;
    const isConnected = !!state.isConnected && state.isInternetReachable !== false;

    useNetworkStore.getState().setIsConnected(isConnected);

    // If we just regained connection automatically, process the queue
    if (!wasConnected && isConnected) {
      requestQueue.process(axiosInstance);
    }
  });
};
