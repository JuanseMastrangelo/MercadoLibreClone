import { FontAwesome } from '@expo/vector-icons';
import { Button, Divider, Modal } from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');


var BUTTONS = ["Si", "No"];
var DESTRUCTIVE_INDEX = 0;
var CANCEL_INDEX = 1;

import {Card} from 'react-native-ui-lib';

import { ActionSheet, Picker, Toast } from 'native-base';
import Colors from '../../constants/Colors';
import { StackActions } from '@react-navigation/native';

export class VerticalGridViewComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)

        this.state = {
            count: 1,
            itemSelected: null,
            selected2: 1,
            itemsCount: 0
        }
    }


    changeCount = (up: boolean) => {
        const { count } = this.state;
        const newValue = up ? count + 1 : (count > 1) ? count - 1 : 1;
        this.setState({ count: newValue });
    }


    goToProduct = (item: any) => {
        this.props.navigation.push('Components', { screen: 'SingleProduct', params: { product: item } });
    }

    onValueChange2(value: string) {
        this.setState({
          selected2: value
        });
    }

    truncateString = (str: string, num: number) => {
        if (str.length > num) {
          return str.slice(0, num) + "...";
        } else {
          return str;
        }
    }

    removeFromCart = (item: any) => {
        ActionSheet.show(
            {
              options: BUTTONS,
              cancelButtonIndex: CANCEL_INDEX,
              destructiveButtonIndex: DESTRUCTIVE_INDEX,
              title: "Desea quitar del carro al "+item.title+"?"
            },
            buttonIndex => {
                if (buttonIndex == 0) {
                    this.props.removeToCart(item);
                }
            }
          )
    }

    renderItem = (item: any, index: number) => {
        const products = this.props.data;
        const { itemsCount } = this.state;
        return (
            <Card
                width={width}
                style={{paddingVertical: 20, paddingHorizontal: 10, marginBottom: 10}}
                disabled={true}
                borderRadius={0}
                useNative
                backgroundColor={'#fff'}
            >
                <View style={{flexDirection: 'row', width: '100%', borderBottomWidth: .4, borderBottomColor: '#ccc'}}>
                    <View style={{width: 100, height: 100, paddingHorizontal: 10}}>
                        <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: JSON.parse(products[index].files)[0].path }} />
                    </View>
                    <View style={{paddingVertical: 10, width: '70%'}}>
                        <View>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: '#333', textTransform: 'capitalize' }}>{this.truncateString(item.title, 30)}</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#ccc', textTransform: 'capitalize' }}>Color: {item.colour}</Text>
                            
                            <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                                <Picker
                                    mode="dropdown"
                                    style={{ borderWidth: 1, borderColor: 'rgba(200,200,200,.4)', height: 30, width: 50, justifyContent: 'center', borderRadius: 5}}
                                    placeholder="Cantidades"
                                    selectedValue={this.state.selected2}
                                    onValueChange={this.onValueChange2.bind(this)}
                                >
                                    <Picker.Item label="1" value={1} />
                                    <Picker.Item label="2" value={2} />
                                    <Picker.Item label="3" value={3} />
                                    <Picker.Item label="4" value={4} />
                                    <Picker.Item label="5" value={5} />
                                    <Picker.Item label="6" value={6} />
                                </Picker>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17, color: '#333' }}>$ {item.saleValue}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection: 'row', paddingTop: 10, width: '100%',
                paddingHorizontal: 10, borderTopWidth: 0, backgroundColor: 'white'}}>
                    <TouchableOpacity onPress={() => this.goToProduct(item)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{color: Colors.default.primaryColor}}>Detalles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.removeFromCart(item)} style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{color: Colors.default.primaryColor}}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        )
    }

    render() {
        const { modalVisible } = this.state;
        const products = this.props.data;
        const { title, showTitleBar } = this.props
        return (
            <View>

                {
                    showTitleBar &&
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Poppins-Medium' }}>{title}</Text>
                        <TouchableOpacity>
                            <Text>Ver todas</Text>
                        </TouchableOpacity>
                    </View>
                }
                <FlatList
                    data={products}
                    horizontal={false}
                    style={{ paddingHorizontal: 2, width }}
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />

                <Modal
                    visible={modalVisible}
                    backdropStyle={{ backgroundColor: 'rgba(200,200,200,.8)', width }}
                    onBackdropPress={() => this.setState({ modalVisible: false })}>
                    <Card style={{ backgroundColor: 'white', width: '90%', alignSelf: 'center' }}>
                        <Text>Esta seguro que desea eliminar Samsung Galaxy Note 10 del carro de compras?</Text>
                        <View style={{ marginTop: 20, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <Button onPress={() => this.removeItemFromCart()} status="success" style={{ marginRight: 20 }} size='small'>Si</Button>
                            <Button onPress={() => this.setState({ modalVisible: false })} status="control" size='small'>No</Button>
                        </View>
                    </Card>
                </Modal>
            </View>
        )
    }
}


