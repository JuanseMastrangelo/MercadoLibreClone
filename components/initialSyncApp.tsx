import * as React from 'react';
import { Dimensions, View } from 'react-native';


const { width, height } = Dimensions.get('window');

import { HttpService } from '../constants/HttpService';

import * as firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { authKey } from '../constants/KeyConfig';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actionsCart } from '../utils/actions/cart';
import { actionCreators as actionsMessages } from '../utils/actions/messages';
import { actionCreators as actionsFavorites } from '../utils/actions/favorite';
import { actionShipping } from '../utils/actions/shipping';
import { Text, Toast } from 'native-base';
import { Button, Card, Input, Modal, Spinner } from '@ui-kitten/components';

class InitialSyncApp extends React.Component<any, any> {
    httpService: any = null;


    constructor(props: any) {
        super(props)
        this.state = {
            countMessagesNotSee: 0,
            syncCart: false,
            syncFavorites: false,
            syncLocation: false,
            modalVisible: false,
            inputCP: ''
        }
        this.httpService = new HttpService();
    }

    async componentDidMount() {
        const userData = await AsyncStorage.getItem(authKey);
        this.syncAppWithDatabase(userData);
    }

    syncAppWithDatabase(userData: any) {
        const userId = JSON.parse(userData!).token;
        const header = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ userId,
        });
        console.log(userId);

        this.setState({syncCart: false, syncLocation: false, syncFavorites: false});
        this.httpService.get('/cart', header).then((res:any) => res.json()).then((cartItems: any) => {
            this.props.setCartItemsForce(cartItems);
            this.setState({syncCart: true});
        }).catch((error: any) => {
            Toast.show({
                text: 'Error al cargar el carro',
                type: 'warning',
                position: 'top'
            })
        })

        this.httpService.get('/favorites', header).then((res:any) => res.json()).then((favoritesItems: any) => {
            this.props.setFavoriteForce(favoritesItems);
            this.setState({syncFavorites: true});
        }).catch((error: any) => {
            Toast.show({
                text: 'Error al cargar los favoritos',
                type: 'warning',
                position: 'top'
            })
        })

        this.httpService.get('/UserLocations', header).then((res:any) => res.json()).then((location: any) => {
            if (!location || (location.length === 0)) {
                this.setState({modalVisible: true})
            } else {
                this.props.setShippingForce(location);
                this.setState({syncLocation: true});
            }
        }).catch((error: any) => {
            Toast.show({
                text: 'Error al cargar la ubicacion',
                type: 'warning',
                position: 'top'
            })
        })

        this.getMessages();
    }

    getMessages = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        const user = JSON.parse(userData!);
        firebase.database().ref("chats").orderByChild('to').equalTo(user.id).on("value", async (snapshot: any) => {
            let countMessagesNotSee = 0;
            snapshot.forEach((snap: any) => {
                const message = snap.val();
                if (message.visto === false) {
                    countMessagesNotSee++;
                }
            });
            this.props.setMessagesNotReaded(countMessagesNotSee);
        });
    }


    saveLocation = () => {
        const { inputCP } = this.state;
        const defaultLocation = [{"correo":true,"selected":true},{"correo":false,"selected":false,"custom":{"shippingCP":+ inputCP}}];
        this.props.setShippingForce(defaultLocation);
        this.httpService.post('/UserLocations', {locations: defaultLocation}).then((res: any) => res.text()).then((data: any) => {
            this.setState({modalVisible: false, syncLocation: true});
        });
    }


    redirectTo = (name: string) => {
        this.props.navigation.navigate(name);
        this.props.navigation.reset({ index: 0, routes: [{ name: name }], });
    }

    render() {
        const { syncCart, syncFavorites, syncLocation, modalVisible, inputCP } = this.state;
        const syncronization = syncCart && syncFavorites && syncLocation;
        if (syncronization) {
            this.redirectTo('Root')
            Toast.show({
                text: 'Sincronizado exitosamente',
                position: 'top'
            })
        }
        
        return (
            <View style={{ width, height }}>
                <View style={{width, height, alignItems: 'center', justifyContent: 'center'}}>
                    <Spinner></Spinner>
                    <Text style={{color: 'black', marginTop: 10}}>Sincronizando...</Text>
                </View>
                <Modal
                    visible={modalVisible}
                    backdropStyle={{ backgroundColor: 'rgba(200,200,200,.8)', width }}
                    // onBackdropPress={() => this.setState({ modalVisible: false })}
                    >
                    <Card style={{ backgroundColor: 'white', width: '90%', alignSelf: 'center' }}>
                        
                        <Text>Ingrese el código postal de su ciudad:</Text>
                        <Input
                            style={{marginTop: 10}}
                            placeholder='Place your Text'
                            value={inputCP}
                            onChangeText={inputCP => {if (+inputCP >= 0) {console.log(typeof inputCP);this.setState({inputCP})}}}
                        />

                        <View style={{ marginTop: 20, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <Button onPress={() => this.saveLocation()} status="success" size='small' disabled={inputCP.trim().length < 4}>Guardar</Button>
                        </View>
                    </Card>
                </Modal>
            </View>
        )
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        setFavoriteForce: bindActionCreators(actionsFavorites.favoriteForce, dispatch),
        setShippingForce: bindActionCreators(actionShipping.setShipping, dispatch),
        setCartItemsForce: bindActionCreators(actionsCart.forceProduct, dispatch),
        setMessagesNotReaded: bindActionCreators(actionsMessages.notSeeMessages, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialSyncApp)