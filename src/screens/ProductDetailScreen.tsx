// src/screens/ProductDetailScreen.tsx
import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
  TouchableOpacity,
  Linking,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Feather';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-camera-roll/camera-roll';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import API from '../lib/axios';
import {RootStackParamList} from '../navigation/AppNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<Props> = () => {
  const {params} = useRoute<Props['route']>();
  const {product} = params;
  const {user, logout} = useAuth();
  const {themeStyles, toggleTheme} = useTheme();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Product Details',
      headerStyle: {backgroundColor: themeStyles.background.backgroundColor},
      headerTitleStyle: {color: themeStyles.text.color},
      headerRight: () => (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{marginRight: 15}}>
          <Icon name="settings" size={22} color={themeStyles.text.color} />
        </Pressable>
      ),
    });
  }, [navigation, themeStyles]);

  const handleSaveImage = async (imageUrl: string) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission denied',
            'Cannot save image without permission',
          );
          return;
        }
      }

      const filename = imageUrl.split('/').pop();
      const destPath = `${RNFS.CachesDirectoryPath}/${filename}`;

      const fullUrl = `https://backend-practice.eurisko.me${imageUrl}`;
      const download = await RNFS.downloadFile({
        fromUrl: fullUrl,
        toFile: destPath,
      }).promise;
      if (download.statusCode === 200) {
        await CameraRoll.save(destPath);
        Alert.alert('Success', 'Image saved to gallery');
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm', 'Delete this product?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await API.delete(`/products/${product._id}`, {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            });
            if (res.data.success) {
              Alert.alert('Deleted', 'Product deleted successfully');
              navigation.goBack();
            }
          } catch (err: any) {
            Alert.alert(
              'Error',
              err.response?.data?.message || 'Failed to delete product',
            );
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    navigation.navigate('Add', {editProduct: product});
  };

  const goToOwnerProfile = () => {
    navigation.navigate('UserProfile', {userId: product.user._id});
  };

  return (
    <ScrollView style={[styles.container, themeStyles.background]}>
      <Swiper height={250} loop showsPagination={true}>
        {product.images.map((img: any, index: number) => (
          <Pressable
            key={index}
            onLongPress={() => handleSaveImage(img.url)}
            style={styles.imageContainer}>
            <Image
              source={{uri: `https://backend-practice.eurisko.me${img.url}`}}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </Swiper>

      <View style={{padding: 16}}>
        <Text style={[styles.title, themeStyles.text]}>{product.title}</Text>
        <Text style={[styles.price, themeStyles.text]}>${product.price}</Text>
        <Text style={[styles.description, themeStyles.text]}>
          {product.description}
        </Text>

        <Text style={[styles.sectionTitle, themeStyles.text]}>Location</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: product.location.latitude,
            longitude: product.location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}>
          <Marker
            coordinate={{
              latitude: product.location.latitude,
              longitude: product.location.longitude,
            }}
            title={product.location.name}
          />
        </MapView>
        <Text style={[themeStyles.text, {marginTop: 8}]}>
          {product.location.name}
        </Text>

        <Text style={[styles.sectionTitle, themeStyles.text]}>Owner</Text>
        <TouchableOpacity onPress={goToOwnerProfile}>
          <Text style={[themeStyles.text, styles.ownerText]}>
            {product.user?.email || 'Unknown User'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`mailto:${product.user?.email}`)}
          style={styles.emailButton}>
          <Text style={styles.emailButtonText}>Contact via Email</Text>
        </TouchableOpacity>

        {user?.userId === product.user?._id && (
          <>
            <View style={{height: 10}} />
            <Button title="Edit Product" onPress={handleEdit} />
            <View style={{height: 10}} />
            <Button title="Delete Product" color="red" onPress={handleDelete} />
          </>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={[styles.modal, themeStyles.modal]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Settings</Text>
            <TouchableOpacity onPress={toggleTheme} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, themeStyles.text]}>
                Toggle Theme
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, themeStyles.text]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  imageContainer: {width: '100%', height: 250},
  image: {width: '100%', height: '100%'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 8},
  price: {fontSize: 18, fontWeight: '600', marginBottom: 8},
  description: {fontSize: 16, marginBottom: 16},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  map: {width: '100%', height: 200, borderRadius: 8},
  emailButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  emailButtonText: {color: 'white', fontWeight: 'bold'},
  ownerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 12},
  modalButton: {paddingVertical: 12},
  modalButtonText: {fontSize: 16},
});

export default ProductDetailScreen;
