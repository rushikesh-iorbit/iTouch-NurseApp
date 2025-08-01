// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Toast from 'react-native-toast-message';
// import { enableScreens } from 'react-native-screens';

// import AppNavigator from './src/navigation/AppNavigator';
// import { setupAxiosInterceptors, setNavigatorRef } from './src/utils/axiosInterceptor';
// import { navigationRef } from './src/navigation/navigationService';

// import { requestUserPermission, notificationListener, getFCMToken } from './src/utils/notification'; // 🔸 import notification setup

// enableScreens();

// export default function App() {
//   useEffect(() => {
//     setupAxiosInterceptors(); // Axios interceptors
//     requestUserPermission(); // 🔹 Ask for FCM permissions
//     getFCMToken();           // 🔹 Log or send FCM token
//     notificationListener();  // 🔹 Start listening for FCM notifications
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <NavigationContainer
//         ref={navigationRef}
//         onReady={() => {
//           setNavigatorRef(navigationRef.current);
//         }}
//       >
//         <AppNavigator />
//       </NavigationContainer>
//       <Toast />
//     </SafeAreaProvider>
//   );
// }


// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { enableScreens } from 'react-native-screens';
import notifee from '@notifee/react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { setupAxiosInterceptors, setNavigatorRef } from './src/utils/axiosInterceptor';
import { navigationRef } from './src/navigation/navigationService';
import { requestUserPermission, notificationListener, getFCMToken } from './src/utils/notification';
import Orientation from 'react-native-orientation-locker';

enableScreens();

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        setupAxiosInterceptors();
        await requestUserPermission();
        const token = await getFCMToken();
        await notificationListener();
        
        await notifee.requestPermission();
      } catch (error) {
        console.error('Notification setup error:', error);
      }
    };

    setupNotifications();
    Orientation.lockToLandscape();  // Lock orientation to landscape

  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setNavigatorRef(navigationRef.current);
        }}
      >
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}