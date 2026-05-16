import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../utils/urls';

export function useSocket() {
    const accessToken = useAuthStore((s) => s.accessToken);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !accessToken) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        const socket = io(API_BASE_URL, {
            auth: { token: accessToken },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log(`[Socket] Connected to ${API_BASE_URL}`);
            setIsConnected(true);
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
            setIsConnected(false);
        });

        socket.on('disconnect', (reason) => {
            console.warn('[Socket] Disconnected:', reason);
            setIsConnected(false);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        };
    }, [accessToken, isAuthenticated]);

    // Registers a listener and returns a cleanup function.
    // The wrapper is captured so socket.off removes the correct reference.
    const on = useCallback((event: string, callback: (...args: any[]) => void) => {
        const socket = socketRef.current;
        if (!socket) {
            console.warn(`[Socket] Cannot listen to "${event}" — socket not connected.`);
            return;
        }

        const wrapper = (data: any) => {
            console.log(`[Socket] Event "${event}":`, data);
            callback(data);
        };

        socket.on(event, wrapper);
        return () => {
            socket.off(event, wrapper);
        };
    }, []);

    const emit = useCallback((event: string, data?: any) => {
        socketRef.current?.emit(event, data);
    }, []);

    return { socket: socketRef.current, isConnected, on, emit };
}
