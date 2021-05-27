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

        const imageLoader = (start) => {
            this.setState({imageLoading: start})
        }
         
        return (
            <Image style={styles.image} resizeMode="contain" source={{uri: item.path}} onLoadStart={() => imageLoader(true)} onLoadEnd={() => imageLoader(false)} />
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width,
        minHeight: height*0.3,
    },
})
