import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { icons } from '@/src/constants/icons';

interface DispatcherOrderCardProps {
    id: string;
    idDisplay?: string;
    customerName: string;
    reviewedOn: string;
    onPress?: () => void;
}

const DispatcherOrderCard: React.FC<DispatcherOrderCardProps> = ({
    id,
    idDisplay,
    customerName,
    reviewedOn,
    onPress
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="bg-white rounded-[16px] p-5 mb-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 1,
            }}
        >
            <Text className="text-[18px] font-inter-bold text-[#1A1A1A] mb-4">
                {idDisplay || id}
            </Text>

            <View className="flex-row items-start border-t border-[#F0F0F0] pt-4">
                {/* Customer Name */}
                <View className="flex-1 flex-row items-start mr-4">
                    <icons.person width={22} height={22} fill="#6A6A6A" style={{ marginTop: 2 }} />
                    <View className="ml-2">
                        <Text className="text-[13px] font-inter text-[#6A6A6A] mb-1">
                            Customer Name
                        </Text>
                        <Text className="text-[15px] font-inter-medium text-[#222222]">
                            {customerName}
                        </Text>
                    </View>
                </View>

                {/* Reviewed On */}
                <View className="flex-1 flex-row items-start">
                    <icons.calendar_today width={20} height={20} fill="#6A6A6A" style={{ marginTop: 2 }} />
                    <View className="ml-2">
                        <Text className="text-[13px] font-inter text-[#6A6A6A] mb-1">
                            Reviewed On
                        </Text>
                        <Text className="text-[15px] font-inter-medium text-[#222222]">
                            {reviewedOn}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default DispatcherOrderCard;
