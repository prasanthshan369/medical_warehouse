import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';
import { Order, OrderItem } from '@/src/api/types';
import { orderService } from '@/src/api/orderServices';

interface OrderSummaryViewProps {
    orderId: string;
}

const OrderSummaryView: React.FC<OrderSummaryViewProps> = ({ orderId }) => {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const ArrowBack = icons.arrowBack;
    const Person = icons.person;

    useEffect(() => {
        console.log('OrderSummaryView mounted with orderId:', orderId);
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderDetails(orderId);
            setOrder(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <View className="flex-1 bg-white items-center justify-center"><Text className="font-inter">Loading...</Text></View>;

    if (!order) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-10">
                <Text className="text-[18px] font-inter-bold mb-2">Order Not Found</Text>
                <Text className="text-[14px] font-inter text-center mb-8 text-[#666666]">We couldn't find any order with ID "#{orderId}"</Text>
                <TouchableOpacity 
                    className="bg-[#0F7635] px-8 py-3 rounded-full"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-inter-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F9F9F9]">
            {/* Header */}
            <View className="px-5 py-5 mt-6 flex-row items-center bg-white border-b border-[#EEEEEE]">
                <TouchableOpacity onPress={() => router.back()} className="mr-5">
                    <ArrowBack width={16} height={16} fill={colors.textMain} />
                </TouchableOpacity>
                <Text className="text-[18px] font-inter-bold" style={{ color: colors.textMain }}>Order Summary</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Order ID & Customer Card */}
                <View className="m-5 bg-white p-6 rounded-[16px] border border-[#EEEEEE]">
                    <Text className="text-[20px] font-inter-bold mb-4" style={{ color: colors.textMain }}>
                        #{orderId}
                    </Text>
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center mr-4">
                            <Person width={20} height={20} fill="#666666" />
                        </View>
                        <View>
                            <Text className="text-[12px] font-inter-medium mb-0.5" style={{ color: colors.textSecondary }}>Name</Text>
                            <Text className="text-[16px] font-inter-semibold" style={{ color: colors.textMain }}>{order?.customerName || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Section Title */}
                <Text className="px-5 text-[14px] font-inter-medium mb-3" style={{ color: colors.textSecondary }}>Ordered Items</Text>

                {/* Items List */}
                <View className="px-5 space-y-4">
                    {order?.pickingItems?.map((item) => (
                        <View key={item.id} className="bg-white p-6 rounded-[24px] border border-[#EEEEEE] mb-4">
                            <Text style={{ color: colors.textMain }} className="font-inter-bold text-[18px] mb-1">{item.name}</Text>
                            <Text style={{ color: colors.textSecondary }} className="text-[14px] mb-4 font-inter">{item.manufacturer}</Text>

                            <View className="flex-row items-center mb-6">
                                <View
                                    style={{ backgroundColor: colors.bgGray }}
                                    className="px-3 py-1.5 rounded-lg mr-2"
                                >
                                    <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter-semibold">Batch No: {item.batchNo}</Text>
                                </View>
                                <View
                                    style={{ backgroundColor: colors.bgGray }}
                                    className="px-3 py-1.5 rounded-lg"
                                >
                                    <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter-semibold">EXP {item.expiryDate}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-baseline mb-2">
                                <Text
                                    className="text-[47px] font-inter-bold text-primary"
                                    style={{ color: colors.primary, lineHeight: 52 }}
                                >
                                    {item.requiredQty}
                                </Text>
                                <Text style={{ color: colors.textMain }} className="text-[14px] font-inter-medium ml-2">
                                    Units Required
                                </Text>
                            </View>

                            {item.description && (
                                <View className="flex-row justify-end">
                                    <Text style={{ color: colors.textMain }} className="text-[11px] font-inter-medium">
                                        {item.description}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-[#EEEEEE]">
                <View className="flex-row justify-between items-center mb-4 px-1">
                    <Text className="text-[16px] font-inter-medium" style={{ color: colors.textMain }}>
                        Total Items <Text className="font-inter-bold">({order?.totalItems || order?.pickingItems?.length || 0})</Text>
                    </Text>
                </View>
                <TouchableOpacity 
                    className="h-[56px] rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                    onPress={() => router.push({
                        pathname: '/packer/success',
                        params: { orderId: orderId, totalItems: order?.totalItems || 0 }
                    } as any)}
                >
                    <Text className="text-white text-[16px] font-inter-bold">Pack Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OrderSummaryView;
