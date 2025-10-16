'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CartType } from '@/types/cart.type';
import { ReactNode } from 'react';

interface CartInfoProps {
  cart: CartType;
  className?: string;
  cardButton?: ReactNode;
}

function CartInfo({ cart, className, cardButton }: CartInfoProps) {
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
      {cardButton}
    </Card>
  );
}

export { CartInfo };
