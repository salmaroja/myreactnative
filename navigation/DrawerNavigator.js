import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../Screens/HomeScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import BillsScreen from '../Screens/BillsScreen';
import ComplaintsScreen from '../Screens/ComplaintsScreen';
import NotificationsScreen from '../Screens/NotificationsScreen';
import PaymentsScreen from '../Screens/PaymentsScreen';
import RequestScreen from '../Screens/RequestsScreen';
import MakeRequestScreen from '../Screens/CreateRequestScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import LogoutScreen from '../Screens/LogoutScreen';

import { MaterialIcons, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: { backgroundColor: '#4da6ff' }, // BLUE kama ya "Soma Zaidi"
        headerTintColor: '#fff',
        drawerActiveBackgroundColor: '#1a6d9e', // BLUE tofauti kidogo
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 16, fontWeight: '600' },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="file-invoice-dollar" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="money-check-alt" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Complaints"
        component={ComplaintsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="support-agent" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Requests"
        component={RequestScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="request-page" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Make Request"
        component={MakeRequestScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="create-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}