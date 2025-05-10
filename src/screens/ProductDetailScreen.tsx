import React, {useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  useWindowDimensions,
  Share,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useTheme} from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const navigation = useNavigation();
  const {product} = route.params;
  const {themeStyles, theme, toggleTheme} = useTheme();
  const {width} = useWindowDimensions();

  // Share functionality
  const onShare = async () => {
    try {
      await Share.share({
        message: `${product.title} - $${product.price}\n\n${product.description}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Add to Cart functionality (you can implement cart functionality later)
  const handleAddToCart = () => {
    console.log('Add to Cart:', product.title);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: product.title,
      headerStyle: {
        backgroundColor: theme === 'dark' ? '#121212' : '#fff',
      },
      headerTintColor: theme === 'dark' ? '#fff' : '#000',
      headerBackImage: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color={theme === 'dark' ? '#fff' : '#000'}
        />
      ),
      headerRight: () => (
        <Ionicons
          name={theme === 'dark' ? 'sunny' : 'moon'}
          size={24}
          color={theme === 'dark' ? '#fff' : '#000'}
          onPress={toggleTheme}
          style={{marginRight: 10}}
        />
      ),
    });
  }, [navigation, product.title, theme, toggleTheme]);

  return (
    <ScrollView
      style={[styles.screen, themeStyles.background]}
      contentContainerStyle={[styles.container]}>
      <Image
        source={{uri: product.images[0]?.url}}
        style={[styles.image, {width: width - 32}]}
      />
      <Text style={[styles.title, themeStyles.text]}>{product.title}</Text>
      <Text style={[styles.price, themeStyles.text]}>${product.price}</Text>
      <Text style={[styles.description, themeStyles.text]}>
        {product.description}
      </Text>

      <View style={styles.buttonGroup}>
        <Button title="Add to Cart" onPress={handleAddToCart} />
        <Button title="Share" onPress={onShare} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
});

export default ProductDetailScreen;
