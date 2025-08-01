import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: object) {
  if (navigationRef.current?.navigate) {
    navigationRef.current.navigate(name, params);
  } else {
    console.warn('NavigationRef is not ready yet');
  }
}
