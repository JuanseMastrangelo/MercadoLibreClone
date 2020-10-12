import { FontAwesome } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import * as React from 'react';
import { AsyncStorage, Dimensions, Image, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { authKey } from '../../constants/KeyConfig';

const { width } = Dimensions.get('window');


export default class ProfileHeader extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
            userData: null
        }

        this.getUserData();
    }

    getUserData = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        this.setState({userData: JSON.parse(userData!)})
    }

    goToShopping() {
        this.props.navigation.dispatch(StackActions.replace('Root', {screen: 'Buscar'}));
    }
    
    render() {
        const { userData } = this.state;
        console.log(userData)
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                    style={{width: 50, height: 50, borderRadius: 10000, marginRight: 10}}
                    source={{uri: (userData ? userData.picture : 'https://innostudio.de/fileuploader/images/default-avatar.png')}}></Image>
                    <View>
                        <Text style={{fontFamily: 'Poppins-SemiBold', fontSize: 15}}>{userData && userData.name}</Text>
                        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 12}}>{userData && userData.email}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="cog" style={{fontSize: 15, color: '#ccc'}}></FontAwesome>
                </TouchableOpacity>
            </View>
        )
    }
}

  