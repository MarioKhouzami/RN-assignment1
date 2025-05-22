import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {productSchema} from '../utils/validation';
import {z} from 'zod';

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductScreen() {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductFormData) => {
    // API call to add product
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Product Title"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      {/* Add other fields similarly */}
      <Button title="Add Product" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  input: {borderBottomWidth: 1, marginBottom: 12},
});
