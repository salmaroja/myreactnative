import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const BillsScreen = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('http://10.3.2.95:50655/api/bills');

        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }

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
      <Text style={styles.label}>Meter Number:</Text>
      <Text style={styles.value}>{item.meterNumber}</Text>

      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.value}>TZS {item.amount}</Text>

      <Text style={styles.label}>Billing Date:</Text>
      <Text style={styles.value}>{item.billingDate}</Text>

      <Text style={styles.label}>Paid:</Text>
      <Text style={[styles.value, { color: item.paid ? 'green' : 'red' }]}>
        {item.paid ? 'Yes' : 'No'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bills</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : error ? (
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={item => item.id.toString()}
          renderItem={renderBillItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  billItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  value: {
    marginBottom: 6,
    color: '#555',
  },
});

export default BillsScreen;
