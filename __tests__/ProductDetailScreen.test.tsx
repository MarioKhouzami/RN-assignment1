import React from 'react';
import {render} from '@testing-library/react-native';
import ProductDetailScreen from '../src/screens/ProductDetailScreen';
import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '../src/context/ThemeContext';
import {AuthProvider} from '../src/context/AuthContext';

const mockProduct = {
  _id: 'test-id',
  title: 'Test Product',
  description: 'Test description',
  price: '100',
  images: [{url: '/test.jpg'}],
  location: {latitude: 33.9, longitude: 35.5, name: 'Beirut'},
  user: {_id: 'owner-id', email: 'owner@example.com'},
};

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: () => ({
      params: {product: mockProduct},
    }),
    useNavigation: () => ({
      setOptions: jest.fn(),
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('ProductDetailScreen', () => {
  it('renders product details correctly', () => {
    const {getByText} = render(
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <ProductDetailScreen />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>,
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$100')).toBeTruthy();
    expect(getByText('Test description')).toBeTruthy();
    expect(getByText('Beirut')).toBeTruthy();
  });
});
