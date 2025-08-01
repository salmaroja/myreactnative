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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const RequestFormScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    address: '',
    phone: '',
    serviceType: 'Kuunganishiwa Maji',
    meterType: 'Smart Meter',
  });
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (jsonValue) {
          const user = JSON.parse(jsonValue);
          setCustomerId(user.id);
          setFormData(prev => ({
            ...prev,
            fullName: user.name || '',
            phone: user.phone || '',
          }));
        } else {
          Alert.alert('Tafadhali ingia tena kwenye mfumo');
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.error('Error reading user data', error);
        Alert.alert('Hitilafu', 'Imeshindwa kusoma taarifa za mtumiaji');
      }
    };
    fetchUser();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Jina kamili linahitajika';
    if (!formData.nationalId) newErrors.nationalId = 'Namba ya kitambulisho inahitajika';
    if (!formData.address) newErrors.address = 'Anuani inahitajika';
    if (!formData.phone) newErrors.phone = 'Namba ya simu inahitajika';
    if (!picture) newErrors.picture = 'Picha ya ushahidi inahitajika';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const selectPicture = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ruhusa haijatolewa', 'Tafadhali ruhusu upatikanaji wa picha');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPicture(result.assets[0]);
        setErrors(prev => ({ ...prev, picture: null }));
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Hitilafu', 'Imeshindwa kuchagua picha');
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('nationalId', formData.nationalId);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('serviceType', formData.serviceType);
      data.append('meterType', formData.meterType);
      data.append('customerId', customerId.toString());

      data.append('picture', {
        uri: picture.uri,
        name: picture.fileName || `proof_${Date.now()}.jpg`,
        type: picture.mimeType || 'image/jpeg',
      });

      const response = await axios.post(
        'http:///10.65.2.138:62654/api/requestsform/submit',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        }
      );

      if (response.status === 200) {
        Alert.alert(
          'Ombi limewasilishwa',
          'Ombi lako limepokelewa kikamilifu',
          [
            {
              text: 'Sawa',
              onPress: () => navigation.navigate('PaymentsScreen', {
                requestId: response.data.id,
                serviceType: formData.serviceType,
                amount: formData.serviceType === 'Kuunganishiwa Maji' ? '50000' : '30000',
              }),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Tatizo la mtandao. Tafadhali jaribu tena baadaye.';
      Alert.alert('Hitilafu', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fomu ya Maombi ya Huduma</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Jina Kamili</Text>
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Namba ya Kitambulisho</Text>
        <TextInput
          style={[styles.input, errors.nationalId && styles.inputError]}
          value={formData.nationalId}
          onChangeText={(text) => handleChange('nationalId', text)}
          keyboardType="numeric"
        />
        {errors.nationalId && <Text style={styles.errorText}>{errors.nationalId}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Anuani</Text>
        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Namba ya Simu</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Aina ya Huduma</Text>
        <TextInput
          style={styles.input}
          value={formData.serviceType}
          onChangeText={(text) => handleChange('serviceType', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Aina ya Mita</Text>
        <TextInput
          style={styles.input}
          value={formData.meterType}
          onChangeText={(text) => handleChange('meterType', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Picha ya Ushahidi</Text>
        <TouchableOpacity 
          style={[styles.imageButton, errors.picture && styles.buttonError]}
          onPress={selectPicture}
        >
          <Text style={{ color: 'white' }}>
            {picture ? 'Badilisha Picha' : 'Chagua Picha'}
          </Text>
        </TouchableOpacity>
        {errors.picture && <Text style={styles.errorText}>{errors.picture}</Text>}
        {picture && (
          <Image 
            source={{ uri: picture.uri }} 
            style={styles.preview} 
          />
        )}
      </View>

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Tuma Ombi</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e3f2fd',
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0d47a1',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#90caf9',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
  },
  imageButton: {
    backgroundColor: '#1565c0',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonError: {
    backgroundColor: '#f44336',
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#0d47a1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestFormScreen;