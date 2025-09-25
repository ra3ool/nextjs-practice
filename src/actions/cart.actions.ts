'use server';
import { CartItem } from '@/types/cart.type';

export const addToCart = async (item: CartItem) => {
  return {
    success: true,
    message: 'item added to cart',
  };
};
