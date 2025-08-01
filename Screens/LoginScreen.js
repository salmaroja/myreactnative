import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, StyleSheet,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { loginCustomer } from '../api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Tafadhali', 'Jaza barua pepe na nenosiri.');
      return;
    }

    setLoading(true);
    try {
      const customer = await loginCustomer({ email, password });
      const customerId = customer.customerId || customer.id;
      if (!customerId) throw new Error('customerId haijapatikana.');

      await AsyncStorage.setItem('customerId', customerId.toString());
      await AsyncStorage.setItem('userEmail', customer.email);
      await AsyncStorage.setItem('fullName', customer.fullName || customer.name || '');
      await AsyncStorage.setItem('userData', JSON.stringify(customer));

      Alert.alert(
        `Karibu ${customer.fullName || 'Mteja'}!`,
        'Umeingia kikamilifu kwenye mfumo wa ZAWA',
        [{ text: 'Endelea', onPress: () => navigation.replace('Home') }]
      );

    } catch (e) {
      Alert.alert('Login Imeshindikana', e.response?.data || e.message || 'Tafadhali hakiki taarifa zako.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Linking.openURL('https://accounts.google.com');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome name="bolt" size={60} color="#1a73e8" />
        <Text style={styles.logoText}>ZAWA</Text>
      </View>

      <Text style={styles.title}>Ingia kwenye Akaunti Yako</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Barua pepe"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Nenosiri"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#777" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>INGIA</Text>}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>AU</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <MaterialIcons name="google" size={24} color="#DB4437" />
        <Text style={styles.googleButtonText}>Ingia kwa Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Hujasajiliwa? <Text style={styles.registerHighlight}>Sajili sasa</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#f8f9fa' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: '#1a73e8', marginTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#202124' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderColor: '#dadce0', borderWidth: 1, marginBottom: 20, height: 56, paddingHorizontal: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#202124' },
  eyeIcon: { padding: 5 },
  button: { backgroundColor: '#1a73e8', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20, elevation: 2, shadowColor: '#1a73e8', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#dadce0' },
  dividerText: { marginHorizontal: 10, color: '#5f6368', fontSize: 14 },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 12, borderRadius: 10, borderColor: '#dadce0', borderWidth: 1, marginBottom: 20, gap: 10 },
  googleButtonText: { color: '#3c4043', fontSize: 16, fontWeight: '500' },
  registerLink: { alignSelf: 'center', marginTop: 10 },
  registerText: { color: '#5f6368', fontSize: 15 },
  registerHighlight: { color: '#1a73e8', fontWeight: 'bold' },
});
