import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function MakePaymentScreen({ navigation, route }) {
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [billId, setBillId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const BASE_URL = 'http://10.3.2.95:54032/api'; // your Spring Boot backend IP

  // Get data from navigation route if available
  useEffect(() => {
    if (route.params) {
      const { billId: bId, amount, paymentMethod: pMethod } = route.params;
      if (bId) setBillId(bId);
      if (amount) setAmountPaid(String(amount));
      if (pMethod) setPaymentMethod(pMethod);
    }
  }, [route.params]);

  // Load logged in user from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (jsonValue) {
          const user = JSON.parse(jsonValue);
          setUserEmail(user.email);
          setCustomerId(user.id);
          fetchPayments(user.id);
        } else {
          Alert.alert('Login Required', 'Please login to continue');
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error loading user');
      }
    };

    loadUser();
  }, []);

  const fetchPayments = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/payments/customer/${id}`);
      setPayments(Array.isArray(response.data) ? response.data.reverse() : []);
    } catch (error) {
      console.error('Fetch error:', error.message);
      Alert.alert('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!amountPaid || !paymentMethod || !billId || !userEmail) {
      Alert.alert('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/payments`, {
        email: userEmail,
        billId: billId,
        amountPaid: parseFloat(amountPaid),
        paymentMethod: paymentMethod,
      });

      const data = response.data;

      // Optional: send notification
      await axios.post(`${BASE_URL}/notifications/customer/${customerId}`, {
        title: 'Payment Successful',
        message: `You paid TZS ${amountPaid} successfully.`,
      });

      Alert.alert('Success', `Control Number: ${data.controlNumber || 'N/A'}`);
      setAmountPaid('');
      setPaymentMethod('');
      fetchPayments(customerId);
      navigation.navigate('Notifications');
    } catch (error) {
      console.error('Payment error:', error.message);
      Alert.alert('Payment Failed', error.response?.data?.message || 'Network Error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>TZS {item.amountPaid}</Text>
      <Text style={styles.cardText}>Method: {item.paymentMethod}</Text>
      <Text style={styles.cardText}>Control No: {item.controlNumber}</Text>
      <Text style={styles.cardDate}>{new Date(item.paymentDate).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.innerContainer}>
        <LinearGradient colors={['#e3f2fd', '#ffffff']} style={styles.gradient}>
          <Text style={styles.title}>Make a Payment</Text>

          <TextInput
            placeholder="Amount (TZS)"
            keyboardType="numeric"
            value={amountPaid}
            onChangeText={setAmountPaid}
            style={styles.input}
          />

          <Text style={styles.label}>Select Payment Method</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={paymentMethod} onValueChange={setPaymentMethod}>
              <Picker.Item label="-- Choose Method --" value="" />
              <Picker.Item label="M-Pesa" value="M-Pesa" />
              <Picker.Item label="Tigo Pesa" value="Tigo Pesa" />
              <Picker.Item label="CRDB Bank" value="CRDB" />
              <Picker.Item label="NMB Bank" value="NMB" />
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.6 }]}
            onPress={handlePayment}
            disabled={submitting}
          >
            <LinearGradient colors={['#1565c0', '#1e88e5']} style={styles.buttonGradient}>
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pay Now</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Previous Payments</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#1565c0" />
          ) : (
            <FlatList data={payments} keyExtractor={(item) => item.id.toString()} renderItem={renderPaymentItem} />
          )}
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  gradient: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0d47a1',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#0d47a1',
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b3e5fc',
    marginBottom: 16,
  },
  button: { marginBottom: 20 },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: '600' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#0d47a1',
  },
  card: {
    backgroundColor: '#f1f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1565c0' },
  cardText: { fontSize: 14, color: '#333', marginTop: 4 },
  cardDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    textAlign: 'right',
  },
});
