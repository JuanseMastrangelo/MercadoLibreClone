import React from 'react';
import CarouselItem from './CarouselItem';
const { width } = Dimensions.get('window');
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Dimensions, FlatList, Animated, Share } from 'react-native';



const CarouselSingleProduct = ({ data, id, favorite }) => {
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width);
    const [positionIndex, setPositionIndex] = React.useState(1)


    async function share() {
        const result = await Share.share({
          message: 'Market deep url compartida',
        });
        
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      }


    if (data && data.length) {
        return (
            <View>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => 'key' + index}
                    horizontal
                    style={{width}}
                    pagingEnabled
                    scrollEnabled
                    snapToAlignment="center"
                    scrollEventThrottle={16}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        return <CarouselItem item={item} />
                    }}
                    onScroll={(i) => {
                        setPositionIndex(Math.round((i.nativeEvent.contentOffset.x / width)) + 1);
                            Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: true }
                        )}
                    }
                />

                <View style={{position: 'absolute', top: 10, left: 0}}>
                    <Text style={{borderRadius: 100, backgroundColor: '#E8E8E8', paddingHorizontal: 20,
                    paddingVertical: 5, fontSize: 12}}>{positionIndex} / {data.length}</Text>
                </View>


                <View style={{position: 'absolute', bottom: -20, right: 0}}>
                        <TouchableOpacity style={{height: 50, width: 50, borderRadius: 100, backgroundColor: '#E8E8E8',
                        justifyContent: 'center', alignItems: 'center'}} onPress={() => share()}>
                            <FontAwesome name="share-alt" style={{fontSize: 20, color: '#222'}}></FontAwesome>
                        </TouchableOpacity>
                </View>

                {/* <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: -30}}>
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
                </View> */}

            </View>
        )
    }

    return null
}

const styles = StyleSheet.create({
    dotView: { flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 10, alignItems: 'center', }
})

export default CarouselSingleProduct
