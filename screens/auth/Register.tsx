import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Spinner } from '@ui-kitten/components';
import * as React from 'react';
import { StatusBar, Text, Dimensions, AsyncStorage } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { authKey, configFirebaseGoogleAuth, firebaseConfig } from '../../constants/KeyConfig';

const { height, width } = Dimensions.get('window');

const GoogleIcon = (props: any) => (
    <Ionicons name='logo-google' size={20} style={{ color: '#1da1f2', backgroundColor: '#FFF', paddingVertical: 3, paddingHorizontal: 7 }} />
  );


import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

if (!firebase.apps.length) {
    firebase.initializeApp({});
}

export default class RegisterScreen extends React.Component<any, any> { 
    
    constructor(props: any) {
        super(props)
        StatusBar.setBarStyle('dark-content', true);

        this.state = {
            emailInput: '',
            passInput: '',
            passRepeatInput: ''
        }
    }

    signInWithEmail = () => {
        const { emailInput, passInput, passRepeatInput } = this.state;
        if (this.validateEmail(emailInput)) {
            if (passInput === passRepeatInput) {
                firebase.auth().createUserWithEmailAndPassword(emailInput, passInput).then(function (user: any) {
                    console.log(user)
                }).catch((err: any) => {
                    alert(err)
                })
            } else {
                alert('Las contraseñas no coinciden')
            }
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

    render() {
        const { secureTextEntry, verificateLogged, emailInput, passInput, passRepeatInput } = this.state;

        const toggleSecureEntry = () => {
            this.setState({secureTextEntry: !secureTextEntry})
        };

        const renderIcon = (props: any) => (
            <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Ionicons name={secureTextEntry ? 'ios-eye-off' : 'ios-eye'} size={30} style={{ marginBottom: -3 }} />
            </TouchableWithoutFeedback>
        );

        return(
            <View>
                <View style={{width, paddingHorizontal: 30, paddingTop: height*0.1}}>
                    <Text style={{color: Colors.default.darkColor, fontSize: 50, fontWeight: 'bold'}}>Registrarse,</Text>
                    <Text style={{color: Colors.default.darkColor, fontSize: 20, fontWeight: 'bold'}}>Comienza a usar AccTecno</Text>
                </View>
                <View style={{paddingHorizontal: 28, width, marginTop: height*0.1}}>
                    <Input
                        label='Correo electrónico'
                        value={emailInput}
                        textContentType='emailAddress'
                        onChangeText={emailInput => this.setState({emailInput})}
                        placeholder='Ingrese su correo electrónico..'
                    />
                    <Input
                        style={{marginTop: 20}}
                        label='Contraseña'
                        placeholder='Ingrese su contraseña..'
                        value={passInput}
                        onChangeText={passInput => this.setState({passInput})}
                        accessoryRight={renderIcon}
                        secureTextEntry={secureTextEntry}
                    />
                    <Input
                        style={{marginTop: 20}}
                        label='Repetir Contraseña'
                        placeholder='Ingrese su contraseña nuevamente..'
                        value={passRepeatInput}
                        onChangeText={passRepeatInput => this.setState({passRepeatInput})}
                        accessoryRight={renderIcon}
                        secureTextEntry={secureTextEntry}
                    />
                    
                    <TouchableOpacity onPress={this.signInWithEmail}>
                        <Button style={{marginTop: 20, backgroundColor: Colors.default.accentColor, borderColor: Colors.default.accentColor}} size='medium'>
                            Registrarme
                        </Button>
                    </TouchableOpacity>
                </View>
                <Text onPress={() => {this.redirectTo('LoginScreen')}} style={{width, textAlign: 'center', paddingVertical: 20, fontWeight: 'bold', textDecorationLine: 'underline', textDecorationColor: '#000'}}>Ya tengo cuenta</Text>
            </View>
        )
    }
}