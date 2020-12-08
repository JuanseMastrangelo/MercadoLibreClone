import { Divider } from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
export class ProductDescriptionComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.props.navigation.setOptions({ title: 'Descripción' });
        this.state = {
            product: this.props.route.params.product,
        }
    }

    render() {
        const { product } = this.state;
        return (
            <ScrollView style={{paddingVertical: 20, paddingHorizontal: 15}}>
                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>Descripción general</Text>
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15}}>
                    {product.description}
                </Text>

                <View style={{marginVertical: 40}}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold', marginBottom: 10}}>Detalles</Text>

                    {
                        product.high &&
                        (
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Alto</Text>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>{product.high}</Text>
                                </View>
                                <Divider/>
                            </View>
                        )
                    }
                    {
                        product.width &&
                        (
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Ancho</Text>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>{product.width}</Text>
                                </View>
                                <Divider/>
                            </View>
                        )
                    }
                    {
                        product.colour &&
                        (
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Color</Text>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>{product.colour}</Text>
                                </View>
                                <Divider/>
                            </View>
                        )
                    }
                    {
                        product.model &&
                        (
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Modelo</Text>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>{product.model}</Text>
                                </View>
                                <Divider/>
                            </View>
                        )
                    }
                    {
                        product.RAM &&
                        (
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Memoria Ram</Text>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>{product.RAM}</Text>
                                </View>
                                <Divider/>
                            </View>
                        )
                    }
                    {
                        product.warranty &&
                        (
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, fontWeight: 'bold'}}>Garantía</Text>
                                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 15, color: '#aaa'}}>{product.warranty}</Text>
                                </View>
                                <Divider/>
                            </View>
                        )
                    }

                    
                </View>
            </ScrollView>
        )
    }
}

