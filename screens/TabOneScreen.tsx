import { Button } from '@ui-kitten/components';
import { logOutAsync } from 'expo-google-app-auth';
import * as React from 'react';
import { AsyncStorage, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

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
        <Text style={styles.title}>Tab One</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/TabOneScreen.tsx" />
        <Button onPress={logOut}>Salir</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
