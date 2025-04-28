import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './otpscreen.styles';
import { Alert } from 'react-native';

const OTPVerificationScreen = ({ navigation }: any) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleChangeText = (text: string, index: number) => {
    if (text.length > 1) return; // Only allow 1 digit

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    console.log('Entered OTP:', otpCode);
    if (otpCode.length !== 4) {
      Alert.alert('Please enter a valid 4-digit OTP.');
      return;
    }
    // navigation.navigate('HomeScreen');
  };

  const handleResend = () => {
    setTimer(30);
    console.log('Resending OTP...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {timer > 0 ? (
          <Text style={styles.resendText}>Resend OTP in {timer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={[styles.resendText, { color: '#2563EB' }]}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OTPVerificationScreen;
