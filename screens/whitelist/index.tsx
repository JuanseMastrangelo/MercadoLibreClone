import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');


export default class WhiteList extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Buscar'}));
    }
    
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{marginTop: 50}} scrollEnabled={false}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{alignItems: 'center', paddingHorizontal: 50}}>
                        <View style={{width: 100, height: 100, borderRadius: 1000, backgroundColor: 'rgba(200,200,200,.4)', justifyContent: 'center', alignItems: 'center'}}>
                            <FontAwesome color="red" size={40} name="heart-o"></FontAwesome>
                        </View>
                        <Text style={{fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 30}}>WhiteList vacio</Text>
                        <Text style={{fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10}}>
                            Agrega productos a favoritos para que aparezcan en esta area
                        </Text>

                        <TouchableOpacity style={{marginTop: 60, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10}} onPress={() => this.goToShopping()}>
                            <Text style={{fontSize: 14, fontFamily: 'Poppins-Regular', fontWeight: 'bold'}}>Ir de compras</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

  