import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useAuth} from '../context/AuthContext';

type RouteParams = RouteProp<RootStackParamList, 'Verification'>;

const otpSchema = z.object({
  otp: z.string().min(4, 'OTP must be 4 digits'),
});

type OtpForm = z.infer<typeof otpSchema>;

const VerificationScreen: React.FC = () => {
  const {verifyOtp, resendOtp} = useAuth();
  const navigation = useNavigation();
  const route = useRoute<RouteParams>();
  const {email} = route.params;

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async ({otp}: OtpForm) => {
    const success = await verifyOtp(email, otp);
    if (success) {
      Alert.alert('Success', 'Email verified successfully');
      navigation.navigate('Login');
    } else {
      Alert.alert('Verification Failed', 'Incorrect or expired OTP');
    }
  };

  const handleResend = async () => {
    const success = await resendOtp(email);
    Alert.alert(
      success ? 'OTP Sent' : 'Error',
      success
        ? 'A new OTP has been sent to your email.'
        : 'Failed to resend OTP.',
    );
  };

  return (
    <View style={styles.container}>
      <InputField
        name="otp"
        control={control}
        placeholder="Enter OTP from your email"
        keyboardType="number-pad"
        error={errors.otp?.message}
      />
      <AppButton title="Verify OTP" onPress={handleSubmit(onSubmit)} />
      <AppButton title="Resend OTP" onPress={handleResend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
});

export default VerificationScreen;
