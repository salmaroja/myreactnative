import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CreateRequestScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId } = route.params || {};

  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [requestType, setRequestType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);

  const backendBaseUrl = 'http://10.3.2.95:50655/api/requests';

  const fetchRequestDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendBaseUrl}/${id}`);
      if (response.ok) {
        const json = await response.json();
        setCustomerName(json.customerName);
        setAddress(json.address);
        setRequestType(json.requestType);
        setDescription(json.description || '');
        setStatus(json.status);
      } else {
        Alert.alert('Error', 'Unable to fetch request details.');
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requestId) {212343333333333333453335355                           
      fetchRequestDetails(requestId);
    }
  }, [requestId]);

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter customer name.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter address.');
      return;
    }
    if (!requestType.trim()) {
      Alert.alert('Error', 'Please enter request type.');
      return;
    }

    const payload = {
      customerName: customerName.trim(),
      address: address.trim(),
      requestType: requestType.trim(),
      description: description.trim(),
      status,
    };

    setLoading(true);
    try {
      let response;
      if (requestId) {
        response = await fetch(`${backendBaseUrl}/${requestId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(backendBaseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert(
          'Success',
          requestId ? 'Request updated successfully.' : 'Request created successfully.'
        );
        navigation.goBack();
      } else {
        Alert.alert('Error', json?.message || 'Unable to save request.');
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#e8f5e9', '#ffffff']} style={styles.container}>
        <Text style={styles.title}>
          {requestId ? 'Update Request' : 'New Service Request'}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" />
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Customer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Amina Ali"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. House No. 15, Masingini Street"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Request Type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. New Connection"
              value={requestType}
              onChangeText={setRequestType}
            />

            <Text style={styles.label}>Description (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Additional details..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Status</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Pending, Approved, In Progress"
              value={status}
              onChangeText={setStatus}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <LinearGradient
                colors={['#2e7d32', '#66bb6a']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {requestId ? 'Update Request' : 'Submit Request'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    marginTop: 30,
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
