import { StatusBar } from 'expo-status-bar';
import React from 'react';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

// Ui Kitten
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Redux
import { Provider } from 'react-redux';
import { reducers } from './utils/reducers';
import cartReducer from './utils/reducers/cart';
import { createStore } from 'redux';
import { useFonts } from 'expo-font';
const store = createStore(cartReducer);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  
  let [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Potra': require('./assets/fonts/Potra.ttf'),
    'Elena': require('./assets/fonts/Elena.otf'),
  });

  console.disableYellowBox = true;


  if (!isLoadingComplete || !fontsLoaded) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar style="inverted" />
          </SafeAreaProvider>
        </ApplicationProvider>
      </Provider>
    );
  }
}
