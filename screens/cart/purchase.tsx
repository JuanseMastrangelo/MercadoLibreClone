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
            custom: null,
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
            shippingContacto: '2994054471',
            loading: false,
            showPopup: false
        }
        this.getUserData();
        this.httpService = new HttpService();
    }



    getUserData = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        this.setState({userData: JSON.parse(userData!)});
        this.getDataOfShipping();
    }

    getDataOfShipping = async () => {
        const { userData } = this.state;
        const header = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ userData.token,
        });
        this.httpService.get('/UserLocations', header).then((res: any) => res.json()).then((data: any) => {
            this.setState({loading: false});
            const locations = JSON.parse(data[0].locations);
            this.props.setShipping(locations);
            const locationSelected = locations.filter((el: any) => el.selected)[0].correo;
            
            const isCorreo = locationSelected ? 0 : 1;
            const { shippingCP, shippingNameComplete, shippingLocalidad, shippingReferencias, shippingEntreCalles,
                shippingCalle, shippingPiso, shippingNumero, shippingContacto, shippingProvincia } = locations[1].custom;
            this.setState(
                {
                    custom: isCorreo,
                    shippingCP, shippingNameComplete, shippingCalle, shippingPiso, shippingNumero,
                    shippingContacto, shippingReferencias, shippingEntreCalles,
                    shippingProvincia: new IndexPath(shippingProvincia.row),
                    shippingLocalidad: new IndexPath(shippingLocalidad.row)
                }
            );
            this.calcEnvio();
        });
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

        const cp = locations.filter((el: any) => (el.correo === false))[0].custom.shippingCP;
        const locationSelected = locations.filter((el: any) => (el.selected === true))[0];
        let additional_info;
        if (locationSelected.correo) {
            additional_info = Object.assign(userData, {
                correo: true,
                shippingCP: cp
            });
        } else {
            additional_info = Object.assign(userData, locationSelected);
        }
        additional_info = userData;

        console.log(JSON.stringify([items, userData, shippingCost.options[custom].cost]));
        fetch(urlApi + '/createPreference', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
              body: JSON.stringify([items, shippingCost.options[custom].cost])
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

    getProductsInCart = () => {
        this.setState({ cargando: true });
        this.httpService.get('/cart').then((res:any) => res.json()).then((cartItems: any) => {
            this.setState({ cargando: false });
            this.props.setCartItemsForce(cartItems);
        })
    }

    popupController = () => {
        const { showPopup } = this.state;
        if (!showPopup) { this.getDataOfShipping(); }
        this.setState({ showPopup: !showPopup })
    }

    clearCart = () => { this.props.cleanCart(); }

    calcEnvio = () => {
        this.setState({shippingCost: null});
        
        const { locations } = this.props.state.shipping;
        const locationSelected = locations.filter((el: any) => (el.correo === false))[0];
        const cp = locationSelected.custom.shippingCP;
        
        fetch('https://api.mercadolibre.com/sites/MLA/shipping_options?zip_code_from=' + cp + '&zip_code_to=7607&dimensions=10x10x20,700', {
            method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }).then(response => response.json())
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

    validatePersonalizado = () => {
        const { shippingCP, shippingNameComplete,
            shippingCalle, shippingPiso, shippingNumero, shippingContacto } = this.state;
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


    saveLocation = () => {
        const { shippingCP, shippingNameComplete, shippingProvincia, shippingLocalidad,
            shippingCalle, shippingPiso, shippingNumero, shippingContacto, shippingReferencias,
            shippingEntreCalles, custom } = this.state;


        if (custom !== 0 && this.validatePersonalizado()) {
            return false;
        } else { // Solo validamos el codigo postal para el correo argentino
            if(shippingCP.trim() === ''){
                this.showToastError('El codigo postal es requerido');
                return false;
            } 
        }

        this.setState({loading: true});

        const { locations } = this.props.state.shipping;
        const locationSelected = locations.filter((el: any) => (el.correo === false))[0];

        if (custom === 0) {
            locationSelected.custom.shippingCP = shippingCP
        }

        const personalizado = custom === 0 ? locationSelected.custom : {
            shippingCP, shippingNameComplete, shippingProvincia, shippingLocalidad, shippingCalle, shippingPiso, shippingNumero,
            shippingContacto, shippingReferencias, shippingEntreCalles,
            Localidad: Localidades[shippingProvincia.row],
            Provincia: Provincias[shippingProvincia.row]
        }
        const body = [
            {
                correo: true,
                selected: custom === 0
            },
            {
                correo: false,
                selected: custom !== 0,
                custom: personalizado
            }
        ]


        this.httpService.post('/UserLocations', {locations: body}).then((res: any) => res.text()).then((data: any) => {
            this.popupController();
            this.props.setShipping(body);
            this.setState({loading: false});
            this.calcEnvio();
        });
    }

    

    closeBuyModal = () => {
        this.setState({ modalVisible: false });
        this.getProductsInCart();
    }




    envioPopupContent = () => {
        const { custom, shippingCP, shippingNameComplete, shippingCalle, shippingProvincia, shippingLocalidad, shippingPiso,
            shippingNumero, shippingReferencias, shippingEntreCalles, shippingContacto, loading } = this.state;
        return (
                <View style={{ height, width, top: 0, left: 0, alignItems: 'center', backgroundColor: 'white' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15, backgroundColor: Colors.default.yellow, width }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Poppins-Regular', fontSize: 17 }}>
                                Destino de envío
                            </Text>
                            <View style={{position: 'absolute', left: 0, top: 25}}>
                                <TouchableOpacity style={{paddingVertical: 15, paddingHorizontal: 20}} onPress={() => this.popupController()}>
                                    <FontAwesome name="arrow-left" color="white" style={{fontSize: 20}}></FontAwesome>
                                </TouchableOpacity>
                            </View>
                            <View style={{position: 'absolute', right: 0, top: 25}}>
                                <TouchableOpacity style={{paddingVertical: 15, paddingHorizontal: 20}} onPress={() => this.saveLocation()}>
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
                    {
                        loading &&
                        <View style={{position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(200,200,200,.5)',
                        justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                            <Spinner color="black" size={20}></Spinner>
                        </View>
                    }
                </View>
        )
    }

    render() {
        const { urlBuy, modalVisible, cargando, showPopup, shippingCost, custom } = this.state;
        const { products } = this.props;
        const { locations } = this.props.state.shipping;
        const locationSelected = locations.filter((el: any) => (el.selected === true))[0];

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
                                    custom === 0 ?
                                    'Correo Argentino'
                                    :
                                    (locationSelected.custom) &&
                                    locationSelected.custom.shippingCalle + ' ' + locationSelected.custom.shippingNumero
                                }
                            </Button>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: '#000' }}>
                            {
                                shippingCost ?
                                    shippingCost.error === "invalid_zip_code" ?
                                    'Codigo postal inválido' :
                                    (custom === 0 || custom === 1) && '$ ' +(shippingCost.options[custom].cost) 
                                :
                                'Cargando'
                            }
                            </Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: 'bold', color: '#000' }}>Descuento</Text>
                            <Text style={{ fontFamily: 'Poppins-Light', fontSize: 12, color: 'red' }}>- $ 0</Text>
                        </View> */}

                        {
                            shippingCost && !shippingCost.error && (custom === 0 || custom === 1)  &&
                            <View>
                                <Divider style={{ backgroundColor: 'rgba(100,100,100,.3)' }} />
        
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, fontWeight: 'bold', color: '#4C6ED2' }}>SubTotal</Text>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 17, color: Colors.default.green }}>
                                        {'$ ' +(shippingCost.options[custom].cost + totalValorProducts).toFixed(2)}</Text>
                                </View>
                                {
                                    cargando ? 
                                        <Spinner size="small" color="#000"></Spinner>
                                    :
                                    <TouchableOpacity style={{ width: '80%', borderWidth:1, borderColor: 'rgba(200,200,200,.4)', backgroundColor: Colors.default.green, alignSelf: 'center',paddingVertical: 5, borderRadius: 5 }}
                                    onPress={() => this.pay()}>
                                        <Text style={{textAlign:'center', color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>Pagar</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        }

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
        setShipping: bindActionCreators(actionShipping.setShipping, dispatch),
        selectShippingType: bindActionCreators(actionShipping.select, dispatch),
        setCartItemsForce: bindActionCreators(actionsCart.forceProduct, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(PurchaseComponent)