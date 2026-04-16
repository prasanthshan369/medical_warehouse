import React from 'react';
import { View } from 'react-native';
import Skeleton from '../common/Skeleton';

const OrderSkeleton = () => {
    return (
        <View 
            className="flex-row items-center justify-between bg-white p-5 rounded-2xl mb-4 border border-black/5"
            style={{ 
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2
            }}
        >
            <View className="flex-1">
                {/* Order ID shimmer */}
                <Skeleton width={120} height={22} borderRadius={6} style={{ marginBottom: 8 }} />
                
                {/* Items summary shimmer */}
                <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 16 }} />
                
                {/* Time ago shimmer */}
                <Skeleton width={80} height={14} borderRadius={4} />
            </View>
            
            {/* Arrow icon placeholder */}
            <View className="ml-4 w-5 h-5 rounded-full bg-[#F2F2F2]" />
        </View>
    );
};

export const OrderSkeletonList = () => (
    <View className="px-5">
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
    </View>
);

export default OrderSkeleton;
