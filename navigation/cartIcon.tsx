import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

export class CartIcon extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }
    
    goToCart() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Carro'}));
    }


    render() {
        return (
            <TouchableOpacity style={{ marginRight: 10, alignSelf: 'center',height: '100%', marginBottom: 10, width: 100, alignItems: 'flex-end' }}
            onPress={() => this.goToCart()}>
                <Image
                    source={{uri: 'https://i.pinimg.com/originals/09/88/dc/0988dc27ab24d196b91d085c786c292d.png'}}
                    fadeDuration={0}
                    style={[styles.iconBag, this.props.style]}
                />
                
                <View style={{ backgroundColor: 'red', width: 20, height: 20, borderRadius: 10000, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 20, right: 10 }}>
                    <Text style={{ color: '#FFF' }}>{this.props.state.cart.items.length}</Text>
                </View>
            </TouchableOpacity>
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
  
export default connect(mapStateToProps)(CartIcon)
  