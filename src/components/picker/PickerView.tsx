import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    runOnJS
} from 'react-native-reanimated';
import PickerTabs from './PickerTabs';
import { NewOrdersTab, PartialOrdersTab, CompletedOrdersTab } from './tabs/OrderTabs';
import { OrderSkeletonList } from './OrderSkeleton';
import { useOrderStore } from '@/src/store/useOrderStore';
import { OrderStatus } from '@/src/api/types';

const PickerView = () => {
    const { orders, activeTab, ordersLoading, ordersError, fetchOrders, setActiveTab } = useOrderStore();
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const scrollX = useSharedValue(0);
    const scrollRef = useRef<Animated.ScrollView>(null);
    const isManualScroll = useRef(false);

    useEffect(() => {
        fetchOrders();

    }, []);

    // Sync ScrollView position when activeTab changes (from button clicks)
    useEffect(() => {
        if (isManualScroll.current) {
            isManualScroll.current = false;
            return;
        }

        const index = ['new', 'partial', 'completed'].indexOf(activeTab);
        if (index !== -1) {
            scrollRef.current?.scrollTo({ x: index * width, animated: true });
        }
    }, [activeTab, width]);

    // Animated scroll handler to track scroll position in real-time
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
        onMomentumEnd: (event) => {
            const progress = event.contentOffset.x / width;
            const index = Math.round(progress);
            const statuses: OrderStatus[] = ['new', 'partial', 'completed'];
            const newStatus = statuses[index];

            if (newStatus && newStatus !== activeTab) {
                isManualScroll.current = true;
                runOnJS(setActiveTab)(newStatus);
            }
        }
    });

    const renderLoadingOrError = (tabWidth: number) => {
        if (ordersLoading && !orders.length) {
            return (
                <View className="px-5">
                    <OrderSkeletonList />
                </View>
            );
        }
        if (ordersError) {
            return (
                <View className="py-20 items-center" style={{ width: tabWidth }}>
                    <Text className="text-red-500 font-inter-medium">{ordersError}</Text>
                </View>
            );
        }
        return null;
    };

    // PERFORMANCE OPTIMIZATION: Memoize filtered arrays to prevent re-filtering on every frame
    const newOrders = useMemo(() => orders.filter(o => o.status === 'new'), [orders]);
    const partialOrders = useMemo(() => orders.filter(o => o.status === 'partial'), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => o.status === 'completed'), [orders]);

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 py-4 bg-white">
                <Text className="text-[22px] font-inter-bold text-[#222222] tracking-tighter">
                    Picker
                </Text>
            </View>

            {/* Tab Navigation with Shared scrollX */}
            <View className="bg-white">
                <PickerTabs scrollX={scrollX} viewportWidth={width} />
            </View>

            {/* Swipeable Content */}
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
                    {/* New Orders Page */}
                    <View style={{ width }}>
                        {renderLoadingOrError(width) || <NewOrdersTab orders={newOrders} />}
                    </View>

                    {/* Partial Orders Page */}
                    <View style={{ width }}>
                        {renderLoadingOrError(width) || <PartialOrdersTab orders={partialOrders} />}
                    </View>

                    {/* Completed Orders Page */}
                    <View style={{ width }}>
                        {renderLoadingOrError(width) || <CompletedOrdersTab orders={completedOrders} />}
                    </View>
                </Animated.ScrollView>
            </View>
        </View>
    );
};

export default PickerView;
