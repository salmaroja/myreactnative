import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#0077be', '#00bfff']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.topSection}>
        <Image
          source={require('../assets/zawa.png')} // Hakikisha path ni sahihi
          style={styles.logo}
        />
        <Text style={styles.title}>ZAWA</Text>
        <Text style={styles.subtitle}>Smart Water Management</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
  },
  title: {
    fontSize: 45,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    color: '#e6faff',
    fontStyle: 'italic',
  },
  bottomSection: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '100%',
    marginBottom: 20,
    elevation: 3,
  },
  loginText: {
    color: '#0077be',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '100%',
  },
  registerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
