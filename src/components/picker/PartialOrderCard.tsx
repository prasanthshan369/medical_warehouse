import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Order } from '@/src/api/types';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';

interface PartialOrderCardProps {
    order: Order;
}


const PartialOrderCard: React.FC<PartialOrderCardProps> = ({ order }) => {
    const router = useRouter();
    const isAvailable = order.stockStatus === 'available';
    const HourglassTop = icons.hourglassTop;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
            className="p-5 rounded-2xl mb-4 border"
            style={{
                borderWidth: 1.5,
                backgroundColor: isAvailable ? colors.successBg : colors.partialBg,
                borderColor: isAvailable ? colors.successBorder : colors.partialBorder
            }}
        >
            {/* Header */}
            <View className="mb-0.5">
                <Text style={{ color: colors.textMain }} className="font-inter-bold text-[18px]">
                    {order.id}
                </Text>
            </View>

            <Text style={{ color: colors.textMain }} className="text-[13px] mb-4 font-inter">
                {order.date || 'No date'}
            </Text>
            {/* Out of stock meds */}
            <Text style={{ color: colors.textMain }} className="text-[14px] font-inter-medium mb-2">
                Out of stock meds
            </Text>

            <View className="flex-row flex-wrap mb-5">
                {order.outOfStockMeds?.map((med, index) => (
                    <View
                        key={index}
                        style={{ backgroundColor: isAvailable ? '#D1E5D8' : '#E9D6BF' }}
                        className="px-3.5 py-1.5 rounded-full mr-2 mb-2"
                    >
                        <Text style={{ color: colors.textMain }} className="text-[13px] font-inter-semibold">
                            {med}
                        </Text>
                    </View>
                ))}
            </View>
            {/* Footer */}
            <View className="flex-row justify-between items-center mt-auto">
                <Text style={{ color: colors.textMain }} className="text-[13px] font-inter">
                    {order.pickedCount ?? 0} of {order.totalCount ?? 0} Meds Picked
                </Text>

                {isAvailable ? (
                    <View className="flex-row items-center">
                        <Text style={{ color: colors.primary }} className="font-inter-semibold text-[16px] mr-1">
                            Stock Available
                        </Text>
                        <View className="flex-row">
                            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                            <Ionicons name="chevron-forward" size={14} color={colors.primary} style={{ marginLeft: -8 }} />
                        </View>
                    </View>
                ) : (
                    <View className="flex-row items-center">
                        <Text style={{ color: colors.textMain }} className="font-inter-medium text-[12px] mr-1.5">
                            Waiting for stock
                        </Text>
                        <HourglassTop width={10} height={13} fill={colors.textSecondary} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(PartialOrderCard);
