import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { Categories, ProductBestSellers } from '../../demoData';
import { reducers } from '../../utils/reducers';

export class CategoriesComponent extends React.Component<any> {


    renderItem = ({item}: any) => {
        return(
            <TouchableOpacity onPress={() => this.viewCategorie(item)} style={{width: 110, height: 130, marginRight: 20}}>
                <Image source={{uri: item.image}} style={{width: '100%', height: '80%', borderRadius: 10}}></Image>
                <Text style={{fontFamily: 'Poppins-Medium', textAlign: 'center', fontSize: 13, marginTop: 10}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    viewCategorie = (item:any) => {
        this.props.navigation.navigate('GridView', {name: item.name, data: ProductBestSellers});
    }
    
    render() {
        return (
            <View style={{marginVertical: 20}}>
                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20}}>
                    <Text style={{fontSize: 20, fontFamily: 'Poppins-Medium'}}>Categorias</Text>
                    <TouchableOpacity>
                        <Text>Ver todas</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={Categories}
                    horizontal={true}
                    style={{marginTop: 10, paddingLeft: 20}}
                    renderItem={(item) => this.renderItem(item)}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }
}

