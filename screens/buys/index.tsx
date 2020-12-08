import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Input } from '@ui-kitten/components';
import { Spinner } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { Categories } from '../../demoData';

const { width } = Dimensions.get('window');

import { ProductBestSellers } from '../../demoData';

export default class Buys extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            searchValue: '',
            categories: null
        }
    }

    
    componentDidMount() {
        this.loadCategories();
    }

    viewCategorie = (item: any) => {
        this.props.navigation.navigate('ColumnGridView', { title: item.name, data: ProductBestSellers, showTitleBar: false, categorie: item });
    }
    
    loadCategories = async() => {
        let categoriesFetch = await fetch('https://softwareargentina.store/api/categories');
        const categories = await categoriesFetch.json();
        this.setState({categories});
    }

    render() {
        const { searchValue, categories } = this.state;

        const renderIcon = (props: any) => (
            <FontAwesome name="search" size={18}></FontAwesome>
        );
        return (
            <View>
                <View
                    style={{
                        transform: [{ rotate: '-40deg' }], backgroundColor: Colors.default.yellow, width: 200, height: 100, position: 'absolute',
                        top: -40, left: -70
                    }}></View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 50 }}>
                    <View style={{ width, paddingHorizontal: 20 }}>
                        <Input
                            value={searchValue}
                            placeholder='Buscar producto...'
                            accessoryRight={renderIcon}
                            onChangeText={value => this.setState({ searchValue: value })}
                        />
                    </View>

                    <View style={{ marginVertical: 10, paddingHorizontal: 20, width, height: 80 }}>
                        <View style={{ width: '100%', borderRadius: 10, height: '100%' }}>
                            <Image style={{ width: '100%', borderRadius: 10, height: '100%', position: 'relative' }} source={require('../../assets/images/bg_banner.png')}></Image>
                            <View style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>40% off en Samsung</Text>
                            </View>
                        </View>
                    </View>


                    <View style={{ paddingHorizontal: 20, width }}>
                        {
                            categories ?
                            categories.map((item: any, index: number) => {
                                return (
                                    <TouchableOpacity style={{ marginVertical: 10, paddingHorizontal: 20, height: 80, backgroundColor: 'rgba(200,200,200,.4)', justifyContent: 'center', borderRadius: 10 }}
                                        onPress={() => this.viewCategorie(item)}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image style={{ width: 50, height: 50, borderRadius: 1000 }} source={{ uri: JSON.parse(categories[index].files)[0].path }}></Image>
                                                <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold', marginLeft: 10 }}>{item.name}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: 'rgba(200,200,200,.4)', borderRadius: 5, marginRight: 10, paddingHorizontal: 10 }}>
                                                    <Text style={{ fontSize: 13, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>{item.count}</Text>
                                                </View>
                                                <Ionicons size={25} name="md-arrow-dropright" style={{ marginRight: 8 }}></Ionicons>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                            :
                            <View><Spinner color="black" size={20}></Spinner></View>
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

