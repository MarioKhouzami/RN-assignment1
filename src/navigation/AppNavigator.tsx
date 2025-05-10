import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext'; // Import useTheme to access theme
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import {Product} from '../types/Product';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Verification: undefined;
  ProductList: undefined;
  ProductDetail: {product: Product};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const {isLoggedIn} = useAuth();
  const {themeStyles} = useTheme(); // Get the theme styles from the context

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: themeStyles.background, // Set dynamic background
          headerTitleStyle: themeStyles.text, // Set dynamic title text color
        }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Verification"
              component={VerificationScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="ProductList"
              component={ProductListScreen}
              options={{title: 'Products'}}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{title: 'Product Detail'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
