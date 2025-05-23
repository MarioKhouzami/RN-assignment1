import React, {useEffect, useState, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import API from '../lib/axios';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {debounce} from 'lodash';

const ProductListScreen = () => {
  const {logout} = useAuth();
  const {themeStyles, toggleTheme} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchProducts = async (isRefresh = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await API.get('/products', {
        params: {
          page: isRefresh ? 1 : page,
          limit: 10,
          search,
          sort,
        },
      });
      const data = response.data.data;

      if (isRefresh) {
        setProducts(data);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }

      setHasMore(data.length > 0);
    } catch (err: any) {
      console.log('Fetch error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(() => fetchProducts(true), 500),
    [search, sort],
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
  };

  useEffect(() => {
    debouncedSearch();
  }, [search, sort]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Products',
      headerRight: () => (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{marginRight: 15}}>
          <Icon name="settings" size={22} color={themeStyles.text.color} />
        </Pressable>
      ),
    });
  }, [navigation, themeStyles]);

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[styles.card, themeStyles.card]}
      onPress={() => navigation.navigate('ProductDetail', {product: item})}>
      <Image
        source={{
          uri: item.images?.[0]?.url || 'https://via.placeholder.com/300',
        }}
        style={styles.image}
      />
      <View style={styles.cardBody}>
        <Text style={[styles.title, themeStyles.text]}>{item.title}</Text>
        <Text style={[styles.price, themeStyles.text]}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, themeStyles.background]}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
          style={[styles.searchInput, themeStyles.input, themeStyles.text]}
        />
        <TouchableOpacity
          onPress={() => setSort(prev => (prev === 'asc' ? 'desc' : 'asc'))}>
          <Icon name="filter" size={20} color={themeStyles.text.color} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onEndReached={() => hasMore && fetchProducts()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={themeStyles.text.color}
          />
        }
        ListFooterComponent={() =>
          loading && !refreshing ? <ActivityIndicator size="large" /> : null
        }
      />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: '#ccc',
  },
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardBody: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 4,
    fontSize: 14,
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

export default ProductListScreen;
