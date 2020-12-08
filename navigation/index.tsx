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
import { ColumnGridViewComponent } from '../components/FlatLists/columnGridView';
import { ProductDescriptionComponent } from '../components/products/product-description';
import { ProductCommentsComponent } from '../components/products/product-comments';
import SingleProduct from '../components/products/single-product';
import { VerticalGridViewComponent } from '../components/FlatLists/verticalGridView';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const optionsEmpty = { headerShown: false, cardStyle: { backgroundColor: '#FFF' }, headerTintColor: '#FFF', };

const optionBack = {cardStyle: { backgroundColor: '#FFF' }, headerStyle: { backgroundColor: '#FFF' }, headerTitleStyle: { color: '#000'}, headerBackTitleVisible: false, headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="black" style={{marginLeft: 30,fontSize: 24}} />),}


function RootNavigator({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={optionsEmpty}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={optionsEmpty}
      />
      <Stack.Screen name="Components" component={ComponentsNavigator} options={{headerShown: false}} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}


const ComponentsStack = createStackNavigator<any>();
function ComponentsNavigator({navigation}: any) {
    return (
        <ComponentsStack.Navigator>
            <ComponentsStack.Screen
              name="Description"
              component={ProductDescriptionComponent}
              options={optionBack}
            />

            <ComponentsStack.Screen
              name="Comments"
              component={ProductCommentsComponent}
              options={optionBack}
            />
            
            
            <ComponentsStack.Screen
              name="SingleProduct"
              component={SingleProduct}
              options={{
                headerTransparent: true,
                cardStyle: { backgroundColor: '#FFF' },
                headerTintColor: 'transparent',
                headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="black" style={{marginLeft: 30,fontSize: 24}} />),
                headerBackTitleVisible: false,
                headerRight: () => (
                  <CartIcon navigation={navigation} style={{backgroundColor: 'transparent', marginTop: 15}} />
                ),
              }}
            />
            
            <ComponentsStack.Screen
              name="ColumnGridView"
              component={ColumnGridViewComponent}
              options={{cardStyle: { backgroundColor: '#F9F9F9' }, headerStyle: { backgroundColor: '#FFF' }, headerTitleStyle: { color: '#000'}, headerBackTitleVisible: false, headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="black" style={{marginLeft: 30,fontSize: 24}} />),headerTransparent: true}}
            />
        </ComponentsStack.Navigator>
    );
}
