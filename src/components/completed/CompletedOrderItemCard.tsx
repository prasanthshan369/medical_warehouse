import React from 'react';
import { View, Text } from 'react-native';
import { OrderItem } from '@/src/api/types';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';

interface CompletedOrderItemCardProps {
    item: OrderItem;
}

const CompletedOrderItemCard: React.FC<CompletedOrderItemCardProps> = ({ item }) => {
    const Pill = icons.pill;

    return (
        <View
            className="flex-row items-center bg-white p-4 rounded-2xl mb-3 border"
            style={{
                borderColor: colors.borderLight,
            }}
        >
            {/* Medication Icon */}
            <View
                className="w-10 h-10 rounded-full bg-[#F0F0F0] items-center justify-center mr-4"
            >
                <Pill width={20} height={20} fill="#222222" />
            </View>

            {/* Info Section */}
            <View className="flex-1">
                <Text style={{ color: colors.textMain }} className="font-inter-semibold text-[15px] mb-0.5">
                    {item.name}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-[14px] font-inter">
                    {item.manufacturer}
                </Text>
            </View>

            {/* Quantity Badge */}
            <View className="bg-[#F0F0F0] px-3.5 py-1.5 rounded-full">
                <Text style={{ color: colors.textMain }} className="font-inter-semibold text-[12px]">
                    {item.requiredQty} Units
                </Text>
            </View>
        </View>
    );
};

export default React.memo(CompletedOrderItemCard);
