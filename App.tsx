import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useColorScheme} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {ThemeProvider} from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import MainNavigator from './src/navigation/MainNavigator';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider initialScheme={scheme}>
            <MainNavigator />
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
