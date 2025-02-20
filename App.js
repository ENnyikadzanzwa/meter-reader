import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Meter Reader',
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen}
          options={{
            title: 'Take Photo',
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
