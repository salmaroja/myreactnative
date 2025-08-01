// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   StatusBar,
//   ActivityIndicator
// } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import { registerCustomer } from '../api'; // Import function kutoka api

// export default function RegisterScreen({ navigation }) {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleRegister = async () => {
//     // Uthibitishaji wa awali
//     if (!fullName || !email || !password || !phone) {
//       Alert.alert('Sehemu Zinazokosewa', 'Tafadhali jaza sehemu zote muhimu.');
//       return;
//     }

//     // Hakikisha namba ya simu ni sahihi
//     if (!/^0\d{9}$/.test(phone)) {
//       Alert.alert('Simu Si Sahihi', 'Tafadhali weka namba ya simu yenye tarakimu 10 na kuanzia na 0.');
//       return;
//     }

//     // Hakikisha nenosiri ni salama
//     if (password.length < 6) {
//       Alert.alert('Nenosiri Dhaifu', 'Nenosiri lazima liwe na herufi angalau 6.');
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       // Tuma data kwenda backend - TUMIA FIELD ZA BACKEND
//       const response = await registerCustomer({
//         name: fullName,       // Backend inatarajia "name"
//         email,                // Backend inatarajia "email"
//         password,             // Backend inatarajia "password"
//         phone,                // Backend inatarajia "phone"
//         address               // Backend inatarajia "address"
//         // METER NUMBER ITAGENERETWA AUTOMATICALLY NA BACKEND
//       });

//       if (response && response.id) {
//         // Onyesha namba ya mita iliyogenerwa na backend
//         Alert.alert(
//           'Usajili Umefanikiwa',
//           `Namba yako ya mita ni: ${response.meterNumber}\n\nKaribu ${fullName}!`,
//           [{ text: 'Sawa', onPress: () => navigation.navigate('Login') }]
//         );
//       } else {
//         Alert.alert('Usajili Umeshindwa', 'Tafadhali jaribu tena baadae.');
//       }
//     } catch (error) {
//       console.error('Kosa la usajili:', error);
      
//       let errorMessage = 'Imeshindikana kumsajili mteja. Tafadhali angalia muunganisho wako au jaribu tena.';
      
//       if (error.response) {
//         // Kama backend ilirudisha kosa maalum
//         if (error.response.data) {
//           errorMessage = error.response.data;
//         }
//         // Kama barua pepe tayari imetumika
//         if (error.response.status === 400 && error.response.data.includes('email')) {
//           errorMessage = 'Barua pepe hii tayari imetumika. Tafadhali tumia barua pepe nyingine.';
//         }
//       }
      
//       Alert.alert('Kosa', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <Text style={styles.title}>Undi Akaunti Mpya</Text>

//       <View style={styles.inputContainer}>
//         <FontAwesome name="user" size={20} color="#0077be" style={styles.icon} />
//         <TextInput
//           placeholder="Jina Kamili"
//           style={styles.input}
//           value={fullName}
//           onChangeText={setFullName}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <FontAwesome name="envelope" size={18} color="#0077be" style={styles.icon} />
//         <TextInput
//           placeholder="Barua Pepe"
//           style={styles.input}
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <FontAwesome name="lock" size={20} color="#0077be" style={styles.icon} />
//         <TextInput
//           placeholder="Nenosiri"
//           secureTextEntry
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <FontAwesome name="phone" size={20} color="#0077be" style={styles.icon} />
//         <TextInput
//           placeholder="Namba ya Simu (Mf: 0625808080)"
//           style={styles.input}
//           value={phone}
//           onChangeText={setPhone}
//           keyboardType="phone-pad"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <FontAwesome name="map-marker" size={20} color="#0077be" style={styles.icon} />
//         <TextInput
//           placeholder="Anwani (Si lazima)"
//           style={styles.input}
//           value={address}
//           onChangeText={setAddress}
//         />
//       </View>

//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#0077be" />
//           <Text style={styles.loadingText}>Inasajili akaunti yako...</Text>
//         </View>
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={handleRegister}>
//           <Text style={styles.buttonText}>Sajili Sasa</Text>
//         </TouchableOpacity>
//       )}

