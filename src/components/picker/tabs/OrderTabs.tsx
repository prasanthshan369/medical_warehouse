import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import OrderCard from '../OrderCard';
import PartialOrderCard from '../PartialOrderCard';
import CompletedOrderCard from '../CompletedOrderCard';
import { Order } from '@/src/api/types';
import { icons } from '@/src/constants/icons';

interface TabProps {
    orders: Order[];
}

export const NewOrdersTab: React.FC<TabProps> = ({ orders }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const Search = icons.search;
    const SwapVert = icons.swapVert;

    const filteredOrders = useMemo(() => {
        return orders?.filter(order =>
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.items && order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())))
        ) || [];
    }, [orders, searchQuery]);

    return (
        <View className="flex-1">
            {/* Search and Sort Bar */}
            <View className="px-5 mb-6 flex-row items-center">
                <View className="flex-1 flex-row items-center bg-[#F0F0F0] rounded-xl px-4 py-2">
                    <Search width={18} height={18} stroke="#969696" />
                    <TextInput
                        placeholder="Search order ID"
                        placeholderTextColor="#969696"
                        className="flex-1 ml-3 text-[#969696] font-inter-medium"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity className="ml-4 p-2">
                    <SwapVert width={24} height={24} fill="#6A6A6A" />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderCard order={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View className="py-20 items-center">
                        <Text className="text-black/30 font-inter-medium">
                            {searchQuery ? 'No orders match your search' : 'No new orders'}
                        </Text>
                    </View>
                )}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

export const PartialOrdersTab: React.FC<TabProps> = ({ orders }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const Search = icons.search;
    const SwapVert = icons.swapVert;

    const filteredOrders = useMemo(() => {
        return orders?.filter(order =>
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.items && order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
    }, [orders, searchQuery]);

    return (
        <View className="flex-1">
            {/* Search and Sort Bar */}
            <View className="px-5 mb-6 flex-row items-center">
                <View className="flex-1 flex-row items-center bg-[#F0F0F0] rounded-xl px-4 py-2">
                    <Search width={18} height={18} stroke="#969696" />
                    <TextInput
                        placeholder="Search order ID"
                        placeholderTextColor="#969696"
                        className="flex-1 ml-3 text-[#969696] font-inter-medium"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity className="ml-4 p-2">
                    <SwapVert width={24} height={24} fill="#6A6A6A" />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PartialOrderCard order={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View className="py-20 items-center">
                        <Text className="text-black/30 font-inter-medium">
                            {searchQuery ? 'No orders match your search' : 'No partial orders'}
                        </Text>
                    </View>
                )}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

export const CompletedOrdersTab: React.FC<TabProps> = ({ orders }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const Search = icons.search;
    const SwapVert = icons.swapVert;

    const filteredOrders = useMemo(() => {
        return orders?.filter(order =>
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
    }, [orders, searchQuery]);

    return (
        <View className="flex-1">
            {/* Search and Sort Bar */}
            <View className="px-5 mb-6 flex-row items-center">
                <View className="flex-1 flex-row items-center bg-[#F0F0F0] rounded-xl px-4 py-2">
                    <Search width={18} height={18} stroke="#969696" />
                    <TextInput
                        placeholder="Search order ID"
                        placeholderTextColor="#969696"
                        className="flex-1 ml-3 text-[#969696] font-inter-medium"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity className="ml-4 p-2">
                    <SwapVert width={24} height={24} fill="#6A6A6A" />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CompletedOrderCard order={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View className="py-20 items-center">
                        <Text className="text-black/30 font-inter-medium">No completed orders found</Text>
                    </View>
                )}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};
