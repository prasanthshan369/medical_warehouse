import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNetworkStore } from '@/src/store/useNetworkStore';
import { requestQueue } from '@/src/utils/requestQueue';
import axiosInstance from '@/src/api/client';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NetworkToast = () => {
    const { isConnected, isInternetReachable, setIsConnected } = useNetworkStore();
    const [isLoading, setIsLoading] = useState(false);
    const translateY = useRef(new Animated.Value(300)).current;
    
    // State for the stepped Wi-Fi animation (1-4 bars)
    const [signalStep, setSignalStep] = useState(1);

    const showToast = isConnected === false || isInternetReachable === false;
    const isLowNetwork = isConnected === true && isInternetReachable === false;

    useEffect(() => {
        if (showToast) {
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
    }, [showToast]);

    // Handle the stepped signal animation when in Low Network state
    useEffect(() => {
        let interval: any = null;
        
        if (isLowNetwork) {
            interval = setInterval(() => {
                setSignalStep(prev => (prev >= 4 ? 1 : prev + 1));
            }, 400); // 400ms feels premium and calm
        } else {
            setSignalStep(1);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLowNetwork]);

    const handleRefresh = async () => {
        setIsLoading(true);

        // Add a slight delay to show the spinner (premium feel)
        await new Promise(resolve => setTimeout(resolve, 800));

        const state = await NetInfo.refresh();
        const connected = state.isConnected; // Preserve null if status is unknown
        const reachable = state.isInternetReachable;

        setIsConnected(connected, reachable);

        if (connected === true && reachable === true) {
            requestQueue.process(axiosInstance);
        } else {
            setIsLoading(false);
        }
    };

    const getMessage = () => {
        if (isConnected === false) return "Internet connection lost";
        if (isInternetReachable === false) return "Low network connection";
        return "";
    };

    return (
        <Animated.View
            pointerEvents={showToast ? 'auto' : 'none'}
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
                        <View className="flex-row items-center flex-1">
                            <Text className="text-white text-base font-inter-Medium">
                                {getMessage()}
                            </Text>
                        </View>

                        {isLowNetwork ? (
                            <View className="ml-4">
                                <MaterialCommunityIcons 
                                    name={`wifi-strength-${signalStep}` as any} 
                                    size={22} 
                                    color="#10B981" 
                                />
                            </View>
                        ) : (
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
                        )}
                    </>
                )}
            </View>
        </Animated.View>
    );
};

export default NetworkToast;
