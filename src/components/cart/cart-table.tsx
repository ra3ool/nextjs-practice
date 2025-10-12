'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CartType } from '@/types/cart.type';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

function CartTable({ cart }: { cart?: CartType }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h2 className="text-2xl">shopping cart</h2>
      {!cart || cart.items?.length === 0 ? (
        <div className="">cart is empty, go shopping</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-5">
          <div className="overflow-x-auto lg:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex items-center gap-4"
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
                      </Link>
                    </TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>your cart items and details</TableCaption>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}

export { CartTable };
