import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme/colors';
import { PACKED_ORDERS } from '@/src/constants/data';

// Sections
import PackedOrderCard from './sections/PackedOrderCard';
import ScanBanner from '../common/ScanBanner';

export const PackerLayout = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const previewOrders = PACKED_ORDERS.slice(0, 10);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-1 bg-[#F7F7F7]">
                {/* White top section */}
                <View className="bg-white px-5 pt-6 pb-6">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text style={{ color: colors.text.DEFAULT }} className="text-[28px] font-inter-bold">
                            Packer
                        </Text>
                        {/* TEST BUTTON — remove after testing */}
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/packer/success', params: { orderId: 'RX-7721', totalItems: '10' } } as any)}
                            className="bg-brand-primary px-4 py-2 rounded-full"
                            style={{ backgroundColor: colors.brand.primary }}
                        >
                            <Text className="text-white text-[13px] font-inter-medium">Test Success</Text>
                        </TouchableOpacity>
                    </View>
                    <ScanBanner
                        title="Scan the QR code to fetch order details"
                        bgColor="#DE8181"
                        buttonBg="#B26868"
                    />
                </View>

                {/* Gray orders section */}
                <View className="flex-1">
                    <View className="px-5 pt-5 pb-3 flex-row items-center justify-between">
                        <View>
                            <Text style={{ color: colors.text.DEFAULT }} className="text-[20px] font-inter-bold">
                                Packed Orders
                            </Text>
                            <Text style={{ color: colors.text.secondary }} className="text-[14px] font-inter mt-0.5">
                                Today
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/packer/all-orders')}>
                            <Text style={{ color: colors.text.secondary }} className="text-[14px] font-inter-medium">
                                View all
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* White list container */}
                    <View className="flex-1  mx-5 rounded-[16px] overflow-hidden">
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 100, 100) }}
                        >
                            {previewOrders.map((order, index) => (
                                <PackedOrderCard
                                    key={order.id}
                                    order={order}
                                    isLast={index === previewOrders.length - 1}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};
