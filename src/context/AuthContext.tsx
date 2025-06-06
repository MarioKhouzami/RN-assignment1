import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../lib/axios';

type AuthContextType = {
  isLoggedIn: boolean;
  user: {token: string} | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (formData: FormData) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<any | null>;
  updateProfile: (formData: FormData) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<{token: string} | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) setUser({token});
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await API.post('/auth/login', {email, password});
      const {accessToken, refreshToken} = res.data.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      setUser({token: accessToken});
      return true;
    } catch (err: any) {
      console.log('Login error:', err.response?.data || err.message);
      return false;
    }
  };

  const signup = async (formData: FormData) => {
    try {
      await API.post('/auth/signup', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
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
      return res.data.data.user;
    } catch (err: any) {
      console.log('Get profile error:', err.response?.data || err.message);
      return null;
    }
  };

  const updateProfile = async (formData: FormData) => {
    try {
      const res = await API.put('/user/profile', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      return res.status === 200;
    } catch (err: any) {
      console.log('Update profile error:', err.response?.data || err.message);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        getProfile,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
