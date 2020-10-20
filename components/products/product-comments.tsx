import { FontAwesome } from '@expo/vector-icons';
import { Divider, Layout, Tab, TabView } from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

export class ProductCommentsComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.props.navigation.setOptions({ title: 'Comentarios' });

        this.state = {
            selectedIndex: 0
        }
    }

    render() {
        const { selectedIndex } = this.state;
        return (
            <ScrollView style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
                <TabView
                    selectedIndex={selectedIndex}
                    // shouldLoadComponent={shouldLoadComponent}
                    onSelect={index => this.setState({ selectedIndex: index })}>
                    <Tab title='POSITIVAS (1)'>
                        <Layout>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 50, height: 50, borderRadius: 10000, marginRight: 10 }}
                                        source={{ uri: 'https://innostudio.de/fileuploader/images/default-avatar.png' }}></Image>
                                    <View>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>Juanse Mastrangelo</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>Excelente producto!</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                    <FontAwesome name="star" style={{ fontSize: 15, color: Colors.default.yellow }}></FontAwesome>
                                    <FontAwesome name="star" style={{ fontSize: 15, color: Colors.default.yellow }}></FontAwesome>
                                    <FontAwesome name="star" style={{ fontSize: 15, color: Colors.default.yellow }}></FontAwesome>
                                    <FontAwesome name="star" style={{ fontSize: 15, color: Colors.default.yellow }}></FontAwesome>
                                    <FontAwesome name="star" style={{ fontSize: 15, color: Colors.default.yellow }}></FontAwesome>
                                </View>
                            </View>
                            
                            <Divider/>
                        </Layout>
                    </Tab>
                    <Tab title='NEGATIVAS (0)'>
                        <Layout style={{ height: 64, alignItems: 'center', justifyContent: 'center' }}>
                            {/* <Text>2</Text> */}
                        </Layout>
                    </Tab>
                </TabView>
            </ScrollView>
        )
    }
}

