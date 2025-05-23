import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import API from '../lib/axios';

const {width} = Dimensions.get('window');

type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;

const ProductDetailScreen = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const {product} = route.params;
  const {themeStyles, toggleTheme} = useTheme();
  const {user, logout} = useAuth();

  const [loadingDelete, setLoadingDelete] = useState(false);

  // Header with back and settings buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: product.title,
      headerTintColor: themeStyles.text.color,
      headerStyle: {backgroundColor: themeStyles.background.backgroundColor},
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{paddingHorizontal: 10}}>
          <Icon name="arrow-left" size={24} color={themeStyles.text.color} />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={() =>
            Alert.alert('Settings', undefined, [
              {text: 'Toggle Theme', onPress: toggleTheme},
              {text: 'Logout', onPress: logout},
              {text: 'Cancel', style: 'cancel'},
            ])
          }
          style={{paddingHorizontal: 10}}>
          <Icon name="settings" size={22} color={themeStyles.text.color} />
        </Pressable>
      ),
    });
  }, [navigation, product.title, themeStyles, toggleTheme, logout]);

  const isOwner = user?._id === product.user?._id;

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoadingDelete(true);
            try {
              await API.delete(`/products/${product._id}`);
              Alert.alert('Deleted', 'Product deleted successfully.');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete',
              );
            } finally {
              setLoadingDelete(false);
            }
          },
        },
      ],
    );
  };

  const openEmail = () => {
    if (product.user?.email) {
      Linking.openURL(`mailto:${product.user.email}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.background]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Carousel */}
        <View style={styles.swiperContainer}>
          {product.images?.length > 0 ? (
            <Swiper
              style={styles.wrapper}
              showsButtons={false}
              autoplay
              autoplayTimeout={4}
              activeDotColor={themeStyles.text.color}>
              {product.images.map(image => (
                <View key={image._id} style={styles.slide}>
                  <Image
                    source={{
                      uri: image.url.startsWith('http')
                        ? image.url
                        : `${API.defaults.baseURL}${image.url}`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
          ) : (
            <View style={[styles.noImageContainer, themeStyles.background]}>
              <Text style={themeStyles.text}>No images available</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.title, themeStyles.text]}>{product.title}</Text>
          <Text style={[styles.price, themeStyles.text]}>${product.price}</Text>
          <Text style={[styles.description, themeStyles.text]}>
            {product.description}
          </Text>
        </View>

        {/* Map Location */}
        {product.location?.latitude && product.location?.longitude && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: product.location.latitude,
                longitude: product.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}>
              <Marker
                coordinate={{
                  latitude: product.location.latitude,
                  longitude: product.location.longitude,
                }}
                title={product.location.name || 'Location'}
              />
            </MapView>
            <Text style={[styles.locationName, themeStyles.text]}>
              {product.location.name}
            </Text>
          </View>
        )}

        {/* Owner Info */}
        <View style={styles.ownerContainer}>
          <Text style={[styles.ownerLabel, themeStyles.text]}>Owner:</Text>
          <TouchableOpacity onPress={openEmail}>
            <Text style={[styles.ownerEmail, {color: '#007AFF'}]}>
              {product.user?.email || 'N/A'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Edit & Delete buttons (only owner) */}
        {isOwner && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate('ProductDetail', {product})}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={loadingDelete}>
              {loadingDelete ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

import {Image} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  swiperContainer: {
    height: 300,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width,
    height: 300,
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  infoContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
  },
  mapContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  map: {
    flex: 1,
  },
  locationName: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16,
  },
  ownerContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  ownerEmail: {
    textDecorationLine: 'underline',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4caf50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDetailScreen;
