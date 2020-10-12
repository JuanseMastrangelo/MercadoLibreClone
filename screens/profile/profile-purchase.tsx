import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import ProfileHeader from './profile-header';

const { width } = Dimensions.get('window');


export default class ProfilePurchase extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Buscar'}));
    }
    
    render() {
        return (
            <View style={{marginVertical: 10}}>
                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#CCC', marginBottom: 10}}>Compras</Text>
                <View style={{backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10,
                shadowOffset: { width: 0, height: 2, }, shadowColor: "#000", shadowOpacity: 0.25,shadowRadius: 3.84}}>
                        
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                            style={{width: 30, height: 30, borderRadius: 10000, marginRight: 10}}
                            source={{uri: 'https://d500.epimg.net/cincodias/imagenes/2019/11/29/smartphones/1575040739_322747_1575040826_noticia_normal.jpg'}}></Image>
                            <View>
                                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15}}>IPHONE XR</Text>
                                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: '#ccc'}}>10/05/2020</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>$37.050</Text>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: Colors.default.yellow}}>En camino</Text>
                        </View>
                    </View>
                    <View style={{marginVertical: 5, backgroundColor: 'rgba(200,200,200,.4)', height: 1}}></View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                            style={{width: 30, height: 30, borderRadius: 10000, marginRight: 10}}
                            source={{uri: 'https://d500.epimg.net/cincodias/imagenes/2019/11/29/smartphones/1575040739_322747_1575040826_noticia_normal.jpg'}}></Image>
                            <View>
                                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15}}>IPHONE XR</Text>
                                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: '#ccc'}}>10/05/2020</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>$37.050</Text>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: 'green'}}>Entregado</Text>
                        </View>
                    </View>
                    <View style={{marginVertical: 5, backgroundColor: 'rgba(200,200,200,.4)', height: 1}}></View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                            style={{width: 30, height: 30, borderRadius: 10000, marginRight: 10}}
                            source={{uri: 'https://d500.epimg.net/cincodias/imagenes/2019/11/29/smartphones/1575040739_322747_1575040826_noticia_normal.jpg'}}></Image>
                            <View>
                                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15}}>IPHONE XR</Text>
                                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: '#ccc'}}>10/05/2020</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'flex-end'}}>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>$37.050</Text>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: 'green'}}>Entregado</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

  