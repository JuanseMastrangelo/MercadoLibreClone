import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import CarouselSingleProduct from './Slideshow/Main';
import Colors from '../../constants/Colors';

import { CategoryComponent } from '../shop/category';
const { width } = Dimensions.get('window');


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actions } from '../../utils/actions/cart';


import { Spinner, Toast } from 'native-base';


const singleProductExample = {
    images: [
        'https://medias.musimundo.com/medias/sys_master/root/h25/h2a/10166488301598/00267113-138620-3-138620-3-size515.jpg',
        'https://medias.musimundo.com/medias/sys_master/root/he3/h77/10166487810078/00267113-138620-2-138620-2-size515.jpg',
        'https://medias.musimundo.com/medias/sys_master/root/h6c/h06/10166488596510/00267113-138620-4-138620-4.jpg'
    ]
}

class SingleProduct extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            product: this.props.route.params.product,
            relatedProducts: null
        }
        this.loadProductByCategorie();
    }

    componentDidMount() {
    }

    goToDescription = () => {
        const { product } = this.state;
        this.props.navigation.navigate('Description', { product });
    }
    goToComments = () => {
        this.props.navigation.navigate('Comments');
    }

    loadProductByCategorie = async() => {
        const { product } = this.state;
        let productsFetch = await fetch('https://softwareargentina.store/api/products/categorie/' + product.categorieId);
        const relatedProducts = await productsFetch.json();
        this.setState({relatedProducts});
    }

    addToCart = () => {
        const { product } = this.state;
        this.props.addCart(product);
        Toast.show({
            text: 'Agregado al carro correctamente!',
            type: 'success',
            position: 'top'
          })
    }

    removeToCart = () => {
        const { product } = this.state;
        this.props.removeCart(product.id);
        Toast.show({
            text: 'Eliminado del carro',
            type: 'danger',
            position: 'top'
          })
    }

    render() {
        const { product, relatedProducts } = this.state;
        const { products } = this.props.state;
        const InCart = products.filter((e: any) => (e.id === product.id)).length > 0;
        return (
            <View style={{paddingBottom: 50}}>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <CarouselSingleProduct data={JSON.parse(product.files)} />
                    <View style={{ marginTop: 10, paddingVertical: 10, paddingHorizontal: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 }}>
                            <Text style={{ color: Colors.default.greyColor, fontSize: 13, fontFamily: 'Poppins-Regular' }}>SAMSUNG | CELULAR</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <FontAwesome size={10} name="star" color={Colors.default.yellow} style={{ marginRight: 3 }}></FontAwesome>
                                <Text style={{ color: Colors.default.darkColor, fontFamily: 'Poppins-Regular', fontSize: 10 }}>(1)</Text>
                            </View>
                        </View>

                        <View style={{ marginVertical: 5 }}>
                            <Text style={{ fontSize: 24, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>{product.title}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, marginVertical: 0 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>$ {product.saleValue}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons size={25} name="md-checkmark" color={Colors.default.green} style={{ marginRight: 8 }}></Ionicons>
                                <Text style={{ color: Colors.default.green, fontFamily: 'Poppins-Regular', fontSize: 15 }}>{product.count} en stock</Text>
                            </View>
                        </View>

                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>Sku: 123123</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', color: Colors.default.greyColor, marginTop: 5 }}>
                            {product.description}
                        </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10, marginVertical: 10,
                            paddingVertical: 5, borderBottomColor: 'rgba(200,200,200,.3)', borderBottomWidth: 1
                        }}>
                            <Text onPress={() => this.goToDescription()} style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold', width }}>Descripción</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons size={25} name="md-arrow-dropright" color={Colors.default.primaryColor} style={{ marginRight: 8 }}></Ionicons>
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 }}>
                            <Text onPress={() => this.goToComments()} style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold', width }}>Comentarios</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons size={25} name="md-arrow-dropright" color={Colors.default.primaryColor} style={{ marginRight: 8 }}></Ionicons>
                            </View>
                        </View>
                    </View>
                    {
                        relatedProducts ?
                        <CategoryComponent navigation={this.props.navigation} title="Productos relacionados" data={relatedProducts}></CategoryComponent>
                        :
                        <View><Spinner color="black" size={20}></Spinner></View>
                    }
                </ScrollView>
                {
                    !InCart ?
                    <View style={{ position: 'absolute', bottom: 10, left: 0, width, paddingHorizontal: 20 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.default.primaryColor, width: '100%', flexDirection: 'row', height: 50,
                                justifyContent: 'center', alignItems: 'center', borderRadius: 5
                            }}
                            onPress={() => this.addToCart()}>
                            <FontAwesome name="shopping-cart" color="white" size={17} style={{ marginRight: 15 }}></FontAwesome>
                            <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>Agregar al carro</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    
                    <View style={{ position: 'absolute', bottom: 10, right: 0, width: width*0.5, paddingHorizontal: 20 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.default.accentColor, width: '100%', flexDirection: 'row', height: 50,
                                justifyContent: 'center', alignItems: 'center', borderRadius: 5
                            }}
                            onPress={() => this.removeToCart()}>
                            <FontAwesome name="shopping-cart" color="white" size={17} style={{ marginRight: 15 }}></FontAwesome>
                            <Text style={{ fontFamily: 'Poppins-Regular', color: 'white' }}>Quitar</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}


function mapDispatchToProps(dispatch: any) {
    return {
        addCart: bindActionCreators(actions.addProduct, dispatch),
        removeCart: bindActionCreators(actions.removeProduct, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)