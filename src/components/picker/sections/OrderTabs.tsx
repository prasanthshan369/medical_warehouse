import React, { useMemo } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import OrderCard from './OrderCard';
import PartialOrderCard from './PartialOrderCard';
import CompletedOrderCard from './CompletedOrderCard';
import { Order } from '@/src/types/order.types';

interface TabProps {
    orders: Order[];
    onRefresh?: () => void;
    refreshing?: boolean;
    searchQuery?: string;
}

export const NewOrdersTab: React.FC<TabProps> = ({ orders, onRefresh, refreshing, searchQuery = '' }) => {
    const filteredOrders = useMemo(() => {
        return orders?.filter(order =>
            order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.items && order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())))
        ) || [];
    }, [orders, searchQuery]);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard order={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View style={{ paddingVertical: 80, alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(0,0,0,0.3)', fontFamily: 'Inter-Medium' }}>
                            {searchQuery ? 'No orders match your search' : 'No new orders'}
                        </Text>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

export const PartialOrdersTab: React.FC<TabProps> = ({ orders, onRefresh, refreshing, searchQuery = '' }) => {
    const filteredOrders = useMemo(() => {
        return orders?.filter(order =>
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.items && order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            order.medicineSlug?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
    }, [orders, searchQuery]);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PartialOrderCard order={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View style={{ paddingVertical: 80, alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(0,0,0,0.3)', fontFamily: 'Inter-Medium' }}>
                            {searchQuery ? 'No orders match your search' : 'No partial orders'}
                        </Text>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

export const CompletedOrdersTab: React.FC<TabProps> = ({ orders, onRefresh, refreshing, searchQuery = '' }) => {
    const filteredOrders = useMemo(() => {
        return orders?.filter(order =>
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.medicineSlug?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
    }, [orders, searchQuery]);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CompletedOrderCard order={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View style={{ paddingVertical: 80, alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(0,0,0,0.3)', fontFamily: 'Inter-Medium' }}>No completed orders found</Text>
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};
