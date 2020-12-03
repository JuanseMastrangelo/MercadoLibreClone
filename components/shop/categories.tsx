import { Spinner } from 'native-base';
import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { Categories, ProductBestSellers } from '../../demoData';

export class CategoriesComponent extends React.Component<any, any> {
    
    constructor(props: any) {
        super(props)
        this.state = {
            categories: null,
        }
    }

    componentDidMount() {
        this.loadCategories();
    }

    loadCategories = async() => {
        let categoriesFetch = await fetch('https://softwareargentina.store/api/categories');
        const categories = await categoriesFetch.json();
        this.setState({categories});
    }

    renderItem = (item: any, index: number) => {
        return(
            <TouchableOpacity onPress={() => this.viewCategorie(item)} style={{width: 110, height: 130, marginRight: 20}}>
                <Image source={{uri: JSON.parse(this.state.categories[index].files)[0].path}} style={{width: '100%', height: '80%', borderRadius: 10}}></Image>
                <Text style={{fontFamily: 'Poppins-Medium', textAlign: 'center', fontSize: 13, marginTop: 10}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    viewCategorie = (item:any) => {
        this.props.navigation.navigate('ColumnGridView', {title: item.name, data: ProductBestSellers, showTitleBar: false, categorie: item });
    }
    
    render() {
        const {categories} = this.state;
        return (
            <View style={{marginVertical: 20}}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontFamily: 'Poppins-Medium'}}>Categorias</Text>
                    <TouchableOpacity>
                        <Text>Ver todas</Text>
                    </TouchableOpacity>
                </View>
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
                    <View><Spinner></Spinner></View>
                }
            </View>
        )
    }
}

