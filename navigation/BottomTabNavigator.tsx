import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, Platform, Text, View, Image } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';


import Home from '../screens/home';
import Buys from '../screens/buys';
import WhiteList from '../screens/whitelist';
import Cart from '../screens/cart';
import Profile from '../screens/profile';


import CartIcon from './cartIcon';
import BottomCartIcon from './bottomCartIcon';

import { connect } from 'react-redux';
import SearchBar from './searchBar';
import MessageIcon from './messageIcon';

const {width} = Dimensions.get('window');

const BottomTab = createBottomTabNavigator<any>();

export function BottomTabNavigator(props: any) {

    return (
        <BottomTab.Navigator
            initialRouteName="Inicio"
            tabBarOptions={{
                activeTintColor: Colors.default.secondaryColor,
                activeBackgroundColor: '#FFF',
                inactiveBackgroundColor: '#FFF',
                inactiveTintColor: '#bbb',
                style: {
                    height: 50,
                    borderTopWidth: .5,
                    borderTopColor: "rgba(200,200,200,0.2)",
                    backgroundColor: 'rgba(250,250,250,.9)'
                }
                // showLabel: false,
            }}>
            <BottomTab.Screen
                name="Inicio"
                component={TabOneNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 9, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Inicio</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Compras"
                component={TabTreeNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 9, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Favoritos</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="heart-o" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Carro"
                component={TabFourNavigator}
                options={{
                    // tabBarLabel: ({ color }) => <Text style={{ fontSize: 9, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold', color: '#000' }}>Mis Compras</Text>,
                    tabBarLabel: ({ color }) => null,
                    // tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" color={color} size={20} style={{marginTop: 5}} />,
                    tabBarIcon: ({ color }) => (
                        <View style={{height: 70, borderRadius: 1000,
                        width: 70, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: (color === Colors.default.primaryColor) ? color : '#FFF', borderWidth: (color !== Colors.default.primaryColor) ? 1: 0, borderColor: 'rgba(200,200,200,.25)'}}>
                            <BottomCartIcon color={(color === Colors.default.primaryColor) ? '#FFF' : color}></BottomCartIcon>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                name="Categorias"
                component={TabTwoNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 9, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Categorías</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="list-ul" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={TabFiveNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 9, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Mas</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="navicon" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
        </BottomTab.Navigator>
    );


}



function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps)(BottomTabNavigator)

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<any>();
function TabOneNavigator({ navigation }: any) {
    return (
        <TabOneStack.Navigator>
            <TabOneStack.Screen
                name="Home"
                component={Home}
                options={{
                    headerTransparent: true,
                    headerTitle: '',
                    cardStyle: { backgroundColor: '#FFF' },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 24, fontFamily: 'Poppins-SemiBold', alignSelf: 'center',height: '100%' },
                    headerStyle: { backgroundColor: '#FFF', shadowColor: 'transparent' },
                    headerStatusBarHeight: Platform.OS === 'ios' ? 40 : 20,
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null
                }}
            />
        </TabOneStack.Navigator>
    );
}

const TabTwoStack = createStackNavigator<any>();
function TabTwoNavigator({ navigation }: any) {
    return (
        <TabTwoStack.Navigator>
            <TabTwoStack.Screen
                name="Buys"
                component={Buys}
                options={{
                    headerTitle: 'Categorías',
                    cardStyle: { backgroundColor: '#F2F2F2' },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontSize: 14, fontFamily: 'Poppins-Light', marginTop: 10, letterSpacing: .5 },
                    headerStyle: { backgroundColor: Colors.default.primaryColorLight, elevation: 0 },
                    headerStatusBarHeight: Platform.OS === 'ios' ? 40 : 20,
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null
                }}
            />
        </TabTwoStack.Navigator>
    );
}

const TabTreeStack = createStackNavigator<any>();
function TabTreeNavigator({navigation}: any) {
    return (
        <TabTreeStack.Navigator>
            <TabTreeStack.Screen
                name="Favoritos"
                component={WhiteList}
                options={{
                    cardStyle: { backgroundColor: '#F2F2F2' },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontSize: 16, fontFamily: 'Poppins-Regular', marginTop: 10, letterSpacing: .5 },
                    headerStyle: { backgroundColor: Colors.default.primaryColorLight, elevation: 0 },
                    headerRight: () => (
                        <View style={{height: '100%', marginRight: 20, flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome onPress={() => navigation.push('Components', { screen: 'SearchScreen', params: {searchValue: ''} })} name="search" color="#000" style={{fontSize: 22, marginRight: 20, marginTop: Platform.OS === 'ios' ? 5 : 0}}></FontAwesome>
                            <CartIcon navigation={navigation} style={{backgroundColor: 'transparent', marginTop: Platform.OS === 'ios' ? 15 : 20}} />
                        </View>
                    ),
                    headerLeft: () => (
                        <View style={{height: '100%', marginRight: 25, flexDirection: 'row', alignItems: 'center', visibility: 'hidden'}}>
                        </View>
                    ),
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null
                }}
            />
        </TabTreeStack.Navigator>
    );
}

const TabFourStack = createStackNavigator<any>();
function TabFourNavigator({ navigation }: any) {
    return (
        <TabFourStack.Navigator>
            <TabFourStack.Screen
                name="Carro"
                component={Cart}
                options={{
                    headerTitle: '',
                    cardStyle: { backgroundColor: '#F2F2F2' },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontSize: 16, fontFamily: 'Poppins-Regular', marginTop: 10, letterSpacing: .5 },
                    headerStyle: { backgroundColor: Colors.default.primaryColorLight, elevation: 0, shadowColor: 'transparent' },
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null,
                    headerRight: () => (
                        <View style={{alignItems: 'center', marginRight: 20, height: '100%'}}>
                            <FontAwesome onPress={() => navigation.push('Components', { screen: 'SearchScreen', params: {searchValue: ''} })} name="search" color="#000"
                            style={{fontSize: 22, marginRight: 25, marginTop: 15}}></FontAwesome>
                        </View>
                    ),
                }}
            />
        </TabFourStack.Navigator>
    );
}


const TabFiveStack = createStackNavigator<any>();
function TabFiveNavigator({ navigation }: any) {
    return (
        <TabFiveStack.Navigator>
            <TabFiveStack.Screen
                name="Profile"
                component={Profile}
                options={{
                    cardStyle: { backgroundColor: '#FFF' },
                    headerTitleStyle: { textAlign: 'center', color: '#000',  fontWeight: 'bold', alignSelf: 'center',height: '100%', marginTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? 0 : 60 },
                    headerStyle: { backgroundColor: Colors.default.primaryColor, shadowColor: 'transparent' },
                    headerRight: () => (
                        <View style={{alignItems: 'center', marginRight: 20, height: '100%'}}>
                        <CartIcon navigation={navigation} style={{marginTop: 15}} styleBadge={{bottom: 30}} />
                        </View>
                    ),
                    headerTitle: () => (
                        <Text style={{ fontSize: 16, color: 'white' }}>Configuración</Text>
                    ),
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null
                }}
            />
        </TabFiveStack.Navigator>
    );
}
