import { StatusBar } from 'expo-status-bar';
import React from 'react';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

// Ui Kitten
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </ApplicationProvider>
    );
  }
}
