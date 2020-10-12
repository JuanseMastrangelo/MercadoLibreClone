import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import CarouselSingleProduct from './Slideshow/Main';
import { ProductBestSellers } from '../../demoData';
import Colors from '../../constants/Colors';

import { CategoryComponent } from '../shop/category';
import { Button } from '@ui-kitten/components';
const { width } = Dimensions.get('window');


const singleProductExample = {
    images: [
        'https://medias.musimundo.com/medias/sys_master/root/h25/h2a/10166488301598/00267113-138620-3-138620-3-size515.jpg',
        'https://medias.musimundo.com/medias/sys_master/root/he3/h77/10166487810078/00267113-138620-2-138620-2-size515.jpg',
        'https://medias.musimundo.com/medias/sys_master/root/h6c/h06/10166488596510/00267113-138620-4-138620-4.jpg'
    ]
}

export class SingleProduct extends React.Component<any> {


    componentDidMount() {

    }


    render() {
        return(
            <View>
            <ScrollView showsHorizontalScrollIndicator={false}>
                <CarouselSingleProduct data={singleProductExample.images}/>
                <View style={{marginTop: 10, paddingVertical: 10, paddingHorizontal: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10}}>
                        <Text style={{color: Colors.default.greyColor, fontSize: 13, fontFamily: 'Poppins-Regular'}}>SAMSUNG | CELULAR</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{marginRight: 3}}></FontAwesome>
                            <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{marginRight: 3}}></FontAwesome>
                            <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{marginRight: 3}}></FontAwesome>
                            <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{marginRight: 3}}></FontAwesome>
                            <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{marginRight: 3}}></FontAwesome>
                        <Text style={{color: Colors.default.darkColor, fontFamily: 'Poppins-Regular', fontSize: 10}}>(1)</Text>
                        </View>
                    </View>

                    <View style={{marginVertical: 5}}>
                        <Text style={{fontSize: 24, fontFamily: 'Poppins-Medium', fontWeight: 'bold'}}>Samsung Galaxy Note 10</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, marginVertical: 0}}>
                        <Text style={{fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold'}}>$99.999,00</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons size={25} name="md-checkmark" color={Colors.default.green} style={{marginRight: 8}}></Ionicons>
                            <Text style={{color: Colors.default.green, fontFamily: 'Poppins-Regular', fontSize: 15}}>7 en stock</Text>
                        </View>
                    </View>

                    <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold'}}>Sku: 123123</Text>
                        <Text style={{fontSize: 12, fontFamily: 'Poppins-Medium', color: Colors.default.greyColor, marginTop: 5}}>
                            4G. Pantalla 5.8" plana Dynamic Amoled. Procesador Octa Core. SO Android 9.0.
                            Memoria int. 128GB/ RAM 6GB. Camara post. 12MP + 16MP/frontal 10MP. graba y reproduce videos.
                            Wi Fi. Bluetooth 5.0. USB Tipo C. Navegador Chrome. Bateria 3100 mAh.
                        </Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, marginVertical: 10,
                    paddingVertical: 5, borderBottomColor: 'rgba(200,200,200,.3)', borderBottomWidth: 1}}>
                        <Text style={{fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold'}}>Descripción</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons size={25} name="md-arrow-dropright" color={Colors.default.primaryColor} style={{marginRight: 8}}></Ionicons>
                        </View>
                    </View>


                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10}}>
                        <Text style={{fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold'}}>Comentarios</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Ionicons size={25} name="md-arrow-dropright" color={Colors.default.primaryColor} style={{marginRight: 8}}></Ionicons>
                        </View>
                    </View>
                </View>
                <CategoryComponent navigation={this.props.navigation} title="Relacionados" data={ProductBestSellers}></CategoryComponent>
            </ScrollView>

            <View style={{position: 'absolute', bottom: 10, left: 0, width, height: 50, paddingHorizontal: 20}}>
                <Button>Agregar al carro</Button>
            </View>
            </View>
        )
    }
}