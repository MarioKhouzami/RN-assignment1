import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import API from '../lib/axios';
import {Product} from '../types/Product';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const userId = route.params?.userId;
  const {user, logout} = useAuth();
  const {themeStyles, toggleTheme} = useTheme();

  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'User Profile',
      headerStyle: {
        backgroundColor: themeStyles.background.backgroundColor,
      },
      headerTitleStyle: {
        color: themeStyles.text.color,
      },
      headerRight: () => (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{marginRight: 15}}>
          <Icon name="settings" size={22} color={themeStyles.text.color} />
        </Pressable>
      ),
    });
  }, [navigation, themeStyles]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await API.get(`/user/profile/${userId}`, {
          headers: {Authorization: `Bearer ${user?.token}`},
        });
        setProfile(profileRes.data.data.user);

        const productRes = await API.get(`/products`, {
          headers: {Authorization: `Bearer ${user?.token}`},
        });
        const userProducts = productRes.data.data.filter(
          (item: any) => item.user._id === userId,
        );
        setProducts(userProducts);
      } catch (err: any) {
        console.log('Fetch error:', err.response?.data || err.message);
        Alert.alert('Error', 'Failed to load profile or products');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const renderItem = ({item}: {item: Product}) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() => navigation.navigate('ProductDetail', {product: item})}>
      <Image
        source={{
          uri: `https://backend-practice.eurisko.me${item.images[0]?.url}`,
        }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, themeStyles.text]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={themeStyles.text}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.center, themeStyles.background]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.center, themeStyles.background]}>
        <Text style={themeStyles.text}>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, themeStyles.background]}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: `https://backend-practice.eurisko.me${profile.profileImage?.url}`,
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.name, themeStyles.text]}>
          {profile.firstName} {profile.lastName}
        </Text>
        <Text style={themeStyles.text}>{profile.email}</Text>
      </View>

      <Text style={[styles.sectionTitle, themeStyles.text]}>
        Listed Products
      </Text>
      {products.length === 0 ? (
        <Text style={[{padding: 16}, themeStyles.text]}>
          No products listed.
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: 16}}
        />
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#fff',
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
});

export default UserProfileScreen;
