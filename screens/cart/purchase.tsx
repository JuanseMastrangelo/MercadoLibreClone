import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { Dimensions, Text, View, Modal } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
import WebView from 'react-native-webview';

import { Spinner, Toast } from 'native-base';


import { Button, Divider, IndexPath, Input, Radio, RadioGroup, Select, SelectItem } from '@ui-kitten/components';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionShipping } from '../../utils/actions/shipping';
import { actionCreators as actionsCart } from '../../utils/actions/cart';

import Location from './location';

import { authKey, urlApi } from '../../constants/KeyConfig';
import AsyncStorage from '@react-native-community/async-storage';
let socket: any = null;

const Provincias = ['Buenos Aires', 'Neuquen', 'Rio Negro'];
const Localidades = ['Palermo', 'Neuquen', 'Cipolletti'];


import { HttpService } from '../../constants/HttpService';
class PurchaseComponent extends React.Component<any, any> {
    httpService: any = null;

    constructor(props: any) {
        super(props)
        this.state = {
            urlBuy: null,
            modalVisible: false,
            idBuy: null,
            userData: null,
            loading: false,
            showPopup: false,
            locationSelected: null,
            shippingCost: 600
        }
        this.httpService = new HttpService();


    }

    componentDidMount() {
        const { shipping } = this.props.state
        const locations = shipping.locations[0].locations;
        const jsonLocations = JSON.parse(locations);
        const locationSelected = jsonLocations.filter((el: any) => (el.selected))[0];
        console.log(locationSelected);
        this.setState({ locationSelected });


        this.getUserData();
    }


