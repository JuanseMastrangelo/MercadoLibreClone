import { Button } from '@ui-kitten/components';
import { Text, View } from 'native-base';
import * as React from 'react';
import { Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const steps = [
    {
        text: 'Necesitas ayuda? Contacta a soporte.',
        props: {
            top: 20,
            right: 5,
            width: 50,
            height: 50,
            borderRadius: 100
        }
    },
    {
        text: 'Buscador de productos.',
        props: {
            top: 25,
            left: 5,
            width: 270,
            height: 40,
            borderRadius: 10
        }
    }
]


export class HomeTour extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            stepShow: 0
        }
    }


    nextStep() {
        const { stepShow } = this.state;
        this.setState({ stepShow: stepShow + 1 })
    }

    finishStep() {
        this.setState({ stepShow: -1 })
    }


    render() {
        const { stepShow } = this.state;
        return (
                stepShow !== -1 &&
                    <View style={{ width, height, position: 'absolute', top: 0, left: 0 }}>
                        <View style={{ width, height, position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.6)' }}></View>
                        {
                            steps.map((step: any, i: number) =>
                                <View>
                                    {
                                        i === stepShow &&
                                        (
                                            <View style={{ width, position: 'relative' }}>
                                                <View style={[{
                                                    position: 'absolute',
                                                    backgroundColor: 'rgba(200,200,200,.3)', marginBottom: 10
                                                }, step.props]}></View>
                                                <View style={{
                                                    backgroundColor: '#F5DBC1', width: '90%', flexDirection: 'row',
                                                    borderRadius: 10, marginTop: 80, alignSelf: 'center'
                                                }}>
                                                    {/* <View style={{ width: '30%', position: 'absolute', bottom: 0, right: 0 }}>
                                                <Image resizeMode="cover" style={{ height: 200 }}
                                                    source={{ uri: 'https://www.pngkey.com/png/full/893-8934510_hiking-guide-is-a-good-idea-illustration.png' }}></Image>
                                            </View> */}
                                                    <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 15, position: 'relative' }}>
                                                        <Text style={{ color: '#D4985E', fontWeight: 'bold' }}>Tip: {i + 1}/{steps.length}</Text>
                                                        <Text style={{ color: '#000', fontWeight: 'bold', marginVertical: 10 }}>
                                                            {step.text}
                                                        </Text>
                                                        {
                                                            (i + 1) !== steps.length ?
                                                                <Button size="small" style={{ width: 150 }} status="basic" onPress={() => this.nextStep()}>
                                                                    Siguiente
                                                    </Button>
                                                                :
                                                                <Button size="small" style={{ width: 150 }} status="basic" onPress={() => this.finishStep()}>
                                                                    Finalizar
                                                    </Button>
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }
                                </View>
                            )
                        }
                    </View>
        )
    }
}


