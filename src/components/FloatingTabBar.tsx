import { tabs } from '@/src/constants/data';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
    SharedValue,
    withTiming,
    Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const BAR_COLOR = '#222222';
const PILL_COLOR = '#FFFFFF';
const ACTIVE_ICON_COLOR = '#222222';
const INACTIVE_ICON_COLOR = '#969696';

const LIQUID_SPRING_CONFIG = {
    damping: 20,
    stiffness: 150,
    mass: 1,
};

const FOLLOWER_SPRING_CONFIG = {
    damping: 15,
    stiffness: 100,
    mass: 1.2,
};

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const FloatingTabBar = ({ state, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const leaderX = useSharedValue(state.index);
    const followerX = useSharedValue(state.index);
    const isInteracting = useSharedValue(0);

    const tabWidth = useMemo(() => {
        if (dimensions.width === 0) return 0;
        return (dimensions.width - 12) / state.routes.length;
    }, [dimensions.width, state.routes.length]);

    // Sync when system index changes (e.g. from swipe or button press elsewhere)
    useEffect(() => {
        if (isInteracting.value === 0) {
            leaderX.value = withSpring(state.index, LIQUID_SPRING_CONFIG);
            followerX.value = withSpring(state.index, FOLLOWER_SPRING_CONFIG);
        }
    }, [state.index]);

    const onLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        const isFirstLayout = dimensions.width === 0;
        setDimensions({ width, height });

        if (isFirstLayout) {
            leaderX.value = state.index;
            followerX.value = state.index;
        }
    };

    const navigateToTab = (index: number, showHaptic = true) => {
        const route = state.routes[index];
        if (route) {
            if (showHaptic) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            navigation.navigate(route.name);
        }
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-5, 5]) // Reduced threshold for "light" swipe
        .failOffsetY([-15, 15]) // Prevent vertical scroll from interference
        .onBegin(() => {
            isInteracting.value = 1;
        })
        .onUpdate((e) => {
            if (tabWidth > 0) {
                const rawIndex = (e.x - 6) / tabWidth;
                const clampedIndex = Math.max(0, Math.min(state.routes.length - 1, rawIndex));

                // FLUID MOVEMENT:
                // Pill follows 1:1 with finger during swipe
                leaderX.value = clampedIndex;
                followerX.value = withSpring(clampedIndex, FOLLOWER_SPRING_CONFIG);
            }
        })
        .onEnd(() => {
            const finalIndex = Math.min(state.routes.length - 1, Math.max(0, Math.round(leaderX.value)));

            // Snap correctly at end
            leaderX.value = withSpring(finalIndex, LIQUID_SPRING_CONFIG);
            followerX.value = withSpring(finalIndex, FOLLOWER_SPRING_CONFIG);

            runOnJS(navigateToTab)(finalIndex, true);
        })
        .onFinalize(() => {
            isInteracting.value = 0;
        });

    const tapGesture = Gesture.Tap()
        .onBegin(() => {
            isInteracting.value = 1;
        })
        .onEnd((e) => {
            if (tabWidth > 0) {
                const index = Math.floor((e.x - 6) / tabWidth);
                const finalIndex = Math.min(state.routes.length - 1, Math.max(0, index));

                leaderX.value = withSpring(finalIndex, LIQUID_SPRING_CONFIG);
                followerX.value = withSpring(finalIndex, FOLLOWER_SPRING_CONFIG);

                // Enable haptics only for direct tap presses
                runOnJS(navigateToTab)(finalIndex, true);
            }
        })
        .onFinalize(() => {
            isInteracting.value = 0;
        });

    const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

    const animatedPillStyle = useAnimatedStyle(() => {
        const start = Math.min(leaderX.value, followerX.value);
        const end = Math.max(leaderX.value, followerX.value);
        const stretch = (end - start) * tabWidth;

        return {
            transform: [
                { translateX: (start * tabWidth) + 6 },
                { scaleY: interpolate(stretch, [0, tabWidth], [1, 0.95], Extrapolation.CLAMP) }
            ],
            width: tabWidth + stretch,
            backgroundColor: PILL_COLOR,
            opacity: interpolate(isInteracting.value, [0, 1], [1, 0.9], Extrapolation.CLAMP),
        };
    });

    return (
        <View
            className="absolute bottom-4 left-0 right-0 items-center px-6"
            style={{ paddingBottom: insets.bottom > 0 ? 0 : 10 }}
        >
            <GestureDetector gesture={combinedGesture}>
                <AnimatedBlurView
                    intensity={80}
                    tint="dark"
                    onLayout={onLayout}
                    style={{
                        backgroundColor: BAR_COLOR,
                        overflow: 'hidden',
                        borderRadius: 35,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                    className="flex-row py-1.5 px-1.5 items-center w-full max-w-[450px] shadow-2xl"
                >
                    {/* Liquid White Pill Indicator */}
                    {dimensions.width > 0 && (
                        <Animated.View
                            style={[
                                animatedPillStyle,
                                {
                                    position: 'absolute',
                                    height: dimensions.height - 12,
                                    borderRadius: 30,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 6,
                                    elevation: 5,
                                }
                            ]}
                        >
                            {/* Water Drop Gloss / Specular Highlight */}
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 4,
                                    left: '15%',
                                    width: '25%',
                                    height: 3,
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    borderRadius: 10,
                                }}
                            />
                        </Animated.View>
                    )}

                    {state.routes.map((route, index) => {
                        const tab = tabs[index];
                        if (!tab) return null;

                        return (
                            <TabItem
                                key={route.key}
                                index={index}
                                icon={tab.icon}
                                label={tab.title}
                                followerX={followerX}
                            />
                        );
                    })}
                </AnimatedBlurView>
            </GestureDetector>
        </View>
    );
};

interface TabItemProps {
    icon: React.ComponentType<{ fill?: string; color?: string; width?: number; height?: number }>;
    index: number;
    label: string;
    followerX: SharedValue<number>;
}

const TabItem = ({ icon: Icon, index, label, followerX }: TabItemProps) => {
    const AnimatedIcon = useMemo(() => Animated.createAnimatedComponent(Icon), [Icon]);

    const animatedTextStyle = useAnimatedStyle(() => {
        const distance = Math.abs(followerX.value - index);

        // POINT-TO-POINT ZOOM & COLOR:
        // We use a tighter threshold so that the active state is more binary
        // but still glides liquidly between points.
        const scale = interpolate(distance, [0, 0.35], [1.3, 1], Extrapolation.CLAMP);
        const color = interpolateColor(distance, [0, 0.3], [ACTIVE_ICON_COLOR, INACTIVE_ICON_COLOR]);

        return {
            color,
            transform: [{ scale }],
            fontFamily: distance < 0.2 ? 'Inter_700Bold' : 'Inter_500Medium',
            fontSize: 10,
        };
    });

    const animatedIconProps = useAnimatedProps(() => {
        const distance = Math.abs(followerX.value - index);
        const color = interpolateColor(distance, [0, 0.3], [ACTIVE_ICON_COLOR, INACTIVE_ICON_COLOR]);
        return {
            fill: color,
            color: color
        };
    });

    return (
        <View className="flex-1 items-center justify-center py-2 h-full z-10">
            <Animated.View style={[{ alignItems: 'center' }]}>
                <AnimatedIcon
                    width={22}
                    height={22}
                    animatedProps={animatedIconProps}
                />
                <AnimatedText
                    className="mt-1 font-inter"
                    style={animatedTextStyle}
                >
                    {label}
                </AnimatedText>
            </Animated.View>
        </View>
    );
};

export default FloatingTabBar;
