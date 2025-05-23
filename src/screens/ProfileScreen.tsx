import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColorScheme} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const {getProfile, updateProfile, logout} = useAuth();
  const {themeStyles, toggleTheme} = useTheme();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState<any>(null);

  // Set native header options, add settings button on right side
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setModalVisible(true)}
          hitSlop={10}
          style={{marginRight: 15}}>
          <Icon name="settings" size={24} color={themeStyles.text.color} />
        </Pressable>
      ),
      headerTitle: 'Profile',
      headerTitleAlign: 'center',
    });
  }, [navigation, themeStyles.text.color]);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getProfile();
      if (data) {
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } else {
        Alert.alert('Error', 'Failed to load profile');
      }
    };
    loadProfile();
  }, []);

  const handleImagePick = async () => {
    Alert.alert('Select Option', 'Choose image source', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await launchCamera({mediaType: 'photo'});
          if (!result.didCancel && result.assets?.length) {
            setImage(result.assets[0]);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await launchImageLibrary({mediaType: 'photo'});
          if (!result.didCancel && result.assets?.length) {
            setImage(result.assets[0]);
          }
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    if (image) {
      formData.append('profileImage', {
        uri: image.uri,
        name: image.fileName || 'profile.jpg',
        type: image.type || 'image/jpeg',
      } as any);
    }

    const success = await updateProfile(formData);
    if (success) {
      Alert.alert('Success', 'Profile updated');
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (!profile) {
    return (
      <View style={[styles.centered, themeStyles.background]}>
        <Text style={themeStyles.text}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        themeStyles.background,
        {paddingTop: insets.top}, // safe area top padding for content below header
      ]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleImagePick} style={styles.imageWrapper}>
          <Image
            source={{
              uri: image?.uri
                ? image.uri
                : `https://backend-practice.eurisko.me${profile.profileImage?.url}`,
            }}
            style={styles.image}
          />
          <View style={styles.editIconWrapper}>
            <Icon name="camera" size={18} color="#fff" />
          </View>
        </Pressable>

        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={[styles.input, themeStyles.text, themeStyles.background]}
          placeholder="First Name"
          placeholderTextColor="#999"
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={[styles.input, themeStyles.text, themeStyles.background]}
          placeholder="Last Name"
          placeholderTextColor="#999"
          autoCapitalize="words"
          returnKeyType="done"
        />
        <Text style={[styles.email, themeStyles.text]}>{profile.email}</Text>

        <Button title="Update Profile" onPress={handleUpdate} />
      </ScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 25,
    backgroundColor: '#ccc',
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#0008',
    borderRadius: 16,
    padding: 6,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderColor: '#ccc',
    fontSize: 18,
  },
  email: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modal: {
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 18,
  },
  modalButtonText: {
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
