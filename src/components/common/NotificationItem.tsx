import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming, 
    runOnJS,
    Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { Notification, useNotificationStore } from '@/src/store/useNotificationStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/src/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const DISMISS_DURATION = 4000;

import { useRouter } from 'expo-router';
import { useOrderStore } from '@/src/store/useOrderStore';

interface Props {
    notification: Notification;
    index: number;
}

const NotificationItem: React.FC<Props> = ({ notification, index }) => {
    const router = useRouter();
    const removeNotification = useNotificationStore((state) => state.removeNotification);
    const setActiveTab = useOrderStore((state) => state.setActiveTab);
    
    // Animation Values
    const translateY = useSharedValue(-100);
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(0);
    const contextX = useSharedValue(0);
    const progress = useSharedValue(1);

    const onDismiss = useCallback(() => {
        removeNotification(notification.id);
    }, [notification.id]);

    const handlePress = useCallback(() => {
        // 1. Force state update for the Picker tab to 'new'
        setActiveTab('new');
        
        // 2. Navigate to the Picker tab screen
        router.push('/(tabs)/picker');
        
        // 3. Dismiss the notification after interaction
        onDismiss();
    }, [onDismiss, router, setActiveTab]);

    useEffect(() => {
        // Entrance animation: Smoother "Pouch" Pop
        translateY.value = withSpring(0, { 
            damping: 15, 
            stiffness: 120,
            mass: 1,
            velocity: 2
        });
        scale.value = withSpring(1, { 
            damping: 15, 
            stiffness: 120 
        });
        opacity.value = withTiming(1, { 
            duration: 500,
            easing: Easing.out(Easing.quad)
        });

        // Progress bar animation (countdown)
        progress.value = withTiming(0, { 
            duration: DISMISS_DURATION,
            easing: Easing.linear 
        });

        // Auto-dismiss timer matched to progress
        const timer = setTimeout(() => {
            // Smooth "Removal" animation
            translateY.value = withTiming(-120, { 
                duration: 400,
                easing: Easing.inOut(Easing.quad)
            });
            opacity.value = withTiming(0, { 
                duration: 300 
            }, () => {
                runOnJS(onDismiss)();
            });
        }, DISMISS_DURATION);

        return () => clearTimeout(timer);
    }, []);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            contextX.value = translateX.value;
        })
        .onUpdate((event) => {
            translateX.value = contextX.value + event.translationX;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                translateX.value = withTiming(
                    event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, 
                    { duration: 300, easing: Easing.out(Easing.quad) }, 
                    () => runOnJS(onDismiss)()
                );
            } else {
                translateX.value = withSpring(0, { damping: 20 });
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { scale: scale.value }
        ],
        opacity: opacity.value,
        zIndex: 1000 - index,
        // Ensure smoothness during layout changes
        position: translateY.value === -120 ? 'absolute' : 'relative',
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    const getTypeColor = () => {
        switch (notification.type) {
            case 'success': return '#117B3E';
            case 'error': return '#FF4D4D';
            case 'warning': return '#FFA500';
            default: return colors.primary;
        }
    };

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View 
                style={[animatedStyle]} 
                className="mx-4 mb-3 overflow-hidden rounded-2xl"
            >
                <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
                    <BlurView 
                        intensity={Platform.OS === 'ios' ? 40 : 100} 
                        tint="light"
                        className="flex-row items-center p-4 border border-white/40"
                        style={{
                            backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                        }}
                    >
                        <View 
                            style={{ backgroundColor: `${getTypeColor()}15` }}
                            className="w-11 h-11 rounded-full items-center justify-center mr-3.5"
                        >
                            <MaterialCommunityIcons 
                                name={notification.type === 'success' ? 'check-circle' : 'bell-ring'} 
                                size={26} 
                                color={getTypeColor()} 
                            />
                        </View>
                        
                        <View className="flex-1">
                            <Text className="font-inter-bold text-[16px] text-[#1A1A1A] mb-0.5">
                                {notification.title}
                            </Text>
                            <Text className="font-inter-medium text-[13px] text-[#666666] leading-5">
                                {notification.message}
                            </Text>
                        </View>

                        <TouchableOpacity 
                            onPress={(e) => {
                                e.stopPropagation();
                                onDismiss();
                            }}
                            className="bg-black/5 p-1.5 rounded-full"
                        >
                            <MaterialCommunityIcons name="close" size={14} color="#999999" />
                        </TouchableOpacity>

                        {/* Animated Progress Bar */}
                        <Animated.View 
                            style={[
                                progressStyle, 
                                { 
                                    backgroundColor: getTypeColor(),
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: 3,
                                    opacity: 0.6
                                }
                            ]} 
                        />
                    </BlurView>
                </TouchableOpacity>
            </Animated.View>
        </GestureDetector>
    );
};

export default NotificationItem;
