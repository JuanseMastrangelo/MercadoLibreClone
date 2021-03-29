import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import { Dimensions, Image, Platform, RefreshControl } from 'react-native';
import { authKey, firebaseConfig, supportId } from '../../constants/KeyConfig';

const { height, width } = Dimensions.get('window');
import * as firebase from 'firebase';
import { Text, View } from 'native-base';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from '@ui-kitten/components';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}




export default class ChatRoomsScreen extends React.Component<any, any> {


    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            user: null,
            sellers: null
        }
    }

    componentDidMount() {
        this.getUser();
    }

    getUser = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        const user = JSON.parse(userData!);
        this.setState({ user });
        this.getSellers();
        this.listenChangesChat();
    }

    getSellers = async () => {
        const { user } = this.state;
        this.setState({refreshing: true});
        try {
            firebase.database().ref("sellers").on("value", async (allSellers) => {
                let sellers: any = [];
                allSellers.forEach((snap) => {
                    let countNotReading = 0;
                    const seller = snap.val();
                    seller['key'] = snap.key;

                    firebase.database().ref("chats").orderByChild("to").equalTo(user.id).on("value", async (allChatsOfSeller: any) => {
                        allChatsOfSeller.forEach((s: any) => {
                            if (!s.val().visto && (s.val().uid == seller['UID'])) {
                                countNotReading++;
                            }
                        });
                        seller['countNotReading'] = countNotReading;
                        sellers.push(seller);
                    })

                });

                this.setState({ sellers, refreshing: false });
            });
        } catch (error) {
            console.log(error);
        }
    }

    listenChangesChat() {
        firebase.database().ref("chats").on("value", async (allChatsOfSeller: any) => {
            this.getSellers();
        })
    }

    sendMessage = (seller: any) => {
        this.props.navigation.push('Components', { screen: 'Chat', params: {seller} });
    }

    renderItem = (seller: any, index: number) => {
        return (
            <TouchableOpacity
                style={{
                    width: '100%', borderWidth: 1, borderColor: 'rgba(200,200,200,.2)', backgroundColor: '#FBFBFB',
                    flexDirection: 'row', padding: 10
                }} onPress={() => this.sendMessage(seller)}>
                <View style={{ width: 50, borderRadius: 1000, backgroundColor: '#fff', height: 50}}>
                    <Image source={{ uri: 'https://aaahockey.org/wp-content/uploads/2017/06/default-avatar.png' }} resizeMode="contain" style={{ width: '100%', height: 50, borderRadius: 1000 }}></Image>
                </View>
            
                <View style={{ paddingHorizontal: 20, width: '100%' }}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17, }}>{seller.NombreCompleto}</Text>
                        {
                            seller.countNotReading > 0 ?
                            <View style={{borderRadius: 10000, backgroundColor: 'red', minWidth: 20, minHeight: 20,
                                justifyContent: 'center', alignItems: 'center', marginLeft: 5}}>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: 'white'}}>{seller.countNotReading}</Text>
                            </View>
                            : null
                        }
                    </View>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 9, fontWeight: 'bold' }}>{seller.Correo}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {[...Array(5)].map((x, i) =>
                            <FontAwesome name="star" style={{marginLeft: 2}} color="#F7D970"></FontAwesome>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { sellers } = this.state;
        return (
            <View>
                <FlatList
                    refreshControl={
                        <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.getSellers.bind(this)}
                        tintColor={Colors.default.greyColor}
                        />
                    }
                    data={sellers}
                    style={{ width, height }}
                    horizontal={false}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }
}
