import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/useAuthStore';
import { USER_DATA } from '@/src/constants/data';


import { useNotificationStore } from '@/src/store/useNotificationStore';
import * as Haptics from 'expo-haptics';

const DashboardHeader = () => {
    const { user } = useAuthStore();
    const { addNotification } = useNotificationStore();
    const displayName = user?.profile?.firstName || user?.email?.split('@')[0] || 'Picker';

    const simulateNewOrder = () => {
        const orderId = `RX-${Math.floor(1000 + Math.random() * 9000)}`;
        addNotification({
            title: 'New Order Received',
            message: `Order #${orderId} has been added to the picking queue.`,
            type: 'success',
            orderId: orderId,
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <View className="flex-row items-center justify-between mb-8 mt-6">
            <View>
                <Text className="text-[28px] text-[#1A1A1A] leading-tight font-inter-bold tracking-tight">
                    Welcome, {displayName}
                </Text>
                <Text className="text-sm text-[#6A6A6A] mt-1.5 font-inter-medium">
                    Shift • {USER_DATA.shift}
                </Text>
            </View>
            <TouchableOpacity
                onPress={simulateNewOrder}
                activeOpacity={0.7}
                className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-black/5"
            >
                <Ionicons name="notifications" size={22} color="#1A1A1A" />
            </TouchableOpacity>
        </View>
    );
};

export default DashboardHeader;
