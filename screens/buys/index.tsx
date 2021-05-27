import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Spinner } from 'native-base';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { urlApi } from '../../constants/KeyConfig';

const { width, height } = Dimensions.get('window');


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
        this.props.navigation.push('Components', { screen: 'ColumnGridView', params: {title: item.name, showTitleBar: false, categorie: item} });
    }
    
    loadCategories = async() => {
        let categoriesFetch = await fetch(urlApi + '/categories');
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
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, height, paddingHorizontal: 10 }}>

                    {/* <View style={{ marginVertical: 10, paddingHorizontal: 10, width, height: 80 }}>
                        <View style={{ width: '100%', borderRadius: 10, height: '100%' }}>
                            <Image style={{ width: '100%', borderRadius: 10, height: '100%', position: 'relative' }} source={require('../../assets/images/bg_banner.png')}></Image>
                            <View style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>40% off en Samsung</Text>
                            </View>
                        </View>
                    </View> */}

                    <Text style={{fontSize: 20, fontFamily: 'Poppins-Light', fontWeight: 'bold', color: '#222', marginTop: 15, letterSpacing: .5}}>Categorías</Text>


                    <View style={{ width: '100%', backgroundColor: '#FFF', justifyContent: 'center', borderRadius: 10, marginTop: 10 }}>
                        {
                            categories ?
                            categories.map((item: any, index: number) => {
                                return (
                                    <TouchableOpacity style={{ padding: 20, justifyContent: 'center', borderBottomWidth: .5, borderColor: '#ddd' }}
                                        onPress={() => this.viewCategorie(item)}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Light', letterSpacing: .5 }}>{item.name}</Text>
                                            <FontAwesome name="angle-right" style={{fontSize: 25, color: '#777'}}></FontAwesome>
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

