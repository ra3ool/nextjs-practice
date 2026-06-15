import { getOrdersList } from '@/actions/order.actions';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { routes } from '@/constants/routes.constants';
import { isErrorResponse } from '@/lib/response';
import { cn } from '@/lib/utils';
import { OrderType } from '@/types/cart.type';
import { formatDate } from '@/utils/format-date';
import { formatPrice } from '@/utils/format-price';
import type { Metadata } from 'next';
import Link from 'next/link';

const metadata: Metadata = {
  title: 'Orders list',
};

async function OrdersListPage() {
  const result = await getOrdersList();
  if (isErrorResponse(result) || result.data?.length === 0) {
    return <p>{result.message}</p>;
  }
  const orders = result.data;

  return (
    <div className="flex flex-col gap-4">
      {orders?.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </div>
  );
}

function OrderCard({
  order,
  className,
}: {
  order: OrderType;
  className?: string;
}) {
  return (
    <Link href={`${routes.dashboard.orders.single}/${order.id}`}>
      <Card className={cn('p-4 overflow-hidden', className)}>
        <div className="flex justify-between items-center">
          <div>{formatDate(order.createdAt)}</div>
          <div>{formatPrice(order.totalPrice)}</div>
        </div>
        <div className="flex justify-between items-center">
          <div>Cart size: {order.OrderItems.length} items</div>
          <div>
            {order.paidAt ? (
              <Badge variant="secondary">Paid</Badge>
            ) : (
              <Badge variant="destructive">Not Paid</Badge>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>Delivered to: {JSON.parse(order.shippingAddress)['city']}</div>
          <div>
            {order.deliveredAt ? (
              <Badge variant="secondary">Delivered</Badge>
            ) : (
              <Badge variant="destructive">Not Delivered</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export { metadata };
export default OrdersListPage;
