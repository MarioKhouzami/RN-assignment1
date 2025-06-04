import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import {useAuth} from '../context/AuthContext';
import {Product} from '../types/Product';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Verification: {email: string};
  ForgotPassword: undefined;
  Tabs: undefined;
  ProductDetail: {product: Product};
  UserProfile: {userId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  const {isLoggedIn} = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{headerShown: true, title: 'Product Details'}}
            />
            <Stack.Screen
              name="UserProfile"
              component={UserProfileScreen}
              options={{headerShown: true, title: 'User Profile'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