//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.link}>Tayari una akaunti? Ingia</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 25,
//     paddingTop: 60,
//     paddingBottom: 40,
//     backgroundColor: '#e6f6ff',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     textAlign: 'center',
//     color: '#0077be',
//     marginBottom: 30,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 12,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#b3daff',
//     shadowColor: '#0077be',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   icon: {
//     marginRight: 10,
//     width: 24,
//     textAlign: 'center',
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     paddingVertical: 5,
//   },
//   button: {
//     backgroundColor: '#0077be',
//     paddingVertical: 15,
//     borderRadius: 30,
//     marginTop: 15,
//     marginBottom: 25,
//     shadowColor: '#005a8c',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   link: {
//     textAlign: 'center',
//     color: '#0077be',
//     fontSize: 16,
//     fontWeight: '500',
//     textDecorationLine: 'underline',
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#0077be',
//     fontSize: 16,
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { registerCustomer } from '../api'; // Import function kutoka api

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validate required fields
    if (!fullName || !password || !phone) {
      Alert.alert('Sehemu Zinazokosewa', 'Tafadhali jaza sehemu zote muhimu.');
      return;
    }

    // Validate phone number format (must start with 0 and be 10 digits)
    if (!/^0\d{9}$/.test(phone)) {
      Alert.alert('Simu Si Sahihi', 'Tafadhali weka namba ya simu yenye tarakimu 10 na kuanzia na 0.');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert('Nenosiri Dhaifu', 'Nenosiri lazima liwe na herufi angalau 6.');
      return;
    }

    // Optional: Validate email if provided
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Barua Pepe Si Sahihi', 'Tafadhali andika barua pepe sahihi au acha tupu.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await registerCustomer({
        name: fullName,       // Backend inatarajia "name"
        email: email || null, // Email optional
        password,             // Backend inatarajia "password"
        phone,                // Backend inatarajia "phone"
        address               // Namba ya nyumba
      });

      if (response && response.id) {
        Alert.alert(
          'Usajili Umefanikiwa',
          `Namba yako ya mita ni: ${response.meterNumber || 'Haijapatikana'}\n\nKaribu ${fullName}!`,
          [{ text: 'Sawa', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Usajili Umeshindwa', 'Tafadhali jaribu tena baadae.');
      }
    } catch (error) {
      console.error('Kosa la usajili:', error);

      let errorMessage = 'Imeshindikana kumsajili mteja. Tafadhali angalia muunganisho wako au jaribu tena.';

      if (error.response) {
        if (error.response.data) {
          errorMessage = error.response.data;
        }
        if (error.response.status === 400 && error.response.data.includes('email')) {
          errorMessage = 'Barua pepe hii tayari imetumika. Tafadhali tumia barua pepe nyingine.';
        }
      }

      Alert.alert('Kosa', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Undi Akaunti Mpya</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#0077be" style={styles.icon} />
        <TextInput
          placeholder="Jina Kamili"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="phone" size={20} color="#0077be" style={styles.icon} />
        <TextInput
          placeholder="Namba ya Simu (Mf: 0625808080)"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#0077be" style={styles.icon} />
        <TextInput
          placeholder="Nenosiri"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="map-marker" size={20} color="#0077be" style={styles.icon} />
        <TextInput
          placeholder="Namba ya Nyumba (Anwani)"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={18} color="#0077be" style={styles.icon} />
        <TextInput
          placeholder="Barua Pepe (Hiari)"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077be" />
          <Text style={styles.loadingText}>Inasajili akaunti yako...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sajili Sasa</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Tayari una akaunti? Ingia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#e6f6ff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0077be',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#b3daff',
    shadowColor: '#0077be',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
    width: 24,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },
  button: {
    backgroundColor: '#0077be',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 25,
    shadowColor: '#005a8c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#0077be',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#0077be',
    fontSize: 16,
  },
});
