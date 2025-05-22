import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Linking,
} from 'react-native';

export default function ProductDetailScreen({route}) {
  const {product} = route.params;

  const contactOwner = () => {
    Linking.openURL(`mailto:${product.owner.email}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: product.images[0].url}} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text>{product.description}</Text>
      <Text>${product.price}</Text>
      {/* MapView can be added here */}
      <Button title="Contact Owner" onPress={contactOwner} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  image: {width: '100%', height: 200},
  title: {fontSize: 24, fontWeight: 'bold', marginVertical: 12},
});
