import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useCart} from '../context/CartContext';
import {useTheme} from '../context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';

const CartScreen = () => {
  const {cartItems, addToCart, removeFromCart, clearCart} = useCart();
  const {themeStyles, toggleTheme} = useTheme();
  const {logout} = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Cart',
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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product.price);
      return total + price * item.quantity;
    }, 0);
  };

  const renderItem = ({item}: any) => (
    <View style={[styles.itemContainer, themeStyles.card]}>
      <Image
        source={{
          uri: item.product.images?.[0]?.url?.startsWith('/')
            ? `https://backend-practice.eurisko.me${item.product.images[0].url}`
            : item.product.images?.[0]?.url ||
              'https://via.placeholder.com/100',
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={[styles.title, themeStyles.text]}>
          {item.product.title}
        </Text>
        <Text style={[themeStyles.text]}>
          Price: ${parseFloat(item.product.price).toFixed(2)}
        </Text>
        <Text style={[themeStyles.text]}>Quantity: {item.quantity}</Text>
        <Text style={[themeStyles.text]}>
          Subtotal: $
          {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => removeFromCart(item.product._id)}
            style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => addToCart(item.product)}
            style={styles.addBtn}>
            <Text style={styles.addBtnText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, themeStyles.background]}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.product._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.emptyText, themeStyles.text]}>
            Your cart is empty.
          </Text>
        }
        contentContainerStyle={{padding: 16}}
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={[styles.totalText, themeStyles.text]}>
            Total: ${calculateTotal().toFixed(2)}
          </Text>
          <Button
            title="Clear Cart"
            color="red"
            onPress={() => {
              Alert.alert('Clear Cart', 'Are you sure?', [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: () => clearCart(),
                },
              ]);
            }}
          />
        </View>
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
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  removeBtn: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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

export default CartScreen;
