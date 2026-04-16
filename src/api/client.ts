import { API_BASE_URL } from '@/src/utils/urls';
import axios from 'axios';
import { storage } from '../utils/storage';
import { useNetworkStore } from '../store/useNetworkStore';
import { requestQueue } from '../utils/requestQueue';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Variables to handle token refresh queuing
let isRefreshing = false;
let failedQueue: any[] = [];

/**
 * Processes the queue of failed requests after a token refresh attempt.
 */
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor to attach bearer tokens and check connectivity
axiosInstance.interceptors.request.use(
    async (config) => {
        // Network Awareness: Check connectivity before request
        const { isConnected } = useNetworkStore.getState();
        if (isConnected === false) {
            return Promise.reject({ 
                message: 'No internet connection', 
                isOffline: true,
                config // Pass config for queuing
            });
        }

        const token = await storage.getAccessToken();
        const url = config.url || '';
        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

        if (token && !isAuthEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handles refresh logic, timeouts, and offline queue
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Standardize the error object if it doesn't already have our flags
        const originalRequest = error.config || error.config;

        // 1. Handle Offline Scenarios (pre-flight check)
        if (error.isOffline) {
            return new Promise((resolve, reject) => {
                requestQueue.add(originalRequest, resolve, reject);
            });
        }

        const url = originalRequest?.url || '';

        // 1.5. Handle unexpected network failures (e.g. server down or sudden disconnect)
        if (!error.response && error.code !== 'ECONNABORTED' && !url.includes('auth/refresh')) {
            useNetworkStore.getState().setIsConnected(false);
            return new Promise((resolve, reject) => {
                requestQueue.add(originalRequest, resolve, reject);
            });
        }

        // 2. Handle Timeout Errors
        if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
            return Promise.reject({ 
                message: 'Request timeout', 
                isTimeout: true 
            });
        }

        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

        // 3. Handle Token Expiration (401 errors) - PRESERVED LOGIC
        if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest?._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Dynamically import store to avoid circular dependency
                const { useAuthStore } = await import('../store/useAuthStore');
                const store = useAuthStore.getState();
                const newToken = await store.refreshAccessToken();

                if (newToken) {
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                } else {
                    processQueue(new Error('Token refresh failed'), null);
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Standardize general errors
        return Promise.reject({
            message: error.response?.data?.message || error.message || 'An unexpected error occurred',
            isOffline: false,
            isTimeout: false,
            status: error.response?.status
        });
    }
);

export default axiosInstance;
