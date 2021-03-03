import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

export class MessageIcon extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }
    
    goToChat() {
        this.props.navigation.push('Components', { screen: 'Chat' });
    }


    render() {
        return (
            <TouchableOpacity style={{ alignSelf: 'center', height: '100%', marginBottom: 10, marginLeft: 10, alignItems: 'flex-end'}}
            onPress={() => this.goToChat()}>
                <Image
                    source={{uri: 'https://cdn.iconscout.com/icon/free/png-256/message-672-675248.png'}}
                    fadeDuration={0}
                    style={[styles.iconBag, this.props.style]}
                />
                <View style={[styles.badge, this.props.styleBadge]}>
                    <Text style={{ color: '#FFF' }}>{this.props.state.messages.count}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    iconBag: {
        width: 25,
        height: 21,
        marginRight: 10
    },
    badge: {
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10000,
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
  
export default connect(mapStateToProps)(MessageIcon)
  