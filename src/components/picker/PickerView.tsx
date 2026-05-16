import React, { useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import PickerTabs from './PickerTabs';
import { NewOrdersTab, PartialOrdersTab, CompletedOrdersTab } from './tabs/OrderTabs';
import { OrderSkeletonList } from './OrderSkeleton';
import { useOrderStore } from '@/src/store/useOrderStore';
import { useOrdersQuery } from '../../hooks/useOrders';
import { usePickerScroll } from '../../hooks/usePickerScroll';

const PickerView = () => {
    const { activeTab, setActiveTab } = useOrderStore();
    const { data: orders = [], isLoading, isError, error, refetch } = useOrdersQuery();
    const { width } = useWindowDimensions();
    const { scrollX, scrollRef, scrollHandler } = usePickerScroll(activeTab, setActiveTab, width);

    const newOrders = useMemo(() => orders.filter(o => o.status === 'new'), [orders]);
    const partialOrders = useMemo(() => orders.filter(o => o.status === 'partial'), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => o.status === 'completed'), [orders]);

    const handleRefresh = async () => {
        try {
            await refetch();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {
            console.error('Failed to refresh orders:', e);
        }
    };

    const renderContent = (content: React.ReactNode) => {
        if (isLoading && !orders.length) return <OrderSkeletonList />;
        if (isError) {
            return (
                <View className="py-20 items-center px-10" style={{ width }}>
                    <Text className="text-red-500 font-inter-medium text-center">
                        {(error as any)?.message || 'Failed to load orders'}
                    </Text>
                </View>
            );
        }
        return content;
    };

    const refreshProps = { onRefresh: handleRefresh, refreshing: isLoading && orders.length > 0 };

    return (
        <View className="flex-1 bg-white">
            <View className="px-5 py-6 bg-white flex-row justify-between items-center">
                <Text className="text-[28px] font-inter-bold text-[#222222] tracking-tighter">
                    Picker
                </Text>
            </View>

            <View className="bg-white">
                <PickerTabs scrollX={scrollX} viewportWidth={width} />
            </View>

            <View className="flex-1 bg-[#F9F9F9]">
                <Animated.ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    className="flex-1"
                >
                    <View style={{ width }}>
                        {renderContent(<NewOrdersTab orders={newOrders} {...refreshProps} />)}
                    </View>
                    <View style={{ width }}>
                        {renderContent(<PartialOrdersTab orders={partialOrders} {...refreshProps} />)}
                    </View>
                    <View style={{ width }}>
                        {renderContent(<CompletedOrdersTab orders={completedOrders} {...refreshProps} />)}
                    </View>
                </Animated.ScrollView>
            </View>
        </View>
    );
};

export default PickerView;
