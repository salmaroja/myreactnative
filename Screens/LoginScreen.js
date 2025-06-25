import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'http://10.3.2.95:54927/api'; // Replace with your backend IP

  // Google OAuth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Simulate login success (you can send token to backend if needed)
      AsyncStorage.setItem('userData', JSON.stringify({ googleToken: authentication.accessToken }));
      Alert.alert('Google Login Success', `Access Token:\n${authentication.accessToken}`);
      navigation.replace('Home');
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.text();
        Alert.alert('Login Failed', errData || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      const customer = await res.json();
      await AsyncStorage.setItem('userData', JSON.stringify(customer));

      Alert.alert('Login Successful', `Welcome ${customer.name || customer.email}!`);
      setEmail('');
      setPassword('');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Network Error', 'Cannot connect to backend.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to ZAWA</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={secureEntry}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
          <Feather
            name={secureEntry ? 'eye-off' : 'eye'}
            size={22}
            color="#888"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>Or continue with</Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => {
            if (request) {
              promptAsync();
            } else {
              Alert.alert('Error', 'Google Auth request not ready');
            }
          }}
          disabled={!request}
        >
          <FontAwesome name="google" size={40} color="#db4a39" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Facebook login not implemented')}>
          <FontAwesome name="facebook" size={40} color="#3b5998" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Apple login not implemented')}>
          <FontAwesome name="apple" size={40} color="#000" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, color: '#0d47a1', fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: '#e3f2fd',
    color: '#000',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#000' },
  eyeIcon: { paddingHorizontal: 6 },
  button: {
    backgroundColor: '#1565c0',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  orText: { textAlign: 'center', color: '#555', marginVertical: 10, fontWeight: '600' },
  iconContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  icon: { marginHorizontal: 15 },
  linkText: { color: '#1565c0', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});
