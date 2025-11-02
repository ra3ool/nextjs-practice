import { getMyCart } from '@/actions/cart.actions';
import { getUserAddresses } from '@/actions/user.actions';
import { CartInfo } from '@/components/cart/cart-info';
import { CheckoutSteps } from '@/components/cart/checkout-steps';
import { CartProvider } from '@/contexts/cart.context';
import { authOptions } from '@/lib/auth';
import type { CartType, ShippingAddressType } from '@/types/cart.type';
import { serializeCart } from '@/utils/serialize-cart';
import { getServerSession } from 'next-auth';

async function CartLayout({ children }: { children: React.ReactNode }) {
  const [cart, session, addressesResult] = await Promise.all([
    getMyCart(),
    getServerSession(authOptions),
    getUserAddresses(),
  ]);
  const serializedCart = serializeCart(cart as CartType);
  const addresses = addressesResult.data as ShippingAddressType[];

  return (
    <CartProvider session={session} cart={serializedCart} addresses={addresses}>
      <CheckoutSteps className="mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">{children}</div>
        <CartInfo cart={serializedCart} className="h-fit sticky top-20" />
      </div>
    </CartProvider>
  );
}

export default CartLayout;
