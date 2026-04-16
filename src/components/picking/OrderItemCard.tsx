import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrderItem } from '@/src/api/types';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';

interface OrderItemCardProps {
    item: OrderItem;
    onToggleStatus: (id: string, status: 'pending' | 'partial' | 'completed') => void;
    onPartialPress?: (item: OrderItem) => void;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item, onToggleStatus, onPartialPress }) => {
    const isCompleted = item.status === 'completed';
    const isPartial = item.status === 'partial';
    const Edit = icons.edit;

    const getCardStyles = () => {
        if (isCompleted) return { backgroundColor: colors.successBg, borderColor: colors.successBorder };
        if (isPartial) return { backgroundColor: colors.partialBg, borderColor: colors.partialBorder };
        return { backgroundColor: 'white', borderColor: colors.borderLight };
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
                if (isPartial && onPartialPress) {
                    onPartialPress(item);
                } else {
                    onToggleStatus(item.id, isCompleted ? 'pending' : 'completed');
                }
            }}
            className="p-5 rounded-2xl mb-4 border shadow-[#00000005]"
            style={[{ borderWidth: 1.5 }, getCardStyles()]}
        >
            <View className="flex-row justify-between">
                <View className="flex-1">
                    <Text style={{ color: colors.textMain }} className="font-inter-bold text-[18px] mb-1">{item.name}</Text>
                    <Text style={{ color: colors.textSecondary }} className="text-[14px] mb-3 font-inter">{item.manufacturer}</Text>

                    <View className="flex-row items-center mb-2">
                        <View
                            style={{ backgroundColor: isCompleted ? '#B3DBC2' : isPartial ? '#E9D6BF' : colors.bgGray }}
                            className="px-3 py-1.5 rounded-lg mr-2"
                        >
                            <Text style={{ color: isCompleted ? colors.textMain : isPartial ? colors.textMain : colors.textSecondary }} className="text-[12px] font-inter-semibold">Batch No: {item.batchNo}</Text>
                        </View>
                        <View
                            style={{ backgroundColor: isCompleted ? '#B3DBC2' : isPartial ? '#E9D6BF' : colors.bgGray }}
                            className="px-3 py-1.5 rounded-lg"
                        >
                            <Text style={{ color: isCompleted ? colors.textMain : isPartial ? colors.textMain : colors.textSecondary }} className="text-[12px] font-inter-semibold">EXP {item.expiryDate}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-baseline">
                        <Text
                            style={isPartial ? { color: '#C5974E' } : undefined}
                            className={`text-[47px] font-inter-bold ${!isPartial ? 'text-primary' : ''}`}
                        >
                            {isPartial ? item.pickedQty : item.requiredQty}
                        </Text>
                        <Text style={{ color: colors.textMain }} className="text-[14px] font-inter-medium ml-2">
                            {isPartial ? `of ${item.requiredQty} Units Picked` : `Unit${item.requiredQty > 1 ? 's' : ''} Required`}
                        </Text>
                    </View>

                    {item.description && (
                        <Text style={{ color: colors.textMain }} className="text-[10px] font-inter-medium mt-1">
                            {item.description}
                        </Text>
                    )}
                </View>

                <View className="items-end justify-between">
                    <TouchableOpacity
                        onPress={() => {
                            if (isPartial && onPartialPress) {
                                onPartialPress(item);
                            } else {
                                onToggleStatus(item.id, isCompleted ? 'pending' : 'completed');
                            }
                        }}
                    >
                        {isCompleted ? (
                            <View style={{ backgroundColor: colors.primary }} className="rounded-md p-0.5">
                                <Ionicons name="checkmark" size={20} color="white" />
                            </View>
                        ) : isPartial ? (
                            <Edit width={18} height={18} fill={colors.textMain} />
                        ) : (
                            <View style={{ borderColor: colors.primary }} className="w-6 h-6 border-2 rounded-md" />
                        )}
                    </TouchableOpacity>

                    {!isCompleted && !isPartial && (
                        <TouchableOpacity
                            onPress={() => {
                                if (onPartialPress) {
                                    onPartialPress(item);
                                } else {
                                    onToggleStatus(item.id, 'partial');
                                }
                            }}
                            style={{ backgroundColor: colors.bgGray }}
                            className="px-6 py-2 rounded-full"
                        >
                            <Text className="text-[14px] font-inter-semibold text-[#222222]">
                                Partial
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(OrderItemCard);
