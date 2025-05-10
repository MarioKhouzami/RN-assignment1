import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuth} from '../context/AuthContext';
import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useTheme} from '../context/ThemeContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const {login} = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const {themeStyles} = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    if (
      data.email === 'eurisko@academy.com' &&
      data.password === 'academy2025'
    ) {
      login();
    } else {
      Alert.alert('Invalid credentials');
    }
  };

  return (
    <View style={[styles.container, themeStyles.background]}>
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
      <AppButton title="Login" onPress={handleSubmit(onSubmit)} />
      <AppButton
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
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

export default LoginScreen;
