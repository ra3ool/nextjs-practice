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
import { routes } from '@/constants/routes.constants';
import { cn } from '@/lib/utils';
import type { CartType } from '@/types/cart.type';
import { formatPrice } from '@/utils/format-price';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function CartTable({
  cart,
  className,
  showOnlyItemsDetail,
}: {
  cart: CartType;
  className?: string;
  showOnlyItemsDetail: boolean;
}) {
  const router = useRouter();
  const goToProductDetails = (itemSlug: string) => {
    router.push(`${routes.product.root}/${itemSlug}`);
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
                  className={cn(
                    'font-medium flex items-center gap-4',
                    !showOnlyItemsDetail && 'cursor-pointer',
                  )}
                  {...(!showOnlyItemsDetail && {
                    onClick: () => goToProductDetails(item.slug),
                  })}
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
                  {item.name} - {formatPrice(item.price)}
                </TableCell>
                <TableCell>
                  {!showOnlyItemsDetail ? (
                    <AddToCart
                      cart={cart}
                      item={{
                        ...item,
                        qty: 1,
                      }}
                    />
                  ) : (
                    item.qty
                  )}
                </TableCell>
                <TableCell>{formatPrice(item.price * item.qty)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {!showOnlyItemsDetail && (
            <TableCaption>your cart items and details</TableCaption>
          )}
        </Table>
      </div>
    </div>
  );
}

export { CartTable };
