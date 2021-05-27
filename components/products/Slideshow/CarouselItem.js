import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions, SafeAreaViewComponent } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';
import Colors from '../../../constants/Colors';
const { width, height } = Dimensions.get('window')


const colors = ['#FE512E', '#4139C8'];
var cardColorCount = 0;

export default class CarouselItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            imageLoading: false
        }
    }

    colorSelectCard() {
        if ((colors.length - 1) === cardColorCount) {
            cardColorCount = 0
        } else {
            cardColorCount++;
        }
        return colors[cardColorCount];
    }
    
    render() {
        const { item } = this.props;
        const { imageLoading } = this.state;
        const backgroundColor = this.colorSelectCard();

        const imageLoader = (start) => {
            this.setState({imageLoading: start})
        }
         
        return (
            <View style={styles.cardView}>
                <Image style={styles.image} resizeMode="contain" source={{uri: item.path}} onLoadStart={() => imageLoader(true)} onLoadEnd={() => imageLoader(false)} />
                {/* <View style={styles.textView}>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                </View>
                
                <View style={styles.btnGo}>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: 'white', marginRight: 10}}>Ver más</Text>
                        <Ionicons name="ios-arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                {
                    imageLoading &&
                    <View style={{position:'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}><Spinner></Spinner></View>
                } */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        flex: 1,
        width,
        backgroundColor: 'white',
        borderBottomColor: 'rgba(200,200,200,.1)',
        borderBottomWidth: 1
    },

    textView: {
        position: 'absolute',
        bottom: 10,
        margin: 10,
        left: 5,
    },
    image: {
        width,
        minHeight: height*0.3,
    },
    itemTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: "bold",
        elevation: 5
    },
    itemDescription: {
        color: 'white',
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 10,
        elevation: 5,
        backgroundColor: 'rgba(100, 100, 100,.5)',
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    btnGo: {
        backgroundColor: 'rgba(50, 50, 50, .5)',
        borderRadius: 1000,
        position: 'absolute',
        bottom: 20,
        right: 30,
        width: 100,
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    }
})
