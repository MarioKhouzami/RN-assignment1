import React from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useTheme} from '../context/ThemeContext';

const schema = z.object({
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

type FormData = z.infer<typeof schema>;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Verification'
>;

const VerificationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {themeStyles} = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = () => {
    Alert.alert('Verified', 'Welcome!');
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, themeStyles.background]}>
      <Text style={[styles.label, themeStyles.text]}>Enter 4-digit OTP</Text>
      <InputField
        name="otp"
        control={control}
        placeholder="1234"
        error={errors.otp?.message}
      />
      <AppButton title="Verify" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default VerificationScreen;
