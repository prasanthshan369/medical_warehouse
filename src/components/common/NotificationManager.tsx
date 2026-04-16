import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificationStore } from '@/src/store/useNotificationStore';
import NotificationItem from './NotificationItem';

const NotificationManager = () => {
    const insets = useSafeAreaInsets();
    const notifications = useNotificationStore((state) => state.notifications);

    if (notifications.length === 0) return null;

    return (
        <View 
            pointerEvents="box-none" 
            style={[
                styles.container, 
                { paddingTop: insets.top + 10 }
            ]}
        >
            {notifications.map((notification, index) => (
                <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    index={index}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999, // Ensure it's above absolute components like Modals
    },
});

export default NotificationManager;
