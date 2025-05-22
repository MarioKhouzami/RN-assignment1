import React, {useEffect, useState} from 'react';
import {View, FlatList, TextInput, Button, StyleSheet} from 'react-native';
import ProductCard from '../components/organisms/ProductCard';
import {fetchProducts} from '../services/api';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const loadProducts = async () => {
    const data = await fetchProducts(search);
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search products"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        renderItem={({item}) => <ProductCard product={item} />}
        onRefresh={loadProducts}
        refreshing={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  input: {borderBottomWidth: 1, marginBottom: 12},
});
