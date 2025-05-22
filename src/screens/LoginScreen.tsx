import React from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {useAuth} from '../context/AuthContext';
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
  const {themeStyles, toggleTheme} = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.email, data.password);
    if (!success) {
      Alert.alert(
        'Login Failed',
        'Check your credentials or verify your email.',
      );
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
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotLinkContainer}>
        <Text style={[styles.forgotLink, themeStyles.text]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <AppButton title="Login" onPress={handleSubmit(onSubmit)} />
        <AppButton
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
        />
        <AppButton title="Toggle Theme" onPress={toggleTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  forgotLinkContainer: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  forgotLink: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#007AFF',
  },
  buttonGroup: {
    marginTop: 20,
    gap: 12,
  },
});

export default LoginScreen;
