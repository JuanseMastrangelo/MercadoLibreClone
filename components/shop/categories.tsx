import { StackActions } from '@react-navigation/native';
import { Spinner } from 'native-base';
import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { Button } from '@ui-kitten/components';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { urlApi } from '../../constants/KeyConfig';

import { Categories, ProductBestSellers } from '../../demoData';
import Colors from '../../constants/Colors';

export class CategoriesComponent extends React.Component<any, any> {
    
    constructor(props: any) {
        super(props)
        this.state = {
            categories: null,
            newProducts: null,
            errorFetch: true
        }
    }

    componentDidMount() {
        this.loadCategories();
    }

    loadCategories = async() => {
        try {
            this.setState({errorFetch: false})
            let categoriesFetch = await fetch(urlApi + '/categories');
            const categories = await categoriesFetch.json();
            this.setState({categories});
        } catch (error) {
            this.setState({errorFetch: true})
        }
    }

    renderItem = (item: any, index: number) => {
        return(
            <TouchableOpacity onPress={() => this.viewCategorie(item)} style={{width: 80, height: 100, marginRight: 10}}>
                <View style={{width: 60, height: 60, borderRadius: 1000, backgroundColor: '#fff', 
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                
                elevation: 6,
            alignSelf: 'center'}}>
                    <View style={{padding: 15, borderRadius: 1000}}>
                        <Image style={{width: '100%', height: '100%'}} resizeMode="cover" source={{uri: JSON.parse(this.state.categories[index].files)[0].path}}></Image>
                    </View>
                </View>
                {<Text style={{textAlign: 'center', fontSize: 9, marginTop: 5, color: '#555', fontFamily: 'Helvetica', textTransform: 'capitalize'}}>{item.name}</Text>}
            </TouchableOpacity>
        )
    }

    viewCategorie = (item:any) => {
        this.props.navigation.push('Components', { screen: 'ColumnGridView', params: {title: item.name, showTitleBar: false, categorie: item} });
    }

    goToCategories() {
        this.props.navigation.dispatch(StackActions.replace('Root', { screen: 'Buscar' }));
    }
    
    render() {
        const {categories, errorFetch} = this.state;
        return (
            <View style={{marginVertical: 10}}>
                {/* <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontFamily: 'Poppins-Medium'}}>Categorias</Text>
                    <TouchableOpacity onPress={() => this.goToCategories()}>
                        <Text>Ver todas</Text>
                    </TouchableOpacity>
                </View> */}
                {
                    categories ? 
                    <FlatList
                        data={categories}
                        horizontal={true}
                        style={{marginTop: 10, paddingLeft: 20}}
                        renderItem={({item, index}) => this.renderItem(item, index)}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    />
                    :
                    !errorFetch &&
                    <View><Spinner color="black" size={20}></Spinner></View>
                }
                {
                    errorFetch && 
                    <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
                        <Button appearance='outline' status="basic" size="small" onPress={() => this.loadCategories()}>Reintentar</Button>
                    </View>
                }
            </View>
        )
    }
}

