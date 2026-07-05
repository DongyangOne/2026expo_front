import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const SearchScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <WebView source={{ uri: 'https://xn--oy2b29bd3a601b.kr//' }} className="flex-1"></WebView>
    </SafeAreaView>
  );
};

export default SearchScreen;
