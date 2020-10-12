import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';
import Colors from '../constants/Colors';

export class ItemsOnWhiteList extends React.Component<any> {
    render() {
        return (
            <Text style={{fontSize: 12, fontFamily: 'Poppins-Medium', fontWeight: 'bold', textAlign: 'center', color: Colors.default.greyColor}}>0 items</Text>
        )
    }
}
const styles = StyleSheet.create({
    iconBag: {
        width: 21,
        height: 21,
        marginRight: 20
    },
})


function mapStateToProps(state: any) {
    return {state}
  }
  
export default connect(mapStateToProps)(ItemsOnWhiteList)
  