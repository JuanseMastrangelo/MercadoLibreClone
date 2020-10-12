import { FontAwesome } from '@expo/vector-icons';
import { Button, Card, Modal } from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actions } from '../../utils/actions/cart';



import { Toast } from 'native-base';
import Colors from '../../constants/Colors';

export class VerticalGridViewComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)

        this.state = {
            count: 1,
            modalVisible: false,
            itemSelected: null
        }
    }

    changeCount = (up: boolean) => {
        const { count } = this.state;
        const newValue = up ? count + 1 : (count > 1) ? count - 1 : 1;
        this.setState({ count: newValue });
    }


    removeItemFromCart = () => {
        const { itemSelected } = this.state;
        this.props.removeToCart();
        Toast.show({
            text: 'Eliminado del carro correctamente!',
            type: 'success',
            position: 'bottom'
        })
    }

    openRemoveModal = (item: any) => {
        this.setState({ itemSelected: item, modalVisible: true })
    }


    goToProduct = (item: any) => {
        this.props.navigation.navigate('SingleProduct', item);
    }

    renderItem = ({ item }: any) => {
        const { count } = this.state;
        return (
            <View
                style={{ width: '95%', height: 'auto', paddingVertical: 20 }}>

                <View style={{ shadowOffset: { width: 0, height: 4, }, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: 'white', borderRadius: 10,
                flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 5 }}>
                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'rgba(200,200,200,.4)', borderRadius: 5}}>
                            <TouchableOpacity style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.changeCount(true)}>
                                <Text>+</Text>
                            </TouchableOpacity>
                            <Text>{count}</Text>
                            <TouchableOpacity style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.changeCount(false)}>
                                <Text>-</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: '25%', height: 100, shadowOffset: { width: 0, height: 4, }, shadowColor: "rgba(150,150,150,.6)", shadowOpacity: 0.25, shadowRadius: 3.84, backgroundColor: 'white', borderRadius: 10 }}>
                        <Image source={{ uri: 'https://medias.musimundo.com/medias/sys_master/root/h25/h2a/10166488301598/00267113-138620-3-138620-3-size515.jpg' }}
                            style={{ height: 100 }}></Image>
                    </View>
                    <View style={{ paddingHorizontal: 10, width: '60%', justifyContent: 'space-around' }}>
                        <View>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>Samsung Galaxy Note 10</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold', color: Colors.default.secondaryColor }}>$ 99.999,00</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.goToProduct(item)} style={{ borderWidth: 1, height: 30, width: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10, borderColor: 'rgba(200,200,200,.3)', borderRadius: 5 }}>
                                <FontAwesome name="eye"></FontAwesome>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.openRemoveModal(item)} style={{ borderWidth: 1, height: 30, width: 30, alignItems: 'center', justifyContent: 'center', borderColor: 'rgba(200,0,0,.3)', borderRadius: 5 }}>
                                <FontAwesome name="trash" color="red"></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { modalVisible } = this.state;
        const { data, title, showTitleBar } = this.props
        return (
            <View style={{ marginVertical: 10 }}>

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
                    data={data}
                    horizontal={false}
                    style={{ paddingHorizontal: 2, width }}
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={(item) => this.renderItem(item)}
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
                            <Button onPress={() => this.removeItemFromCart()} status="danger" style={{ marginRight: 20 }} size='small'>Si</Button>
                            <Button onPress={() => this.setState({ modalVisible: false })} status="control" size='small'>No</Button>
                        </View>
                    </Card>
                </Modal>
            </View>
        )
    }
}


