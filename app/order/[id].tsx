import { useLocalSearchParams } from 'expo-router';
import OrderPickingView from '@/src/components/picking/OrderPickingView';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return <OrderPickingView orderId={id} />;
}
