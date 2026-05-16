import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Handles device registration for Push Notifications.
 * Returns the Expo Push Token if successful, or null otherwise.
 */
export const pushNotificationService = {
  registerForPushAsync: async () => {
    if (!Device.isDevice) {
      console.warn('Push Notifications require a physical device.');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    // Define Android Channel (Optimized for SDK 54)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1A1A1A',
      });
    }

    // Register Category for Lock-Screen Actions
    await Notifications.setNotificationCategoryAsync('order_alert', [
      {
        identifier: 'view_order',
        buttonTitle: '📦 VIEW ORDER',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'ignore',
        buttonTitle: 'Dismiss',
        options: { 
          isDestructive: true,
          opensAppToForeground: false // Prevents app from opening on dismiss
        },
      },
    ]);

    // Check if we are in Expo Go (which doesn't support tokens in SDK 54+)
    const isExpoGo = Constants?.executionEnvironment === 'storeClient';
    
    if (isExpoGo) {
      console.info('Push Notifications: Remote tokens are not supported in Expo Go. Use a Development Build for this feature.');
      return null;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (error) {
      console.warn('Failed to get push token:', error);
      return null;
    }
  }
};
