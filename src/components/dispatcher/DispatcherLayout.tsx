import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DISPATCHED_ORDERS } from '@/src/constants/data';

// Sections
import DispatcherTabs from './sections/DispatcherTabs';
import DispatcherOrderCard from './sections/DispatcherOrderCard';
import CancelDispatchModal from './sections/CancelDispatchModal';
import ScanBanner from '../common/ScanBanner';

export const DispatcherLayout = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'dispatched' | 'pending'>('dispatched');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const insets = useSafeAreaInsets();

    const filteredOrders = activeTab === 'dispatched' ? DISPATCHED_ORDERS : [];

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-1 bg-[#F7F7F7]">
                {/* White top section */}
                <View className="bg-white px-5 pt-6 pb-6">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-[28px] font-inter-bold text-[#1A1A1A]">
                            Dispatcher
                        </Text>
                        {/* TEST BUTTONS — remove after testing */}
                        <View className="flex-row gap-x-2">
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/dispatcher/success', params: { orderId: 'RX-9824', totalItems: '10' } } as any)}
                                className="px-3 py-2 rounded-full"
                                style={{ backgroundColor: '#5F7C5B' }}
                            >
                                <Text className="text-white text-[12px] font-inter-medium">Success</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/dispatcher/order-status', params: { orderId: 'RX-9824', status: 'ready' } } as any)}
                                className="px-3 py-2 rounded-full"
                                style={{ backgroundColor: '#2EC07A' }}
                            >
                                <Text className="text-white text-[12px] font-inter-medium">Ready</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/dispatcher/order-status', params: { orderId: 'RX-9824', status: 'cancelled' } } as any)}
                                className="px-3 py-2 rounded-full"
                                style={{ backgroundColor: '#E74C3C' }}
                            >
                                <Text className="text-white text-[12px] font-inter-medium">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScanBanner
                        title="Scan the QR code to dispatch the order"
                        bgColor="#5F7C5B"
                        buttonBg="#4F6954"
                        buttonTextColor="#FFFFFF"
                    />
                </View>

                {/* Tabs */}
                <View className="bg-white px-5">
                    <DispatcherTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </View>

                {/* Orders list */}
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom + 80, 100) }}
                >
                    {activeTab === 'dispatched' ? (
                        <>
                            <View className="flex-row items-center justify-between mt-5 mb-4">
                                <Text className="text-[20px] font-inter-bold text-[#1A1A1A]">
                                    Dispatched Today
                                </Text>
                                <Text className="text-[18px] font-inter-bold text-[#1A1A1A]">
                                    ({filteredOrders.length})
                                </Text>
                            </View>

                            {filteredOrders.map((order) => (
                                <DispatcherOrderCard
                                    key={order.id}
                                    id={order.id}
                                    idDisplay={order.id_display}
                                    customerName={order.customerName}
                                    reviewedOn={order.reviewedOn}
                                    onPress={() => setShowCancelModal(true)}
                                />
                            ))}
                        </>
                    ) : (
                        <View className="py-20 items-center">
                            <Text className="text-[#6A6A6A] font-inter-medium text-[15px]">
                                No pending dispatches found
                            </Text>
                        </View>
                    )}
                </ScrollView>

                <CancelDispatchModal
                    isVisible={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={() => {
                        setShowCancelModal(false);
                        // TODO: handle cancel dispatch action
                    }}
                />
            </View>
        </SafeAreaView>
    );
};
