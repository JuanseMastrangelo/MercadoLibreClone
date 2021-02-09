import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

import Carousel from './Slideshow/Main';


import { connect } from 'react-redux';
import { actionCreators as actionsCart } from '../../utils/actions/cart';
import { actionCreators as actionsFavorites } from '../../utils/actions/favorite';

import Colors from '../../constants/Colors';

import { CategoriesComponent } from '../../components/shop/categories';
// import { CategoryComponent } from '../../components/shop/category';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { SlideImages, Coupon } from '../../demoData';
import { CategoryComponent } from '../../components/shop/category';
import { authKey, urlApi } from '../../constants/KeyConfig';
import { bindActionCreators } from 'redux';
import { HttpService } from '../../constants/HttpService';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, Input } from '@ui-kitten/components';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export class Home extends React.Component<any, any> {
    httpService: any = null;

    constructor(props: any) {
        super(props)
        this.state = {
            newProducts: null,
            errorFetch: false
        }
        this.httpService = new HttpService();
    }

    componentDidMount() {
        this.loadNewsProducts();
        this.syncAppWithDatabase();
    }


    async syncAppWithDatabase() {
        const userData = await AsyncStorage.getItem(authKey)
        const userId = JSON.parse(userData!).token;
        const header = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ userId,
        });

        this.httpService.get('/cart', header).then((res:any) => res.json()).then((cartItems: any) => {
            this.props.setCartItemsForce(cartItems);
        })

        this.httpService.get('/favorites', header).then((res:any) => res.json()).then((favoritesItems: any) => {
            this.props.setFavoriteForce(favoritesItems);
        })
    }

    loadNewsProducts = async() => {
        try {
            this.setState({errorFetch: false})
            let newProductsFetch = await fetch(urlApi + '/products/news');
            const newProducts = await newProductsFetch.json();
            this.setState({newProducts: newProducts.data});
        } catch (e) {
            this.setState({errorFetch: true})
        }
    }
    

    render() {
        const { newProducts, errorFetch } = this.state
        return (
            <View style={{}}>
                <View style={{ position: 'absolute', top: -80, width, left: 0 }}><Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Poppins-Regular' }}>Gracias por utilizar nuestra tienda! ❤</Text></View>
                {/* <View style={{
                    transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 300, height: 250, position: 'absolute',
                    top: -40, left: -120, borderBottomEndRadius: 100, borderTopEndRadius: 100
                }}></View> */}
                <View style={{
                    transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 130, height: 230, position: 'absolute',
                    top: 340, right: -30, borderRadius: 100
                }}></View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Carousel data={SlideImages} />
                    <CategoriesComponent navigation={this.props.navigation} ></CategoriesComponent>
                    {
                        errorFetch ?
                        <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                            <Button appearance='outline' status="basic" size="small" onPress={() => this.loadNewsProducts()}>Reintentar</Button>
                        </View>
                        :
                        <CategoryComponent navigation={this.props.navigation} title="Más recientes" data={newProducts}></CategoryComponent>
                    }
                    <Image source={{ uri: Coupon }} resizeMode="contain" style={{ width, height: 140, marginVertical: 40 }}></Image>
                    {/* <CategoryComponent title="Nuevos" data={ProductBestSellers}></CategoryComponent> */}
                </ScrollView>
            </View>
        )
    }
}


function mapDispatchToProps(dispatch: any) {
    return {
        setFavoriteForce: bindActionCreators(actionsFavorites.favoriteForce, dispatch),
        setCartItemsForce: bindActionCreators(actionsCart.forceProduct, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

