import { useLocalSearchParams } from 'expo-router';
import OrderPickingView from '@/src/components/picking/OrderPickingView';

export default function OrderDetailsScreen() {
    const { id, expiresAt } = useLocalSearchParams<{ id: string; expiresAt: string }>();

    return <OrderPickingView orderId={id} expiresAt={expiresAt} />;
}
