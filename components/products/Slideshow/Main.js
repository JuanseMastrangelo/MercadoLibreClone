import { FontAwesome, Ionicons } from '@expo/vector-icons'
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Animated } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CarouselItem from './CarouselItem'

const { width, heigth } = Dimensions.get('window')


const CarouselSingleProduct = ({ data }) => {
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)
    const [dataList, setDataList] = useState(data)

    useEffect(()=> {
        setDataList(data)
    })


    if (data && data.length) {
        return (
            <View>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => 'key' + index}
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    snapToAlignment="center"
                    scrollEventThrottle={16}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <CarouselItem item={item} />
                    }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }]
                    )}
                />

                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: -30}}>
                    <View style={styles.dotView}>
                        {data.map((_, i) => {
                            let opacity = position.interpolate({
                                inputRange: [i - 1, i, i + 1],
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp'
                            })
                            let size = position.interpolate({
                                inputRange: [i - 1, i, i + 1],
                                outputRange: [8, 10, 8],
                                extrapolate: 'clamp'
                            });
                            return (
                                <Animated.View
                                    key={i}
                                    style={{ opacity, height: size, width: size, backgroundColor: '#777', marginHorizontal: 3, marginVertical: 8, borderRadius: 5 }}
                                />
                            )
                        })}

                    </View>
                    <View style={{flexDirection: 'row', marginRight: 20}}>
                        <TouchableOpacity style={{marginRight: 5, paddingHorizontal: 10}}>
                            <Ionicons size={20} name="md-download" color="#777"></Ionicons>
                        </TouchableOpacity>
                        <TouchableOpacity style={{paddingHorizontal: 10}}>
                        <FontAwesome size={20} name="heart-o" color="#777"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }

    console.log('No hay imagenes')
    return null
}

const styles = StyleSheet.create({
    dotView: { flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 10, alignItems: 'center', }
})

export default CarouselSingleProduct
