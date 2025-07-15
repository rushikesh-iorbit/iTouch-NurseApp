import AsyncStorage from '@react-native-async-storage/async-storage';
import { itouchServer } from '../services/nurseService'; // your configured Axios instance
import { CommonActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

let navigator: any = null; // set from outside, see below

export const setNavigatorRef = (navRef: any) => {
  navigator = navRef;
};

// export const setupAxiosInterceptors = () => {
//   itouchServer.interceptors.response.use(
//     response => response,
//     async error => {
//       const originalRequest = error.config;

//       // Token expired or invalid
//       if (
//         error.response &&
//         error.response.status === 401 &&
//         !originalRequest._retry
//       ) {
//         originalRequest._retry = true;

//         Toast.show({
//           type: 'error',
//           text1: 'Session Expired',
//           text2: 'Please login again.',
//         });

//         // Clear AsyncStorage
//         await AsyncStorage.multiRemove([
//           'authCookie', 'userName', 'orgName', 'hospitalCode', 'wardCode'
//         ]);

//         // Navigate to Login screen
//         if (navigator) {
//           navigator.dispatch(
//             CommonActions.reset({
//               index: 0,
//               routes: [{ name: 'NurseLogin' }],
//             }),
//           );
//         }

//         return Promise.reject(error);
//       }
//       return Promise.reject(error);
//     }
//   );
// };


export const setupAxiosInterceptors = () => {
  itouchServer.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Prevent retry loop
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        const status = error.response?.status;

        // Handle 401 - token expired
        if (status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Session Expired',
            text2: 'Please login again.',
          });
        }

        // Handle 302 - token invalid due to new login elsewhere
        else if (status === 302) {
          Toast.show({
            type: 'error',
            text1: 'Logged Out',
            text2: 'You have been logged in from another device.',
          });
        }

        // Handle logout action for both
        if (status === 401 || status === 302) {
          await AsyncStorage.multiRemove([
            'authCookie', 'userName', 'orgName', 'hospitalCode', 'wardCode'
          ]);

          if (navigator) {
            navigator.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'NurseLogin' }],
              }),
            );
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
