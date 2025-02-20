import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MeterScreen() {
  const router = useRouter();
  const [meterNumber, setMeterNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !meterNumber) {
      alert('Please select an image and enter meter number');
      return;
    }

    try {
      // Create form data
      const formData = new FormData();
      formData.append('meterImage', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'meter_image.jpg',
      } as any);
      formData.append('meterNumber', meterNumber);

      // Replace this with your actual server URL
      const serverUrl = 'YOUR_SERVER_URL/upload';

      // Show loading state
      setIsLoading(true);

      const response = await fetch(serverUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // If response is not JSON, get text
        const text = await response.text();
        console.log('Server response:', text);
        throw new Error('Server did not return JSON response');
      }

      // Success
      alert('Successfully uploaded!');
      setSelectedImage(null);
      setMeterNumber('');
      
    } catch (error: any) {
      // More detailed error message
      let errorMessage = 'Error uploading data: ';
      if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      console.error('Upload error:', error);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Meter Reading</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Enter Meter Number"
          value={meterNumber}
          onChangeText={setMeterNumber}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <ThemedView style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.preview} />
          ) : (
            <ThemedText style={styles.placeholderText}>No image selected</ThemedText>
          )}
        </ThemedView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={() => router.push('/camera')}
          >
            <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.galleryButton]}
            onPress={pickImage}
          >
            <ThemedText style={styles.buttonText}>Choose from Gallery</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            isLoading && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Uploading...' : 'Submit'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: Platform.select({ ios: '#ffffff', android: '#ffffff', default: '#ffffff' }),
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageContainer: {
    backgroundColor: Platform.select({ ios: '#ffffff', android: '#ffffff', default: '#ffffff' }),
    borderRadius: 10,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    marginRight: 10,
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#FF9800',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
