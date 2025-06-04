import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useColorScheme} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {ThemeProvider} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';
import {CartProvider} from './src/context/CartContext';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider initialScheme={scheme}>
            <CartProvider>
              <MainNavigator />
            </CartProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
