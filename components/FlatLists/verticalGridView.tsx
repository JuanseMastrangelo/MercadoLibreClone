import { FontAwesome } from '@expo/vector-icons';
import { Button, Card, Modal } from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');



import { Picker, Toast } from 'native-base';
import Colors from '../../constants/Colors';
import { StackActions } from '@react-navigation/native';

export class VerticalGridViewComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)

        this.state = {
            count: 1,
            modalVisible: false,
            itemSelected: null,
            selected2: 1,
        }
    }


    changeCount = (up: boolean) => {
        const { count } = this.state;
        const newValue = up ? count + 1 : (count > 1) ? count - 1 : 1;
        this.setState({ count: newValue });
    }


    removeItemFromCart = () => {
        const { itemSelected } = this.state;
        this.setState({ modalVisible: false })
        this.props.removeToCart(itemSelected);
        Toast.show({
            text: 'Eliminado del carro correctamente!',
            type: 'success',
            position: 'bottom',
        })
    }

    openRemoveModal = (item: any) => {
        this.setState({ itemSelected: item, modalVisible: true })
    }


    goToProduct = (item: any) => {
        this.props.navigation.dispatch(StackActions.replace('Components', { screen: 'SingleProduct', params: { product: item } }));
    }

    onValueChange2(value: string) {
        this.setState({
          selected2: value
        });
    }

    renderItem = (item: any, index: number) => {
        const products = this.props.data;
        return (
            <View>
            <View style={{ width: '100%', paddingVertical: 0, marginTop: 10 }}>
                <View style={{ backgroundColor: 'white', borderTopStartRadius: 2, borderWidth: 1, borderColor: 'rgba(200,200,200,.4)',
                flexDirection: 'row', paddingVertical: 5 }}>
                    <View style={{ width: '25%', height: 100, shadowOffset: { width: 0, height: 4, }, backgroundColor: 'white', borderRadius: 10 }}>
                        <Image source={{ uri: JSON.parse(products[index].files)[0].path }}
                            style={{ height: 100 }}></Image>
                    </View>
                    <View style={{ paddingHorizontal: 10, width: '70%', justifyContent: 'space-around' }}>
                        <View>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>{item.title}</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold', color: Colors.default.secondaryColor }}>$ {item.saleValue}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Cant</Text>
                            <Picker
                                mode="dropdown"
                                style={{ marginLeft: 10, borderWidth: 1, borderColor: 'rgba(200,200,200,.4)', height: 30, width: 50, justifyContent: 'center', borderRadius: 5}}
                                placeholder="Cant"
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
                        </View>
                    </View>
                </View>
            </View>
                <View style={{flexDirection: 'row', paddingVertical: 10, width: '100%', borderWidth: 1, borderColor: 'rgba(200,200,200,.4)',
                paddingHorizontal: 10, borderTopWidth: 0, backgroundColor: 'white'}}>
                    <TouchableOpacity onPress={() => this.goToProduct(item)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{color: Colors.default.primaryColor}}>Detalles</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openRemoveModal(item)} style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{color: Colors.default.primaryColor}}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
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


