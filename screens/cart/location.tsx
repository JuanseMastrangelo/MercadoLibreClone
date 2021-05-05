import * as React from 'react';
import { Dimensions, View } from 'react-native';


const { width, height } = Dimensions.get('window');

import { HttpService } from '../../constants/HttpService';

import * as firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { authKey } from '../../constants/KeyConfig';

// Redux
import { connect } from 'react-redux';
import { Text, Toast } from 'native-base';
import { Button, Card, IndexPath, Input, Modal, Radio, RadioGroup, Select, Spinner } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';

class Location extends React.Component<any, any> {
    httpService: any = null;


    constructor(props: any) {
        super(props)
        this.state = {
            modalVisible: false,
            custom: null,
            shippingCost: null,
            shippingCP: '',
            shippingNameComplete: '',
            shippingProvincia: new IndexPath(2),
            shippingLocalidad: new IndexPath(2),
            shippingCalle: '',
            shippingPiso: '',
            shippingNumero: '',
            shippingReferencias: '',
            shippingEntreCalles: '',
            shippingContacto: '',
            showError: null
        }
        this.httpService = new HttpService();
    }

    componentDidMount() {
        const { shipping } = this.props.state
        const locations = shipping.locations[0].locations;
        const jsonLocations = JSON.parse(locations);
        const locationSelected = jsonLocations.filter((el: any) => (el.selected))[0];
        const locationNoCorreo = jsonLocations.filter((el: any) => (!el.correo))[0].custom;
        
        this.setState(
            {
                custom: locationSelected.correo ? 0 : 1,
                shippingCP: ''+locationNoCorreo.shippingCP,
            })
        
    }

    saveLocation = () => {
        const { inputCP } = this.state;
        const defaultLocation = [{ "correo": true, "selected": true }, { "correo": false, "selected": false, "custom": { "shippingCP": + inputCP } }];
        this.props.setShippingForce(defaultLocation);
        this.httpService.post('/UserLocations', { locations: defaultLocation }).then((res: any) => res.text()).then((data: any) => {
            this.setState({ modalVisible: false, syncLocation: true });
        });
    }

    validatePersonalizado = (custom: number) => {
        const { shippingCP, shippingNameComplete,
            shippingCalle, shippingPiso, shippingNumero, shippingContacto } = this.state;
        let showError = false;
        if (shippingCP.trim() === '') {
            this.showToastError('El codigo postal es requerido');
        } else {
            showError = true;
        }

        if (custom === 1) {
            showError = true;
            if (shippingNameComplete.trim() === '') {
                console.log('El nombre completo es requerido');
                this.showToastError('El nombre completo es requerido');
            } else if (shippingCalle.trim() === '') {
                console.log('La calle es requerida');
                this.showToastError('La calle es requerida');
            } else if (shippingNumero.trim() === '') {
                console.log('El numero es requerido');
                this.showToastError('El numero es requerido');
            } else {
                showError = false;
            }
        }
        console.log(showError);
        console.log(custom);
        this.setState({showError})
        console.log(this.state.showError);
    }

    showToastError(msg: string) {
        Toast.show({
            text: msg,
            type: 'danger',
            position: 'top'
        })
    }



