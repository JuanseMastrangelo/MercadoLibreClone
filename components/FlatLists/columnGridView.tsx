import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { Spinner, Toast } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');
import Colors from '../../constants/Colors';
import { HttpService } from '../../constants/HttpService';
import { authKey, urlApi } from '../../constants/KeyConfig';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actions } from '../../utils/actions/favorite';

class ColumnGridViewComponent extends React.Component<any, any> {
    httpService: any = null;
    constructor(props: any) {
        super(props)
        this.props.navigation.setOptions({ title: this.props.route.params.title })
        
        this.state = {
            categorie: this.props.route.params.categorie,
            products: null,
            childsCategories: [],
            favorites: []
        }
        this.httpService = new HttpService();
    }

    componentDidMount() {
        this.loadProductByCategorie();
        this.loadCategoriesChild();
    }


    loadProductByCategorie = async() => {
        const { categorie } = this.state;
        const userData = await AsyncStorage.getItem(authKey)
        const userId = JSON.parse(userData!).token;
        this.httpService.get('/products/categorie/' + categorie.id, new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ userId,
        })).then((res:any) => res.json()).then((products: any) => {
            const fav: any = [];
            products.map((el: any) => {if (el.is_favorite) {fav.push(el.id)}});
            this.setState({products, favorites: fav});
        });
    }

    loadCategoriesChild = async() => {
        const { categorie } = this.state;
        let categoriesFetch = await fetch(urlApi + '/categories/sub/' + categorie.id);
        const childsCategories = await categoriesFetch.json();
        this.setState({childsCategories});
    }


    goToProduct = (item: any) => {
        this.props.navigation.push('Components', { screen: 'SingleProduct', params: { product: item } });
    }

    viewCategorie = (item:any) => {
        this.props.navigation.push('ColumnGridView', {title: item.name, showTitleBar: false, categorie: item });
    }


    toggleFavorite = (item:any) => {
        let { items } = this.props.state.favorites;
        const is_favorite = items.filter((el: any) => el.id === item.id).length > 0;
        this.httpService.post('/favorites', {postId: item.id}).then((_:any) => {
            Toast.show({
                text: is_favorite ? 'Eliminado de favorito' : 'Agregado a favorito',
                type: 'success',
                position: 'top'
            })

            if (is_favorite) { // Si es favorito, lo eliminamos de la lista
                this.props.favoriteRemove(item.id);
            } else {
                this.props.favoriteAdd(item);
            }
        });
    }

    renderItem = (item: any, index: number) => {
        const favItems = this.props.state.favorites.items;
        const is_favorite = favItems.filter((favItem: any) => favItem.id === item.id).length > 0;
        return (
            <TouchableWithoutFeedback
                style={{ width: width / 2.3, marginTop: 10, height: 300, marginHorizontal: 10, borderRadius: 5, backgroundColor: 'white', padding: 10 }}
                onPress={() => this.goToProduct(item)}>
                <View style={{ width: '100%', height: '50%', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomWidth: 1,
                borderColor: '#ccc' }}>
                    <Image resizeMode="contain" source={{ uri: JSON.parse(this.state.products[index].files)[0].path }}
                    style={{ width: '100%', height: '100%', paddingVertical: 5 }}></Image>
                </View>
                <View style={{ marginTop: 10, paddingHorizontal: 5 }}>
                    <Text style={{ fontFamily: 'Poppins-Light', fontSize: 16 }}>$ {item.saleValue}</Text>
                    <Text style={{ fontFamily: 'Poppins-Light', color: Colors.default.green, fontSize: 10 }}>En 12X $ {(item.saleValue / 12).toFixed(2)}</Text>
                    <Text style={{ fontFamily: 'Poppins-Light', color: Colors.default.green, fontSize: 10 }}>Envios a todo el país</Text>
                    <Text style={{ fontFamily: 'Poppins-Light', fontSize: 10, color: '#222' }}>{item.title}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderCategoriesChild = (item: any, index: number) => {
        const { childsCategories } = this.state;
        return (
            <TouchableWithoutFeedback style={{width: width*.2, margin: 5, height: 100, borderRadius: 5, backgroundColor: 'white', elevation: 6}}
            onPress={() => this.viewCategorie(item)}>
                <View style={{ width: '100%', height: '70%', backgroundColor: '#eee', paddingVertical: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5}}>
                    {
                        childsCategories[index].files && (JSON.parse(childsCategories[index].files).length > 0) &&
                        <Image resizeMode="contain" source={{ uri: JSON.parse(childsCategories[index].files)[0].path }} style={{ width: '100%', height: '100%', borderRadius: 10 }}></Image>
                    }
                </View>
                <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{ fontFamily: 'Poppins-Light', fontSize: 10, letterSpacing: .5 }}>
                        {item.name.toUpperCase()}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderListCategories = () => {
        const { childsCategories } = this.state;
        return (
            <View style={{ marginVertical: 30 }}>
                <View style={{alignItems: 'center'}}>
                    <Text style={{ fontFamily: 'Poppins-Light', fontSize: 13, letterSpacing: .5 }}>COMPRÁ POR MARCA</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <FlatList
                        contentContainerStyle={{alignItems: 'center'}}
                        data={childsCategories}
                        horizontal={false}
                        numColumns={4}
                        renderItem={({ item, index }) => this.renderCategoriesChild(item, index)}
                    ></FlatList>
                </View>
            </View>
        )
    }

    render() {
        const { products, childsCategories } = this.state;
        return (
            <ScrollView style={{marginTop: 0}}>
                <View style={{ width, height: 80 }}>
                    <View style={{ width: '100%', height: '100%' }}>
                        <Image style={{ width: '100%', height: '100%' }} resizeMode="cover" source={{uri:'https://http2.mlstatic.com/storage/splinter-admin/o:f_webp,q_auto:best/1606747219853-celularesheader-desktop.jpg'}}></Image>
                    </View>
                </View>
                {
                    childsCategories.length > 0 &&
                    this.renderListCategories()
                }
                
                {
                    products ? 
                    (
                        <View>
                            <Text style={{fontSize: 20, fontFamily: 'Poppins-Light', fontWeight: 'bold', color: '#222', paddingVertical: 10, paddingHorizontal: 20,
                            marginTop: 15, letterSpacing: .5}}>Productos</Text>

                            { 
                                products.length > 0 ?
                                <View style={{alignItems: 'center', flexDirection: 'row', width}}>
                                    <FlatList
                                        contentContainerStyle={{alignItems: 'center'}}
                                        data={products}
                                        horizontal={false}
                                        numColumns={2}
                                        renderItem={({ item, index }) => this.renderItem(item, index)}
                                    ></FlatList>
                                </View>
                            :
                            <Text style={{textAlign: 'center'}}>No se han encontrado productos</Text>
                            }
                        </View>
                    )
                :
                <View><Spinner color="black" size={20}></Spinner></View>
                }
            </ScrollView>
        )
    }
}


function mapDispatchToProps(dispatch: any) {
    return {
        favoriteAdd: bindActionCreators(actions.favoriteAdd, dispatch),
        favoriteRemove: bindActionCreators(actions.favoriteRemove, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(ColumnGridViewComponent)