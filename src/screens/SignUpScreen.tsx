import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';
import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useTheme} from '../context/ThemeContext';

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {themeStyles} = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = () => {
    Alert.alert('Account Created', 'Proceed to verify your account');
    navigation.navigate('Verification');
  };

  return (
    <View style={[styles.container, themeStyles.background]}>
      <InputField
        name="name"
        control={control}
        placeholder="Name"
        error={errors.name?.message}
      />
      <InputField
        name="email"
        control={control}
        placeholder="Email"
        error={errors.email?.message}
      />
      <InputField
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
        error={errors.password?.message}
      />
      <InputField
        name="phone"
        control={control}
        placeholder="Phone"
        error={errors.phone?.message}
      />
      <AppButton title="Create Account" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default SignUpScreen;
