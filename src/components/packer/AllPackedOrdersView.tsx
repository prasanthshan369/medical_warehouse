import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';
import { PACKED_ORDERS } from '@/src/constants/data';
import PackedOrderCard from './PackedOrderCard';

const AllPackedOrdersView = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const Search = icons.search;
    const SwapVert = icons.swapVert;

    const filteredOrders = useMemo(() => {
        return PACKED_ORDERS.filter(order =>
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <View className="flex-1 bg-[#F8F8F8]">
            {/* Search and Sort Bar */}
            <View className="px-5 mb-4 pt-4 flex-row items-center">
                <View className="flex-1 flex-row items-center bg-[#F0F0F0] rounded-xl px-4 py-2">
                    <Search width={20} height={20} stroke="#969696" />
                    <TextInput
                        placeholder="Search order ID or name"
                        placeholderTextColor="#969696"
                        className="flex-1 ml-3 text-[#969696]   text-[14px] font-inter-medium"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity className="ml-4 p-2">
                    <SwapVert width={24} height={24} fill="#6A6A6A" />
                </TouchableOpacity>
            </View>

            {/* Full Orders List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PackedOrderCard order={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View className="py-20 items-center">
                        <Text className="text-black/30 font-inter-medium">
                            {searchQuery ? 'No orders match your search' : 'No packed orders'}
                        </Text>
                    </View>
                )}
                removeClippedSubviews={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};

export default AllPackedOrdersView;
