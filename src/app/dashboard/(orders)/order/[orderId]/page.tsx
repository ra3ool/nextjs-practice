import { getOrderById } from '@/actions/order.actions';
import { isErrorResponse } from '@/lib/response';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Order details',
};

async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { orderId } = await params;

  const result = await getOrderById(Number(orderId));

  if (isErrorResponse(result)) return <p>{result.message}</p>;

  const order = result.data;

  return <>order detail for order {JSON.stringify(order)}</>;
}

export { metadata };
export default OrderDetailPage;
