import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';
import AllPackedOrdersView from '@/src/components/packer/AllPackedOrdersView';

const AllPackedOrders = () => {
    const router = useRouter();
    const ArrowBack = icons.arrowBack;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowBack width={16} height={16} fill={colors.textMain} />
                </TouchableOpacity>
                <Text className="text-[18px] font-inter-bold" style={{ color: colors.textMain }}>
                    Packed Orders
                </Text>
            </View>

            {/* Content */}
            <AllPackedOrdersView />
        </SafeAreaView>
    );
};

export default AllPackedOrders;
