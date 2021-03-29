import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { Spinner, Toast } from 'native-base';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { authKey, urlApi } from '../../constants/KeyConfig';
import * as WebBrowser from 'expo-web-browser';

import { Dialog, PanningProvider } from 'react-native-ui-lib';
import { Button } from '@ui-kitten/components';

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
        fetch(urlApi + '/salesByUserId2/' + userId, {
                method: 'GET',
                headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ userToken,
                })
            })
            .then(response => response.json())
            .then((res) => {
                /* const orderByUser = res.filter((order: any) => {
                    if (order.additional_info && order.additional_info !== '') {
                        try {
                            const json_additional_info = JSON.parse(order.additional_info);
                            if (json_additional_info.id && (json_additional_info.id === userId)) {
                                return order
                            }
                        } catch (error) {}
                    }
                }) */
                const orderArray = res.sort((a: any, b: any) => {
                    return new Date(b.created_at) - new Date(a.created_at);
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

    showReceipt = () => {
        WebBrowser.openBrowserAsync('https://softwareargentina.store/');
    }

    stringStyleByOrderStatus = (status: string, shipId: string) => {
        if (shipId == '1') {
            if (status === 'payment_in_process') {
                return (
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.darkColor}}>Esperando Pago</Text>
                );
            } else if (status === 'paid') {
                return (
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.primaryColor}}>En revisión</Text>
                );
            }
            else {
                return (
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.darkColor}}>{status}</Text>
                );
            }
        } else {
            return (
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.green}}>En camino</Text>
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
                                item.info_mp.items.length === 1 ? this.truncateString(item.info_mp.items[0].title, 14)
                                : item.info_mp.items.length + ' artículos'
                            }</Text>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: '#ccc'}}>{
                                item.created_at
                            }</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>$ {(item.info_mp.total_amount + item.info_mp.shipping_cost).toFixed(2)}</Text>
                        {this.stringStyleByOrderStatus(item.info_mp.order_status, item.shipId)}
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
                                showDetailOf.info_mp.items.map((item: any) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, alignItems: 'center'}}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>{item.title}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>$ {item.unit_price}</Text>
                                    </View>
                                ))
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, alignItems: 'center'}}>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Envio</Text>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>$ {showDetailOf.info_mp.shipping_cost}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, alignItems: 'center'}}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12 }}>Total</Text>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12 }}>$ {(showDetailOf.info_mp.total_amount + showDetailOf.info_mp.shipping_cost).toFixed(2)}</Text>
                            </View>
                        </View>
                        {
                            showDetailOf.shipId != '1' &&
                            <Button size="small" status="success" onPress={() => this.showReceipt()}>Ver factura</Button>
                        }
                        <View style={{marginTop: 20, paddingBottom: 10 }}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12 }}>Estado: </Text>
                                {this.stringStyleByOrderStatus(showDetailOf.info_mp.order_status, showDetailOf.shipId)}
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Fecha de despacho: {showDetailOf.updated_at}</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Fecha de creación: {new Date(showDetailOf.info_mp.date_created).toLocaleDateString()}</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Cant. pagos: {showDetailOf.info_mp.payments.length}</Text>
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
                    <TouchableOpacity onPress={() => this.getPurchases()} style={{paddingHorizontal: 25, paddingVertical: 5}}>
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

  