    getUserData = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        this.setState({ userData: JSON.parse(userData!) });
        // this.calcEnvio();
    }


    pay = () => {
        const { locations } = this.props.state.shipping;
        this.setState({ cargando: true });
        const { userData, shippingCost, custom } = this.state;
        const { products } = this.props;
        const items: any = [];
        products.map((product: any) => {
            items.push(
                {
                    id: product.id,
                    title: product.title,
                    quantity: 1,
                    currency_id: 'ARS',
                    unit_price: +product.saleValue,
                    image: JSON.parse(product.files)[0].path
                }
            )
        });

        fetch(urlApi + '/createPreference', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            //   body: JSON.stringify([items, userData, shippingCost.options[custom].cost])
              body: JSON.stringify([items, userData, shippingCost])
        })
            .then(response => response.json())
            .then((response) => {
                if (response) {
                    // const urlBuy = response.response.sandbox_init_point;
                    const urlBuy = response.response.init_point;
                    this.setState({ urlBuy, cargando: false, modalVisible: true })
                }
            })
            .catch((error) => {
                Toast.show({
                    text: 'Error. Compruebe su conexión a internet.',
                    type: 'danger',
                    position: 'top'
                })
                console.log(error);
                this.setState({ urlBuy: null, cargando: false, modalVisible: false, idBuy: null })
            });
    }

    closeModal = () => {
        this.setState({ modalVisible: false });
        socket.close();
    }


    popupController = () => {
        const { showPopup } = this.state;
        this.setState({ showPopup: !showPopup })
        if (showPopup) {
            this.props.navigation.setOptions({ title: 'Envío' });
        }
    }

    clearCart = () => { this.props.cleanCart(); }

    calcEnvio = () => {
        const { locationSelected } = this.state;
        this.setState({ shippingCost: null });

        fetch('https://api.mercadolibre.com/sites/MLA/shipping_options?zip_code_from=' + 7607 + '&zip_code_to=7607&dimensions=10x10x20,700', {
            method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }).then(response => response.json())
            .then((response) => {
                console.log(response);
                this.setState({ shippingCost: response });
            })
            .catch((error) => {
                Toast.show({
                    text: 'Error. Compruebe su conexión a internet.',
                    type: 'danger',
                    position: 'top'
                })
            });
    }

    closeBuyModal = () => {
        this.setState({ modalVisible: false });
    }






    render() {
        const { urlBuy, modalVisible, cargando, showPopup, shippingCost, custom, locationSelected } = this.state;
        const { products } = this.props;

        let totalValorProducts = 0;
        products.map((el: any, index: number) => (totalValorProducts = totalValorProducts + parseFloat(el.saleValue)))
        return (
            <View style={{ position: 'absolute', bottom: 53, left: 0, width }}>
                {
                    (products.length > 0) &&
                    <View style={{
                        paddingHorizontal: 20, backgroundColor: 'white', borderTopEndRadius: 10, borderTopStartRadius: 10, paddingVertical: 10, width: '100%', alignSelf: 'center',
                        borderWidth: 1, borderColor: 'rgba(200,200,200,.5)', position: 'absolute', bottom: 60
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold', color: '#000' }}>Total de compra</Text>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: '#000' }}>$ {totalValorProducts}</Text>
                        </View>
                        {
                            locationSelected &&
                            (<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                                <Button size='tiny' status="basic" onPress={() => this.popupController()}>
                                    {
                                        locationSelected.correo ?
                                            'Correo Argentino'
                                            :
                                            (locationSelected.custom) &&
                                            locationSelected.custom.shippingCalle + ' ' + locationSelected.custom.shippingNumero
                                    }
                                </Button>
                                <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: '#000' }}>
                                    {/* {
                                        shippingCost ?
                                            shippingCost.error === "invalid_zip_code" ?
                                                'Codigo postal inválido' :
                                                (custom === 0 || custom === 1) && '$ ' + (shippingCost.options[custom].cost)
                                            :
                                            'Cargando'
                                    } */}
                                    {'$ ' + shippingCost}
                                </Text>
                            </View>)
                        }
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold', color: '#000' }}>Descuento</Text>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: 'red' }}>- $ 0</Text>
                        </View> */}

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, fontWeight: 'bold' }}>SubTotal</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Colors.default.green }}>
                                {'$ ' + (shippingCost + totalValorProducts).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={{ width: '80%', borderWidth: 1, borderColor: 'rgba(200,200,200,.4)', backgroundColor: Colors.default.green, alignSelf: 'center', paddingVertical: 5, borderRadius: 5 }}
                            onPress={() => this.pay()}>
                            <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Pagar</Text>
                        </TouchableOpacity>
                        {/* {
                            shippingCost && !shippingCost.error && (custom === 0 || custom === 1) &&
                            <View>
                                <Divider style={{ backgroundColor: 'rgba(100,100,100,.3)' }} />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, fontWeight: 'bold', color: '#4C6ED2' }}>SubTotal</Text>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Colors.default.primaryColor }}>
                                        {'$ ' + (shippingCost.options[custom].cost + totalValorProducts).toFixed(2)}</Text>
                                </View>
                                {
                                    cargando ?
                                        <Spinner size="small" color="#000"></Spinner>
                                        :
                                        <TouchableOpacity style={{ width: '80%', borderWidth: 1, borderColor: 'rgba(200,200,200,.4)', backgroundColor: Colors.default.primaryColor, alignSelf: 'center', paddingVertical: 5, borderRadius: 5 }}
                                            onPress={() => this.pay()}>
                                            <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Pagar</Text>
                                        </TouchableOpacity>
                                }
                            </View>
                        } */}

                    </View>
                }

                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                    presentationStyle='overFullScreen'
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width, paddingHorizontal: 10 }}>
                        <TouchableOpacity style={{
                            paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end',
                            backgroundColor: 'red', borderRadius: 10, width: 100, marginTop: 20, paddingVertical: 7, alignItems: 'center'
                        }}
                            onPress={() => this.closeBuyModal()}>
                            <Text style={{ color: 'white' }}>Cerrar</Text>
                            <FontAwesome style={{ color: 'white', fontSize: 10, marginLeft: 9 }} name="close"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                    <WebView source={{ uri: urlBuy }} style={{ marginTop: 5, width, height }} />
                </Modal>

                {
                    cargando &&
                    <View style={{ position: 'absolute', height, width, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(200,200,200,.4)' }}>
                        <Spinner color="#000"></Spinner>
                        <Text>Cargando, espere por favor...</Text>
                    </View>
                }

                <Modal
                    transparent={true}
                    visible={showPopup}
                    animationType="slide"
                    presentationStyle='formSheet'
                >
                    <Location close={() => this.setState({ showPopup: false })}></Location>
                </Modal>
            </View>
        )
    }
}




function mapDispatchToProps(dispatch: any) {
    return {
        setShipping: bindActionCreators(actionShipping.setShipping, dispatch),
        selectShippingType: bindActionCreators(actionShipping.select, dispatch),
        setCartItemsForce: bindActionCreators(actionsCart.forceProduct, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(PurchaseComponent)