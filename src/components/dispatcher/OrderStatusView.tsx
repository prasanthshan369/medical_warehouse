import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/theme/colors';

const OrderStatusView = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { orderId, customerName, orderDate, cancelledAt, status } = useLocalSearchParams<{
        orderId: string;
        customerName: string;
        orderDate: string;
        cancelledAt?: string;
        status: 'ready' | 'cancelled';
    }>();

    const isCancelled = status === 'cancelled';

    const ArrowBack = icons.arrowBack;
    const Success = icons.success;
    const Cancel = icons.cancel;
    const Person = icons.person;
    const CalendarToday = icons.calendar_today;

    return (
        <View className="flex-1 bg-[#F7F7F7]">
            {/* Header */}
            <View
                className="bg-white flex-row items-center px-5 pb-4 border-b border-[#F0F0F0]"
                style={{ paddingTop: insets.top + 12 }}
            >
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowBack width={20} height={20} fill={colors.text.DEFAULT} />
                </TouchableOpacity>
                <Text className="text-[18px] font-inter-bold text-[#222222]">Order Status</Text>
            </View>

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 32 }}
            >
                {/* Status Icon */}
                <View className="items-center mb-5">
                    {isCancelled ? (
                        <Cancel width={90} height={90} />
                    ) : (
                        <Success width={90} height={90} />
                    )}
                </View>

                {/* Order ID + Status */}
                <View className="items-center mb-8">
                    <Text className="text-[28px] font-inter-bold text-[#222222] mb-1">
                        #{orderId || 'RX-9824'}
                    </Text>
                    <Text className="text-[15px] font-inter text-[#6A6A6A]">
                        {isCancelled ? 'Order Cancelled' : 'Ready for Dispatch'}
                    </Text>
                </View>

                {/* Info Card */}
                <View
                    className="bg-white rounded-[16px] px-5 py-2"
                    style={{ borderWidth: 1, borderColor: '#EFEFEF' }}
                >
                    {/* Customer Name */}
                    <View className="flex-row items-start py-4 border-b border-[#F0F0F0]">
                        <Person width={16} height={16} fill="#6A6A6A" style={{ marginTop: 2 }} />
                        <View className="ml-3">
                            <Text className="text-[13px] font-inter text-[#6A6A6A] mb-1">Customer Name</Text>
                            <Text className="text-[15px] font-inter-semibold text-[#222222]">
                                {customerName || 'Eleanor Fitzpatrick'}
                            </Text>
                        </View>
                    </View>

                    {/* Order Date & Time */}
                    <View className={`flex-row items-start py-4 ${isCancelled ? 'border-b border-[#F0F0F0]' : ''}`}>
                        <CalendarToday width={16} height={16} fill="#6A6A6A" style={{ marginTop: 2 }} />
                        <View className="ml-3">
                            <Text className="text-[13px] font-inter text-[#6A6A6A] mb-1">Order Date & Time</Text>
                            <Text className="text-[15px] font-inter-semibold text-[#222222]">
                                {orderDate || 'Apr 12, 2026 • 10:30 AM'}
                            </Text>
                        </View>
                    </View>

                    {/* Cancelled At — only if cancelled */}
                    {isCancelled && (
                        <View className="flex-row items-start py-4">
                            <CalendarToday width={16} height={16} fill="#6A6A6A" style={{ marginTop: 2 }} />
                            <View className="ml-3">
                                <Text className="text-[13px] font-inter text-[#6A6A6A] mb-1">Cancelled At</Text>
                                <Text className="text-[15px] font-inter-semibold text-[#222222]">
                                    {cancelledAt || 'Apr 12, 2026 • 4:45 PM'}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom + 16, 32) }}>
                <TouchableOpacity
                    className="w-full h-[56px] rounded-[16px] items-center justify-center"
                    style={{ backgroundColor: colors.brand.primary }}
                    activeOpacity={0.85}
                >
                    <Text className="text-white text-[16px] font-inter-semibold">
                        {isCancelled ? 'Cancel Dispatch' : 'Ready for Delivery'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OrderStatusView;
