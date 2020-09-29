import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import {BottomTabNavigator} from './BottomTabNavigator';



import LoginScreen from '../screens/auth/Login'
import RegisterScreen from '../screens/auth/Register'


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          cardStyle: { backgroundColor: '#FFF' },
          headerStyle: { backgroundColor: 'red'},
          headerTintColor: '#FFF',
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          cardStyle: { backgroundColor: '#FFF' },
          headerStyle: { backgroundColor: 'red'},
          headerTintColor: '#FFF',
        }}
      />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
