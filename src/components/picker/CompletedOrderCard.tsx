import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Order } from '@/src/api/types';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';

interface CompletedOrderCardProps {
    order: Order;
}

const CompletedOrderCard: React.FC<CompletedOrderCardProps> = ({ order }) => {
    const router = useRouter();
    const ArrowForward = icons.arrowForward;
    const Person = icons.person;
    const Clock = icons.creditCardClock;
    const CheckCircle = icons.checkCircle;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/completed/[id]', params: { id: order.id } })}
            style={{
                backgroundColor: 'white',
                borderColor: colors.border,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 1
            }}
            className="p-5 rounded-2xl mb-4 border"
        >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-inter-bold text-textMain text-[18px]">
                    #{order.id}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-[14px] font-inter">
                    {order.totalItems ?? 0} Items picked
                </Text>
            </View>

            {/* Divider */}
            <View style={{ backgroundColor: colors.borderLight }} className="h-[1px] mb-5" />

            {/* Detail Rows */}
            <View>
                <View className="space-y-4">
                    {/* Name */}
                    <View className="flex-row items-start py-2">
                        <View className="mt-0.5 mr-3">
                            <Person width={16} height={16} fill={colors.textSecondary} />
                        </View>
                        <View>
                            <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter-medium mb-0.5">Customer Name</Text>
                            <Text style={{ color: colors.textMain }} className="text-[15px] font-inter-medium">{order.customerName || 'N/A'}</Text>
                        </View>
                    </View>

                    {/* Order Date & Time */}
                    <View className="flex-row items-start py-2">
                        <View className="mt-0.5 mr-3">
                            <Clock width={16} height={16} fill={colors.textSecondary} />
                        </View>
                        <View>
                            <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter-medium mb-0.5">Order Date & Time</Text>
                            <Text style={{ color: colors.textMain }} className="text-[15px] font-inter-medium">{order.date || 'N/A'}</Text>
                        </View>
                    </View>

                    {/* Completion Date */}
                    <View className="flex-row items-start py-2">
                        <View className="mt-0.5 mr-3">
                            <CheckCircle width={16} height={16} fill={colors.textSecondary} />
                        </View>
                        <View>
                            <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter-medium mb-0.5">Completion Date</Text>
                            <Text style={{ color: colors.textMain }} className="text-[15px] font-inter-medium">{order.completionDate || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Arrow */}
                <View style={{ backgroundColor: colors.bgGray }} className="absolute bottom-1 right-0 w-10 h-10 rounded-xl items-center justify-center">
                    <ArrowForward width={16} height={16} fill={colors.textSecondary} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(CompletedOrderCard);
