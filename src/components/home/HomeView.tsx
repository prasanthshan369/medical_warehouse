import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatsCard from './StatsCard';
import DashboardHeader from './DashboardHeader';
import { useHomeStore } from '@/src/store/useHomeStore';
import { HomeSkeletonList } from './HomeSkeleton';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/src/store/useAuthStore';
import { homeService } from '@/src/services/home.service';
import { authService } from '@/src/services/auth.service';
import { useHomeQuery } from '@/src/hooks/useHome';

const HomeView = () => {
    const navigation = useNavigation<any>();
    const { warehouseStats, statsError } = useHomeStore();
    const { user, userLoading } = useAuthStore();
    const { isLoading: statsLoading, refetch: refetchStats } = useHomeQuery();
    const [refreshing, setRefreshing] = useState(false);

    // Initial mount loading state
    const isInitialLoading = (statsLoading && !warehouseStats?.length) || (userLoading && !user);

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
                    {/* Header Section */}
                    <DashboardHeader />

                    {/* Error State for Stats */}
                    {statsError && !warehouseStats?.length && (
                        <View className="mb-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <Text className="text-red-400 text-center font-inter-medium">{statsError}</Text>
                        </View>
                    )}

                    {/* Statistics Cards */}
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
    );
};

export default HomeView;
