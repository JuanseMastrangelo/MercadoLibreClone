import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { Text, View } from 'react-native';

import { connect } from 'react-redux';

export class BottomCartIcon extends React.Component<any> {
    constructor(props: any) {
        super(props)
    }

    render() {
        const { color } = this.props;
        return (
            <View style={{height: '100%', justifyContent: 'center'}}>
                <FontAwesome name="shopping-cart" color={color} style={{position: 'relative', fontSize: 23}}></FontAwesome>
                {
                   this.props.state.cart && this.props.state.cart.items && (this.props.state.cart.items.length > 0) &&
                   (
                    <View style={{ backgroundColor: 'red', width: 20, height: 20, borderRadius: 10000, justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', top: 15, right: -13 }}>
                        <Text style={{ color: '#FFF' }}>{this.props.state.cart.items.length}</Text>
                    </View>
                   )
                }
            </View>
        )
    }
}

function mapStateToProps(state: any) {
    return {state}
  }
  
export default connect(mapStateToProps)(BottomCartIcon)
  