    render() {
        const { custom, shippingCP, shippingNameComplete, shippingCalle, shippingProvincia, shippingLocalidad, shippingPiso,
            shippingNumero, shippingReferencias, shippingEntreCalles, shippingContacto, loading, showError } = this.state;
        return (
            <View style={{ height: '100%', width: '100%', top: 0, left: 0, alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 20 }}>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, width: '100%', flexDirection: 'row' }}>
                    <Text style={{ color: '#333', fontWeight: 'bold', fontFamily: 'Poppins-SemiBold', fontSize: 17 }}>
                        Destino de envío
                        </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Button size="small" status="success" onPress={() => this.saveLocation()} disabled={showError}>
                            Guardar
                            </Button>
                        {/* <Button size="small" style={{marginLeft: 5}} status="danger" onPress={() => this.props.close()}>
                                X
                            </Button> */}
                    </View>
                </View>
                <ScrollView style={{ marginBottom: 50 }} horizontal={false}>
                    <RadioGroup
                        style={{ flexDirection: 'row', marginTop: 20 }}
                        selectedIndex={custom}
                        onChange={index => {this.setState({ custom: index }); this.validatePersonalizado(index)}}>
                        <Radio style={{ width: '50%' }} status='primary'>Correo Argentino</Radio>
                        <Radio status='primary'>Personalizado</Radio>
                    </RadioGroup>
                    <View style={{ width: width * 0.9, marginTop: 20, flexDirection: 'row' }}>
                        <View style={{ width: '50%', marginVertical: 10, paddingHorizontal: 10 }}>
                            <Input
                                value={shippingCP}
                                label='Código Postal *:'
                                placeholder=''
                                style={(shippingCP.trim() === '') && {borderColor: 'red'}}
                                onChangeText={nextValue => {this.setState({ shippingCP: nextValue }); this.validatePersonalizado(custom);}}
                            />
                        </View>
                        {
                            custom === 1 &&
                            <View style={{ width: '50%', marginVertical: 10, paddingHorizontal: 10 }}>
                                <Input
                                    value={shippingNameComplete}
                                    label='Nombre Completo:'
                                    placeholder=''
                                    style={(shippingNameComplete.trim() === '') && {borderColor: 'red'}}
                                    onChangeText={nextValue => {this.setState({ shippingNameComplete: nextValue }); this.validatePersonalizado(custom);}}
                                />
                            </View>
                        }
                    </View>

                    <View style={{ width: width * 0.9, marginVertical: 10, paddingHorizontal: 10 }}>
                        {/* <Select
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
                            </Select> */}
                    </View>

                    <View style={{ width: width * 0.9, marginVertical: 10, paddingHorizontal: 10 }}>
                        {/* <Select
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
                            </Select> */}
                    </View>

                    {
                        custom === 1 &&
                        <View>
                            <View style={{ width: width * 0.9, marginVertical: 10, paddingHorizontal: 10 }}>
                                <Input
                                    disabled={custom === 0}
                                    value={shippingCalle}
                                    label='Calle:'
                                    placeholder=''
                                    style={(shippingCalle.trim() === '') && {borderColor: 'red'}}
                                    onChangeText={nextValue => {this.setState({ shippingCalle: nextValue }); this.validatePersonalizado(custom);}}
                                />
                            </View>

                            <View style={{ width: width * 0.9, marginTop: 10, flexDirection: 'row' }}>
                                <View style={{ width: '50%', paddingHorizontal: 10 }}>
                                    <Input
                                        value={shippingNumero}
                                        label='Número:'
                                        placeholder=''
                                        style={(shippingNumero.trim() === '') && {borderColor: 'red'}}
                                        onChangeText={nextValue => {this.setState({ shippingNumero: nextValue }); this.validatePersonalizado(custom);}}
                                    />
                                </View>
                                <View style={{ width: '50%', paddingHorizontal: 10 }}>
                                    <Input
                                        value={shippingPiso}
                                        label='Piso / Departamento:'
                                        placeholder=''
                                        onChangeText={nextValue => {this.setState({ shippingPiso: nextValue });}}
                                    />
                                </View>
                            </View>

                            <View style={{ width: width * 0.9, marginVertical: 10, paddingHorizontal: 10 }}>
                                <Input
                                    value={shippingEntreCalles}
                                    label='Entre calles:'
                                    placeholder=''
                                    onChangeText={nextValue => {this.setState({ shippingEntreCalles: nextValue });}}
                                />
                            </View>

                            <View style={{ width: width * 0.9, marginVertical: 10, paddingHorizontal: 10 }}>
                                <Input
                                    value={shippingReferencias}
                                    label='Referencias:'
                                    placeholder=''
                                    onChangeText={nextValue => {this.setState({ shippingReferencias: nextValue });}}
                                />
                            </View>

                            <View style={{ width: width * 0.9, marginVertical: 10, paddingHorizontal: 10 }}>
                                <Input
                                    value={shippingContacto}
                                    label='Teléfono de contacto:'
                                    placeholder=''
                                    onChangeText={nextValue => {this.setState({ shippingContacto: nextValue });}}
                                />
                            </View>

                        </View>
                    }
                </ScrollView>
                {
                    loading &&
                    <View style={{
                        position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(200,200,200,.5)',
                        justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'
                    }}>
                        <Spinner></Spinner>
                    </View>
                }
            </View>
        )
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
    }
}

function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps, mapDispatchToProps)(Location)