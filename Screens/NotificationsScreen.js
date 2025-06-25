import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerId =4;

  const mockNotifications = [
    {
      id: 1,
      title: 'Bill Reminder',
      message: 'Your water bill is due on June 5th.',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 2,
      title: 'Service Interruption',
      message: 'Water supply will be interrupted in your area tomorrow from 8am to 2pm.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: 3,
      title: 'Payment Confirmation',
      message: 'Your payment of TZS 20,000 was received. Thank you!',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
  ];

  // Fetch notifications function
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.3.2.95:/api/notifications/customer/${customerId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      Alert.alert("Offline Mode", "Unable to fetch from backend. Showing mock notifications.");
      setNotifications(mockNotifications); // fallback data
    } finally {
      setLoading(false);
    }
  };

  // Refresh notifications every time screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const renderNotification = ({ item }) => (
    <View style={[styles.notificationCard, !item.read && styles.unread]}>
      <MaterialIcons
        name={item.read ? 'notifications-none' : 'notifications-active'}
        size={28}
        color={item.read ? '#aaa' : '#007bff'}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📬 My Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'flex-start',
  },
  unread: {
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
    backgroundColor: '#e6f0ff',
  },
  icon: {
    marginRight: 12,
    marginTop: 5,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  message: {
    color: '#444',
    marginTop: 4,
  },
  timestamp: {
    color: '#777',
    marginTop: 8,
    fontSize: 12,
  },
});

export default NotificationsScreen;
