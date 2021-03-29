import * as React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

import * as Notifications from 'expo-notifications';
import { Toast } from 'native-base';
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export class MessageIcon extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            countMessages: this.props.state.messages.count
        }
    }
    
    goToChat() {
        this.props.navigation.push('Components', { screen: 'ChatRoomsScreen' });
    }


    sendNotification() {
        const { countMessages } = this.state;
        if (+countMessages < +this.props.state.messages.count) {
            // this.schedulePushNotification();
            Toast.show({
                text: 'Nuevo mensaje sin leer',
                buttonText: 'Ver',
                duration: 3000,
                position: 'bottom',
                buttonStyle: { backgroundColor: "#5cb85c" },
                onClose: (reason) => { if (reason == 'user') {this.goToChat();} }
            })
            this.setState({ countMessages: this.props.state.messages.count });
        }
    }


    schedulePushNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Tienes mensajes nuevos",
                body: this.props.state.messages.count + ' mensajes nuevos en el inicio',
                // data: { data: 'goes here' },
            },
            trigger: null,
        });
    }


    render() {
        this.sendNotification();
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
  