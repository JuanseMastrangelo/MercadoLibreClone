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


import { authKey, urlApi } from '../../constants/KeyConfig';
import AsyncStorage from '@react-native-community/async-storage';
let socket: any = null;

const Provincias = ['Buenos Aires', 'Neuquen', 'Rio Negro'];
const Localidades = ['Palermo', 'Neuquen', 'Cipolletti'];
class PurchaseComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            urlBuy: null,
            modalVisible: false,
            idBuy: null,
            userData: null,
            custom: 1,
            shippingCost: null,
            shippingCP: '8324',
            shippingNameComplete: 'Juanse Mastrangelo',
            shippingProvincia: new IndexPath(2),
            shippingLocalidad: new IndexPath(2),
            shippingCalle: 'Av. Alem',
            shippingPiso: '2 A',
            shippingNumero: '1323',
            shippingReferencias: 'Departamento',
            shippingEntreCalles: 'Tucuman',
            shippingContacto: '2994054471'
        }
        this.getUserData();
        this.calcEnvio();
    }



    getUserData = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        this.setState({userData: JSON.parse(userData!)})

        
        const locations = this.props.state.shipping.locations;
        const locationSelected = locations.filter((el: any) => el.selected)[0].correo;
        const isCorreo = locationSelected ? 0 : 1;
        this.setState({custom: isCorreo});
    }


    pay = () => {
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
              body: JSON.stringify([items, userData, shippingCost.options[custom].cost])
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
    }

    clearCart = () => { this.props.cleanCart(); }


    calcEnvio = () => {
        fetch('https://api.mercadolibre.com/sites/MLA/shipping_options?zip_code_from=7607&zip_code_to=7607&dimensions=10x10x20,700', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then((response) => {
            this.setState({shippingCost: response});
        })
        .catch((error) => {
            Toast.show({
                text: 'Error. Compruebe su conexión a internet.',
                type: 'danger',
                position: 'top'
            })
        });
    }

    saveLocation = () => {
        const {custom} = this.state;
        if (custom !== 0 && this.validatePersonalizado()) {
            return false;
        }
        this.popupController();
        this.props.selectShippingType(custom);
    }

    validatePersonalizado = () => {
        const { shippingCP, shippingNameComplete, shippingProvincia, shippingLocalidad,
            shippingCalle, shippingPiso, shippingNumero, shippingReferencias, shippingEntreCalles, shippingContacto } = this.state;
        let error = true;
        if(shippingCP.trim() === ''){
            this.showToastError('El codigo postal es requerido');
        } else if(shippingNameComplete.trim() === ''){
            this.showToastError('El nombre completo es requerido');
        } else if(shippingCalle.trim() === ''){
            this.showToastError('La calle es requerida');
        } else if(shippingPiso.trim() === ''){
            this.showToastError('El numero es requerido');
        } else if(shippingNumero.trim() === ''){
            this.showToastError('El piso/departamento es requerido');
        } else if(shippingContacto.trim() === ''){
            this.showToastError('El telefono de contacto es requerido');
        } else {
            error = false;
        }
        return error;
    }

    showToastError(msg: string) {
        Toast.show({
            text: msg,
            type: 'danger',
            position: 'bottom'
        })
    }

    envioPopupContent = () => {
        const { custom, shippingCP, shippingNameComplete, shippingCalle, shippingProvincia, shippingLocalidad, shippingPiso,
            shippingNumero, shippingReferencias, shippingEntreCalles, shippingContacto } = this.state;
        return (
                <View style={{ height, width, top: 0, left: 0, alignItems: 'center', backgroundColor: 'white' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15, backgroundColor: Colors.default.yellow, width }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Poppins-Regular', fontSize: 17 }}>
                                Cambiar destino de envío
                            </Text>
                            <View style={{position: 'absolute', left: 20, top: 40}}>
                                <TouchableOpacity onPress={() => this.popupController()}>
                                    <FontAwesome name="arrow-left" color="white" style={{fontSize: 20}}></FontAwesome>
                                </TouchableOpacity>
                            </View>
                            <View style={{position: 'absolute', right: 20, top: 40}}>
                                <TouchableOpacity onPress={() => this.saveLocation()}>
                                    <FontAwesome name="check" color="white" style={{fontSize: 20}}></FontAwesome>
                                </TouchableOpacity>
                            </View>
                    </View>
                    <ScrollView style={{marginBottom: 50}}>
                        <RadioGroup
                            style={{flexDirection: 'row', marginTop: 20}}
                            selectedIndex={custom}
                            onChange={index  => this.setState({custom: index })}>
                            <Radio style={{width: '50%'}} status='primary'>Correo Argentino</Radio>
                            <Radio status='primary'>Personalizado</Radio>
                        </RadioGroup>
                        <View style={{width: width*0.9, marginTop: 20, flexDirection: 'row'}}>
                            <View style={{width: '50%', marginVertical: 10, paddingHorizontal: 10}}>              
                                <Input
                                    disabled={custom === 0}
                                    value={shippingCP}
                                    label='Código Postal:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingCP: nextValue})}
                                />
                            </View>
                            <View style={{width: '50%', marginVertical: 10, paddingHorizontal: 10}}>              
                                <Input
                                    disabled={true}
                                    value={shippingNameComplete}
                                    label='Nombre Completo:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingNameComplete: nextValue})}
                                />
                            </View>
                        </View>

                        <View style={{width: width*0.9, marginVertical: 10, paddingHorizontal: 10}}>              
                            <Select
                                disabled={custom === 0}
                                label='Provincia:'
                                value={Provincias[shippingProvincia.row]}
                                selectedIndex={shippingProvincia}
                                onSelect={index => this.setState({shippingProvincia: index})}>
                                    {
                                        Provincias.map(item => (
                                            <SelectItem title={item} />
                                        ))
                                    }
                            </Select>
                        </View>

                        <View style={{width: width*0.9, marginVertical: 10, paddingHorizontal: 10}}>              
                            <Select
                                disabled={custom === 0}
                                label='Localidad / Barrio:'
                                value={Localidades[shippingLocalidad.row]}
                                selectedIndex={shippingLocalidad}
                                onSelect={index => this.setState({shippingLocalidad: index})}>
                                {
                                    Localidades.map(item => (
                                        <SelectItem title={item} />
                                    ))
                                }
                            </Select>
                        </View>

                        <View style={{width: width*0.9, marginVertical: 10, paddingHorizontal: 10}}>              
                                <Input
                                    disabled={custom === 0}
                                    value={shippingCalle}
                                    label='Calle:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingCalle: nextValue})}
                                />
                        </View>
                        
                        <View style={{width: width*0.9, marginTop: 10, flexDirection: 'row'}}>
                            <View style={{width: '50%', paddingHorizontal: 10}}>              
                                <Input
                                    disabled={custom === 0}
                                    value={shippingNumero}
                                    label='Número:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingNumero: nextValue})}
                                />
                            </View>
                            <View style={{width: '50%', paddingHorizontal: 10}}>              
                                <Input
                                    disabled={true}
                                    value={shippingPiso}
                                    label='Piso / Departamento:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingPiso: nextValue})}
                                />
                            </View>
                        </View>

                        <View style={{width: width*0.9, marginVertical: 10, paddingHorizontal: 10}}>              
                                <Input
                                    disabled={custom === 0}
                                    value={shippingEntreCalles}
                                    label='Entre calles:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingEntreCalles: nextValue})}
                                />
                        </View>

                        <View style={{width: width*0.9, marginVertical: 10, paddingHorizontal: 10}}>              
                                <Input
                                    disabled={custom === 0}
                                    value={shippingReferencias}
                                    label='Referencias:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingReferencias: nextValue})}
                                />
                        </View>

                        <View style={{width: width*0.9, marginVertical: 10, paddingHorizontal: 10}}>              
                                <Input
                                    disabled={custom === 0}
                                    value={shippingContacto}
                                    label='Teléfono de contacto:'
                                    placeholder=''
                                    onChangeText={nextValue => this.setState({shippingContacto: nextValue})}
                                />
                        </View>
                    </ScrollView>
                </View>
        )
    }

    render() {
        const { urlBuy, modalVisible, cargando, showPopup, shippingCost, custom } = this.state;
        const { products } = this.props;
        const { locations } = this.props.state.shipping;
        const locationSelected = locations.filter((el: any) => el.selected)[0];

        let totalValorProducts = 0;
        products.map((el: any, index: number) => (totalValorProducts = totalValorProducts + parseFloat(el.saleValue)) )
        return (
            <View style={{position: 'absolute', bottom: 0, left: 0, width}}>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Button size='tiny' status="basic" onPress={() => this.popupController() }>
                                {
                                    locationSelected.correo ?
                                    'Correo Argentino'
                                    :
                                    'Del Trabajador 2122'
                                }
                            </Button>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: '#000' }}>$ {shippingCost && shippingCost.options[custom].cost}</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold', color: '#000' }}>Descuento</Text>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: 'red' }}>- $ 0</Text>
                        </View> */}

                        <Divider style={{ backgroundColor: 'rgba(100,100,100,.3)' }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, fontWeight: 'bold', color: '#4C6ED2' }}>SubTotal</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Colors.default.green }}>$ {shippingCost && (shippingCost.options[custom].cost + totalValorProducts).toFixed(2)}</Text>
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
                    animationType="slide"
                    presentationStyle='overFullScreen'
                >
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width, paddingHorizontal: 10}}>
                        <TouchableOpacity style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end',
                        backgroundColor: 'red', borderRadius: 10, width: 100, marginTop: 20, paddingVertical: 7, alignItems: 'center'}}
                            onPress={() => this.setState({ modalVisible: false })}>
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
                {
                    showPopup &&
                    this.envioPopupContent()
                }
            </View>
        )
    }
}




function mapDispatchToProps(dispatch: any) {
    return {
        selectShippingType: bindActionCreators(actionShipping.select, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(PurchaseComponent)