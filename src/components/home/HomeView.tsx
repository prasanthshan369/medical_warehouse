import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatsCard from './StatsCard';
import DashboardHeader from './DashboardHeader';
import { useHomeStore } from '@/src/store/useHomeStore';
import { HomeSkeletonList } from './HomeSkeleton';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/src/store/useAuthStore';

const HomeView = () => {
    const navigation = useNavigation<any>();
    const { warehouseStats, statsLoading, statsError, fetchWarehouseStats } = useHomeStore();
    const { initialize } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchWarehouseStats();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Simultaneously refresh stats and user profile
            await Promise.all([
                fetchWarehouseStats(),
                initialize()
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
            {/* Header Section */}
            <DashboardHeader />

            {/* Loading State for Stats */}
            {statsLoading && !warehouseStats?.length ? (
                <HomeSkeletonList />
            ) : (
                <>
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
