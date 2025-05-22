import React, {useState} from 'react';
import {View, StyleSheet, Alert, ScrollView, Image, Text} from 'react-native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native-safe-area-context';

import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {useTheme} from '../context/ThemeContext';
import {useMutation} from '@tanstack/react-query';
import API from '../lib/axios';

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof schema>;

const AddProductScreen: React.FC = () => {
  const {themeStyles} = useTheme();
  const [image, setImage] = useState<Asset | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const pickImage = () => {
    Alert.alert('Select Image', 'Choose a method', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera({mediaType: 'photo'}, res => {
            if (!res.didCancel && res.assets?.length) {
              setImage(res.assets[0]);
            }
          }),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary({mediaType: 'photo'}, res => {
            if (!res.didCancel && res.assets?.length) {
              setImage(res.assets[0]);
            }
          }),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await API.post('/api/products', formData);
      return res.data;
    },
    onSuccess: () => Alert.alert('Success', 'Product added successfully'),
    onError: () => Alert.alert('Error', 'Something went wrong'),
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    if (image?.uri) {
      formData.append('images', {
        uri: image.uri,
        name: image.fileName ?? 'product.jpg',
        type: image.type ?? 'image/jpeg',
      } as any);
    }
    mutation.mutate(formData);
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.background]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <InputField
          name="name"
          control={control}
          placeholder="Product Name"
          error={errors.name?.message}
        />
        <InputField
          name="description"
          control={control}
          placeholder="Description"
          error={errors.description?.message}
        />
        <InputField
          name="price"
          control={control}
          placeholder="Price"
          keyboardType="numeric"
          error={errors.price?.message}
        />
        <AppButton title="Pick Image" onPress={pickImage} />
        {image?.uri && <Image source={{uri: image.uri}} style={styles.image} />}
        <AppButton title="Add Product" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default AddProductScreen;
