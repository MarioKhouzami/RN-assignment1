// components/ProductCard.tsx
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  product: any;
  onPress: () => void;
  onAddToCart?: () => void;
};

const ProductCard: React.FC<Props> = ({product, onPress, onAddToCart}) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(1, {duration: 400});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <TouchableOpacity style={styles.inner} onPress={onPress}>
        <Image
          source={{
            uri: product.images?.[0]?.url
              ? `https://backend-practice.eurisko.me${product.images[0].url}`
              : 'https://via.placeholder.com/100',
          }}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.title}
          </Text>
          <Text style={styles.price}>${product.price}</Text>
          {onAddToCart && (
            <View style={styles.buttonContainer}>
              <Button title="Add to Cart" onPress={onAddToCart} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inner: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    marginTop: 4,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

export default ProductCard;
