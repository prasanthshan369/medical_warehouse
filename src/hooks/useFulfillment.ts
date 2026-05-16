import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fulfillmentApi } from '../api/fulfillment.api';
import { ExtendMinutes } from '../types/fulfillment.types';
import { toAppError } from '../api/errors';
import { useNotificationStore } from '../store/useNotificationStore';
import { useSocket } from './useSocket';

/**
 * Fetches and tracks all active picker locks.
 * Polls every 30s as a fallback when sockets are unavailable.
 */
export function useActiveLocks() {
    return useQuery({
        queryKey: ['active-locks'],
        queryFn: () => fulfillmentApi.getActiveLocks(),
        refetchInterval: 30000,
    });
}

/**
 * Synchronizes fulfillment state via WebSockets.
 * Listens for order lock events and invalidates relevant queries.
 */
export function useSyncFulfillment() {
    const queryClient = useQueryClient();
    const { on, isConnected } = useSocket();

    useEffect(() => {
        if (!isConnected) return;

        const cleanup1 = on('order_update', () => {
            queryClient.invalidateQueries({ queryKey: ['active-locks'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        });

        const cleanup2 = on('notification', (data: any) => {
            if (data.type?.startsWith('orders.')) {
                queryClient.invalidateQueries({ queryKey: ['active-locks'] });
                queryClient.invalidateQueries({ queryKey: ['orders'] });
            }
        });

        return () => {
            if (cleanup1) cleanup1();
            if (cleanup2) cleanup2();
        };
    }, [on, isConnected, queryClient]);
}

/**
 * Fulfillment actions: claim, release, and extend lock.
 * Pass orderId at hook level to use as default, or override per call.
 */
export function useFulfillmentActions(orderId?: string) {
    const queryClient = useQueryClient();
    const addNotification = useNotificationStore((s) => s.addNotification);

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['active-locks'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    // ── Claim ─────────────────────────────────────────────────────────────────
    const { mutateAsync: claimMutation, isPending: isClaiming } = useMutation({
        mutationFn: (id: string) => fulfillmentApi.claim(id),
        onSuccess: () => {
            invalidate();
            addNotification({ title: 'Order claimed', message: 'Ready to pick.', type: 'success' });
        },
        onError: (error) => {
            addNotification({ title: 'Unable to claim', message: toAppError(error).message, type: 'error' });
        },
    });

    // ── Release ───────────────────────────────────────────────────────────────
    const { mutateAsync: releaseMutation, isPending: isReleasing } = useMutation({
        mutationFn: (id: string) => fulfillmentApi.release(id),
        onSuccess: () => {
            invalidate();
            addNotification({ title: 'Order released', message: 'Lock removed.', type: 'info' });
        },
        onError: (error) => {
            addNotification({ title: 'Unable to release', message: toAppError(error).message, type: 'error' });
        },
    });

    // ── Extend ────────────────────────────────────────────────────────────────
    const { mutateAsync: extendMutation, isPending: isExtending } = useMutation({
        mutationFn: ({ id, minutes }: { id: string; minutes: ExtendMinutes }) =>
            fulfillmentApi.extend(id, minutes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['active-locks'] });
            addNotification({ title: 'Time extended', message: 'Lock duration updated.', type: 'success' });
        },
        onError: (error) => {
            addNotification({ title: 'Unable to extend', message: toAppError(error).message, type: 'error' });
        },
    });

    return {
        claim: (id?: string) => claimMutation(id ?? orderId!),
        release: (id?: string) => releaseMutation(id ?? orderId!),
        extend: (minutes: ExtendMinutes, id?: string) => extendMutation({ id: id ?? orderId!, minutes }),
        isClaiming,
        isReleasing,
        isExtending,
    };
}
