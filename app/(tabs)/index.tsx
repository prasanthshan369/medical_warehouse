import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeView from '@/src/components/home/HomeView';

const Dashboard = () => {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <HomeView />
        </SafeAreaView>
    );
};

export default Dashboard;