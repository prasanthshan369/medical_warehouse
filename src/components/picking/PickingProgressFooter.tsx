import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { colors } from '@/src/constants/colors';

interface PickingProgressFooterProps {
    totalItems: number;
    pickedItems: number;
    isAnyPartial: boolean;
    onMainPress: () => void;
}

const PickingProgressFooter: React.FC<PickingProgressFooterProps> = ({
    totalItems,
    pickedItems,
    isAnyPartial,
    onMainPress
}) => {
    const progress = totalItems > 0 ? (pickedItems / totalItems) * 100 : 0;
    const isReadyForPacker = pickedItems === totalItems && !isAnyPartial;
    const isPartialAction = isAnyPartial || (pickedItems > 0 && pickedItems < totalItems);

    const animatedProgress = useSharedValue(progress);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 400,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
    }, [progress]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedProgress.value}%`,
        };
    });

    const getButtonStyles = () => {
        if (isReadyForPacker) return { backgroundColor: colors.primary };
        if (isPartialAction) return { backgroundColor: colors.warning };
        return { backgroundColor: colors.bgGray };
    };

    return (
        <View style={{ backgroundColor: 'white', borderTopColor: colors.borderLight }} className="px-5 pt-4 pb-10 border-t">
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-[12px] text-textSecondary font-inter">Picking Progress</Text>
                <Text style={{ color: colors.textMain }} className="text-[14px] font-inter-medium">
                    Items {pickedItems.toString().padStart(2, '0')}/{totalItems.toString().padStart(2, '0')}
                </Text>
            </View>

            {/* Progress Bar Container */}
            <View style={{ backgroundColor: colors.bgGray }} className="h-[3px] rounded-full mb-8 overflow-hidden">
                <Animated.View
                    style={[animatedStyle, { backgroundColor: colors.blueInfo }]}
                    className="h-full rounded-full"
                />
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onMainPress}
                style={[getButtonStyles()]}
                className="w-full py-5 rounded-full items-center"
            >
                <Text className={`text-[16px] font-inter-semibold ${isReadyForPacker || isPartialAction ? 'text-white' : 'text-black/20'
                    }`}>
                    {isPartialAction ? 'Mark as Partial' : 'Move to Packer'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default React.memo(PickingProgressFooter);
