import AsyncStorage from '@react-native-async-storage/async-storage';
import { itouchServer } from '../services/nurseService'; // your configured Axios instance
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

let navigator: any = null; // set from outside, see below

export const setNavigatorRef = (navRef: any) => {
  navigator = navRef;
};

export const setupAxiosInterceptors = () => {
  itouchServer.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Token expired or invalid
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        Toast.show({
          type: 'error',
          text1: 'Session Expired',
          text2: 'Please login again.',
        });

        // Clear AsyncStorage
        await AsyncStorage.multiRemove([
          'authCookie', 'userName', 'orgName', 'hospitalCode', 'wardCode'
        ]);

        // Navigate to Login screen
        if (navigator) {
          navigator.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'NurseLogin' }],
            }),
          );
        }

        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );
};

