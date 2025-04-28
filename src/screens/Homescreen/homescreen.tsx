import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Platform, Linking } from 'react-native';
import { Camera, useCameraDevices, VideoFile } from 'react-native-vision-camera';
import {Icon} from 'react-native-elements';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { styles } from '../Homescreen/homescreen.styles';

const HomeScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [permissionAsked, setPermissionAsked] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'back');

  const askPermissionsAndStart = async () => {
    try {
      let cameraStatus;
      let micStatus;
  
      if (Platform.OS === 'android') {
        cameraStatus = await check(PERMISSIONS.ANDROID.CAMERA);
        micStatus = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
  
        if (cameraStatus === RESULTS.DENIED || micStatus === RESULTS.DENIED) {
          cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
          micStatus = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        }
      } else {
        cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
        micStatus = await request(PERMISSIONS.IOS.MICROPHONE);
      }
  
      if (cameraStatus === RESULTS.GRANTED && micStatus === RESULTS.GRANTED) {
        setHasPermission(true);
      } else if (cameraStatus === RESULTS.BLOCKED || micStatus === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Please allow Camera and Microphone access from Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() }
          ]
        );
      } else {
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to get permissions.');
    }
    setPermissionAsked(true);
  };

  const handleStartRecording = async () => {
    if (!device) {
      Alert.alert('Camera not ready', 'Please wait...');
      return;
    }

    try {
      camera.current?.startRecording({
        onRecordingFinished: (video: VideoFile) => {
          console.log('Recording finished:', video.path);
          Alert.alert('Recording Saved', `Saved to: ${video.path}`);
          setRecording(false);
        },
        onRecordingError: (error) => {
          console.error('Recording error:', error);
          Alert.alert('Recording Error', error.message);
          setRecording(false);
        },
      });

      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording.');
      setRecording(false);
    }
  };

  const handleStartButton = async () => {
    if (!permissionAsked) {
      await askPermissionsAndStart();
    }
  };

  useEffect(() => {
    if (hasPermission && device && permissionAsked && !recording) {
      setCameraReady(true);
      handleStartRecording();
    }
  }, [hasPermission, device, permissionAsked]);

  // First: Show start screen
  if (!permissionAsked) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Driver Safety System</Text>

        <TouchableOpacity style={styles.card} onPress={handleStartButton} activeOpacity={0.8}>
          <Icon name="video" size={40} color="#1F2937" style={{ marginBottom: 10 }} />
          <Text style={styles.cardTitle}>Start Recording</Text>
          <Text style={styles.cardSubtitle}>Monitor driver's drowsiness in real-time</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Permission denied
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera and Microphone permissions are required.</Text>
      </View>
    );
  }

  // Device not ready yet
  if (!device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1F2937" />
        <Text style={styles.text}>Loading Camera...</Text>
      </View>
    );
  }

  // Camera ready, show preview + button
  if (cameraReady) {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={true}
          audio={true}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.card} onPress={handleStartRecording} activeOpacity={0.8}>
            <Icon name="video" size={40} color="#1F2937" style={{ marginBottom: 10 }} />
            <Text style={styles.cardTitle}>
              {recording ? 'Recording...' : 'Start Recording'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {recording ? 'Recording in progress' : 'Monitor drivers drowsiness in real-time'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Default fallback
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Initializing...</Text>
    </View>
  );
};

export default HomeScreen;
