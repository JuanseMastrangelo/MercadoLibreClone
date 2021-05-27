import * as React from 'react';
import { Dimensions, Image, View } from 'react-native';

import Carousel from './Slideshow/Main';


import { connect } from 'react-redux';
import { actionCreators as actionsSteps } from '../../utils/actions/steps';


import { CategoriesComponent } from '../../components/shop/categories';
import { ScrollView } from 'react-native-gesture-handler';

import { SlideImages, Coupon } from '../../demoData';
import { CategoryComponent } from '../../components/shop/category';
import { urlApi } from '../../constants/KeyConfig';
import { bindActionCreators } from 'redux';
import { Button } from '@ui-kitten/components';
import SearchBar from '../../navigation/searchBar';
import Colors from '../../constants/Colors';
import CartIcon from '../../navigation/cartIcon';
import MessageIcon from '../../navigation/messageIcon';
import { LinearGradient } from "expo-linear-gradient";
import { Card, Text } from 'native-base';
import AutoHeightImage from 'react-native-auto-height-image';

const { width, height } = Dimensions.get('window');




export class Home extends React.Component<any, any> {
    notificationListener: any = null;
    responseListener: any = null;

    constructor(props: any) {
        super(props)
        this.state = {
            newProducts: null,
            errorFetch: false,
            countMessagesNotSee: 0
        }
    }

    componentDidMount() {
        this.loadNewsProducts();
    }


    loadNewsProducts = async () => {
        try {
            this.setState({ errorFetch: false })
            let newProductsFetch = await fetch(urlApi + '/products/news');
            const newProducts = await newProductsFetch.json();
            this.setState({ newProducts: newProducts.data });
            this.props.setHomeStep(true);
        } catch (e) {
            this.setState({ errorFetch: true })
        }
    }


    render() {
        const { newProducts, errorFetch } = this.state;
        return (
            <View>
                <View style={{
                    width, paddingTop: 28, height: 90, flexDirection: 'row',
                    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#F2DA00'
                }}>
                    <SearchBar navigation={this.props.navigation} style={{ marginRight: 20 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <CartIcon navigation={this.props.navigation} style={{ marginTop: 20 }} />
                        {/* {<MessageIcon navigation={this.props.navigation} style={{marginTop: 20}} />} */}
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[Colors.default.primaryColor, '#FFF']}
                        style={{ width, height: height * .30, position: 'absolute', top: 0, left: 0 }}
                    ></LinearGradient>

                    <Carousel data={SlideImages} />
                    <CategoriesComponent navigation={this.props.navigation} ></CategoriesComponent>
                    {
                        errorFetch ?
                            <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <Button appearance='outline' status="basic" size="small" onPress={() => this.loadNewsProducts()}>Reintentar</Button>
                            </View>
                            :
                            <CategoryComponent navigation={this.props.navigation} title="Más recientes" data={newProducts}></CategoryComponent>
                    }


                    <View style={{width: width*0.9, alignSelf: 'center', elevation: 6, marginVertical: 40, backgroundColor: '#FFF'}}>
                        <Text style={{fontSize: 17, fontFamily: 'Poppins-Medium'}}>{this.props.title}</Text>
                        <AutoHeightImage
                            width={width*0.9}
                            source={{ uri: Coupon }}
                        />
                    </View>
                    
                    {
                        errorFetch ?
                            <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <Button appearance='outline' status="basic" size="small" onPress={() => this.loadNewsProducts()}>Reintentar</Button>
                            </View>
                            :
                            <CategoryComponent navigation={this.props.navigation} title="Más vendidos en la semana" data={newProducts}></CategoryComponent>
                    }
                </ScrollView>
            </View>
        )
    }

    componentWillUnmount() {
        this.props.setHomeStep(false);
    }
}


function mapDispatchToProps(dispatch: any) {
    return {
        setHomeStep: bindActionCreators(actionsSteps.homeStep, dispatch),
    }
}

function mapStateToProps(state: any) {
    return { state }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

