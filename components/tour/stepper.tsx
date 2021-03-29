import * as React from 'react';
import { Dimensions, View } from 'react-native';
import { HomeTour } from './homeTour';


const { width, height } = Dimensions.get('window');

import { connect } from 'react-redux';


class Stepper extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const { showHomeStep } = this.props.state.steps;
        return (
            <View style={{ width, height }}>
                {this.props.children}
                {
                    showHomeStep &&
                    <HomeTour></HomeTour>
                }
            </View>
        )
    }
}
  
function mapStateToProps(state: any) {
    return { state }
}
export default connect(mapStateToProps, null)(Stepper)