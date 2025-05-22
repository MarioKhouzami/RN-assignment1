import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../lib/axios';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (formData: FormData) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => void;
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
      const res = await API.post('/auth/login', {email, password});
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
        headers: {'Content-Type': 'multipart/form-data'},
      });
      console.log('Signup response:', res.data);
      return res.status === 200 || res.status === 201;
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

  const forgotPassword = async (email: string) => {
    try {
      const res = await API.post('/auth/forgot-password', {email});
      return res.status === 200;
    } catch (err: any) {
      console.log('Forgot password error:', err.response?.data || err.message);
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
        forgotPassword,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
