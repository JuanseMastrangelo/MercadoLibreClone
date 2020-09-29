import { Button } from '@ui-kitten/components';
import { logOutAsync } from 'expo-google-app-auth';
import * as React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';

import { authKey } from '../constants/KeyConfig';


export default class TabOneScreen extends React.Component<any, any> { 
  
  constructor(props: any) {
    super(props)
  }

  render() {
    const logOut = async () => {
      await AsyncStorage.removeItem(authKey);
      this.props.navigation.navigate('LoginScreen');
      this.props.navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }], });
    }


    return (
      <View style={styles.container}>
      </View>
    );
  }
}
