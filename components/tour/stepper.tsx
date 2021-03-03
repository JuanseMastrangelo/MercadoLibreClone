import * as React from 'react';
import { Dimensions, View } from 'react-native';
import { HomeTour } from './homeTour';


const { width, height } = Dimensions.get('window');

export class Stepper extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return (
            <View style={{ width, height }}>
                {this.props.children}
                <HomeTour></HomeTour>
            </View>
        )
    }
}
  