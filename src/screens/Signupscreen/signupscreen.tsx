import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import CountryPicker, { CountryCode} from 'react-native-country-picker-modal';
import { styles } from './signupscreen.styles'; 

const SignupScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<'IN' | string>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSelectCountry = (country: any) => {
    setCountryCode(country.cca2 as CountryCode);
    setCallingCode(country.callingCode[0]);
  };

  const handleSendOtp = () => {
    if (phoneNumber.length < 6) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number.');
      return;
    }
    if (!email.includes('@') || email.length < 5) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters.');
      return;
    }

    const fullPhoneNumber = `+${callingCode}${phoneNumber}`;
    console.log('Sending OTP to:', fullPhoneNumber);
    console.log('Email:', email);
    console.log('Password:', password);

    // You can now trigger OTP logic or signup API call
    // navigation.navigate('OtpScreen', { phoneNumber: fullPhoneNumber, email, password });
  };

  const handleLoginRedirect = () => {
    console.log('Navigate to Login Screen');
    // navigation.navigate('LoginScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Create an Account</Text>

      {/* Username Input */}
      <View style={styles.singleInputContainer}>
  <TextInput
    style={styles.input}
    placeholder="Full Name"
    placeholderTextColor="#6B7280"
    autoCapitalize="words" 
    value={fullName}
    onChangeText={setFullName}
  />
</View>


      {/* Country Code Picker + Phone Number */}
      <View style={styles.inputContainer}>
        <CountryPicker
          countryCode={countryCode}
          withCallingCodeButton
          withFlag
          withEmoji
          withFilter
          onSelect={handleSelectCountry}
          containerButtonStyle={styles.countryPicker}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#6B7280"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Email Input */}
      <View style={styles.singleInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.singleInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendOtp} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      {/* Login redirect */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
  <View style={{ flexDirection: 'row' }}>
    <Text style={{ color: '#6B7280', fontSize: 16 }}>
      Already have an account?{' '}
    </Text>
    <Text style={{ fontWeight: 'bold', color: '#2563EB', fontSize: 16 }}>
      Login
    </Text>
  </View>
</TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
