import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const RequestFormScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const jsonValue = await AsyncStorage.getItem('userData');
      if (jsonValue) {
        const user = JSON.parse(jsonValue);
        setCustomerId(user.id);
        setFullName(user.name || '');
        setPhone(user.phone || '');
      } else {
        Alert.alert('Tafadhali ingia tena kwenye mfumo');
        navigation.replace('LoginScreen');
      }
    };
    fetchUser();
  }, []);

  const selectPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ruhusa ya picha haijatolewa.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPicture(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !nationalId || !address || !phone || !paymentMethod || !amountPaid || !picture) {
      Alert.alert('Tafadhali jaza kila sehemu ya fomu na weka picha.');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('nationalId', nationalId);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('paymentMethod', paymentMethod);
    formData.append('amountPaid', amountPaid);
    formData.append('customerId', customerId);
    formData.append('picture', {
      uri: picture.uri,
      name: 'proof.jpg',
      type: 'image/jpeg',
    });

    try {
      setLoading(true);
      const res = await axios.post(
        'http://192.168.47.63:62654/api/requestsform/submit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 200) {
        Alert.alert('✅ Ombi limewasilishwa kikamilifu!');
        navigation.goBack();
      } else {
        Alert.alert('❌ Ombi halikutumwa.');
      }
    } catch (err) {
      console.error('Hitilafu ya ombi:', err);
      Alert.alert('❌ Tatizo la mtandao au server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fomu ya Maombi ya Huduma</Text>

      <Text style={styles.label}>Jina Kamili</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Jina lako kamili" />

      <Text style={styles.label}>Namba ya Kitambulisho</Text>
      <TextInput style={styles.input} value={nationalId} onChangeText={setNationalId} placeholder="NIDA au nyingine" />

      <Text style={styles.label}>Anuani</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Mfano: Mtaa wa Azizi, Dar" />

      <Text style={styles.label}>Namba ya Simu</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="07XXXXXXXX" />

      <Text style={styles.label}>Njia ya Malipo</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
          <Picker.Item label="-- Chagua Njia ya Malipo --" value="" />
          <Picker.Item label="M-Pesa" value="M-Pesa" />
          <Picker.Item label="Tigo Pesa" value="Tigo Pesa" />
          <Picker.Item label="Airtel Money" value="Airtel Money" />
          <Picker.Item label="Benki (CRDB/NMB)" value="Benki" />
        </Picker>
      </View>

      <Text style={styles.label}>Kiasi Kilicholipwa (Tsh)</Text>
      <TextInput
        style={styles.input}
        value={amountPaid}
        onChangeText={setAmountPaid}
        keyboardType="numeric"
        placeholder="Mfano: 50000"
      />

      <Text style={styles.label}>Picha ya Ushahidi</Text>
      <TouchableOpacity style={styles.imageButton} onPress={selectPicture}>
        <Text style={{ color: 'white' }}>{picture ? 'Badilisha Picha' : 'Chagua Picha'}</Text>
      </TouchableOpacity>

      {picture && <Image source={{ uri: picture.uri }} style={styles.preview} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Tuma Ombi</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e3f2fd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0d47a1',
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    fontSize: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#1565c0',
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#0d47a1',
    padding: 15,
    marginTop: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestFormScreen;
