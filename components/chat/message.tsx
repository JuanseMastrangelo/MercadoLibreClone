
import { FontAwesome } from '@expo/vector-icons';
import { ActionSheet, Text, Thumbnail, View } from 'native-base';
import * as React from 'react';
import { Image, Linking } from 'react-native';
import Autolink from 'react-native-autolink';
import { TouchableOpacity } from 'react-native-gesture-handler';

var BUTTONS = ["Responder", "Eliminar", "Cancelar"];
var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 2;

export default class MessageSreen extends React.Component<any, any> {


    constructor(props: any) {
        super(props)
        this.state = {
            urlMetadata: null,
        }
    }

    componentDidMount() {
        const { item } = this.props;
        this.verifyLinkOnText(item.content);
    }

    verifyLinkOnText(text: string) {
        text = text.toLocaleLowerCase();
        let startLink = -1;
        if (text.search('https://') !== -1) {
            startLink = text.search('https://');
        } else if (text.search('http://') !== -1) {
            startLink = text.search('http://');
        }

        if (startLink !== -1) {
            let link = text;
            if (text.indexOf(' ') !== -1) {
                const prevText = text.slice(startLink, text.length);
                const finishLink = prevText.search(' ');
                link = prevText.slice(0, finishLink);
            }
            
            if (link.indexOf('https://www.youtube.com/watch') !== -1) { // Si es un video de yt
                fetch('https://www.youtube.com/oembed?format=json&url=' + link, {
                    headers: { 'origin': 'x-requested-with' }
                }).then(res => {
                    return res.json();
                }).then(metadata => {
                    const urlMetadata = {
                        url: link,
                        image: metadata.thumbnail_url,
                        site_name: metadata.title
                    };
                    this.setState({urlMetadata})
                })
            } else {
                fetch('https://cors-anywhere.herokuapp.com/https://laravelopengraph.herokuapp.com/api/fetch?url=' + link, {
                    headers: { 'origin': 'x-requested-with' }
                }).then(res => {
                    return res.json();
                }).then(urlMetadata => {
                    this.setState({urlMetadata})
                })
            }
        } else {
            this.setState({urlMetadata: null});
        }
    }


    renderMetadata = () => {
        const { urlMetadata } = this.state;
        return (
            
            <View style={{flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 10}}>
                <View style={{alignItems: 'center', width: '100%', flexDirection: 'row'}}>
                    <Thumbnail style={{width: 30, height: 30}} source={{uri: urlMetadata.image}} />
                    <View style={{justifyContent: 'flex-start', marginLeft: 10}}>
                        <Text style={{fontFamily: 'Poppins-Medium', fontSize: 12}}>{urlMetadata.site_name}</Text>
                        <Text style={{fontFamily: 'Poppins-Light', fontSize: 12}} onPress={() => Linking.openURL(urlMetadata.url)}>
                            {urlMetadata.url}
                        </Text>
                    </View>
                </View>
            </View>
            
        )
    }

    onLongPressMessage = (item: any) => {
        /* ActionSheet.show(
            {
              options: BUTTONS,
              cancelButtonIndex: CANCEL_INDEX,
              destructiveButtonIndex: DESTRUCTIVE_INDEX,
            },
            buttonIndex => {
                if (buttonIndex == 0) {
                    this.props.selectedItemResponse(item);
                }
            }
          ) */
    }

    truncateString = (str: string, num: number) => {
        if (str.length > num) {
          return str.slice(0, num) + "...";
        } else {
          return str;
        }
    }

    render() {
        const { urlMetadata } = this.state;
        const { user, item } = this.props;
        
        if (user.id === item.uid) { // Mensaje del usuario
            return (
                <TouchableOpacity onPress={() => this.onLongPressMessage(item)} 
                style={{ padding: 10, marginHorizontal: 10, backgroundColor: '#DCF8C5', alignSelf: 'flex-end', borderRadius: 10, marginVertical: 5,
                width: (item.imageSelected ? 'auto': null), height: (item.imageSelected ? 'auto': null)}}>
                    {
                        item.imageSelected &&
                        <View style={{alignItems: 'center'}}>
                            <Image style={{ width: 200, height: 200, resizeMode: 'cover', marginBottom: 10 }} source={{ uri: item.imageSelected }} />
                        </View>
                    }
                    {
                        item.itemResponse ?
                        <View style={{ backgroundColor: '#D4E5BB', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginBottom: 10, borderLeftWidth: 4, borderColor: '#A4AE69'}}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#A4AE69' }}>~{item.itemResponse.userName}</Text>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: '#A4AE69', marginLeft: 20 }}>{new Date(item.itemResponse.timestamp).toLocaleTimeString()}</Text>
                            </View>
                            {
                                item.itemResponse.content !== '' ?
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>{this.truncateString(item.itemResponse.content, 30)}</Text>
                                :
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>📷 Foto</Text>
                                    {<Image style={{ width: 30, height: 30, resizeMode: 'cover', marginBottom: 10 }} source={{ uri: item.itemResponse.imageSelected }} />}
                                </View>
                            }
                        </View>
                        : null
                    }
                    <Autolink
                        text={item.content} truncate={0}
                    />
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        {
                            item.visto ?
                            <FontAwesome name="eye" style={{fontSize: 13, color: '#aaa' }}></FontAwesome>
                            :
                            <FontAwesome name="check" style={{fontSize: 13, color: '#aaa' }}></FontAwesome>
                        }
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: '#666', marginLeft: 20 }}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity onPress={() => this.onLongPressMessage(item)} 
                style={{ marginHorizontal: 10, alignSelf: 'flex-start', marginVertical: 5, padding: 10, backgroundColor: '#fff', borderRadius: 10,
                 width: (item.imageSelected ? 'auto': null), height: (item.imageSelected ? 'auto': null) }}>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#444' }}>~{item.userName}</Text>
                    </View>
                    {
                        item.imageSelected &&
                        <View style={{alignItems: 'center'}}>
                            <Image style={{ width: 200, height: 200, resizeMode: 'cover', marginBottom: 10 }} source={{ uri: item.imageSelected }} />
                        </View>
                    }
                    {
                        item.itemResponse ?
                        <View style={{ backgroundColor: '#ddd', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginBottom: 10, borderLeftWidth: 4, borderColor: '#43988B'}}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#43988B' }}>~{item.itemResponse.userName}</Text>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: '#43988B', marginLeft: 20 }}>{new Date(item.itemResponse.timestamp).toLocaleTimeString()}</Text>
                            </View>
                            {
                                item.itemResponse.content !== '' ?
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>{this.truncateString(item.itemResponse.content, 30)}</Text>
                                :
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>📷 Foto</Text>
                                    {<Image style={{ width: 30, height: 30, resizeMode: 'cover', marginBottom: 10 }} source={{ uri: item.itemResponse.imageSelected }} />}
                                </View>
                            }
                        </View>
                        : null
                    }
                    <Autolink
                        text={item.content}
                    />
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 10, color: '#666', marginLeft: 20 }}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                    </View>
                    {/* {
                        !item.imageSelected && urlMetadata &&
                        this.renderMetadata()
                    } */}
                </TouchableOpacity>
            )
        }
    }

}