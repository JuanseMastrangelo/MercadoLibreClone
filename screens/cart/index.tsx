import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');


export default class Cart extends React.Component<any, any> {

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
                            <Image
                                source={{uri: 'https://i.pinimg.com/originals/09/88/dc/0988dc27ab24d196b91d085c786c292d.png'}}
                                fadeDuration={0}
                                style={{width: 40, height: 40}}
                            />
                        </View>
                        <Text style={{fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 30, textAlign: 'center'}}>Carro de compras vacio</Text>
                        <Text style={{fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10}}>
                            Agrega productos al carro de compras para que aparezcan en esta area
                        </Text>

                        <TouchableOpacity style={{marginTop: 60, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10}} onPress={() => this.goToShopping()}>
                            <Text style={{fontSize: 14, fontFamily: 'Poppins-Regular', fontWeight: 'bold'}}>Comprar ahora!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

  