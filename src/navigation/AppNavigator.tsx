import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import Dashboard from '../screens/Dashboard/Dashboard';
import TwoFactorAuth from '../screens/Auth/TwoFactorAuth';
import BedPatientInfoCard from '../screens/BedPatientInfo/BedPatientInfoCard';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} /> 
      <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
      <Stack.Screen name="BedPatientInfo" component={BedPatientInfoCard} />
    </Stack.Navigator>
  );
};

export default AppNavigator;