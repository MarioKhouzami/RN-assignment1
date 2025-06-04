import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
  Pressable,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import API from '../lib/axios';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {GOOGLE_API_KEY} from '@env';

const LEBANON_COORDS = {
  latitude: 33.8938,
  longitude: 35.5018,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
});

type FormData = z.infer<typeof schema>;

const AddProductScreen: React.FC = () => {
  const {user, logout} = useAuth();
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<FormData>({resolver: zodResolver(schema)});

  const [images, setImages] = useState<any[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {themeStyles, toggleTheme} = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Add Product',
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

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5 - images.length,
      });
      if (result.assets)
        setImages(prev => [...prev, ...result.assets].slice(0, 5));
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const handleCameraLaunch = async () => {
    try {
      const result = await launchCamera({mediaType: 'photo'});
      if (result.assets)
        setImages(prev => [...prev, ...result.assets].slice(0, 5));
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleLocationSelect = async (coords: {
    latitude: number;
    longitude: number;
  }) => {
    setLocation(coords);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_API_KEY}`,
      );
      const data = await response.json();

      const addressComponents = data.results?.[0]?.address_components || [];
      let city = '';

      for (const component of addressComponents) {
        if (component.types.includes('locality')) {
          city = component.long_name;
          break;
        }
      }

      // Fallback to formatted address or unknown
      setAddress(
        city ||
          data.results?.[0]?.formatted_address ||
          `Unknown location at (${coords.latitude.toFixed(
            4,
          )}, ${coords.longitude.toFixed(4)})`,
      );
    } catch (error) {
      setAddress(
        `Unknown location at (${coords.latitude.toFixed(
          4,
        )}, ${coords.longitude.toFixed(4)})`,
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user?.token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
      return;
    }

    if (images.length > 5) {
      Alert.alert('Error', 'Maximum 5 images allowed');
      return;
    }

    const invalidImages = images.some(
      img => !['image/jpeg', 'image/png'].includes(img.type),
    );
    if (invalidImages) {
      Alert.alert('Error', 'Only JPEG/PNG images allowed');
      return;
    }

    if (!location || !address) {
      Alert.alert('Error', 'Please select a location.');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    try {
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);

      // FIXED: Append location as individual keys
      formData.append('location[name]', address);
      formData.append('location[latitude]', location.latitude.toString());
      formData.append('location[longitude]', location.longitude.toString());

      images.forEach((img, index) => {
        formData.append('images', {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.fileName || `image_${index}.jpg`,
        });
      });

      const response = await API.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.data.success) {
        Alert.alert('Success', 'Product created successfully');
        reset();
        setImages([]);
        setLocation(null);
        setAddress('');
      } else {
        throw new Error(response.data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      Alert.alert('Error', errorMessage || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, themeStyles.background]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.label, themeStyles.text]}>Title</Text>
        <Controller
          control={control}
          name="title"
          render={({field: {onChange, value}}) => (
            <TextInput
              style={[styles.input, themeStyles.input]}
              placeholder="Enter product title"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.title && (
          <Text style={styles.error}>{errors.title.message}</Text>
        )}

        <Text style={[styles.label, themeStyles.text]}>Description</Text>
        <Controller
          control={control}
          name="description"
          render={({field: {onChange, value}}) => (
            <TextInput
              multiline
              numberOfLines={4}
              style={[
                styles.input,
                {height: 100, textAlignVertical: 'top'},
                themeStyles.input,
              ]}
              placeholder="Enter product description"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description.message}</Text>
        )}

        <Text style={[styles.label, themeStyles.text]}>Price</Text>
        <Controller
          control={control}
          name="price"
          render={({field: {onChange, value}}) => (
            <TextInput
              keyboardType="numeric"
              style={[styles.input, themeStyles.input]}
              placeholder="Enter price"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.price && (
          <Text style={styles.error}>{errors.price.message}</Text>
        )}

        <View style={styles.imageControls}>
          <Button
            title={`Pick Images (${images.length}/5)`}
            onPress={handleImagePick}
            disabled={loading || images.length >= 5}
          />
          <View style={{width: 10}} />
          <Button
            title="Take Photo"
            onPress={handleCameraLaunch}
            disabled={loading || images.length >= 5}
          />
        </View>

        <ScrollView horizontal style={{marginTop: 10}}>
          {images.map((img, index) => (
            <Image
              key={index}
              source={{uri: img.uri}}
              style={{
                width: 100,
                height: 100,
                marginRight: 10,
                borderRadius: 4,
              }}
            />
          ))}
        </ScrollView>

        <View style={{marginTop: 16}}>
          <Text style={[styles.label, themeStyles.text]}>Location</Text>
          <Button
            title={location ? 'Change Location' : 'Add Location'}
            onPress={() => setLocationModalVisible(true)}
            disabled={loading}
          />

          {location && (
            <>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  ...location,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                scrollEnabled={false}
                zoomEnabled={false}>
                <Marker coordinate={location}>
                  <View
                    style={{
                      backgroundColor: '#007AFF',
                      padding: 5,
                      borderRadius: 20,
                    }}>
                    <Icon name="map-pin" size={20} color="white" />
                  </View>
                </Marker>
              </MapView>
              {address && (
                <Text style={[themeStyles.text, {marginTop: 8, fontSize: 14}]}>
                  {address}
                </Text>
              )}
            </>
          )}
        </View>

        <Button
          title={loading ? 'Submitting...' : 'Submit Product'}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />
      </ScrollView>

      <Modal visible={locationModalVisible} animationType="slide">
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: themeStyles.background.backgroundColor,
          }}>
          <View
            style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
            <Icon
              name="arrow-left"
              size={24}
              color={themeStyles.text.color}
              onPress={() => setLocationModalVisible(false)}
              style={{marginRight: 10}}
            />
            <TextInput
              style={[
                styles.input,
                {flex: 1},
                themeStyles.input,
                {color: themeStyles.text.color},
              ]}
              placeholder="Search location in Lebanon"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
            />
          </View>

          <MapView
            style={{flex: 1}}
            provider={PROVIDER_GOOGLE}
            initialRegion={LEBANON_COORDS}
            onPress={e => handleLocationSelect(e.nativeEvent.coordinate)}>
            {location && (
              <Marker coordinate={location}>
                <View
                  style={{
                    backgroundColor: '#007AFF',
                    padding: 5,
                    borderRadius: 20,
                  }}>
                  <Icon name="map-pin" size={20} color="white" />
                </View>
              </Marker>
            )}
          </MapView>

          <View style={{padding: 16}}>
            <Button
              title="Confirm Location"
              onPress={() => setLocationModalVisible(false)}
              disabled={!location}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={[styles.modal, themeStyles.background]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  container: {padding: 16},
  label: {marginTop: 10, fontWeight: 'bold'},
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
    borderColor: '#ccc',
  },
  error: {color: 'red', fontSize: 12},
  imageControls: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
  },
  map: {width: '100%', height: 200, marginTop: 12, borderRadius: 8},
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

export default AddProductScreen;
