import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddProductScreen from '../screens/AddProductScreen';
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name === 'Products') iconName = 'list';
          else if (route.name === 'Add') iconName = 'add-circle';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Add" component={AddProductScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
