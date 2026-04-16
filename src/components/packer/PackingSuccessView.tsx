import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';

const PackingSuccessView = () => {
    const router = useRouter();
    const { orderId, totalItems } = useLocalSearchParams();

    const Checkmark = icons.checkmarkPure;
    const Scan = icons.scan;

    return (
        <View className="flex-1 bg-[#F9F9F9] items-center px-6">
            <View className="flex-1 justify-center items-center w-full">
                {/* Success Icon */}
                <View
                    className="w-32 h-32 rounded-full bg-[#D8EFE6] items-center justify-center mb-8"
                >
                    <View
                        className="w-20 h-20 rounded-full bg-[#2EC07A] items-center justify-center"
                    >
                        <Checkmark width={40} height={40} fill="white" />
                    </View>
                </View>

                {/* Celebration Text */}
                <Text className="text-[24px] font-inter-bold mb-2 text-center" style={{ color: colors.textMain }}>
                    Order Packing Completed
                </Text>
                <Text className="text-[16px] font-inter mb-12 text-center" style={{ color: colors.textSecondary }}>
                    All items verified and packed
                </Text>

                {/* Info Card */}
                <View className="w-full bg-white rounded-[20px] shadow-[#00000005] p-6 border border-[#E6E6E6]">
                    <View className="flex-row justify-between mb-4 pb-4 border-b border-[#0000000D]">
                        <Text className="text-[14px] font-inter-medium" style={{ color: colors.textSecondary }}>Order ID</Text>
                        <Text className="text-[14px] font-inter-medium" style={{ color: colors.textMain }}>#{orderId}</Text>
                    </View>
                    <View className="flex-row justify-between mb-4 pb-4 border-b border-[#0000000D]">
                        <Text className="text-[14px] font-inter-medium" style={{ color: colors.textSecondary }}>Total Items</Text>
                        <Text className="text-[14px] font-inter-medium" style={{ color: colors.textMain }}>{totalItems}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-[14px] font-inter-medium" style={{ color: colors.textSecondary }}>Packed on</Text>
                        <Text className="text-[14px] font-inter-medium" style={{ color: colors.textMain }}>Oct 12, 02:30 AM</Text>
                    </View>
                </View>
            </View>

            {/* Bottom Actions */}
            <View className="w-full pb-10">
                <TouchableOpacity
                    className="h-[56px] rounded-[24px] flex-row items-center justify-center mb-6"
                    style={{ backgroundColor: colors.primary }}
                    onPress={() => router.replace('/scanner' as any)}
                >
                    <View className="mr-3">
                        <Scan width={20} height={20} fill="white" />
                    </View>
                    <Text className="text-white text-[16px] font-inter-semibold">Scan Next Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center"
                    onPress={() => router.replace('/(tabs)/packer' as any)}
                >
                    <Text className="text-[16px] font-inter-semibold" style={{ color: colors.textSecondary }}>Back to Packer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PackingSuccessView;
