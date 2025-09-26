'use client';

import { addItemToCart } from '@/actions/cart.actions';
import { Button } from '@/components/ui/button';
import { CartItemType } from '@/types/cart.type';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddToCart({ item }: { item: CartItemType }) {
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast.warning(res.message);
      return;
    }
    toast.success(res.message, {
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  };
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <PlusIcon />
      Add To Cart
    </Button>
  );
}

export default AddToCart;
