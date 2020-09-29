import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Text, View } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import Home from '../screens/home';
import CartIcon from './cartIcon';
import TabTwoScreen from '../screens/TabTwoScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

const BottomTab = createBottomTabNavigator<any>();

export function BottomTabNavigator(props: any) {

    return (
        <BottomTab.Navigator
            initialRouteName="Inicio"
            tabBarOptions={{
                activeTintColor: Colors.default.darkColor,
                activeBackgroundColor: '#FFF',
                inactiveBackgroundColor: '#FFF',
                inactiveTintColor: '#bbb',
                style: {
                    height: 60,
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
                name="Buscar"
                component={TabTwoNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Comprar</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="search" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Compras"
                component={TabTreeNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>WhiteList</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="heart-o" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Notificaciones"
                component={TabTreeNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Carro</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="shopping-bag" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
            <BottomTab.Screen
                name="Más"
                component={TabTreeNavigator}
                options={{
                    tabBarLabel: ({ color }) => <Text style={{ color, fontSize: 10, marginBottom: 5, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' }}>Perfil</Text>,
                    tabBarIcon: ({ color }) => <FontAwesome name="user-circle-o" color={color} size={20} style={{marginTop: 5}} />,
                }}
            />
        </BottomTab.Navigator>
    );


}



function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps)(BottomTabNavigator)

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string, style?:any }) {
    return <Ionicons size={20} {...props}  />;
}

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
                    cardStyle: { backgroundColor: '#FFF' },
                    headerTitleStyle: { textAlign: 'center', color: '#000', fontWeight: 'bold', fontSize: 24, fontFamily: 'Potra', alignSelf: 'center',height: '100%' },
                    headerStyle: { backgroundColor: '#FFF', shadowColor: 'transparent' },
                    headerStatusBarHeight: 40,
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: 15, marginBottom: 10, height: 40 }}>
                            <Ionicons name="ios-menu" size={35} color="#000" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <CartIcon />
                    ),
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
                name="TabTwoScreen"
                component={TabTwoScreen}
                options={{ headerTitle: 'Tab Two Title' }}
            />
        </TabTwoStack.Navigator>
    );
}

const TabTreeStack = createStackNavigator<any>();
function TabTreeNavigator() {
    return (
        <TabTreeStack.Navigator>
            <TabTreeStack.Screen
                name="TabTwoScreen"
                component={TabTwoScreen}
                options={{ headerTitle: 'Tab Two Title' }}
            />
        </TabTreeStack.Navigator>
    );
}
