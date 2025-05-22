import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {useAuth} from '../context/AuthContext';

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

const ForgotPasswordScreen: React.FC = () => {
  const {forgotPassword} = useAuth();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async ({email}: ForgotForm) => {
    const success = await forgotPassword(email);
    Alert.alert(
      success ? 'Email Sent' : 'Error',
      success
        ? 'Check your email for reset instructions.'
        : 'Could not send reset email.',
    );
  };

  return (
    <View style={styles.container}>
      <InputField
        name="email"
        control={control}
        placeholder="Enter your email"
        error={errors.email?.message}
      />
      <AppButton title="Send Reset Email" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
});

export default ForgotPasswordScreen;
