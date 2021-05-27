import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Spinner } from '@ui-kitten/components';
import * as React from 'react';
import { StatusBar, Text, Dimensions, AsyncStorage, View, Image } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { authKey, configFirebaseGoogleAuth, firebaseConfig } from '../../constants/KeyConfig';

import { urlApi } from '../../constants/KeyConfig';
import InitialSyncApp from '../../components/initialSyncApp';

const { height, width } = Dimensions.get('window');

const GoogleIcon = (props: any) => (
    <Ionicons name='logo-google' size={20} style={{ color: '#1da1f2', backgroundColor: '#FFF', paddingVertical: 3, paddingHorizontal: 7 }} />
  );


import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { Toast } from 'native-base';
import { HttpService } from '../../constants/HttpService';
import AutoHeightImage from 'react-native-auto-height-image';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default class LoginScreen extends React.Component<any, any> { 
    httpService: any = null;
    
    constructor(props: any) {
        super(props)
        // StatusBar.setBarStyle('dark-content', true);

        this.state = {
            secureTextEntry: true,
            isAuthenticated: null,
            emailInput: '',
            passInput: '',
            loading: false
        }
        this.httpService = new HttpService();
    }

    componentDidMount = async () => {
        const userSession = await AsyncStorage.getItem(authKey);
        userSession && this.setState({isAuthenticated: true});
        
    }


    signInWithEmail = () => {
        const { emailInput, passInput } = this.state;
        if (this.validateEmail(emailInput)) {
            this.setState({loading: true});
            firebase.auth().signInWithEmailAndPassword(emailInput, passInput).then(async (user: any) => {
                await AsyncStorage.setItem(authKey, JSON.stringify(user));
                this.setState({loading: false, isAuthenticated: true});
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
        // this.props.navigation.navigate(name);
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
            this.setState({isAuthenticated: true});
        })
    }

    render() {
        const { secureTextEntry, isAuthenticated, emailInput, passInput } = this.state;

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
                {
                    isAuthenticated !== true ?
                    <View>
                    <Image style={{ width, height, resizeMode: 'cover', position: 'absolute'}} source={{uri: 'https://assets.afcdn.com/story/20180108/1141060_w767h767c1cx396cy260.jpg'}}></Image>
                        <View style={{display: 'flex', justifyContent: 'flex-end', height}}>
                            {/* <View style={{display: 'flex', alignItems: 'center'}}>
                                <Text style={{fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: 10}}>Métodos de pagos habilitados:</Text>
                                <AutoHeightImage
                                    width={width*.8}
                                    source={{uri: 'https://www.brownlouis.com/wp-content/uploads/2020/04/mediosdepago.png'}}
                                />
                            </View> */}
                            <View style={{backgroundColor:'rgba(250,250,250,.7)', width, paddingTop: 20}}>
                                <View style={{paddingHorizontal: 20}}>
                                    <Text style={{fontSize: 40, fontWeight: 'bold', color: '#000', fontFamily: 'Poppins-SemiBold'}}>Ingresar</Text>
                                    <Text style={{fontSize: 17, color: '#333', marginTop: 30}}>Somos tu plataforma de compras en linea! Inicia sesión para continuar.</Text>
                                </View>
                                
                                <TouchableOpacity onPress={this.initAsync} style={{marginTop: 50,
                                backgroundColor: Colors.default.secondaryColor,
                                paddingVertical: 13, display: 'flex', alignItems: 'center'}}>
                                    {renderIcon}
                                    <Text style={{color: '#FFF', fontFamily: 'Poppins-Regular'}}>Iniciar sesión con Google</Text>
                                </TouchableOpacity>
                            </View>
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
                        {/* <Text onPress={() => {this.redirectTo('RegisterScreen')}} style={{width, textAlign: 'center', paddingVertical: 20, fontWeight: 'bold', textDecorationLine: 'underline', textDecorationColor: '#000'}}>Registrarme ahora!</Text> */}
                    </View>
                :
                <InitialSyncApp navigation={this.props.navigation}></InitialSyncApp>
                }
                
            </View>
        )
    }
}