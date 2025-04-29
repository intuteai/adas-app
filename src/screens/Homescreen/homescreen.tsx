import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { Camera, useCameraDevices, useCameraPermission, VideoFile } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';
import { styles } from '../Homescreen/homescreen.styles';

const HomeScreen = () => {
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>('back');
  const [torch, setTorch] = useState<'on' | 'off'>('off');
  const [recording, setRecording] = useState(false);
  const [permissionsAsked, setPermissionsAsked] = useState(false);

  const navigation = useNavigation();
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = cameraPosition === 'back' ? devices.back : devices.front;
  const { hasPermission, requestPermission } = useCameraPermission();

  const askPermissions = useCallback(async () => {
    const permission = await requestPermission();
    if (permission === false) {
      Alert.alert('Permission Required', 'Please allow Camera and Microphone access.', [
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
        { text: 'Cancel', style: 'cancel' }
      ]);
    } else {
      setPermissionsAsked(true);
    }
  }, [requestPermission]);

  const handleStartRecording = async () => {
    try {
      if (!permissionsAsked) {
        await askPermissions();
      }

      if (cameraRef.current == null) {
        Alert.alert('Camera Error', 'Camera not ready yet.');
        return;
      }

      await cameraRef.current.startRecording({
        onRecordingFinished: (video: VideoFile) => {
          console.log('Recording finished:', video.path);
          Alert.alert('Video Saved', `Path: ${video.path}`);
          setRecording(false);
        },
        onRecordingError: (error) => {
          console.error('Recording error:', error);
          Alert.alert('Recording Error', error.message);
          setRecording(false);
        }
      });
      setRecording(true);
    } catch (error) {
      console.error('Start Recording Error:', error);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Driver Safety System</Text>

        {/* Start Recording Card */}
        <TouchableOpacity style={styles.card} onPress={askPermissions} activeOpacity={0.8}>
          <FontAwesome name="video-camera" size={40} color="#1F2937" style={{ marginBottom: 10 }} />
          <Text style={styles.cardTitle}>Start Recording</Text>
          <Text style={styles.cardSubtitle}>Allow Camera and Microphone access</Text>
        </TouchableOpacity>

        {/* Dashboard Button Card */}
        <TouchableOpacity style={[styles.card, { marginTop: 20 }]} onPress={() => navigation.navigate('Dashboard')} activeOpacity={0.8}>
          <FontAwesome name="dashboard" size={40} color="#1F2937" style={{ marginBottom: 10 }} />
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardSubtitle}>Go to your dashboard and settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1F2937" />
        <Text style={styles.text}>Loading Camera...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
        audio={true}
        torch={torch}
      />
    </View>
  );
};

export default HomeScreen;
