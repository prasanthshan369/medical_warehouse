import React, { useState } from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Hooks & Stores
import { useHomeStore } from '@/src/store/useHomeStore';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useHomeQuery } from '@/src/hooks/useHome';
import { authService } from '@/src/services/auth.service';

// Sections
import DashboardHeader from './sections/DashboardHeader';
import StatsCard from './sections/StatsCard';
import { HomeSkeletonList } from './sections/HomeSkeleton';

export const HomeLayout: React.FC = () => {
    const navigation = useNavigation<any>();
    const { warehouseStats, statsError } = useHomeStore();
    const { user, isLoaded } = useAuthStore();
    const { isLoading: statsLoading, refetch: refetchStats } = useHomeQuery();
    const [refreshing, setRefreshing] = useState(false);

    const isInitialLoading = (statsLoading && !warehouseStats?.length) || (!isLoaded && !user);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                refetchStats(),
                authService.initialize()
            ]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {
            console.error('Failed to refresh home data:', e);
        } finally {
            setRefreshing(false);
        }
    };

    const handleStatPress = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (id === 'picks') {
            navigation.navigate('picker');
        } else if (id === 'packs') {
            navigation.navigate('packer');
        } else if (id === 'dispatch') {
            navigation.navigate('dispatcher');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#ccc"
                    />
                }
            >
                {isInitialLoading ? (
                    <HomeSkeletonList />
                ) : (
                    <>
                        <DashboardHeader />

                        {statsError && !warehouseStats?.length && (
                            <View className="mb-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                <Text className="text-red-400 text-center font-inter-medium">{statsError}</Text>
                            </View>
                        )}

                        {warehouseStats?.map((stat) => (
                            <StatsCard
                                key={stat.id}
                                {...stat}
                                onPress={() => handleStatPress(stat.id)}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
