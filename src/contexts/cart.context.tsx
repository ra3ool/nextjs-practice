'use client';

import type { CartType } from '@/types/cart.type';
import type { Session } from 'next-auth';
import { createContext, useContext } from 'react';

interface CartContextType {
  session: Session | null;
  cart: CartType;
}
interface CartProviderType extends CartContextType {
  children: React.ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children, session, cart }: CartProviderType) {
  return (
    <CartContext.Provider value={{ cart, session }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CartProvider, useCart };
