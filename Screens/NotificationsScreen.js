// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';

// const NotificationsScreen = ({ navigation }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const customerId = 8; // badilisha na user id halisi kutoka context/app state

//   // Fetch notifications from backend
//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`http://192.168.47.63:62654/api/v1/notifications/customer/${customerId}`);
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setNotifications(data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error.message);
//       Alert.alert("Offline Mode", "Unable to fetch notifications from backend.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mark a notification as read by calling backend endpoint
//   const markAsRead = async (notificationId) => {
//     try {
//       const response = await fetch(`http://10.3.11.174:58766/api/v1/notifications/read/${notificationId}`, {
//         method: 'PUT',
//       });
//       if (!response.ok) {
//         throw new Error('Failed to mark as read');
//       }
//       // Update local state immediately for UI feedback
//       setNotifications((prev) =>
//         prev.map((notif) =>
//           notif.id === notificationId ? { ...notif, read: true } : notif
//         )
//       );
//     } catch (error) {
//       Alert.alert('Error', 'Could not mark notification as read.');
//     }
//   };

//   // Refresh notifications on screen focus
//   useFocusEffect(
//     useCallback(() => {
//       fetchNotifications();
//     }, [])
//   );

//   const renderNotification = ({ item }) => (
//     <TouchableOpacity
//       style={[styles.notificationCard, !item.read && styles.unread]}
//       onPress={() => {
//         if (!item.read) {
//           markAsRead(item.id);
//         }
//         // Optional: navigate or show details
//       }}
//     >
//       <MaterialIcons
//         name={item.read ? 'notifications-none' : 'notifications-active'}
//         size={28}
//         color={item.read ? '#aaa' : '#007bff'}
//         style={styles.icon}
//       />
//       <View style={styles.textContainer}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.message}>{item.message}</Text>
//         <Text style={styles.timestamp}>
//           {new Date(item.timestamp).toLocaleString()}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>📬 My Notifications</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#007bff" />
//       ) : (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderNotification}
//           contentContainerStyle={styles.list}
//           ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Hakuna notification yoyote</Text>}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f2f5',
//     paddingTop: 40,
//     paddingHorizontal: 16,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 20,
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   notificationCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//     alignItems: 'flex-start',
//   },
//   unread: {
//     borderLeftWidth: 5,
//     borderLeftColor: '#007bff',
//     backgroundColor: '#e6f0ff',
//   },
//   icon: {
//     marginRight: 12,
//     marginTop: 5,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#222',
//   },
//   message: {
//     color: '#444',
//     marginTop: 4,
//   },
//   timestamp: {
//     color: '#777',
//     marginTop: 8,
//     fontSize: 12,
//   },
// });

// export default NotificationsScreen;

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';  // Hii ni muhimu

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerId = 8; // badilisha na user id halisi kutoka context/app state

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.8.5.173:62654/api/v1/notifications/customer/${customerId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      Alert.alert("Offline Mode", "Unable to fetch notifications from backend.");
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read by calling backend endpoint
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://10.8.5.173:58766/api/v1/notifications/read/${notificationId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }
      // Update local state immediately for UI feedback
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Could not mark notification as read.');
    }
  };

  // Fungua link ya risiti kwenye browser ya simu
  const openReceipt = async (link) => {
    if (!link) {
      Alert.alert('No receipt link available.');
      return;
    }
    // Badilisha localhost na IP halisi ya backend kama unatumia simu au emulator
    const url = link.startsWith('http') ? link : `http://10.8.5.173:62654${link}`;
    await WebBrowser.openBrowserAsync(url);
  };

  // Refresh notifications on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unread]}
      onPress={() => {
        if (!item.read) {
          markAsRead(item.id);
        }
        openReceipt(item.link);  // Fungua risiti/link ukiibonyeza
      }}
    >
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
    </TouchableOpacity>
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
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Hakuna notification yoyote</Text>}
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
