import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { useNetworkStore } from '../store/useNetworkStore';
import { requestQueue } from './requestQueue';

/**
 * Initializes the network listener to track connection status.
 */
export const initNetworkListener = (axiosInstance: any) => {
  return NetInfo.addEventListener((state) => {
    const isConnected = state.isConnected; // Preserve null if status is unknown
    const isInternetReachable = state.isInternetReachable;

    const wasFullyConnected = useNetworkStore.getState().isConnected === true && 
                              useNetworkStore.getState().isInternetReachable === true;

    useNetworkStore.getState().setIsConnected(isConnected, isInternetReachable);

    // If we just regained FULL connection automatically, process the queue
    const isNowFullyConnected = isConnected === true && isInternetReachable === true;
    if (!wasFullyConnected && isNowFullyConnected) {
      requestQueue.process(axiosInstance);
    }
  });
};
