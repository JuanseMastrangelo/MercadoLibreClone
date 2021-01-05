import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

import Carousel from './Slideshow/Main';
import { connect } from 'react-redux';
import { Button } from '@ui-kitten/components';
import { useFonts } from 'expo-font';

import Colors from '../../constants/Colors';

import { CategoriesComponent } from '../../components/shop/categories';
// import { CategoryComponent } from '../../components/shop/category';
import { ScrollView } from 'react-native-gesture-handler';

import { SlideImages, Coupon, ProductBestSellers } from '../../demoData';
import { CategoryComponent } from '../../components/shop/category';
import { urlApi } from '../../constants/KeyConfig';

const { width, height } = Dimensions.get('window');

export class Home extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            newProducts: null,
            errorFetch: false
        }
    }

    componentDidMount() {
        this.loadNewsProducts();
    }

    loadNewsProducts = async() => {
        let newProductsFetch = await fetch(urlApi + '/products/news');
        const newProducts = await newProductsFetch.json();
        this.setState({newProducts: newProducts.data});
    }
    

    render() {
        const { newProducts, errorFetch } = this.state
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ position: 'absolute', top: -80, width, left: 0 }}><Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Poppins-Regular' }}>Gracias por utilizar nuestra tienda! ❤</Text></View>
                <View style={{
                    transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 300, height: 250, position: 'absolute',
                    top: -40, left: -120, borderBottomEndRadius: 100, borderTopEndRadius: 100
                }}></View>
                <View style={{
                    transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 130, height: 230, position: 'absolute',
                    top: 340, right: -30, borderRadius: 100
                }}></View>
                <Carousel data={SlideImages} />
                <CategoriesComponent navigation={this.props.navigation} ></CategoriesComponent>
                <CategoryComponent navigation={this.props.navigation} title="Más recientes" data={newProducts}></CategoryComponent>
                {
                    errorFetch && 
                    <View>
                        <Text>Error de conexión</Text>
                    </View>
                }
                <Image source={{ uri: Coupon }} resizeMode="contain" style={{ width, height: 140, marginVertical: 40 }}></Image>
                {/* <CategoryComponent title="Nuevos" data={ProductBestSellers}></CategoryComponent> */}
            </ScrollView>
        )
    }
}


function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps)(Home)

