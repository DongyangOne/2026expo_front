import React from 'react';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import { navigationRef } from '@/navigation/navigationRef';
import type { RootStackParamList } from '@/navigation/types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['expo2026://'],
  config: {
    screens: {
      QrLogin: {
        path: 'qr-login',
        parse: {
          qrToken: (qrToken: string): string => qrToken,
        },
      },
    },
  },
};

const App = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;