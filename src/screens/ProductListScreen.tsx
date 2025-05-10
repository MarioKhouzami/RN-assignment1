import React, {useLayoutEffect} from 'react';
import {FlatList, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAuth} from '../context/AuthContext';
import {Product} from '../types/Product';
import products from '../data/Products.json';
import ProductCard from '../components/organisms/ProductCard';
import {RootStackParamList} from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductList'
>;

const ProductListScreen: React.FC = () => {
  const {logout} = useAuth();
  const navigation = useNavigation<NavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Sign Out" onPress={logout} />,
    });
  }, [navigation, logout]);

  const handlePress = (product: Product) => {
    navigation.navigate('ProductDetail', {product});
  };

  return (
    <SafeAreaView style={styles.container}>
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
    backgroundColor: '#f9f9f9',
  },
  list: {
    paddingBottom: 16,
  },
});

export default ProductListScreen;
