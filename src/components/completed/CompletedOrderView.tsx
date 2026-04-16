import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Order } from '@/src/api/types';
import { orderService } from '@/src/api/orderServices';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';
import CompletedOrderItemCard from './CompletedOrderItemCard';
import { ItemPickingSkeletonList } from '../picking/ItemPickingSkeleton';

interface CompletedOrderViewProps {
    orderId: string;
}

const CompletedOrderView: React.FC<CompletedOrderViewProps> = ({ orderId }) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const ArrowBack = icons.arrowBack;
    const Person = icons.person;
    const Print = icons.print;
    const EditorChoice = icons.editor_choice;
    const Clock = icons.creditCardClock;

    useEffect(() => {
        loadOrderDetails();
    }, [orderId]);

    const loadOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderDetails(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Failed to load completed order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="px-5 py-5 flex-row items-center">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="mr-5"
                >
                    <ArrowBack width={16} height={16} fill={colors.textMain} />
                </TouchableOpacity>
                <Text style={{ color: colors.textMain }} className="text-[18px] font-inter-bold">Order Completion Details</Text>
            </View>

            {/* Content */}
            {loading ? (
                <View className="px-5 pt-4">
                    <ItemPickingSkeletonList />
                </View>
            ) : (
                <View className="flex-1 ">
                    <ScrollView 
                    className="flex-1 px-5 pt-6 bg-[#F7F7F7]"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 150 }}
                    >
                        {/* Summary Card */}
                        <View 
                        className="bg-white p-6 rounded-[24px] mb-8 shadow-[#00000005] border border-[#E6E6E6]"
                        >
                            {/* Status Header */}
                            <View className="flex-row items-center mb-6">
                            <View 
                                style={{ backgroundColor: `${colors.primary}15` }}
                                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                            >
                                <EditorChoice width={32} height={32} fill={colors.primary} />
                            </View>
                            <View>
                                <Text style={{ color: colors.textMain }} className="text-[18px] font-inter-semibold">
                                    #{orderId}
                                    </Text>
                                <Text style={{ color: colors.textSecondary }} className="text-[14px] font-inter-medium">
                                    {order?.totalItems ?? 0} Items
                                    </Text>
                                </View>
                            </View>

                            {/* Info Rows */}
                        <View className="space-y-4">
                            {/* Customer row */}
                                <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center mr-4">
                                    <Person width={20} height={20} fill="#666666" />
                                    </View>
                                    <View>
                                    <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter-medium mb-0.5">Customer Name</Text>
                                    <Text style={{ color: colors.textMain }} className="text-[15px] font-inter-medium">{order?.customerName}</Text>
                                    </View>
                                </View>

                                {/* Date row */}
                            <View className="flex-row items-center mt-4">
                                <View className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center mr-4">
                                    <Clock width={18} height={18} fill="#666666" />
                                    </View>
                                    <View>
                                    <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter-medium mb-0.5">Completion Date</Text>
                                    <Text style={{ color: colors.textMain }} className="text-[15px] font-inter-medium">{order?.completionDate}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Section Label */}
                    <Text  className="text-[14px] font-inter text-textSecondary mb-6">
                        {order?.pickingItems?.some(item => item.status === 'packed') ? 'Packed Items' : 'Picked Items'}
                        </Text>

                        {/* Items List */}
                        <View>
                        {order?.pickingItems?.map((item) => (
                            <CompletedOrderItemCard key={item.id} item={item} />
                        ))}
                        </View>
                    </ScrollView>
                </View>
            )}

        </View>
    );
};

export default CompletedOrderView;
