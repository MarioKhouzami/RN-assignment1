import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Product} from '../../types/Product';
import {useTheme} from '../../context/ThemeContext';

type Props = {
  product: Product;
  onPress: () => void;
};

const ProductCard: React.FC<Props> = ({product, onPress}) => {
  const {theme, themeStyles} = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        theme === 'dark' ? styles.cardDark : styles.cardLight,
      ]}>
      <Image source={{uri: product.images[0]?.url}} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.title, themeStyles.text]}>{product.title}</Text>
        <Text style={[styles.price, themeStyles.text]}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  cardLight: {
    backgroundColor: '#ffffff',
  },
  cardDark: {
    backgroundColor: '#1c1c1e',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  price: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default ProductCard;
