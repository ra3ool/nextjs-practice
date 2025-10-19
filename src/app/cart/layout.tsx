import { getMyCart } from '@/actions/cart.actions';
import { CartInfo } from '@/components/cart/cart-info';
import { Button } from '@/components/ui/button';
import { CartProvider } from '@/contexts/cart.context';
import { authOptions } from '@/lib/auth';
import { CartType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, session] = await Promise.all([
    getMyCart(),
    getServerSession(authOptions),
  ]);
  const serializedCart = serializeCart(cart as CartType);

  return (
    <CartProvider session={session} cart={serializedCart}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">{children}</div>
        <CartInfo
          cart={serializedCart}
          className="h-fit sticky top-20"
          cardButton={
            <Button asChild>
              <Link href="/cart/shipping-address">
                Proceed To Shipping Address
              </Link>
            </Button>
          }
        />
      </div>
    </CartProvider>
  );
}
