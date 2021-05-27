import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { Button, Icon, Spinner, SwipeRow, Toast } from 'native-base';
import * as React from 'react';
import { Dimensions, Text, View, Image, RefreshControl } from 'react-native';
import { FlatList, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { HttpService } from '../../constants/HttpService';
import { authKey } from '../../constants/KeyConfig';

const { width, height } = Dimensions.get('window');

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as actions } from '../../utils/actions/favorite';
import { Card } from 'react-native-ui-lib';
import AutoHeightImage from 'react-native-auto-height-image';

class WhiteList extends React.Component<any, any> {
    httpService: any = null;

    constructor(props: any) {
        super(props)
        this.httpService = new HttpService();
        this.state = {
            refreshing: false,
            removeOpen: false
        }
    }

    goToCategories() {
        this.props.navigation.dispatch(StackActions.replace('Root', { screen: 'Buscar' }));
    }

    goToProduct = (item: any) => {
        this.props.navigation.push('Components', { screen: 'SingleProduct', params: { product: item } });
    }

    toggleFavorite = (item:any) => {
        let { items } = this.props.state.favorites;
        const is_favorite = items.filter((el: any) => el.id === item.id).length > 0;
        this.httpService.post('/favorites', {postId: item.id}).then((_:any) => {
            /* Toast.show({
                text: is_favorite ? 'Eliminado de favorito' : 'Agregado a favorito',
                position: 'top'
            }) */

            if (is_favorite) { // Si es favorito, lo eliminamos de la lista
                this.props.favoriteRemove(item.id);
            } else {
                this.props.addFavorite(item);
            }
        });
    }

    refreshWhiteList = () => {
        this.setState({refreshing: true});
        this.httpService.get('/favorites').then((res:any) => res.json()).then((favoritesItems: any) => {
            this.props.favoriteForce(favoritesItems);
            this.setState({refreshing: false});
        })
    }
    

    renderItem = (item: any, index: number) => {
        const { removeOpen } = this.state;
        const favItems = this.props.state.favorites.items;
        const is_favorite = favItems.filter((favItem: any) => favItem.id === item.id).length > 0;
        
            {/* <TouchableWithoutFeedback
                style={{ width: '100%', paddingVertical: 20, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: 'white'}}
                onPress={() => this.goToProduct(item)}>

                <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                    <Image source={{ uri: JSON.parse(favItems[index].files)[0].path }} resizeMode="contain" style={{ width: '40%', height: '100%' }}></Image>
                
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, }}>{item.title}</Text>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold' }}>$ {item.saleValue}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {[...Array(item.rating)].map((x, i) =>
                                <FontAwesome name="star" color="#F7D970"></FontAwesome>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback> */}
        return (
            <SwipeRow
            style={{backgroundColor: '#FFF', borderBottomWidth: 2, borderColor: '#eee'}}
            rightOpenValue={-width*.2}
            disableRightSwipe={true}
            onRowOpen={() => this.setState({removeOpen: true})}
            body={
                <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                    <AutoHeightImage
                        width={140}
                        source={{uri: JSON.parse(favItems[index].files)[0].path}}
                    />
                
                    <View style={{ width: '60%' }}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 20 }}>$ {item.saleValue}</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: '#aaa' }}>{item.title}</Text>

                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 10,
                        color: Colors.default.secondaryColor}}
                        onPress={() => this.goToProduct(item)}>Ver producto</Text>
                    </View>
                </View>
            }
            right={
              <Button danger onPress={() => this.toggleFavorite(item)}>
                <Icon active name="trash" />
              </Button>
            }
          />
        )
    }

    emptyFavorites = () => (
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: height * 0.75 }} scrollEnabled={false}>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: height * 0.45, marginTop: 80}}>
                <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
                    {/* <View style={{ width: 100, height: 100, borderRadius: 1000, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }}>
                        
                        <Image
                            resizeMode="cover"
                            source={require('../../assets/images/whitelist.gif')}
                            fadeDuration={0}
                            style={{ width: 150, height: 150, borderRadius: 10000 }}
                        />
                        
                    </View> */}
                    <Text style={{ fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 60 }}>WhiteList vacío</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10 }}>
                        Agrega productos a favoritos para que aparezcan en esta area
                </Text>

                    {/* <TouchableOpacity style={{ marginTop: 60, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => this.goToCategories()}>
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', fontWeight: 'bold' }}>Ir de compras</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </ScrollView>
    )


    render() {
        const { items } = this.props.state.favorites;
        return (
            <View style={{ marginTop: 0 }}>
                {
                    items ?
                    items.length > 0 ?
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.refreshWhiteList.bind(this)}
                                tintColor={Colors.default.greyColor}
                                />
                            }
                            data={items}
                            style={{paddingBottom: 10, minHeight: height, width}}
                            horizontal={false}
                            renderItem={({item, index}) => this.renderItem(item, index)}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    :
                        this.emptyFavorites()
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
        favoriteRemove: bindActionCreators(actions.favoriteRemove, dispatch),
        favoriteForce: bindActionCreators(actions.favoriteForce, dispatch)
    }
}

function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, mapDispatchToProps)(WhiteList)