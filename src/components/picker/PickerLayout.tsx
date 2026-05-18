import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Animated, Easing, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AnimatedRN from 'react-native-reanimated';
import { icons } from '@/src/constants/icons';
import colors from '@/src/theme/colors';

// Sections
import PickerTabs from './sections/PickerTabs';
import { NewOrdersTab, PartialOrdersTab, CompletedOrdersTab } from './sections/OrderTabs';
import { OrderSkeletonList } from './sections/OrderSkeleton';

// Hooks & Stores
import { useOrderStore } from '@/src/store/useOrderStore';
import { useOrdersQuery } from '@/src/hooks/useOrders';
import { usePickerScroll } from '@/src/hooks/usePickerScroll';

const SEARCH_HEIGHT = 80;

export const PickerLayout = () => {
    const { activeTab, setActiveTab } = useOrderStore();
    const { data: orders = [], isLoading, isError, error, refetch } = useOrdersQuery();
    const { width } = useWindowDimensions();
    const { scrollX, scrollRef, scrollHandler } = usePickerScroll(activeTab, setActiveTab, width);

    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const heightAnim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<any>(null);

    const SearchIcon = icons.search_dark;
    const SearchInner = icons.search;
    const SwapVert = icons.swapVert;

    useEffect(() => {
        Animated.timing(heightAnim, {
            toValue: showSearch ? SEARCH_HEIGHT : 0,
            duration: 300,
            easing: showSearch ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
            useNativeDriver: false,
        }).start();
        if (showSearch) {
            setTimeout(() => inputRef.current?.focus(), 120);
        } else {
            setSearchQuery('');
        }
    }, [showSearch]);

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
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-1 bg-white">

                {/* Header */}
                <View className="px-5 py-6 bg-white flex-row justify-between items-center">
                    <Text className="text-[28px] font-inter-bold text-[#222222] tracking-tighter">
                        Picker
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowSearch(prev => !prev)}
                        activeOpacity={0.7}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: showSearch ? colors.brand.primarySoft : colors.surface.gray,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <SearchIcon width={22} height={22} />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View className="bg-white">
                    <PickerTabs scrollX={scrollX} viewportWidth={width} />
                </View>

                {/* Search bar — lives OUTSIDE the horizontal pager */}
                <View style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
                    <Animated.View style={{ height: heightAnim }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 12, paddingHorizontal: 16, height: 48 }}>
                                <SearchInner width={22} height={22} stroke="#969696" />
                                <TextInput
                                    ref={inputRef}
                                    placeholder="Search order ID"
                                    placeholderTextColor="#969696"
                                    style={{ flex: 1, marginLeft: 12, color: '#222222', fontSize: 15, height: 48, backgroundColor: 'transparent' }}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>
                            <TouchableOpacity style={{ marginLeft: 12, padding: 8 }}>
                                <SwapVert width={24} height={24} fill="#6A6A6A" />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>

                {/* Horizontal pager */}
                <View className="flex-1 bg-[#F9F9F9]">
                    <AnimatedRN.ScrollView
                        ref={scrollRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        className="flex-1"
                    >
                        <View style={{ width }}>
                            {renderContent(<NewOrdersTab orders={newOrders} searchQuery={searchQuery} {...refreshProps} />)}
                        </View>
                        <View style={{ width }}>
                            {renderContent(<PartialOrdersTab orders={partialOrders} searchQuery={searchQuery} {...refreshProps} />)}
                        </View>
                        <View style={{ width }}>
                            {renderContent(<CompletedOrdersTab orders={completedOrders} searchQuery={searchQuery} {...refreshProps} />)}
                        </View>
                    </AnimatedRN.ScrollView>
                </View>

            </View>
        </SafeAreaView>
    );
};
