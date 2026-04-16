import { API_BASE_URL } from '@/src/utils/urls';
import axios from 'axios';
import { storage } from '../utils/storage';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Support for cookie-based session tracking/refresh
});

// Variables to handle token refresh queuing
let isRefreshing = false;
let failedQueue: any[] = [];

/**
 * Processes the queue of failed requests after a token refresh attempt.
 * @param error - Any error that occurred during refresh
 * @param token - The new access token (if available)
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

// Request interceptor to attach bearer tokens
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await storage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration (401 errors)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || '';

        // Skip token refresh for auth endpoints — 401 here means invalid credentials
        const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');

        // If the error is 401, not an auth endpoint, and not already retried
        if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
            
            // If another refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
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

        return Promise.reject(error);
    }
);

export default axiosInstance;