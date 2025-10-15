'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CartType } from '@/types/cart.type';
import { useRouter } from 'next/navigation';

function CartInfo({ cart, className }: { cart: CartType; className?: string }) {
  const router = useRouter();
  const goToShipping = () => {
    router.push('/shipping-address');
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-2">
        Subtotal({cart.items?.reduce((a, c) => a + c.qty, 0)}):
        <span className="font-bold">${cart.itemsPrice}</span>
      </div>
      <div className="flex items-center gap-2">
        Tax: <span className="font-bold">${cart.taxPrice}</span>
      </div>
      <div className="flex items-center gap-2">
        Total Price: <span className="font-bold">${cart.totalPrice}</span>
      </div>
      <Button onClick={goToShipping}>Proceed To Checkout</Button>
    </Card>
  );
}

export { CartInfo };
