import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';
import { PACKED_ORDERS } from '@/src/constants/data';
import PackedOrderCard from './PackedOrderCard';

const PackerView = () => {
    const router = useRouter();
    const ScanIcon = icons.scan_icon;

    // Show first 10 on the main screen (scrollable)
    const previewOrders = PACKED_ORDERS.slice(0, 10);

    return (
        <View className="flex-1">
            {/* Top Section - White Background */}
            <View className="bg-white px-5 pt-4 pb-8">
                {/* Header */}
                <Text className="text-[22px] font-inter-bold mb-6" style={{ color: colors.textMain }}>
                    Packer
                </Text>

                {/* Scan Banner */}
                <View className="bg-[#DE8181] rounded-[12px] flex-row items-center p-6">
                    <View className="flex-1 mr-4">
                        <ScanIcon width={100} height={100} />
                    </View>
                    <View className="flex-[1.5]">
                        <Text className="text-white text-[14px] font-inter-medium leading-5 mb-4">
                            Scan the QR code to fetch order details
                        </Text>
                        <TouchableOpacity
                            className="bg-[#B26868] py-3 px-6 rounded-full self-start"
                            activeOpacity={0.8}
                            onPress={() => router.push('/scanner')}
                        >
                            <Text className="text-white font-inter-semibold text-[16px]">
                                Start Scan
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Bottom Section - Gray Background */}
            <View className="flex-1 bg-[#F8F8F8]">
                {/* Fixed Header with View All */}
                <View className="px-5 pt-6 pb-2">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-[18px] font-inter-semibold" style={{ color: colors.textMain }}>
                            Packed Orders
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/packer/all-orders')}
                        >
                            <Text className="text-[14px] font-inter-medium" style={{ color: colors.textMain }}>
                                View all
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[14px] font-inter mb-1" style={{ color: colors.textSecondary }}>
                        Today
                    </Text>
                </View>

                {/* Scrollable Orders List */}
                <ScrollView
                    className="flex-1 px-5"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {previewOrders.map((order) => (
                        <PackedOrderCard key={order.id} order={order} />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

export default PackerView;
