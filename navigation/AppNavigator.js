import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../Screens/WelcomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import DrawerNavigator from './DrawerNavigator';
import RequestFormScreen from '../Screens/RequestFormScreen'; // IONGEZA HAPA
import PaymentsScreen from '../Screens/PaymentsScreen'; // IONGEZA HAPA

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={DrawerNavigator} />
      
      {/* IONGEZA SCREENS MPYA HAPA */}
      <Stack.Screen 
        name="RequestFormScreen" 
        component={RequestFormScreen} 
        options={{ headerShown: true, title: 'Fomu ya Maombi' }}
      />
      <Stack.Screen 
        name="PaymentsScreen" 
        component={PaymentsScreen} 
        options={{ headerShown: true, title: 'Malipo' }}
      />
    </Stack.Navigator>
  );  
}