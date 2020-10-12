import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import ProfileHeader from './profile-header';

const { width } = Dimensions.get('window');


export default class ProfileLevel extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Buscar'}));
    }
    
    render() {
        return (
            <View style={{marginVertical: 20}}>
                <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#CCC', marginBottom: 10}}>Bonus</Text>
                <View style={{backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 20,
                shadowOffset: { width: 0, height: 2, }, shadowColor: "#000", shadowOpacity: 0.25,shadowRadius: 3.84}}>
                        
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FontAwesome name="star" style={{fontSize: 15, color: Colors.default.yellow}}></FontAwesome>
                            <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 12, marginLeft: 5}}>Nivel 1</Text>
                            <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12, color: '#CCC', marginLeft: 10}}>14%</Text>
                        </View>
                        <View>
                            <Text style={{color: '#CCC', fontFamily: 'Poppins-Regular', fontSize: 12}}>323/21002 puntos</Text>
                        </View>
                    </View>
                    <View style={{height: 5, flexDirection: 'row'}}>
                        <View style={{width: '14%', backgroundColor: Colors.default.yellow, height: '100%'}}></View>
                        <View style={{width: '86%', backgroundColor: '#ccc', height: '100%'}}></View>
                    </View>
                </View>
            </View>
        )
    }
}

  