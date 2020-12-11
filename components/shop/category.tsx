import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import { Spinner } from 'native-base';
import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

export class CategoryComponent extends React.Component<any> {

    constructor(props: any) {
        super(props)
    }

    goToProduct = (item: any) => {
        this.props.navigation.push('Components', { screen: 'SingleProduct', params: { product: item } });
    }

    renderItem = (item: any, index: number) => {
        return(
            <TouchableOpacity style={{width: 150, height: 280, marginRight: 20, borderWidth: 1, borderColor: 'rgba(200,200,200,.2)', backgroundColor: 'white'}} onPress={() => this.goToProduct(item)}>
                <Image resizeMode="contain" source={{uri: JSON.parse(this.props.data[index].files)[0].path}} style={{width: '100%', height: '70%'}}></Image>
                <View style={{marginTop: 10, paddingHorizontal: 10}}>
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 10, }}>{item.title}</Text>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold'}}>$ {item.saleValue}</Text>
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
        return (
            <View style={{marginVertical: 20}}>
                {
                    this.props.data ?
                    <View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                            <Text style={{fontSize: 20, fontFamily: 'Poppins-Medium'}}>{this.props.title}</Text>
                            <TouchableOpacity>
                                {/* <Text>Ver todas</Text> */}
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={this.props.data}
                            horizontal={true}
                            style={{marginTop: 10, paddingLeft: 20}}
                            renderItem={({item, index}) => this.renderItem(item, index)}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    :
                    <View><Spinner color="black" size={20}></Spinner></View>
                }
            </View>
        )
    }
}

