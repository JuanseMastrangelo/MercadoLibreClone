import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import {BottomTabNavigator} from './BottomTabNavigator';


import CartIcon from './cartIcon';

import LoginScreen from '../screens/auth/Login'
import RegisterScreen from '../screens/auth/Register'
import {SingleProduct} from '../components/products/single-product'
import { GridViewComponent } from '../components/products/gridView';
import { ProductDescriptionComponent } from '../components/products/product-description';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const defaultOptions = { headerShown: false, cardStyle: { backgroundColor: '#FFF' }, headerStyle: { backgroundColor: 'red'}, headerTintColor: '#FFF', };

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={defaultOptions}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={defaultOptions}
      />

      <Stack.Screen
        name="Description"
        component={ProductDescriptionComponent}
        options={defaultOptions}
      />
      
      <Stack.Screen
        name="SingleProduct"
        component={SingleProduct}
        options={{
          headerTransparent: true,
          cardStyle: { backgroundColor: '#FFF' },
          headerTintColor: 'transparent',
          headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="black" style={{marginLeft: 30,fontSize: 24}} />),
          headerBackTitleVisible: false,
          headerRight: () => (
            <CartIcon style={{backgroundColor: 'transparent', marginTop: 15}} />
          ),
        }}
      />
      
      <Stack.Screen
        name="GridView"
        component={GridViewComponent}
        options={{
          headerTransparent: true,
          headerTitleStyle: {color: '#000'},
          cardStyle: { backgroundColor: '#FFF' },
          headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="black" style={{marginLeft: 30,fontSize: 24}} />),
          headerBackTitleVisible: false,
          headerRight: () => (
            <CartIcon style={{backgroundColor: 'transparent', marginTop: 15}} />
          ),
        }}
      />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}
