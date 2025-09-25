'use client';

import { addToCart } from '@/actions/cart.actions';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart.type';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function AddToCart({ item }: { item: CartItem }) {
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addToCart(item);
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
