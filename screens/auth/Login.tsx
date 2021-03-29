import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Spinner } from '@ui-kitten/components';
import * as React from 'react';
import { StatusBar, Text, Dimensions, AsyncStorage, View, Image } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { authKey, configFirebaseGoogleAuth, firebaseConfig } from '../../constants/KeyConfig';

import { urlApi } from '../../constants/KeyConfig';

const { height, width } = Dimensions.get('window');

const GoogleIcon = (props: any) => (
    <Ionicons name='logo-google' size={20} style={{ color: '#1da1f2', backgroundColor: '#FFF', paddingVertical: 3, paddingHorizontal: 7 }} />
  );


import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { Toast } from 'native-base';
import { HttpService } from '../../constants/HttpService';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default class LoginScreen extends React.Component<any, any> { 
    httpService: any = null;
    
    constructor(props: any) {
        super(props)
        StatusBar.setBarStyle('dark-content', true);

        this.state = {
            secureTextEntry: true,
            verificateLogged: false,
            emailInput: '',
            passInput: '',
            loading: false
        }
        this.httpService = new HttpService();
    }

    componentDidMount = async () => {
        const userSession = await AsyncStorage.getItem(authKey);
        userSession && this.redirectTo('Root');
        this.setState({verificateLogged: true});
    }


    signInWithEmail = () => {
        const { emailInput, passInput } = this.state;
        if (this.validateEmail(emailInput)) {
            this.setState({loading: true});
            firebase.auth().signInWithEmailAndPassword(emailInput, passInput).then(async (user: any) => {
                await AsyncStorage.setItem(authKey, JSON.stringify(user));
                this.setState({loading: false});
                this.redirectTo('Root')
            }).catch((err: any) => {
                alert(err)
                this.setState({loading: false});
            })
        } else {
            alert('Ingresa un email válido')
        }
    }

    validateEmail = (email: string) => {
        var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };


    redirectTo = (name: string) => {
        this.props.navigation.navigate(name);
        this.props.navigation.reset({ index: 0, routes: [{ name: name }], });
    }

    initAsync = async () => {
        const res = await Google.logInAsync(configFirebaseGoogleAuth);
        if (res.type === 'success') {
            this.loginIn(res.accessToken!)
            this.setState({user: res.user})
        }
    };

    async loginIn(token: string) {
        this.setState({loading: true});
        let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        let userData = await userInfoResponse.json();


        this.httpService.post('/auth', {
            'uid': userData.id,
            'displayName': userData.name,
            'email': userData.email,
            'photoURL': userData.picture,
            'refreshToken': token
        },
        new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })).then(async (_:any) => {
            userData = Object.assign({},{token}, userData);
            await AsyncStorage.setItem(authKey, JSON.stringify(userData))
            this.setState({loading: false});
            this.redirectTo('Root')
        })
    }

    render() {
        const { secureTextEntry, verificateLogged, emailInput, passInput, loading } = this.state;

        const toggleSecureEntry = () => {
            this.setState({secureTextEntry: !secureTextEntry})
        };

        const renderIcon = (props: any) => (
            <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Ionicons name={secureTextEntry ? 'ios-eye-off' : 'ios-eye'} size={30} style={{ marginBottom: -3 }} />
            </TouchableWithoutFeedback>
        );

        return(
            <View style={{height, width, position: 'relative'}}>
                <Image style={{ width, height, resizeMode: 'cover', position: 'absolute'}} source={{uri: 'https://i.pinimg.com/564x/63/f5/66/63f566eeb91c2d424a6627671b9b911f.jpg'}}></Image>
                
                <Image source={{uri: 'https://www.amphoralogistics.com/_nuxt/img/landing.cca6a42.gif'}}
                style={{width: 300, height: 300, position: 'absolute', right: 0, bottom: 0}} />
                {
                    verificateLogged && !loading ?
                    <View>
                        <View style={{width, paddingHorizontal: 30, paddingTop: height*0.1}}>
                            <Text style={{color: '#FFF', fontSize: 50, fontWeight: 'bold'}}>Hola,</Text>
                            <Text style={{color: '#FFF', fontSize: 20, fontWeight: 'bold'}}>somos tu plataforma de compras en linea! Inicia sesión para continuar.</Text>
                        </View>
                        {/* <View style={{paddingHorizontal: 28, width, marginTop: height*0.1}}>
                            <Input
                                label='Correo electrónico'
                                value={emailInput}
                                textContentType='emailAddress'
                                onChangeText={emailInput => this.setState({emailInput})}
                                placeholder='Ingrese su correo electrónico..'
                            />
                            <Input
                                style={{marginTop: 20}}
                                label='Password'
                                placeholder='Ingrese su contraseña..'
                                value={passInput}
                                onChangeText={passInput => this.setState({passInput})}
                                accessoryRight={renderIcon}
                                secureTextEntry={secureTextEntry}
                            />
                            
                            <TouchableOpacity onPress={this.signInWithEmail}>
                                <Button style={{marginTop: 20, backgroundColor: Colors.default.accentColor, borderColor: Colors.default.accentColor}} size='medium'>
                                    Iniciar sesión
                                </Button>
                            </TouchableOpacity>
                        </View>
                        <Text style={{width, textAlign: 'center', paddingVertical: 20, fontWeight: 'bold'}}>ó</Text> */}
                        <View style={{ paddingHorizontal: 28, width, alignItems: 'center', marginTop: height*0.1}}>
                            <TouchableOpacity onPress={this.initAsync}>
                                <Button size='medium' style={{width: '100%', backgroundColor: '#1da1f2', borderColor: '#1da1f2'}} accessoryLeft={GoogleIcon}>
                                    Iniciar sesión con Google
                                </Button>
                            </TouchableOpacity>
                        </View>
                        {/* <Text onPress={() => {this.redirectTo('RegisterScreen')}} style={{width, textAlign: 'center', paddingVertical: 20, fontWeight: 'bold', textDecorationLine: 'underline', textDecorationColor: '#000'}}>Registrarme ahora!</Text> */}
                    </View>
                : 
                <View style={{width, height, alignItems: 'center', justifyContent: 'center'}}>
                    <Spinner></Spinner>
                    <Text style={{color: 'white'}}>Verificando sesión...</Text>
                </View>
                }
                
            </View>
        )
    }
}