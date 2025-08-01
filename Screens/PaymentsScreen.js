// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView 
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';

// const API_BASE_URL = 'http://10.65.2.138:62654/api/v1/request-payments';
// const POLLING_INTERVAL = 5000;

// const validPaymentMethods = ['M-PESA', 'Tigo Pesa', 'Airtel Money'];

// const PaymentsScreen = ({ route, navigation }) => {
//   const { request_form_id, serviceType, amount = 50000 } = route.params || {};
//   const [paymentMethod, setPaymentMethod] = useState('M-PESA');
//   const [customerId, setCustomerId] = useState(null);
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState('PENDING');
//   const [controlNumber, setControlNumber] = useState('');
//   const [isPolling, setIsPolling] = useState(false);
//   const [isOnline, setIsOnline] = useState(true);
//   const [retryCount, setRetryCount] = useState(0);

//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('userData');
//         if (userData) {
//           const user = JSON.parse(userData);

//           if (!user.id) {
//             Alert.alert('Error', 'User ID haipatikani. Tafadhali ingia tena.');
//             navigation.replace('LoginScreen');
//             return;
//           }

//           setCustomerId(user.id.toString());
//           setPhone(user.phone || '');
//         } else {
//           Alert.alert('Error', 'Tafadhali ingia tena kwenye mfumo');
//           navigation.replace('LoginScreen');
//         }
//       } catch (error) {
//         Alert.alert('Error', 'Imeshindwa kupakua taarifa za mtumiaji');
//       }
//     };

//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsOnline(state.isConnected);
//     });

//     loadUserData();

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     let interval;
//     if (isPolling && controlNumber) {
//       interval = setInterval(() => {
//         checkPaymentStatus();
//       }, POLLING_INTERVAL);
//     }
//     return () => interval && clearInterval(interval);
//   }, [isPolling, controlNumber]);

//   const checkPaymentStatus = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/status/${controlNumber}`);
//       if (response.data?.paymentStatus === 'PAID' || response.data?.paymentStatus === 'VERIFIED') {
//         setPaymentStatus(response.data.paymentStatus);
//         setIsPolling(false);
//         Alert.alert('Success', 'Malipo yamethibitishwa!');
//       }
//     } catch (error) {
//       console.error('Status check error:', error);
//     }
//   };

//   const handlePayment = async () => {
//     if (!isOnline) {
//       Alert.alert('No Internet', 'Tafadhali angalia muunganisho wako wa intaneti');
//       return;
//     }

//     if (!customerId) {
//       Alert.alert('Error', 'User ID haipatikani. Tafadhali ingia tena.');
//       return;
//     }

//     // Validate paymentMethod before sending
//     if (!validPaymentMethods.includes(paymentMethod)) {
//       Alert.alert('Error', 'Chagua njia sahihi ya malipo');
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         request_form_id: request_form_id || null,
//         amount,
//         paymentMethod,
//         customerId,
//         serviceType: serviceType || 'Kuunganishwa Maji',
//         phone
//       };

//       const response = await axios.post(`${API_BASE_URL}/request`, payload);

//       if (response.data?.controlNumber) {
//         setControlNumber(response.data.controlNumber);

//         Alert.alert(
//           'Maelekezo ya Malipo',
//           `Tuma TZS ${amount.toLocaleString()} kwa namba ifuatayo:\n\nControl Number: ${response.data.controlNumber}\n\n` +
//           '1. Fungua menu ya malipo ya M-PESA au Tigo Pesa au Airtel Money\n' +
//           '2. Chagua "Lipa kwa Namba"\n' +
//           '3. Ingiza namba ya control kama reference',
//           [
//             { text: 'Nimetuma', onPress: () => setIsPolling(true) },
//             { text: 'Ghairi', style: 'cancel' }
//           ]
//         );
//       } else {
//         Alert.alert('Error', 'Imeshindikana kupata namba ya control');
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//       Alert.alert('Error', error.response?.data?.message || error.message || 'Malipo hayajakamilika');
//       setRetryCount(prev => prev + 1);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (paymentStatus === 'PAID' || paymentStatus === 'VERIFIED') {
//     return (
//       <View style={styles.container}>
//         <View style={styles.successContainer}>
//           <Text style={styles.successTitle}>✅ Malipo Yamekamilika</Text>
//           <Text style={styles.successMessage}>
//             Asante kwa malipo yako ya TZS {amount.toLocaleString()}
//           </Text>
//           <Text style={styles.receiptText}>Receipt: {controlNumber}</Text>
//           <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
//             <Text style={styles.homeButtonText}>Rudi Home</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>Malipo ya Huduma</Text>

//       <View style={styles.detailsContainer}>
//         <Text style={styles.detailText}>Huduma: {serviceType || 'N/A'}</Text>
//         <Text style={styles.detailText}>Kiasi: TZS {amount.toLocaleString()}</Text>
//         <Text style={styles.detailText}>Request Form ID: {request_form_id || 'N/A'}</Text>
//       </View>

