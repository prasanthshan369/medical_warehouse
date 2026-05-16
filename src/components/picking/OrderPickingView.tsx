import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Order, OrderItem, BatchRow } from '@/src/types/order.types';
import { orderApi } from '@/src/api/order.api';
import OrderItemCard from './OrderItemCard';
import PickingProgressFooter from './PickingProgressFooter';
import ConfirmMoveBottomSheet from './ConfirmMoveBottomSheet';
import PartialQuantityModal from './PartialQuantityModal';
import OrderInfoPopup from './OrderInfoPopup';
import BatchSelectionModal from './BatchSelectionModal';
import { useOrderStore } from '@/src/store/useOrderStore';
import { icons } from '@/src/constants/icons';
import colors from '@/src/theme/colors';
import { ItemPickingSkeletonList } from './ItemPickingSkeleton';

interface OrderPickingViewProps {
    orderId: string;
}

const OrderPickingView: React.FC<OrderPickingViewProps> = ({ orderId }) => {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [pickingItems, setPickingItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmSheetVisible, setConfirmSheetVisible] = useState(false);
    const [isPartialModalVisible, setPartialModalVisible] = useState(false);
    const [isBatchModalVisible, setBatchModalVisible] = useState(false);
    const [isInfoSheetVisible, setInfoSheetVisible] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [activeItemForEdit, setActiveItemForEdit] = useState<OrderItem | null>(null);
    const [itemBatches, setItemBatches] = useState<Record<string, BatchRow[]>>({});
    const activeItemRef = useRef<OrderItem | null>(null);
    const { setActiveTab } = useOrderStore();
    const ArrowBack = icons.arrowBack;
    const Information = icons.info;
    const Print = icons.print;

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            const data = await orderApi.getOrderDetails(orderId);
            if (data) {
                setOrder(data);
                setPickingItems(data.pickingItems || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = (id: string, newStatus: 'pending' | 'partial' | 'completed') => {
        setPickingItems(prev => prev.map(item => {
            if (item.id === id) {
                const pickedQty = newStatus === 'completed' ? item.requiredQty : 0;
                return { ...item, status: newStatus, pickedQty };
            }
            return item;
        }));
        if (newStatus === 'pending') {
            setItemBatches(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };

    const handlePartialConfirm = (quantity: number) => {
        const target = activeItemRef.current;
        if (target) {
            setPickingItems(prev => prev.map(i => {
                if (i.id === target.id) {
                    const newStatus = quantity >= i.requiredQty ? 'completed' : 'partial';
                    return { ...i, status: newStatus, pickedQty: quantity };
                }
                return i;
            }));
        }
        // Always close modal and clean up regardless of ref state
        setPartialModalVisible(false);
        setActiveItemForEdit(null);
        activeItemRef.current = null;
    };

    const handleBatchSave = (batches: BatchRow[]) => {
        const target = activeItemRef.current;
        if (target) {
            setItemBatches(prev => ({ ...prev, [target.id]: batches }));
            const totalPicked = batches.reduce((sum, b) => sum + (parseInt(b.quantity) || 0), 0);
            setPickingItems(prev => prev.map(i => {
                if (i.id === target.id) {
                    return { ...i, pickedQty: totalPicked, status: totalPicked >= i.requiredQty ? 'completed' : 'partial' };
                }
                return i;
            }));
        }
        setBatchModalVisible(false);
        setActiveItemForEdit(null);
        activeItemRef.current = null;
    };

    const pickedCount = pickingItems.filter(item => item.status === 'completed').length;
    const isAnyPartial = pickingItems.some(item => item.status === 'partial');

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-white">
            {/* Custom Header */}
            <View
                style={{ paddingTop: (insets.top || 20), zIndex: 20 }}
                className="px-5 pb-4 flex-row items-center bg-white border-b border-[#F0F0F0]"
                onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    className="w-10 h-10 items-center justify-center -ml-2"
                >
                    <ArrowBack width={18} height={18} fill={colors.text.DEFAULT} />
                </TouchableOpacity>

                <View className="flex-1 ml-1">
                    <Text 
                        style={{ color: colors.text.DEFAULT }} 
                        className="text-[19px] font-inter-bold"
                        numberOfLines={1}
                    >
                        Order #{order?.orderId || 'RX-7721'}
                    </Text>
                    <Text style={{ color: '#6A6A6A' }} className="text-[13px] font-inter-medium mt-0.5">
                        {loading ? 'Loading...' : `${pickingItems.length} Medicines`}
                    </Text>
                </View>

                <View className="flex-row items-center">
                    {/* Info button */}
                    <TouchableOpacity
                        onPress={() => setInfoSheetVisible(prev => !prev)}
                        className="p-2"
                    >
                        <Information
                            width={22}
                            height={22}
                            fill={isInfoSheetVisible ? colors.brand.primary : colors.text.DEFAULT}
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="p-2">
                        <Print width={22} height={22} fill={colors.text.DEFAULT} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={{ backgroundColor: colors.surface.main }} className="flex-1">
                    <ItemPickingSkeletonList />
                </View>
            ) : !order ? (
                <View className="flex-1 justify-center items-center bg-white">
                    <Text>Order not found</Text>
                </View>
            ) : (
                <ScrollView
                    style={{ backgroundColor: colors.surface.main }}
                    className="flex-1 px-5 pt-4"
                    showsVerticalScrollIndicator={false}
                >
                    {pickingItems.map(item => (
                        <OrderItemCard
                            key={item.id}
                            item={item}
                            batches={itemBatches[item.id]}
                            onToggleStatus={handleToggleStatus}
                            onPartialPress={(item) => {
                                activeItemRef.current = item;
                                setActiveItemForEdit(item);
                                setPartialModalVisible(true);
                            }}
                            onBatchPress={(item) => {
                                activeItemRef.current = item;
                                setActiveItemForEdit(item);
                                setBatchModalVisible(true);
                            }}
                        />
                    ))}
                </ScrollView>
            )}

            {/* Progress Footer */}
            {!loading && order && (
                <PickingProgressFooter
                    totalItems={pickingItems.length}
                    pickedItems={pickedCount}
                    isAnyPartial={isAnyPartial}
                    onMainPress={() => setConfirmSheetVisible(true)}
                />
            )}

            {/* Finalize Confirmation Sheet */}
            <ConfirmMoveBottomSheet
                isVisible={isConfirmSheetVisible}
                onClose={() => setConfirmSheetVisible(false)}
                onConfirm={() => {
                    setConfirmSheetVisible(false);
                    setActiveTab('new');
                    router.push('/picker');
                }}
                type={isAnyPartial ? 'partial' : 'packer'}
                message={isAnyPartial
                    ? "Are you sure you want to move this order to partial?"
                    : "Are you sure you want to move this order to packing?"
                }
            />

            {/* Partial Quantity Modal */}
            <PartialQuantityModal
                isVisible={isPartialModalVisible}
                item={activeItemForEdit}
                onClose={() => {
                    setPartialModalVisible(false);
                    setActiveItemForEdit(null);
                }}
                onConfirm={handlePartialConfirm}
            />

            {/* Batch Selection Modal */}
            <BatchSelectionModal
                isVisible={isBatchModalVisible}
                item={activeItemForEdit}
                initialBatches={activeItemForEdit ? itemBatches[activeItemForEdit.id] : undefined}
                onClose={() => {
                    setBatchModalVisible(false);
                    setActiveItemForEdit(null);
                    activeItemRef.current = null;
                }}
                onSave={handleBatchSave}
            />

            {/* Order Info Detailed Sheet */}
            <OrderInfoPopup
                isVisible={isInfoSheetVisible}
                onClose={() => setInfoSheetVisible(false)}
                topOffset={headerHeight}
                order={order}
            />
        </View>
    );
};

export default OrderPickingView;
