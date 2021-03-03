import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import Constants from 'expo-constants';
import { Dimensions, Image, Platform } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { authKey, firebaseConfig, supportId } from '../../constants/KeyConfig';

const { height, width } = Dimensions.get('window');
import * as firebase from 'firebase';
import { Input, Spinner } from '@ui-kitten/components';
import { Text, View } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

import MessageSreen from './message';




export default class ChatScreen extends React.Component<any, any> {
    httpService: any = null;
    flatlistRef: any;


    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            user: null,
            messages: null,
            textareaValue: '',
            expoPushToken: null,
            notification: null,
            index: null,
            imageSelected: null,
            itemResponse: null
        }
    }

    componentDidMount = async () => {
        this.getUser();
    }

    getMessages = async () => {
        const {user} = this.state;
        const lastId = await AsyncStorage.getItem('lastIdReaded');
        try {
            firebase.database().ref("chats").on("value", async (snapshot) => {
                let lastIdItem: any;
                let messages: any = [];
                snapshot.forEach((snap) => {
                    const message = snap.val();
                    message['key'] = snap.key;
                    if (((message.to == user.id)) || ((message.uid == user.id))) {
                        messages.push(message);
                    }
                });
                this.setState({ messages });
                this.setSeeState();
                
                /* await firebase.database().ref().child("chats").orderByKey().limitToLast(1).once('value').then(async (ss: any) => { // Get last message
                    lastIdItem = ss.key;
                    console.log(ss)
                }); */
                
                // this.schedulePushNotification();
            });
        } catch (error) {
            console.log(error);
        }
    }

    setSeeState() {
        const {user} = this.state;
        const { messages } = this.state;
        var updates: any = {};
        const messagesFilter = messages.filter((m: any) => (m.to === user.id) && !m.visto);
        messagesFilter.forEach((message: any) => {
            if(message.key) {
                message['visto'] = true;
                updates['/chats/' + message.key] = message;
            }
        })
        firebase.database().ref().update(updates)
    }

    sendMessage = async () => {
        const { user, textareaValue, imageSelected, itemResponse } = this.state;
        if (textareaValue.trim() != '' || imageSelected) {
            await firebase.database().ref("chats").push({
                content: textareaValue,
                timestamp: Date.now(),
                uid: user.id,
                userName: user.name,
                imageSelected: imageSelected,
                itemResponse,
                to: supportId,
                visto: false
            });
            
            this.setState({ textareaValue: '', imageSelected: null, itemResponse: null });
            this.flatlistRef.current.scrollToEnd({animating: true});
        }
    }

    getUser = async () => {
        const userData = await AsyncStorage.getItem(authKey)
        const user = JSON.parse(userData!);
        this.setState({ user });
        this.getMessages();
    }

    bindTextarea = (e: any) => {
        this.setState({ textareaValue: e.nativeEvent.text })
    }



    renderItem = (item: any, index: number) => {
        const { user } = this.state;
        if (user) {
            return (
                <MessageSreen selectedItemResponse={(itemResponse: any) => this.setState({itemResponse})} item={item} user={user}></MessageSreen>
            )
        }
    }


    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true
        });
        if (!result.cancelled) {
            const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
            this.setState({ imageSelected: 'data:image/jpeg;base64,'+base64 });
        }
    };


    scrollToBottom = () => {
        this.flatlistRef.scrollToEnd({animating: true});
    }

    truncateString = (str: string, num: number) => {
        if (str.length > num) {
          return str.slice(0, num) + "...";
        } else {
          return str;
        }
    }


    render() {
        const { loading, user, messages, textareaValue, notification, itemResponse, imageSelected } = this.state;
        return (
            <KeyboardAwareScrollView
                scrollEnabled={false}
                style={{
                    display: "flex",
                    flex: 1,
                    width: width,
                }}
            >
                <Image style={{ width: '100%', height, resizeMode: 'cover', position: 'absolute' }} source={{ uri: 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }} />

                <View
                    style={{
                        height: height * (itemResponse ? 0.72 : 0.81),
                        width: width
                    }}
                >
                    {
                        messages ?
                            <View style={{height: '100%'}}>
                                <FlatList
                                    ref={ref=> {this.flatlistRef = ref}}
                                    data={messages}
                                    horizontal={false}
                                    onContentSizeChange={() => this.flatlistRef.scrollToEnd({animated: true})}
                                    style={{position: 'relative'}}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    // initialScrollIndex={messages.length - 1}
                                />
                                <View style={{position: 'absolute', right: 20, bottom: 30}}>
                                    <TouchableOpacity style={{height: 50, width: 50, borderRadius: 100, backgroundColor: 'white',
                                    justifyContent: 'center', alignItems: 'center'}} onPress={() => this.scrollToBottom()}>
                                        <FontAwesome name="angle-double-down" style={{fontSize: 15, color: Colors.default.primaryColor}}></FontAwesome>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View style={{ width, alignItems: 'center', justifyContent: 'center', height }}>
                                <Spinner></Spinner>
                            </View>
                    }
                </View>
                <View style={{height: height * (itemResponse ? 0.18 : 0.1), backgroundColor: "rgba(250,250,250,1)"}}>
                    {
                        itemResponse &&
                        <View style={{height: '60%'}}>
                            <View style={{width, paddingHorizontal: 10, paddingVertical: 5, borderWidth: .3, borderColor: '#ccc', borderRadius: 2}}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#000' }}>~ {itemResponse.userName}</Text>
                                    <TouchableOpacity onPress={() => this.setState({itemResponse: null})} style={{paddingHorizontal: 5, paddingVertical: 3, borderWidth: .3, borderColor: '#aaa', borderRadius: 1000}}>
                                        <FontAwesome name="close" style={{fontSize: 13, color: '#aaa'}}></FontAwesome>
                                    </TouchableOpacity>
                                </View>
                                {
                                    itemResponse.content !== '' ?
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>{this.truncateString(itemResponse.content, 30)}</Text>
                                    :
                                    itemResponse.imageSelected &&
                                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center',}}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>📷 Foto</Text>
                                        <Image style={{ width: 30, height: 30, resizeMode: 'cover', marginBottom: 10 }} source={{ uri: itemResponse.imageSelected }} />
                                    </View>
                                }
                            </View>
                        </View>
                    }
                    <View
                        style={{
                            height: itemResponse ? '40%' : '100%',
                            width,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            justifyContent: 'space-between'
                        }}
                    >
                        {imageSelected &&
                            <TouchableOpacity style={{}} onPress={() => this.pickImage()}>
                                <Image style={{ width: 40, height: 40, resizeMode: 'cover' }} source={{ uri: imageSelected }} />
                            </TouchableOpacity>
                        }
                        <Input
                            multiline={true}
                            status='basic'
                            value={textareaValue}
                            disabled={loading}
                            // onSubmitEditing={Keyboard.dismiss}
                            textStyle={{ minHeight: 20, maxHeight: 60, width: width * 0.55 }}
                            onChange={(value) => this.bindTextarea(value)}
                            placeholder=''
                        />
                        <View style={{flexDirection: 'row', width: width * (imageSelected? 0.1 : 0.27), justifyContent: 'flex-end'}}>
                            {
                                !imageSelected &&
                                <TouchableOpacity style={{
                                    height: 40, width: width * 0.12,
                                    justifyContent: 'center', alignItems: 'center', borderRadius: '100%', marginRight: 10
                                }}
                                    onPress={() => this.pickImage()}>
                                    <FontAwesome name="file" style={{ fontSize: 13, color: '#ccc' }}></FontAwesome>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={{
                                height: 40, width: width * 0.12, backgroundColor: Colors.default.primaryColor,
                                justifyContent: 'center', alignItems: 'center', borderRadius: '100%'
                            }}
                                onPress={() => this.sendMessage()}>
                                <FontAwesome name="paper-plane-o" style={{ fontSize: 15, color: '#fff' }}></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}
