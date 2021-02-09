import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Dimensions, Platform, Text, View } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';


import Home from '../screens/home';
import Buys from '../screens/buys';
import WhiteList from '../screens/whitelist';
import Cart from '../screens/cart';
import Profile from '../screens/profile';


import CartIcon from './cartIcon';
import ItemsOnWhiteList from './itemsOnWhiteList';

import TabTwoScreen from '../screens/TabTwoScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';
import SearchBar from './searchBar';

const {width} = Dimensions.get('window');

const BottomTab = createBottomTabNavigator<any>();

export function BottomTabNavigator(props: any) {

    return (
        <BottomTab.Navigator
            initialRouteName="Inicio"
            tabBarOptions={{
                activeTintColor: Colors.default.primaryColor,
                activeBackgroundColor: '#FFF',
                inactiveBackgroundColor: '#FFF',
                inactiveTintColor: '#bbb',
                style: {
                    height: 50,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(200,200,200,0.2)",
                    backgroundColor: 'white'
                }
                // showLabel: false,
            }}>
            <BottomTab.Screen
                name="Inicio"
                component={TabOneNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Inicio</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Compras"
                component={TabTreeNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Favoritos</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="heart-o" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Carro"
                component={TabFourNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Mis Compras</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Notificaciones"
                component={TabTwoNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Notificaciones</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="bell-o" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={TabFiveNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Mas</Text>,
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
                    headerTitle: '',
                    cardStyle: { backgroundColor: 'rgba(250,250,250,1)' },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 24, fontFamily: 'Poppins-SemiBold', alignSelf: 'center',height: '100%' },
                    headerStyle: { backgroundColor: '#FFF', shadowColor: 'transparent' },
                    headerStatusBarHeight: Platform.OS === 'ios' ? 40 : 20,
                    header: () => (
                        <View style={{width, paddingTop: 24, backgroundColor: Colors.default.yellow, height: 70, flexDirection: 'row',
                        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
                            <SearchBar navigation={navigation} style={{marginRight: 40}} />
                            <CartIcon navigation={navigation} style={{marginTop: 15}} />
                        </View>
                    )
                }}
            />
        </TabOneStack.Navigator>
    );
}

const TabTwoStack = createStackNavigator<any>();
function TabTwoNavigator() {
    return (
        <TabTwoStack.Navigator>
            <TabTwoStack.Screen
                name="Buys"
                component={Buys}
                options={{
                    cardStyle: { backgroundColor: '#FFF' },
                    headerShown: false,
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
                    headerTransparent: true,
                    cardStyle: { backgroundColor: '#FFF' },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 24, alignSelf: 'center',height: '100%' },
                    headerStyle: { display: 'none' },
                    headerRight: () => null,
                    headerTitle: () => null,
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null
                }}
            />
        </TabTreeStack.Navigator>
    );
}

const TabFourStack = createStackNavigator<any>();
function TabFourNavigator() {
    return (
        <TabFourStack.Navigator>
            <TabFourStack.Screen
                name="Carro"
                component={Cart}
                options={{
                    headerTransparent: true,
                    cardStyle: { backgroundColor: '#FFF'  },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 24, alignSelf: 'center',height: '100%' },
                    headerStyle: { display: 'none' },
                    headerTitle: () => null,
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null
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
                    headerTitle: 'Perfil',
                    cardStyle: { backgroundColor: '#FFF' },
                    headerTitleStyle: { textAlign: 'center', color: '#000',  fontWeight: 'bold', alignSelf: 'center',height: '100%', marginTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? 0 : 60 },
                    headerStyle: { backgroundColor: '#FFF', shadowColor: 'transparent' },
                    headerStatusBarHeight: Platform.OS === 'ios' ? 40 : 20,
                    headerRight: () => (
                        <CartIcon navigation={navigation} style={{backgroundColor: '#FFF', marginTop: Platform.OS === 'ios' ? 8 : 24}} />
                    ),
                    headerBackTitleVisible: false,
                    headerBackTitleStyle: {display: 'none'},
                    headerBackImage: () => null
                }}
            />
        </TabFiveStack.Navigator>
    );
}
