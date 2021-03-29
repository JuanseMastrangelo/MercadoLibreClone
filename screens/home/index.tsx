import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';

import Carousel from './Slideshow/Main';


import { connect } from 'react-redux';
import { actionCreators as actionsCart } from '../../utils/actions/cart';
import { actionCreators as actionsMessages } from '../../utils/actions/messages';
import { actionCreators as actionsSteps } from '../../utils/actions/steps';
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
import { Button } from '@ui-kitten/components';

const { width } = Dimensions.get('window');

import * as firebase from 'firebase';



export class Home extends React.Component<any, any> {
    httpService: any = null;
    notificationListener: any = null;
    responseListener: any = null;

    constructor(props: any) {
        super(props)
        this.state = {
            newProducts: null,
            errorFetch: false,
            countMessagesNotSee: 0
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

        this.getMessages();
    }

    getMessages = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        const user = JSON.parse(userData!);
        firebase.database().ref("chats").orderByChild('to').equalTo(user.id).on("value", async (snapshot: any) => {
            let countMessagesNotSee = 0;
            snapshot.forEach((snap: any) => {
                const message = snap.val();
                if (message.visto === false) {
                    countMessagesNotSee++;
                }
            });
            this.props.setMessagesNotReaded(countMessagesNotSee);
        });
    }


    loadNewsProducts = async() => {
        try {
            this.setState({errorFetch: false})
            let newProductsFetch = await fetch(urlApi + '/products/news');
            const newProducts = await newProductsFetch.json();
            this.setState({newProducts: newProducts.data});
            this.props.setHomeStep(true);
        } catch (e) {
            this.setState({errorFetch: true})
        }
    }
    

    render() {
        const { newProducts, errorFetch } = this.state
        return (
            <View>
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
                    {
                        errorFetch ?
                        <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                            <Button appearance='outline' status="basic" size="small" onPress={() => this.loadNewsProducts()}>Reintentar</Button>
                        </View>
                        :
                        <CategoryComponent navigation={this.props.navigation} title="Más vendidos en la semana" data={newProducts}></CategoryComponent>
                    }
                </ScrollView>
            </View>
        )
    }

    componentWillUnmount() {
        this.props.setHomeStep(false);
    }
}


function mapDispatchToProps(dispatch: any) {
    return {
        setFavoriteForce: bindActionCreators(actionsFavorites.favoriteForce, dispatch),
        setCartItemsForce: bindActionCreators(actionsCart.forceProduct, dispatch),
        setMessagesNotReaded: bindActionCreators(actionsMessages.notSeeMessages, dispatch),
        setHomeStep: bindActionCreators(actionsSteps.homeStep, dispatch),
    }
}

function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

