import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {CartProvider, useCart} from '../context/CartContext';

describe('CartContext', () => {
  const wrapper = ({children}: any) => <CartProvider>{children}</CartProvider>;

  const product = {
    _id: 'abc',
    title: 'Item 1',
    price: '10',
    images: [],
  };

  it('adds and removes items from cart', () => {
    const {result} = renderHook(() => useCart(), {wrapper});

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cartItems.length).toBe(1);
    expect(result.current.cartItems[0].quantity).toBe(1);

    act(() => {
      result.current.removeFromCart(product._id);
    });

    expect(result.current.cartItems.length).toBe(0);
  });

  it('clears the cart', () => {
    const {result} = renderHook(() => useCart(), {wrapper});

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
      result.current.clearCart();
    });

    expect(result.current.cartItems.length).toBe(0);
  });
});
