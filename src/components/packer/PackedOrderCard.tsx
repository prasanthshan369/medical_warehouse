import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';
import { Order } from '@/src/api/types';

interface PackedOrderCardProps {
    order: Order;
}

const PackedOrderCard: React.FC<PackedOrderCardProps> = ({ order }) => {
    const router = useRouter();
    const PersonIcon = icons.person;

    return (
        <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/completed/[id]', params: { id: order.id } })}
            className="bg-white rounded-[16px] border border-[#EEEEEE] flex-row items-center p-4 mb-3"
        >
            <View className="w-12 h-12 rounded-full items-center justify-center bg-[#F2F2F2] mr-4">
                <PersonIcon width={22} height={22} fill={colors.textSecondary} />
            </View>
            <View className="flex-1">
                <Text className="text-[17px] font-inter-semibold" style={{ color: colors.textMain }}>
                    {order.id}
                </Text>
                <Text className="text-[14px] font-inter" style={{ color: colors.textSecondary }}>
                    {order.customerName}
                </Text>
            </View>
            <Text className="text-[14px] font-inter" style={{ color: colors.textMain }}>
                {order.totalItems} Items
            </Text>
        </TouchableOpacity>
    );
};

export default PackedOrderCard;
