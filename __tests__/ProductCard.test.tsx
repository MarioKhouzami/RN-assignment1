import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    _id: '123',
    title: 'Test Product',
    price: '100',
    images: [{url: '/test.jpg'}],
  };

  it('renders product title and price', () => {
    const {getByText} = render(
      <ProductCard product={mockProduct} onPress={() => {}} />,
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$100')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const mockPress = jest.fn();
    const {getByTestId} = render(
      <ProductCard product={mockProduct} onPress={mockPress} />,
    );

    fireEvent.press(getByTestId('product-card'));
    expect(mockPress).toHaveBeenCalled();
  });
});
