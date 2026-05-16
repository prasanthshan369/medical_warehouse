import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/colors';
import { OrderItem, BatchRow } from '@/src/types/order.types';

interface BatchSelectionModalProps {
    isVisible: boolean;
    item: OrderItem | null;
    initialBatches?: BatchRow[];
    onClose: () => void;
    onSave: (batches: BatchRow[]) => void;
}

const BatchSelectionModal: React.FC<BatchSelectionModalProps> = ({
    isVisible,
    item,
    initialBatches,
    onClose,
    onSave
}) => {
    const [batches, setBatches] = useState<BatchRow[]>([
        { id: '1', batchNo: 'B12345', quantity: '' }
    ]);

    useEffect(() => {
        if (isVisible) {
            if (initialBatches && initialBatches.length > 0) {
                setBatches(initialBatches);
            } else if (item) {
                setBatches([{ id: '1', batchNo: item.batchNo || 'B12345', quantity: item.requiredQty.toString() }]);
            }
        }
    }, [isVisible]);

    const addBatch = () => {
        setBatches(prev => [
            ...prev,
            { id: Date.now().toString(), batchNo: 'B12345', quantity: '' }
        ]);
    };

    const updateBatch = (id: string, field: keyof BatchRow, value: string) => {
        setBatches(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-6">
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <View className="bg-white w-full rounded-[28px] p-6">
                    {/* Ordered Units */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text style={{ color: colors.text.DEFAULT }} className="text-[17px] font-inter-bold">
                            Ordered Units
                        </Text>
                        <View
                            style={{ backgroundColor: '#F2F2F2' }}
                            className="w-[72px] h-[52px] rounded-[12px] items-center justify-center"
                        >
                            <Text style={{ color: '#666666' }} className="text-[26px] font-inter-bold">
                                {item?.requiredQty ?? 0}
                            </Text>
                        </View>
                    </View>

                    {/* Batch Number label */}
                    <Text style={{ color: colors.text.DEFAULT }} className="text-[14px] font-inter-medium mb-3">
                        Batch Number
                    </Text>

                    {/* Batch Rows */}
                    <ScrollView showsVerticalScrollIndicator={false} className="max-h-[220px]">
                        {batches.map((batch) => (
                            <View key={batch.id} className="flex-row items-center mb-3">
                                {/* Batch Selector */}
                                <TouchableOpacity
                                    style={{ borderColor: '#E0E0E0' }}
                                    className="flex-1 h-[54px] border rounded-[12px] px-4 flex-row items-center justify-between mr-3"
                                    onPress={() => {}}
                                >
                                    <Text style={{ color: colors.text.DEFAULT }} className="text-[15px] font-inter-semibold">
                                        {batch.batchNo}
                                    </Text>
                                    <Ionicons name="caret-down" size={13} color={colors.text.DEFAULT} />
                                </TouchableOpacity>

                                {/* Quantity Box */}
                                <View
                                    style={{ borderColor: colors.text.DEFAULT }}
                                    className="w-[68px] h-[54px] border-[1.5px] rounded-[12px] items-center justify-center"
                                >
                                    <Text style={{ color: colors.text.DEFAULT }} className="text-[24px] font-inter-bold">
                                        {batch.quantity || '0'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Add Batch */}
                    <TouchableOpacity
                        onPress={addBatch}
                        className="flex-row items-center mt-1 mb-6"
                    >
                        <Text style={{ color: colors.text.blue }} className="text-[15px] font-inter-bold">
                            + Add Batch
                        </Text>
                    </TouchableOpacity>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={() => onSave(batches)}
                        style={{ backgroundColor: colors.brand.primary }}
                        className="w-full py-[18px] rounded-full items-center"
                    >
                        <Text className="text-white text-[18px] font-inter-bold">
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default BatchSelectionModal;
