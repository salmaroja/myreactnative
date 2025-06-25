import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#16a085" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
