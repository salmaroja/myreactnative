import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function PaymentsScreen({ navigation }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const BASE_URL = 'http://10.3.2.95:51020/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (!jsonValue) {
          Alert.alert('Login Required', 'Please login to continue');
          navigation.replace('LoginScreen');
          return;
        }

        const user = JSON.parse(jsonValue);
        setCustomerId(user.id);

        setLoading(true);
        const res = await axios.get(`${BASE_URL}/payments/customer/${user.id}`);
        setPayments(res.data.reverse());
      } catch (err) {
        console.error('Fetch error:', err.message);
        Alert.alert('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.amount}>TZS {item.amountPaid}</Text>
      <Text>Method: {item.paymentMethod}</Text>
      <Text>Control No: {item.controlNumber}</Text>
      <Text>Date: {new Date(item.paymentDate).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Payments</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }} // To avoid button overlapping
        />
      )}

      {/* Centered button at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("MakePayment", {
              billId: 1,
              amount: 10000,
              paymentMethod: "M-Pesa",
            })
          }
        >
          <Text style={styles.buttonText}>Make Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  card: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#1565c0' },

  // Button container fixed at bottom center
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#1565c0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
