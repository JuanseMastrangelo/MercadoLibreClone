import { NavigationContainer, DefaultTheme, DarkTheme, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, Dimensions, Platform, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../types';
import {BottomTabNavigator} from './BottomTabNavigator';

const {width} = Dimensions.get('window');

import CartIcon from './cartIcon';

import LoginScreen from '../screens/auth/Login'
import RegisterScreen from '../screens/auth/Register'
import ColumnGridViewComponent from '../components/FlatLists/columnGridView';
import { ProductDescriptionComponent } from '../components/products/product-description';
import { ProductCommentsComponent } from '../components/products/product-comments';
import SingleProduct from '../components/products/single-product';
import ChatScreen from '../components/chat';
import SearchScreen from '../components/search';
import Colors from '../constants/Colors';
import { Text } from 'native-base';
import SearchBar from './searchBar';
import ChatRoomsScreen from '../components/chat/rooms';
import { TouchableOpacity } from 'react-native-gesture-handler';


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
                cardStyle: { backgroundColor: '#F2F2F2' },
                headerStyle: { backgroundColor: Colors.default.primaryColor}, 
                headerTintColor: 'transparent',
                headerBackImage: ()=>(<Ionicons name="md-arrow-back" size={20} color="black" style={{paddingHorizontal: 10,fontSize: 24}} />),
                headerBackTitleVisible: false,
                headerRight: () => (
                  <View style={{height: '100%', marginRight: 25, flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome onPress={() => navigation.dispatch(StackActions.replace('Root', {screen: 'Compras'}))} name="heart-o" color="#000" style={{fontSize: 22, marginRight: 25, marginTop: Platform.OS === 'ios' ? 0 : -10}}></FontAwesome>
                    <FontAwesome onPress={() => navigation.push('Components', { screen: 'SearchScreen', params: {searchValue: ''} })} name="search" color="#000" style={{fontSize: 22, marginRight: 25, marginTop: Platform.OS === 'ios' ? 0 : -10}}></FontAwesome>
                    <CartIcon navigation={navigation} style={{backgroundColor: 'transparent', marginTop: 15}} />
                  </View>
                ),
              }}
            />
            
            
            <ComponentsStack.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                headerStyle: { backgroundColor: Colors.default.primaryColor, shadowColor: 'transparent' },
                cardStyle: { backgroundColor: '#F2F2F2' },
                headerTintColor: 'white',
                headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="white" style={{marginLeft: 30,fontSize: 24}} />),
                headerBackTitleVisible: false,
                
              }}
            />

            <ComponentsStack.Screen
              name="ChatRoomsScreen"
              component={ChatRoomsScreen}
              options={{
                headerStyle: { backgroundColor: Colors.default.primaryColor, shadowColor: 'transparent' },
                headerTitle: () => (
                    <Text style={{ fontSize: 16, color: 'white' }}>Vendedores</Text>
                ),
                cardStyle: { backgroundColor: '#F2F2F2' },
                headerTintColor: 'transparent',
                headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="white" style={{marginLeft: 30,fontSize: 24}} />),
                headerBackTitleVisible: false,
                
              }}
            />
            
            
            <ComponentsStack.Screen
              name="SearchScreen"
              component={SearchScreen}
              options={{
                headerStyle: { backgroundColor: Colors.default.primaryColor, shadowColor: 'transparent' },
                headerTitle: '',
                cardStyle: { backgroundColor: '#FFF' },
                headerTintColor: 'transparent',
                headerBackImage: ()=>(<Ionicons name="ios-arrow-back" size={20} color="white" style={{marginLeft: 30,fontSize: 24}} />),
                headerBackTitleVisible: false,
                headerRight: () => (
                  <View style={{backgroundColor: 'transparent', width, flexDirection: 'row', alignItems: 'center'}}>
                      <SearchBar navigation={navigation} style={{ marginLeft: 60, width: '70%'}} />
                  </View>
              )
              }}
            />
            
            <ComponentsStack.Screen
              name="ColumnGridView"
              component={ColumnGridViewComponent}
              options={{
                cardStyle: { backgroundColor: '#F2F2F2' },
                headerStyle: { backgroundColor: Colors.default.primaryColor, elevation: 0},
                headerTitleStyle: { textAlign: 'center', color: '#000', fontSize: 14, fontFamily: 'Poppins-Light', marginTop: Platform.OS === 'ios' ? 0 : 5, letterSpacing: .5 },
                headerBackImage: ()=>(<Ionicons name="md-arrow-back" size={20} color="black" style={{paddingHorizontal: Platform.OS === 'ios' ? 20 : 10,fontSize: 24}} />),
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.push('Components', { screen: 'SearchScreen', params: {searchValue: ''} })}>
                    <FontAwesome name="search" color="#000" style={{fontSize: 20, paddingHorizontal: 30}}></FontAwesome>
                  </TouchableOpacity>
                ),
                headerBackTitleVisible: false
              }}
            />
        </ComponentsStack.Navigator>
    );
}
