import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Image, Text, View, Modal } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
import WebView from 'react-native-webview';

import { Spinner, Tab, Tabs, Toast } from 'native-base';
import PurchaseComponent from './purchase';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actions } from '../../utils/actions/cart';

import { VerticalGridViewComponent } from '../../components/FlatLists/verticalGridView';


import { HttpService } from '../../constants/HttpService';
import { Button } from '@ui-kitten/components';
import { CategoryComponent } from '../../components/shop/category';
import { urlApi } from '../../constants/KeyConfig';
let socket: any = null;
export class Cart extends React.Component<any, any> {
    httpService: any = null;
    constructor(props: any) {
        super(props)
        this.httpService = new HttpService();
        this.state = {
            errorFetch: false,
            newProducts: null
        }
    }

    componentDidMount() {
        this.loadNewsProducts();
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', { screen: 'Buscar' }));
    }

    emptyCartRender = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
                    <View style={{ width: 100, height: 100, borderRadius: 1000, backgroundColor: 'rgba(200,200,200,.4)', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            resizeMode="contain"
                            source={require('../../assets/images/cart.gif')}
                            fadeDuration={0}
                            style={{ width: 150, height: 150, borderRadius: 10000 }}
                        />
                    </View>
                    <Text style={{ fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 60, textAlign: 'center' }}>Carro de compras vacio</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10 }}>
                        Agrega productos al carro de compras para que aparezcan en esta area
                    </Text>
                </View>
            </View>
        )
    }

    loadNewsProducts = async () => {
        try {
            this.setState({ errorFetch: false })
            let newProductsFetch = await fetch(urlApi + '/products/news');
            const newProducts = await newProductsFetch.json();
            this.setState({ newProducts: newProducts.data });
        } catch (e) {
            this.setState({ errorFetch: true })
        }
    }



    removeItemFromList = (e: any) => {
        const { removeToCart } = this.props;
        this.httpService.delete('/cart/'+e.id).then((_:any) => {
            removeToCart(e.id);
            Toast.show({
                text: 'Eliminado del carro',
                type: 'success',
                position: 'top'
              })
        });
    }

    clearCart = () => { this.props.cleanCart(); }

    render() {
        const { items } = this.props.state.cart;
        const { newProducts, errorFetch } = this.state;
        return (
            <View style={{ height }}>
                <Tabs
                    style={{elevation: 0}}
                    tabBarUnderlineStyle={{backgroundColor: '#444', height: 1}}
                    >
                    <Tab heading="Carrito"
                        textStyle={{color: '#555', fontSize: 15, fontFamily: 'Poppins-Medium', letterSpacing: .5}}
                        activeTextStyle={{color: '#000', fontSize: 16, fontFamily: 'Poppins-Medium', letterSpacing: .5}}
                        tabStyle={{backgroundColor: Colors.default.primaryColorLight}}
                        activeTabStyle={{backgroundColor: Colors.default.primaryColorLight}}
                    >
                    {
                        items ? 
                        (items.length > 0) ?
                            <ScrollView>
                                <View style={{minHeight: height*.5, backgroundColor: '#F2F2F2'}}>
                                    <VerticalGridViewComponent removeToCart={(e: any) => this.removeItemFromList(e)} navigation={this.props.navigation} data={items} ></VerticalGridViewComponent>
                                </View>
                                
                                <PurchaseComponent products={items} />

                                <View style={{marginVertical: 50}}>
                                    {
                                        errorFetch ?
                                        <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                            <Button appearance='outline' status="basic" size="small" onPress={() => this.loadNewsProducts()}>Reintentar</Button>
                                        </View>
                                        :
                                        <CategoryComponent navigation={this.props.navigation} title="Más vendidos en la semana" data={newProducts}></CategoryComponent>
                                    }
                                </View>
                            </ScrollView>
                        
                        : this.emptyCartRender()
                        :
                        <View><Spinner color="black" size={20}></Spinner></View>
                    }
                    </Tab>
                    <Tab heading="Guardado"
                        textStyle={{color: '#555', fontSize: 15, fontFamily: 'Poppins-Medium', letterSpacing: .5}}
                        activeTextStyle={{color: '#000', fontSize: 16, fontFamily: 'Poppins-Medium', letterSpacing: .5}}
                        tabStyle={{backgroundColor: Colors.default.primaryColorLight}}
                        activeTabStyle={{backgroundColor: Colors.default.primaryColorLight}}>
                        </Tab>
                </Tabs>
            </View>
        )
    }
}



function mapDispatchToProps(dispatch: any) {
    return {
        removeToCart: bindActionCreators(actions.removeProduct, dispatch),
        cleanCart: bindActionCreators(actions.cleanCart, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(Cart)