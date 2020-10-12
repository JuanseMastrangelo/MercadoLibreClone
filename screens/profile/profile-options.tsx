import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { Card, Button, Modal } from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { authKey } from '../../constants/KeyConfig';

const { width } = Dimensions.get('window');


export default class ProfileOptions extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            modalVisible: false
        }
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', { screen: 'Buscar' }));
    }


    logout = () => {
        AsyncStorage.removeItem(authKey);
        this.redirectTo('LoginScreen');
    }

    redirectTo = (name: string) => {
        this.props.navigation.navigate(name);
        this.props.navigation.reset({ index: 0, routes: [{ name: name }], });
    }

    render() {
        const { modalVisible } = this.state;
        return (
            <View style={{ marginBottom: 100, marginTop: 20 }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#CCC', marginBottom: 10 }}>Opciones</Text>
                <View style={{ paddingVertical: 10 }}>

                    <TouchableOpacity style={{ width, paddingVertical: 5 }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#111', marginBottom: 5 }}>Términos y Condiciones</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width, paddingVertical: 5 }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#111', marginBottom: 5 }}>Contactarnos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width, paddingVertical: 5 }} onPress={() => this.setState({ modalVisible: true })}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: 'red' }}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>

                <View style={{height: 100}}>
                <Modal
                    visible={modalVisible}
                    backdropStyle={{backgroundColor: 'rgba(200,200,200,.8)'}}
                    onBackdropPress={() => this.setState({ modalVisible: false })}>
                    <Card style={{backgroundColor: 'white'}}>
                        <Text>Desea cerrar sesión?</Text>
                        <Button onPress={() => this.logout()} style={{width: '100%', marginTop: 20}} size='small'>Si</Button>
                    </Card>
                </Modal>
                </View>
            </View>
        )
    }
}
