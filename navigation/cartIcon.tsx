import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { connect } from 'react-redux';

export class CartIcon extends React.Component<any> {
    render() {
        return (
            <TouchableOpacity style={{ marginRight: 10, alignSelf: 'center',height: '100%', marginBottom: 10 }}>
                <FontAwesome.Button name="shopping-bag" color="#000" style={{ backgroundColor: '#FFF', borderRadius: 0 }} size={18}></FontAwesome.Button>
                <View style={{ backgroundColor: 'red', width: 20, height: 20, borderRadius: 10000, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 20, right: 10 }}>
                    <Text style={{ color: '#FFF' }}>{this.props.state.products.length}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}



function mapStateToProps(state: any) {
    return {state}
  }
  
export default connect(mapStateToProps)(CartIcon)
  