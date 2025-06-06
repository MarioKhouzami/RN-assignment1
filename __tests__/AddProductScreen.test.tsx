import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import AddProductScreen from '../src/screens/AddProductScreen';
import {AuthProvider} from '../src/context/AuthContext';
import {ThemeProvider} from '../src/context/ThemeContext';

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(() => Promise.resolve({assets: []})),
  launchCamera: jest.fn(() => Promise.resolve({assets: []})),
}));

jest.mock('@env', () => ({
  GOOGLE_API_KEY: 'test-key',
}));

describe('AddProductScreen', () => {
  it('renders inputs and submit button', () => {
    const {getByPlaceholderText, getByText} = render(
      <AuthProvider>
        <ThemeProvider>
          <AddProductScreen />
        </ThemeProvider>
      </AuthProvider>,
    );

    expect(getByPlaceholderText('Enter product title')).toBeTruthy();
    expect(getByPlaceholderText('Enter product description')).toBeTruthy();
    expect(getByPlaceholderText('Enter price')).toBeTruthy();
    expect(getByText('Submit Product')).toBeTruthy();
  });

  it('shows validation errors if fields are empty', async () => {
    const {getByText} = render(
      <AuthProvider>
        <ThemeProvider>
          <AddProductScreen />
        </ThemeProvider>
      </AuthProvider>,
    );

    fireEvent.press(getByText('Submit Product'));

    await waitFor(() => {
      expect(getByText('Title is required')).toBeTruthy();
      expect(getByText('Description is required')).toBeTruthy();
      expect(getByText('Price is required')).toBeTruthy();
    });
  });
});
