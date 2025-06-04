// context/CartContext.tsx
import React, {createContext, useContext, useState} from 'react';
import {Product} from '../types/Product';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  getItemCount: () => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const index = prev.findIndex(item => item.product._id === product._id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      } else {
        return [...prev, {product, quantity: 1}];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.product._id === productId
            ? {...item, quantity: item.quantity - 1}
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  };

  const getItemCount = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const clearCart = () => {
    setCartItems([]);
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getItemCount,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
