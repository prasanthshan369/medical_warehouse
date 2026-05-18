import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Order } from '@/src/types/order.types';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/theme/colors';
import TimeAgo from '../../common/TimeAgo';
import { useFulfillmentActions } from '@/src/hooks/useFulfillment';

interface OrderCardProps {
    order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const router = useRouter();
    const { claim, isClaiming } = useFulfillmentActions();

    const handlePress = async () => {
        try {
            const lock = await claim(order.id);
            router.push({ pathname: '/order/[id]', params: { id: order.id, expiresAt: lock.expiresAt } });
        } catch {
            // error notification handled inside useFulfillmentActions
        }
    };

    const ArrowForward = icons.arrowForward;
    const medicineImages = order.images || [];

    // Helper to render the image grid (up to 4 images)
    const renderImageGrid = () => {
        if (medicineImages.length === 0) {
            return (
                <View
                    style={{ backgroundColor: colors.surface.gray }}
                    className="w-28 h-28 rounded-xl items-center justify-center"
                >
                    <icons.picker width={24} height={24} stroke={colors.text.muted} />
                </View>
            );
        }

        // Always use a 2x2 grid layout if more than 1 image
        const showGrid = medicineImages.length > 1;
        const displayImages = medicineImages.slice(0, 4);

        return (
            <View className="w-28 h-28 flex-row flex-wrap justify-between content-between">
                {displayImages.map((img, idx) => (
                    <View 
                        key={idx}
                        style={{ 
                            width: showGrid ? '48%' : '100%', 
                            height: displayImages.length > 2 ? '48%' : '100%',
                            marginBottom: showGrid && idx < 2 ? '4%' : 0,
                            borderRadius: 6,
                            overflow: 'hidden',
                            backgroundColor: colors.surface.gray
                        }}
                    >
                        <Image
                            source={{ uri: img }}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                        />
                    </View>
                ))}
            </View>
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            disabled={isClaiming}
            className="flex-row items-center bg-white p-5 rounded-2xl mb-4 border"
            style={{
                borderColor: colors.border.light,
            }}
        >   
            {/* Left: Image Grid */}
            <View className="mr-5">
                {renderImageGrid()}
            </View>

            {/* Middle: Order Info */}
            <View className="flex-1">
                <View className="flex-row items-center mb-1">
                    <Text style={{ color: colors.text.DEFAULT }} className="font-inter-bold text-[20px]">
                        Order #{order.orderId || order.id.slice(0, 8)}
                    </Text>
                </View>
                <Text
                    style={{ color: colors.text.secondary }}
                    className="font-inter-medium text-[16px] mb-3"
                    numberOfLines={1}
                >
                    {order.medicineSlug}
                </Text>
                <View className="flex-row items-center">
                    <TimeAgo
                        date={order.date || ''}
                        style={{ color: colors.text.muted }}
                        className="font-inter text-[14px]"
                    />
                </View>
            </View>

            {/* Right: Action Arrow */}
            <View className="ml-2">
                <ArrowForward width={18} height={18} fill={colors.text.muted} />
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(OrderCard);
