import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Image, Text, View, Modal } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
import WebView from 'react-native-webview';

import { Spinner, Toast } from 'native-base';
import PurchaseComponent from './purchase';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actions } from '../../utils/actions/cart';

import { VerticalGridViewComponent } from '../../components/FlatLists/verticalGridView';


import { HttpService } from '../../constants/HttpService';
let socket: any = null;
export class Cart extends React.Component<any, any> {
    httpService: any = null;
    constructor(props: any) {
        super(props)
        this.httpService = new HttpService();
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', { screen: 'Buscar' }));
    }

    emptyCartRender = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
                    <View style={{ width: 100, height: 100, borderRadius: 1000, backgroundColor: 'rgba(200,200,200,.4)', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            resizeMode="contain"
                            source={{ uri: 'https://i.pinimg.com/originals/09/88/dc/0988dc27ab24d196b91d085c786c292d.png' }}
                            fadeDuration={0}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                    <Text style={{ fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 30, textAlign: 'center' }}>Carro de compras vacio</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10 }}>
                        Agrega productos al carro de compras para que aparezcan en esta area
                    </Text>

                    <TouchableOpacity style={{ marginTop: 60, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => this.goToShopping()}>
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', fontWeight: 'bold' }}>Comprar ahora!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
        return (
            <View style={{ height }}>
                <View style={{ marginTop: 0 }}>
                    {
                        items ? 
                        (items.length > 0) ?
                            <ScrollView showsVerticalScrollIndicator={true} style={{ height: height*0.60 }}>
                                {<VerticalGridViewComponent removeToCart={(e: any) => this.removeItemFromList(e)} navigation={this.props.navigation} data={items} ></VerticalGridViewComponent>}
                            </ScrollView>
                        : this.emptyCartRender()
                        :
                        <View><Spinner color="black" size={20}></Spinner></View>
                    }

                </View>
                {
                    items && 
                    <PurchaseComponent products={items} />
                }
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