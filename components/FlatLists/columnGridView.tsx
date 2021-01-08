import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { Spinner, Toast } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
const { width } = Dimensions.get('window');
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
            <TouchableOpacity
                style={{ width: width / 2.3, marginTop: 10, height: 280, marginHorizontal: 10, borderWidth: 1, borderColor: 'rgba(200,200,200,.2)', backgroundColor: 'white' }}
                onPress={() => this.goToProduct(item)}>
                <Image source={{ uri: JSON.parse(this.state.products[index].files)[0].path }} style={{ width: '100%', height: '70%', borderRadius: 10 }}></Image>
                <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, }}>{item.title}</Text>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold' }}>$ {item.saleValue}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {[...Array(item.rating)].map((x, i) =>
                            <FontAwesome name="star" color="#F7D970"></FontAwesome>
                        )}
                    </View>
                </View>
                <View style={{position: 'absolute', top: 10, right: 15}}>
                    <TouchableOpacity onPress={() => this.toggleFavorite(item)}>
                        <FontAwesome size={23} name={is_favorite ? 'heart' : 'heart-o'} color={is_favorite ? Colors.default.accentColor : Colors.default.greyColor}></FontAwesome>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    renderCategoriesChild = (item: any) => {
        return (
            <TouchableOpacity
                style={{borderWidth: 1, borderColor: 'rgba(200,200,200,.2)', backgroundColor: 'rgba(200,200,200,.5)',
                        marginHorizontal: 10, height: 30, justifyContent: 'center', paddingHorizontal: 10, borderRadius: 5}}
                onPress={() => this.viewCategorie(item)}>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { products, childsCategories } = this.state
        return (
            <View style={{marginTop: 60}}>
                {
                    childsCategories.length > 0 &&
                    <FlatList
                        data={childsCategories}
                        style={{marginTop: 14, paddingBottom: 10}}
                        horizontal={true}
                        renderItem={({item}) => this.renderCategoriesChild(item)}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                }
                
                {
                    products ? 
                    products.length > 0 ?
                        <FlatList
                            data={products}
                            horizontal={false}
                            renderItem={({item, index}) => this.renderItem(item, index)}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                        />
                    :
                    <Text style={{textAlign: 'center'}}>No se han encontrado productos</Text>
                :
                <View><Spinner color="black" size={20}></Spinner></View>
                }
            </View>
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