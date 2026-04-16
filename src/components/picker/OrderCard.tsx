import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Order } from '@/src/api/types';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';

interface OrderCardProps {
    order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const router = useRouter();

    const ArrowForward = icons.arrowForward;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
            className="flex-row justify-between bg-white p-5 rounded-2xl mb-4 border"
            style={{
                borderColor: colors.borderLight,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                elevation: 2
            }}
        >
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text style={{ color: colors.textMain }} className="font-inter-bold text-[18px]">
                        {order.id}
                    </Text>
                </View>
                <Text className="font-inter-medium text-[14px] mb-3 text-secondary">
                    {order.customerName}
                </Text>
                <View className="flex-row items-center mb-3">
                    <Text className="font-inter text-[12px] text-secondary">
                        {order.timeAgo}
                    </Text>
                </View>
            </View>

            <View className="justify-end pb-2">
                <ArrowForward width={20} height={20} fill={colors.textSecondary} />
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(OrderCard);
