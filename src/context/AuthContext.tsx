import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://backend-practice.eurisko.me/api',
});

API.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (formData: FormData) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<any | null>;
  updateProfileImage: (formData: FormData) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) setIsLoggedIn(true);
    };
    checkToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await API.post('/auth/login', {
        email,
        password,
      });
      const {accessToken, refreshToken} = res.data.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      setIsLoggedIn(true);
      return true;
    } catch (err: any) {
      console.log('Login error:', err.response?.data || err.message);
      return false;
    }
  };

  const signup = async (formData: FormData) => {
    try {
      const res = await API.post('/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Signup success:', res.data);
      return true;
    } catch (err: any) {
      console.log('Signup error:', err.response?.data || err.message);
      return false;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await API.post('/auth/verify-otp', {email, otp});
      return res.status === 200;
    } catch (err: any) {
      console.log('Verify OTP error:', err.response?.data || err.message);
      return false;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      const res = await API.post('/auth/resend-verification-otp', {email});
      return res.status === 200;
    } catch (err: any) {
      console.log('Resend OTP error:', err.response?.data || err.message);
      return false;
    }
  };

  const getProfile = async () => {
    try {
      const res = await API.get('/user/profile');
      return res.data.data;
    } catch (err) {
      console.log('Get profile error:', err.response?.data || err.message);
      return null;
    }
  };

  const updateProfileImage = async (formData: FormData) => {
    try {
      const res = await API.patch('/user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.status === 200;
    } catch (err: any) {
      console.log(
        'Update profile image error:',
        err.response?.data || err.message,
      );
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        getProfile,
        updateProfileImage,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
