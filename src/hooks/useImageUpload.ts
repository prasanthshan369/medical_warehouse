import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { authService } from '@/src/api/authServices';
import { storageApi, userApi } from '@/src/api/storageServices';
import { useAuthStore } from '@/src/store/useAuthStore';

/**
 * Custom hook to handle profile image picking and uploading.
 * Encapsulates permissions, optimistic UI, haptics, and API integration.
 */
export const useImageUpload = () => {
    const { initialize, user } = useAuthStore();

    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [tempAvatar, setTempAvatar] = useState<string | null>(null);

    // ── Open bottom sheet ─────────────────────────────────────────────────────
    const handleImageUpload = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsSheetVisible(true);
    }, []);

    // ── Core upload logic ─────────────────────────────────────────────────────
    const uploadFile = useCallback(async (uri: string) => {
        if (!user?.id) return;
        
        setIsUploading(true);
        setTempAvatar(uri); // optimistic UI

        try {
            const filename = uri.split('/').pop() ?? 'avatar.jpg';
            const ext = /\.(\w+)$/.exec(filename)?.[1] ?? 'jpeg';

            const formData = new FormData();
            // @ts-ignore — RN FormData requires this object shape
            formData.append('file', { uri, name: filename, type: `image/${ext}` });
            formData.append('folder', 'administrator/profile');

            // 1. Upload to storage
            const uploadRes = await storageApi.upload(formData);
            
            if (uploadRes.data?.success && uploadRes.data?.data?.url) {
                const avatarUrl = uploadRes.data.data.url;
                
                // 2. Update user profile with new URL
                await userApi.update(user.id, { avatarUrl });

                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                await initialize(); // sync server state locally
            } else {
                throw new Error('Upload failed: No URL returned');
            }
        } catch (error: any) {
            console.error('[useImageUpload] Upload error:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setTempAvatar(null); // revert optimistic update
            // ... (rest of the error handling)

            Alert.alert(
                'Upload Failed',
                error?.message?.includes('Network')
                    ? 'No internet connection. Please try again.'
                    : 'Could not update your photo. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsUploading(false);
        }
    }, [initialize]);

    // ── Camera ────────────────────────────────────────────────────────────────
    const onSelectCamera = useCallback(async () => {
        setIsSheetVisible(false);

        const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            if (!canAskAgain) {
                Alert.alert(
                    'Camera Access Blocked',
                    'Please enable camera access in your device Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() },
                    ]
                );
            } else {
                Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
            }
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0]?.uri) {
            uploadFile(result.assets[0].uri);
        }
    }, [uploadFile]);

    // ── Gallery ───────────────────────────────────────────────────────────────
    const onSelectLibrary = useCallback(async () => {
        setIsSheetVisible(false);

        const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            if (!canAskAgain) {
                Alert.alert(
                    'Gallery Access Blocked',
                    'Please enable photo library access in your device Settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() },
                    ]
                );
            } else {
                Alert.alert('Permission Required', 'Gallery access is needed to choose a photo.');
            }
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
        });

        if (!result.canceled && result.assets[0]?.uri) {
            uploadFile(result.assets[0].uri);
        }
    }, [uploadFile]);

    return {
        isSheetVisible,
        setIsSheetVisible,
        isUploading,
        tempAvatar,
        handleImageUpload,
        onSelectCamera,
        onSelectLibrary,
    };
};