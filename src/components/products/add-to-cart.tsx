'use client';

import { addItemToCart, removeItemFromCart } from '@/actions/cart.actions';
import { Button } from '@/components/ui/button';
import type { CartItemType, CartType } from '@/types/cart.type';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

type Props = {
  cart: CartType;
  item: CartItemType;
};
type Action = 'add' | 'delete';

const actionMap = {
  add: addItemToCart,
  delete: removeItemFromCart,
};

function AddToCart({ cart, item }: Props) {
  const [isPending, startTransition] = useTransition();

  const existItem = cart.items?.find(
    (cartItem) => cartItem.productId === item.productId,
  );

  const handleCartAction = (action: Action, showToastAction = true) => {
    startTransition(() => {
      (async () => {
        const res = await actionMap[action](item);
        if (!res.success) {
          toast.warning(res.message);
          return;
        }

        toast.success(
          res.message,
          showToastAction
            ? { action: { label: 'Undo', onClick: () => undoAction(action) } }
            : undefined,
        );
      })();
    });
  };

  const undoAction = (previousAction: Action) => {
    if (previousAction === 'add') handleCartAction('delete', false);
    if (previousAction === 'delete') handleCartAction('add', false);
  };

  return existItem ? (
    <div className="flex justify-around items-center">
      <Button
        variant="outline"
        type="button"
        disabled={isPending}
        onClick={() => handleCartAction('delete')}
      >
        <MinusIcon />
      </Button>
      {existItem.qty}
      <Button
        variant="outline"
        type="button"
        disabled={isPending || existItem.stock <= existItem.qty}
        onClick={() => handleCartAction('add')}
      >
        <PlusIcon />
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={() => handleCartAction('add')}
    >
      <PlusIcon />
      Add To Cart
    </Button>
  );
}

export { AddToCart };
