// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, StyleSheet, Image, TouchableOpacity,
//   Alert, TextInput, ScrollView
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// export default function ProfileScreen() {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [location, setLocation] = useState('');
//   const [imageUri, setImageUri] = useState(null);
//   const [tempImageUri, setTempImageUri] = useState(null);

//   const BASE_URL = 'http://10.3.11.174:51265';

//   useEffect(() => {
//     const getEmailAndLoadProfile = async () => {
//       try {
//         const storedEmail = await AsyncStorage.getItem('userEmail');
//         if (!storedEmail) {
//           Alert.alert('Login Error', 'No email found. Please login again.');
//           return;
//         }

//         setEmail(storedEmail);
//         fetchProfile(storedEmail);
//       } catch (error) {
//         console.error('Error reading email from storage:', error);
//         Alert.alert('Error', 'Could not retrieve user information.');
//       }
//     };

//     getEmailAndLoadProfile();
//   }, []);

//   const fetchProfile = async (emailToFetch) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/api/v1/profile/${emailToFetch}`);
//       const data = response.data;
//       setFullName(data.fullName || '');
//       setPhone(data.phone || '');
//       setLocation(data.location || '');
//       if (data.imagePath) {
//         setImageUri(`${BASE_URL}/${data.imagePath}`);
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       Alert.alert('Failed', 'Failed to load profile.');
//     }
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'You must allow access to the gallery.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       setTempImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async () => {
//     if (!tempImageUri || !email) return;

//     const uriParts = tempImageUri.split('.');
//     const fileType = uriParts[uriParts.length - 1].toLowerCase();
//     const mimeType = fileType === 'png' ? 'image/png' : 'image/jpeg';

//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('image', {
//       uri: tempImageUri,
//       name: `profile.${fileType}`,
//       type: mimeType,
//     });

//     try {
//       await axios.post(`${BASE_URL}/api/v1/profile/upload-image`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       Alert.alert('Success', 'Profile picture uploaded!');
//       setImageUri(tempImageUri);
//       setTempImageUri(null);
//     } catch (error) {
//       console.error('Upload failed:', error?.response?.data || error.message);
//       Alert.alert('Upload Error', 'Something went wrong during upload.');
//     }
//   };

//   const updateProfile = async () => {
//     try {
//       await axios.put(`${BASE_URL}/api/v1/profile/update`, {
//         email,
//         fullName,
//         phone,
//         location,
//       });

//       Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
//     } catch (error) {
//       console.error('Update error:', error.message);
//       Alert.alert('Update Error', 'Could not update profile info.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>My Profile</Text>

//       <Image
//         source={
//           tempImageUri
//             ? { uri: tempImageUri }
//             : imageUri
//             ? { uri: imageUri }
//             : require('../assets/profile.png')
//         }
//         style={styles.profileImage}
//       />

//       <TouchableOpacity onPress={pickImage} style={styles.button}>
//         <Text style={styles.buttonText}>Choose Profile Picture</Text>
//       </TouchableOpacity>

//       {tempImageUri && (
//         <TouchableOpacity onPress={uploadImage} style={[styles.button, styles.uploadButton]}>
//           <Text style={styles.buttonText}>Upload</Text>
//         </TouchableOpacity>
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         value={fullName}
//         onChangeText={setFullName}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         editable={false}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Location"
//         value={location}
//         onChangeText={setLocation}
//       />

//       <TouchableOpacity onPress={updateProfile} style={[styles.button, { backgroundColor: '#0096C7' }]}>
//         <Text style={styles.buttonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     paddingVertical: 20,
//     backgroundColor: '#E6F7FF',
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginVertical: 20,
//     color: '#0077B6',
//   },
//   profileImage: {
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: '#0077B6',
//   },
//   button: {
//     backgroundColor: '#0077B6',
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 30,
//     marginTop: 10,
//   },
//   uploadButton: {
//     backgroundColor: '#00B4D8',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   input: {
//     width: '90%',
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     backgroundColor: '#fff',
//     marginTop: 15,
//     fontSize: 16,
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert, TextInput, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [tempImageUri, setTempImageUri] = useState(null);

  const BASE_URL = 'http://10.3.11.236:62654'; // badilisha IP yako hapa

  useEffect(() => {
    const getEmailAndLoadProfile = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (!storedEmail) {
          Alert.alert('Login Error', 'No email found. Please login again.');
          return;
        }

        setEmail(storedEmail);
        fetchProfile(storedEmail);
      } catch (error) {
        console.error('Error reading email from storage:', error);
        Alert.alert('Error', 'Could not retrieve user information.');
      }
    };

    getEmailAndLoadProfile();
  }, []);

  const fetchProfile = async (emailToFetch) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/profile/${emailToFetch}`);
      const data = response.data;
      setFullName(data.name || '');
      setPhone(data.phone || '');
      setLocation(data.location || '');
      if (data.imagePath) {
        setImageUri(`${BASE_URL}/${data.imagePath}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Failed', 'Failed to load profile.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You must allow access to the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setTempImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!tempImageUri || !email) return;

    const uriParts = tempImageUri.split('.');
    const fileType = uriParts[uriParts.length - 1].toLowerCase();
    const mimeType = fileType === 'png' ? 'image/png' : 'image/jpeg';

    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', {
      uri: tempImageUri,
      name: `profile.${fileType}`,
      type: mimeType,
    });

    try {
      await axios.post(`${BASE_URL}/api/v1/profile/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Profile picture uploaded!');
      setImageUri(tempImageUri);
      setTempImageUri(null);
    } catch (error) {
      console.error('Upload failed:', error?.response?.data || error.message);
      Alert.alert('Upload Error', 'Something went wrong during upload.');
    }
  };

  const updateProfile = async () => {
    try {
      const payload = {
        name: fullName,
        phone: phone,
        location: location,
        user: { email: email },  // Hii ni muhimu kuendana na backend
      };

      await axios.put(`${BASE_URL}/api/v1/profile/update`, payload);

      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Update error:', error.message);
      Alert.alert('Update Error', 'Could not update profile info.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Image
        source={
          tempImageUri
            ? { uri: tempImageUri }
            : imageUri
            ? { uri: imageUri }
            : require('../assets/profile.png')
        }
        style={styles.profileImage}
      />

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Choose Profile Picture</Text>
      </TouchableOpacity>

      {tempImageUri && (
        <TouchableOpacity onPress={uploadImage} style={[styles.button, styles.uploadButton]}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity onPress={updateProfile} style={[styles.button, { backgroundColor: '#0096C7' }]}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#E6F7FF',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#0077B6',
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0077B6',
  },
  button: {
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#00B4D8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
});
