import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

export default function ProductCard({product}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        /* Navigate to detail */
      }}>
      <Image source={{uri: product.images[0].url}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{product.title}</Text>
        <Text>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {flexDirection: 'row', marginBottom: 12},
  image: {width: 100, height: 100},
  info: {marginLeft: 12, justifyContent: 'center'},
  title: {fontWeight: 'bold'},
});
