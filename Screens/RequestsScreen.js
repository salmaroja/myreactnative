import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function RequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const BASE_URL = 'http://10.3.2.95:50655/api/requests';

  const fetchRequests = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load requests. Check connection or server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchRequests();
    });
    return unsubscribe;
  }, [navigation]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f9a825'; // yellow
      case 'approved':
      case 'completed':
        return '#388e3c'; // green
      case 'rejected':
        return '#d32f2f'; // red
      default:
        return '#616161'; // grey
    }
  };

  const filtered = requests.filter((item) =>
    item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    item.address?.toLowerCase().includes(search.toLowerCase()) ||
    item.requestType?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.detail}>📍 {item.address}</Text>
      <Text style={styles.detail}>🛠 {item.requestType}</Text>
      <Text style={styles.detail}>📆 {item.requestDate}</Text>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('CreateRequest', { requestId: item.id })}
      >
        <MaterialIcons name="edit" size={18} color="#fff" />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#bbdefb', '#e3f2fd']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>📋 Service Requests</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateRequest')}
          >
            <Text style={styles.addButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="🔍 Search requests..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#1565c0" />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No matching requests found.</Text>}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#e3f2fd' },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#0d47a1' },
  addButton: {
    backgroundColor: '#1565c0', paddingVertical: 8,
    paddingHorizontal: 14, borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  searchInput: {
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16,
    paddingVertical: 10, marginBottom: 14, borderWidth: 1, borderColor: '#cfd8dc',
  },
  listContent: { paddingBottom: 80 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 16,
    marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3,
  },
  customerName: {
    fontSize: 18, fontWeight: '700', color: '#1565c0', marginBottom: 4,
  },
  detail: {
    fontSize: 14, color: '#444', marginBottom: 2,
  },
  statusBadge: {
    marginTop: 6, paddingVertical: 4, paddingHorizontal: 8,
    alignSelf: 'flex-start', borderRadius: 10,
  },
  statusText: {
    color: '#fff', fontWeight: '600', fontSize: 13,
  },
  editButton: {
    marginTop: 10, backgroundColor: '#64b5f6',
    paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 8, flexDirection: 'row', alignItems: 'center',
  },
  editText: {
    color: '#fff', fontWeight: '600', marginLeft: 6,
  },
  emptyText: {
    marginTop: 40, textAlign: 'center', fontSize: 16, color: '#777',
  },
});
