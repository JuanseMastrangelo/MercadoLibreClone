import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/routers';
import { Button } from '@ui-kitten/components';
import { Text, View } from 'native-base';
import * as React from 'react';
import { Dimensions, Image } from 'react-native';
import Colors from '../../constants/Colors';
import { stepHome } from '../../constants/KeyConfig';

const { width, height } = Dimensions.get('window');

const steps = [
    {
        title: 'Hola 👋! \nSeré tu guía',
        text: 'Para facilitarte la navegación por nuestra aplicación, vamos a darte una introducción!',
        propsSelected: {display: 'none'},
        propsBubble: {
            marginTop: '50%',
        }
    },
    {
        title: 'Necesitas ayuda? 💬 \nDejanos ayudarte',
        text: 'Consulta con los vendedores disponibles las 24hs! Puedes elegir y proceder a una compra con ayuda de vendedores ordenados por reputación.',
        propsSelected: {
            top: 20,
            right: 5,
            width: 50,
            height: 50,
            borderRadius: 100,
            alignSelf: 'flex-end'
        },
        propsBubble: {
            marginTop: 100
        }
    },
    {
        title: '🔍 Búsqueda rápida',
        text: 'Busca tu producto por marca, modelo o descripción.',
        propsSelected: {
            top: 25,
            left: 5,
            width: 270,
            height: 50,
            borderRadius: 10
        },
        propsBubble: {
            marginTop: 100
        }
    },
    {
        title: 'Navegación \nrápida! 🚀',
        text: 'Navega por la aplicación mediante accesos directos.',
        propsSelected: {
            top: height*.93,
            left: 0,
            width: width,
            alignSelf: 'center',
            height: 40,
            borderRadius: 10
        },
        propsBubble: {
            marginTop: height*.55
        }
    },
    {
        title: 'Vayamos al grano ⏩',
        text: 'No pierdas tu tiempo! Acceso directo a marcas y modelos más vendidos.',
        propsSelected: {
            top: height*.38,
            left: 0,
            width: width*.9,
            alignSelf: 'center',
            height: 120,
            borderRadius: 10
        },
        propsBubble: {
            marginTop: height*.6
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

    async componentDidMount() {
        const tourAlready = await AsyncStorage.getItem(stepHome);
        /* if (tourAlready) {
            this.setState({ stepShow: -1 })
        } */

    }

    nextStep() {
        const { stepShow } = this.state;
        this.setState({ stepShow: stepShow + 1 })
    }

    async finishStep() {
        const a = await AsyncStorage.setItem(stepHome, 'true')
        this.setState({ stepShow: -1 })
    }


    render() {
        const { stepShow } = this.state;
        return (
                stepShow !== -1 &&
                    <View style={{ width, height, position: 'absolute', top: 0, left: 0 }}>
                        <View style={{ width, height, position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.8)' }}></View>

                        {
                            steps.map((step: any, i: number) =>
                                <View>
                                    {
                                        i === stepShow &&
                                        (
                                            <View style={{ width, position: 'relative' }}>
                                                <View style={[{
                                                    position: 'relative',
                                                    backgroundColor: 'rgba(29,161,242,.2)', marginBottom: 10
                                                }, step.propsSelected]}></View>
                                                {/* <View style={[{
                                                    position: 'absolute',
                                                    backgroundColor: 'rgba(200,200,200,.5)', marginBottom: 10
                                                }, step.props]}></View> */}
                                                <View style={[{
                                                    backgroundColor: '#F5DBC1', width: '90%', flexDirection: 'row',
                                                    borderRadius: 10, marginTop: height*.3, alignSelf: 'center', position: 'absolute'
                                                }, step.propsBubble]}>
                                                    <Image
                                                        resizeMode="cover"
                                                        style={{position: 'absolute', top: 0,left: 0, width: '100%', height: '100%', borderRadius: 10}}
                                                        source={require('../../assets/images/stepBackground.png')}
                                                        />
                                                    <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 15, position: 'relative' }}>
                                                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{i + 1} de {steps.length}</Text>
                                                        <Text style={{ color: '#FFF', fontSize: 30, fontWeight: 'bold', marginTop: 20 }}>
                                                            {step.title}
                                                        </Text>
                                                        <Text style={{ color: '#333', fontWeight: 'bold', marginVertical: 20 }}>
                                                            {step.text}
                                                        </Text>
                                                        {
                                                            step.imageUrl &&
                                                            <View style={{ justifyContent: 'center' }}>
                                                                <Image resizeMode="cover" style={{ height: 200 }}
                                                                    source={{ uri: step.imageUrl }}></Image>
                                                            </View>
                                                        }
                                                        <View style={{width: '100%', alignItems: 'flex-end'}}>
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


