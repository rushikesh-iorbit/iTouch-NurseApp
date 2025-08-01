import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import Dashboard from '../screens/Dashboard/Dashboard';
import TwoFactorAuth from '../screens/Auth/TwoFactorAuth';
import BedPatientInfoCard from '../screens/BedPatientInfo/BedPatientInfoCard';
import NurseLogin from '../screens/Auth/NurseLogin';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} /> 
      <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
      <Stack.Screen name="BedPatientInfo" component={BedPatientInfoCard} />
      <Stack.Screen name="NurseLogin" component={NurseLogin} />
      
    </Stack.Navigator>
  );
};

export default AppNavigator;