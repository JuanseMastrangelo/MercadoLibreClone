import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { Spinner, Toast } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { authKey, urlApi } from '../../constants/KeyConfig';
import ProfileHeader from './profile-header';

import { Dialog, PanningProvider } from 'react-native-ui-lib';
import { Button, Divider } from '@ui-kitten/components';

const { width } = Dimensions.get('window');


export default class ProfilePurchase extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            purchases: null,
            showDialog: false,
            showDetailOf: null
        }
    }

    componentDidMount() {
        this.getPurchases();
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Buscar'}));
    }

    getPurchases = async () => {
        this.setState({purchases: null});
        const userData = await AsyncStorage.getItem(authKey)
        const userId = JSON.parse(userData!).id;
        const userToken = JSON.parse(userData!).token;
        fetch(urlApi + '/getAllOrdersFromMEPA', {
                method: 'GET',
                headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ userToken,
                })
            })
            .then(response => response.json())
            .then(({response}) => {
                const arrayOrders = response.elements;
                const orderByUser = arrayOrders.filter((order: any) => {
                    if (order.additional_info && order.additional_info !== '') {
                        try {
                            const json_additional_info = JSON.parse(order.additional_info);
                            if (json_additional_info.id && (json_additional_info.id === userId)) {
                                return order
                            }
                        } catch (error) {}
                    }
                })
                const orderArray = orderByUser.sort((a: any, b: any) => {
                    return new Date(b.date_created) - new Date(a.date_created);
                });
                const slice = orderArray.slice(0, 7);
                this.setState({purchases: slice});
            })
            .catch((error) => {
                Toast.show({
                    text: 'Error. Compruebe su conexión a internet.',
                    type: 'danger',
                    position: 'top'
                })
                console.log(error);
                this.setState({ purchases: null })
            });
    }

    truncateString = (str: string, num: number) => {
        if (str.length > num) {
          return str.slice(0, num) + "...";
        } else {
          return str;
        }
    }

    stringStyleByOrderStatus = (status: string) => {
        if (status === 'payment_in_process') {
            return (
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.yellow}}>Esperando Pago</Text>
            );
        } else if (status === 'paid') {
            return (
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.primaryColor}}>En revisión</Text>
            );
        }
        else {
            return (
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.yellow}}>{status}</Text>
            );
        }
    }

    renderPurchases = (item: any) => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({showDialog: true, showDetailOf: item})} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/* <Image
                        style={{width: 30, height: 30, borderRadius: 10000, marginRight: 10}}
                        source={{uri: 'https://d500.epimg.net/cincodias/imagenes/2019/11/29/smartphones/1575040739_322747_1575040826_noticia_normal.jpg'}}></Image> */}
                        <View>
                            <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15}}>{
                                item.items.length === 1 ? this.truncateString(item.items[0].title, 14)
                                : item.items.length + ' artículos'
                            }</Text>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: '#ccc'}}>{
                                new Date(item.date_created).toLocaleDateString()
                            }</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>$ {(item.total_amount + item.shipping_cost).toFixed(2)}</Text>
                        {this.stringStyleByOrderStatus(item.order_status)}
                    </View>
                </TouchableOpacity>
                <View style={{marginVertical: 5, backgroundColor: 'rgba(200,200,200,.4)', height: 1}}></View>
            </View>
        )
    }


    renderDialog = () => {
        const { showDialog, showDetailOf } = this.state;
        return (
          <Dialog
            key={'dialog-key-bottom-500'}
            useSafeArea
            bottom={true}
            panDirection={PanningProvider.Directions.DOWN}
            containerStyle={{ backgroundColor: '#fff', marginBottom: 20, borderRadius: 12 }}
            visible={showDialog}
            onDismiss={() => this.setState({showDialog: false})}
            supportedOrientations={['portrait', 'landscape']}
          >
              {
                  showDetailOf &&
                    <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
                        <View style={{borderBottomWidth: .3, borderColor: '#ccc', width: '100%', marginBottom: 10}}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#444' }}>Detalles de compra</Text>
                        </View>
                        <View style={{borderBottomWidth: .3, borderColor: '#ccc', width: '100%', marginBottom: 10}}>
                            {
                                showDetailOf.items.map((item: any) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, alignItems: 'center'}}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>{item.title}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>$ {item.unit_price}</Text>
                                    </View>
                                ))
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, alignItems: 'center'}}>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Envio</Text>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>$ {showDetailOf.shipping_cost}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, alignItems: 'center'}}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12 }}>Total</Text>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12 }}>$ {(showDetailOf.total_amount + showDetailOf.shipping_cost).toFixed(2)}</Text>
                            </View>
                        </View>
                        {
                            showDetailOf.order_status === 'paid' &&
                            <Button size="small" status="success" onPress={() => this.setState({showDialog: false})}>Ver factura</Button>
                        }
                        <View style={{marginTop: 20, paddingBottom: 10 }}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12 }}>Estado: </Text>
                                {this.stringStyleByOrderStatus(showDetailOf.order_status)}
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Fecha de creación: {new Date(showDetailOf.date_created).toLocaleDateString()}</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Cant. pagos: {showDetailOf.payments.length}</Text>
                        </View>
                    </View>
              }
          </Dialog>
        );
      };
    
    
    render() {
        const { purchases } = this.state;
        return (
            <View style={{marginVertical: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10}}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#CCC'}}>Detalles de compras</Text>
                    <TouchableOpacity onPress={() => this.getPurchases()}>
                        <FontAwesome name="refresh" style={{ fontSize: 15, color: '#ccc' }}></FontAwesome>
                    </TouchableOpacity>
                </View>
                {
                    purchases ?
                    <View style={{backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10,
                    // maxHeight: 300,
                    shadowOffset: { width: 0, height: 2, }, shadowColor: "#000", shadowOpacity: 0.25,shadowRadius: 3.84}}>
                            <FlatList
                                data={purchases}
                                horizontal={false}
                                renderItem={({item}) => this.renderPurchases(item)}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    :
                    <View><Spinner color="black" size={20}></Spinner></View>
                }
                {this.renderDialog()}
            </View>
        )
    }
}

  