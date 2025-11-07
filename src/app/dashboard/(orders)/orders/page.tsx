import { getOrdersList } from '@/actions/order.actions';
import { isErrorResponse } from '@/lib/response';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Orders list',
};

async function OrdersListPage() {
  const result = await getOrdersList();

  if (isErrorResponse(result)) return <p>{result.message}</p>;

  const orders = result.data;

  return <>{JSON.stringify(orders)}</>;
}

export { metadata };
export default OrdersListPage;
