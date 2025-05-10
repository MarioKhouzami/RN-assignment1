import React, {useLayoutEffect} from 'react';
import {FlatList, StyleSheet, Button, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAuth} from '../context/AuthContext';
import {Product} from '../types/Product';
import products from '../data/Products.json';
import ProductCard from '../components/organisms/ProductCard';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useTheme} from '../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

const ProductListScreen: React.FC = () => {
  const {logout} = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const {themeStyles, toggleTheme} = useTheme();

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <Button title="Sign Out" onPress={logout} />,
  //   });
  // }, [navigation, logout]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row', gap: 10}}>
          <Button title="Toggle Theme" onPress={toggleTheme} />
          <Button title="Sign Out" onPress={logout} />
        </View>
      ),
    });
  }, [navigation, logout, toggleTheme]);

  const handlePress = (product: Product) => {
    navigation.navigate('ProductDetail', {product});
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.background]}>
      <FlatList
        data={products.data}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ProductCard product={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 16,
  },
});

export default ProductListScreen;
