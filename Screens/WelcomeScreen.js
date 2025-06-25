import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/zawa.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <Text style={styles.title}>ZAWA</Text>
        <Text style={styles.subtitle}>Smart Water Management</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.outlineButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 51, 102, 0.6)',
    padding: 30,
    marginHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#d0f0ff',
    marginBottom: 35,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#00aaff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  outlineButton: {
    borderColor: '#ffffff',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
  },
  outlineButtonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
});
