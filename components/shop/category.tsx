import { FontAwesome } from '@expo/vector-icons';
import { Spinner } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Card } from 'react-native-ui-lib';
import Colors from '../../constants/Colors';

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
            <TouchableWithoutFeedback
                style={{ width: width / 2.3, marginTop: 10,
                    height: 300, marginHorizontal: 10, borderRadius: 5, backgroundColor: 'white', padding: 10,
                borderWidth: .8, borderColor: '#ddd' }}
                onPress={() => this.goToProduct(item)}>
                <View style={{ width: '100%', height: '50%', borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomWidth: 1,
                borderColor: '#ccc' }}>
                    <Image resizeMode="contain" source={{ uri: JSON.parse(this.props.data[index].files)[0].path }}
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

    render() {
        return (
            <Card style={{marginVertical: 0, width: width*0.9, alignSelf: 'center', elevation: 6}}>
                    <View style={{paddingVertical: 10}}>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
                        paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#eee'}}>
                            <Text style={{fontSize: 17, fontFamily: 'Poppins-Medium', letterSpacing: .5 }}>{this.props.title}</Text>
                            <TouchableOpacity>
                                {/* <Text>Ver todas</Text> */}
                            </TouchableOpacity>
                        </View>
                        <View style={{marginVertical: 20}}>
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
                    </View>
                {
                    !this.props.data &&
                    <View><Spinner color="black" size={20}></Spinner></View>
                }
            </Card>
        )
    }
}

