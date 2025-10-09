'use client';

import { CartType } from '@/types/cart.type';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function CartTable({ cart }: { cart?: CartType }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h2 className="text-2xl">shopping cart</h2>
      {!cart || cart.items.length === 0 ? (
        <div className="">cart is empty, go shopping</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 md: gap-5">
          <div className="overflow-x-auto md:col-span-3">
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
                  <TableRow>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    {/* Todo complete this after sync with database */}
                    <TableCell>{item.qty}</TableCell>{' '}
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
