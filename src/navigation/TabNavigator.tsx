import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductListScreen from '../screens/ProductListScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {useTheme} from '../context/ThemeContext'; // import your theme hook
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CartScreen from '../screens/CartScreen';
import {useCart} from '../context/CartContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const {getItemCount} = useCart(); // ✅ Access it like this
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? '#121212' : '#fff',
          borderBottomColor: isDark ? '#333' : '#ccc',
          borderBottomWidth: 1,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: isDark ? '#fff' : '#000',
        tabBarActiveTintColor: isDark ? '#fff' : '#000',
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#fff',
          borderTopColor: isDark ? '#333' : '#ccc',
          height: 60 + insets.bottom, // add safe area inset height here
          paddingBottom: 5 + insets.bottom, // add safe area bottom padding
          paddingTop: 5,
        },
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name === 'Products') iconName = 'list';
          else if (route.name === 'Add') iconName = 'add-circle';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Cart') iconName = 'cart';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Add" component={AddProductScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: getItemCount() > 0 ? getItemCount() : undefined,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
