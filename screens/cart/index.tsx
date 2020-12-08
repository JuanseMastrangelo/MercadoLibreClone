import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Image, Text, View, Modal } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
import WebView from 'react-native-webview';

import { Spinner, Toast } from 'native-base';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actions } from '../../utils/actions/cart';
import { VerticalGridViewComponent } from '../../components/FlatLists/verticalGridView';
import { Button, Divider } from '@ui-kitten/components';


import io from 'socket.io-client';
let socket: any = null;
export class Cart extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            urlBuy: null,
            modalVisible: false,
            idBuy: null,
            serverRes: null
        }
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', { screen: 'Buscar' }));
    }


    emptyCartRender = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
                    <View style={{ width: 100, height: 100, borderRadius: 1000, backgroundColor: 'rgba(200,200,200,.4)', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: 'https://i.pinimg.com/originals/09/88/dc/0988dc27ab24d196b91d085c786c292d.png' }}
                            fadeDuration={0}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                    <Text style={{ fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 30, textAlign: 'center' }}>Carro de compras vacio</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10 }}>
                        Agrega productos al carro de compras para que aparezcan en esta area
                    </Text>

                    <TouchableOpacity style={{ marginTop: 60, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => this.goToShopping()}>
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', fontWeight: 'bold' }}>Comprar ahora!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    pay = () => {
        this.setState({ cargando: true });
        fetch('http://192.168.1.23:3000/createPayment', {
            method: 'GET'
        })
            .then(response => response.json())
            .then((response) => {
                socket = io.connect('http://192.168.1.23:3000', {
                    transports: ['websocket'],
                    query: 'idBuy=' + response.body.id // Enviamos para que responda solo con este id
                });
                socket.on('paymentState', (res: any) => {
                    this.setState({ modalVisible: false, urlBuy: null, idBuy: null, serverRes: res, showPopup: true });
                    socket.close();
                });
                this.setState({ urlBuy: response.body.init_point, cargando: false, modalVisible: true, idBuy: response.body.items[0].id })
            })
            .catch((error) => {
                Toast.show({
                    text: 'Error. Compruebe su conexión a internet.',
                    type: 'danger',
                    position: 'bottom'
                })
                this.setState({ urlBuy: null, cargando: false, modalVisible: true, idBuy: null })
            });
    }


    closeModal = () => {
        this.setState({ modalVisible: false });
        socket.close();
    }

    popupController = () => {
        const { showPopup } = this.state;
        this.setState({ showPopup: !showPopup, serverRes: null })
    }

    render() {
        const { urlBuy, modalVisible, cargando, showPopup, serverRes } = this.state;
        const popupstatus = serverRes && serverRes.status;
        const backgroundPopup = (popupstatus === 'success') ? 'rgba(0,224,150,1)' : (popupstatus === 'failure') ? 'rgba(255,61,113,1)' : 'rgba(255,170,0,1)';
        const { products } = this.props.state;
        const { removeToCart } = this.props;

        let totalValorProducts = 0;
        products.map((el: any) => (totalValorProducts = totalValorProducts + parseFloat(el.saleValue)) )
        return (
            <View style={{ height }}>
                <View
                    style={{
                        transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 200, height: 100, position: 'absolute',
                        top: -40, right: -70
                    }}></View>
                <View style={{
                    transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 130, height: 230, position: 'absolute',
                    top: 340, right: -30, borderRadius: 100
                }}></View>
                <View
                    style={{
                        transform: [{ rotate: '-40deg' }], backgroundColor: '#F1F7FC', width: 200, height: 100, position: 'absolute',
                        bottom: -20, left: -70
                    }}></View>

                <View style={{ marginTop: 40 }}>
                    <Text style={{ color: 'black', fontSize: 30, fontFamily: 'Poppins-SemiBold', width: '90%', alignSelf: 'center' }}>Carro</Text>
                    {
                        (products.length === 0) ?
                            this.emptyCartRender()
                            :
                            <ScrollView showsVerticalScrollIndicator={true} style={{ height: 'auto' }}>
                                <VerticalGridViewComponent removeToCart={removeToCart} navigation={this.props.navigation} data={products} ></VerticalGridViewComponent>
                            </ScrollView>
                    }

                </View>
                {
                    (products.length > 0) &&
                    <View style={{
                        paddingHorizontal: 20, backgroundColor: 'white', borderTopEndRadius: 10, borderTopStartRadius: 10, paddingVertical: 10, width: '100%', alignSelf: 'center',
                        borderWidth: 1, borderColor: 'rgba(200,200,200,.5)', position: 'absolute', bottom: 60
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold', color: '#000' }}>Total a compra</Text>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: '#000' }}>$ {totalValorProducts}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold', color: '#000' }}>Envio (Rio Negro)</Text>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: '#000' }}>$ 400</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold', color: '#000' }}>Descuento</Text>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: 'red' }}>- $ 0</Text>
                        </View> */}

                        <Divider style={{ backgroundColor: 'rgba(100,100,100,.3)' }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, fontWeight: 'bold', color: '#4C6ED2' }}>SubTotal</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 23 }}>$ {totalValorProducts}</Text>
                        </View>

                        <TouchableOpacity style={{ width: '80%', borderWidth:1, borderColor: 'rgba(200,200,200,.4)', backgroundColor: Colors.default.green, alignSelf: 'center',paddingVertical: 5, borderRadius: 5 }}
                        onPress={() => this.pay()}>
                            <Text style={{textAlign:'center', color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Pagar</Text>
                        </TouchableOpacity>

                    </View>
                }

                <Modal
                    transparent={true}
                    visible={modalVisible}
                    presentationStyle='pageSheet'
                    collapsable={true}
                >
                    {/* <TouchableOpacity style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}
                        onPress={() => this.setState({ modalVisible: false })}>
                        <Text style={{ color: 'white' }}>Cerrar</Text>
                        <FontAwesome style={{ color: 'white', fontSize: 20, marginLeft: 5 }} name="close"></FontAwesome>
                    </TouchableOpacity> */}
                    <WebView source={{ uri: urlBuy }} style={{ marginTop: 20, width, height }} />
                </Modal>

                {
                    cargando &&
                    <View style={{ position: 'absolute', height, width, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(200,200,200,.4)' }}>
                        <Spinner color="#000"></Spinner>
                        <Text>Cargando, espere por favor...</Text>
                    </View>
                }
                {
                    showPopup && serverRes &&
                    <View style={{ height, width, backgroundColor: backgroundPopup, position: 'absolute', top: 0, left: 0, alignItems: 'center' }}>
                        <View style={{ height: height * 0.5, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                            <View style={{ borderWidth: 2, width: 100, height: 100, marginBottom: 20, borderRadius: 10000, borderColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome style={{ color: 'white', fontSize: 40 }} name={
                                    (serverRes.status === 'success') ? 'check' : (serverRes.status === 'failure') ? 'close' : 'exclamation'
                                }></FontAwesome>
                            </View>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Poppins-Regular', fontSize: 17, textAlign: 'center' }}>
                                {
                                    (serverRes.status === 'success') ?
                                        'Compra realizada correctamente!'
                                        :
                                        (serverRes.status === 'failure') ?
                                            'Tu compra no pudo realizarse'
                                            :
                                            'Tu compra esta pendiente de pago. Paga tu factura para obtener tu producto.'
                                }
                            </Text>
                        </View>
                        <Button status="basic" size="small" onPress={() => this.popupController()}>Cerrar</Button>
                    </View>
                }
            </View>
        )
    }
}



function mapDispatchToProps(dispatch: any) {
    return {
        removeToCart: bindActionCreators(actions.removeProduct, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(Cart)