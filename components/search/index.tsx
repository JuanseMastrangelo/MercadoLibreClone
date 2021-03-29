import { FontAwesome } from '@expo/vector-icons';
import { Button, Card } from '@ui-kitten/components';
import { Spinner, Text, Toast, View } from 'native-base';
import * as React from 'react';
import { Image, Dimensions, RefreshControl } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { urlApi } from '../../constants/KeyConfig';
const { height, width } = Dimensions.get('window');



export default class SearchScreen extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            errorFetch: false,
            products: null,
            refreshing: false
        }
    }

    componentDidMount = async () => {
        this.loadProducts();
    }

    bindTextarea = (e: any) => {
        this.setState({ textareaValue: e.nativeEvent.text })
    }

    loadProducts = async () => {
        const { searchValue } = this.props.route.params;
        this.setState({ refreshing: true });
        try {
            this.setState({ errorFetch: false })
            let newProductsFetch = await fetch(urlApi + '/products/search/' + searchValue);
            const products = await newProductsFetch.json();
            this.setState({ products, refreshing: false });
        } catch (e) {
            this.setState({ errorFetch: true, refreshing: false })
        }
    }

    noResult = () => {
        const { searchValue } = this.props.route.params;
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', height: height * 0.45 }}>
                <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
                    <View style={{ width: 100, height: 100, borderRadius: 1000, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome color="black" size={40} name="grav"></FontAwesome>
                    </View>
                    <Text style={{ fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 30 }}>"{searchValue}"</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10 }}>
                        Ups! Parece que ese artículo no se encuentra en nuestro catálogo.
                </Text>
                </View>
            </View>
        )
    }

    goToProduct = (item: any) => {
        this.props.navigation.push('Components', { screen: 'SingleProduct', params: { product: item } });
    }


    renderItem = (item: any, index: number) => {
        const { products } = this.state;
        return (
            <Card
                style={{
                    width: width / 2.3, marginTop: 10, height: 280, marginHorizontal: 10, borderWidth: 1, borderColor: 'rgba(200,200,200,.2)', backgroundColor: 'white',
                }}
                onPress={() => this.goToProduct(item)}>
                <View style={{ width: '100%', height: '70%', borderRadius: 10, borderBottomWidth: 0.4, borderBottomColor: 'rgba(200,200,200,.4)' }}>
                    <Image source={{ uri: JSON.parse(products[index].files)[0].path }} resizeMode="contain" style={{ width: '100%', height: '100%', borderRadius: 10 }}></Image>
                </View>
                <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, }}>{item.title}</Text>
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold' }}>$ {item.saleValue}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {[...Array(item.rating)].map((x, i) =>
                            <FontAwesome name="star" color="#F7D970"></FontAwesome>
                        )}
                    </View>
                </View>
            </Card>
        )
    }

    render() {
        const { searchValue } = this.props.route.params;
        const { errorFetch, products } = this.state;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.loadProducts.bind(this)}
                        tintColor={Colors.default.greyColor}
                    />
                }>
                {
                    errorFetch ?
                        <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Button appearance='outline' status="basic" size="small" onPress={() => this.loadProducts()}>Reintentar</Button>
                        </View>
                        :

                        products ?
                            products.length > 0 ?
                                <View>
                                    <View style={{paddingHorizontal: 10, paddingTop: 20, flexDirection: 'row'}}>
                                        <Text style={{fontWeight: 'bold'}}>{searchValue}</Text>
                                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 10, marginLeft: 5}}>({products.length} resultados)</Text>
                                    </View>
                                    <FlatList
                                        data={products}
                                        style={{ paddingTop: 5, paddingBottom: 10, minHeight: height }}
                                        horizontal={false}
                                        renderItem={({ item, index }) => this.renderItem(item, index)}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={2}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </View>
                                :
                                this.noResult()
                            :
                            <View><Spinner color="black" size={20}></Spinner></View>
                }
            </ScrollView>
        )
    }
}
