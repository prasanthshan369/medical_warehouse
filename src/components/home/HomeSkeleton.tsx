import React from 'react';
import { View } from 'react-native';
import Skeleton from '../common/Skeleton';

const HomeSkeleton = () => {
    return (
        <View className="mb-6">
            <View 
                style={{ borderRadius: 24, minHeight: 200 }}
                className="p-7 bg-[#F2F2F2] overflow-hidden"
            >
                {/* Title shimmer */}
                <Skeleton width={120} height={24} borderRadius={6} />

                {/* Main value shimmer */}
                <View className="mt-8 mb-4 flex-row items-baseline">
                    <Skeleton width={80} height={56} borderRadius={12} />
                    <Skeleton width={60} height={28} borderRadius={6} style={{ marginLeft: 10 }} />
                </View>

                {/* Detail rows shimmer */}
                <View className="gap-y-3 mt-auto">
                    <Skeleton width="70%" height={16} borderRadius={4} />
                    <Skeleton width="50%" height={16} borderRadius={4} />
                </View>

                {/* Large decorative circle sim */}
                <View 
                    style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
                    className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full opacity-50" 
                />
            </View>
        </View>
    );
};

export const HomeSkeletonList = () => (
    <View>
        <HomeSkeleton />
        <HomeSkeleton />
    </View>
);

export default HomeSkeleton;
