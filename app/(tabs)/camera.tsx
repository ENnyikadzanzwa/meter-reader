import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type CameraFacing = 'back' | 'front';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraFacing>('back');
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);

  // Show unsupported message for web platform
  if (Platform.OS === 'web') {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          Camera functionality is not available on web browsers.
          Please use a mobile device to access this feature.
        </ThemedText>
        <Link href="/home" asChild>
          <TouchableOpacity style={[styles.button, styles.backButton]}>
            <ThemedText style={styles.buttonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    );
  }

  if (!permission) {
    // Camera permissions are still loading
    return <ThemedView />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          We need your permission to show the camera
        </ThemedText>
        <TouchableOpacity 
          style={[styles.button, styles.permissionButton]}
          onPress={requestPermission}
        >
          <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
        </TouchableOpacity>
        <Link href="/home" asChild>
          <TouchableOpacity style={[styles.button, styles.backButton]}>
            <ThemedText style={styles.buttonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 1,
        });
        
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        // router.replace('/(tabs)/meter', { imageUri: photo.uri });
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Camera
        style={styles.camera}
        type={facing === 'back' ? Camera.Constants.Type.back : Camera.Constants.Type.front}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.overlay}>
          <View style={styles.topButtons}>
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={toggleCameraFacing}
            >
              <ThemedText style={styles.buttonText}>Flip Camera</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    padding: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
