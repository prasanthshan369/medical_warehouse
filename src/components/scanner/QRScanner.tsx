import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    AppState,
    AppStateStatus,
    Linking,
    Platform,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,

} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCAN_SIZE = 260;

const QRScanner = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [manualId, setManualId] = useState('');
    const [isRequesting, setIsRequesting] = useState(false);

    const translateY = useSharedValue(0);
    const appStateRef = useRef(AppState.currentState);

    useEffect(() => {
        if (permission?.granted) {
            translateY.value = 0;
            translateY.value = withRepeat(
                withTiming(SCAN_SIZE, { duration: 2500, easing: Easing.linear }),
                -1,
                false
            );
        } else {
            cancelAnimation(translateY);
        }
        return () => cancelAnimation(translateY);
    }, [permission?.granted]);

    const animatedLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
            appStateRef.current = next;
        });
        return () => sub.remove();
    }, []);

    useFocusEffect(
        useCallback(() => {
            setScanned(false);
        }, [])
    );

    const handleRequestPermission = async () => {
        setIsRequesting(true);
        try {
            await requestPermission();
        } catch (e) {
            console.error('Permission error:', e);
        } finally {
            setIsRequesting(false);
        }
    };

    const handleOpenSettings = () => {
        Alert.alert(
            'Camera Access Required',
            'Enable camera access in Settings to scan QR codes.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Open Settings',
                    onPress: () =>
                        Platform.OS === 'ios'
                            ? Linking.openURL('app-settings:')
                            : Linking.openSettings(),
                },
            ]
        );
    };

    const handleBarCodeScanned = useCallback(
        ({ data }: { data: string }) => {
            if (scanned) return;
            setScanned(true);
            cancelAnimation(translateY);
            const cleanId = data.replace('#', '').trim();
            router.replace(`/packer/order-summary/${cleanId}` as any);
        },
        [scanned]
    );

    const handleManualSubmit = () => {
        const cleanId = manualId.replace('#', '').trim();
        if (cleanId) router.replace(`/packer/order-summary/${cleanId}` as any);
    };

    const Header = () => (
        <View style={{ paddingTop: insets.top + 10 }} className="px-6 pb-2">
            <Text className="text-white text-[16px] opacity-60 font-medium">scan</Text>
        </View>
    );

    const manualInputEl = (
        <View style={{ paddingBottom: Math.max(insets.bottom, 20) }} className="px-8">
            <View className="bg-[#4D4D4D] h-[64px] rounded-[12px] flex-row items-center px-5">
                <TextInput
                    className="flex-1 text-white text-[15px]"
                    placeholder="Enter Order ID manually"
                    placeholderTextColor="#8E8E8E"
                    value={manualId}
                    onChangeText={setManualId}
                    returnKeyType="go"
                    onSubmitEditing={handleManualSubmit}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={handleManualSubmit} activeOpacity={0.7}>
                    <Feather name="arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (!permission) {
        return (
            <View className="flex-1 bg-[#1A1A1A]">
                <StatusBar style="light" translucent />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <Header />
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                    {manualInputEl}
                </KeyboardAvoidingView>
            </View>
        );
    }

    if (!permission.granted && permission.canAskAgain) {
        return (
            <View className="flex-1 bg-[#1A1A1A]">
                <StatusBar style="light" translucent />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <Header />
                    <View className="flex-1 items-center justify-center px-10 gap-4">
                        <View className="w-[90px] h-[90px] rounded-full bg-white/10 items-center justify-center mb-2">
                            <MaterialIcons name="camera-alt" size={40} color="white" />
                        </View>
                        <Text className="text-white text-[20px] font-semibold text-center">Camera Access Needed</Text>
                        <Text className="text-white/55 text-[14px] text-center leading-[22px] mb-2">
                            Allow camera access to scan QR codes quickly.
                        </Text>
                        <TouchableOpacity
                            className="bg-white px-8 py-3.5 rounded-full flex-row items-center mt-2 w-full justify-center"
                            onPress={handleRequestPermission}
                            disabled={isRequesting}
                            activeOpacity={0.8}
                        >
                            {isRequesting ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <Text className="text-black text-[15px] font-semibold">Allow Camera Access</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.back()} className="py-3">
                            <Text className="text-white/45 text-[14px]">Go Back</Text>
                        </TouchableOpacity>
                    </View>
                    {manualInputEl}
                </KeyboardAvoidingView>
            </View>
        );
    }

    if (!permission.granted && !permission.canAskAgain) {
        return (
            <View className="flex-1 bg-[#1A1A1A]">
                <StatusBar style="light" translucent />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <Header />
                    <View className="flex-1 items-center justify-center px-10 gap-4">
                        <View className="w-[90px] h-[90px] rounded-full bg-[rgba(255,80,80,0.15)] items-center justify-center mb-2">
                            <MaterialIcons name="no-photography" size={40} color="#FF6B6B" />
                        </View>
                        <Text className="text-white text-[20px] font-semibold text-center">Camera Access Blocked</Text>
                        <Text className="text-white/55 text-[14px] text-center leading-[22px] mb-2">
                            Camera was denied. Enable it in your device Settings.
                        </Text>
                        <TouchableOpacity
                            className="bg-white px-8 py-3.5 rounded-full flex-row items-center mt-2 w-full justify-center"
                            onPress={handleOpenSettings}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="settings" size={18} color="#000" style={{ marginRight: 8 }} />
                            <Text className="text-black text-[15px] font-semibold">Open Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.back()} className="py-3">
                            <Text className="text-white/45 text-[14px]">Go Back</Text>
                        </TouchableOpacity>
                    </View>
                    {manualInputEl}
                </KeyboardAvoidingView>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#1A1A1A]">
            <StatusBar style="light" translucent />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <Header />

                <View className="flex-1 mx-4 mb-4 rounded-[40px] overflow-hidden bg-black">
                    <CameraView
                        style={StyleSheet.absoluteFill}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    />

                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        <View className="flex-1 bg-[rgba(0,0,0,0.55)]" />
                        <View style={{ height: SCAN_SIZE }} className="flex-row">
                            <View className="flex-1 bg-[rgba(0,0,0,0.55)]" />
                            <View style={{ width: SCAN_SIZE, height: SCAN_SIZE }} />
                            <View className="flex-1 bg-[rgba(0,0,0,0.55)]" />
                        </View>
                        <View className="flex-1 bg-[rgba(0,0,0,0.55)]" />
                    </View>

                    <View className="absolute inset-0 items-center justify-center">
                        <View className="bg-[#121212] px-5 py-2.5 rounded-[100px] mb-4">
                            <Text className="text-[#BEBEBE] text-[14px]">Align QR code within the frame</Text>
                        </View>

                        <View style={{ width: SCAN_SIZE + 40, height: SCAN_SIZE + 40 }} className="items-center justify-center">
                            <View className="absolute top-0 left-0 w-[50px] h-[50px] border-t-[5px] border-l-[5px] border-white rounded-tl-[30px]" />
                            <View className="absolute top-0 right-0 w-[50px] h-[50px] border-t-[5px] border-r-[5px] border-white rounded-tr-[30px]" />
                            <View className="absolute bottom-0 left-0 w-[50px] h-[50px] border-b-[5px] border-l-[5px] border-white rounded-bl-[30px]" />
                            <View className="absolute bottom-0 right-0 w-[50px] h-[50px] border-b-[5px] border-r-[5px] border-white rounded-br-[30px]" />

                            <View style={{ width: SCAN_SIZE, height: SCAN_SIZE }} className="overflow-hidden">
                                <Animated.View style={[{ width: SCAN_SIZE, height: 2, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 1 }, animatedLineStyle]} />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mt-8 bg-[rgba(18,18,18,0.5)] w-[48px] h-[48px] rounded-[24px] items-center justify-center"
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={26} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {manualInputEl}
            </KeyboardAvoidingView>
        </View>
    );
};

export default QRScanner;