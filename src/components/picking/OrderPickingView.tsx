import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Order, OrderItem } from '@/src/api/types';
import { orderService } from '@/src/api/orderServices';
import OrderItemCard from './OrderItemCard';
import PickingProgressFooter from './PickingProgressFooter';
import ConfirmMoveBottomSheet from './ConfirmMoveBottomSheet';
import PartialQuantityModal from './PartialQuantityModal';
import OrderInfoPopup from './OrderInfoPopup';
import { ItemPickingSkeletonList } from './ItemPickingSkeleton';
import { useOrderStore } from '@/src/store/useOrderStore';
import { icons } from '@/src/constants/icons';
import { colors } from '@/src/constants/colors';


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
    const [isInfoSheetVisible, setInfoSheetVisible] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [activeItemForPartial, setActiveItemForPartial] = useState<OrderItem | null>(null);
    const { setActiveTab } = useOrderStore();
    const ArrowBack = icons.arrowBack;
    const Information = icons.info;
    const Print = icons.print;

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            const data = await orderService.getOrderDetails(orderId);
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
                // If it was partial and being set to pending/completed, reset picked qty or set to total
                const pickedQty = newStatus === 'completed' ? item.requiredQty : 0;
                return { ...item, status: newStatus, pickedQty };
            }
            return item;
        }));
    };

    const handlePartialConfirm = (quantity: number) => {
        if (activeItemForPartial) {
            setPickingItems(prev => prev.map(item => {
                if (item.id === activeItemForPartial.id) {
                    // If entered quantity equals required, mark as completed
                    const newStatus = quantity === item.requiredQty ? 'completed' : 'partial';
                    return { ...item, status: newStatus, pickedQty: quantity };
                }
                return item;
            }));
            setPartialModalVisible(false);
            setActiveItemForPartial(null);
        }
    };

    const pickedCount = pickingItems.filter(item => item.status === 'completed').length;
    const isAnyPartial = pickingItems.some(item => item.status === 'partial');

    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-white">
            {/* Custom Header */}
            <View
                style={{ paddingTop: (insets.top || 40) + 20, zIndex: 20 }}
                className="px-5 pb-4 flex-row justify-between items-center bg-white"
                onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-5">
                        <ArrowBack width={16} height={16} fill={colors.textMain} />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ color: colors.textMain }} className="text-[18px] font-inter-bold">{orderId}</Text>
                        <Text style={{ color: colors.textSecondary }} className="text-[12px] font-inter mt-0.5">{loading ? '...' : `${order?.totalCount} Items`}</Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    {/* Info button — toggles popup, highlights when active */}
                    <TouchableOpacity
                        onPress={() => setInfoSheetVisible(prev => !prev)}
                        className="mr-6"
                        style={
                            isInfoSheetVisible
                                ? {
                                    backgroundColor: '#F0F0F0',
                                    borderRadius: 20,
                                    padding: 6,
                                    marginRight: 18,
                                }
                                : { padding: 6, marginRight: 18 }
                        }
                    >
                        <Information
                            width={20}
                            height={20}
                            fill={isInfoSheetVisible ? colors.primary : colors.textMain}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Print width={20} height={20} fill={colors.textMain} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={{ backgroundColor: colors.bgMain }} className="flex-1">
                    <ItemPickingSkeletonList />
                </View>
            ) : !order ? (
                <View className="flex-1 justify-center items-center bg-white">
                    <Text>Order not found</Text>
                </View>
            ) : (
                <ScrollView
                    style={{ backgroundColor: colors.bgMain }}
                    className="flex-1 px-5 pt-4"
                    showsVerticalScrollIndicator={false}
                >
                    {pickingItems.map(item => (
                        <OrderItemCard
                            key={item.id}
                            item={item}
                            onToggleStatus={handleToggleStatus}
                            onPartialPress={(item) => {
                                setActiveItemForPartial(item);
                                setPartialModalVisible(true);
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
                item={activeItemForPartial}
                onClose={() => {
                    setPartialModalVisible(false);
                    setActiveItemForPartial(null);
                }}
                onConfirm={handlePartialConfirm}
            />

            {/* Order Info Detailed Sheet */}
            <OrderInfoPopup
                isVisible={isInfoSheetVisible}
                onClose={() => setInfoSheetVisible(false)}
                topOffset={headerHeight}
            />
        </View>
    );
};

export default OrderPickingView;
