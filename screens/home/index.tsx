import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

import Carousel from './Slideshow/Main';


import { connect } from 'react-redux';
import { actionCreators as actionsCart } from '../../utils/actions/cart';
import { actionCreators as actionsFavorites } from '../../utils/actions/favorite';

import Colors from '../../constants/Colors';

import { CategoriesComponent } from '../../components/shop/categories';
// import { CategoryComponent } from '../../components/shop/category';
import { ScrollView } from 'react-native-gesture-handler';

import { SlideImages, Coupon } from '../../demoData';
import { CategoryComponent } from '../../components/shop/category';
import { authKey, urlApi } from '../../constants/KeyConfig';
import { bindActionCreators } from 'redux';
import { HttpService } from '../../constants/HttpService';
import AsyncStorage from '@react-native-community/async-storage';

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


        this.props.cleanCart();
        this.props.cleanFavorite();

        this.httpService.get('/cart', header).then((res:any) => res.json()).then((cartItems: any) => {
            const cartItemsNow = this.props.state.cart.items;
            cartItems.map((item: any) => {
                const inCart = cartItemsNow.filter((el: any)=> el.id === item.id).length > 0;
                if (!inCart) {
                    this.props.addCart(item);
                }
            })
        })

        this.httpService.get('/favorites', header).then((res:any) => res.json()).then((favoritesItems: any) => {
            const favoritesItemsNow = this.props.state.favorites.items;
            favoritesItems.map((item: any) => {
                const isFavorite = favoritesItemsNow.filter((el: any)=> el.id === item.id).length > 0;
                if (!isFavorite) {
                    this.props.addFavorite(item);
                }
            })
        })
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


function mapDispatchToProps(dispatch: any) {
    return {
        addCart: bindActionCreators(actionsCart.addProduct, dispatch),
        cleanCart: bindActionCreators(actionsCart.cleanCart, dispatch),
        addFavorite: bindActionCreators(actionsFavorites.favoriteAdd, dispatch),
        cleanFavorite: bindActionCreators(actionsFavorites.cleanFavorite, dispatch),
    }
}

function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

