import React, {useState} from 'react';
import {View, StyleSheet, Alert, Image} from 'react-native';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import InputField from '../components/molecules/InputField';
import AppButton from '../components/atoms/AppButton';
import {useAuth} from '../context/AuthContext';
import {RootStackParamList} from '../navigation/AppNavigator';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const {signup} = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [image, setImage] = useState<Asset | null>(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const openPicker = () => {
    Alert.alert('Select Image', 'Choose a method', [
      {
        text: 'Camera',
        onPress: () =>
          launchCamera({mediaType: 'photo'}, response => {
            if (!response.didCancel && response.assets?.length) {
              setImage(response.assets[0]);
            }
          }),
      },
      {
        text: 'Gallery',
        onPress: () =>
          launchImageLibrary({mediaType: 'photo'}, response => {
            if (!response.didCancel && response.assets?.length) {
              setImage(response.assets[0]);
            }
          }),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const onSubmit = async (data: SignUpForm) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (image?.uri) {
      formData.append('profileImage', {
        uri: image.uri,
        name: image.fileName ?? 'image.jpg',
        type: image.type ?? 'image/jpeg',
      } as any);
    }

    const result = await signup(formData);
    if (result === true) {
      Alert.alert('Success', 'Proceed to OTP verification.');
      navigation.navigate('Verification', {email: data.email});
    } else {
      Alert.alert('Signup Error', result as string);
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        name="firstName"
        control={control}
        placeholder="First Name"
        error={errors.firstName?.message}
      />
      <InputField
        name="lastName"
        control={control}
        placeholder="Last Name"
        error={errors.lastName?.message}
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
      <AppButton title="Pick Profile Image" onPress={openPicker} />
      {image?.uri && <Image source={{uri: image.uri}} style={styles.preview} />}
      <AppButton title="Sign Up" onPress={handleSubmit(onSubmit)} />
      <AppButton title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 20},
  preview: {width: 100, height: 100, borderRadius: 8, marginVertical: 10},
});

export default SignUpScreen;
