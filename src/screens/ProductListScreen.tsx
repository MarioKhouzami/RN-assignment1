import React, {useLayoutEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Pressable,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {Product} from '../types/Product';
import products from '../data/Products.json';
import ProductCard from '../components/organisms/ProductCard';
import {RootStackParamList} from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {logout} = useAuth();
  const {themeStyles, toggleTheme} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{marginRight: 15}}>
          <Icon name="settings" size={22} color={themeStyles.text.color} />
        </Pressable>
      ),
      headerTitle: 'Products',
      headerStyle: {backgroundColor: themeStyles.background.backgroundColor},
      headerTitleStyle: {color: themeStyles.text.color},
    });
  }, [navigation, themeStyles]);

  const handlePress = (product: Product) => {
    navigation.navigate('ProductDetail', {product});
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.background]}>
      <FlatList
        data={products.data}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ProductCard product={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={toggleTheme} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Toggle Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 16,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalButton: {
    paddingVertical: 12,
  },
  modalButtonText: {
    fontSize: 16,
  },
});

export default ProductListScreen;
