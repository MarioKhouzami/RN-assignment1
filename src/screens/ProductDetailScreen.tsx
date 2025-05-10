import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Share,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {HeaderBackButton} from '@react-navigation/elements';
import {Product} from '../types/Product';
import Ionicons from 'react-native-vector-icons/Ionicons';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation(); // This will give us access to the navigation object
  const {product} = route.params;

  const onShare = async () => {
    try {
      await Share.share({
        message: `${product.title} - $${product.price}\n\n${product.description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <View style={styles.header}>
          <HeaderBackButton onPress={() => navigation.goBack()} />
        </View> */}
        <Image source={{uri: product.images[0]?.url}} style={styles.image} />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.buttonGroup}>
          <Button title="Share" onPress={onShare} />
          <Button title="Add to Cart" onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 40, // Adjust based on your header's position or device's notch
    left: 10,
    zIndex: 1, // Make sure the back button is always on top
    paddingTop: 10, // To avoid it being obstructed by the notch
  },
  backButton: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 80, // Add margin to give space for the back button
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    color: '#007bff',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    marginVertical: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default ProductDetailScreen;
