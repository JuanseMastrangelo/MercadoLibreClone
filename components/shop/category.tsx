import { FontAwesome } from '@expo/vector-icons';
import { Spinner } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
export class CategoryComponent extends React.Component<any> {

    constructor(props: any) {
        super(props)
    }

    goToProduct = (item: any) => {
        this.props.navigation.push('Components', { screen: 'SingleProduct', params: { product: item } });
    }

    renderItem = (item: any, index: number) => {
        return(
            <Card style={{width: 150, height: 280, marginRight: 10, borderWidth: 1, shadowColor: 'transparent', borderColor: 'rgba(200,200,200,.2)', backgroundColor: 'white'}} onPress={() => this.goToProduct(item)}>
                {<Image resizeMode="contain" source={{uri: JSON.parse(this.props.data[index].files)[0].path}} style={{width: '100%', height: '70%'}}></Image>}
                <View style={{marginTop: 10, paddingHorizontal: 10}}>
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 10, }}>{item.title}</Text>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15, fontWeight: 'bold'}}>$ {item.saleValue}</Text>
                    <View style={{flexDirection: 'row'}}>
                    {[...Array(item.rating)].map((x, i) =>
                        <FontAwesome name="star" color="#F7D970"></FontAwesome>
                    )}
                    </View>
                </View>
            </Card>
        )
    }

    render() {
        return (
            <Card style={{marginVertical: 0, width: width*0.9, alignSelf: 'center'}}>
                    <View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                            <Text style={{fontSize: 17, fontFamily: 'Poppins-Medium'}}>{this.props.title}</Text>
                            <TouchableOpacity>
                                {/* <Text>Ver todas</Text> */}
                            </TouchableOpacity>
                        </View>
                {
                    this.props.data &&
                        <FlatList
                            data={this.props.data}
                            horizontal={true}
                            style={{paddingLeft: 20, width, paddingBottom: 10}}
                            renderItem={({item, index}) => this.renderItem(item, index)}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                }
                    </View>
                {
                    !this.props.data &&
                    <View><Spinner color="black" size={20}></Spinner></View>
                }
            </Card>
        )
    }
}

