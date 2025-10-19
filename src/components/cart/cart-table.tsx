'use client';

import { AddToCart } from '@/components/products/add-to-cart';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { CartType } from '@/types/cart.type';
import { round2 } from '@/utils/round2';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function CartTable({
  cart,
  className,
}: {
  cart: CartType;
  className?: string;
}) {
  const router = useRouter();
  // TODO make constants for routes
  const goToProductDetails = (itemSlug: string) => {
    router.push(`/product/${itemSlug}`);
  };

  return (
    <div className={cn(className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items?.map((item) => (
              <TableRow key={item.slug}>
                <TableCell
                  className="font-medium flex items-center gap-4 cursor-pointer"
                  onClick={() => goToProductDetails(item.slug)}
                >
                  <div className="relative h-10 w-10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  {item.name}
                </TableCell>
                <TableCell>
                  <AddToCart
                    cart={cart}
                    item={{
                      ...item,
                      qty: 1,
                    }}
                  />
                </TableCell>
                <TableCell>${round2(item.price * item.qty)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>your cart items and details</TableCaption>
        </Table>
      </div>
    </div>
  );
}

export { CartTable };
