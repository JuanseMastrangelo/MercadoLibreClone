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
            <View style={{ marginBottom: 20, marginTop: 20 }}>
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
                        backdropStyle={{ backgroundColor: 'rgba(200,200,200,.8)', width }}
                        onBackdropPress={() => this.setState({ modalVisible: false })}>
                        <Card style={{ backgroundColor: 'white', width: '90%', alignSelf: 'center' }}>
                            <Text>Esta seguro que desea cerrar sesión?</Text>
                            <View style={{ marginTop: 20, justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <Button onPress={() => this.logout()} status="success" style={{ marginRight: 20 }} size='small'>Si</Button>
                                <Button onPress={() => this.setState({ modalVisible: false })} status="control" size='small'>No</Button>
                            </View>
                        </Card>
                    </Modal>
                </View>
            </View>
        )
    }
}
