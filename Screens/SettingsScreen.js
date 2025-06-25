import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.option} onPress={() => Alert.alert('Feature', 'Change Password coming soon!')}>
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => Alert.alert('Feature', 'Change Language coming soon!')}>
        <Text style={styles.optionText}>Change Language</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ecf0f1' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#16a085' },
  option: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  optionText: { fontSize: 16, color: '#333' },
});
