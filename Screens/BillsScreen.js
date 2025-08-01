// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

// const BillsScreen = () => {
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBills = async () => {
//       try {
//         const customerId = 8; // badilisha hii na user aliye logged in
//         const response = await fetch(`http://10.3.11.174:59263/api/v1/bills/customer/${customerId}`);
//         if (!response.ok) {
//           throw new Error('Imeshindikana kupata bili');
//         }
//         const data = await response.json();
//         setBills(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBills();
//   }, []);

//   const renderBillItem = ({ item }) => (
//     <View style={styles.billItem}>
//       <Text style={styles.label}>Namba ya Mita:</Text>
//       <Text style={styles.value}>{item.meterNumber || 'Haipo'}</Text>

//       <Text style={styles.label}>Kiasi:</Text>
//       <Text style={styles.value}>TZS {item.amount}</Text>

//       <Text style={styles.label}>Tarehe ya bili:</Text>
//       <Text style={styles.value}>{item.billingDate}</Text>

//       <Text style={styles.label}>Tarehe ya mwisho ya kulipa:</Text>
//       <Text style={styles.value}>{item.dueDate}</Text>

//       <Text style={styles.label}>Hali ya malipo:</Text>
//       <Text style={[styles.value, { color: item.status?.toLowerCase() === 'paid' ? 'green' : 'red' }]}>
//         {item.status || 'Haijulikani'}
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return <ActivityIndicator size="large" color="#2196F3" />;
//   }

//   if (error) {
//     return <Text style={{ color: 'red' }}>{error}</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={bills}
//         keyExtractor={item => item.id.toString()}
//         renderItem={renderBillItem}
//         contentContainerStyle={styles.list}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#f4f6f8' },
//   list: { paddingBottom: 20 },
//   billItem: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   label: { fontWeight: '600', color: '#333' },
//   value: { marginBottom: 6, color: '#555' },
// });

// export default BillsScreen;
// src/screens/BillsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BillsScreen() {
  const [bills, setBills]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const storedCustomerId = await AsyncStorage.getItem('customerId');
        if (!storedCustomerId) throw new Error('Mteja hajapatikana. Tafadhali login tena.');

        const response = await fetch(
          `http://192.168.47.63:62654/api/v1/bills/customer/${storedCustomerId}`
        );
        if (!response.ok) throw new Error('Imeshindikana kupata bili');

        const data = await response.json();
        setBills(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const renderBillItem = ({ item }) => (
    <View style={styles.billItem}>
      <Text style={styles.label}>Namba ya Mita:</Text>
      <Text style={styles.value}>{item.meterNumber || 'Haipo'}</Text>

      <Text style={styles.label}>Kiasi:</Text>
      <Text style={styles.value}>TZS {item.amount}</Text>

      <Text style={styles.label}>Tarehe ya bili:</Text>
      <Text style={styles.value}>{item.billingDate}</Text>

      <Text style={styles.label}>Tarehe ya mwisho ya kulipa:</Text>
      <Text style={styles.value}>{item.dueDate}</Text>

      <Text style={styles.label}>Hali ya malipo:</Text>
      <Text
        style={[
          styles.value,
          { color: item.status?.toLowerCase() === 'paid' ? 'green' : 'red' }
        ]}
      >
        {item.status || 'Haijulikani'}
      </Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#2196F3" />;
  if (error)   return <Text style={{ color: 'red', padding: 16 }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={bills}
        keyExtractor={item => item.id.toString()}
        renderItem={renderBillItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6f8' },
  list:      { paddingBottom: 20 },
  billItem:  {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 12, elevation: 3
  },
  label:     { fontWeight: '600', color: '#333' },
  value:     { marginBottom: 6, color: '#555' },
});
