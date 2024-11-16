import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSensorAvailable, setIsSensorAvailable] = useState(false);
  const [biometricData, setBiometricData] = useState(false);  // Store success flag
  const [isDeviceLocked, setIsDeviceLocked] = useState(false); // Flag to track lock status

  useEffect(() => {
    // Check if the device has biometric authentication available and if it has a lock screen
    LocalAuthentication.hasHardwareAsync()
      .then((hasHardware) => {
        setIsSensorAvailable(hasHardware);
        if (hasHardware) {
          // Check if the device has biometric enrollment and a lock screen set
          LocalAuthentication.isEnrolledAsync()
            .then((isEnrolled) => {
              setIsDeviceLocked(isEnrolled);
            })
            .catch((error) => {
              console.error('Error checking for biometric enrollment:', error);
              setIsDeviceLocked(false);
            });
        } else {
          setIsDeviceLocked(false);
        }
      })
      .catch((error) => console.error('Error checking for biometric hardware:', error));
  }, []);

  const handleBiometricAuthentication = () => {
    if (!isDeviceLocked) {
      Alert.alert('Error', 'Please set up a lock screen on your device to use biometric authentication.');
      return;
    }

    if (!isSensorAvailable) {
      Alert.alert('Error', 'Biometric sensor is not available.');
      return;
    }

    // Authenticate with biometric (fingerprint or face recognition)
    LocalAuthentication.authenticateAsync({
      promptMessage: 'Scan your fingerprint to register',
      fallbackLabel: 'Use Passcode'
    })
      .then((result) => {
        if (result.success) {
          setBiometricData(true); // Mark that biometric was successful
          Alert.alert('Biometric Success', 'Fingerprint recognized!');
        } else {
          setBiometricData(false); // Mark that biometric failed
          Alert.alert('Biometric Error', 'Authentication failed.');
        }
      })
      .catch((error) => {
        setBiometricData(false); // Mark that biometric failed
        Alert.alert('Biometric Error', error.message);
      });
  };

  const handleRegister = async () => {
    if (username && phone && email && password && biometricData) {
      const user = { username, phone, email, password, biometricVerified: true };

      // Send data to backend (just an example)
      try {
        const response = await fetch('https://your-backend-api.com/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Success', 'Registration complete!');
          // Optionally store success flag in AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(user));
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', data.message || 'Registration failed!');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } else {
      Alert.alert('Error', 'All fields and biometric authentication are required!');
    }
  };

  return (
    <View>
      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} placeholder="Username" />

      <Text>Phone Number</Text>
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone Number" keyboardType="phone-pad" />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

      {/* Biometric Authentication Button */}
      {isSensorAvailable && (
        <Button title="Scan Fingerprint" onPress={handleBiometricAuthentication} />
      )}

      {/* Inform user to set up a lock screen if not available */}
      {!isDeviceLocked && isSensorAvailable && (
        <Text style={{ color: 'red' }}>Please set up a lock screen on your device to use biometric authentication.</Text>
      )}

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
