'use client';

import type {
  CartContextType,
  CartProviderType,
  ShippingAddressType,
  StepsType,
} from '@/types/cart.type';
import { createContext, useContext, useState } from 'react';

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children, session, cart }: CartProviderType) {
  const [currentStep, setCurrentStep] = useState<StepsType>('');
  const [onFormSubmit, setOnFormSubmit] = useState<() => void>(() => {});
  const [addresses, setAddresses] = useState<ShippingAddressType[]>([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        session,
        currentStep,
        setCurrentStep,
        addresses,
        setAddresses,
        onFormSubmit,
        setOnFormSubmit,
      }}
    >
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
