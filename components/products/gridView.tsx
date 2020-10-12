import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { reducers } from '../../utils/reducers';
const { width } = Dimensions.get('window');

export class GridViewComponent extends React.Component<any> {

    constructor(props: any) {
        super(props)
        this.props.navigation.setOptions(this.props.route.params.name)
    }

    goToProduct = (item: any) => {
        this.props.navigation.navigate('SingleProduct', item);
    }

    renderItem = ({item}: any) => {
        return(
            <TouchableOpacity
                style={{width: 150, height: 280, marginRight: 20, borderWidth: 1, borderColor: 'rgba(200,200,200,.2)'}} onPress={() => this.goToProduct(item)}>
                <Image source={{uri: item.image}} style={{width: '100%', height: '70%', borderRadius: 10}}></Image>
                <View style={{marginTop: 10, paddingHorizontal: 10}}>
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 10, }}>{item.title}</Text>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold'}}>$ {item.pricing}</Text>
                    <View style={{flexDirection: 'row'}}>
                    {[...Array(item.rating)].map((x, i) =>
                        <FontAwesome name="star" color="#F7D970"></FontAwesome>
                    )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const {data, name} = this.props.route.params
        return (
            <View style={{marginVertical: 100}}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontFamily: 'Poppins-Medium'}}>{name}</Text>
                    <TouchableOpacity>
                        <Text>Ver todas</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={data}
                    horizontal={false}
                    renderItem={(item) => this.renderItem(item)}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }
}

