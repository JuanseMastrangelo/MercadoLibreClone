import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import { Input } from '@ui-kitten/components';
import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class SearchBar extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            searchValue: ''
        }
    }
    
    goToCart() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Carro'}));
    }


    renderIcon = () => (
        <TouchableWithoutFeedback>
            <FontAwesome name="search" color="#ccc"></FontAwesome>
        </TouchableWithoutFeedback>
    );

    render() {
        const { searchValue } = this.state;
        return (
            <View style={[{width: '73%', alignSelf: 'center'}, this.props.style]}>
                <Input
                    value={searchValue}
                    size='small'
                    status='basic'
                    style={{backgroundColor: '#fff', borderRadius: 100, shadowOffset: { width: 2, height: 4, }, shadowColor: "rgba(200,200,200,.5)", shadowOpacity: 0.09, shadowRadius: 2, borderWidth: 0}}
                    placeholder='Buscar productos...'
                    accessoryLeft={this.renderIcon}
                    onChangeText={searchValue => this.setState({searchValue})}
                />
            </View>
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