import React, { useEffect, useRef }  from 'react';
import { View } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
// import SvgWardSvg4 from './src/svg/WardSvg4';
import WardSvgr from './src/components/WardSvgr';
import WardScreen from './src/screens/WardScreen';
import WardScreen2 from './src/screens/WardScreen2';
import WardScreen3 from './src/screens/WardScreen3';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import Toast from 'react-native-toast-message';
import { setupAxiosInterceptors, setNavigatorRef } from './src/utils/axiosInterceptor';


enableScreens();

export default function App(){
  const navigationRef = useRef(null);

  useEffect(() => {
    setupAxiosInterceptors(); // Can be setup once
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
      <Toast/>
    </SafeAreaProvider>
  );
}