import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileHeader from './profile-header';
import ProfileOptions from './profile-options';
import ProfilePurchase from './profile-purchase';


export default class Profile extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
    }


    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Buscar'}));
    }
    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{paddingHorizontal: 20, backgroundColor: '#F9F9F9', paddingTop: 20}}>
                <ProfileHeader></ProfileHeader>
                {/* <ProfileLevel></ProfileLevel> */}
                <ProfilePurchase></ProfilePurchase>
                <ProfileOptions navigation={this.props.navigation}></ProfileOptions>
            </ScrollView>
        )
    }
}

  