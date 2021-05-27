import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

class CartIcon extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }
    
    goToCart() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Carro'}));
    }


    render() {
        return (
            <TouchableOpacity style={{ alignSelf: 'center', height: '100%', marginBottom: 10, alignItems: 'flex-end'}}
            onPress={() => this.goToCart()}>
                <View style={[styles.iconBag, this.props.style]}>
                    <AutoHeightImage
                        width={30}
                        source={{uri: 'https://www.iconpacks.net/icons/2/free-shopping-cart-icon-3047-thumb.png'}}
                    />
                </View>

                {
                    this.props.state.cart.items.length > 0 &&
                    <View style={[styles.badge, this.props.styleBadge]}>
                        <Text style={{ color: '#FFF', fontSize: 10, fontFamily: 'Poppins-SemiBold', marginTop: 3}}>{this.props.state.cart.items.length}</Text>
                    </View>
                }
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    iconBag: {
        marginRight: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        backgroundColor: 'red',
        width: 15,
        height: 15,
        borderRadius: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 0
    }
})


function mapStateToProps(state: any) {
    return {state}
  }
  
export default connect(mapStateToProps)(CartIcon)
  