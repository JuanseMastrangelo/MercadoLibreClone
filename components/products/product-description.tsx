import { Divider } from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export class ProductDescriptionComponent extends React.Component<any> {

    constructor(props: any) {
        super(props)
        this.props.navigation.setOptions({ title: 'Descripción' });
    }

    render() {
        return (
            <ScrollView style={{paddingVertical: 20, paddingHorizontal: 15}}>
                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>Descripción general</Text>
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15}}>
                    4G. Pantalla 5.8" plana Dynamic Amoled. Procesador Octa Core. SO Android 9.0. Memoria int. 128GB/ RAM 6GB. Camara post. 12MP + 16MP/frontal 10MP. graba y reproduce videos. Wi Fi. Bluetooth 5.0. USB Tipo C. Navegador Chrome. Bateria 3100 mAh.
                </Text>

                <View style={{marginVertical: 40}}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>Detalles</Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Alto</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>0.79</Text>
                    </View>

                    <Divider/>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Ancho</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>6.99</Text>
                    </View>

                    <Divider/>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Color</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>Plata / Negro / Blanco</Text>
                    </View>

                    <Divider/>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Modelo</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>GALAXY NOTE 10 G970 PLATA</Text>
                    </View>

                    <Divider/>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Memoria Ram</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>6 GB</Text>
                    </View>

                    <Divider/>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Capacidad de Bateria</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>3100 MAH</Text>
                    </View>

                    <Divider/>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Tamaño de pantalla</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>5.8 "</Text>
                    </View>

                    <Divider/>
                    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Tipo de pantalla</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>DYMANIC AMOLED</Text>
                    </View>

                    
                </View>
            </ScrollView>
        )
    }
}

