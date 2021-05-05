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

const { width } = Dimensions.get('window');




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


    loadNewsProducts = async() => {
        try {
            this.setState({errorFetch: false})
            let newProductsFetch = await fetch(urlApi + '/products/news');
            const newProducts = await newProductsFetch.json();
            this.setState({newProducts: newProducts.data});
            this.props.setHomeStep(true);
        } catch (e) {
            this.setState({errorFetch: true})
        }
    }
    

    render() {
        const { newProducts, errorFetch } = this.state
        return (
            <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Carousel data={SlideImages} />
                    <CategoriesComponent navigation={this.props.navigation} ></CategoriesComponent>
                    {
                        errorFetch ?
                        <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                            <Button appearance='outline' status="basic" size="small" onPress={() => this.loadNewsProducts()}>Reintentar</Button>
                        </View>
                        :
                        <CategoryComponent navigation={this.props.navigation} title="Más recientes" data={newProducts}></CategoryComponent>
                    }
                    <Image source={{ uri: Coupon }} resizeMode="contain" style={{ width, height: 140, marginVertical: 40 }}></Image>
                    {
                        errorFetch ?
                        <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
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

