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
    


    renderIcon = () => (
        <TouchableWithoutFeedback>
            <FontAwesome name="search" color="#ccc" style={{fontSize: 14, paddingHorizontal: 5}}></FontAwesome>
        </TouchableWithoutFeedback>
    );

    search = () => {
        const { searchValue } = this.state;
        this.props.navigation.push('Components', { screen: 'SearchScreen', params: {searchValue} });
    }

    render() {
        const { searchValue } = this.state;
        return (
            <View style={[{width: '83%', alignSelf: 'center'}, this.props.style]}>
                <Input
                    value={searchValue}
                    size='small'
                    status='basic'
                    onSubmitEditing={this.search}
                    style={{backgroundColor: '#fff', borderRadius: 100,
                    elevation: 1}}
                    placeholder='Buscar en AccTecno'
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