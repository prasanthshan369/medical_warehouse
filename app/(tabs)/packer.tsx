import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PackerView from '@/src/components/packer/PackerView';

const Packer = () => {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <PackerView />
        </SafeAreaView>
    );
};

export default Packer;