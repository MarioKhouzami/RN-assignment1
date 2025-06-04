import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import API from '../lib/axios';
import {Product} from '../types/Product';
import {useCart} from '../context/CartContext';

const ProductListScreen = () => {
  const {addToCart} = useCart();

  const navigation = useNavigation();
  const {logout} = useAuth();
  const {themeStyles, toggleTheme} = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Products',
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

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return sortAsc ? priceA - priceB : priceB - priceA;
    });

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderItem = ({item}: {item: Product}) => (
    <View style={[styles.card, themeStyles.card]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetail', {
            product: item,
          })
        }>
        <Image
          source={{
            uri: item.images?.[0]?.url?.startsWith('/')
              ? `https://backend-practice.eurisko.me${item.images[0].url}`
              : item.images?.[0]?.url || '',
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={[styles.title, themeStyles.text]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.price, themeStyles.text]}>${item.price}</Text>
        <TouchableOpacity
          onPress={() => addToCart(item)}
          style={styles.cartButton}>
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, themeStyles.background]}>
      <View style={styles.searchSortRow}>
        <TextInput
          style={[styles.input, themeStyles.input]}
          placeholder="Search by name"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setSortAsc(!sortAsc)}>
          <Icon
            name={sortAsc ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={themeStyles.text.color}
            style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{marginTop: 40}} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{padding: 10}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <Text style={[themeStyles.text, {textAlign: 'center'}]}>
              No products found
            </Text>
          }
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
  container: {flex: 1},
  searchSortRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: '#ccc',
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#ddd',
  },
  info: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    fontSize: 14,
    marginTop: 4,
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
  cartButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductListScreen;
