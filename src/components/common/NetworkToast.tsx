import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNetworkStore } from '@/src/store/useNetworkStore';
import { requestQueue } from '@/src/utils/requestQueue';
import axiosInstance from '@/src/api/client';

const { width } = Dimensions.get('window');

const NetworkToast = () => {
    const { isConnected, setIsConnected } = useNetworkStore();
    const [isLoading, setIsLoading] = useState(false);
    const translateY = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (isConnected === false) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 12,
                tension: 50
            }).start();
        } else {
            // If we become connected, hide the toast
            Animated.timing(translateY, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setIsLoading(false); // Reset loading state when hidden
            });
        }
    }, [isConnected]);

    const handleRefresh = async () => {
        setIsLoading(true);

        // Add a slight delay to show the spinner (premium feel)
        await new Promise(resolve => setTimeout(resolve, 800));

        const state = await NetInfo.refresh();
        const connected = !!state.isConnected && state.isInternetReachable !== false;

        setIsConnected(connected);

        if (connected) {
            requestQueue.process(axiosInstance);
        } else {
            setIsLoading(false);
        }
    };

    return (
        <Animated.View
            pointerEvents={isConnected === false ? 'auto' : 'none'}
            className="absolute left-0 right-0 items-center z-[1000000]"
            style={[{ bottom: 95, transform: [{ translateY }] }]}
        >
            <View className="bg-[#333333] flex-row items-center justify-between py-3 px-5 rounded-lg shadow-lg shadow-black/30"
                style={{ width: width * 0.94 }}>

                {isLoading ? (
                    <View className="flex-row items-center space-x-3 flex-1">
                        <ActivityIndicator size="small" color="#10B981" />
                        <Text className="text-white text-base font-inter-Medium ml-3">
                            Checking connection...
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text className="text-white text-base font-inter-Medium flex-1">
                            No internet connection
                        </Text>
                        <TouchableOpacity
                            onPress={handleRefresh}
                            disabled={isLoading}
                            className="ml-4 bg-white/10 py-1.5 px-4 rounded-md"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text className="text-[#10B981] text-base font-inter-Bold uppercase tracking-wider">
                                Refresh
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </Animated.View>
    );
};

export default NetworkToast;
