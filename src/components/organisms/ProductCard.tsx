import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

const ProductCard = ({
  product,
  onPress,
}: {
  product: any;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{
          uri: product.images?.[0]?.url || 'https://via.placeholder.com/100',
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    marginTop: 4,
    color: '#333',
  },
});

export default ProductCard;
