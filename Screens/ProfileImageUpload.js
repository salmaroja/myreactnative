import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Platform, Alert } from 'react-native';

const pickImage = async () => {
  // Omba ruhusa ya gallery
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Please allow access to your photo library.');
    return;
  }

  // Chagua picha kutoka gallery (tu images)
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaType.Images, // Hii ni sahihi, usitumie MediaTypeOptions tena
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
    return result.assets[0].uri;  // Return URI ya picha
  }
  return null;  // Ikiwa user aka cancel
};

const uploadImage = async (imageUri, email) => {
  if (!imageUri) {
    Alert.alert('No Image Selected', 'Please select an image first.');
    return;
  }

  // Tengeneza FormData
  const uriParts = imageUri.split('.');
  const fileType = uriParts[uriParts.length - 1].toLowerCase();
  const mimeType = fileType === 'png' ? 'image/png' : 'image/jpeg';

  const formData = new FormData();
  formData.append('email', email);
  formData.append('image', {
    uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
    name: `profile.${fileType}`,
    type: mimeType,
  });

  try {
    const response = await axios.post(
      'http://10.3.2.95:51020/api/v1/profile/upload-image',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    Alert.alert('Success', 'Profile image uploaded successfully!');
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    Alert.alert('Upload failed', 'Please check the logs for details.');
    return null;
  }
};
