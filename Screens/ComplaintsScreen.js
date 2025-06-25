// ComplaintsScreen.js
// Developed by: sw wewe

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ComplaintsScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // customer ID hardcoded for now (mfano, customer mwenye ID 2)
  const customerId = 2;

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      const complaintData = {
        title: title,
        description: description,
        customer: {
          id: customerId
        }
      };

      // 🔁 Badilisha IP hapa na port kulingana na Spring Boot backend yako
      const response = await axios.post(
        "http://10.3.2.95:54927/api/complaints", 
        complaintData
      );

      console.log("Response:", response.data);
      Alert.alert("Success", "Complaint sent successfully");
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Failed", "Failed to send complaint. Check your connection or backend.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Submit Complaint" onPress={handleSubmit} color="#1abc9c" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginTop: 5
  }
});

export default ComplaintsScreen;