//       <Text style={styles.sectionTitle}>Njia ya Malipo</Text>
//       <View style={styles.methodContainer}>
//         {validPaymentMethods.map(method => (
//           <TouchableOpacity
//             key={method}
//             style={[styles.methodButton, paymentMethod === method && styles.selectedMethod]}
//             onPress={() => setPaymentMethod(method)}
//             disabled={loading}
//           >
//             <Text style={[styles.methodText, paymentMethod === method && styles.selectedMethodText]}>
//               {method}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Text style={styles.sectionTitle}>Namba ya Simu</Text>
//       <Text style={styles.phoneText}>{phone || 'Inapakia...'}</Text>

//       {!isOnline && <Text style={styles.offlineText}>Hauna muunganisho wa intaneti.</Text>}

//       <TouchableOpacity
//         style={[styles.payButton, (loading || !isOnline) && styles.disabledButton]}
//         onPress={handlePayment}
//         disabled={loading || !isOnline}
//       >
//         {loading ? (
//           <ActivityIndicator color="#FFF" />
//         ) : (
//           <Text style={styles.payButtonText}>LIPA TZS {amount.toLocaleString()}</Text>
//         )}
//       </TouchableOpacity>

//       {isPolling && (
//         <View style={styles.pollingContainer}>
//           <ActivityIndicator size="small" color="#3498db" />
//           <Text style={styles.pollingText}>Kuthibitisha malipo...</Text>
//         </View>
//       )}

//       {retryCount > 0 && <Text style={styles.retryText}>Jaribio la {retryCount} la 3</Text>}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   detailsContainer: {
//     backgroundColor: '#E8F4F8',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   detailText: {
//     fontSize: 16,
//     color: '#2980B9',
//     marginVertical: 3,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#34495E',
//     marginBottom: 8,
//     marginTop: 15,
//   },
//   methodContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   methodButton: {
//     flex: 1,
//     padding: 12,
//     marginHorizontal: 4,
//     borderRadius: 8,
//     backgroundColor: '#ECF0F1',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#DDD',
//   },
//   selectedMethod: {
//     backgroundColor: '#3498DB',
//     borderColor: '#2980B9',
//   },
//   methodText: {
//     color: '#2C3E50',
//     fontWeight: '500',
//   },
//   selectedMethodText: {
//     color: '#FFF',
//   },
//   phoneText: {
//     fontSize: 16,
//     padding: 12,
//     backgroundColor: '#FFF',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#DDD',
//     marginBottom: 20,
//   },
//   payButton: {
//     backgroundColor: '#27AE60',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   payButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   pollingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   pollingText: {
//     marginLeft: 10,
//     color: '#3498db',
//   },
//   retryText: {
//     textAlign: 'center',
//     color: '#7F8C8D',
//     marginBottom: 10,
//   },
//   offlineText: {
//     color: '#E74C3C',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   successContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 30,
//   },
//   successTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#27AE60',
//     marginBottom: 20,
//   },
//   successMessage: {
//     fontSize: 18,
//     color: '#2C3E50',
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 26,
//   },
//   receiptText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#34495E',
//     marginBottom: 30,
//   },
//   homeButton: {
//     backgroundColor: '#3498DB',
//     padding: 15,
//     borderRadius: 8,
//     width: '80%',
//     alignItems: 'center',
//   },
//   homeButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default PaymentsScreen;





import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const RequestPaymentScreen = () => {
  const [requestFormId, setRequestFormId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePayment = async () => {
    if (!requestFormId || !customerId || !amount || !serviceType || !phone || !paymentMethod) {
      Alert.alert('Error', 'Tafadhali jaza kila sehemu.');
      return;
    }

    const paymentData = {
      request_form_id: parseInt(requestFormId),
      customerId: parseInt(customerId),
      amount: parseFloat(amount),
      serviceType,
      phone,
      paymentMethod
    };

    try {
      const response = await axios.post('http://localhost:65362/api/v1/request-payments/request', paymentData);
      Alert.alert('Success', 'Malipo yamefanikiwa!');
      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', 'Imeshindikana kufanya malipo. Hakikisha data ni sahihi.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Request Form ID</Text>
      <TextInput
        style={styles.input}
        value={requestFormId}
        onChangeText={setRequestFormId}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Customer ID</Text>
      <TextInput
        style={styles.input}
        value={customerId}
        onChangeText={setCustomerId}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Service Type</Text>
      <TextInput
        style={styles.input}
        value={serviceType}
        onChangeText={setServiceType}
        placeholder="Water Service"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="eg. 0627401040"
      />

      <Text style={styles.label}>Payment Method</Text>
      <TextInput
        style={styles.input}
        value={paymentMethod}
        onChangeText={setPaymentMethod}
        placeholder="eg. M-PESA"
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Lipa Sasa" onPress={handlePayment} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    marginTop: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginTop: 5
  }
});

export default RequestPaymentScreen;
