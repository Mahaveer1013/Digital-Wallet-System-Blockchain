import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricData, setBiometricData] = useState(null);
  const [isSensorAvailable, setIsSensorAvailable] = useState(false);

  useEffect(() => {
    // Check if the device has biometric authentication available
    LocalAuthentication.hasHardwareAsync()
      .then((hasHardware) => setIsSensorAvailable(hasHardware))
      .catch((error) => console.error('Error checking for biometric hardware:', error));
  }, []);

  const handleBiometricAuthentication = () => {
    if (!isSensorAvailable) {
      Alert.alert('Error', 'Biometric sensor is not available.');
      return;
    }

    // Authenticate with biometric (fingerprint or face recognition)
    LocalAuthentication.authenticateAsync({
      promptMessage: 'Scan your fingerprint to login',
      fallbackLabel: 'Use Passcode'
    })
      .then((result) => {
        if (result.success) {
          setBiometricData('fingerprint_scanned');
          Alert.alert('Biometric Success', 'Fingerprint recognized!');
        } else {
          Alert.alert('Biometric Error', 'Authentication failed.');
        }
      })
      .catch((error) => {
        Alert.alert('Biometric Error', error.message);
      });
  };

  const handleLogin = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    const user = JSON.parse(storedUser);

    if (!user) {
      Alert.alert('Error', 'No user found. Please register first.');
      return;
    }

    if (email === user.email && password === user.password && biometricData) {
      Alert.alert('Success', 'Login successful!');
      // Navigate to home screen or dashboard
    } else {
      Alert.alert('Error', 'Invalid credentials or biometric data');
    }
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />

      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

      {/* Biometric Authentication Button */}
      {isSensorAvailable && (
        <Button title="Scan Fingerprint" onPress={handleBiometricAuthentication} />
      )}

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
