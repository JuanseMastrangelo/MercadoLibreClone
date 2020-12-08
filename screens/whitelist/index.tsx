import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');


export default class WhiteList extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
    }

    goToCategories() {
        this.props.navigation.dispatch(StackActions.replace('Root', { screen: 'Buscar' }));
    }

    render() {
        return (
            <View style={{ marginTop: 40 }}>
                <View style={{
                    transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 200, height: 250, position: 'absolute',
                    top: -40, left: -120, borderBottomEndRadius: 100, borderTopEndRadius: 100
                }}></View>
                <View style={{
                    transform: [{ rotate: '40deg' }], backgroundColor: Colors.default.yellowLight, width: 130, height: 230, position: 'absolute',
                    bottom: 40, right: -30, borderRadius: 100
                }}></View>
                <View
                    style={{
                        transform: [{ rotate: '-40deg' }], backgroundColor: '#F1F7FC', width: 200, height: 100, position: 'absolute',
                        bottom: -20, left: -70
                    }}></View>
                <Text style={{ color: 'black', fontSize: 30, fontFamily: 'Poppins-SemiBold', width: '90%', alignSelf: 'center' }}>Favoritos</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={{ height: height * 0.75 }} scrollEnabled={false}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: height * 0.75 }}>
                        <View style={{ alignItems: 'center', paddingHorizontal: 50 }}>
                            <View style={{ width: 100, height: 100, borderRadius: 1000, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                <FontAwesome color="red" size={40} name="heart-o"></FontAwesome>
                            </View>
                            <Text style={{ fontSize: 25, fontFamily: 'Poppins-Regular', fontWeight: 'bold', marginTop: 30 }}>WhiteList vacio</Text>
                            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor, marginTop: 10 }}>
                                Agrega productos a favoritos para que aparezcan en esta area
                        </Text>

                            <TouchableOpacity style={{ marginTop: 60, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => this.goToCategories()}>
                                <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', fontWeight: 'bold' }}>Ir de compras</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

