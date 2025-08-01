import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './Screens/WelcomeScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import DrawerNavigator from './navigation/DrawerNavigator';
import MakePaymentScreen from './Screens/MakePaymentScreen';
import PaymentsScreen from './Screens/PaymentsScreen'; // ✅ Hii ndiyo screen uliyokuwa una-navigate

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={DrawerNavigator} />
        <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
        
        {/* ✅ Ongeza hii */}
        <Stack.Screen 
          name="PaymentsScreen" 
          component={PaymentsScreen}
          options={{ headerShown: true, title: 'Malipo ya Huduma' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
