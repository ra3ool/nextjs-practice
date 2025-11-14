import { getOrderById } from '@/actions/order.actions';
import { CartTable } from '@/components/cart/cart-table';
import { AddressCard } from '@/components/dashboard/addresses-list';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { isErrorResponse } from '@/lib/response';
import { CartType } from '@/types/cart.type';
import { formatDate } from '@/utils/format-date';
import { formatPrice } from '@/utils/format-price';
import type { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Order details',
};

async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const result = await getOrderById(Number(orderId));
  if (
    isErrorResponse(result) ||
    !result.data ||
    result.data.OrderItems.length === 0
  ) {
    return <p>{result.message}</p>;
  }
  const order = result.data;

  const cart = {
    items: order.OrderItems.map((item) => ({
      slug: item.product?.slug,
      name: item.product?.name,
      image: JSON.parse((item.product?.images || '[]') as string)?.[0],
      price: item.price,
      qty: item.qty,
    })),
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-5">
          <Badge className="w-full text-xl py-3" variant="outline">
            Order {order.id}, Created at {formatDate(order.createdAt)}
          </Badge>

          <CardWrapper title="Order Items">
            <CartTable cart={cart as CartType} showOnlyItemsDetail />
          </CardWrapper>

          <CardWrapper title="Delivery Address">
            <AddressCard
              address={JSON.parse(order.shippingAddress)}
              className="border-none shadow-none"
              showDefaultAddressCheckIcon={false}
            />
            {order.deliveredAt ? (
              <Badge variant="secondary">
                Delivered at {formatDate(order.deliveredAt)}
              </Badge>
            ) : (
              <Badge variant="destructive">Not Delivered</Badge>
            )}
          </CardWrapper>

          <CardWrapper title="Payment Method">
            <div>{order.paymentMethod}</div>
            {order.paidAt ? (
              <Badge variant="secondary">
                Paid at {formatDate(order.paidAt)}
              </Badge>
            ) : (
              <Badge variant="destructive">Not Paid</Badge>
            )}
          </CardWrapper>
        </div>

        <Card className="p-4 select-none h-fit sticky top-0">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span>Subtotal ({order.OrderItems.length} items):</span>
              <span className="font-bold">{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax:</span>
              <span className="font-bold">{formatPrice(order.taxPrice)}</span>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span>Shipping Price:</span>
                <span className="font-bold">
                  {formatPrice(order.shippingPrice)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="font-semibold">Total Price:</span>
              <span className="font-bold text-lg">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function CardWrapper({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <h3 className="text-xl">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}

export { metadata };
export default OrderDetailPage;
